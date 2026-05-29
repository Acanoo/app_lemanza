import type { LucideIcon } from "lucide-react";
import { BarChart3, Car, CircleDollarSign, Inbox, Mail, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatGtq } from "@/lib/utils";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

async function getMetrics() {
  try {
    const [total, quotes, sold, reserved, vehicles, newsletter] = await Promise.all([
      prisma.vehicle.count(),
      prisma.quoteRequest.count(),
      prisma.vehicle.count({ where: { status: "VENDIDO" } }),
      prisma.vehicle.count({ where: { status: "RESERVADO" } }),
      prisma.vehicle.findMany({ select: { priceGtq: true, brand: true }, take: 200 }),
      prisma.newsletterSubscriber.count()
    ]);
    const average = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.priceGtq), 0) / Math.max(vehicles.length, 1);
    const brandCounts = vehicles.reduce<Record<string, number>>((acc, vehicle) => {
      acc[vehicle.brand] = (acc[vehicle.brand] || 0) + 1;
      return acc;
    }, {});
    return { total, quotes, sold, reserved, average, newsletter, brandCounts };
  } catch {
    return { total: 0, quotes: 0, sold: 0, reserved: 0, average: 0, newsletter: 0, brandCounts: {} };
  }
}

export default async function AdminPage() {
  const metrics = await getMetrics();
  const cards: [string, string | number, LucideIcon][] = [
    ["Total vehículos", metrics.total, Car],
    ["Cotizaciones recibidas", metrics.quotes, Inbox],
    ["Vehículos vendidos", metrics.sold, Tag],
    ["Vehículos reservados", metrics.reserved, BarChart3],
    ["Precio promedio", formatGtq(metrics.average), CircleDollarSign],
    ["Newsletter", metrics.newsletter, Mail]
  ];

  return (
    <div className="bg-secondary/60">
      <div className="container-page section">
        <p className="font-bold text-accent">Panel protegido preparado</p>
        <h1 className="mt-2 text-4xl font-black">Admin Lemanza</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Base para CRUD de vehículos, carga de imágenes, estados, cotizaciones, newsletter, sucursales, importación API y edición de precios manuales. Conecta autenticación antes de producción.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(([label, value, Icon]) => (
            <div key={String(label)} className="rounded-lg bg-white p-6 shadow-soft">
              <Icon className="text-accent" />
              <p className="mt-4 text-sm font-bold text-muted-foreground">{label}</p>
              <p className="text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black">Marcas más consultadas / disponibles</h2>
          <div className="mt-4 grid gap-2">
            {Object.entries(metrics.brandCounts).slice(0, 8).map(([brand, count]) => (
              <div key={brand} className="flex justify-between rounded-md bg-secondary p-3"><span>{brand}</span><strong>{count}</strong></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
