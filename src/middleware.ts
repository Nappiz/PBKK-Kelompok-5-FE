import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const session = req.cookies.get("lw_session")?.value; // base64 json

  if (url.pathname.startsWith("/dashboard")) {
    if (!session) {
      const to = new URL("/register", req.url);
      return NextResponse.redirect(to);
    }
  }

  if (session && (url.pathname === "/login" || url.pathname === "/register")) {
    const to = new URL("/dashboard", req.url);
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
