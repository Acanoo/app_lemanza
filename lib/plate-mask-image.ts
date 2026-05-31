import sharp from "sharp";

const ALLOWED_HOSTS = new Set(["www.superautosjack.com.gt", "superautosjack.com.gt"]);

type RedBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function getRedBounds(data: Buffer, width: number, height: number): RedBounds | null {
  const minX = Math.floor(width * 0.02);
  const maxX = Math.floor(width * 0.45);
  const minY = Math.floor(height * 0.24);
  const maxY = Math.floor(height * 0.78);
  let left = width;
  let top = height;
  let right = 0;
  let bottom = 0;
  let count = 0;

  for (let y = minY; y < maxY; y += 1) {
    for (let x = minX; x < maxX; x += 1) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const redDominant = red > 145 && green < 115 && blue < 120 && red > green * 1.35 && red > blue * 1.35;

      if (alpha > 120 && redDominant) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
        count += 1;
      }
    }
  }

  if (count < 18) return null;
  return { left, top, right, bottom };
}

function expandBounds(bounds: RedBounds, width: number, height: number) {
  const boxWidth = bounds.right - bounds.left;
  const boxHeight = bounds.bottom - bounds.top;
  const padX = Math.max(10, Math.round(boxWidth * 0.45));
  const padY = Math.max(8, Math.round(boxHeight * 0.55));

  return {
    left: Math.max(0, bounds.left - padX),
    top: Math.max(0, bounds.top - padY),
    width: Math.min(width - Math.max(0, bounds.left - padX), boxWidth + padX * 2),
    height: Math.min(height - Math.max(0, bounds.top - padY), boxHeight + padY * 2)
  };
}

export async function maskPlateImage(sourceUrl: string) {
  if (!isAllowedImageUrl(sourceUrl)) {
    throw new Error("Image host is not allowed");
  }

  const response = await fetch(sourceUrl, { headers: { "User-Agent": "LemanzaMotoresImageMask/1.0" } });
  if (!response.ok) throw new Error(`Image request failed: ${response.status}`);

  const input = Buffer.from(await response.arrayBuffer());
  const base = sharp(input).rotate().ensureAlpha();
  const { width, height } = await base.metadata();
  if (!width || !height) return input;

  const raw = await base.clone().raw().toBuffer();
  const redBounds = getRedBounds(raw, width, height);
  if (!redBounds) {
    return base.jpeg({ quality: 88 }).toBuffer();
  }

  const mask = expandBounds(redBounds, width, height);
  const blurredRegion = await base
    .clone()
    .extract(mask)
    .blur(16)
    .modulate({ saturation: 0.2, brightness: 1.08 })
    .jpeg({ quality: 88 })
    .toBuffer();

  return base
    .composite([{ input: blurredRegion, left: mask.left, top: mask.top }])
    .jpeg({ quality: 88 })
    .toBuffer();
}
