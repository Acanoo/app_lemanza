type GuatemalaPriceVehicle = {
  brand: string;
  type: string;
  year: number;
  mileage: number;
  priceUsd?: number | null;
  manualPriceGtq?: number | null;
};

const valueBrands = ["Toyota", "Honda", "Mazda", "Kia", "Hyundai"];
const premiumBrands = ["BMW", "Audi", "Lexus", "Porsche"];

export function calculateGuatemalaPrice(vehicle: GuatemalaPriceVehicle) {
  if (vehicle.manualPriceGtq) return Math.round(vehicle.manualPriceGtq);

  const usdToGtq = Number(process.env.USD_TO_GTQ || 7.8);
  let gtq = Number(vehicle.priceUsd || 0) * usdToGtq;
  const brand = vehicle.brand.trim();
  const type = vehicle.type.toString().toUpperCase();

  if (valueBrands.includes(brand)) gtq *= 1.12;
  if (premiumBrands.includes(brand)) gtq *= 1.2;
  if (type.includes("PICKUP") || type.includes("SUV")) gtq *= 1.14;

  if (vehicle.mileage > 90000) gtq *= 0.86;
  else if (vehicle.mileage > 60000) gtq *= 0.91;
  else if (vehicle.mileage > 35000) gtq *= 0.96;

  const age = new Date().getFullYear() - vehicle.year;
  if (age <= 1) gtq *= 1.08;
  else if (age <= 3) gtq *= 1.04;

  return Math.round(gtq / 100) * 100;
}
