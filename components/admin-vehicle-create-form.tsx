"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type BranchOption = {
  id: string;
  name: string;
};

const types = ["HYBRID", "HATCHBACK", "PICKUP", "PANEL", "BLINDADO", "SEDAN", "SUV", "MICROBUS", "CAMION"];
const transmissions = ["AUTOMATICO", "MECANICO"];
const fuels = ["GASOLINA", "DIESEL", "ELECTRICO", "HIBRIDO"];
const drivetrains = ["DOS_POR_DOS", "CUATRO_POR_CUATRO", "AWD"];
const statuses = ["DISPONIBLE", "USADO", "NUEVO", "RESERVADO", "VENDIDO"];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function numberValue(form: FormData, key: string, fallback = 0) {
  const value = Number(form.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function optionalNumber(form: FormData, key: string) {
  const raw = String(form.get(key) || "").trim();
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export function AdminVehicleCreateForm({ branches }: { branches: BranchOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const codePrefix = useMemo(() => `LM-${Date.now().toString().slice(-6)}`, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const brand = String(form.get("brand") || "").trim();
    const model = String(form.get("model") || "").trim();
    const year = numberValue(form, "year", new Date().getFullYear());
    const internalCode = String(form.get("internalCode") || codePrefix).trim();
    const imageUrls = String(form.get("images") || "")
      .split(/\r?\n/)
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      slug: slugify(`${brand}-${model}-${year}-${internalCode}`),
      internalCode,
      type: String(form.get("type") || "SEDAN"),
      brand,
      model,
      trim: String(form.get("trim") || "") || undefined,
      year,
      mileage: numberValue(form, "mileage"),
      priceUsd: optionalNumber(form, "priceUsd"),
      priceGtq: numberValue(form, "priceGtq"),
      manualPriceGtq: optionalNumber(form, "manualPriceGtq"),
      transmission: String(form.get("transmission") || "AUTOMATICO"),
      fuel: String(form.get("fuel") || "GASOLINA"),
      drivetrain: String(form.get("drivetrain") || "DOS_POR_DOS"),
      status: String(form.get("status") || "DISPONIBLE"),
      motor: String(form.get("motor") || "No especificado"),
      exteriorColor: String(form.get("exteriorColor") || "No especificado"),
      interiorColor: String(form.get("interiorColor") || "No especificado"),
      vin: String(form.get("vin") || "") || undefined,
      doors: numberValue(form, "doors", 5),
      displacement: String(form.get("displacement") || "") || undefined,
      equipment: String(form.get("equipment") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      warranty: String(form.get("warranty") || "") || undefined,
      observations: String(form.get("observations") || "") || undefined,
      has360: form.get("has360") === "on",
      branchId: String(form.get("branchId") || ""),
      images: imageUrls.map((url, position) => ({ url, position, alt: `${brand} ${model} ${year}` }))
    };

    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("No se pudo publicar el vehiculo. Revisa los campos obligatorios.");
      event.currentTarget.reset();
      setMessage("Vehiculo agregado y publicado en el catalogo.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo publicar el vehiculo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-semibold">Codigo interno<input name="internalCode" defaultValue={codePrefix} required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Marca<input name="brand" required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Modelo<input name="model" required className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Linea / trim<input name="trim" className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Año<input name="year" type="number" required min={1950} defaultValue={new Date().getFullYear()} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Kilometraje<input name="mileage" type="number" required min={0} defaultValue={0} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Precio GTQ<input name="priceGtq" type="number" required min={0} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Precio USD<input name="priceUsd" type="number" min={0} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Precio manual GTQ<input name="manualPriceGtq" type="number" min={0} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Tipo<select name="type" className="h-10 rounded border border-slate-300 px-3">{types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Transmision<select name="transmission" className="h-10 rounded border border-slate-300 px-3">{transmissions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Combustible<select name="fuel" className="h-10 rounded border border-slate-300 px-3">{fuels.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Traccion<select name="drivetrain" className="h-10 rounded border border-slate-300 px-3">{drivetrains.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Estado<select name="status" defaultValue="DISPONIBLE" className="h-10 rounded border border-slate-300 px-3">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Sucursal<select name="branchId" required className="h-10 rounded border border-slate-300 px-3">{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-semibold">Motor<input name="motor" required defaultValue="No especificado" className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Color exterior<input name="exteriorColor" required defaultValue="No especificado" className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Color interior<input name="interiorColor" required defaultValue="No especificado" className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">VIN<input name="vin" className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Puertas<input name="doors" type="number" required min={2} defaultValue={5} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Cilindraje<input name="displacement" className="h-10 rounded border border-slate-300 px-3" /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">Equipo, separado por comas<textarea name="equipment" rows={4} className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">URLs de imagen, una por linea<textarea name="images" rows={4} required className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">Garantia<textarea name="warranty" rows={3} className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">Observaciones<textarea name="observations" rows={3} className="rounded border border-slate-300 px-3 py-2" /></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold"><input name="has360" type="checkbox" /> Vista 360 disponible</label>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Publicando..." : "Agregar y publicar vehiculo"}</Button>
        {message && <p className="text-sm font-semibold text-slate-600">{message}</p>}
      </div>
    </form>
  );
}
