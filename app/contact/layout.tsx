import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Export Huile d'Olive Tunisie | Demande de Devis",
  description:
    "Contactez Verdalia Company VC pour un devis d'huile d'olive tunisienne en vrac. Importateurs et distributeurs bienvenus.",
  keywords: [
    "devis huile d'olive Tunisie",
    "contact exportateur huile d'olive",
    "acheter huile d'olive Tunisie",
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
