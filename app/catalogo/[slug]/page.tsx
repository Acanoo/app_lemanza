import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancingCalculator } from "@/components/financing-calculator";
import { QuoteForm } from "@/components/quote-form";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { formatGtq, whatsappUrl } from "@/lib/utils";
import { getVehicleBySlug } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  return { title: vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : "Vehículo" };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.year} - ${vehicle.internalCode}`;
  const specs = [
    ["Tipo", vehicle.type], ["Marca", vehicle.brand], ["Modelo", vehicle.model], ["Línea/trim", vehicle.trim || "-"],
    ["Transmisión", vehicle.transmission], ["Año", vehicle.year], ["Kilometraje", `${vehicle.mileage.toLocaleString("es-GT")} km`],
    ["Tracción", vehicle.drivetrain], ["Motor", vehicle.motor], ["Combustible", vehicle.fuel],
    ["Color exterior", vehicle.exteriorColor], ["Color interior", vehicle.interiorColor], ["Ubicación", vehicle.branch.name],
    ["VIN", vehicle.vin || "Disponible bajo solicitud"], ["Número de puertas", vehicle.doors], ["Cilindraje", vehicle.displacement || "-"],
    ["Garantía", vehicle.warranty || "-"]
  ];

  return (
    <div className="bg-secondary/60">
      <div className="container-page py-10">
        <nav className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">Inicio</Link><ChevronRight size={14} /><Link href="/catalogo">Catálogo</Link><ChevronRight size={14} /><span>{vehicle.internalCode}</span>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="grid gap-6">
            <VehicleGallery images={vehicle.images} has360={vehicle.has360} />
            <div className="rounded-lg border bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-black">Información general</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {specs.map(([label, value]) => (
                  <div key={String(label)} className="rounded-md bg-secondary p-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
                    <p className="font-semibold">{String(value)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <p className="text-xs font-bold uppercase text-muted-foreground">Equipamiento</p>
                <div className="mt-2 flex flex-wrap gap-2">{vehicle.equipment.map((item) => <Badge key={item}>{item}</Badge>)}</div>
              </div>
            </div>
          </div>
          <aside className="grid content-start gap-5">
            <div className="rounded-lg border bg-white p-6 shadow-soft">
              <Badge className="bg-accent text-primary">{vehicle.status}</Badge>
              <h1 className="mt-4 text-3xl font-black">{title}</h1>
              <p className="mt-4 text-4xl font-black text-primary">{formatGtq(vehicle.priceGtq)}</p>
              <Button asChild className="mt-5 w-full" variant="accent">
                <a href={whatsappUrl(`Hola, quiero información del ${title}.`)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
              </Button>
            </div>
            <QuoteForm vehicleId={vehicle.id} vehicleName={title} />
          </aside>
        </div>
        <div className="mt-8"><FinancingCalculator price={Number(vehicle.priceGtq)} vehicleId={vehicle.id} /></div>
      </div>
    </div>
  );
}
