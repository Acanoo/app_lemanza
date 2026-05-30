import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const protectedPath = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin");
  if (!protectedPath) return NextResponse.next();

  const header = request.headers.get("authorization");
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return new NextResponse("Admin credentials are not configured", { status: 503 });
  }

  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.replace("Basic ", ""));
      const separatorIndex = decoded.indexOf(":");
      const email = decoded.slice(0, separatorIndex);
      const password = decoded.slice(separatorIndex + 1);
      if (separatorIndex > -1 && email === expectedEmail && password === expectedPassword) return NextResponse.next();
    } catch {
      // Fall through to the auth challenge below.
    }
  }

  return new NextResponse("Admin protegido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Lemanza Admin"' }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
