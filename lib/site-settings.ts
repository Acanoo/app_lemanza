import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  financingEyebrow: string;
  financingTitle: string;
  financingCopy: string;
  benefits: string[];
  ctaTitle: string;
  ctaCopy: string;
  contactEmail: string;
  contactPhone: string;
  whatsappMessage: string;
  aboutIntro: string;
  mission: string;
  vision: string;
  values: string[];
};

export const defaultSiteSettings: SiteSettings = {
  heroTitle: "Tu proximo destino ya tiene forma: el modelo que buscas, te busca a ti.",
  heroSubtitle: "Explora inventario inspeccionado, cotiza en linea y calcula tus cuotas antes de visitar la agencia.",
  financingEyebrow: "Financiamiento",
  financingTitle: "Contamos con los mejores planes de financiamiento",
  financingCopy: "Opciones bancarias, hasta 60 meses y 0% de enganche en vehiculos seleccionados.",
  benefits: ["Vehiculos usados exclusivamente de agencia", "Horarios comodos y atencion fines de semana", "Mas de 25 marcas disponibles"],
  ctaTitle: "Listo para estrenar?",
  ctaCopy: "Escribenos y un asesor te ayuda a encontrar el vehiculo ideal.",
  contactEmail: "ventas@lemanzamotores.gt",
  contactPhone: "+502 4016-7882",
  whatsappMessage: "Hola, quiero asesoria para comprar un vehiculo.",
  aboutIntro: "Somos una empresa local comprometida con la excelencia en logistica y transporte. Nos especializamos en disenar soluciones integrales de movilidad para diversos sectores industriales y comerciales, sin descuidar la calidez y eficiencia que el publico general merece.",
  mission: "Brindar a nuestros clientes vehiculos importados de alta calidad, garantizando confianza, transparencia y un excelente servicio antes, durante y despues de cada compra, satisfaciendo sus necesidades de movilidad con precios competitivos y asesoria personalizada.",
  vision: "Ser una importadora de vehiculos reconocida a nivel nacional por su excelencia en servicio, variedad de automoviles y compromiso con la satisfaccion del cliente, posicionandonos como una de las empresas lideres en el mercado automotriz.",
  values: ["Actitud de servicio", "Cumplimiento", "Disciplina", "Respeto"]
};

function normalizeSettings(value: Prisma.JsonValue | null | undefined): SiteSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultSiteSettings;
  return { ...defaultSiteSettings, ...(value as Partial<SiteSettings>) };
}

async function ensureSiteSettingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SiteSetting" (
      "id" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "value" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key")`);
}

export async function getSiteSettings() {
  try {
    await ensureSiteSettingsTable();
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site" } });
    return normalizeSettings(setting?.value);
  } catch {
    return defaultSiteSettings;
  }
}

export async function upsertSiteSettings(value: SiteSettings) {
  await ensureSiteSettingsTable();
  return prisma.siteSetting.upsert({
    where: { key: "site" },
    update: { value: value as unknown as Prisma.InputJsonValue },
    create: { key: "site", value: value as unknown as Prisma.InputJsonValue }
  });
}
