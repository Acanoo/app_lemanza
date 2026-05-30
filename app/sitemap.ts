import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/vehicles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/catalogo", "/sobre-nosotros", "/servicios", "/beneficios", "/sucursales", "/contacto"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));
  const vehicles = await getVehicles();
  return [
    ...staticRoutes,
    ...vehicles.map((vehicle) => ({
      url: `${siteUrl}/catalogo/${vehicle.slug}`,
      lastModified: vehicle.updatedAt
    }))
  ];
}
