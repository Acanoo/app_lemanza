import { NextResponse } from "next/server";
import { z } from "zod";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const userPatchSchema = z.object({
  role: z.nativeEnum(RoleName).optional(),
  name: z.string().min(2).optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

  const parsed = userPatchSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data: { name?: string; roleId?: string } = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.role) {
    const role = await prisma.role.upsert({
      where: { name: parsed.data.role },
      update: {},
      create: { name: parsed.data.role }
    });
    data.roleId = role.id;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    include: { role: true }
  });
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminUsers = await prisma.user.count({
    where: { role: { name: "ADMIN" } }
  });
  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true }
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.role.name === "ADMIN" && adminUsers <= 1) {
    return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 409 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
