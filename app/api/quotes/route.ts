import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validations/quote";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = quoteSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const quote = await prisma.quoteRequest.create({ data: parsed.data });
    if (process.env.SMTP_HOST && process.env.QUOTE_NOTIFICATION_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      });
      await transporter.sendMail({
        to: process.env.QUOTE_NOTIFICATION_EMAIL,
        from: process.env.SMTP_USER || "no-reply@lemanzamotores.gt",
        subject: "Nueva cotización Lemanza Motores",
        text: `Nueva cotización de ${quote.firstName} ${quote.lastName}. Tel: ${quote.phone}. Email: ${quote.email}`
      });
    }
    return NextResponse.json({ quote });
  } catch {
    return NextResponse.json({ error: "Could not save quote" }, { status: 500 });
  }
}
