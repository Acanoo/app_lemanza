import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations/quote";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = newsletterSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { name: parsed.data.name, status: "ACTIVE" },
      create: parsed.data
    });
    return NextResponse.json({ subscriber });
  } catch {
    return NextResponse.json({ error: "Could not save subscriber" }, { status: 500 });
  }
}
