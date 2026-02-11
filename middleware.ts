import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") || "";
  const pathname = request.nextUrl.pathname;

  // Only apply to post routes (not /api/*, /topics/*, /_next/*, etc.)
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/topics/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/img/") ||
    pathname === "/" ||
    pathname === "/docs"
  ) {
    return NextResponse.next();
  }

  // Accept: text/markdown → rewrite to raw API
  if (accept.includes("text/markdown") || accept.includes("text/plain")) {
    // Match /YYYY/MM/DD/slug pattern
    const match = pathname.match(
      /^\/\d{4}\/\d{2}\/\d{2}\/(.+)$/,
    );
    if (match) {
      const slug = match[1];
      return NextResponse.rewrite(
        new URL(`/api/raw/${slug}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|img/).*)",
  ],
};
