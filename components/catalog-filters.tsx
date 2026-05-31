"use client";

import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sortOptions } from "@/lib/constants";
import type { VehicleFilterOptions } from "@/lib/vehicles";

function SelectFilter({ name, label, options }: { name: string; label: string; options: string[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const selectedValue = params.get(name) || "";
  const visibleOptions = selectedValue && !options.includes(selectedValue) ? [selectedValue, ...options] : options;

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <select
        defaultValue={selectedValue}
        className="h-11 rounded-md border border-input bg-white px-3 text-sm"
        onChange={(event) => {
          const next = new URLSearchParams(params);
          if (event.target.value) {
            next.set(name, event.target.value);
          } else {
            next.delete(name);
          }
          router.push(next.size ? `/catalogo?${next.toString()}` : "/catalogo");
        }}
      >
        <option value="">Todos</option>
        {visibleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function NumberFilter({ name, label }: { name: string; label: string }) {
  const params = useSearchParams();
  const router = useRouter();
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type="number"
        defaultValue={params.get(name) || ""}
        onBlur={(event) => {
          const next = new URLSearchParams(params);
          if (event.target.value) {
            next.set(name, event.target.value);
          } else {
            next.delete(name);
          }
          router.push(next.size ? `/catalogo?${next.toString()}` : "/catalogo");
        }}
      />
    </div>
  );
}

export function CatalogFilters({ options }: { options: VehicleFilterOptions }) {
  return (
    <aside className="rounded-lg border bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal size={18} />
        <h2 className="font-black">Filtros</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <SelectFilter name="type" label="Tipo de auto" options={options.types} />
        <SelectFilter name="brand" label="Marca" options={options.brands} />
        <SelectFilter name="transmission" label="Transmisión" options={options.transmissions} />
        <SelectFilter name="branch" label="Ubicación" options={options.branches} />
        <SelectFilter name="fuel" label="Combustible" options={options.fuels} />
        <SelectFilter name="drivetrain" label="Tracción" options={options.drivetrains} />
        <SelectFilter name="status" label="Estado" options={options.statuses} />
        <SelectFilter name="sort" label="Ordenar" options={sortOptions} />
        <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <NumberFilter name="minYear" label="Año min." />
          <NumberFilter name="maxYear" label="Año max." />
          <NumberFilter name="minPrice" label="Precio min." />
          <NumberFilter name="maxPrice" label="Precio max." />
          <NumberFilter name="minMileage" label="Km min." />
          <NumberFilter name="maxMileage" label="Km max." />
        </div>
        <div className="flex items-end"><Button asChild variant="outline"><Link href="/catalogo">Limpiar filtros</Link></Button></div>
      </div>
    </aside>
  );
}
