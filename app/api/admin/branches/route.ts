import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const branchSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  address: z.string().min(5),
  phone: z.string().min(6),
  mapsUrl: z.string().url(),
  wazeUrl: z.string().url()
});

export async function GET() {
  const branches = await prisma.branch.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ branches });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = branchSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id, ...data } = parsed.data;
  const branch = id
    ? await prisma.branch.update({ where: { id }, data })
    : await prisma.branch.create({ data });
  return NextResponse.json({ branch }, { status: id ? 200 : 201 });
}
