import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("token");
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth/");

  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && !hasToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
