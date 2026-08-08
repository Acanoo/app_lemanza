"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const roles = [
  { value: "ADMIN", label: "Administrador", detail: "Acceso completo al panel." },
  { value: "SALES", label: "Ventas", detail: "Gestiona cotizaciones e inventario comercial." },
  { value: "EDITOR", label: "Editor", detail: "Gestiona contenido e inventario publicado." }
];

export function AdminUserCreateForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      role: String(form.get("role") || "SALES")
    };

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("No se pudo crear el usuario");
      event.currentTarget.reset();
      setMessage("Trabajador registrado correctamente.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear el usuario");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-semibold">
          Nombre
          <input name="name" required className="h-10 rounded border border-slate-300 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Correo
          <input name="email" type="email" required className="h-10 rounded border border-slate-300 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Contraseña temporal
          <input name="password" type="password" required minLength={6} className="h-10 rounded border border-slate-300 px-3 text-sm" />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Rol
          <select name="role" defaultValue="SALES" className="h-10 rounded border border-slate-300 px-3 text-sm">
            {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
          </select>
        </label>
      </div>
      <div className="grid gap-2 rounded bg-slate-50 p-3 text-xs text-slate-600">
        {roles.map((role) => <p key={role.value}><strong>{role.label}:</strong> {role.detail}</p>)}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Guardando..." : "Registrar trabajador"}</Button>
        {message && <p className="text-sm font-semibold text-slate-600">{message}</p>}
      </div>
    </form>
  );
}
