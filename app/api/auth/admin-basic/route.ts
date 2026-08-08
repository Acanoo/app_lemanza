import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    const decoded = Buffer.from(header.replace("Basic ", ""), "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");
    const email = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    if (separatorIndex < 0 || !email || !password) return NextResponse.json({ ok: false }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
