import { VehicleType, Transmission, FuelType, Drivetrain, VehicleStatus } from "@prisma/client";
import { calculateGuatemalaPrice } from "@/lib/pricing";
import { vehiclePhotoSets } from "@/lib/vehicle-visuals";

const branch = {
  id: "demo-branch-yurrita",
  name: "Agencia Yurrita",
  address: "Ruta 6, 9-18, Zona 4, Guatemala",
  phone: "2299-0101",
  mapsUrl: "https://maps.google.com/?q=Ruta+6+9-18+Zona+4+Guatemala",
  wazeUrl: "https://waze.com/ul?q=Ruta%206%209-18%20Zona%204%20Guatemala",
  createdAt: new Date(),
  updatedAt: new Date()
};

const baseVehicles = [
  ["Toyota", "Corolla Cross", "LE", 2024, VehicleType.SUV, 1200, 31500, "2.0L Dynamic Force"],
  ["Toyota", "RAV4", "XLE", 2023, VehicleType.SUV, 16400, 34500, "2.5L"],
  ["Subaru", "Forester", "Premium", 2022, VehicleType.SUV, 31200, 28900, "2.5L Boxer"],
  ["Kia", "Picanto", "EX", 2024, VehicleType.HATCHBACK, 600, 15900, "1.2L"],
  ["Lexus", "RX350L", "Luxury", 2020, VehicleType.SUV, 45800, 43900, "3.5L V6"],
  ["Mazda", "CX-5", "Touring", 2022, VehicleType.SUV, 27400, 27500, "2.5L Skyactiv"]
] as const;

export const demoVehicles = baseVehicles.map(([brand, model, trim, year, type, mileage, priceUsd, motor], index) => {
  const internalCode = `LM-DEMO-${String(index + 1).padStart(3, "0")}`;
  return {
    id: internalCode,
    slug: `${brand}-${model}-${year}-${internalCode}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    internalCode,
    type,
    brand,
    model,
    trim,
    year,
    mileage,
    priceUsd,
    priceGtq: calculateGuatemalaPrice({ brand, type, year, mileage, priceUsd }),
    manualPriceGtq: null,
    transmission: Transmission.AUTOMATICO,
    fuel: FuelType.GASOLINA,
    drivetrain: index % 2 ? Drivetrain.AWD : Drivetrain.DOS_POR_DOS,
    status: index === 2 ? VehicleStatus.RESERVADO : VehicleStatus.DISPONIBLE,
    motor,
    exteriorColor: ["Blanco", "Gris grafito", "Negro", "Azul profundo", "Plata", "Rojo"][index],
    interiorColor: "Negro",
    vin: null,
    doors: 5,
    displacement: motor.split(" ")[0],
    equipment: ["Aire acondicionado", "Pantalla táctil", "Cámara de retroceso", "Bluetooth", "Bolsas de aire"],
    warranty: "Garantía limitada disponible",
    observations: "Unidad demo para vista local sin base de datos.",
    has360: index === 0,
    branchId: branch.id,
    branch,
    spec: null,
    images: vehiclePhotoSets[index % vehiclePhotoSets.length].map((url, photoIndex) => ({
      id: `${internalCode}-${photoIndex}`,
      url,
      alt: `${brand} ${model} ${year}`,
      position: photoIndex,
      vehicleId: internalCode
    })),
    createdAt: new Date(),
    updatedAt: new Date()
  };
});
