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

function getParam(params: VehicleSearchParams, key: string) {
  return Array.isArray(params[key]) ? params[key]?.[0] : params[key];
}

function filterDemoVehicles(params: VehicleSearchParams, take?: number) {
  const q = getParam(params, "q")?.toLowerCase();
  const minYear = Number(getParam(params, "minYear") || 0);
  const maxYear = Number(getParam(params, "maxYear") || 9999);
  const minPrice = Number(getParam(params, "minPrice") || 0);
  const maxPrice = Number(getParam(params, "maxPrice") || 99999999);
  const minMileage = Number(getParam(params, "minMileage") || 0);
  const maxMileage = Number(getParam(params, "maxMileage") || 99999999);

  let vehicles = demoVehicles.filter((vehicle) => {
    const matchesQuery = !q || `${vehicle.brand} ${vehicle.model} ${vehicle.year} ${vehicle.internalCode}`.toLowerCase().includes(q);
    const matchesType = !getParam(params, "type") || vehicle.type === typeMap[getParam(params, "type")!];
    const matchesBrand = !getParam(params, "brand") || vehicle.brand === getParam(params, "brand");
    const matchesTransmission = !getParam(params, "transmission") || vehicle.transmission === transmissionMap[getParam(params, "transmission")!];
    const matchesFuel = !getParam(params, "fuel") || vehicle.fuel === fuelMap[getParam(params, "fuel")!];
    const matchesDrivetrain = !getParam(params, "drivetrain") || vehicle.drivetrain === drivetrainMap[getParam(params, "drivetrain")!];
    const matchesStatus = !getParam(params, "status") || vehicle.status === statusMap[getParam(params, "status")!];
    const matchesBranch = !getParam(params, "branch") || vehicle.branch.name === getParam(params, "branch");
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

export async function getVehicles(params: VehicleSearchParams = {}, take?: number) {
  if (!process.env.DATABASE_URL) return filterDemoVehicles(params, take);

  const where: Prisma.VehicleWhereInput = {};
  const get = (key: string) => getParam(params, key);

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
