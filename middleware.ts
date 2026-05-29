import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const protectedPath = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin");
  if (!protectedPath) return NextResponse.next();

  const header = request.headers.get("authorization");
  const expectedEmail = process.env.ADMIN_EMAIL || "admin@lemanzamotores.gt";
  const expectedPassword = process.env.ADMIN_PASSWORD || "CambiarEstaClave123";

  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.replace("Basic ", ""));
    const [email, password] = decoded.split(":");
    if (email === expectedEmail && password === expectedPassword) return NextResponse.next();
  }

  return new NextResponse("Admin protegido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Lemanza Admin"' }
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
