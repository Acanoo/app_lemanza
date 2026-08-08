"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  mapsUrl: string;
  wazeUrl: string;
  _count?: { vehicles: number };
};

const emptyBranch = { id: "", name: "", address: "", phone: "", mapsUrl: "https://maps.google.com/", wazeUrl: "https://waze.com/ul" };

export function AdminBranchManager({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(emptyBranch);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      id: selected.id || undefined,
      name: String(form.get("name") || ""),
      address: String(form.get("address") || ""),
      phone: String(form.get("phone") || ""),
      mapsUrl: String(form.get("mapsUrl") || ""),
      wazeUrl: String(form.get("wazeUrl") || "")
    };
    try {
      const response = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("No se pudo guardar la sucursal.");
      setSelected(emptyBranch);
      setMessage("Sucursal guardada correctamente.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminar sucursal. Solo se permite si no tiene vehiculos asignados.")) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/branches/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar. Puede tener vehiculos asignados.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5">
      <form key={selected.id || "new"} onSubmit={submit} className="grid gap-3 rounded border bg-slate-50 p-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">Nombre<input name="name" defaultValue={selected.name} required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Telefono<input name="phone" defaultValue={selected.phone} required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold md:col-span-2">Direccion<input name="address" defaultValue={selected.address} required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Google Maps<input name="mapsUrl" type="url" defaultValue={selected.mapsUrl} required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Waze<input name="wazeUrl" type="url" defaultValue={selected.wazeUrl} required className="h-10 rounded border border-slate-300 px-3" /></label>
        <div className="flex items-center gap-3 md:col-span-2">
          <Button type="submit" disabled={busy}>{selected.id ? "Actualizar sucursal" : "Crear sucursal"}</Button>
          <Button type="button" variant="outline" onClick={() => setSelected(emptyBranch)}>Nuevo</Button>
          {message && <p className="text-sm font-semibold text-slate-600">{message}</p>}
        </div>
      </form>
      <div className="overflow-x-auto rounded border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Sucursal</th><th className="px-4 py-3">Contacto</th><th className="px-4 py-3">Vehiculos</th><th className="px-4 py-3">Acciones</th></tr>
          </thead>
          <tbody className="divide-y">
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td className="px-4 py-3"><strong>{branch.name}</strong><p className="text-xs text-slate-500">{branch.address}</p></td>
                <td className="px-4 py-3">{branch.phone}</td>
                <td className="px-4 py-3">{branch._count?.vehicles ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => setSelected(branch)}>Editar</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => remove(branch.id)} disabled={busy}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
