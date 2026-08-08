import type { LucideIcon } from "lucide-react";
import { BadgeCheck, CalendarClock, Car, Handshake, ShieldCheck, Tags } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = { title: "Beneficios" };
export const dynamic = "force-dynamic";

const icons = [ShieldCheck, Car, CalendarClock, BadgeCheck, Handshake, Tags];

export default async function BenefitsPage() {
  const settings = await getSiteSettings();
  const benefits: [string, LucideIcon][] = settings.benefits.map((label, index) => [label, icons[index % icons.length]]);

  return (
    <div className="container-page section">
      <p className="font-bold text-accent">Compra con confianza</p>
      <h1 className="mt-2 text-4xl font-black">Beneficios Lemanza</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map(([label, Icon]) => (
          <div key={String(label)} className="rounded-lg border bg-white p-6 shadow-soft">
            <Icon className="text-accent" />
            <h2 className="mt-4 text-xl font-black">{label}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
