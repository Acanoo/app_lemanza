import { NextRequest, NextResponse } from "next/server";

async function hasDatabaseAdminAccess(request: NextRequest, header: string) {
  try {
    const response = await fetch(new URL("/api/auth/admin-basic", request.nextUrl.origin), {
      method: "POST",
      headers: { authorization: header },
      cache: "no-store"
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/admin/sync-superautosjack") return NextResponse.next();

  const protectedPath = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin");
  if (!protectedPath) return NextResponse.next();

  const header = request.headers.get("authorization");
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.replace("Basic ", ""));
      const separatorIndex = decoded.indexOf(":");
      const email = decoded.slice(0, separatorIndex);
      const password = decoded.slice(separatorIndex + 1);
      if (separatorIndex > -1 && expectedEmail && expectedPassword && email === expectedEmail && password === expectedPassword) return NextResponse.next();
      if (await hasDatabaseAdminAccess(request, header)) return NextResponse.next();
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
