import { PrismaClient, VehicleStatus, VehicleType, Transmission, FuelType, Drivetrain, RoleName } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateGuatemalaPrice } from "../lib/pricing";
import { vehiclePhotoSets } from "../lib/vehicle-visuals";

const prisma = new PrismaClient();

const branches = [
  {
    name: "Agencia Yurrita",
    address: "Ruta 6, 9-18, Zona 4, Guatemala",
    phone: "2299-0101",
    mapsUrl: "https://maps.google.com/?q=Ruta+6+9-18+Zona+4+Guatemala",
    wazeUrl: "https://waze.com/ul?q=Ruta%206%209-18%20Zona%204%20Guatemala"
  },
  {
    name: "Agencia Roosevelt",
    address: "Km. 14 Calzada Roosevelt, 5-25 Zona 3 de Mixco, Guatemala",
    phone: "2299-0202",
    mapsUrl: "https://maps.google.com/?q=Km+14+Calzada+Roosevelt+Mixco",
    wazeUrl: "https://waze.com/ul?q=Km%2014%20Calzada%20Roosevelt%20Mixco"
  },
  {
    name: "Agencia Zona 10",
    address: "10 avenida 14-73, zona 10 Guatemala",
    phone: "2299-0303",
    mapsUrl: "https://maps.google.com/?q=10+avenida+14-73+zona+10+Guatemala",
    wazeUrl: "https://waze.com/ul?q=10%20avenida%2014-73%20zona%2010%20Guatemala"
  },
  {
    name: "Agencia Virtual",
    address: "Atención digital para toda Guatemala",
    phone: "2299-0404",
    mapsUrl: "https://maps.google.com/?q=Guatemala",
    wazeUrl: "https://waze.com/ul?q=Guatemala"
  }
];

