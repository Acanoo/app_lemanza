import { Prisma, VehicleType, Transmission, FuelType, Drivetrain, VehicleStatus } from "@prisma/client";
import { demoVehicles } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";

const typeMap: Record<string, VehicleType> = {
  Hybrid: VehicleType.HYBRID,
  Hatchback: VehicleType.HATCHBACK,
  Pickup: VehicleType.PICKUP,
  Panel: VehicleType.PANEL,
  Blindado: VehicleType.BLINDADO,
  "Sedán": VehicleType.SEDAN,
  SUV: VehicleType.SUV,
  Microbus: VehicleType.MICROBUS,
  "Camión": VehicleType.CAMION
};

const transmissionMap: Record<string, Transmission> = { "Automático": Transmission.AUTOMATICO, "Mecánico": Transmission.MECANICO };
const fuelMap: Record<string, FuelType> = { Gasolina: FuelType.GASOLINA, Diesel: FuelType.DIESEL, "Eléctrico": FuelType.ELECTRICO, "Híbrido": FuelType.HIBRIDO };
const drivetrainMap: Record<string, Drivetrain> = { "4x2": Drivetrain.DOS_POR_DOS, "4x4": Drivetrain.CUATRO_POR_CUATRO, AWD: Drivetrain.AWD };
const statusMap: Record<string, VehicleStatus> = { Nuevo: VehicleStatus.NUEVO, Usado: VehicleStatus.USADO, Reservado: VehicleStatus.RESERVADO, Vendido: VehicleStatus.VENDIDO, Disponible: VehicleStatus.DISPONIBLE };

export type VehicleSearchParams = Record<string, string | string[] | undefined>;
export type VehicleFilterOptions = {
  types: string[];
  brands: string[];
  transmissions: string[];
  branches: string[];
  fuels: string[];
  drivetrains: string[];
  statuses: string[];
};

function getParam(params: VehicleSearchParams, key: string) {
  return Array.isArray(params[key]) ? params[key]?.[0] : params[key];
}

function getVehicleWhere(params: VehicleSearchParams, excludeKey?: string) {
  const where: Prisma.VehicleWhereInput = {};
  const get = (key: string) => (key === excludeKey ? undefined : getParam(params, key));

  if (get("q")) {
    where.OR = [
      { brand: { contains: get("q"), mode: "insensitive" } },
      { model: { contains: get("q"), mode: "insensitive" } },
      { internalCode: { contains: get("q"), mode: "insensitive" } }
    ];
  }
  if (get("brand")) where.brand = get("brand");
  if (get("type") && typeMap[get("type")!]) where.type = typeMap[get("type")!];
  if (get("transmission") && transmissionMap[get("transmission")!]) where.transmission = transmissionMap[get("transmission")!];
  if (get("fuel") && fuelMap[get("fuel")!]) where.fuel = fuelMap[get("fuel")!];
  if (get("drivetrain") && drivetrainMap[get("drivetrain")!]) where.drivetrain = drivetrainMap[get("drivetrain")!];
  if (get("status") && statusMap[get("status")!]) where.status = statusMap[get("status")!];
  if (get("branch")) where.branch = { name: get("branch") };
  if (get("minYear") || get("maxYear")) where.year = { gte: Number(get("minYear") || 1900), lte: Number(get("maxYear") || 2100) };
  if (get("minPrice") || get("maxPrice")) where.priceGtq = { gte: Number(get("minPrice") || 0), lte: Number(get("maxPrice") || 99999999) };
  if (get("minMileage") || get("maxMileage")) where.mileage = { gte: Number(get("minMileage") || 0), lte: Number(get("maxMileage") || 99999999) };

  return where;
}

function getReverseLabel<T extends string>(map: Record<string, T>, value: T) {
  return Object.entries(map).find(([, mapped]) => mapped === value)?.[0];
}

