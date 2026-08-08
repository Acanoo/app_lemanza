import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminVehicleEditForm } from "@/components/admin-vehicle-edit-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Editar vehiculo" };
export const dynamic = "force-dynamic";

export default async function AdminVehicleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [vehicle, branches] = await Promise.all([
    prisma.vehicle.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, branch: true }
    }),
    prisma.branch.findMany({ orderBy: { name: "asc" } })
  ]);

  if (!vehicle) notFound();

  const editableVehicle = {
    id: vehicle.id,
    slug: vehicle.slug,
    internalCode: vehicle.internalCode,
    type: vehicle.type,
    brand: vehicle.brand,
    model: vehicle.model,
    trim: vehicle.trim || "",
    year: vehicle.year,
    mileage: vehicle.mileage,
    priceUsd: vehicle.priceUsd ? String(vehicle.priceUsd) : "",
    priceGtq: String(vehicle.priceGtq),
    manualPriceGtq: vehicle.manualPriceGtq ? String(vehicle.manualPriceGtq) : "",
    transmission: vehicle.transmission,
    fuel: vehicle.fuel,
    drivetrain: vehicle.drivetrain,
    status: vehicle.status,
    motor: vehicle.motor,
    exteriorColor: vehicle.exteriorColor,
    interiorColor: vehicle.interiorColor,
    vin: vehicle.vin || "",
    doors: vehicle.doors,
    displacement: vehicle.displacement || "",
    equipment: vehicle.equipment,
    warranty: vehicle.warranty || "",
    observations: vehicle.observations || "",
    has360: vehicle.has360,
    branchId: vehicle.branchId,
    images: vehicle.images.map((image) => ({
      url: image.url,
      alt: image.alt,
      position: image.position
    }))
  };

  return (
    <main className="min-h-screen bg-[#f4f6f9] p-4 text-slate-900 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Inventario</p>
            <h1 className="text-2xl font-black">Editar {vehicle.brand} {vehicle.model} {vehicle.year}</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin#inventario"><ArrowLeft size={16} /> Volver al admin</Link>
          </Button>
        </div>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-md border bg-white p-5 shadow-sm">
            <div className="relative h-44 overflow-hidden rounded bg-slate-100">
              <Image src={vehicle.images[0]?.url || "/brand/logo.jpeg"} alt={vehicle.model} fill className="object-cover" />
            </div>
            <div className="mt-4 grid gap-1 text-sm">
              <p className="font-black">{vehicle.internalCode}</p>
              <p className="text-slate-500">{vehicle.branch.name}</p>
              <p className="text-slate-500">{vehicle.status}</p>
            </div>
          </aside>

          <section className="rounded-md border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-black">Datos completos del vehiculo</h2>
              <p className="text-sm text-slate-500">Estos cambios se reflejan en el catalogo publico al guardar.</p>
            </div>
            <div className="p-5">
              <AdminVehicleEditForm
                vehicle={editableVehicle}
                branches={branches.map((branch) => ({ id: branch.id, name: branch.name }))}
              />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
