import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehicleSchema } from "@/lib/validations/vehicle";
import { z } from "zod";

const manualVehicleSchema = vehicleSchema.extend({
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().min(0).optional()
  })).default([])
});

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

  const parsed = manualVehicleSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { images, ...data } = parsed.data;
  const vehicle = await prisma.vehicle.create({
    data: {
      ...data,
      spec: {
        create: {
          marketSource: "Manual",
          raw: { createdFrom: "admin" }
        }
      },
      images: {
        create: images.map((image, index) => ({
          url: image.url,
          alt: image.alt || `${data.brand} ${data.model} ${data.year}`,
          position: image.position ?? index
        }))
      }
    },
    include: { images: true, branch: true, spec: true }
  });
  return NextResponse.json({ vehicle }, { status: 201 });
}
