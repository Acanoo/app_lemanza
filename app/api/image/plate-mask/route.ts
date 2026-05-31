import { NextRequest, NextResponse } from "next/server";
import { maskPlateImage } from "@/lib/plate-mask-image";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get("url");
  if (!sourceUrl) return new NextResponse("Missing image URL", { status: 400 });

  try {
    const image = await maskPlateImage(sourceUrl);
    return new NextResponse(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800"
      }
    });
  } catch {
    return NextResponse.redirect(sourceUrl);
  }
}
