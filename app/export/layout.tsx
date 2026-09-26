import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tunisia Olive Oil Bulk Export — Process & Global Logistics | Verdalia",
  description:
    "Tunisian olive oil bulk export process: flexitanks, IBCs, drums, customs documentation, laboratory analysis. Verdalia Company VC.",
  keywords: [
    "Tunisia olive oil export",
    "olive oil logistics",
    "flexitank olive oil",
    "Tunisian olive oil exporter",
    "bulk olive oil supply",
  ],
};

export default function ExportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
