import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  priceGtq: z.number(),
  downPayment: z.number(),
  annualRate: z.number(),
  termMonths: z.number(),
  monthlyFee: z.number(),
  vehicleId: z.string().optional()
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const simulation = await prisma.financingSimulation.create({ data: parsed.data });
    return NextResponse.json({ simulation });
  } catch {
    return NextResponse.json({ error: "Could not save simulation" }, { status: 500 });
  }
}
