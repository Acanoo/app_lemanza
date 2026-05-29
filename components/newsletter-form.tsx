"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema } from "@/lib/validations/quote";

type FormValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/newsletter", { method: "POST", body: JSON.stringify(values) });
    setMessage(response.ok ? "Gracias por suscribirte." : "No pudimos guardar tu suscripción.");
    if (response.ok) reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "mt-4 grid gap-3" : "grid gap-4 rounded-lg border bg-white p-5 shadow-soft"}>
      <Input placeholder="Nombre" {...register("name")} className={compact ? "bg-white/95 text-slate-900" : ""} />
      <Input placeholder="Email" type="email" {...register("email")} className={compact ? "bg-white/95 text-slate-900" : ""} />
      <Button type="submit" variant="accent" disabled={isSubmitting}><Send size={16} /> Suscribirme</Button>
      {message && <p className={compact ? "text-sm text-white/75" : "text-sm text-slate-600"}>{message}</p>}
    </form>
  );
}
