"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const statuses = ["DISPONIBLE", "USADO", "NUEVO", "RESERVADO", "VENDIDO"];

export function AdminVehicleActions({ id, status, priceGtq }: { id: string; status: string; priceGtq: number }) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [manualPrice, setManualPrice] = useState(String(Math.round(priceGtq)));
  const [busy, setBusy] = useState(false);

  async function updateVehicle() {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          manualPriceGtq: Number(manualPrice)
        })
      });
      if (!response.ok) throw new Error("No se pudo actualizar");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function deleteVehicle() {
    if (!confirm("Esta acción eliminará el vehículo del catálogo. ¿Deseas continuar?")) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-w-[360px] flex-wrap items-center gap-2">
      <select
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
        className="h-9 rounded border border-slate-300 bg-white px-2 text-xs font-semibold"
      >
        {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <input
        value={manualPrice}
        onChange={(event) => setManualPrice(event.target.value)}
        className="h-9 w-24 rounded border border-slate-300 px-2 text-xs"
        inputMode="numeric"
        aria-label="Precio manual"
      />
      <Button type="button" size="sm" onClick={updateVehicle} disabled={busy}>Guardar</Button>
      <Button asChild type="button" size="sm" variant="outline">
        <Link href={`/admin/vehiculos/${id}`}>Editar completo</Link>
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={deleteVehicle} disabled={busy}>Eliminar</Button>
    </div>
  );
}
