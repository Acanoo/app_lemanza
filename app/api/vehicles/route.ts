import { NextRequest, NextResponse } from "next/server";
import { getVehicles } from "@/lib/vehicles";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const vehicles = await getVehicles(params);
  return NextResponse.json({ vehicles });
}
