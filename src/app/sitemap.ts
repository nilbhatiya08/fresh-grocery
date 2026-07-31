import type { MetadataRoute } from "next";
import { products, categories } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://farmora.vercel.app";
  const today = new Date().toISOString();
  return [
    { url: base, lastModified: today, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: today, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: today, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: today, changeFrequency: "monthly", priority: 0.5 },
    ...categories.map((c) => ({
      url: `${base}/shop?cat=${c.slug}`,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];
}
