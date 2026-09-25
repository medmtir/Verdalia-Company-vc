import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export Huile d'Olive Tunisie — Processus & Logistique Vrac",
  description:
    "Processus d'export huile d'olive tunisienne en vrac : flexitank, IBC, fûts, documents douaniers, analyses labo. Verdalia Company VC.",
  keywords: [
    "export huile d'olive Tunisie",
    "logistique huile d'olive",
    "flexitank huile d'olive",
    "exportateur huile d'olive Tunisie",
  ],
};

export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
