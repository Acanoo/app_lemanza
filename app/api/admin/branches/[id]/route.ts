import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicles = await prisma.vehicle.count({ where: { branchId: id } });
  if (vehicles > 0) return NextResponse.json({ error: "No se puede eliminar una sucursal con vehículos asignados" }, { status: 409 });
  await prisma.branch.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
