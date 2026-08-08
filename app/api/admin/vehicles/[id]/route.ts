import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { vehiclePatchSchema } from "@/lib/validations/vehicle";

const vehicleAdminPatchSchema = vehiclePatchSchema.extend({
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().min(0).optional()
  })).optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await request.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });

  const parsed = vehicleAdminPatchSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { images, ...data } = parsed.data;
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      ...data,
      ...(images
        ? {
            images: {
              deleteMany: {},
              create: images.map((image, index) => ({
                url: image.url,
                alt: image.alt || `${data.brand || "Vehiculo"} ${data.model || ""}`.trim(),
                position: image.position ?? index
              }))
            }
          }
        : {})
    },
    include: { images: { orderBy: { position: "asc" } } }
  });
  return NextResponse.json({ vehicle });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
