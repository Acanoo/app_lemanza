import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehiclePatchSchema } from "@/lib/validations/vehicle";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json();
  const parsed = vehiclePatchSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const vehicle = await prisma.vehicle.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ vehicle });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
