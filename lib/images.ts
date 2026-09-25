/** Local facility imagery — bulk storage, semis & export only (no bottles). */
export const IMAGES = {
  logo: "/images/verdalia-logo.png",
  /** Verdalia-branded stainless storage units */
  storage: "/images/facility/storage-tanks.jpg",
  storagePng: "/images/facility/storage-tanks.png",
  /** Same storage (alias used across pages) */
  steelTanks: "/images/facility/steel-tanks.jpg",
  silos: "/images/facility/stainless-silos.jpg",
  /** Fleet of semi-trailers */
  semis: "/images/facility/semis.jpg",
  tanker: "/images/facility/tanker-truck.jpg",
  /** Maritime containers / port */
  port: "/images/facility/port-containers.jpg",
  /** Olive grove / origin */
  grove: "/images/facility/olive-grove.jpg",
  plant: "/images/facility/industrial-plant.jpg",
  products: {
    organic: "/images/products/olive-bio.jpg",
    extraVirgin: "/images/products/extra-vierge.jpg",
    refined: "/images/products/raffine.jpg",
    pomace: "/images/products/grignons.jpg",
  },
} as const;
