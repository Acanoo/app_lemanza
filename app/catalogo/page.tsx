import { CatalogFilters } from "@/components/catalog-filters";
import { VehicleCard } from "@/components/vehicle-card";
import { getVehicleFilterOptions, getVehicles, type VehicleSearchParams } from "@/lib/vehicles";

export const metadata = { title: "Catálogo" };
export const dynamic = "force-dynamic";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<VehicleSearchParams> }) {
  const params = await searchParams;
  const [vehicles, filterOptions] = await Promise.all([getVehicles(params), getVehicleFilterOptions(params)]);

  return (
    <div className="bg-secondary/60">
      <div className="container-page py-10">
        <div className="mb-8">
          <p className="font-bold text-accent">Inventario Guatemala</p>
          <h1 className="text-4xl font-black">Catálogo de vehículos</h1>
        </div>
        <div className="mb-7">
          <CatalogFilters options={filterOptions} />
        </div>
        <p className="mb-4 text-sm font-semibold text-slate-600">{vehicles.length} vehículos encontrados</p>
        {vehicles.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-10 text-center shadow-soft">
            <h2 className="text-xl font-black">No hay resultados</h2>
            <p className="mt-2 text-muted-foreground">Ajusta los filtros o ejecuta el seed de Prisma para cargar inventario.</p>
          </div>
        )}
      </div>
    </div>
  );
}
