import type { LucideIcon } from "lucide-react";
import { Banknote, CalendarPlus, Headphones, Landmark, ShieldCheck, WalletCards } from "lucide-react";

export const metadata = { title: "Servicios" };

const services: [string, LucideIcon][] = [
  ["Respaldo de agencia", ShieldCheck],
  ["Financiamiento bancario", Landmark],
  ["0% de enganche en vehículos seleccionados", WalletCards],
  ["Hasta 60 meses", Banknote],
  ["Agenda de cita", CalendarPlus],
  ["Contacto por PBX y WhatsApp", Headphones]
];

export default function ServicesPage() {
  return (
    <div className="bg-secondary/60">
      <div className="container-page section">
        <p className="font-bold text-accent">Servicios</p>
        <h1 className="mt-2 text-4xl font-black">Acompañamiento completo para comprar tu vehículo</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([label, Icon]) => (
            <div key={String(label)} className="rounded-lg bg-white p-6 shadow-soft">
              <Icon className="text-accent" />
              <h2 className="mt-4 text-xl font-black">{label}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
