import { z } from "zod";

export const quoteSchema = z.object({
  firstName: z.string().min(2, "Ingresa tu nombre"),
  lastName: z.string().min(2, "Ingresa tu apellido"),
  phone: z.string().min(8, "Ingresa un teléfono válido"),
  email: z.string().email("Ingresa un email válido"),
  message: z.string().optional(),
  vehicleId: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  captcha: z.string().refine((value) => value.trim() === "7", "Resuelve el captcha")
});

export const newsletterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  utmCampaign: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional()
});
