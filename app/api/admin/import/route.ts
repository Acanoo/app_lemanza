import { NextResponse } from "next/server";
import { searchMarketCheckInventory } from "@/lib/api/marketcheck";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const result = await searchMarketCheckInventory(payload);
  return NextResponse.json({
    source: "marketcheck",
    imported: 0,
    message: "Integración preparada. Mapea listings a Vehicle antes de activar importación automática.",
    result
  });
}
