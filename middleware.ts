import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /login)
  const { pathname } = request.nextUrl;

  // Get the token from cookies
  const token = request.cookies.get("psm_token")?.value;

  // Check if user is trying to access login or register pages while already logged in
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if the user is trying to access the admin route
  if (pathname.startsWith("/admin")) {
    console.log("Admin route detected");
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If token exists, let the client-side handle the role check
    // The admin page component will redirect non-admin users to "/"
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
