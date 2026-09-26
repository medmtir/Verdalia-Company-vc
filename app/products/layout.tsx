import type { Metadata } from "next";
import { SEO_BY_LOCALE } from "@/lib/seo";

const en = SEO_BY_LOCALE.en;

export const metadata: Metadata = {
  title: "Tunisian Olive Oil Bulk Export — Grades & Specifications | Verdalia",
  description:
    "Verdalia Tunisian olive oil catalog: Extra Virgin, Organic, Pure, Pomace. Bulk export in flexitanks, IBCs, drums. " +
    en.meta_description,
  keywords: en.keywords,
  openGraph: {
    title: "Tunisian Olive Oil Bulk Export — Verdalia Catalog",
    description: en.meta_description,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
