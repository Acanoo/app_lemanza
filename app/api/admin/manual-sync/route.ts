import { NextResponse } from "next/server";
import { syncSuperAutosJackCatalog } from "@/lib/superautosjack-scraper";

export async function POST() {
  const result = await syncSuperAutosJackCatalog();
  return NextResponse.json(result, { status: result.ok ? 200 : 207 });
}
