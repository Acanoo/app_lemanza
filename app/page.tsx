import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BadgeCheck, CalendarDays, CreditCard, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { FinancingPartners } from "@/components/financing-partners";
import { FilterSearchBar } from "@/components/filter-search-bar";
import { PromoCarousel } from "@/components/promo-carousel";
import { SectionMotion } from "@/components/section-motion";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { getVehicles } from "@/lib/vehicles";
import { whatsappUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vehicles = await getVehicles({}, 6);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image src="/brand/portada.jpeg" alt="Portada Lemanza Motores" fill className="object-cover opacity-55" priority />
        <div className="container-page relative grid min-h-[560px] items-center py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black leading-tight sm:text-6xl">Tu próximo destino ya tiene forma: el modelo que buscas, te busca a ti.</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">Explora inventario inspeccionado, cotiza en línea y calcula tus cuotas antes de visitar la agencia.</p>
          </div>
        </div>
      </section>

      <section className="container-page -mt-10">
        <FilterSearchBar />
        <PromoCarousel />
      </section>

      <FinancingPartners />

      <SectionMotion className="section container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="font-bold text-accent">Nuevos ingresos</p><h2 className="text-3xl font-black">Vehículos destacados</h2></div>
          <Button asChild variant="outline"><Link href="/catalogo">Ver catálogo <ArrowRight size={16} /></Link></Button>
        </div>
        {vehicles.length ? <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <p className="mt-8 rounded-lg border p-8 text-center text-muted-foreground">Configura la base de datos y ejecuta el seed para ver el inventario.</p>}
      </SectionMotion>

      <SectionMotion className="bg-secondary section">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="font-bold text-accent">Financiamiento</p>
            <h2 className="mt-2 text-4xl font-black">Contamos con los mejores planes de financiamiento</h2>
            <p className="mt-4 text-slate-600">Opciones bancarias, hasta 60 meses y 0% de enganche en vehículos seleccionados.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ["Hasta 60 meses", CreditCard],
              ["Cita flexible", CalendarDays],
              ["Inspección previa", ShieldCheck],
              ["Asesoría experta", BadgeCheck]
            ] satisfies [string, LucideIcon][]).map(([label, Icon]) => (
              <div key={label} className="rounded-lg bg-white p-5 shadow-soft"><Icon className="text-accent" /><p className="mt-3 font-black">{label}</p></div>
            ))}
          </div>
        </div>
      </SectionMotion>

      <SectionMotion className="section container-page">
        <div className="grid gap-5 md:grid-cols-3">
          {["Vehículos usados exclusivamente de agencia", "Horarios cómodos y atención fines de semana", "Más de 25 marcas disponibles"].map((benefit) => (
            <div key={benefit} className="rounded-lg border p-6 shadow-soft"><Sparkles className="text-accent" /><h3 className="mt-4 font-black">{benefit}</h3></div>
          ))}
        </div>
        <div className="mt-10 rounded-lg bg-primary p-8 text-white">
          <h2 className="text-3xl font-black">¿Listo para estrenar?</h2>
          <p className="mt-2 text-white/75">Escríbenos y un asesor te ayuda a encontrar el vehículo ideal.</p>
          <Button asChild className="mt-5" variant="accent"><a href={whatsappUrl("Hola, quiero asesoría para comprar un vehículo.")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Contactar por WhatsApp</a></Button>
        </div>
      </SectionMotion>
    </>
  );
}
