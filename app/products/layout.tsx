import type { Metadata } from "next";
import { SEO_BY_LOCALE } from "@/lib/seo";

const fr = SEO_BY_LOCALE.fr;

export const metadata: Metadata = {
  title: "Huile d'olive Tunisie — Grades & Export Vrac | Verdalia",
  description:
    "Catalogue huile d'olive tunisienne : extra vierge, bio, raffinée, grignons. Export vrac flexitank, IBC, fûts. " +
    fr.meta_description,
  keywords: fr.keywords,
  openGraph: {
    title: "Huile d'olive Tunisie — Catalogue export Verdalia",
    description: fr.meta_description,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
