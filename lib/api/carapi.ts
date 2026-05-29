export async function carApiRequest<T>(path: string, init?: RequestInit): Promise<T | { configured: false }> {
  const baseUrl = process.env.CARAPI_BASE_URL;
  const token = process.env.CARAPI_TOKEN;
  if (!baseUrl || !token) return { configured: false };

  const response = await fetch(new URL(path, baseUrl), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...init?.headers
    },
    next: { revalidate: 86400 }
  });

  if (!response.ok) throw new Error("CarAPI request failed");
  return response.json() as Promise<T>;
}

export function getMakes() {
  return carApiRequest("/makes");
}

export function getModels(makeId: string) {
  return carApiRequest(`/models?make_id=${makeId}`);
}

export function decodeVin(vin: string) {
  return carApiRequest(`/vin/${vin}`);
}
