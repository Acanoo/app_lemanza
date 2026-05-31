import * as cheerio from "cheerio";
import { Drivetrain, FuelType, Prisma, Transmission, VehicleStatus, VehicleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SOURCE_ORIGIN = "https://www.superautosjack.com.gt";
const USED_CATALOG_URL = `${SOURCE_ORIGIN}/usados`;
const USER_AGENT = "LemanzaMotoresInventorySync/1.0 (+https://app-lemanza-cars.vercel.app)";
const SCRAPE_DELAY_MS = 1200;

export type ScrapedSuperAutosJackVehicle = {
  brand: string;
  model: string;
  year: number;
  priceGtq: number;
  mileage: number;
  motor: string;
  images: string[];
  sourceUrl: string;
  sourceCode: string;
};

export type SuperAutosJackSyncResult = {
  ok: boolean;
  totalFound: number;
  totalUpserted: number;
  updatedAt: string;
  errors: string[];
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function absoluteUrl(value: string) {
  return new URL(value.trim(), SOURCE_ORIGIN).toString();
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseNumber(value: string) {
  const normalized = value.replace(/\.\d{2}\b/g, "").replace(/[^\d]/g, "");
  return normalized ? Number(normalized) : 0;
}

function extractBackgroundImage(style: string) {
  const match = style.match(/url\((['"]?)(.*?)\1\)/i);
  return match?.[2]?.trim();
}

function normalizeTitle(title: string) {
  return title.replace(/\s+/g, " ").replace(/\s*[•·]\s*/g, " • ").trim();
}

function parseTitle(title: string) {
  const normalized = normalizeTitle(title);
  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/g);
  const year = yearMatch ? Number(yearMatch[yearMatch.length - 1]) : new Date().getFullYear();
  const withoutYear = normalized.replace(/\b(19|20)\d{2}\b/g, "").trim();
  const [rawBrand, ...rest] = withoutYear.split("•").map((part) => part.trim()).filter(Boolean);
  const brand = rawBrand || withoutYear.split(" ")[0] || "IMPORTADO";
  const model = rest.join(" ").trim() || withoutYear.replace(brand, "").trim() || "Vehiculo usado";
  return { brand, model, year };
}

function inferType(model: string) {
  const value = model.toUpperCase();
  if (value.includes("HILUX") || value.includes("RANGER") || value.includes("AMAROK") || value.includes("HUNTER")) return VehicleType.PICKUP;
  if (value.includes("HINO") || value.includes("GD8")) return VehicleType.CAMION;
  if (value.includes("PICANTO") || value.includes("COOPER") || value.includes("AGYA") || value.includes("RIO")) return VehicleType.HATCHBACK;
  if (value.includes("BLINDA")) return VehicleType.BLINDADO;
  if (
    value.includes("QASHQAI") ||
    value.includes("CRV") ||
    value.includes("CR-V") ||
    value.includes("CX-") ||
    value.includes("SPORTAGE") ||
    value.includes("RAV4") ||
    value.includes("TIGUAN") ||
    value.includes("TAOS") ||
    value.includes("X3") ||
    value.includes("RANGE ROVER")
  ) {
    return VehicleType.SUV;
  }
  return VehicleType.SEDAN;
}

function inferFuel(motor: string) {
  const normalized = motor.toLowerCase();
  if (normalized === "0") return FuelType.ELECTRICO;
  if (normalized.includes("diesel") || normalized.includes("tdi")) return FuelType.DIESEL;
  return FuelType.GASOLINA;
}

function inferDrivetrain(model: string) {
  const normalized = model.toUpperCase();
  if (normalized.includes("4X4") || normalized.includes("4WD")) return Drivetrain.CUATRO_POR_CUATRO;
  if (normalized.includes("AWD") || normalized.includes("XDRIVE") || normalized.includes("4MATIC")) return Drivetrain.AWD;
  return Drivetrain.DOS_POR_DOS;
}

function robotsAllowsPath(robotsTxt: string, path: string) {
  const lines = robotsTxt.split(/\r?\n/).map((line) => line.replace(/#.*/, "").trim()).filter(Boolean);
  let applies = false;
  const rules: { allow: boolean; path: string }[] = [];

  for (const line of lines) {
    const [rawKey, ...rawValue] = line.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rawValue.join(":").trim();
    if (key === "user-agent") {
      applies = value === "*" || value.toLowerCase() === USER_AGENT.toLowerCase();
      continue;
    }
    if (applies && (key === "allow" || key === "disallow")) {
      rules.push({ allow: key === "allow", path: value });
    }
  }

  const matches = rules
    .filter((rule) => rule.path && path.startsWith(rule.path))
    .sort((a, b) => b.path.length - a.path.length);

  return matches[0]?.allow ?? true;
}

export async function validateSuperAutosJackRobots() {
  const robotsUrl = `${SOURCE_ORIGIN}/robots.txt`;
  const response = await fetch(robotsUrl, { headers: { "User-Agent": USER_AGENT }, cache: "no-store" });
  if (response.status === 404) return true;
  if (!response.ok) throw new Error(`Could not validate robots.txt: ${response.status}`);
  const robotsTxt = await response.text();
  return robotsAllowsPath(robotsTxt, new URL(USED_CATALOG_URL).pathname);
}

export async function scrapeSuperAutosJackCatalog() {
  const allowed = await validateSuperAutosJackRobots();
  if (!allowed) throw new Error("robots.txt does not allow scraping /usados");

  await delay(SCRAPE_DELAY_MS);
  const response = await fetch(USED_CATALOG_URL, {
    headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Super Autos Jack request failed: ${response.status}`);

  const html = await response.text();
  const $ = cheerio.load(html);
  const vehicles: ScrapedSuperAutosJackVehicle[] = [];

  $(".auto-nuevo").each((_, element) => {
    const card = $(element);
    const onclick = card.attr("onclick") || "";
    const relativeSource = onclick.match(/window\.open\('([^']+)'/)?.[1] || "usados";
    const sourceUrl = absoluteUrl(relativeSource);
    const sourceCode = new URL(sourceUrl).searchParams.get("codigo") || slugify(sourceUrl);
    const titleNode = card.find("h3").first().clone();
    titleNode.children().remove();
    const title = titleNode.text();
    const { brand, model, year } = parseTitle(title);
    const priceGtq = parseNumber(card.find(".precio").first().text());
    const infoValues = card.find(".texto-info").map((__, info) => $(info).text().replace(/\s+/g, " ").trim()).get();
    const motor = infoValues.find((value) => value.toLowerCase().includes("motor"))?.replace(/motor/i, "").trim() || "No especificado";
    const mileage = parseNumber(infoValues.find((value) => value.toLowerCase().includes("km")) || "0");
    const image = extractBackgroundImage(card.find(".imagen-auto").attr("style") || "");

    if (!brand || !model || !priceGtq || !sourceCode) return;

    vehicles.push({
      brand: brand.toUpperCase(),
      model,
      year,
      priceGtq,
      mileage,
      motor,
      images: image ? [absoluteUrl(image)] : [],
      sourceUrl,
      sourceCode
    });
  });

  return vehicles;
}

export async function syncSuperAutosJackCatalog(): Promise<SuperAutosJackSyncResult> {
  const errors: string[] = [];
  const scrapedAt = new Date();
  let totalUpserted = 0;
  let vehicles: ScrapedSuperAutosJackVehicle[] = [];

  try {
    vehicles = await scrapeSuperAutosJackCatalog();
  } catch (error) {
    return {
      ok: false,
      totalFound: 0,
      totalUpserted: 0,
      updatedAt: scrapedAt.toISOString(),
      errors: [error instanceof Error ? error.message : "Unknown scrape error"]
    };
  }

  let branch;
  try {
    branch = await prisma.branch.upsert({
      where: { name: "Super Autos Jack" },
      update: {
        address: "Inventario de referencia desde Super Autos Jack",
        phone: "+502 4016-7882",
        mapsUrl: SOURCE_ORIGIN,
        wazeUrl: SOURCE_ORIGIN
      },
      create: {
        name: "Super Autos Jack",
        address: "Inventario de referencia desde Super Autos Jack",
        phone: "+502 4016-7882",
        mapsUrl: SOURCE_ORIGIN,
        wazeUrl: SOURCE_ORIGIN
      }
    });
  } catch (error) {
    return {
      ok: false,
      totalFound: vehicles.length,
      totalUpserted: 0,
      updatedAt: scrapedAt.toISOString(),
      errors: [error instanceof Error ? error.message : "Unknown database error"]
    };
  }

  for (const vehicle of vehicles) {
    try {
      const slug = slugify(`${vehicle.brand}-${vehicle.model}-${vehicle.year}-${vehicle.sourceCode}`);
      const images = vehicle.images.map((url, position) => ({
        url,
        alt: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        position
      }));
      const raw: Prisma.InputJsonObject = {
        sourceUrl: vehicle.sourceUrl,
        scrapedAt: scrapedAt.toISOString()
      };
      const data = {
        internalCode: `SAJ-${vehicle.sourceCode}`,
        type: inferType(vehicle.model),
        brand: vehicle.brand,
        model: vehicle.model,
        trim: null,
        year: vehicle.year,
        mileage: vehicle.mileage,
        priceUsd: null,
        priceGtq: vehicle.priceGtq,
        manualPriceGtq: null,
        transmission: Transmission.AUTOMATICO,
        fuel: inferFuel(vehicle.motor),
        drivetrain: inferDrivetrain(vehicle.model),
        status: VehicleStatus.USADO,
        motor: vehicle.motor,
        exteriorColor: "No especificado",
        interiorColor: "No especificado",
        vin: null,
        doors: 5,
        displacement: vehicle.motor,
        equipment: [],
        warranty: null,
        observations: null,
        has360: false,
        branchId: branch.id
      };

      await prisma.vehicle.upsert({
        where: { slug },
        update: {
          ...data,
          images: { deleteMany: {}, create: images },
          spec: {
            upsert: {
              update: { marketSource: "Super Autos Jack", raw },
              create: { marketSource: "Super Autos Jack", raw }
            }
          }
        },
        create: {
          slug,
          ...data,
          images: { create: images },
          spec: { create: { marketSource: "Super Autos Jack", raw } }
        }
      });

      totalUpserted += 1;
    } catch (error) {
      errors.push(`${vehicle.brand} ${vehicle.model} ${vehicle.year}: ${error instanceof Error ? error.message : "Unknown upsert error"}`);
    }
  }

  return {
    ok: errors.length === 0,
    totalFound: vehicles.length,
    totalUpserted,
    updatedAt: scrapedAt.toISOString(),
    errors
  };
}
