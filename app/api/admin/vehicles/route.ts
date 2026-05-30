import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validations/vehicle";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    include: { images: true, branch: true },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json({ vehicles });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

  const parsed = vehicleSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const vehicle = await prisma.vehicle.create({ data: parsed.data });
  return NextResponse.json({ vehicle }, { status: 201 });
}
