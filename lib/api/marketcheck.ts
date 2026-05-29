type MarketCheckSearchParams = {
  make?: string;
  model?: string;
  year?: number;
  dealerId?: string;
};

export async function searchMarketCheckInventory(params: MarketCheckSearchParams) {
  const baseUrl = process.env.MARKETCHECK_BASE_URL;
  const apiKey = process.env.MARKETCHECK_API_KEY;
  if (!baseUrl || !apiKey) return { listings: [], configured: false };

  const url = new URL("/search/car/active", baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error("MarketCheck inventory request failed");
  return response.json();
}
