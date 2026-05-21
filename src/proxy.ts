/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

/* -------------------------------- TOKEN DECODE ------------------------------- */

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
  } catch {
    return null;
  }
}

/* -------------------------------- CONFIG -------------------------------- */

const DASHBOARDS: Record<string, string> = {
  patient: "/patient/dashboard",

  admin: "/admin/dashboard",

  clinic: "/clinic/dashboard",

  doctor: "/doctor/dashboard",

  manager: "/area_manager/dashboard",
  staff: "/staff/dashboard",

  dmanager: "/diagnostic_manager/dashboard",
};

const PROTECTED_ROUTES = [
  "/patient",

  "/admin",

  "/clinic",

  "/doctor",

  "/area_manager",
  "/staff",

  "/diagnostic_manager",

  "/checkout",
];

/* -------------------------------- HELPERS -------------------------------- */

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

const getTokenFromRequest = (req: NextRequest): string | null => {
  // ১. সরাসরি কুকি থেকে চেক করা
  const cookieToken = req.cookies.get("refreshToken")?.value;

  if (cookieToken) return cookieToken;

  // ২. হেডার থেকে চেক করা (যদি ক্লায়েন্ট সাইড থেকে ম্যানুয়ালি পাঠানো হয়)
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};
/* -------------------------------- REDIRECT LOGIN -------------------------------- */

const redirectToLogin = (req: NextRequest, pathname: string) => {
  // avoid infinite loop
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const signInUrl = new URL("/login", req.url);

  // preserve full path + query
  const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;

  signInUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(signInUrl);
};

/* -------------------------------- MIDDLEWARE -------------------------------- */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = getTokenFromRequest(req);
  // কনসোলে চেক করুন কুকি আসছে কি না
  console.log("All Cookies:", req.cookies.getAll());

  console.log("Extracted Token:", token);
  // public route
  if (!token && !isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // protected route without token
  if (!token && isProtectedRoute(pathname)) {
    return redirectToLogin(req, pathname);
  }

  // decode user
  const user = token ? decodeToken(token) : null;

  // invalid token
  if (!user || !user.role) {
    if (isProtectedRoute(pathname)) {
      return redirectToLogin(req, pathname);
    }

    return NextResponse.next();
  }

  const userRole = user.role.toLowerCase();

  const userDashboard = DASHBOARDS[userRole] || "/";

  // logged-in user can't access login/register
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");

    return NextResponse.redirect(
      new URL(callbackUrl || userDashboard, req.url),
    );
  }

  // role protection
  const isAccessingOtherRoleFolder =
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith(`/${userRole}`) &&
    pathname !== "/checkout";

  if (isAccessingOtherRoleFolder) {
    return NextResponse.redirect(new URL(userDashboard, req.url));
  }

  return NextResponse.next();
}

/* -------------------------------- MATCHER -------------------------------- */

export const config = {
  matcher: [
    "/admin/:path*",

    "/patient/:path*",

    "/clinic/:path*",

    "/doctor/:path*",

    "/login",

    "/register",

    "/d-manager/:path*",
    "/area_manager/:path*",

    "/staff/:path*",

    "/checkout/:path*",
  ],
};
