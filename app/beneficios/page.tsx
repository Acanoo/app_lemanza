import type { LucideIcon } from "lucide-react";
import { BadgeCheck, CalendarClock, Car, Handshake, ShieldCheck, Tags } from "lucide-react";

export const metadata = { title: "Beneficios" };

const benefits: [string, LucideIcon][] = [
  ["Vehículos inspeccionados", ShieldCheck],
  ["Usados exclusivamente de agencia", Car],
  ["Horarios cómodos", CalendarClock],
  ["Atención fines de semana y días festivos", BadgeCheck],
  ["Asesoramiento personalizado", Handshake],
  ["Más de 25 marcas disponibles", Tags]
];

export default function BenefitsPage() {
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
