/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserJwtPayload, UserRole } from "@/types";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

/* --------------------------------- CONFIG -------------------------------- */

const DASHBOARDS: Record<any, string> = {
  patient: "/patient/dashboard",
  admin: "/admin/dashboard",
  clinic: "/clinic/dashboard",
  doctor: "/doctor/dashboard",
};

const PROTECTED_ROUTES = [
  "/patient/",
  "/admin/",
  "/clinic/",
  "/doctor/",
  "/checkout",
];

/* --------------------------------- HELPERS -------------------------------- */

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

const isDashboardRoute = (pathname: string) =>
  Object.values(DASHBOARDS).some((path) => pathname.startsWith(path));

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
  console.log(token);
  /* 🔓 Public routes */
  if (!token && !isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  /* 🔐 Decode token safely */
  let user: UserJwtPayload;

  try {
    user = jwtDecode<UserJwtPayload>(token!);
  } catch {
    return redirectToLogin(req, pathname);
  }

  const userRole = user.role.toLowerCase() as UserRole;
  console.log(userRole);
  const userDashboard = DASHBOARDS[userRole];

  /* 🚫 Auth pages (logged-in users should not access) */
  if (pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL(userDashboard, req.url));
  }

  /* 🚫 Protected routes without token */
  if (isProtectedRoute(pathname) && !token) {
    return redirectToLogin(req, pathname);
  }

  /* 🚫 Prevent accessing other dashboards */
  if (isDashboardRoute(pathname) && !pathname.startsWith(userDashboard)) {
    return NextResponse.redirect(new URL(userDashboard, req.url));
  }

  /* 🚫 Role-based access protection */
  if (!pathname.startsWith(`/${userRole.toLowerCase()}`)) {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL(userDashboard, req.url));
    }
  }

  return NextResponse.next();
}

/* -------------------------------- REDIRECTS ------------------------------- */

const redirectToLogin = (req: NextRequest, pathname: string) => {
  const signInUrl = new URL("/auth/sign-in", req.url);
  signInUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signInUrl);
};

/* --------------------------------- MATCHER -------------------------------- */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
