import sharp from "sharp";

const ALLOWED_HOSTS = new Set(["www.superautosjack.com.gt", "superautosjack.com.gt"]);

type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

type Candidate = Bounds & {
  redPixels: number;
  score: number;
};

function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function isPlateRed(data: Buffer, index: number) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const alpha = data[index + 3];
  const brightness = (red + green + blue) / 3;

  return alpha > 140 && red > 120 && green < 150 && blue < 150 && brightness < 230 && red > green * 1.12 && red > blue * 1.12;
}

function getPlateCandidates(data: Buffer, width: number, height: number) {
  const redMask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      if (isPlateRed(data, index)) redMask[y * width + x] = 1;
    }
  }

  const componentMask = redMask;
  const visited = new Uint8Array(width * height);
  const candidates: Candidate[] = [];
  const stack: number[] = [];

  for (let start = 0; start < componentMask.length; start += 1) {
    if (!componentMask[start] || visited[start]) continue;

    let left = width;
    let top = height;
    let right = 0;
    let bottom = 0;
    let redPixels = 0;

    visited[start] = 1;
    stack.push(start);

    while (stack.length > 0) {
      const current = stack.pop() as number;
      const x = current % width;
      const y = Math.floor(current / width);

      if (redMask[current]) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
        redPixels += 1;
      }

      const neighbors = [current - 1, current + 1, current - width, current + width];
      for (const next of neighbors) {
        if (next < 0 || next >= componentMask.length || visited[next] || !componentMask[next]) continue;
        const nextX = next % width;
        if ((next === current - 1 && nextX > x) || (next === current + 1 && nextX < x)) continue;
        visited[next] = 1;
        stack.push(next);
      }
    }

    if (redPixels < 18) continue;

    const boxWidth = right - left + 1;
    const boxHeight = bottom - top + 1;
    const boxArea = boxWidth * boxHeight;
    const aspect = boxWidth / boxHeight;
    const redDensity = redPixels / boxArea;
    const areaRatio = boxArea / (width * height);
    const centerX = (left + right) / 2 / width;
    const centerY = (top + bottom) / 2 / height;

    if (boxWidth < width * 0.025 || boxWidth > width * 0.2) continue;
    if (boxHeight < height * 0.025 || boxHeight > height * 0.18) continue;
    if (areaRatio < 0.0008 || areaRatio > 0.025) continue;
    if (aspect < 0.45 || aspect > 2.35) continue;
    if (redDensity < 0.04 || redDensity > 0.55) continue;
    if (centerY < 0.34 || centerY > 0.86 || centerX > 0.64) continue;

    const sizeScore = 1 - Math.min(Math.abs(areaRatio - 0.004) / 0.004, 1);
    const densityScore = 1 - Math.min(Math.abs(redDensity - 0.16) / 0.16, 1);
    const positionScore = 1 - Math.min(Math.abs(centerY - 0.58) / 0.32, 1);
    const frontScore = 1 - Math.min(centerX / 0.64, 1);
    const score = sizeScore * 0.4 + densityScore * 0.3 + positionScore * 0.2 + frontScore * 0.1;

    candidates.push({ left, top, right, bottom, redPixels, score });
  }

  return candidates.sort((a, b) => b.score - a.score);
}

function expandToPlate(bounds: Bounds, width: number, height: number) {
  const padX = 0;
  const padY = 0;
  const left = Math.max(0, bounds.left - padX);
  const top = Math.max(0, bounds.top - padY);
  const right = Math.min(width - 1, bounds.right + padX);
  const bottom = Math.min(height - 1, bounds.bottom + padY);

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1
  };
}

export async function detectPlateMask(input: Buffer) {
  const base = sharp(input).rotate().ensureAlpha();
  const { width, height } = await base.metadata();
  if (!width || !height) return null;

  const raw = await base.clone().raw().toBuffer();
  const plate = getPlateCandidates(raw, width, height)[0];
  if (!plate) return null;

  return expandToPlate(plate, width, height);
}

export async function maskPlateBuffer(input: Buffer) {
  const base = sharp(input).rotate().ensureAlpha();
  const mask = await detectPlateMask(input);
  if (!mask) return base.jpeg({ quality: 88 }).toBuffer();

  const blurredRegion = await base
    .clone()
    .extract(mask)
    .blur(10)
    .modulate({ saturation: 0.15, brightness: 1.12 })
    .jpeg({ quality: 90 })
    .toBuffer();

  return base
    .composite([{ input: blurredRegion, left: mask.left, top: mask.top }])
    .jpeg({ quality: 90 })
    .toBuffer();
}

export async function maskPlateImage(sourceUrl: string) {
  if (!isAllowedImageUrl(sourceUrl)) {
    throw new Error("Image host is not allowed");
  }

  const response = await fetch(sourceUrl, { headers: { "User-Agent": "LemanzaMotoresImageMask/1.1" } });
  if (!response.ok) throw new Error(`Image request failed: ${response.status}`);

  const input = Buffer.from(await response.arrayBuffer());
  return maskPlateBuffer(input);
}
