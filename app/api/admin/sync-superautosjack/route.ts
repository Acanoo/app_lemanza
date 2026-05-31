import { NextRequest, NextResponse } from "next/server";
import { syncSuperAutosJackCatalog } from "@/lib/superautosjack-scraper";

function hasSyncToken(request: NextRequest) {
  const expectedToken = process.env.SCRAPE_SECRET_TOKEN;
  if (!expectedToken) return false;
  return request.headers.get("x-sync-token") === expectedToken;
}

function hasCronToken(request: NextRequest) {
  const expectedToken = process.env.CRON_SECRET || process.env.SCRAPE_SECRET_TOKEN;
  if (!expectedToken) return false;
  return request.headers.get("authorization") === `Bearer ${expectedToken}`;
}

export async function POST(request: NextRequest) {
  if (!hasSyncToken(request)) {
    return NextResponse.json({ ok: false, totalFound: 0, totalUpserted: 0, updatedAt: new Date().toISOString(), errors: ["Invalid sync token"] }, { status: 401 });
  }

  const result = await syncSuperAutosJackCatalog();
  return NextResponse.json(result, { status: result.ok ? 200 : 207 });
}

export async function GET(request: NextRequest) {
  if (!hasCronToken(request)) {
    return NextResponse.json({ ok: false, totalFound: 0, totalUpserted: 0, updatedAt: new Date().toISOString(), errors: ["Invalid cron token"] }, { status: 401 });
  }

  const result = await syncSuperAutosJackCatalog();
  return NextResponse.json(result, { status: result.ok ? 200 : 207 });
}
