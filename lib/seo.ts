import type { Locale } from "@/lib/types";

/** Strong multilingual SEO profiles targeting olive-oil Tunisia search intent & brand supremacy */
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
      "Verdalia Company VC — Exportateur Huile d'Olive Tunisie | Vrac Extra Vierge & Bio",
    meta_description:
      "Verdalia Company VC : Exportateur leader d'huile d'olive tunisienne en vrac (Extra Vierge, Bio, Raffinée, Grignons). Flexitank, IBC et fûts pour importateurs et industriels internationaux.",
    keywords: [
      "Verdalia",
      "Verdalia Company",
      "Verdalia Company VC",
      "Verdalia Tunisie",
      "Verdalia olive oil",
      "societe Verdalia",
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
      "societe huile d olive tunisie",
      "olive oil Tunisia",
      "huile olive export",
      "grignons d'olive Tunisie",
      "flexitank huile d'olive",
      "huile d olive chemlali",
      "huile d olive chetoui",
    ],
    og_locale: "fr_FR",
  },
  en: {
    meta_title:
      "Verdalia Company VC — Tunisian Olive Oil Exporter | Bulk Extra Virgin & Organic",
    meta_description:
      "Verdalia Company VC: Premier Tunisian olive oil producer and bulk exporter (Extra Virgin, Organic, Refined, Pomace). Flexitanks, IBC totes, and drums for B2B importers worldwide.",
    keywords: [
      "Verdalia",
      "Verdalia Company",
      "Verdalia Company VC",
      "Verdalia Tunisia",
      "Verdalia olive oil",
      "Verdalia company tunisia",
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
      "refined olive oil Tunisia",
      "flexitank olive oil",
      "IBC olive oil",
      "Chemlali olive oil",
      "Chetoui olive oil",
      "huile d'olive Tunisie",
    ],
    og_locale: "en_US",
  },
  ar: {
    meta_title:
      "شركة فيرداليا | تصدير زيت الزيتون التونسي بالجملة — Verdalia Company VC",
    meta_description:
      "شركة فيرداليا (Verdalia Company VC): تصدير وتوريد زيت الزيتون التونسي الفاخر بالجملة (بكر ممتاز، عضوي، مكرر وتفل). شحن دولي في فليكسي تانك وحاويات لمستوردي العالم.",
    keywords: [
      "فيرداليا",
      "شركة فيرداليا",
      "Verdalia",
      "Verdalia Company",
      "Verdalia Company VC",
      "زيت زيتون تونسي",
      "تصدير زيت الزيتون تونس",
      "مورد زيت زيتون تونسي",
      "زيت زيتون بكر ممتاز تونس",
      "زيت زيتون بيولوجي تونس",
      "زيت زيتون بالجملة تونس",
      "شراء زيت زيتون تونس",
      "شركة تصدير زيت زيتون",
      "زيت زيتون سائب فليكسي تانك",
      "زيت زيتون الشملالي",
      "زيت زيتون الشتوي",
      "huile d'olive Tunisie",
    ],
    og_locale: "ar_TN",
  },
  es: {
    meta_title:
      "Verdalia Company VC — Exportador Aceite de Oliva Túnez | Granel Virgen Extra",
    meta_description:
      "Verdalia Company VC: Exportador líder de aceite de oliva tunecino a granel (Virgen Extra, Ecológico, Refinado y Orujo). Flexitank, IBC y bidones para importadores internacionales.",
    keywords: [
      "Verdalia",
      "Verdalia Company",
      "Verdalia Company VC",
      "aceite de oliva Túnez",
      "aceite de oliva tunecino",
      "exportador aceite de oliva Túnez",
      "aceite de oliva virgen extra Túnez",
      "aceite de oliva ecológico Túnez",
      "aceite de oliva a granel Túnez",
      "proveedor aceite de oliva Túnez",
      "comprar aceite de oliva Túnez",
      "flexitank aceite de oliva",
      "huile d'olive Tunisie",
    ],
    og_locale: "es_ES",
  },
  it: {
    meta_title:
      "Verdalia Company VC — Esportatore Olio d'Oliva Tunisia | Sfuso Extra Vergine",
    meta_description:
      "Verdalia Company VC: Produttore ed esportatore di olio d'oliva tunisino sfuso di alta qualità (Extra Vergine, Biologico, Raffinato e Sansa). Flexitank e IBC per importatori.",
    keywords: [
      "Verdalia",
      "Verdalia Company",
      "Verdalia Company VC",
      "olio d'oliva Tunisia",
      "olio d'oliva tunisino",
      "esportatore olio d'oliva Tunisia",
      "olio extra vergine di oliva Tunisia",
      "olio d'oliva biologico Tunisia",
      "olio d'oliva sfuso Tunisia",
      "fornitore olio d'oliva Tunisia",
      "comprare olio d'oliva Tunisia",
      "flexitank olio oliva",
      "huile d'olive Tunisie",
    ],
    og_locale: "it_IT",
  },
};

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Corporation"],
    "@id": `${siteUrl}/#organization`,
    name: "Verdalia Company VC",
    legalName: "Verdalia Company VC",
    alternateName: [
      "Verdalia",
      "Verdalia VC",
      "Verdalia Company",
      "Verdalia Tunisia",
      "Verdalia Tunisie",
      "شركة فيرداليا",
      "فيرداليا",
    ],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/verdalia-logo.png`,
      caption: "Verdalia Company VC Logo",
    },
    image: `${siteUrl}/images/verdalia-logo.png`,
    description:
      "Verdalia Company VC is a premier Tunisian olive oil producer and international bulk exporter: extra virgin, organic, refined, and pomace olive oil in flexitanks, IBC totes, and drums.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TN",
      addressLocality: "Tunisia",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contact@verdalia.com",
        availableLanguage: ["English", "French", "Arabic", "Italian", "Spanish"],
      },
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
    knowsLanguage: ["en", "fr", "ar", "es", "it"],
    knowsAbout: [
      "Tunisian Olive Oil",
      "Extra Virgin Olive Oil",
      "Bulk Olive Oil Export",
      "Organic Olive Oil",
      "Chemlali Olive Oil",
      "Chetoui Olive Oil",
      "Flexitank Oil Logistics",
      "IBC Totes Bulk Export",
      "IOC Olive Oil Standards",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tunisian Bulk Olive Oils",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Extra Virgin Olive Oil (Huile d'olive extra vierge)",
            description: "Premium cold-extracted Tunisian extra virgin olive oil with acidity < 0.8% in bulk flexitanks and IBCs.",
            category: "Olive Oil",
            countryOfOrigin: { "@type": "Country", name: "Tunisia" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Organic Extra Virgin Olive Oil (Huile d'olive biologique)",
            description: "Certified USDA Organic and EU Bio extra virgin olive oil from Tunisian certified groves.",
            category: "Organic Olive Oil",
            countryOfOrigin: { "@type": "Country", name: "Tunisia" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Refined Olive Oil (Huile d'olive raffinée)",
            description: "Neutral high-stability refined olive oil for industrial food processing and blending.",
            category: "Refined Olive Oil",
            countryOfOrigin: { "@type": "Country", name: "Tunisia" },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Olive Pomace Oil (Huile de grignons d'olive)",
            description: "Crude and refined olive pomace oil for frying and industrial formulations.",
            category: "Olive Pomace Oil",
            countryOfOrigin: { "@type": "Country", name: "Tunisia" },
          },
        },
      ],
    },
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
      name: "Tunisian olive oil / Huile d'olive tunisienne en vrac",
      category: "Olive Oil",
      countryOfOrigin: {
        "@type": "Country",
        name: "Tunisia",
      },
    },
    recipient: {
      "@type": "Audience",
      audienceType: "International B2B Importers, Distributors, and Bottlers",
    },
  };
}

export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Verdalia Company VC",
    alternateName: "Verdalia",
    url: siteUrl,
    inLanguage: ["en", "fr", "ar", "es", "it"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFAQJsonLd(siteUrl: string, locale: Locale) {
  const faqsByLocale: Record<Locale, Array<{ q: string; a: string }>> = {
    fr: [
      {
        q: "Qui est Verdalia Company VC ?",
        a: "Verdalia Company VC est un producteur et exportateur tunisien leader d'huile d'olive en vrac, spécialisé dans l'huile d'olive extra vierge, biologique, raffinée et de grignons pour les importateurs internationaux et industriels agroalimentaires.",
      },
      {
        q: "Quels sont les conditionnements en vrac proposés pour l'exportation ?",
        a: "Nous fournissons des expéditions maritimes internationales en Flexitanks de 21 000 à 24 000 litres, cuves IBC de 1 000 litres, et fûts métalliques ou alimentaires de 200 litres.",
      },
      {
        q: "Quelles certifications détiennent les huiles d'olive Verdalia ?",
        a: "Nos huiles répondent rigoureusement aux normes du Conseil Oléicole International (COI / IOC), et bénéficient des certifications ISO 22000, ISO 9001, HACCP, Bio / USDA Organic, Halal et Kosher.",
      },
      {
        q: "Comment commander ou demander un devis / cotation (RFQ) ?",
        a: "Les importateurs et négociants peuvent soumettre une demande de devis en direct sur notre site web officiel ou contacter notre département export par email à contact@verdalia.com.",
      },
    ],
    en: [
      {
        q: "Who is Verdalia Company VC?",
        a: "Verdalia Company VC is a premier Tunisian olive oil producer and bulk exporter, supplying certified high-grade extra virgin, organic, refined, and pomace olive oil worldwide to industrial bottlers and food distributors.",
      },
      {
        q: "What bulk packaging options does Verdalia offer for export?",
        a: "We provide global shipping in 21,000L–24,000L Flexitanks, 1,000L IBC totes, and 200L food-grade drums suited for sea freight and bulk logistics.",
      },
      {
        q: "What certifications do Verdalia olive oils hold?",
        a: "Our olive oils strictly comply with IOC (International Olive Council) chemical and sensory standards, certified with ISO 22000, ISO 9001, HACCP, USDA Organic, EU Organic, Halal, and Kosher.",
      },
      {
        q: "How can international buyers request a quote or price list?",
        a: "Importers and commercial distributors can request an instant quotation via our website RFQ form or directly email our export division at contact@verdalia.com.",
      },
    ],
    ar: [
      {
        q: "ما هي شركة فيرداليا (Verdalia Company VC)؟",
        a: "شركة فيرداليا هي شركة تونسية رائدة متخصصة في إنتاج وتصدير زيت الزيتون التونسي بالجملة (بكر ممتاز، بيولوجي، مكرر وتفل الزيتون) للمستوردين والمصانع حول العالم.",
      },
      {
        q: "ما هي خيارات التعبئة السائبة للتصدير الدولي؟",
        a: "نوفر حاويات فليكسي تانك (Flexitank) بسعة 21,000 إلى 24,000 لتر، وحاويات IBC بسعة 1,000 لتر، وبراميل غذائية سعة 200 لتر للشحن البحري السريع.",
      },
      {
        q: "ما هي شهادات الجودة التي يحملها زيت زيتون فيرداليا؟",
        a: "مطابق لمواصفات المجلس الدولي للزيتون (IOC)، مع شهادات ISO 22000 وISO 9001 وHACCP والعضوية والبيولوجية وشهادات الحلال.",
      },
      {
        q: "كيف يمكن للمستوردين طلب عرض أسعار؟",
        a: "يمكن للمستوردين تقديم طلب عرض أسعار فوري عبر موقعنا الرسمي أو مراسلة إدارة التصدير مباشرة عبر contact@verdalia.com.",
      },
    ],
    es: [
      {
        q: "¿Quién es Verdalia Company VC?",
        a: "Verdalia Company VC es un productor y exportador tunecino líder de aceite de oliva a granel: virgen extra, ecológico, refinado y orujo para importadores internacionales.",
      },
      {
        q: "¿Qué opciones de envasado a granel ofrece Verdalia?",
        a: "Ofrecemos envíos marítimos en Flexitank de 21.000 a 24.000 litros, contenedores IBC de 1.000 litros y bidones de 200 litros.",
      },
    ],
    it: [
      {
        q: "Chi è Verdalia Company VC?",
        a: "Verdalia Company VC è un produttore ed esportatore leader di olio d'oliva tunisino sfuso: extra vergine, biologico, raffinato e sansa per importatori industriali in tutto il mondo.",
      },
      {
        q: "Quali imballaggi sfusi sono disponibili per l'esportazione?",
        a: "Forniamo spedizioni marittime in Flexitank da 21.000 a 24.000 litri, cisterne IBC da 1.000 litri e fusti da 200 litri.",
      },
    ],
  };

  const list = faqsByLocale[locale] || faqsByLocale.en;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
