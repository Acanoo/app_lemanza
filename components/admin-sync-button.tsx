"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSyncButton() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function runSync() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/manual-sync", { method: "POST" });
      const payload = await response.json();
      if (!response.ok && response.status !== 207) throw new Error(payload?.errors?.[0] || "No se pudo sincronizar.");
      setMessage(`Sincronizacion finalizada: ${payload.totalFound || 0} encontrados, ${payload.totalUpserted || 0} actualizados.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo sincronizar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded border p-4">
      <RefreshCw className="text-primary" />
      <p className="mt-3 font-black">Sincronizar inventario</p>
      <p className="mt-1 text-sm text-slate-500">Ejecuta la importacion manual desde el panel administrativo.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" size="sm" onClick={runSync} disabled={busy}>
          {busy ? "Sincronizando..." : "Ejecutar"}
        </Button>
        {message && <p className="text-xs font-semibold text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
