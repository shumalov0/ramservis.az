import { MetadataRoute } from "next";
import { cars } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.ramservis.az";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/cars",
    "/services",
    "/booking",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const carRoutes: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${baseUrl}/car/${car.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...carRoutes];
}
