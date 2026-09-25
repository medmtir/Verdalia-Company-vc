import type { Locale } from "@/lib/types";

/** Strong multilingual SEO profiles targeting olive-oil Tunisia search intent */
export const SEO_BY_LOCALE: Record<
  Locale,
  {
    meta_title: string;
    meta_description: string;
    keywords: string[];
    og_locale: string;
  }
> = {
  fr: {
    meta_title:
      "Huile d'Olive Tunisie | Export Vrac – Verdalia Company VC",
    meta_description:
      "Exportateur d'huile d'olive tunisienne en vrac : extra vierge, bio, raffinée et grignons. Flexitank, IBC, fûts. Fournisseur B2B Tunisie pour importateurs.",
    keywords: [
      "huile d'olive Tunisie",
      "huile olivier Tunisie",
      "huile d'olive tunisienne",
      "exportateur huile d'olive Tunisie",
      "huile d'olive extra vierge Tunisie",
      "huile d'olive biologique Tunisie",
      "huile d'olive vrac Tunisie",
      "fournisseur huile d'olive Tunisie",
      "achat huile d'olive Tunisie",
      "export huile d'olive",
      "huile d'olive en gros Tunisie",
      "olive oil Tunisia",
      "huile olive export",
      "grignons d'olive Tunisie",
      "flexitank huile d'olive",
    ],
    og_locale: "fr_FR",
  },
  en: {
    meta_title:
      "Tunisian Olive Oil Exporter | Bulk Export – Verdalia Company VC",
    meta_description:
      "Tunisian olive oil exporter: extra virgin, organic, refined and pomace in bulk. Flexitank, IBC, drums. B2B supplier from Tunisia for importers worldwide.",
    keywords: [
      "Tunisian olive oil",
      "olive oil Tunisia",
      "Tunisian olive oil exporter",
      "bulk olive oil Tunisia",
      "extra virgin olive oil Tunisia",
      "organic olive oil Tunisia",
      "olive oil supplier Tunisia",
      "wholesale olive oil Tunisia",
      "olive oil export Tunisia",
      "buy olive oil from Tunisia",
      "pomace olive oil Tunisia",
      "flexitank olive oil",
      "huile d'olive Tunisie",
    ],
    og_locale: "en_US",
  },
  ar: {
    meta_title:
      "زيت زيتون تونسي للتصدير | فيرداليا — تصدير بالجملة",
    meta_description:
      "تصدير زيت الزيتون التونسي بالجملة: بكر ممتاز، عضوي، مكرر وتفل. فليكسي تانك وحاويات IBC. مورد B2B من تونس للمستوردين.",
    keywords: [
      "زيت زيتون تونسي",
      "تصدير زيت الزيتون تونس",
      "مورد زيت زيتون تونسي",
      "زيت زيتون بكر ممتاز تونس",
      "زيت زيتون بيولوجي تونس",
      "زيت زيتون بالجملة تونس",
      "شراء زيت زيتون تونس",
      "شركة تصدير زيت زيتون",
      "زيت زيتون سائب",
      "huile d'olive Tunisie",
    ],
    og_locale: "ar_TN",
  },
  es: {
    meta_title:
      "Aceite de Oliva Túnez | Exportación a Granel – Verdalia",
    meta_description:
      "Exportador de aceite de oliva tunecino a granel: virgen extra, ecológico, refinado y orujo. Flexitank, IBC, bidones. Proveedor B2B desde Túnez.",
    keywords: [
      "aceite de oliva Túnez",
      "aceite de oliva tunecino",
      "exportador aceite de oliva Túnez",
      "aceite de oliva virgen extra Túnez",
      "aceite de oliva ecológico Túnez",
      "aceite de oliva a granel Túnez",
      "proveedor aceite de oliva Túnez",
      "comprar aceite de oliva Túnez",
      "huile d'olive Tunisie",
    ],
    og_locale: "es_ES",
  },
  it: {
    meta_title:
      "Olio d'Oliva Tunisia | Esportazione Sfusa – Verdalia",
    meta_description:
      "Esportatore di olio d'oliva tunisino sfuso: extra vergine, biologico, raffinato e sansa. Flexitank, IBC, fusti. Fornitore B2B dalla Tunisia.",
    keywords: [
      "olio d'oliva Tunisia",
      "olio d'oliva tunisino",
      "esportatore olio d'oliva Tunisia",
      "olio extra vergine di oliva Tunisia",
      "olio d'oliva biologico Tunisia",
      "olio d'oliva sfuso Tunisia",
      "fornitore olio d'oliva Tunisia",
      "comprare olio d'oliva Tunisia",
      "huile d'olive Tunisie",
    ],
    og_locale: "it_IT",
  },
};

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Verdalia Company VC",
    alternateName: ["Verdalia", "Verdalia VC"],
    url: siteUrl,
    logo: `${siteUrl}/images/verdalia-logo.png`,
    description:
      "Exportateur tunisien d'huile d'olive en vrac — Tunisian olive oil bulk exporter.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TN",
      addressLocality: "Tunisia",
    },
    areaServed: "Worldwide",
    knowsLanguage: ["fr", "en", "ar", "es", "it"],
    sameAs: [],
  };
}

export function buildExporterJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ExportAction",
    agent: {
      "@type": "Organization",
      name: "Verdalia Company VC",
      url: siteUrl,
    },
    object: {
      "@type": "Product",
      name: "Huile d'olive tunisienne / Tunisian olive oil",
      category: "Olive Oil",
      countryOfOrigin: {
        "@type": "Country",
        name: "Tunisia",
      },
    },
  };
}

export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Verdalia Company VC",
    url: siteUrl,
    inLanguage: ["fr", "en", "ar", "es", "it"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products`,
      "query-input": "required name=search_term_string",
    },
  };
}
