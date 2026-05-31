export function getPlateMaskedImageUrl(url?: string) {
  if (!url) return undefined;
  try {
    const imageUrl = new URL(url);
    if (imageUrl.hostname === "www.superautosjack.com.gt" || imageUrl.hostname === "superautosjack.com.gt") {
      return `/api/image/plate-mask?url=${encodeURIComponent(url)}`;
    }
  } catch {
    return url;
  }

  return url;
}
