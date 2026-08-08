import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettings, upsertSiteSettings } from "@/lib/site-settings";

const settingsSchema = z.object({
  heroTitle: z.string().min(3),
  heroSubtitle: z.string().min(3),
  financingEyebrow: z.string().min(2),
  financingTitle: z.string().min(3),
  financingCopy: z.string().min(3),
  benefits: z.array(z.string().min(2)).min(1),
  ctaTitle: z.string().min(3),
  ctaCopy: z.string().min(3),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(6),
  whatsappMessage: z.string().min(3),
  aboutIntro: z.string().min(10),
  mission: z.string().min(10),
  vision: z.string().min(10),
  values: z.array(z.string().min(2)).min(1)
});

export async function GET() {
  return NextResponse.json({ settings: await getSiteSettings() });
}

export async function PUT(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const setting = await upsertSiteSettings(parsed.data);
  return NextResponse.json({ setting });
}
