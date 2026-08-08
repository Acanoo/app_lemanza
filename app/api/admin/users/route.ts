import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(RoleName)
});

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { role: true }
  });
  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

  const parsed = userSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const role = await prisma.role.upsert({
    where: { name: parsed.data.role },
    update: {},
    create: { name: parsed.data.role }
  });

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      roleId: role.id
    },
    include: { role: true }
  });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  }, { status: 201 });
}
