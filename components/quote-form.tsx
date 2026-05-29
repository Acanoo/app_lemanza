"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { quoteSchema } from "@/lib/validations/quote";
import { whatsappUrl } from "@/lib/utils";

type FormValues = z.infer<typeof quoteSchema>;

export function QuoteForm({ vehicleId, vehicleName }: { vehicleId?: string; vehicleName?: string }) {
  const [status, setStatus] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { vehicleId, message: vehicleName ? `Me interesa ${vehicleName}` : "" }
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/quotes", { method: "POST", body: JSON.stringify(values) });
    setStatus(response.ok ? "Cotización recibida. Un asesor te contactará pronto." : "No pudimos enviar la cotización.");
    if (response.ok) reset();
  }

  return (
    <div id="cotizar" className="rounded-lg border bg-white p-5 shadow-soft">
      <h2 className="text-xl font-black">Solicitar cotización</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Nombre</Label><Input {...register("firstName")} />{errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}</div>
          <div><Label>Apellido</Label><Input {...register("lastName")} />{errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label>Teléfono</Label><Input {...register("phone")} />{errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}</div>
          <div><Label>Email</Label><Input type="email" {...register("email")} />{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}</div>
        </div>
        <input type="hidden" {...register("vehicleId")} />
        <div><Label>Mensaje</Label><Textarea {...register("message")} /></div>
        <div><Label>Captcha: 3 + 4</Label><Input {...register("captcha")} />{errors.captcha && <p className="text-xs text-red-600">{errors.captcha.message}</p>}</div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isSubmitting}><Send size={16} /> Enviar cotización</Button>
          <Button asChild variant="accent">
            <a href={whatsappUrl(`Hola, quiero cotizar ${vehicleName || "un vehículo"}.`)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>
          </Button>
        </div>
        {status && <p className="text-sm font-semibold text-primary">{status}</p>}
      </form>
    </div>
  );
}
