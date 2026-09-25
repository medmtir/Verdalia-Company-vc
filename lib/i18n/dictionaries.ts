import { Locale } from "@/lib/types";

export interface Dictionary {
  nav: {
    home: string;
    about: string;
    products: string;
    export: string;
    certifications: string;
    contact: string;
    requestQuote: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    discoverBtn: string;
    quoteBtn: string;
  };
  trustStrip: {
    originTitle: string;
    originDesc: string;
    pressTitle: string;
    pressDesc: string;
    exportTitle: string;
    exportDesc: string;
  };
  aboutSection: {
    badge: string;
    title: string;
    desc1: string;
    desc2: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
    point3Title: string;
    point3Desc: string;
    learnMoreBtn: string;
  };
  productsSection: {
    badge: string;
    title: string;
    subtitle: string;
    viewAllBtn: string;
    requestInfoBtn: string;
    specs: {
      acidity: string;
      variety: string;
      extraction: string;
      origin: string;
      formats: string;
      packaging: string;
      moq: string;
    };
  };
  whyChooseUs: {
    badge: string;
    title: string;
    subtitle: string;
    item1Title: string;
    item1Desc: string;
    item2Title: string;
    item2Desc: string;
    item3Title: string;
    item3Desc: string;
    item4Title: string;
    item4Desc: string;
  };
  exportSection: {
    badge: string;
    title: string;
    subtitle: string;
    btn: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
    packagingCardTitle: string;
    packagingCardDesc: string;
    stepsTitle: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    step7: string;
  };
  certificationsSection: {
    badge: string;
    title: string;
    subtitle: string;
    viewAllBtn: string;
    officialGuarantee: string;
    assuranceText: string;
  };
  publicationsSection: {
    badge: string;
    title: string;
    subtitle: string;
    readMore: string;
  };
  contactCta: {
    title: string;
    subtitle: string;
    btn: string;
  };
  contactForm: {
    title: string;
    subtitle: string;
    fullName: string;
    companyName: string;
    country: string;
    email: string;
    phone: string;
    productInterest: string;
    selectProduct: string;
    estimatedQuantity: string;
    destinationCountry: string;
    message: string;
    uploadFile: string;
    uploadHint: string;
    privacyConsent: string;
    submitBtn: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    contactUs: string;
    leadership: string;
    address: string;
    rightsReserved: string;
    developedBy: string;
  };
  aboutPage: {
    heroBadge: string;
    heroTitle: string;
    heroTitleAccent: string;
    heroSubtitle: string;
    whoWeAreBadge: string;
    whoWeAreTitle: string;
    whoWeAreP1: string;
    whoWeAreP2: string;
    amariBadge: string;
    amariDesc: string;
    workWithUs: string;
    missionTitle: string;
    missionDesc: string;
    visionTitle: string;
    visionDesc: string;
    valuesBadge: string;
    valuesTitle: string;
    valuesSubtitle: string;
    leadershipBadge: string;
    leadershipTitle: string;
    leadershipSubtitle: string;
    contactCtaTitle: string;
    contactCtaSubtitle: string;
    contactCtaBtn: string;
  };
  productsPage: {
    bannerBadge: string;
    bannerTitle: string;
    bannerTitleAccent: string;
    bannerSubtitle: string;
    categoriesLabel: string;
    filters: {
      all: string;
      organic: string;
      extraVirgin: string;
      refined: string;
      pomace: string;
    };
    loading: string;
    bulkBadge: string;
    formatsLabel: string;
    quoteBtn: string;
    specsBtn: string;
  };
  exportPage: {
    bannerBadge: string;
    bannerTitle: string;
    bannerTitleAccent: string;
    bannerSubtitle: string;
    servicesBadge: string;
    servicesTitle: string;
    servicesSubtitle: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
    s4Title: string;
    s4Desc: string;
    packagingBadge: string;
    packagingTitle: string;
    packagingSubtitle: string;
    stepsBadge: string;
    stepsTitle: string;
    stepsSubtitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaBtn: string;
  };
  certificationsPage: {
    bannerBadge: string;
    bannerTitle: string;
    bannerTitleAccent: string;
    bannerSubtitle: string;
    auditBadge: string;
    auditTitle: string;
    auditSubtitle: string;
    loading: string;
    guaranteeBadge: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaBtn: string;
  };
  contactPage: {
    bannerBadge: string;
    bannerTitle: string;
    bannerTitleAccent: string;
    bannerSubtitle: string;
    hqBadge: string;
    locationTitle: string;
    locationVal: string;
    hoursTitle: string;
    hoursVal: string;
    hoursSupport: string;
    partnersTitle: string;
  };
}

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      products: "Products",
      export: "Export",
      certifications: "Certifications",
      contact: "Contact",
      requestQuote: "Request a Quote",
    },
    hero: {
      badge: "TUNISIAN OLIVE OIL — BULK EXPORT",
      title: "From Tunisia,",
      titleAccent: "to your market.",
      subtitle:
        "Verdalia Company VC exports Tunisian olive oil in bulk — citernes, IBCs and drums — for importers and distributors. We don't do retail boxes or consumer packaging. We supply the oil; you run your market.",
      discoverBtn: "See our grades",
      quoteBtn: "Request a quote",
    },
    trustStrip: {
      originTitle: "Tunisian origin",
      originDesc: "Local harvest, clear traceability",
      pressTitle: "Cold extraction",
      pressDesc: "Stable profile, batch-tested lots",
      exportTitle: "Bulk export",
      exportDesc: "Citernes, IBCs and drums — not retail",
    },
    aboutSection: {
      badge: "ABOUT US",
      title: "An export house, not a packaging plant",
      desc1:
        "Verdalia Company VC is a Tunisian olive oil exporter. We work with importers, refiners and distributors who need steady volume and clear specs.",
      desc2:
        "Extra virgin, organic, refined or pomace — we ship in bulk. Bottles, cartons and private-label retail packs are not our business.",
      point1Title: "Tunisian groves",
      point1Desc:
        "Mediterranean orchards, local varieties, a taste that travels well.",
      point2Title: "Tracked lots",
      point2Desc:
        "Batch analysis, controlled storage, customs-ready documents.",
      point3Title: "Export logistics",
      point3Desc:
        "Flexitank, IBC or drum loading — port coordination and paperwork included.",
      learnMoreBtn: "Learn more",
    },
    productsSection: {
      badge: "OUR GRADES",
      title: "Four grades for B2B export",
      subtitle:
        "From organic extra virgin to pomace — pick the profile that fits your buyers.",
      viewAllBtn: "Full catalogue",
      requestInfoBtn: "Request specs",
      specs: {
        acidity: "Acidity",
        variety: "Variety",
        extraction: "Extraction",
        origin: "Origin",
        formats: "Export formats",
        packaging: "Bulk formats",
        moq: "MOQ",
      },
    },
    whyChooseUs: {
      badge: "WHY VERDALIA",
      title: "Simple: quality, volume, delivery",
      subtitle:
        "We work with professionals who import oil — not supermarket shelves.",
      item1Title: "Tunisian origin",
      item1Desc:
        "Local sourcing, traceability from grove to container.",
      item2Title: "Steady volume",
      item2Desc:
        "Storage capacity to honour contracts across the campaign.",
      item3Title: "Quality control",
      item3Desc:
        "Lab analysis on every lot before shipment.",
      item4Title: "Bulk shipment",
      item4Desc:
        "Flexitanks, IBCs, 200L drums — industrial formats only, no retail boxes.",
    },
    exportSection: {
      badge: "EXPORT",
      title: "From Tunisia to your port",
      subtitle:
        "We coordinate loading, documents and maritime follow-up for your bulk orders.",
      btn: "Export process",
      stat1Number: "100%",
      stat1Label: "Export focus",
      stat2Number: "5+",
      stat2Label: "Regions served",
      stat3Number: "7d",
      stat3Label: "Commercial reply",
      packagingCardTitle: "Bulk only",
      packagingCardDesc:
        "Flexitanks 21–24,000 L, IBC 1,000 L, drums 200 L. No bottles, no consumer packaging.",
      stepsTitle: "How it works",
      step1: "1. Your inquiry",
      step2: "2. Product specs",
      step3: "3. Commercial offer",
      step4: "4. Lot confirmation",
      step5: "5. Docs & lab tests",
      step6: "6. Loading",
      step7: "7. Delivery & follow-up",
    },
    certificationsSection: {
      badge: "QUALITY",
      title: "Certifications & compliance",
      subtitle:
        "The standards your buyers and customs desks expect on arrival.",
      viewAllBtn: "See certifications",
      officialGuarantee: "Recognised standards",
      assuranceText:
        "Every lot ships with lab analysis, certificate of origin and phytosanitary docs.",
    },
    publicationsSection: {
      badge: "UPDATES",
      title: "Harvest notes & announcements",
      subtitle:
        "Campaign updates, availability and practical info for buyers.",
      readMore: "Read",
    },
    contactCta: {
      title: "Let's talk about your next container",
      subtitle:
        "Tell us the grade, volume and port — we'll come back with a clear offer.",
      btn: "Request a quote",
    },
    contactForm: {
      title: "Quote request",
      subtitle:
        "Fill in the form — our export team replies within 24–48 hours.",
      fullName: "Full name *",
      companyName: "Company *",
      country: "Country *",
      email: "Business email *",
      phone: "Phone / WhatsApp",
      productInterest: "Grade needed *",
      selectProduct: "Choose a grade...",
      estimatedQuantity: "Estimated volume (e.g. 1 container, 20 MT)",
      destinationCountry: "Destination port / country",
      message: "Inquiry details *",
      uploadFile: "Attach a spec sheet (optional)",
      uploadHint: "PDF, DOCX, PNG or JPG (max 10MB)",
      privacyConsent:
        "I agree that Verdalia may use this data to answer my inquiry. *",
      submitBtn: "Send",
      submitting: "Sending...",
      successMessage:
        "Thanks — your message is in. We'll get back to you shortly.",
      errorMessage:
        "Please fill in the required fields.",
    },
    footer: {
      tagline: "Quality · Commitment · Delivery",
      quickLinks: "Links",
      contactUs: "Contact",
      leadership: "Leadership",
      address: "Verdalia Company VC · Tunisia",
      rightsReserved: "All rights reserved.",
      developedBy: "Developed by Mohamed Mtir",
    },
    aboutPage: {
      heroBadge: "ABOUT VERDALIA COMPANY VC",
      heroTitle: "A Tunisian Heritage,",
      heroTitleAccent: "A Global Passion.",
      heroSubtitle: "Founded in Tunisia, Verdalia Company VC connects centuries of ancestral Mediterranean olive-growing wisdom with the exacting standards of international food importers.",
      whoWeAreBadge: "WHO WE ARE",
      whoWeAreTitle: "Authentic Olive Oil from the Heart of the Mediterranean",
      whoWeAreP1: "Verdalia Company VC is a specialized Tunisian olive oil export enterprise committed to delivering superior-grade extra virgin, certified organic, and refined olive oils to international distributors, retail chains, and food manufacturers worldwide.",
      whoWeAreP2: "Our strategic alliance with the prestigious Amari Olive Mill provides us with dedicated modern milling infrastructure, high-capacity cold extraction machinery, and temperature-regulated stainless steel storage. This guarantees an unbroken cold chain, minimum oxidation, and batch-to-batch organoleptic consistency.",
      amariBadge: "Amari Olive Mill Partnership",
      amariDesc: "Direct integration from grove cultivation to continuous cold extraction.",
      workWithUs: "Work With Verdalia →",
      missionTitle: "Our Mission",
      missionDesc: "Our mission is to promote the quality and authenticity of Tunisian olive oil worldwide while building long-term, dependable relationships with international importers, distributors, and commercial partners.",
      visionTitle: "Our Vision",
      visionDesc: "To become a trusted, internationally recognized partner for Tunisian olive oil sourcing and export, celebrated for uncompromising product integrity, dependable supply, and customer-focused logistics.",
      valuesBadge: "OUR FOUNDATIONS",
      valuesTitle: "Our Core Values",
      valuesSubtitle: "The principles that govern our olive sourcing, laboratory verification, and international commercial execution.",
      leadershipBadge: "EXECUTIVE LEADERSHIP",
      leadershipTitle: "Verdalia Leadership & Mill Partners",
      leadershipSubtitle: "Experienced professionals bridging local agricultural production and international B2B commerce.",
      contactCtaTitle: "Ready to Discuss Sourcing?",
      contactCtaSubtitle: "Our export specialists are available to review technical parameters, provide harvest certificates, and structure tailored supply contracts.",
      contactCtaBtn: "Request a Formal Quote",
    },
    productsPage: {
      bannerBadge: "CATALOGUE",
      bannerTitle: "Olive Oil Grades",
      bannerTitleAccent: "for bulk export.",
      bannerSubtitle: "Extra virgin, organic, refined or pomace — delivered in flexitanks, IBCs or drums. No retail boxes or consumer bottles.",
      categoriesLabel: "Categories:",
      filters: {
        all: "All Products",
        organic: "Organic",
        extraVirgin: "Extra Virgin",
        refined: "Refined",
        pomace: "Olive Pomace",
      },
      loading: "Loading product catalogue...",
      bulkBadge: "B2B Only · Bulk Citernes & IBC",
      formatsLabel: "Available Formats:",
      quoteBtn: "Request a Quote",
      specsBtn: "Technical Specs",
    },
    exportPage: {
      bannerBadge: "WORLDWIDE EXPORT LOGISTICS",
      bannerTitle: "Tunisian Olive Oil",
      bannerTitleAccent: "Exported Worldwide.",
      bannerSubtitle: "Verdalia Company VC supports international companies looking to source Tunisian olive oil. We work with importers, distributors, and commercial partners to deliver customized products with end-to-end maritime execution.",
      servicesBadge: "OUR EXPORT COMMITMENT",
      servicesTitle: "Comprehensive B2B Export Services",
      servicesSubtitle: "From contract formulation to customs release, our team manages every operational detail.",
      s1Title: "International Export",
      s1Desc: "Full container load (FCL) shipments via major Mediterranean ports to Europe, North America, the Middle East, and Asia.",
      s2Title: "Export Documentation",
      s2Desc: "Complete compliance files including EUR.1, Certificates of Origin, phytosanitary certificates, and accredited lab test results.",
      s3Title: "Bulk Formats",
      s3Desc: "Flexitanks ~22,000 L, IBCs 1,000 L and 200 L drums. Bulk industrial shipping only, no retail bottles.",
      s4Title: "Export Commercial Support",
      s4Desc: "Direct communication with multilingual account executives for proforma invoices, sample dispatches, and logistical follow-up.",
      packagingBadge: "BULK PACKAGING",
      packagingTitle: "Engineered for Safe Bulk Transit",
      packagingSubtitle: "We package in certified food-grade bulk containers designed for long-distance maritime transport.",
      stepsBadge: "EXPORT PROCESS",
      stepsTitle: "Our 7-Step Export Pathway",
      stepsSubtitle: "A transparent, structured procedure ensuring complete commercial and logistical compliance.",
      ctaTitle: "Ready to Start Your Export Order?",
      ctaSubtitle: "Contact our international sales desk to receive technical specifications, harvest certificates, and a customized proforma quote.",
      ctaBtn: "Request a Commercial Quote",
    },
    certificationsPage: {
      bannerBadge: "QUALITY & ASSURANCE",
      bannerTitle: "International Standards",
      bannerTitleAccent: "& Certified Traceability.",
      bannerSubtitle: "Verdalia Company VC adheres to the world's most rigorous food safety benchmarks, guaranteeing that every liter of olive oil exported meets international hygiene, purity, and legal parameters.",
      auditBadge: "ACCREDITATIONS & AUDITS",
      auditTitle: "Verified Company Certifications",
      auditSubtitle: "Our products and production processes undergo systematic audits by independent accredited testing authorities.",
      loading: "Loading certifications...",
      guaranteeBadge: "RIGOROUS LABORATORY PROTOCOLS",
      guaranteeTitle: "Certified Physical, Chemical & Sensory Analysis",
      guaranteeDesc: "Every production batch undergoes comprehensive laboratory testing before vessel loading, confirming acidity, peroxide levels, K232/K270 coefficients, and organoleptic defect-free status in accordance with International Olive Council (IOC) standards.",
      ctaTitle: "Request Certification Dossiers",
      ctaSubtitle: "Need full audit certificates, COA (Certificate of Analysis), or organic conformity documents for your compliance team?",
      ctaBtn: "Contact Quality Dept.",
    },
    contactPage: {
      bannerBadge: "COMMERCIAL INQUIRIES & EXPORT",
      bannerTitle: "Get in Touch",
      bannerTitleAccent: "With Verdalia Company VC.",
      bannerSubtitle: "We welcome requests from international importers, wholesalers, retail distributors, and institutional buyers seeking authentic Tunisian olive oil.",
      hqBadge: "OFFICIAL HEADQUARTERS",
      locationTitle: "Location",
      locationVal: "Tunisia (Olive Groves & Milling Terroirs)",
      hoursTitle: "Business Hours",
      hoursVal: "Monday - Friday: 08:00 - 18:00 (GMT+1)",
      hoursSupport: "24/7 WhatsApp Commercial Support",
      partnersTitle: "DIRECT PARTNER CONTACTS",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      about: "À Propos",
      products: "Produits",
      export: "Exportation",
      certifications: "Certifications",
      contact: "Contact",
      requestQuote: "Demander un Devis",
    },
    hero: {
      badge: "HUILE D'OLIVE TUNISIENNE — EXPORT",
      title: "De la Tunisie,",
      titleAccent: "vers vos marchés.",
      subtitle:
        "Verdalia Company VC exporte de l'huile d'olive tunisienne en vrac (citernes, IBC, fûts) pour importateurs et distributeurs. Pas de boîtes ni d'emballage retail — on fournit le produit, vous gérez votre marché.",
      discoverBtn: "Voir nos grades",
      quoteBtn: "Demander un devis",
    },
    trustStrip: {
      originTitle: "Origine Tunisie",
      originDesc: "Récolte locale, traçabilité claire",
      pressTitle: "Extraction à froid",
      pressDesc: "Profil stable, lots contrôlés",
      exportTitle: "Export en vrac",
      exportDesc: "Citernes, IBC et fûts — pas de retail",
    },
    aboutSection: {
      badge: "À PROPOS",
      title: "Une maison d'export, pas une usine d'emballage",
      desc1:
        "Verdalia Company VC est une société tunisienne d'exportation d'huile d'olive. On travaille avec des importateurs, raffineurs et distributeurs qui cherchent un volume régulier et des specs claires.",
      desc2:
        "Extra vierge, bio, raffinée ou grignons — on livre en vrac. Les bouteilles, cartons et marques privées, ce n'est pas notre métier.",
      point1Title: "Terroir tunisien",
      point1Desc:
        "Des oliveraies méditerranéennes, des variétés locales, un goût qui tient la route à l'export.",
      point2Title: "Lots suivis",
      point2Desc:
        "Analyses de lot, stockage sous contrôle, documents prêts pour la douane.",
      point3Title: "Logistique export",
      point3Desc:
        "Chargement en flexitank, IBC ou fûts — coordination portuaire et docs inclus.",
      learnMoreBtn: "En savoir plus",
    },
    productsSection: {
      badge: "NOS GRADES",
      title: "Quatre grades pour l'export B2B",
      subtitle:
        "Du bio extra vierge au grignons — choisissez le profil qui correspond à votre marché.",
      viewAllBtn: "Catalogue complet",
      requestInfoBtn: "Demander la fiche",
      specs: {
        acidity: "Acidité",
        variety: "Variété d'olives",
        extraction: "Mode d'extraction",
        origin: "Origine",
        formats: "Formats export",
        packaging: "Conditionnement vrac",
        moq: "Quantité minimale",
      },
    },
    whyChooseUs: {
      badge: "POURQUOI VERDALIA",
      title: "Simple : qualité, volume, livraison",
      subtitle:
        "On s'adresse aux pros qui importent de l'huile — pas aux rayons supermarché.",
      item1Title: "Origine tunisienne",
      item1Desc:
        "Sourcing local, traçabilité du verger au conteneur.",
      item2Title: "Volume régulier",
      item2Desc:
        "Capacité de stockage pour tenir des contrats sur la campagne.",
      item3Title: "Contrôle qualité",
      item3Desc:
        "Analyses labo sur chaque lot avant expédition.",
      item4Title: "Export en citernes",
      item4Desc:
        "Flexitanks, IBC, fûts 200L — formats industriels, pas de boîtes retail.",
    },
    exportSection: {
      badge: "EXPORT",
      title: "De la Tunisie jusqu'à votre port",
      subtitle:
        "On coordonne le chargement, les documents et le suivi maritime pour vos commandes en vrac.",
      btn: "Processus export",
      stat1Number: "100%",
      stat1Label: "Orientation export",
      stat2Number: "5+",
      stat2Label: "Zones desservies",
      stat3Number: "7j",
      stat3Label: "Réponse commerciale",
      packagingCardTitle: "Vrac uniquement",
      packagingCardDesc:
        "Flexitanks 21–24 000 L, IBC 1 000 L, fûts 200 L. Pas de bouteilles ni d'emballage consommateur.",
      stepsTitle: "Comment ça se passe",
      step1: "1. Demande initiale",
      step2: "2. Définition des specs",
      step3: "3. Offre commerciale",
      step4: "4. Confirmation du lot",
      step5: "5. Docs & analyses",
      step6: "6. Chargement",
      step7: "7. Livraison & suivi",
    },
    certificationsSection: {
      badge: "QUALITÉ",
      title: "Certifications & conformité",
      subtitle:
        "Les standards que vos clients et vos douanes attendent à l'arrivée.",
      viewAllBtn: "Voir les certifications",
      officialGuarantee: "Normes reconnues",
      assuranceText:
        "Chaque lot part avec analyses labo, certificat d'origine et docs phytosanitaires.",
    },
    publicationsSection: {
      badge: "ACTUALITÉS",
      title: "Notes de campagne & annonces",
      subtitle:
        "Récoltes, disponibilités et infos utiles pour les acheteurs.",
      readMore: "Lire",
    },
    contactCta: {
      title: "Parlons de votre prochain conteneur",
      subtitle:
        "Dites-nous le grade, le volume et le port — on revient avec une offre claire.",
      btn: "Demander un devis",
    },
    contactForm: {
      title: "Demande de devis",
      subtitle:
        "Remplissez ce formulaire — notre équipe export vous répond sous 24–48 h.",
      fullName: "Nom complet *",
      companyName: "Nom de l'entreprise *",
      country: "Pays *",
      email: "Adresse e-mail professionnelle *",
      phone: "Téléphone / WhatsApp",
      productInterest: "Grade recherché *",
      selectProduct: "Sélectionnez un grade...",
      estimatedQuantity: "Volume estimé (ex. 1 conteneur, 20 T)",
      destinationCountry: "Port ou pays de destination",
      message: "Détails de la demande *",
      uploadFile: "Joindre un cahier des charges (optionnel)",
      uploadHint: "PDF, DOCX, PNG ou JPG (max 10 Mo)",
      privacyConsent:
        "J'accepte que Verdalia Company VC traite ces données pour répondre à ma demande. *",
      submitBtn: "Envoyer la demande",
      submitting: "Envoi en cours...",
      successMessage:
        "Merci d'avoir contacté Verdalia. Votre message a bien été reçu — on vous répond dès que possible.",
      errorMessage:
        "Veuillez remplir correctement les champs obligatoires.",
    },
    footer: {
      tagline: "Qualité · Engagement · Livraison",
      quickLinks: "Liens rapides",
      contactUs: "Contact direct",
      leadership: "Direction",
      address: "Verdalia Company VC · Tunisie",
      rightsReserved: "Tous droits réservés.",
      developedBy: "Développé par Mohamed Mtir",
    },
    aboutPage: {
      heroBadge: "À PROPOS DE VERDALIA COMPANY VC",
      heroTitle: "Un Héritage Tunisien,",
      heroTitleAccent: "Une Passion Mondiale.",
      heroSubtitle: "Fondée en Tunisie, Verdalia Company VC relie des siècles de savoir-faire oléicole méditerranéen aux normes les plus strictes des importateurs internationaux.",
      whoWeAreBadge: "QUI SOMMES-NOUS",
      whoWeAreTitle: "Une Huile d'Olive Authentique au Cœur de la Méditerranée",
      whoWeAreP1: "Verdalia Company VC est une entreprise tunisienne spécialisée dans l'exportation d'huile d'olive haut de gamme (extra vierge, bio, raffinée) auprès des importateurs et industriels agroalimentaires du monde entier.",
      whoWeAreP2: "Notre partenariat stratégique avec la prestigieuse Huilerie Amari nous dote d'une infrastructure moderne d'extraction à froid et de cuves inox thermo-régulées, garantissant une régularité organoleptique irréprochable.",
      amariBadge: "Partenariat Huilerie Amari",
      amariDesc: "Intégration directe de la récolte à l'extraction à froid en continu.",
      workWithUs: "Collaborer avec Verdalia →",
      missionTitle: "Notre Mission",
      missionDesc: "Notre mission est de valoriser la qualité et l'authenticité de l'huile d'olive tunisienne à travers le monde tout en bâtissant des relations durables et fiables avec nos partenaires.",
      visionTitle: "Notre Vision",
      visionDesc: "Devenir le partenaire de référence international pour le sourcing et l'exportation d'huile d'olive tunisienne, reconnu pour son intégrité, sa régularité et sa logistique irréprochable.",
      valuesBadge: "NOS FONDATIONS",
      valuesTitle: "Nos Valeurs Fondamentales",
      valuesSubtitle: "Les principes guidant notre sourcing d'olives, nos analyses en laboratoire et nos opérations à l'export.",
      leadershipBadge: "ÉQUIPE DIRIGEANTE",
      leadershipTitle: "Direction Verdalia & Partenaires Huilerie",
      leadershipSubtitle: "Des professionnels expérimentés reliant la production agricole locale au commerce B2B international.",
      contactCtaTitle: "Prêt à Discuter de Vos Besoins ?",
      contactCtaSubtitle: "Nos experts export sont à votre disposition pour étudier vos spécifications techniques et établir vos contrats d'approvisionnement.",
      contactCtaBtn: "Demander un Devis Formel",
    },
    productsPage: {
      bannerBadge: "CATALOGUE",
      bannerTitle: "Grades d'huile d'olive",
      bannerTitleAccent: "pour l'export en vrac.",
      bannerSubtitle: "Extra vierge, bio, raffinée ou grignons — livré en flexitank, IBC ou fûts. Pas de boîtes retail ni de bouteilles consommateur.",
      categoriesLabel: "Catégories :",
      filters: {
        all: "Tous les Produits",
        organic: "Biologique",
        extraVirgin: "Extra Vierge",
        refined: "Raffinée",
        pomace: "Grignons d'Olive",
      },
      loading: "Chargement du catalogue...",
      bulkBadge: "B2B Uniquement · Vrac Citernes & IBC",
      formatsLabel: "Formats Disponibles :",
      quoteBtn: "Demander un Devis",
      specsBtn: "Fiche Technique",
    },
    exportPage: {
      bannerBadge: "LOGISTIQUE EXPORT MONDIALE",
      bannerTitle: "L'Huile d'Olive Tunisienne",
      bannerTitleAccent: "Exportée dans le Monde.",
      bannerSubtitle: "Verdalia Company VC accompagne les importateurs et industriels dans l'approvisionnement en vrac avec un suivi logistique et maritime complet.",
      servicesBadge: "NOTRE ENGAGEMENT EXPORT",
      servicesTitle: "Services Export B2B Complets",
      servicesSubtitle: "De la négociation contractuelle au dédouanement à destination, notre équipe gère chaque étape opérationnelle.",
      s1Title: "Export International",
      s1Desc: "Expéditions en conteneurs complets (FCL) depuis les ports tunisiens vers l'Europe, l'Amérique du Nord, le Moyen-Orient et l'Asie.",
      s2Title: "Documentation Export",
      s2Desc: "Dossiers de conformité complets : EUR.1, Certificats d'origine, certificats phytosanitaires et analyses labo accréditées.",
      s3Title: "Formats Vrac",
      s3Desc: "Flexitanks ~22 000 L, cuves IBC 1 000 L et fûts 200 L. Uniquement du vrac industriel pour professionnels.",
      s4Title: "Support Commercial Dédié",
      s4Desc: "Interlocuteurs multilingues pour devis proforma, envoi d'échantillons et suivi temps réel des expéditions.",
      packagingBadge: "CONDITIONNEMENT VRAC",
      packagingTitle: "Conçu pour le Transport Maritime Sécurisé",
      packagingSubtitle: "Nous utilisons des contenants alimentaires certifiés garantissant l'intégrité de l'huile sur de longues distances.",
      stepsBadge: "PROCESSUS EXPORT",
      stepsTitle: "Notre Parcours Export en 7 Étapes",
      stepsSubtitle: "Une procédure transparente et éprouvée garantissant conformité commerciale et respect des délais.",
      ctaTitle: "Prêt à Lancer Votre Commande Export ?",
      ctaSubtitle: "Contactez notre équipe commerciale pour recevoir nos fiches techniques, certificats et devis proforma personnalisé.",
      ctaBtn: "Demander un Devis Commercial",
    },
    certificationsPage: {
      bannerBadge: "QUALITÉ & CONFORMITÉ",
      bannerTitle: "Normes Internationales",
      bannerTitleAccent: "& Traçabilité Certifiée.",
      bannerSubtitle: "Verdalia Company VC respecte les exigences de sécurité alimentaire les plus strictes pour garantir la pureté absolue de chaque lot exporté.",
      auditBadge: "ACCRÉDITATIONS & AUDITS",
      auditTitle: "Certifications Officielles",
      auditSubtitle: "Nos produits et infrastructures font l'objet d'audits systématiques par des organismes accrédités indépendants.",
      loading: "Chargement des certifications...",
      guaranteeBadge: "PROTOCOLES DE LABORATOIRE RIGOUREUX",
      guaranteeTitle: "Analyses Physico-Chimiques & Organoleptiques",
      guaranteeDesc: "Chaque lot de production fait l'objet de tests approfondis avant embarquement, certifiant l'acidité, les indices de peroxyde, les coefficients K232/K270 et la pureté selon les standards du Conseil Oléicole International (COI).",
      ctaTitle: "Demander Nos Dossiers de Certification",
      ctaSubtitle: "Besoin des rapports d'audit, fiches COA ou certificats bio pour vos démarches qualité ?",
      ctaBtn: "Contacter le Service Qualité",
    },
    contactPage: {
      bannerBadge: "RELATIONS COMMERCIALES & EXPORT",
      bannerTitle: "Contactez",
      bannerTitleAccent: "Verdalia Company VC.",
      bannerSubtitle: "Nous répondons aux demandes des importateurs, négociants, distributeurs et industriels à la recherche d'huile d'olive tunisienne authentique.",
      hqBadge: "SIÈGE OFFICIEL",
      locationTitle: "Localisation",
      locationVal: "Tunisie (Oliveraies & Bassins Oléicoles)",
      hoursTitle: "Horaires d'Ouverture",
      hoursVal: "Lundi - Vendredi : 08:00 - 18:00 (GMT+1)",
      hoursSupport: "Support commercial WhatsApp 24/7",
      partnersTitle: "CONTACTS DIRECTS DES ASSOCIÉS",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      products: "منتجاتنا",
      export: "التصدير",
      certifications: "الشهادات والجودة",
      contact: "اتصل بنا",
      requestQuote: "طلب عرض أسعار",
    },
    hero: {
      badge: "زيت زيتون تونسي فائق الجودة",
      title: "من تونس،",
      titleAccent: "إلى العالم أجمع.",
      subtitle:
        "تقدم شركة فيرداليا في سي أصالة التراث الزراعي التونسي لأبرز المستوردين وشركات التوزيع وسلاسل البيع بالتجزئة في مختلف الأسواق العالمية.",
      discoverBtn: "اكتشف منتجاتنا",
      quoteBtn: "طلب عرض أسعار",
    },
    trustStrip: {
      originTitle: "أصل تونسي 100%",
      originDesc: "محصول مزارع الزيتون المتوسطية العريقة",
      pressTitle: "عصر بارد وطبيعي",
      pressDesc: "يحافظ على أعلى مستويات البوليفينول والنقاء",
      exportTitle: "تصدير عالمي موثوق",
      exportDesc: "شحن بحري سلس وشبكة لوجستية متكاملة",
    },
    aboutSection: {
      badge: "عن شركة فيرداليا",
      title: "عراقة تونسية، والتزام عالمي بالجودة",
      desc1:
        "فيرداليا كومباني في سي هي شركة تونسية متخصصة في تصدير أرقى أنواع زيت الزيتون البكر الممتاز، والبيولوجي العضوي، والمكرر، إلى مختلف الأسواق الدولية.",
      desc2:
        "نجمع بين التقاليد الفلاحية التونسية المتوارثة وأحدث تقنيات المعاصر الحديثة على البارد، لضمان أعلى معايير التتبع والنقاء في كل شحنة.",
      point1Title: "طبيعة تونسية غنية",
      point1Desc:
        "شمس متوسطية ساطعة وأصناف زيتون مميزة غنية بمضادات الأكسدة الفريدة.",
      point2Title: "معاصر وتقنيات حديثة",
      point2Desc:
        "استخلاص على البارد وتخزين في صهاريج صحية محكمة تحت غاز النيتروجين.",
      point3Title: "خبرة في التصدير الدولي",
      point3Desc:
        "وثائق جمركية شاملة، تحاليل مخبرية دقيقة، وحلول شحن دولي مخصصة.",
      learnMoreBtn: "تعرف على المزيد",
    },
    productsSection: {
      badge: "كتالوج المنتجات",
      title: "تشكيلة زيوت زيتون استثنائية للأسواق العالمية",
      subtitle:
        "من زيت الزيتون العضوي البكر الممتاز إلى زيت تفل الزيتون للاستخدامات التجارية، نلبي كافة طلباتكم.",
      viewAllBtn: "عرض جميع المنتجات",
      requestInfoBtn: "طلب البطاقة التقنية",
      specs: {
        acidity: "نسبة الحموضة",
        variety: "صنف الزيتون",
        extraction: "طريقة الاستخلاص",
        origin: "بلد المنشأ",
        formats: "الأحجام المتوفرة",
        packaging: "نوع التعبئة",
        moq: "الحد الأدنى للطلب",
      },
    },
    whyChooseUs: {
      badge: "لماذا فيرداليا",
      title: "شريك موثوق قائم على الجودة والالتزام ودقة التسليم",
      subtitle:
        "نلبي تطلعات المستوردين والشركات العالمية التي تبحث عن الجودة العالية والاستمرارية.",
      item1Title: "منشأ تونسي أصيل",
      item1Desc:
        "توريد مباشر من أفضل حقول الزيتون التونسية مع ضمان التتبع الكامل من الشجرة إلى الميناء.",
      item2Title: "إمدادات مستقرة ومستمرة",
      item2Desc:
        "طاقة تخزين وعصر واسعة تضمن توفير الكميات المطلوبة طوال الموسم الزراعي.",
      item3Title: "مطابقة للمعايير الدولية",
      item3Desc:
        "تحاليل كيميائية وحسية معتمدة لكل دفعة تصدير لضمان الامتثال التام.",
      item4Title: "حلول تعبئة وشحن مرنة",
      item4Desc:
        "شحن سائب في فليكسي تانك (Flexitanks)، حاويات IBC، أو زجاجات مخصصة لعلاماتكم التجارية.",
    },
    exportSection: {
      badge: "الخدمات اللوجستية الدولية",
      title: "زيت زيتون تونسي مصدّر إلى جميع قارات العالم",
      subtitle:
        "تتولى فيرداليا إدارة كافة مراحل الشحن البحري والبري مع الامتثال الجمركي الكامل.",
      btn: "خطوات التصدير",
      stat1Number: "100%",
      stat1Label: "تركيز تصديري",
      stat2Number: "+5",
      stat2Label: "قارات نصل إليها",
      stat3Number: "24/7",
      stat3Label: "دعم ومتابعة تجارية",
      packagingCardTitle: "تعبئة مخصصة وشحن مرن",
      packagingCardDesc:
        "شحن بالجملة في خزانات فليكسي تانك (21,000 إلى 24,000 لتر) أو عبوات زجاجية فاخرة.",
      stepsTitle: "مسار التصدير في 7 خطوات",
      step1: "1. استلام طلب العميل",
      step2: "2. تحديد المواصفات الفنية للزيت والتعبئة",
      step3: "3. تقديم العرض التجاري والمالي",
      step4: "4. تأكيد العقد والمواصفات",
      step5: "5. إعداد الوثائق الجمركية والتحاليل المخبرية",
      step6: "6. التنسيق اللوجستي وشحن البضائع",
      step7: "7. التسليم الدولي والمتابعة",
    },
    certificationsSection: {
      badge: "ضمان الجودة",
      title: "شهادات معتمدة ومطابقة عالمية",
      subtitle:
        "تلتزم عملياتنا بأرقى معايير سلامة الأغذية والصحة والجودة المعتمدة دولياً.",
      viewAllBtn: "استعراض الشهادات",
      officialGuarantee: "معايير جودة دولية معتمدة",
      assuranceText:
        "ترافق كل شحنة شهادات صحية رسمية، وتحاليل مخبرية معتمدة، وشهادات منشأ موثقة.",
    },
    publicationsSection: {
      badge: "مستجدات القطاع",
      title: "منشورات وأخبار الشركة",
      subtitle:
        "تابعوا أحدث التطورات حول مواسم الزيتون في تونس، وأسواق الزيوت، ومستجدات فيرداليا.",
      readMore: "قراءة المنشور",
    },
    contactCta: {
      title: "ابدأ شراكتك التجارية مع فيرداليا",
      subtitle:
        "تواصل مباشرة مع مسؤولي التصدير لبحث احتياجاتكم من الكميات والأسعار التنافسية.",
      btn: "طلب عرض تجاري مخصص",
    },
    contactForm: {
      title: "طلب عرض أسعار تجاري",
      subtitle:
        "يرجى ملء النموذج أدناه وسيقوم فريق المبيعات والتصدير بموافاتكم بعرض مفصل خلال 24 ساعة.",
      fullName: "الاسم الكامل *",
      companyName: "اسم الشركة *",
      country: "الدولة *",
      email: "البريد الإلكتروني للعمل *",
      phone: "رقم الهاتف / واتساب",
      productInterest: "المنتج المطلوب *",
      selectProduct: "اختر صنف زيت الزيتون...",
      estimatedQuantity: "الكمية التقديرية (مثال: حاوية 20 قدم، 22 طن)",
      destinationCountry: "ميناء أو بلد الوصول",
      message: "تفاصيل الطلب والمواصفات المطلوبة *",
      uploadFile: "إرفاق ملف المواصفات أو طلب العروض (اختياري)",
      uploadHint: "PDF, DOCX, PNG أو JPG (الحد الأقصى 10 ميغابايت)",
      privacyConsent:
        "أوافق على قيام شركة فيرداليا بمعالجة بياناتي لغرض التواصل التجاري. *",
      submitBtn: "إرسال الطلب التجاري",
      submitting: "جارٍ الإرسال...",
      successMessage:
        "شكراً لتواصلكم مع شركة فيرداليا في سي. تم استلام طلبكم بنجاح، وسيتواصل معكم فريق التصدير في أقرب وقت.",
      errorMessage: "يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح قبل الإرسال.",
    },
    footer: {
      tagline: "جودة • التزام • تسليم",
      quickLinks: "روابط سريعة",
      contactUs: "الاتصال المباشر",
      leadership: "الإدارة والشركاء",
      address: "فيرداليا كومباني في سي • تونس",
      rightsReserved: "جميع الحقوق محفوظة.",
      developedBy: "تطوير: محمد مطير",
    },
    aboutPage: {
      heroBadge: "عن شركة فيرداليا في سي",
      heroTitle: "عراقة تونسية،",
      heroTitleAccent: "وشغف عالمي.",
      heroSubtitle: "انطلاقاً من تونس، تجمع شركة فيرداليا في سي بين قرون من تقاليد زراعة الزيتون المتوسطية وأدق المعايير المعتمدة لدى كبار المستوردين الدوليين.",
      whoWeAreBadge: "من نحن",
      whoWeAreTitle: "زيت زيتون أصيل من قلب حوض البحر الأبيض المتوسط",
      whoWeAreP1: "فيرداليا كومباني في سي هي شركة تونسية متخصصة في تصدير زيت الزيتون البكر الممتاز والبيولوجي والمكرر عالي الجودة إلى شركات التوزيع والمصانع الغذائية عبر العالم.",
      whoWeAreP2: "شراكتنا الإستراتيجية مع معصرة العماري العريقة توفر لنا بنية تحتية عصرية لاستخلاص الزيت على البارد وسعة تخزين متطورة في صهاريج الفولاذ المقاوم للصدأ لضمان ثبات الجودة والنقاء.",
      amariBadge: "شراكة استراتيجية مع معصرة العماري",
      amariDesc: "تكامل مباشر من جني المحصول إلى العصر الآلي المستمر على البارد.",
      workWithUs: "تعاون مع فيرداليا ←",
      missionTitle: "رسالتنا",
      missionDesc: "رسالتنا هي ترسيخ جودة وأصالة زيت الزيتون التونسي عالمياً وبناء شراكات تجارية متينة ومستدامة مع كبار المستوردين والموزعين الدوليين.",
      visionTitle: "رؤيتنا",
      visionDesc: "أن نكون الشريك الموثوق والمرجع الدولي الأول في توريد وتصدير زيت الزيتون التونسي، المشهود له بنقاء المنتج وثبات الإمدادات والاحترافية اللوجستية.",
      valuesBadge: "ركائزنا الأساسية",
      valuesTitle: "قيمنا الجوهرية",
      valuesSubtitle: "المبادئ الصارمة التي تحكم توريد الزيتون، التحاليل المخبرية، والعمليات التجارية الدولية.",
      leadershipBadge: "الفريق القيادي",
      leadershipTitle: "إدارة شركة فيرداليا وشركاء المعصرة",
      leadershipSubtitle: "كفاءات مهنية تجمع بين الخبرة الفلاحية الميدانية والتجارة الدولية بين الشركات.",
      contactCtaTitle: "هل ترغب في مناقشة احتياجاتك من زيت الزيتون؟",
      contactCtaSubtitle: "فريق الخبراء في التصدير جاهز لدراسة مواصفاتكم الفنية وتقديم شهادات المحصول وعقود التوريد المخصصة.",
      contactCtaBtn: "طلب عرض أسعار رسمي",
    },
    productsPage: {
      bannerBadge: "كتالوج المنتجات",
      bannerTitle: "أصناف زيت الزيتون التونسي",
      bannerTitleAccent: "للتصدير بالجملة.",
      bannerSubtitle: "بكر ممتاز، عضوي، مكرر، أو تفل الزيتون — شحن سائب في فليكسي تانك أو حاويات IBC أو براميل. توريد تجاري وصناعي فقط.",
      categoriesLabel: "الأصناف والتصنيفات:",
      filters: {
        all: "جميع المنتجات",
        organic: "عضوي بيولوجي",
        extraVirgin: "بكر ممتاز",
        refined: "مكرر",
        pomace: "تفل الزيتون",
      },
      loading: "جاري تحميل كتالوج المنتجات...",
      bulkBadge: "للشركات والمصانع فقط · شحن سائب صهاريج وحاويات",
      formatsLabel: "خيارات التعبئة المتوفرة:",
      quoteBtn: "طلب عرض أسعار",
      specsBtn: "البطاقة التقنية",
    },
    exportPage: {
      bannerBadge: "الخدمات اللوجستية الدولية للتصدير",
      bannerTitle: "زيت الزيتون التونسي",
      bannerTitleAccent: "مصدّر إلى جميع قارات العالم.",
      bannerSubtitle: "تدعم شركة فيرداليا الشركات والمستوردين الدوليين في استيراد زيت الزيتون التونسي وتوفر حلولاً مرنة ومخصصة تلبي كافة متطلبات أسواقهم مع متابعة بحرية كاملة.",
      servicesBadge: "التزامنا التصديري",
      servicesTitle: "خدمات تصدير متكاملة للشركات B2B",
      servicesSubtitle: "من صياغة العقود وحتى التخليص الجمركي في ميناء الوصول، يتولى فريقنا أدق التفاصيل التشغيلية.",
      s1Title: "تصدير دولي موثوق",
      s1Desc: "شحن حاويات كاملة (FCL) عبر الموانئ التونسية الرئيسية إلى أوروبا وأمريكا الشمالية والشرق الأوسط وآسيا.",
      s2Title: "وثائق التصدير والجمارك",
      s2Desc: "ملفات مطابقة كاملة تشمل شهادة EUR.1، شهادة المنشأ، الشهادات الصحية والتحاليل المخبرية المعتمدة.",
      s3Title: "تعبئة وشحن سائب",
      s3Desc: "صهاريج فليكسي تانك ~22,000 لتر، حاويات IBC سعة 1,000 لتر، وبراميل 200 لتر. شحن بالجملة للشركات فقط.",
      s4Title: "دعم تجاري مباشر",
      s4Desc: "تواصل مباشر مع مسؤولي الحسابات متعددي اللغات للحصول على الفواتير المبدئية، إرسال العينات ومتابعة الشحنات.",
      packagingBadge: "التعبئة الصناعية والشحن",
      packagingTitle: "مصممة للنقل البحري الآمن لمسافات طويلة",
      packagingSubtitle: "نعتمد حاويات غذائية معتمدة تحافظ على جودة الزيت ونقائه طوال فترة الرحلة البحرية.",
      stepsBadge: "مسار التصدير",
      stepsTitle: "خطوات التصدير في 7 مراحل",
      stepsSubtitle: "إجراءات واضحة ومنظمة تضمن الامتثال التجاري الكامل والالتزام بمواعيد الشحن.",
      ctaTitle: "جاهز لبدء طلبك التصديري؟",
      ctaSubtitle: "تواصل مع مكتب المبيعات الدولي للحصول على المواصفات الفنية، شهادات المحصول وعرض أسعار مبدئي مخصص.",
      ctaBtn: "طلب عرض أسعار تجاري",
    },
    certificationsPage: {
      bannerBadge: "الجودة وضمان المطابقة",
      bannerTitle: "معايير دولية صارمة",
      bannerTitleAccent: "وتتبع موثق لكل دفعة.",
      bannerSubtitle: "تلتزم شركة فيرداليا بأعلى معايير سلامة الأغذية والصحة العالمية، مما يضمن أن كل لتر يتم تصديره يلبي كافة المتطلبات الصحية والقانونية الدولية.",
      auditBadge: "الاعتمادات وعمليات التدقيق",
      auditTitle: "شهادات جودة معتمدة رسمياً",
      auditSubtitle: "تخضع منتجاتنا ومرافق العصر والتخزين لتدقيق دوري دقيق من قبل هيئات تفتيش دولية مستقلة.",
      loading: "جاري تحميل بيانات الشهادات...",
      guaranteeBadge: "بروتوكولات مخبرية دقيقة",
      guaranteeTitle: "تحاليل كيميائية وحسية معتمدة",
      guaranteeDesc: "تخضع كل دفعة إنتاجية لفحوص مخبرية شاملة قبل الشحن، لتأكيد نسبة الحموضة، ورقم البيروكسيد، وثوابت K232/K270، والخلو التام من أي عيوب حسية وفق معايير المجلس الدولي للزيتون (IOC).",
      ctaTitle: "طلب ملفات وشهادات الجودة",
      ctaSubtitle: "هل تحتاج إلى شهادات التدقيق الكاملة، تقارير COA، أو وثائق المطابقة العضوية لفريق الجودة لديكم؟",
      ctaBtn: "التواصل مع إدارة الجودة",
    },
    contactPage: {
      bannerBadge: "الاستفسارات التجارية والتصدير",
      bannerTitle: "تواصل معنا مباشرة",
      bannerTitleAccent: "شركة فيرداليا كومباني في سي.",
      bannerSubtitle: "نرحب بطلبات المستوردين وشركات التوزيع والمصانع الغذائية الراغبة في استيراد زيت الزيتون التونسي الأصيل.",
      hqBadge: "المقر الرسمي",
      locationTitle: "الموقع الجغرافي",
      locationVal: "تونس (أحواض زراعة الزيتون والمعاصر)",
      hoursTitle: "أوقات العمل",
      hoursVal: "الإثنين - الجمعة: 08:00 - 18:00 (توقيت تونس GMT+1)",
      hoursSupport: "دعم تجاري 24/7 عبر واتساب",
      partnersTitle: "بيانات التواصل المباشر مع الشركاء",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Nosotros",
      products: "Productos",
      export: "Exportación",
      certifications: "Certificaciones",
      contact: "Contacto",
      requestQuote: "Solicitar Cotización",
    },
    hero: {
      badge: "ACEITE DE OLIVA TUNECINO PREMIUM",
      title: "Desde Túnez,",
      titleAccent: "para el Mundo.",
      subtitle:
        "Verdalia Company VC lleva la autenticidad y excelencia del olivar tunecino a importadores, distribuidores y mayoristas en mercados internacionales.",
      discoverBtn: "Descubrir Productos",
      quoteBtn: "Solicitar Cotización",
    },
    trustStrip: {
      originTitle: "100% Origen Túnez",
      originDesc: "Cosechado en olivares mediterráneos tradicionales",
      pressTitle: "Prensado en Frío y Natural",
      pressDesc: "Máxima concentración de polifenoles y pureza organoléptica",
      exportTitle: "Exportación Global",
      exportDesc: "Cadena logística y marítima de alta fiabilidad",
    },
    aboutSection: {
      badge: "SOBRE VERDALIA",
      title: "Herencia Tunecina, Compromiso Global",
      desc1:
        "Verdalia Company VC es una empresa tunecina dedicada a la exportación de aceite de oliva de alta calidad virgen extra, ecológico y refinado para socios comerciales de todo el mundo.",
      desc2:
        "Uniendo la tradición agrícola milenaria con almazaras modernas, aseguramos trazabilidad integral, calidad constante y acuerdos comerciales duraderos.",
      point1Title: "Terruño Tunecino Fértil",
      point1Desc:
        "Clima mediterráneo que otorga a nuestras variedades un perfil sensorial excepcional.",
      point2Title: "Molienda Moderna",
      point2Desc:
        "Extracción en frío de última generación y almacenamiento en tanques de acero inoxidable.",
      point3Title: "Logística y Exportación",
      point3Desc:
        "Documentación aduanera completa, análisis de laboratorio y transporte marítimo seguro.",
      learnMoreBtn: "Conocer Más",
    },
    productsSection: {
      badge: "CATÁLOGO DE PRODUCTOS",
      title: "Aceites de Oliva Excepcionales para Mercados Globales",
      subtitle:
        "Desde virgen extra ecológico hasta aceite de orujo de oliva para aplicaciones comerciales e industriales.",
      viewAllBtn: "Ver Todos los Productos",
      requestInfoBtn: "Ficha Técnica",
      specs: {
        acidity: "Acidez",
        variety: "Variedad de aceituna",
        extraction: "Extracción",
        origin: "Origen",
        formats: "Formatos disponibles",
        packaging: "Envasado",
        moq: "Cantidad mínima",
      },
    },
    whyChooseUs: {
      badge: "POR QUÉ VERDALIA",
      title: "Un Socio Comercial Basado en Calidad y Cumplimiento",
      subtitle:
        "Ofrecemos a importadores y cadenas de distribución una cadena de suministro sólida y confiable.",
      item1Title: "Origen Tunecino Auténtico",
      item1Desc:
        "Abastecimiento directo con trazabilidad garantizada desde el olivar hasta la entrega.",
      item2Title: "Suministro Continuo",
      item2Desc:
        "Gran capacidad de molienda y acopio para cumplir contratos anuales sin interrupciones.",
      item3Title: "Control de Calidad Riguroso",
      item3Desc:
        "Análisis certificados en laboratorios acreditados para cada lote de exportación.",
      item4Title: "Formatos y Envíos a Medida",
      item4Desc:
        "Flexitanks a granel (21.000L - 24.000L), contenedores IBC o embotellado para marca blanca.",
    },
    exportSection: {
      badge: "LOGÍSTICA INTERNACIONAL",
      title: "Aceite de Oliva Tunecino Exportado a Todo el Mundo",
      subtitle:
        "Verdalia Company VC gestiona cada fase del transporte marítimo y terrestre con riguroso cumplimiento aduanero.",
      btn: "Proceso de Exportación",
      stat1Number: "100%",
      stat1Label: "Enfoque de Exportación",
      stat2Number: "5+",
      stat2Label: "Continentes Conectados",
      stat3Number: "24/7",
      stat3Label: "Atención Comercial",
      packagingCardTitle: "Envasado Personalizado y Envíos Flexibles",
      packagingCardDesc:
        "Granel en Flexitanks y depósitos IBC hasta líneas embotelladas listas para venta al por menor.",
      stepsTitle: "Proceso de Exportación en 7 Pasos",
      step1: "1. Consulta Inicial del Cliente",
      step2: "2. Definición de Requisitos Técnicos",
      step3: "3. Oferta Comercial y Técnica",
      step4: "4. Confirmación de Producto y Envasado",
      step5: "5. Documentación Aduanera y Análisis",
      step6: "6. Coordinación Logística y Carga",
      step7: "7. Entrega Internacional y Seguimiento",
    },
    certificationsSection: {
      badge: "GARANTÍA DE CALIDAD",
      title: "Excelencia Certificada y Cumplimiento Internacional",
      subtitle:
        "Nuestras operaciones cumplen los más exigentes estándares internacionales de seguridad alimentaria.",
      viewAllBtn: "Ver Certificaciones",
      officialGuarantee: "Estándares Internacionales Acreditados",
      assuranceText:
        "Cada expedición incluye certificados fitosanitarios oficiales y análisis químicos de laboratorio.",
    },
    publicationsSection: {
      badge: "ACTUALIDAD",
      title: "Publicaciones y Noticias Corporativas",
      subtitle:
        "Entérese de las últimas novedades sobre cosechas en Túnez, tendencias del mercado y anuncios de Verdalia.",
      readMore: "Leer Artículo",
    },
    contactCta: {
      title: "Inicie su Alianza Comercial con Verdalia",
      subtitle:
        "Contacte a nuestros directores de exportación para recibir propuestas comerciales y cotizaciones personalizadas.",
      btn: "Solicitar Cotización B2B",
    },
    contactForm: {
      title: "Solicitud de Cotización Comercial",
      subtitle:
        "Complete el siguiente formulario y nuestro equipo de exportación responderá con una propuesta en menos de 24 horas.",
      fullName: "Nombre Completo *",
      companyName: "Nombre de la Empresa *",
      country: "País *",
      email: "Correo Corporativo *",
      phone: "Teléfono / WhatsApp",
      productInterest: "Producto de Interés *",
      selectProduct: "Seleccione una categoría...",
      estimatedQuantity: "Volumen Estimado (ej. 1 Contenedor, 20 TM)",
      destinationCountry: "Puerto o País de Destino",
      message: "Detalles del Requerimiento Comercial *",
      uploadFile: "Adjuntar Especificación o Licitación (Opcional)",
      uploadHint: "PDF, DOCX, PNG o JPG (Máx 10MB)",
      privacyConsent:
        "Acepto que Verdalia Company VC procese mis datos con fines de comunicación comercial. *",
      submitBtn: "Enviar Solicitud Comercial",
      submitting: "Enviando solicitud...",
      successMessage:
        "Gracias por contactar a Verdalia Company VC. Su mensaje ha sido recibido con éxito. Nuestro equipo se comunicará con usted a la brevedad.",
      errorMessage:
        "Por favor complete todos los campos obligatorios antes de enviar.",
    },
    footer: {
      tagline: "Calidad • Compromiso • Entrega",
      quickLinks: "Enlaces Rápidos",
      contactUs: "Contacto Directo",
      leadership: "Dirección y Socios",
      address: "Verdalia Company VC • Túnez",
      rightsReserved: "Todos los derechos reservados.",
      developedBy: "Desarrollado por Mohamed Mtir",
    },
    aboutPage: {
      heroBadge: "SOBRE VERDALIA COMPANY VC",
      heroTitle: "Herencia Tunecina,",
      heroTitleAccent: "Pasión Global.",
      heroSubtitle: "Fundada en Túnez, Verdalia Company VC conecta siglos de sabiduría olivarera mediterránea con los exigentes estándares de los importadores internacionales.",
      whoWeAreBadge: "QUIÉNES SOMOS",
      whoWeAreTitle: "Aceite de Oliva Auténtico desde el Corazón del Mediterráneo",
      whoWeAreP1: "Verdalia Company VC es una empresa tunecina especializada en la exportación de aceites de oliva de calidad superior para distribuidores y fabricantes internacionales.",
      whoWeAreP2: "Nuestra alianza con la almazara Amari nos proporciona moderna tecnología de extracción en frío y almacenamiento en acero inoxidable para asegurar la máxima pureza.",
      amariBadge: "Alianza Almazara Amari",
      amariDesc: "Integración directa desde la cosecha hasta la extracción en frío.",
      workWithUs: "Trabaje con Verdalia →",
      missionTitle: "Nuestra Misión",
      missionDesc: "Nuestra misión es promover la calidad del aceite de oliva tunecino en todo el mundo construyendo relaciones sólidas con importadores.",
      visionTitle: "Nuestra Visión",
      visionDesc: "Ser el socio de confianza internacional para el suministro y exportación de aceite de oliva tunecino con integridad y logística impecable.",
      valuesBadge: "NUESTROS PILARES",
      valuesTitle: "Nuestros Valores",
      valuesSubtitle: "Los principios que rigen nuestro abastecimiento, análisis de laboratorio y exportación.",
      leadershipBadge: "LIDERAZGO EJECUTIVO",
      leadershipTitle: "Dirección de Verdalia y Socios de la Almazara",
      leadershipSubtitle: "Profesionales experimentados que conectan la producción local con el comercio internacional.",
      contactCtaTitle: "¿Listo para Hablar de sus Necesidades?",
      contactCtaSubtitle: "Nuestros especialistas en exportación están disponibles para revisar sus parámetros y contratos de suministro.",
      contactCtaBtn: "Solicitar Cotización",
    },
    productsPage: {
      bannerBadge: "CATÁLOGO",
      bannerTitle: "Variedades de aceite de oliva",
      bannerTitleAccent: "para exportación a granel.",
      bannerSubtitle: "Virgen extra, ecológico, refinado o de orujo — entregado en flexitanks, IBCs o bidones. Solo venta a granel para profesionales.",
      categoriesLabel: "Categorías:",
      filters: {
        all: "Todos los Productos",
        organic: "Ecológico",
        extraVirgin: "Virgen Extra",
        refined: "Refinado",
        pomace: "Orujo de Oliva",
      },
      loading: "Cargando catálogo de productos...",
      bulkBadge: "Solo B2B · Granel Cisternas e IBC",
      formatsLabel: "Formatos Disponibles:",
      quoteBtn: "Solicitar Cotización",
      specsBtn: "Ficha Técnica",
    },
    exportPage: {
      bannerBadge: "LOGÍSTICA GLOBAL DE EXPORTACIÓN",
      bannerTitle: "Aceite de Oliva Tunecino",
      bannerTitleAccent: "Exportado a Todo el Mundo.",
      bannerSubtitle: "Verdalia Company VC apoya a empresas internacionales que buscan importar aceite de oliva tunecino con soluciones adaptadas a sus mercados y seguimiento marítimo integral.",
      servicesBadge: "NUESTRO COMPROMISO DE EXPORTACIÓN",
      servicesTitle: "Servicios Integrales de Exportación B2B",
      servicesSubtitle: "Desde la estructuración de contratos hasta el despacho de aduanas, nuestro equipo gestiona cada detalle.",
      s1Title: "Exportación Internacional",
      s1Desc: "Envíos en contenedores completos (FCL) desde los puertos principales de Túnez hacia Europa, América, Oriente Medio y Asia.",
      s2Title: "Documentación de Exportación",
      s2Desc: "Expedientes completos de conformidad: EUR.1, Certificado de Origen, certificados fitosanitarios y análisis de laboratorio.",
      s3Title: "Formatos a Granel",
      s3Desc: "Flexitanks ~22.000 L, contenedores IBC 1.000 L y bidones de 200 L. Suministro exclusivamente industrial.",
      s4Title: "Soporte Comercial Dedicado",
      s4Desc: "Ejecutivos comerciales multilingües para proformas, muestras y seguimiento logístico.",
      packagingBadge: "ENVASADO A GRANEL",
      packagingTitle: "Diseñado para un Tránsito Marítimo Seguro",
      packagingSubtitle: "Utilizamos contenedores alimentarios certificados para garantizar la estabilidad del aceite a larga distancia.",
      stepsBadge: "PROCESO DE EXPORTACIÓN",
      stepsTitle: "Nuestro Proceso de Exportación en 7 Pasos",
      stepsSubtitle: "Un procedimiento estructurado que garantiza el cumplimiento comercial y los plazos de entrega.",
      ctaTitle: "¿Listo para Realizar su Pedido de Exportación?",
      ctaSubtitle: "Contacte con nuestro departamento comercial internacional para recibir fichas técnicas, certificados y cotizaciones.",
      ctaBtn: "Solicitar Cotización Comercial",
    },
    certificationsPage: {
      bannerBadge: "CALIDAD Y CONFORMIDAD",
      bannerTitle: "Estándares Internacionales",
      bannerTitleAccent: "y Trazabilidad Certificada.",
      bannerSubtitle: "Verdalia Company VC cumple con las normativas de seguridad alimentaria más exigentes a nivel mundial.",
      auditBadge: "ACREDITACIONES Y AUDITORÍAS",
      auditTitle: "Certificaciones de Empresa Verificadas",
      auditSubtitle: "Nuestros productos e instalaciones son auditados periódicamente por organismos independientes acreditados.",
      loading: "Cargando certificaciones...",
      guaranteeBadge: "PROTOCOLOS RIGUROSOS DE LABORATORIO",
      guaranteeTitle: "Análisis Físico-Químico y Sensorial Certificado",
      guaranteeDesc: "Cada lote se somete a análisis completos antes del embarque, confirmando acidez, peróxidos y ausencia de defectos organolépticos según normas del COI.",
      ctaTitle: "Solicitar Expedientes de Certificación",
      ctaSubtitle: "¿Requiere certificados de auditoría completos, informes COA o certificados ecológicos para su equipo de calidad?",
      ctaBtn: "Contactar Dpto. Calidad",
    },
    contactPage: {
      bannerBadge: "CONSULTAS COMERCIALES Y EXPORTACIÓN",
      bannerTitle: "Póngase en Contacto",
      bannerTitleAccent: "con Verdalia Company VC.",
      bannerSubtitle: "Atendemos las consultas de importadores, distribuidores mayoristas y empresas alimentarias interesadas en aceite tunecino.",
      hqBadge: "SEDE OFICIAL",
      locationTitle: "Ubicación",
      locationVal: "Túnez (Zonas Olivareras y Almazaras)",
      hoursTitle: "Horario Comercial",
      hoursVal: "Lunes - Viernes: 08:00 - 18:00 (GMT+1)",
      hoursSupport: "Soporte comercial WhatsApp 24/7",
      partnersTitle: "CONTACTOS DIRECTOS DE SOCIOS",
    },
  },
  it: {
    nav: {
      home: "Home",
      about: "Chi Siamo",
      products: "Prodotti",
      export: "Esportazione",
      certifications: "Certificazioni",
      contact: "Contatti",
      requestQuote: "Richiedi Preventivo",
    },
    hero: {
      badge: "OLIO D'OLIVA TUNISINO DI ALTA QUALITÀ",
      title: "Dalla Tunisia,",
      titleAccent: "al Mondo Intero.",
      subtitle:
        "Verdalia Company VC porta l'eccellenza dell'olivicoltura tunisina a importatori, grossisti e distributori commerciali nei mercati di tutto il mondo.",
      discoverBtn: "Scopri i Nostri Prodotti",
      quoteBtn: "Richiedi Preventivo",
    },
    trustStrip: {
      originTitle: "100% Origine Tunisia",
      originDesc: "Raccolto dai migliori oliveti mediterranei",
      pressTitle: "Estratto a Freddo & Naturale",
      pressDesc: "Ricchezza ottimale di polifenoli e purezza organolettica",
      exportTitle: "Esportazione Mondiale",
      exportDesc: "Catena logistica e spedizioni marittime affidabili",
    },
    aboutSection: {
      badge: "CHI È VERDALIA",
      title: "Tradizione Tunisina, Impegno Globale",
      desc1:
        "Verdalia Company VC è un'azienda tunisina specializzata nell'esportazione di olio extravergine, biologico e raffinato per i mercati internazionali più esigenti.",
      desc2:
        "Unendo l'antica tradizione agricola con moderni impianti di estrazione a freddo, garantiamo tracciabilità totale, qualità costante e partnership commerciali stabili.",
      point1Title: "Terreno Ricco e Solare",
      point1Desc:
        "Un clima mediterraneo che regala cultivar autoctone ricche di profumi e antiossidanti.",
      point2Title: "Frantoi all'Avanguardia",
      point2Desc:
        "Estrazione a freddo continua e stoccaggio in cisterne di acciaio inox con azoto.",
      point3Title: "Esportazione & Dogana",
      point3Desc:
        "Documentazione completa, analisi certificate e soluzioni di spedizione su misura.",
      learnMoreBtn: "Scopri di Più",
    },
    productsSection: {
      badge: "CATALOGO PRODOTTI",
      title: "Oli d'Oliva Straordinari per i Mercati Internazionali",
      subtitle:
        "Dall'extravergine biologico all'olio di sansa per applicazioni commerciali, rispondiamo a qualsiasi esigenza B2B.",
      viewAllBtn: "Tutti i Prodotti",
      requestInfoBtn: "Scheda Tecnica",
      specs: {
        acidity: "Acidità",
        variety: "Varietà di olive",
        extraction: "Metodo di estrazione",
        origin: "Origine",
        formats: "Formati disponibili",
        packaging: "Confezionamento",
        moq: "Quantità minima d'ordine",
      },
    },
    whyChooseUs: {
      badge: "PERCHÉ SCEGLIERE VERDALIA",
      title: "Un Partner B2B Fondato su Qualità e Puntualità",
      subtitle:
        "Collaboriamo con professionisti del settore alimentare che cercano forniture stabili e garantite.",
      item1Title: "Origine Tunisina Autentica",
      item1Desc:
        "Approvvigionamento diretto con tracciabilità garantita dal campo alla spedizione.",
      item2Title: "Fornitura Costante",
      item2Desc:
        "Capacità di molitura e stoccaggio per soddisfare contratti continuativi tutto l'anno.",
      item3Title: "Rigoroso Controllo Qualità",
      item3Desc:
        "Analisi sistematiche presso laboratori accreditati per ogni singolo lotto di export.",
      item4Title: "Logistica Flessibile",
      item4Desc:
        "Flexitank sfusi (21.000L - 24.000L), cisterne IBC o bottiglie per private label.",
    },
    exportSection: {
      badge: "LOGISTICA INTERNAZIONALE",
      title: "Olio d'Oliva Tunisino Esportato nel Mondo",
      subtitle:
        "Verdalia Company VC gestisce tutte le fasi del trasporto marittimo e stradale in piena conformità doganale.",
      btn: "Il Nostro Processo Export",
      stat1Number: "100%",
      stat1Label: "Focus Esportazione",
      stat2Number: "5+",
      stat2Label: "Continenti Raggiunti",
      stat3Number: "24/7",
      stat3Label: "Supporto Commerciale",
      packagingCardTitle: "Imballaggi Personalizzati e Spedizioni Flessibili",
      packagingCardDesc:
        "Dallo sfuso in Flexitank e IBC a linee complete di bottiglie in vetro e lattine.",
      stepsTitle: "Processo di Esportazione in 7 Fasi",
      step1: "1. Richiesta del Cliente",
      step2: "2. Definizione dei Requisiti Tecnici",
      step3: "3. Offerta Commerciale & Tecnica",
      step4: "4. Conferma Prodotto e Imballaggio",
      step5: "5. Documentazione Doganale e Analisi di Laboratorio",
      step6: "6. Coordinamento Logistico e Carico",
      step7: "7. Consegna Internazionale e Assistenza",
    },
    certificationsSection: {
      badge: "GARANZIA DI QUALITÀ",
      title: "Eccellenza Certificata e Conformità Globale",
      subtitle:
        "I nostri processi rispettano i più rigorosi standard internazionali di sicurezza alimentare.",
      viewAllBtn: "Visualizza Certificazioni",
      officialGuarantee: "Standard Internazionali Certificati",
      assuranceText:
        "Ogni spedizione è scortata da certificati fitosanitari ufficiali e analisi chimiche complete.",
    },
    publicationsSection: {
      badge: "NOTIZIE DI SETTORE",
      title: "Pubblicazioni e Notizie Aziendali",
      subtitle:
        "Rimani aggiornato sulla raccolta delle olive in Tunisia, sulle tendenze di mercato e sulle novità Verdalia.",
      readMore: "Leggi Articolo",
    },
    contactCta: {
      title: "Inizia la Tua Collaborazione con Verdalia",
      subtitle:
        "Contatta i nostri direttori commerciali per concordare campionature, prezzi e accordi di fornitura.",
      btn: "Richiedi un Preventivo Commerciale",
    },
    contactForm: {
      title: "Richiesta Preventivo Commerciale",
      subtitle:
        "Compila il modulo sottostante: i nostri responsabili export ti invieranno una proposta dedicata entro 24 ore.",
      fullName: "Nome Completo *",
      companyName: "Nome Azienda *",
      country: "Paese *",
      email: "Email Aziendale *",
      phone: "Telefono / WhatsApp",
      productInterest: "Prodotto di Interesse *",
      selectProduct: "Seleziona una qualità...",
      estimatedQuantity: "Quantità Stimata (es: 1 Container, 20 T)",
      destinationCountry: "Porto o Paese di Destinazione",
      message: "Dettagli della Richiesta Commerciale *",
      uploadFile: "Allega Capitolato Tecnico o Richiesta (Opzionale)",
      uploadHint: "PDF, DOCX, PNG o JPG (Max 10MB)",
      privacyConsent:
        "Acconsento al trattamento dei miei dati da parte di Verdalia Company VC a fini commerciali. *",
      submitBtn: "Invia Richiesta Commerciale",
      submitting: "Invio in corso...",
      successMessage:
        "Grazie per aver contattato Verdalia Company VC. La tua richiesta è stata ricevuta. Il nostro team ti risponderà al più presto.",
      errorMessage:
        "Si prega di compilare tutti i campi obbligatori prima di inviare.",
    },
    footer: {
      tagline: "Qualità • Impegno • Consegna",
      quickLinks: "Link Rapidi",
      contactUs: "Contatto Diretto",
      leadership: "Direzione & Partner",
      address: "Verdalia Company VC • Tunisia",
      rightsReserved: "Tutti i diritti riservati.",
      developedBy: "Sviluppato da Mohamed Mtir",
    },
    aboutPage: {
      heroBadge: "CHI È VERDALIA COMPANY VC",
      heroTitle: "Un'Eredità Tunisina,",
      heroTitleAccent: "Una Passione Globale.",
      heroSubtitle: "Fondata in Tunisia, Verdalia Company VC unisce secoli di tradizione olivicola mediterranea ai rigorosi standard degli importatori internazionali.",
      whoWeAreBadge: "CHI SIAMO",
      whoWeAreTitle: "Autentico Olio d'Oliva dal Cuore del Mediterraneo",
      whoWeAreP1: "Verdalia Company VC è un'impresa tunisina specializzata nell'esportazione di oli d'oliva di qualità superiore per distributori e industrie alimentari di tutto il mondo.",
      whoWeAreP2: "La nostra partnership strategica con il frantoio Amari ci garantisce moderni impianti di estrazione a freddo e stoccaggio in serbatoi inox per assicurare la massima qualità.",
      amariBadge: "Partnership Frantoio Amari",
      amariDesc: "Integrazione diretta dalla raccolta all'estrazione a freddo continua.",
      workWithUs: "Collabora con Verdalia →",
      missionTitle: "La Nostra Missione",
      missionDesc: "La nostra missione è promuovere l'eccellenza dell'olio d'oliva tunisino nel mondo, consolidando relazioni durature con partner internazionali.",
      visionTitle: "La Nostra Visione",
      visionDesc: "Essere il partner internazionale di riferimento per l'approvvigionamento e l'esportazione di olio d'oliva tunisino di massima affidabilità.",
      valuesBadge: "I NOSTRI PILASTRI",
      valuesTitle: "I Nostri Valori Fondamentali",
      valuesSubtitle: "I principi che guidano la nostra selezione, i controlli di laboratorio e le operazioni di esportazione.",
      leadershipBadge: "LEADERSHIP AZIENDALE",
      leadershipTitle: "Direzione Verdalia e Partner del Frantoio",
      leadershipSubtitle: "Professionisti esperti che collegano la produzione agricola locale al commercio B2B internazionale.",
      contactCtaTitle: "Pronto a Discutere dei Tuoi Ordini?",
      contactCtaSubtitle: "I nostri esperti sono a disposizione per esaminare i parametri tecnici e definire contratti di fornitura su misura.",
      contactCtaBtn: "Richiedi un Preventivo",
    },
    productsPage: {
      bannerBadge: "CATALOGO",
      bannerTitle: "Varietà di olio d'oliva",
      bannerTitleAccent: "per esportazione sfuso.",
      bannerSubtitle: "Extra vergine, biologico, raffinato o di sansa — consegnato in flexitank, IBC o fusti. Fornitura sfusa esclusivamente B2B.",
      categoriesLabel: "Categorie:",
      filters: {
        all: "Tutti i Prodotti",
        organic: "Biologico",
        extraVirgin: "Extra Vergine",
        refined: "Raffinato",
        pomace: "Sansa di Oliva",
      },
      loading: "Caricamento catalogo prodotti...",
      bulkBadge: "Solo B2B · Cisterne Sfuso & IBC",
      formatsLabel: "Formati Disponibili:",
      quoteBtn: "Richiedi Preventivo",
      specsBtn: "Scheda Tecnica",
    },
    exportPage: {
      bannerBadge: "LOGISTICA DI ESPORTAZIONE GLOBALE",
      bannerTitle: "Olio d'Oliva Tunisino",
      bannerTitleAccent: "Esportato nel Mondo.",
      bannerSubtitle: "Verdalia Company VC supporta le aziende internazionali nell'importazione di olio d'oliva tunisino di alta qualità, con soluzioni su misura per ogni mercato.",
      servicesBadge: "IL NOSTRO IMPEGNO PER L'EXPORT",
      servicesTitle: "Servizi di Esportazione B2B Completi",
      servicesSubtitle: "Dalla redazione dei contratti allo sdoganamento a destinazione, il nostro team gestisce ogni fase.",
      s1Title: "Esportazione Internazionale",
      s1Desc: "Spedizioni in container completi (FCL) dai porti tunisini verso Europa, Nord America, Medio Oriente e Asia.",
      s2Title: "Documentazione di Esportazione",
      s2Desc: "Fascicoli di conformità completi: certificato EUR.1, certificato di origine, certificati fitosanitari e analisi di laboratorio.",
      s3Title: "Formati Sfuso",
      s3Desc: "Flexitank ~22.000 L, cisterne IBC 1.000 L e fusti da 200 L. Spedizioni industriali esclusive.",
      s4Title: "Supporto Commerciale Dedicato",
      s4Desc: "Referenti commerciali multilingue per preventivi proforma, invio campioni e monitoraggio logistico.",
      packagingBadge: "IMBALLAGGI SFUSO",
      packagingTitle: "Progettati per un Trasporto Marittimo Sicuro",
      packagingSubtitle: "Utilizziamo contenitori alimentari certificati che garantiscono la stabilità dell'olio su lunghe distanze.",
      stepsBadge: "PROCESSO DI ESPORTAZIONE",
      stepsTitle: "Il Nostro Processo di Export in 7 Fasi",
      stepsSubtitle: "Una procedura trasparente e strutturata che assicura la massima conformità commerciale.",
      ctaTitle: "Pronto a Pianificare il Tuo Ordine di Esportazione?",
      ctaSubtitle: "Contatta il nostro ufficio vendite internazionali per ricevere schede tecniche, certificati e un'offerta personalizzata.",
      ctaBtn: "Richiedi Preventivo Commerciale",
    },
    certificationsPage: {
      bannerBadge: "QUALITÀ E CONFORMITÀ",
      bannerTitle: "Standard Internazionali",
      bannerTitleAccent: "e Tracciabilità Certificata.",
      bannerSubtitle: "Verdalia Company VC rispetta i più rigorosi standard internazionali di sicurezza alimentare.",
      auditBadge: "ACCREDITAMENTI E AUDIT",
      auditTitle: "Certificazioni Aziendali Verificate",
      auditSubtitle: "I nostri prodotti e impianti sono sottoposti a verifiche periodiche da parte di organismi indipendenti accreditati.",
      loading: "Caricamento certificazioni...",
      guaranteeBadge: "RIGOROSI PROTOCOLLI DI LABORATORIO",
      guaranteeTitle: "Analisi Fisico-Chimiche e Sensoriali Certificate",
      guaranteeDesc: "Ogni lotto di produzione viene testato prima dell'imbarco, confermando acidità, perossidi e assenza di difetti secondo gli standard del COI.",
      ctaTitle: "Richiedi i Fascicoli di Certificazione",
      ctaSubtitle: "Hai bisogno dei certificati di audit completi, schede COA o certificati biologici per il tuo team di controllo qualità?",
      ctaBtn: "Contatta Ufficio Qualità",
    },
    contactPage: {
      bannerBadge: "RICHIESTE COMMERCIALI & EXPORT",
      bannerTitle: "Contatta",
      bannerTitleAccent: "Verdalia Company VC.",
      bannerSubtitle: "Rispondiamo alle richieste di importatori, distributori e industrie alimentari alla ricerca di autentico olio d'oliva tunisino.",
      hqBadge: "SEDE UFFICIALE",
      locationTitle: "Localizzazione",
      locationVal: "Tunisia (Uliveti e Frantoi)",
      hoursTitle: "Orari di Lavoro",
      hoursVal: "Lunedì - Venerdì: 08:00 - 18:00 (GMT+1)",
      hoursSupport: "Supporto commerciale WhatsApp 24/7",
      partnersTitle: "CONTATTI DIRETTI DEI PARTNER",
    },
  },
};
