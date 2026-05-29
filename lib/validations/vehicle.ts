import { z } from "zod";

export const vehicleSchema = z.object({
  slug: z.string().min(3),
  internalCode: z.string().min(3),
  type: z.enum(["HYBRID", "HATCHBACK", "PICKUP", "PANEL", "BLINDADO", "SEDAN", "SUV", "MICROBUS", "CAMION"]),
  brand: z.string().min(2),
  model: z.string().min(1),
  trim: z.string().optional(),
  year: z.number().int().min(1950),
  mileage: z.number().int().min(0),
  priceUsd: z.number().optional(),
  priceGtq: z.number().min(0),
  manualPriceGtq: z.number().optional(),
  transmission: z.enum(["AUTOMATICO", "MECANICO"]),
  fuel: z.enum(["GASOLINA", "DIESEL", "ELECTRICO", "HIBRIDO"]),
  drivetrain: z.enum(["DOS_POR_DOS", "CUATRO_POR_CUATRO", "AWD"]),
  status: z.enum(["NUEVO", "USADO", "RESERVADO", "VENDIDO", "DISPONIBLE"]),
  motor: z.string().min(2),
  exteriorColor: z.string().min(2),
  interiorColor: z.string().min(2),
  vin: z.string().optional(),
  doors: z.number().int().min(2),
  displacement: z.string().optional(),
  equipment: z.array(z.string()).default([]),
  warranty: z.string().optional(),
  observations: z.string().optional(),
  has360: z.boolean().default(false),
  branchId: z.string()
});

export const vehiclePatchSchema = vehicleSchema.partial();