const vehicles = [
  ["Toyota", "Corolla Cross", "LE", 2024, VehicleType.SUV, 1200, 31500, "2.0L Dynamic Force", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.DOS_POR_DOS],
  ["Toyota", "RAV4", "XLE", 2023, VehicleType.SUV, 16400, 34500, "2.5L", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["Subaru", "Forester", "Premium", 2022, VehicleType.SUV, 31200, 28900, "2.5L Boxer", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["Kia", "Picanto", "EX", 2024, VehicleType.HATCHBACK, 600, 15900, "1.2L", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.DOS_POR_DOS],
  ["Lexus", "RX350L", "Luxury", 2020, VehicleType.SUV, 45800, 43900, "3.5L V6", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["Mazda", "CX-5", "Touring", 2022, VehicleType.SUV, 27400, 27500, "2.5L Skyactiv", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.DOS_POR_DOS],
  ["Hyundai", "Tucson", "Limited", 2023, VehicleType.SUV, 18800, 29900, "2.0L", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.DOS_POR_DOS],
  ["Mitsubishi", "L200", "GLS", 2021, VehicleType.PICKUP, 52100, 31200, "2.4L Turbo Diesel", Transmission.MECANICO, FuelType.DIESEL, Drivetrain.CUATRO_POR_CUATRO],
  ["Nissan", "Frontier", "Pro-4X", 2022, VehicleType.PICKUP, 34200, 33500, "2.5L Turbo Diesel", Transmission.AUTOMATICO, FuelType.DIESEL, Drivetrain.CUATRO_POR_CUATRO],
  ["Honda", "CR-V", "EXL", 2021, VehicleType.SUV, 40700, 30900, "1.5L Turbo", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["BMW", "X3", "xDrive30i", 2021, VehicleType.SUV, 36200, 41900, "2.0L Turbo", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["Audi", "Q5", "Premium Plus", 2020, VehicleType.SUV, 48900, 38500, "2.0L TFSI", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["Ford", "Ranger", "XLT", 2022, VehicleType.PICKUP, 29700, 32900, "2.2L Diesel", Transmission.MECANICO, FuelType.DIESEL, Drivetrain.CUATRO_POR_CUATRO],
  ["Chevrolet", "Tracker", "Premier", 2023, VehicleType.SUV, 14500, 23900, "1.2L Turbo", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.DOS_POR_DOS],
  ["Jeep", "Wrangler", "Sahara", 2021, VehicleType.SUV, 22600, 46900, "3.6L V6", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.CUATRO_POR_CUATRO],
  ["Volkswagen", "Amarok", "Highline", 2020, VehicleType.PICKUP, 58300, 31900, "3.0L V6 Diesel", Transmission.AUTOMATICO, FuelType.DIESEL, Drivetrain.CUATRO_POR_CUATRO],
  ["Chery", "Tiggo 7 Pro", "Comfort", 2024, VehicleType.SUV, 80, 22500, "1.5L Turbo", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.DOS_POR_DOS],
  ["Maxus", "T60", "Elite", 2023, VehicleType.PICKUP, 9800, 26900, "2.8L Turbo Diesel", Transmission.MECANICO, FuelType.DIESEL, Drivetrain.CUATRO_POR_CUATRO],
  ["Mini Cooper", "Countryman", "S", 2022, VehicleType.HATCHBACK, 22100, 30900, "2.0L Turbo", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD],
  ["Porsche", "Macan", "Base", 2020, VehicleType.SUV, 39100, 52900, "2.0L Turbo", Transmission.AUTOMATICO, FuelType.GASOLINA, Drivetrain.AWD]
] as const;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.role.upsert({
    where: { name: RoleName.ADMIN },
    update: {},
    create: { name: RoleName.ADMIN }
  });

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.ADMIN } });
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@lemanzamotores.gt" },
    update: {},
    create: {
      name: "Administrador",
      email: process.env.ADMIN_EMAIL || "admin@lemanzamotores.gt",
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || "CambiarEstaClave123", 10),
      roleId: adminRole.id
    }
  });

  for (const branch of branches) {
    await prisma.branch.upsert({ where: { name: branch.name }, update: branch, create: branch });
  }

  const dbBranches = await prisma.branch.findMany();
  for (const [index, item] of vehicles.entries()) {
    const [brand, model, trim, year, type, mileage, priceUsd, motor, transmission, fuel, drivetrain] = item;
    const internalCode = `LM-${String(index + 1).padStart(4, "0")}`;
    const branch = dbBranches[index % dbBranches.length];
    const priceGtq = calculateGuatemalaPrice({ brand, type, year, mileage, priceUsd });
    const slug = slugify(`${brand}-${model}-${year}-${internalCode}`);

    await prisma.vehicle.upsert({
      where: { internalCode },
      update: {},
      create: {
        slug,
        internalCode,
        type,
        brand,
        model,
        trim,
        year,
        mileage,
        priceUsd,
        priceGtq,
        transmission,
        fuel,
        drivetrain,
        motor,
        exteriorColor: ["Blanco", "Gris grafito", "Negro", "Azul profundo", "Plata"][index % 5],
        interiorColor: ["Negro", "Beige", "Gris"][index % 3],
        doors: type === VehicleType.PICKUP ? 4 : 5,
        displacement: motor.split(" ")[0],
        equipment: ["Aire acondicionado", "Pantalla táctil", "Cámara de retroceso", "Bluetooth", "Bolsas de aire"],
        warranty: index % 3 === 0 ? "Garantía de agencia vigente" : "Garantía limitada disponible",
        observations: "Unidad inspeccionada, lista para financiamiento y entrega en Guatemala.",
        has360: index % 5 === 0,
        status: index % 9 === 0 ? VehicleStatus.RESERVADO : VehicleStatus.DISPONIBLE,
        branchId: branch.id,
        images: {
          create: vehiclePhotoSets[index % vehiclePhotoSets.length].map((url, photoIndex) => ({
            url,
            alt: `${brand} ${model} ${year}`,
            position: photoIndex
          }))
        },
        spec: {
          create: {
            cylinders: motor.includes("V6") ? 6 : 4,
            horsepower: 160 + index * 7,
            torque: `${180 + index * 12} Nm`,
            seating: type === VehicleType.PICKUP ? 5 : 5,
            origin: "Inventario Guatemala",
            marketSource: "Seed local"
          }
        }
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