function filterDemoVehicles(params: VehicleSearchParams, take?: number, excludeKey?: string) {
  const q = getParam(params, "q")?.toLowerCase();
  const get = (key: string) => (key === excludeKey ? undefined : getParam(params, key));
  const minYear = Number(get("minYear") || 0);
  const maxYear = Number(get("maxYear") || 9999);
  const minPrice = Number(get("minPrice") || 0);
  const maxPrice = Number(get("maxPrice") || 99999999);
  const minMileage = Number(get("minMileage") || 0);
  const maxMileage = Number(get("maxMileage") || 99999999);

  let vehicles = demoVehicles.filter((vehicle) => {
    const matchesQuery = !q || `${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.internalCode}`.toLowerCase().includes(q);
    const matchesType = !get("type") || vehicle.type === typeMap[get("type")!];
    const matchesBrand = !get("brand") || vehicle.brand === get("brand");
    const matchesTransmission = !get("transmission") || vehicle.transmission === transmissionMap[get("transmission")!];
    const matchesFuel = !get("fuel") || vehicle.fuel === fuelMap[get("fuel")!];
    const matchesDrivetrain = !get("drivetrain") || vehicle.drivetrain === drivetrainMap[get("drivetrain")!];
    const matchesStatus = !get("status") || vehicle.status === statusMap[get("status")!];
    const matchesBranch = !get("branch") || vehicle.branch.name === get("branch");
    return matchesQuery && matchesType && matchesBrand && matchesTransmission && matchesFuel && matchesDrivetrain && matchesStatus && matchesBranch && vehicle.year >= minYear && vehicle.year <= maxYear && Number(vehicle.priceGtq) >= minPrice && Number(vehicle.priceGtq) <= maxPrice && vehicle.mileage >= minMileage && vehicle.mileage <= maxMileage;
  });

  const sort = getParam(params, "sort");
  vehicles = [...vehicles].sort((a, b) => {
    if (sort === "precio más bajo") return Number(a.priceGtq) - Number(b.priceGtq);
    if (sort === "precio más alto") return Number(b.priceGtq) - Number(a.priceGtq);
    if (sort === "menor kilometraje") return a.mileage - b.mileage;
    if (sort === "año más reciente") return b.year - a.year;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return vehicles.slice(0, take);
}

function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function getDemoFilterOptions(params: VehicleSearchParams): VehicleFilterOptions {
  const forFacet = (key: string) => filterDemoVehicles(params, undefined, key);

  return {
    types: uniqueSorted(forFacet("type").map((vehicle) => getReverseLabel(typeMap, vehicle.type))),
    brands: uniqueSorted(forFacet("brand").map((vehicle) => vehicle.brand)),
    transmissions: uniqueSorted(forFacet("transmission").map((vehicle) => getReverseLabel(transmissionMap, vehicle.transmission))),
    branches: uniqueSorted(forFacet("branch").map((vehicle) => vehicle.branch.name)),
    fuels: uniqueSorted(forFacet("fuel").map((vehicle) => getReverseLabel(fuelMap, vehicle.fuel))),
    drivetrains: uniqueSorted(forFacet("drivetrain").map((vehicle) => getReverseLabel(drivetrainMap, vehicle.drivetrain))),
    statuses: uniqueSorted(forFacet("status").map((vehicle) => getReverseLabel(statusMap, vehicle.status)))
  };
}

export async function getVehicles(params: VehicleSearchParams = {}, take?: number) {
  if (!process.env.DATABASE_URL) return filterDemoVehicles(params, take);

  const get = (key: string) => getParam(params, key);
  const where = getVehicleWhere(params);

  const sort = get("sort");
  const orderBy: Prisma.VehicleOrderByWithRelationInput =
    sort === "precio más bajo" ? { priceGtq: "asc" } :
    sort === "precio más alto" ? { priceGtq: "desc" } :
    sort === "menor kilometraje" ? { mileage: "asc" } :
    sort === "año más reciente" ? { year: "desc" } :
    { createdAt: "desc" };

  try {
    return await prisma.vehicle.findMany({
      where,
      take,
      orderBy,
      include: { images: { orderBy: { position: "asc" } }, branch: true, spec: true }
    });
  } catch {
    return filterDemoVehicles(params, take);
  }
}

export async function getVehicleFilterOptions(params: VehicleSearchParams = {}): Promise<VehicleFilterOptions> {
  if (!process.env.DATABASE_URL) return getDemoFilterOptions(params);

  try {
    const [types, brands, transmissions, branches, fuels, drivetrains, statuses] = await Promise.all([
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "type"), distinct: ["type"], select: { type: true }, orderBy: { type: "asc" } }),
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "brand"), distinct: ["brand"], select: { brand: true }, orderBy: { brand: "asc" } }),
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "transmission"), distinct: ["transmission"], select: { transmission: true }, orderBy: { transmission: "asc" } }),
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "branch"), distinct: ["branchId"], select: { branch: { select: { name: true } } }, orderBy: { branch: { name: "asc" } } }),
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "fuel"), distinct: ["fuel"], select: { fuel: true }, orderBy: { fuel: "asc" } }),
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "drivetrain"), distinct: ["drivetrain"], select: { drivetrain: true }, orderBy: { drivetrain: "asc" } }),
      prisma.vehicle.findMany({ where: getVehicleWhere(params, "status"), distinct: ["status"], select: { status: true }, orderBy: { status: "asc" } })
    ]);

    return {
      types: uniqueSorted(types.map((vehicle) => getReverseLabel(typeMap, vehicle.type))),
      brands: uniqueSorted(brands.map((vehicle) => vehicle.brand)),
      transmissions: uniqueSorted(transmissions.map((vehicle) => getReverseLabel(transmissionMap, vehicle.transmission))),
      branches: uniqueSorted(branches.map((vehicle) => vehicle.branch.name)),
      fuels: uniqueSorted(fuels.map((vehicle) => getReverseLabel(fuelMap, vehicle.fuel))),
      drivetrains: uniqueSorted(drivetrains.map((vehicle) => getReverseLabel(drivetrainMap, vehicle.drivetrain))),
      statuses: uniqueSorted(statuses.map((vehicle) => getReverseLabel(statusMap, vehicle.status)))
    };
  } catch {
    return getDemoFilterOptions(params);
  }
}

export async function getVehicleBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return demoVehicles.find((vehicle) => vehicle.slug === slug) ?? null;

  try {
    return await prisma.vehicle.findUnique({
      where: { slug },
      include: { images: { orderBy: { position: "asc" } }, branch: true, spec: true }
    });
  } catch {
    return demoVehicles.find((vehicle) => vehicle.slug === slug) ?? null;
  }
}

export async function getBranches() {
  if (!process.env.DATABASE_URL) return [];

  try {
    return await prisma.branch.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}
