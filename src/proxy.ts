/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

// Vercel Edge Runtime-এ লাইব্রেরি ছাড়া ডিকোড করা নিরাপদ
function decodeToken(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/* --------------------------------- CONFIG -------------------------------- */

const DASHBOARDS: Record<string, string> = {
  patient: "/patient/dashboard",
  admin: "/admin/dashboard",
  clinic: "/clinic/dashboard",
  doctor: "/doctor/dashboard",
};

const PROTECTED_ROUTES = [
  "/patient",
  "/admin",
  "/clinic",
  "/doctor",
  "/checkout",
];

/* --------------------------------- HELPERS -------------------------------- */

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

const getTokenFromRequest = (req: NextRequest): string | null => {
  const cookieToken = req.cookies.get("refreshToken")?.value;
  const authHeader = req.headers.get("Authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  return cookieToken || headerToken || null;
};

/* ---------------------------------- PROXY --------------------------------- */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = getTokenFromRequest(req);

  // ১. টোকেন নেই এবং সুরক্ষিত রুট নয় - যেতে দিন
  if (!token && !isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // ২. টোকেন নেই কিন্তু সুরক্ষিত রুট - লগইন এ পাঠান
  if (!token && isProtectedRoute(pathname)) {
    return redirectToLogin(req, pathname);
  }

  /* 🔐 Decode token safely (No library dependency) */
  const user = token ? decodeToken(token) : null;

  if (!user || !user.role) {
    if (isProtectedRoute(pathname)) {
      return redirectToLogin(req, pathname);
    }
    return NextResponse.next();
  }

  const userRole = user.role.toLowerCase(); // 'admin', 'patient' etc
  const userDashboard = DASHBOARDS[userRole] || "/";

  /* 🚫 Auth pages: লগইন করা থাকলে সাইন-ইন পেজে যেতে দিবে না */
  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL(userDashboard, req.url));
  }

  /* 🚫 Role-based access: ভুল ড্যাশবোর্ডে প্রবেশের চেষ্টা করলে নিজস্ব ড্যাশবোর্ডে রিডাইরেক্ট */
  const isAccessingOtherRoleFolder =
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith(`/${userRole}`) &&
    pathname !== "/checkout";

  if (isAccessingOtherRoleFolder) {
    return NextResponse.redirect(new URL(userDashboard, req.url));
  }

  return NextResponse.next();
}

/* -------------------------------- REDIRECTS ------------------------------- */

const redirectToLogin = (req: NextRequest, pathname: string) => {
  const signInUrl = new URL("/login", req.url);
  // লুপ এড়াতে চেক করুন আপনি অলরেডি সাইন-ইন পেজে আছেন কি না
  if (pathname === "/login") return NextResponse.next();
  signInUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signInUrl);
};

/* --------------------------------- MATCHER -------------------------------- */

export const config = {
  matcher: [
    "/admin/:path*",
    "/patient/:path*",
    "/clinic/:path*",
    "/doctor/:path*",
    "/auth/:path*",
    "/checkout/:path*",
  ],
};
