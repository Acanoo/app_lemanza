"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const roles = ["ADMIN", "SALES", "EDITOR"];

export function AdminUserActions({ id, role }: { id: string; role: string }) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(role);
  const [busy, setBusy] = useState(false);

  async function updateRole() {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole })
      });
      if (!response.ok) throw new Error("No se pudo actualizar el rol");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function removeUser() {
    if (!confirm("Eliminar acceso de este trabajador. Deseas continuar?")) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el usuario");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-w-[250px] flex-wrap items-center gap-2">
      <select
        value={selectedRole}
        onChange={(event) => setSelectedRole(event.target.value)}
        className="h-9 rounded border border-slate-300 bg-white px-2 text-xs font-semibold"
      >
        {roles.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <Button type="button" size="sm" variant="outline" onClick={updateRole} disabled={busy}>Rol</Button>
      <Button type="button" size="sm" variant="outline" onClick={removeUser} disabled={busy}>Eliminar</Button>
    </div>
  );
}
