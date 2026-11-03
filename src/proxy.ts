import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(
    "x-site-locale",
    request.nextUrl.pathname.split("/")[1] === "en" ? "en" : "sk",
  );
  return NextResponse.next({ request: { headers } });
}
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
