import { MetadataRoute } from "next";
import { db } from "@/lib/db/db";
import { LOCALES } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.verdaliacompany.com";
  const siteUrl = rawUrl.includes("localhost") ? "https://www.verdaliacompany.com" : rawUrl;
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/products", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/export", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/certifications", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.90, changeFrequency: "weekly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => {
    const pageUrl = `${siteUrl}${r.path}`;
    const languages: Record<string, string> = {};
    for (const loc of LOCALES) {
      languages[loc] = pageUrl;
    }
    languages["x-default"] = pageUrl;

    return {
      url: pageUrl,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
      alternates: {
        languages,
      },
    };
  });

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = db.products.getAll(true);
    productEntries = products.map((p) => {
      const productUrl = `${siteUrl}/products/${p.slug}`;
      const languages: Record<string, string> = {};
      for (const loc of LOCALES) {
        languages[loc] = productUrl;
      }
      languages["x-default"] = productUrl;

      return {
        url: productUrl,
        lastModified: new Date(p.updated_at || now),
        changeFrequency: "weekly" as const,
        priority: 0.9,
        alternates: {
          languages,
        },
      };
    });
  } catch (err) {
    console.error("Error reading products for sitemap:", err);
  }

  return [...staticEntries, ...productEntries];
}
