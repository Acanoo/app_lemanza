"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/site-settings";

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      heroTitle: String(form.get("heroTitle") || ""),
      heroSubtitle: String(form.get("heroSubtitle") || ""),
      financingEyebrow: String(form.get("financingEyebrow") || ""),
      financingTitle: String(form.get("financingTitle") || ""),
      financingCopy: String(form.get("financingCopy") || ""),
      benefits: String(form.get("benefits") || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      ctaTitle: String(form.get("ctaTitle") || ""),
      ctaCopy: String(form.get("ctaCopy") || ""),
      contactEmail: String(form.get("contactEmail") || ""),
      contactPhone: String(form.get("contactPhone") || ""),
      whatsappMessage: String(form.get("whatsappMessage") || ""),
      aboutIntro: String(form.get("aboutIntro") || ""),
      mission: String(form.get("mission") || ""),
      vision: String(form.get("vision") || ""),
      values: String(form.get("values") || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
    };

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("No se pudo guardar la configuracion.");
      setMessage("Configuracion publicada correctamente.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">Titulo principal<input name="heroTitle" defaultValue={settings.heroTitle} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Subtitulo principal<input name="heroSubtitle" defaultValue={settings.heroSubtitle} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Etiqueta financiamiento<input name="financingEyebrow" defaultValue={settings.financingEyebrow} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Titulo financiamiento<input name="financingTitle" defaultValue={settings.financingTitle} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Correo contacto<input name="contactEmail" type="email" defaultValue={settings.contactEmail} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Telefono contacto<input name="contactPhone" defaultValue={settings.contactPhone} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Titulo CTA<input name="ctaTitle" defaultValue={settings.ctaTitle} className="h-10 rounded border border-slate-300 px-3" /></label>
        <label className="grid gap-1 text-sm font-semibold">Mensaje WhatsApp<input name="whatsappMessage" defaultValue={settings.whatsappMessage} className="h-10 rounded border border-slate-300 px-3" /></label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">Texto financiamiento<textarea name="financingCopy" defaultValue={settings.financingCopy} rows={3} className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">Texto CTA<textarea name="ctaCopy" defaultValue={settings.ctaCopy} rows={3} className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">Beneficios, uno por linea<textarea name="benefits" defaultValue={settings.benefits.join("\n")} rows={5} className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">Valores, uno por linea<textarea name="values" defaultValue={settings.values.join("\n")} rows={5} className="rounded border border-slate-300 px-3 py-2" /></label>
        <label className="grid gap-1 text-sm font-semibold">Sobre nosotros<textarea name="aboutIntro" defaultValue={settings.aboutIntro} rows={5} className="rounded border border-slate-300 px-3 py-2" /></label>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-semibold">Mision<textarea name="mission" defaultValue={settings.mission} rows={4} className="rounded border border-slate-300 px-3 py-2" /></label>
          <label className="grid gap-1 text-sm font-semibold">Vision<textarea name="vision" defaultValue={settings.vision} rows={4} className="rounded border border-slate-300 px-3 py-2" /></label>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Guardar configuracion del sitio"}</Button>
        {message && <p className="text-sm font-semibold text-slate-600">{message}</p>}
      </div>
    </form>
  );
}
