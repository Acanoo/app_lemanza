import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Car, FileText, Key, Receipt, Search, ShieldCheck, Truck, Wrench } from "lucide-react";

export const metadata = { title: "Servicios" };

const services: { label: string; Icon: LucideIcon }[] = [
  { label: "Verificación de historial", Icon: Search },
  { label: "Transporte terrestre interno", Icon: Truck },
  { label: "Seguro de viaje", Icon: ShieldCheck },
  { label: "Gestión de documentos", Icon: FileText },
  { label: "Pago de impuestos", Icon: Receipt },
  { label: "Trámites de placas y registro", Icon: BadgeCheck },
  { label: "Entrega llave en mano", Icon: Key },
  { label: "Venta y compra de autos", Icon: Car },
  { label: "Reparación y enderezado", Icon: Wrench }
];

export default function ServicesPage() {
  return (
    <div className="bg-secondary/60">
      <div className="container-page section">
        <p className="font-bold text-accent">Servicios</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-black">Nuestros servicios</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Acompañamos cada compra e importación con gestiones claras, soporte logístico y soluciones completas para que tu vehículo llegue listo para usar.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ label, Icon }) => (
            <article key={label} className="rounded-lg bg-white p-6 shadow-soft">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/12 text-accent">
                <Icon size={23} />
              </div>
              <h2 className="mt-4 text-xl font-black">{label}</h2>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
