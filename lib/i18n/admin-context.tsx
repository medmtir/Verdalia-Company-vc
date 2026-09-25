import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/lib/types";
import { LOCALES, LOCALE_METAS } from "@/lib/i18n/config";

export interface AdminDictionary {
  common: {
    save: string;
    saving: string;
    savedSuccess: string;
    add: string;
    delete: string;
    edit: string;
    cancel: string;
    confirm: string;
    actions: string;
    status: string;
    loading: string;
    active: string;
    inactive: string;
    published: string;
    draft: string;
    upload: string;
    uploading: string;
  };
  sidebar: {
    overview: string;
    messages: string;
    products: string;
    certifications: string;
    publications: string;
    homepage: string;
    about: string;
    export: string;
    media: string;
    contacts: string;
    seo: string;
    settings: string;
    signOut: string;
    companyTag: string;
  };
  header: {
    title: string;
    notifications: string;
    recentNotifications: string;
    unreadCount: (count: number) => string;
    noRecent: string;
    viewAll: string;
    openInbox: string;
    viewLiveWebsite: string;
    newInquiryToast: string;
  };
  overview: {
    tag: string;
    title: string;
    desc: string;
    reviewInquiries: (count: number) => string;
    unreadInquiries: string;
    totalReceived: (count: number) => string;
    activeProducts: string;
    totalCatalog: (count: number) => string;
    certifications: string;
    certifiedBodies: (count: number) => string;
    publications: string;
    publishedArticles: (count: number) => string;
    systemHealth: string;
    allSystemsOnline: string;
    dbStatus: string;
    dbActive: string;
    multilingualSeo: string;
    activeLocalesCount: string;
    securitySession: string;
    encryptedSession: string;
    recentInquiriesTitle: string;
    noInquiriesYet: string;
    quickShortcuts: string;
    shortcutAddProduct: string;
    shortcutNewCert: string;
    shortcutNewArticle: string;
    shortcutEditHome: string;
  };
  messagesPage: {
    title: string;
    subtitle: string;
    refresh: string;
    emptyTrash: (count: number) => string;
    tabAll: string;
    tabUnread: string;
    tabContacted: string;
    tabArchived: string;
    tabTrash: string;
    searchPlaceholder: string;
    trashNoticeTitle: string;
    trashNoticeDesc: string;
    loading: string;
    emptyTrashText: string;
    noMatches: string;
    thCompany: string;
    thProduct: string;
    thDestination: string;
    thAttachment: string;
    thStatus: string;
    thAutoPurge: string;
    thDate: string;
    thActions: string;
    viewDetails: string;
    moveToTrash: string;
    restore: string;
    permanentDelete: string;
    statusUnread: string;
    statusRead: string;
    statusContacted: string;
    statusArchived: string;
    statusTrash: string;
    modalCancel: string;
    modalConfirm: string;
    modalProcessing: string;
  };
  homepagePage: {
    title: string;
    subtitle: string;
    heroSection: string;
    heroDesc: string;
    badge: string;
    headline: string;
    tagline: string;
    primaryCta: string;
    secondaryCta: string;
    aboutSection: string;
    aboutDesc: string;
    whyChooseSection: string;
    whyChooseDesc: string;
    exportSection: string;
    exportDesc: string;
    saveBtn: (lang: string) => string;
  };
  aboutPage: {
    title: string;
    subtitle: string;
    saveSuccess: (lang: string) => string;
    heroSection: string;
    heroDesc: string;
    heritageSection: string;
    heritageDesc: string;
    pillarsSection: string;
    pillarsDesc: string;
    saveBtn: (lang: string) => string;
  };
  exportPage: {
    title: string;
    subtitle: string;
    saveSuccess: (lang: string) => string;
    shippingSection: string;
    shippingDesc: string;
    logisticsSection: string;
    logisticsDesc: string;
    saveBtn: (lang: string) => string;
  };
  productsPage: {
    title: string;
    subtitle: string;
    addNew: string;
    tableThProduct: string;
    tableThSpecs: string;
    tableThStatus: string;
    tableThActions: string;
    modalCreateTitle: string;
    modalEditTitle: string;
  };
  certificationsPage: {
    title: string;
    subtitle: string;
    addNew: string;
    tableThCert: string;
    tableThIssuer: string;
    tableThStatus: string;
    tableThActions: string;
  };
  publicationsPage: {
    title: string;
    subtitle: string;
    addNew: string;
    tableThTitle: string;
    tableThStatus: string;
    tableThActions: string;
  };
  mediaPage: {
    title: string;
    subtitle: string;
    uploadNew: string;
    tableThFile: string;
    tableThSize: string;
    tableThDate: string;
    tableThActions: string;
    noMedia: string;
  };
  contactsPage: {
    title: string;
    subtitle: string;
    hqSection: string;
    partnersSection: string;
    addPartner: string;
  };
  seoPage: {
    title: string;
    subtitle: string;
    metaTitle: string;
    metaDesc: string;
    keywords: string;
    ogTitle: string;
  };
  settingsPage: {
    title: string;
    subtitle: string;
    changePasswordTitle: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    updateBtn: string;
  };
}

export const ADMIN_DICTIONARIES: Record<Locale, AdminDictionary> = {
  en: {
    common: {
      save: "Save Changes",
      saving: "Saving...",
      savedSuccess: "Saved successfully!",
      add: "Add New",
      delete: "Delete",
      edit: "Edit",
      cancel: "Cancel",
      confirm: "Confirm",
      actions: "Actions",
      status: "Status",
      loading: "Loading...",
      active: "Active",
      inactive: "Inactive",
      published: "Published",
      draft: "Draft",
      upload: "Upload",
      uploading: "Uploading...",
    },
    sidebar: {
      overview: "Overview",
      messages: "Messages & Inquiries",
      products: "Products Catalog",
      certifications: "Certifications",
      publications: "Publications & News",
      homepage: "Homepage Content",
      about: "About Us Content",
      export: "Export Content",
      media: "Media & Images",
      contacts: "Contacts & Partners",
      seo: "SEO & Multilingual Meta",
      settings: "Security & Settings",
      signOut: "Sign Out",
      companyTag: "Company VC",
    },
    header: {
      title: "Verdalia Executive CMS",
      notifications: "Notifications",
      recentNotifications: "Recent Notifications",
      unreadCount: (count) => `${count} unread`,
      noRecent: "No recent notifications.",
      viewAll: "View all",
      openInbox: "Open full inbox →",
      viewLiveWebsite: "View Live Website",
      newInquiryToast: "New Inquiry Received!",
    },
    overview: {
      tag: "Institutional Control Center",
      title: "Verdalia Company VC Dashboard",
      desc: "Manage your international B2B inquiries, product catalog, certifications, multilingual SEO and website publications.",
      reviewInquiries: (count) => `Review Inquiries (${count})`,
      unreadInquiries: "Unread Inquiries",
      totalReceived: (count) => `Total received: ${count}`,
      activeProducts: "Active Products",
      totalCatalog: (count) => `Total catalog: ${count}`,
      certifications: "Certifications",
      certifiedBodies: (count) => `Certified bodies: ${count}`,
      publications: "Publications",
      publishedArticles: (count) => `Published articles: ${count}`,
      systemHealth: "System Status & Integrity",
      allSystemsOnline: "Operational",
      dbStatus: "JSON Database",
      dbActive: "Connected & Active",
      multilingualSeo: "Multilingual Engine",
      activeLocalesCount: "5 International Locales",
      securitySession: "Security Session",
      encryptedSession: "JWT Secured",
      recentInquiriesTitle: "Recent B2B Inquiries",
      noInquiriesYet: "No inquiries received yet.",
      quickShortcuts: "Quick Management Shortcuts",
      shortcutAddProduct: "Add / Manage Product",
      shortcutNewCert: "Add Certification",
      shortcutNewArticle: "Create Article",
      shortcutEditHome: "Edit Homepage",
    },
    messagesPage: {
      title: "Commercial Inquiries & RFQs",
      subtitle: "Manage wholesale quote requests and institutional inquiries from international importers.",
      refresh: "Refresh",
      emptyTrash: (count) => `Empty Trash (${count})`,
      tabAll: "All Inquiries",
      tabUnread: "Unread",
      tabContacted: "Contacted",
      tabArchived: "Archived",
      tabTrash: "Trash",
      searchPlaceholder: "Search company, contact name, email...",
      trashNoticeTitle: "Temporary Trash (7-day safety):",
      trashNoticeDesc: "Discarded inquiries remain here for 7 days before being automatically purged forever. You can restore or permanently delete them at any time.",
      loading: "Loading inquiries...",
      emptyTrashText: "The trash is empty.",
      noMatches: "No inquiries match your criteria.",
      thCompany: "Company & Contact",
      thProduct: "Product & Volume",
      thDestination: "Country & Port",
      thAttachment: "Attachment",
      thStatus: "Status",
      thAutoPurge: "Auto-purge (7d)",
      thDate: "Date Received",
      thActions: "Actions",
      viewDetails: "View Details",
      moveToTrash: "Move to Trash",
      restore: "Restore",
      permanentDelete: "Permanent Delete",
      statusUnread: "Unread",
      statusRead: "Read",
      statusContacted: "Contacted",
      statusArchived: "Archived",
      statusTrash: "Trash",
      modalCancel: "Cancel",
      modalConfirm: "Confirm",
      modalProcessing: "Processing...",
    },
    homepagePage: {
      title: "Homepage Content Management",
      subtitle: "Edit the Hero headlines, narrative texts, and CTAs across all languages.",
      heroSection: "Hero Section",
      heroDesc: "Main banner greeting international visitors.",
      badge: "Badge / Tagline",
      headline: "Hero Main Headline",
      tagline: "Secondary Narrative / Subtitle",
      primaryCta: "Primary Button (Discover)",
      secondaryCta: "Secondary Button (Request Quote)",
      aboutSection: "About Overview Section",
      aboutDesc: "Narrative preview section on the home page.",
      whyChooseSection: "Why Choose Verdalia",
      whyChooseDesc: "Key pillars, institutional strengths, and quality standards.",
      exportSection: "Export & Logistics Teaser",
      exportDesc: "Global supply chain and ports info.",
      saveBtn: (lang) => `Save Homepage Content (${lang.toUpperCase()})`,
    },
    aboutPage: {
      title: "About Us Content Editor",
      subtitle: "Edit company background, mission, vision, and Amari Olive Mill heritage across all languages.",
      saveSuccess: (lang) => `About Us narrative for (${lang.toUpperCase()}) saved successfully!`,
      heroSection: "Hero & Introduction",
      heroDesc: "Main banner on About page.",
      heritageSection: "Heritage & Amari Mill Legacy",
      heritageDesc: "Historical narrative and regional mill roots.",
      pillarsSection: "Vision & Institutional Commitments",
      pillarsDesc: "Values and ethical practices.",
      saveBtn: (lang) => `Save About Page Content (${lang.toUpperCase()})`,
    },
    exportPage: {
      title: "Export & Logistics Content Editor",
      subtitle: "Customize international ports, bulk shipping modalities, and incoterms across all languages.",
      saveSuccess: (lang) => `Export logistics content for (${lang.toUpperCase()}) saved successfully!`,
      shippingSection: "Global Logistics Overview",
      shippingDesc: "Export destinations, shipping lines, and container capacities.",
      logisticsSection: "Quality & Temperature Control",
      logisticsDesc: "Bulk flexitank safety and certification details.",
      saveBtn: (lang) => `Save Export Content (${lang.toUpperCase()})`,
    },
    productsPage: {
      title: "Products Catalog Management",
      subtitle: "Manage extra virgin olive oils, bulk volumes, acidity specs, and certifications.",
      addNew: "Add New Product",
      tableThProduct: "Product & Grade",
      tableThSpecs: "Acidity & Specifications",
      tableThStatus: "Status",
      tableThActions: "Actions",
      modalCreateTitle: "Add New Olive Oil Grade",
      modalEditTitle: "Edit Product Details",
    },
    certificationsPage: {
      title: "Certifications & Accreditations",
      subtitle: "Manage international quality badges (BRC, IFS, ISO 22000, BIO Organic, Halal, Kosher).",
      addNew: "Add Certification",
      tableThCert: "Certification",
      tableThIssuer: "Accreditation Body",
      tableThStatus: "Status",
      tableThActions: "Actions",
    },
    publicationsPage: {
      title: "Publications, Market Insights & News",
      subtitle: "Publish harvest reports, bulk olive oil market analyses, and company announcements.",
      addNew: "New Publication",
      tableThTitle: "Article Title & Topic",
      tableThStatus: "Status",
      tableThActions: "Actions",
    },
    mediaPage: {
      title: "Media Library & Brand Assets",
      subtitle: "Upload and organize product photography, facility photos, and laboratory reports.",
      uploadNew: "Upload New Asset",
      tableThFile: "File & Preview",
      tableThSize: "Size",
      tableThDate: "Uploaded",
      tableThActions: "Actions",
      noMedia: "No media files uploaded yet.",
    },
    contactsPage: {
      title: "Company Contacts & Institutional Partners",
      subtitle: "Configure global headquarters, commercial emails, and international representative offices.",
      hqSection: "Corporate Headquarters & Plant",
      partnersSection: "International Partners & Importers",
      addPartner: "Add Partner Office",
    },
    seoPage: {
      title: "SEO & Multilingual Meta Configuration",
      subtitle: "Optimize search engine rankings, meta tags, and structured data across all target markets.",
      metaTitle: "Meta Title",
      metaDesc: "Meta Description",
      keywords: "Target Keywords (comma-separated)",
      ogTitle: "OpenGraph Social Title",
    },
    settingsPage: {
      title: "Security & Administrator Settings",
      subtitle: "Manage administrative access credentials and session security protocols.",
      changePasswordTitle: "Change Administrator Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updateBtn: "Update Credentials",
    },
  },
  fr: {
    common: {
      save: "Enregistrer les modifications",
      saving: "Enregistrement...",
      savedSuccess: "Enregistré avec succès !",
      add: "Ajouter",
      delete: "Supprimer",
      edit: "Modifier",
      cancel: "Annuler",
      confirm: "Confirmer",
      actions: "Actions",
      status: "Statut",
      loading: "Chargement...",
      active: "Actif",
      inactive: "Inactif",
      published: "Publié",
      draft: "Brouillon",
      upload: "Téléverser",
      uploading: "Téléversement...",
    },
    sidebar: {
      overview: "Vue d'ensemble",
      messages: "Messages & Devis",
      products: "Catalogue Produits",
      certifications: "Certifications",
      publications: "Actualités & Articles",
      homepage: "Contenu Accueil",
      about: "Contenu À Propos",
      export: "Contenu Export",
      media: "Médiathèque & Photos",
      contacts: "Contacts & Partenaires",
      seo: "SEO & Métadonnées",
      settings: "Sécurité & Paramètres",
      signOut: "Déconnexion",
      companyTag: "Société VC",
    },
    header: {
      title: "Verdalia Executive CMS",
      notifications: "Notifications",
      recentNotifications: "Notifications Récentes",
      unreadCount: (count) => `${count} non lue(s)`,
      noRecent: "Aucune notification récente.",
      viewAll: "Voir tout",
      openInbox: "Ouvrir la boîte de réception complète →",
      viewLiveWebsite: "Voir le Site Public",
      newInquiryToast: "Nouvelle Demande Reçue !",
    },
    overview: {
      tag: "Centre de Contrôle Institutionnel",
      title: "Tableau de Bord Verdalia",
      desc: "Gérez vos demandes B2B internationales, le catalogue de produits, les certifications, le SEO multilingue et les publications.",
      reviewInquiries: (count) => `Consulter les demandes (${count})`,
      unreadInquiries: "Demandes Non Lues",
      totalReceived: (count) => `Total reçues : ${count}`,
      activeProducts: "Produits Actifs",
      totalCatalog: (count) => `Catalogue total : ${count}`,
      certifications: "Certifications",
      certifiedBodies: (count) => `Organismes certifiés : ${count}`,
      publications: "Publications",
      publishedArticles: (count) => `Articles publiés : ${count}`,
      systemHealth: "Statut & Intégrité Système",
      allSystemsOnline: "Opérationnel",
      dbStatus: "Base de données",
      dbActive: "Connectée & Active",
      multilingualSeo: "Moteur Multilingue",
      activeLocalesCount: "5 Langues Internationales",
      securitySession: "Session de Sécurité",
      encryptedSession: "Sécurisée par JWT",
      recentInquiriesTitle: "Demandes B2B Récentes",
      noInquiriesYet: "Aucune demande reçue pour le moment.",
      quickShortcuts: "Raccourcis de Gestion Rapide",
      shortcutAddProduct: "Gérer les Produits",
      shortcutNewCert: "Ajouter Certification",
      shortcutNewArticle: "Créer un Article",
      shortcutEditHome: "Modifier Page d'Accueil",
    },
    messagesPage: {
      title: "Demandes Commerciales & Devis",
      subtitle: "Gérez les demandes de devis et les prises de contact des importateurs internationaux.",
      refresh: "Actualiser",
      emptyTrash: (count) => `Vider la corbeille (${count})`,
      tabAll: "Toutes les demandes",
      tabUnread: "Non lues",
      tabContacted: "Contactées",
      tabArchived: "Archivées",
      tabTrash: "Corbeille",
      searchPlaceholder: "Rechercher société, nom, email...",
      trashNoticeTitle: "Corbeille temporaire (7 jours) :",
      trashNoticeDesc: "Les demandes supprimées sont conservées ici pendant 7 jours avant purge automatique définitive. Vous pouvez les restaurer ou les détruire manuellement.",
      loading: "Chargement des messages...",
      emptyTrashText: "La corbeille est vide.",
      noMatches: "Aucune demande ne correspond à vos critères.",
      thCompany: "Société & Contact",
      thProduct: "Produit & Volume",
      thDestination: "Pays & Port",
      thAttachment: "Pièce Jointe",
      thStatus: "Statut",
      thAutoPurge: "Auto-purge (7j)",
      thDate: "Date de réception",
      thActions: "Actions",
      viewDetails: "Voir détails",
      moveToTrash: "Mettre à la corbeille",
      restore: "Restaurer",
      permanentDelete: "Supprimer définitivement",
      statusUnread: "Non lue",
      statusRead: "Lue",
      statusContacted: "Contactée",
      statusArchived: "Archivée",
      statusTrash: "Corbeille",
      modalCancel: "Annuler",
      modalConfirm: "Confirmer",
      modalProcessing: "Traitement...",
    },
    homepagePage: {
      title: "Gestion du Contenu de l'Accueil",
      subtitle: "Modifiez les titres du Hero, les récits et les boutons d'action dans toutes les langues.",
      heroSection: "Section Hero Bannière",
      heroDesc: "Bannière principale accueillant les visiteurs internationaux.",
      badge: "Badge / Slogan",
      headline: "Titre Principal",
      tagline: "Sous-titre explicatif",
      primaryCta: "Bouton Principal (Découvrir)",
      secondaryCta: "Bouton Secondaire (Demander Devis)",
      aboutSection: "Aperçu À Propos",
      aboutDesc: "Présentation institutionnelle sur la page d'accueil.",
      whyChooseSection: "Pourquoi Choisir Verdalia",
      whyChooseDesc: "Piliers d'excellence, traçabilité et normes de qualité.",
      exportSection: "Section Export & Logistique",
      exportDesc: "Capacités de fret mondial et ports desservis.",
      saveBtn: (lang) => `Enregistrer l'Accueil (${lang.toUpperCase()})`,
    },
    aboutPage: {
      title: "Éditeur de Contenu À Propos",
      subtitle: "Gérez l'histoire de l'entreprise, le moulin Amari et les engagements qualité.",
      saveSuccess: (lang) => `Contenu À Propos pour (${lang.toUpperCase()}) enregistré avec succès !`,
      heroSection: "Bannière & Introduction",
      heroDesc: "En-tête de la page À Propos.",
      heritageSection: "Héritage & Moulin Amari",
      heritageDesc: "Histoire familiale et racines régionales oléicoles.",
      pillarsSection: "Vision & Engagements",
      pillarsDesc: "Valeurs fondamentales et normes éthiques.",
      saveBtn: (lang) => `Enregistrer la page À Propos (${lang.toUpperCase()})`,
    },
    exportPage: {
      title: "Éditeur Logistique & Export",
      subtitle: "Personnalisez les capacités portuaires, le fret maritime et les incoterms.",
      saveSuccess: (lang) => `Contenu Export pour (${lang.toUpperCase()}) enregistré avec succès !`,
      shippingSection: "Logistique Internationale",
      shippingDesc: "Lignes maritimes, conteneurs et destinations mondiales.",
      logisticsSection: "Contrôle Qualité & Température",
      logisticsDesc: "Sécurité des flexitanks et normes de transport.",
      saveBtn: (lang) => `Enregistrer la page Export (${lang.toUpperCase()})`,
    },
    productsPage: {
      title: "Gestion du Catalogue Produits",
      subtitle: "Gérez les huiles d'olive vierges extra, les formats vrac et bouteilles, et les spécifications d'acidité.",
      addNew: "Ajouter un Produit",
      tableThProduct: "Produit & Qualité",
      tableThSpecs: "Acidité & Spécifications",
      tableThStatus: "Statut",
      tableThActions: "Actions",
      modalCreateTitle: "Ajouter un Nouveau Produit",
      modalEditTitle: "Modifier le Produit",
    },
    certificationsPage: {
      title: "Certifications & Normes Mondiales",
      subtitle: "Gérez les accréditations internationales (BRC, IFS, ISO, BIO, Halal, Kosher).",
      addNew: "Ajouter une Certification",
      tableThCert: "Certification",
      tableThIssuer: "Organisme Émetteur",
      tableThStatus: "Statut",
      tableThActions: "Actions",
    },
    publicationsPage: {
      title: "Actualités & Études de Marché",
      subtitle: "Publiez les rapports de récolte, analyses du marché de l'huile d'olive et annonces.",
      addNew: "Nouvel Article",
      tableThTitle: "Titre de l'Article",
      tableThStatus: "Statut",
      tableThActions: "Actions",
    },
    mediaPage: {
      title: "Médiathèque & Fichiers",
      subtitle: "Téléversez et gérez vos photos de bouteilles, installations et rapports de laboratoire.",
      uploadNew: "Téléverser un Fichier",
      tableThFile: "Fichier & Aperçu",
      tableThSize: "Taille",
      tableThDate: "Date d'ajout",
      tableThActions: "Actions",
      noMedia: "Aucun fichier média téléversé pour le moment.",
    },
    contactsPage: {
      title: "Contacts Institutionnels & Bureaux",
      subtitle: "Configurez le siège social, les adresses email commerciales et les représentations à l'étranger.",
      hqSection: "Siège Social & Usine",
      partnersSection: "Partenaires & Bureaux Internationaux",
      addPartner: "Ajouter un Partenaire",
    },
    seoPage: {
      title: "Configuration SEO & Balises Multilingues",
      subtitle: "Optimisez le référencement naturel, les titres Google et les métadonnées par pays.",
      metaTitle: "Balise Titre (Title)",
      metaDesc: "Description Meta",
      keywords: "Mots-clés cibles (séparés par virgules)",
      ogTitle: "Titre Réseaux Sociaux (OpenGraph)",
    },
    settingsPage: {
      title: "Sécurité & Paramètres Administrateur",
      subtitle: "Gérez les identifiants d'accès et la sécurité des sessions du CMS.",
      changePasswordTitle: "Changer le Mot de Passe Administrateur",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le nouveau mot de passe",
      updateBtn: "Mettre à jour les identifiants",
    },
  },
  ar: {
    common: {
      save: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      savedSuccess: "تم الحفظ بنجاح!",
      add: "إضافة جديد",
      delete: "حذف",
      edit: "تعديل",
      cancel: "إلغاء",
      confirm: "تأكيد",
      actions: "إجراءات",
      status: "الحالة",
      loading: "جاري التحميل...",
      active: "نشط",
      inactive: "معطل",
      published: "منشور",
      draft: "مسودة",
      upload: "رفع ملف",
      uploading: "جاري الرفع...",
    },
    sidebar: {
      overview: "نظرة عامة",
      messages: "الرسائل وعروض الأسعار",
      products: "كتالوج المنتجات",
      certifications: "الشهادات والاعتمادات",
      publications: "الأخبار والمقالات",
      homepage: "محتوى الصفحة الرئيسية",
      about: "محتوى من نحن",
      export: "محتوى التصدير",
      media: "الصور والوسائط",
      contacts: "الشركاء والاتصال",
      seo: "تحسين محركات البحث SEO",
      settings: "الأمان والإعدادات",
      signOut: "تسجيل الخروج",
      companyTag: "شركة فيرداليا",
    },
    header: {
      title: "لوحة تحكم فيرداليا التنفيذية",
      notifications: "الإشعارات",
      recentNotifications: "أحدث الإشعارات",
      unreadCount: (count) => `${count} غير مقروءة`,
      noRecent: "لا توجد إشعارات حديثة.",
      viewAll: "عرض الكل",
      openInbox: "فتح صندوق الرسائل بالكامل ←",
      viewLiveWebsite: "عرض الموقع المباشر",
      newInquiryToast: "تم استلام طلب جديد!",
    },
    overview: {
      tag: "مركز التحكم الإداري والمؤسسي",
      title: "لوحة تحكم شركة فيرداليا",
      desc: "إدارة طلبات B2B الدولية، كتالوج منتجات زيت الزيتون، الشهادات العالمية، وتخصيص محتوى الموقع بالكامل.",
      reviewInquiries: (count) => `مراجعة الطلبات (${count})`,
      unreadInquiries: "الطلبات غير المقروءة",
      totalReceived: (count) => `إجمالي المستلم: ${count}`,
      activeProducts: "المنتجات النشطة",
      totalCatalog: (count) => `إجمالي الكتالوج: ${count}`,
      certifications: "الشهادات المعتمدة",
      certifiedBodies: (count) => `هيئات الاعتماد: ${count}`,
      publications: "المقالات والمنشورات",
      publishedArticles: (count) => `مقالات منشورة: ${count}`,
      systemHealth: "حالة النظام والأداء",
      allSystemsOnline: "يعمل بكفاءة",
      dbStatus: "قاعدة البيانات",
      dbActive: "متصلة ونشطة",
      multilingualSeo: "المحرك متعدد اللغات",
      activeLocalesCount: "5 لغات عالمية مدعومة",
      securitySession: "جلسة الأمان",
      encryptedSession: "محمية بنظام JWT",
      recentInquiriesTitle: "أحدث طلبات عروض الأسعار B2B",
      noInquiriesYet: "لم يتم استلام أي طلبات بعد.",
      quickShortcuts: "روابط سريعة للإدارة",
      shortcutAddProduct: "إضافة / تعديل منتج",
      shortcutNewCert: "إضافة شهادة جديدة",
      shortcutNewArticle: "كتابة مقال جديد",
      shortcutEditHome: "تعديل الصفحة الرئيسية",
    },
    messagesPage: {
      title: "طلبات عروض الأسعار والرسائل التجارية",
      subtitle: "إدارة طلبات الاستيراد بالجملة والتواصل مع المستوردين والشركات الدولية.",
      refresh: "تحديث البيانات",
      emptyTrash: (count) => `إفراغ سلة المهملات (${count})`,
      tabAll: "جميع الطلبات",
      tabUnread: "غير مقروءة",
      tabContacted: "تم التواصل",
      tabArchived: "مؤرشفة",
      tabTrash: "سلة المهملات",
      searchPlaceholder: "بحث عن شركة، الاسم، البريد الإلكتروني...",
      trashNoticeTitle: "سلة المهملات المؤقتة (7 أيام):",
      trashNoticeDesc: "يتم الاحتفاظ بالطلبات المحذوفة هنا لمدة 7 أيام قبل الحذف النهائي التلقائي. يمكنك استعادتها أو حذفها نهائياً في أي وقت.",
      loading: "جاري تحميل الرسائل والطلبات...",
      emptyTrashText: "سلة المهملات فارغة.",
      noMatches: "لا توجد طلبات تطابق معايير البحث.",
      thCompany: "الشركة وجهة الاتصال",
      thProduct: "المنتج والكمية المطلوبة",
      thDestination: "الدولة وميناء الوصول",
      thAttachment: "المرفقات",
      thStatus: "الحالة",
      thAutoPurge: "الحذف التلقائي (7 أيام)",
      thDate: "تاريخ الاستلام",
      thActions: "إجراءات",
      viewDetails: "عرض التفاصيل",
      moveToTrash: "نقل إلى المهملات",
      restore: "استعادة",
      permanentDelete: "حذف نهائي",
      statusUnread: "غير مقروءة",
      statusRead: "تمت القراءة",
      statusContacted: "تم التواصل",
      statusArchived: "مؤرشفة",
      statusTrash: "محذوفة",
      modalCancel: "إلغاء",
      modalConfirm: "تأكيد",
      modalProcessing: "جاري المعالجة...",
    },
    homepagePage: {
      title: "إدارة محتوى الصفحة الرئيسية",
      subtitle: "تعديل نصوص اللافتة الرئيسية والفقرات التعريفية والأزرار بكافة اللغات.",
      heroSection: "القسم الترحيبي الرئيسي (Hero)",
      heroDesc: "الواجهة الأساسية التي يراها المستوردون الدوليون.",
      badge: "الشعار الترويجي / الوسم",
      headline: "العنوان الرئيسي",
      tagline: "الوصف التوضيحي الثانوي",
      primaryCta: "الزر الأساسي (اكتشف)",
      secondaryCta: "الزر الثانوي (طلب عرض سعر)",
      aboutSection: "نبذة عن الشركة",
      aboutDesc: "مقدمة تعريفية عن الشركة في الصفحة الرئيسية.",
      whyChooseSection: "لماذا تختار فيرداليا",
      whyChooseDesc: "مميزات الجودة، الشهادات، وسرعة الشحن الدولي.",
      exportSection: "قسم التصدير والخدمات اللوجستية",
      exportDesc: "معلومات الشحن وخطوط الملاحة الدولية.",
      saveBtn: (lang) => `حفظ محتوى الصفحة الرئيسية (${lang.toUpperCase()})`,
    },
    aboutPage: {
      title: "تعديل محتوى صفحة من نحن",
      subtitle: "تعديل تاريخ الشركة، معصرة العماري وتراث زيت الزيتون التونسي.",
      saveSuccess: (lang) => `تم حفظ محتوى صفحة من نحن بنجاح للغة (${lang.toUpperCase()})!`,
      heroSection: "المقدمة واللافتة",
      heroDesc: "العنوان الرئيسي والوسم التعريفي.",
      heritageSection: "تراث معصرة العماري",
      heritageDesc: "تاريخ العائلة وأصالة الزيت التونسي.",
      pillarsSection: "الرؤية والالتزامات الدولية",
      pillarsDesc: "الجودة العالية والممارسات المستدامة.",
      saveBtn: (lang) => `حفظ محتوى صفحة من نحن (${lang.toUpperCase()})`,
    },
    exportPage: {
      title: "تعديل محتوى التصدير واللوجستيك",
      subtitle: "تخصيص الموانئ الدولية، شحن الفليكسي تانك وشروط التسليم العالمية.",
      saveSuccess: (lang) => `تم حفظ محتوى التصدير للغة (${lang.toUpperCase()}) بنجاح!`,
      shippingSection: "العمليات اللوجستية العالمية",
      shippingDesc: "الوجهات العالمية، خطوط الشحن وسعة الحاويات.",
      logisticsSection: "ضمان الجودة ومراقبة الحرارة",
      logisticsDesc: "سلامة النقل السائب وحاويات الفليكسي تانك.",
      saveBtn: (lang) => `حفظ محتوى التصدير (${lang.toUpperCase()})`,
    },
    productsPage: {
      title: "إدارة كتالوج المنتجات",
      subtitle: "إدارة زيوت الزيتون البكر الممتازة، الشحن السائب، ومواصفات الحموضة والشهادات.",
      addNew: "إضافة منتج جديد",
      tableThProduct: "المنتج والجودة",
      tableThSpecs: "نسبة الحموضة والمواصفات",
      tableThStatus: "الحالة",
      tableThActions: "إجراءات",
      modalCreateTitle: "إضافة صنف جديد من زيت الزيتون",
      modalEditTitle: "تعديل بيانات المنتج",
    },
    certificationsPage: {
      title: "الشهادات والاعتمادات الدولية",
      subtitle: "إدارة شهادات الجودة العالمية (BRC, IFS, ISO 22000, BIO العضوي, حلال, كوشير).",
      addNew: "إضافة شهادة جديدة",
      tableThCert: "الشهادة والرمز",
      tableThIssuer: "جهة الاعتماد الدولية",
      tableThStatus: "الحالة",
      tableThActions: "إجراءات",
    },
    publicationsPage: {
      title: "المقالات والتقارير وأخبار السوق",
      subtitle: "نشر تقارير موسم الحصاد، تحليلات أسواق زيت الزيتون، والأخبار المؤسسية.",
      addNew: "مقال جديد",
      tableThTitle: "عنوان المقال",
      tableThStatus: "الحالة",
      tableThActions: "إجراءات",
    },
    mediaPage: {
      title: "مكتبة الوسائط والصور",
      subtitle: "رفع وإدارة صور المنتجات، صور المنشأة والمعاصر، وتقارير الفحص المخبري.",
      uploadNew: "رفع ملف جديد",
      tableThFile: "الملف والمعاينة",
      tableThSize: "الحجم",
      tableThDate: "تاريخ الرفع",
      tableThActions: "إجراءات",
      noMedia: "لم يتم رفع أي وسائط بعد.",
    },
    contactsPage: {
      title: "الشركاء التجاريون وجهات الاتصال",
      subtitle: "تهيئة بيانات المقر الرئيسي، البريد المؤسسي، والمكاتب التمثيلية الدولية.",
      hqSection: "المقر الرئيسي والمصنع",
      partnersSection: "الشركاء والمكاتب الدولية",
      addPartner: "إضافة شريك جديد",
    },
    seoPage: {
      title: "إعدادات تحسين محركات البحث SEO",
      subtitle: "تحسين ظهور الموقع على محركات البحث Google والكلمات المفتاحية الدولية.",
      metaTitle: "عنوان الصفحة (Meta Title)",
      metaDesc: "الوصف التعريفي (Meta Description)",
      keywords: "الكلمات المفتاحية (مفصولة بفواصل)",
      ogTitle: "عنوان مشاركة منصات التواصل (OG)",
    },
    settingsPage: {
      title: "الأمان وإعدادات المسؤول",
      subtitle: "إدارة بيانات حساب المدير وبروتوكولات أمان الجلسة.",
      changePasswordTitle: "تغيير كلمة مرور المدير",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      updateBtn: "تحديث البيانات والأمان",
    },
  },
  es: {
    common: {
      save: "Guardar Cambios",
      saving: "Guardando...",
      savedSuccess: "¡Guardado con éxito!",
      add: "Añadir Nuevo",
      delete: "Eliminar",
      edit: "Editar",
      cancel: "Cancelar",
      confirm: "Confirmar",
      actions: "Acciones",
      status: "Estado",
      loading: "Cargando...",
      active: "Activo",
      inactive: "Inactivo",
      published: "Publicado",
      draft: "Borrador",
      upload: "Subir",
      uploading: "Subiendo...",
    },
    sidebar: {
      overview: "Visión General",
      messages: "Mensajes y Cotizaciones",
      products: "Catálogo de Productos",
      certifications: "Certificaciones",
      publications: "Noticias y Artículos",
      homepage: "Contenido de Inicio",
      about: "Contenido Nosotros",
      export: "Contenido Exportación",
      media: "Medios e Imágenes",
      contacts: "Contactos y Socios",
      seo: "SEO y Metadatos",
      settings: "Seguridad y Ajustes",
      signOut: "Cerrar Sesión",
      companyTag: "Compañía VC",
    },
    header: {
      title: "Verdalia Executive CMS",
      notifications: "Notifications",
      recentNotifications: "Notificaciones Recientes",
      unreadCount: (count) => `${count} no leída(s)`,
      noRecent: "No hay notificaciones recientes.",
      viewAll: "Ver todo",
      openInbox: "Abrir bandeja de entrada completa →",
      viewLiveWebsite: "Ver Sitio en Vivo",
      newInquiryToast: "¡Nueva Consulta Recibida!",
    },
    overview: {
      tag: "Centro de Control Institucional",
      title: "Panel de Control Verdalia",
      desc: "Gestione consultas B2B internacionales, catálogo de productos, certificaciones y SEO multilingüe.",
      reviewInquiries: (count) => `Revisar Consultas (${count})`,
      unreadInquiries: "Consultas No Leídas",
      totalReceived: (count) => `Total recibidas: ${count}`,
      activeProducts: "Productos Activos",
      totalCatalog: (count) => `Catálogo total: ${count}`,
      certifications: "Certificaciones",
      certifiedBodies: (count) => `Organismos certificados: ${count}`,
      publications: "Publicaciones",
      publishedArticles: (count) => `Artículos publicados: ${count}`,
      systemHealth: "Estado del Sistema",
      allSystemsOnline: "Operativo",
      dbStatus: "Base de Datos",
      dbActive: "Conectada y Activa",
      multilingualSeo: "Motor Multilingüe",
      activeLocalesCount: "5 Idiomas Internacionales",
      securitySession: "Sesión de Seguridad",
      encryptedSession: "Protegida por JWT",
      recentInquiriesTitle: "Consultas B2B Recientes",
      noInquiriesYet: "No hay consultas aún.",
      quickShortcuts: "Accesos Rápidos de Gestión",
      shortcutAddProduct: "Gestionar Productos",
      shortcutNewCert: "Añadir Certificación",
      shortcutNewArticle: "Crear Artículo",
      shortcutEditHome: "Editar Página de Inicio",
    },
    messagesPage: {
      title: "Consultas Comerciales y Cotizaciones",
      subtitle: "Gestione solicitudes de cotización al por mayor y contactos de importadores internacionales.",
      refresh: "Actualizar",
      emptyTrash: (count) => `Vaciar Papelera (${count})`,
      tabAll: "Todas las Consultas",
      tabUnread: "No leídas",
      tabContacted: "Contactadas",
      tabArchived: "Archivadas",
      tabTrash: "Papelera",
      searchPlaceholder: "Buscar empresa, contacto, email...",
      trashNoticeTitle: "Papelera temporal (7 días):",
      trashNoticeDesc: "Las consultas eliminadas se conservan aquí durante 7 días antes de eliminarse permanentemente.",
      loading: "Cargando consultas...",
      emptyTrashText: "La papelera está vacía.",
      noMatches: "No hay consultas que coincidan con sus criterios.",
      thCompany: "Empresa y Contacto",
      thProduct: "Producto y Volumen",
      thDestination: "País y Puerto",
      thAttachment: "Adjunto",
      thStatus: "Estado",
      thAutoPurge: "Auto-purga (7d)",
      thDate: "Fecha",
      thActions: "Acciones",
      viewDetails: "Ver detalles",
      moveToTrash: "Mover a papelera",
      restore: "Restaurar",
      permanentDelete: "Eliminar definitivamente",
      statusUnread: "No leída",
      statusRead: "Leída",
      statusContacted: "Contactada",
      statusArchived: "Archivada",
      statusTrash: "Papelera",
      modalCancel: "Cancelar",
      modalConfirm: "Confirmar",
      modalProcessing: "Procesando...",
    },
    homepagePage: {
      title: "Gestión de Contenido de Inicio",
      subtitle: "Edite los títulos de la cabecera, textos descriptivos y botones en todos los idiomas.",
      heroSection: "Sección Principal (Hero)",
      heroDesc: "Bannere principal para visitantes internacionales.",
      badge: "Lema / Distintivo",
      headline: "Titular Principal",
      tagline: "Subtítulo Narrativo",
      primaryCta: "Botón Principal (Descubrir)",
      secondaryCta: "Botón Secundario (Solicitar Cotización)",
      aboutSection: "Resumen de Nosotros",
      aboutDesc: "Presentación institucional en la página de inicio.",
      whyChooseSection: "¿Por qué elegir Verdalia?",
      whyChooseDesc: "Pilares de calidad, trazabilidad y normas internacionales.",
      exportSection: "Sección Exportación y Logística",
      exportDesc: "Capacidades de envío a granel y puertos.",
      saveBtn: (lang) => `Guardar Contenido de Inicio (${lang.toUpperCase()})`,
    },
    aboutPage: {
      title: "Editor de Contenido Nosotros",
      subtitle: "Edite la historia de la empresa, el molino Amari y los compromisos de calidad.",
      saveSuccess: (lang) => `¡Contenido Nosotros para (${lang.toUpperCase()}) guardado con éxito!`,
      heroSection: "Cabecera e Introducción",
      heroDesc: "Banner principal de la página.",
      heritageSection: "Herencia y Molino Amari",
      heritageDesc: "Historia familiar y raíces olivareras.",
      pillarsSection: "Visión y Compromisos",
      pillarsDesc: "Valores éticos y excelencia.",
      saveBtn: (lang) => `Guardar Página Nosotros (${lang.toUpperCase()})`,
    },
    exportPage: {
      title: "Editor de Logística y Exportación",
      subtitle: "Personalice puertos internacionales, envíos a granel e incoterms.",
      saveSuccess: (lang) => `¡Contenido Exportación para (${lang.toUpperCase()}) guardado con éxito!`,
      shippingSection: "Logística Global",
      shippingDesc: "Líneas marítimas, contenedores y destinos.",
      logisticsSection: "Control de Calidad y Temperatura",
      logisticsDesc: "Seguridad de flexitanks y normas de transporte.",
      saveBtn: (lang) => `Guardar Contenido Exportación (${lang.toUpperCase()})`,
    },
    productsPage: {
      title: "Gestión del Catálogo de Productos",
      subtitle: "Gestione aceites de oliva virgen extra, formatos a granel y especificaciones.",
      addNew: "Añadir Nuevo Producto",
      tableThProduct: "Producto y Calidad",
      tableThSpecs: "Acidez y Especificaciones",
      tableThStatus: "Estado",
      tableThActions: "Acciones",
      modalCreateTitle: "Añadir Nueva Calidad de Aceite",
      modalEditTitle: "Editar Producto",
    },
    certificationsPage: {
      title: "Certificaciones y Acreditaciones",
      subtitle: "Gestione sellos internacionales de calidad (BRC, IFS, ISO, BIO, Halal, Kosher).",
      addNew: "Añadir Certificación",
      tableThCert: "Certificación",
      tableThIssuer: "Organismo Acreditador",
      tableThStatus: "Estado",
      tableThActions: "Acciones",
    },
    publicationsPage: {
      title: "Noticias y Análisis de Mercado",
      subtitle: "Publique informes de cosecha, análisis de precios y anuncios institucionales.",
      addNew: "Nuevo Artículo",
      tableThTitle: "Título del Artículo",
      tableThStatus: "Estado",
      tableThActions: "Acciones",
    },
    mediaPage: {
      title: "Biblioteca de Medios y Fotos",
      subtitle: "Suba y organice fotografías de productos, almazaras e informes.",
      uploadNew: "Subir Archivo",
      tableThFile: "Archivo y Vista Previa",
      tableThSize: "Tamaño",
      tableThDate: "Fecha",
      tableThActions: "Acciones",
      noMedia: "No hay archivos subidos aún.",
    },
    contactsPage: {
      title: "Contactos y Oficinas Internacionales",
      subtitle: "Configure sede corporativa, correos comerciales y socios internacionales.",
      hqSection: "Sede Corporativa y Almazara",
      partnersSection: "Socios e Importadores",
      addPartner: "Añadir Oficina Socia",
    },
    seoPage: {
      title: "Configuración SEO Multilingüe",
      subtitle: "Optimice posicionamiento en buscadores, etiquetas meta y palabras clave.",
      metaTitle: "Título Meta",
      metaDesc: "Descripción Meta",
      keywords: "Palabras Clave",
      ogTitle: "Título Social (OpenGraph)",
    },
    settingsPage: {
      title: "Seguridad y Ajustes del Administrador",
      subtitle: "Gestione credenciales de acceso y protocolos de seguridad de sesión.",
      changePasswordTitle: "Cambiar Contraseña de Administrador",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirmar Nueva Contraseña",
      updateBtn: "Actualizar Credenciales",
    },
  },
  it: {
    common: {
      save: "Salva Modifiche",
      saving: "Salvataggio...",
      savedSuccess: "Salvato con successo!",
      add: "Aggiungi Nuovo",
      delete: "Elimina",
      edit: "Modifica",
      cancel: "Annulla",
      confirm: "Conferma",
      actions: "Azioni",
      status: "Stato",
      loading: "Caricamento...",
      active: "Attivo",
      inactive: "Inattivo",
      published: "Pubblicato",
      draft: "Bozza",
      upload: "Carica",
      uploading: "Caricamento...",
    },
    sidebar: {
      overview: "Panoramica",
      messages: "Messaggi & Preventivi",
      products: "Catalogo Prodotti",
      certifications: "Certificazioni",
      publications: "Notizie & Articoli",
      homepage: "Contenuto Home",
      about: "Contenuto Chi Siamo",
      export: "Contenuto Export",
      media: "Media & Immagini",
      contacts: "Contatti & Partner",
      seo: "SEO & Metadati",
      settings: "Sicurezza & Impostazioni",
      signOut: "Disconnetti",
      companyTag: "Società VC",
    },
    header: {
      title: "Verdalia Executive CMS",
      notifications: "Notifiche",
      recentNotifications: "Notifiche Recenti",
      unreadCount: (count) => `${count} non letto/i`,
      noRecent: "Nessuna notifica recente.",
      viewAll: "Mostra tutto",
      openInbox: "Apri la casella completa →",
      viewLiveWebsite: "Visualizza Sito Live",
      newInquiryToast: "Nuova Richiesta Ricevuta!",
    },
    overview: {
      tag: "Centro di Controllo Istituzionale",
      title: "Dashboard Verdalia",
      desc: "Gestisci le richieste B2B internazionali, il catalogo prodotti, le certificazioni e il SEO multilingue.",
      reviewInquiries: (count) => `Esamina Richieste (${count})`,
      unreadInquiries: "Richieste Non Lette",
      totalReceived: (count) => `Totale ricevute: ${count}`,
      activeProducts: "Prodotti Attivi",
      totalCatalog: (count) => `Catalogo totale: ${count}`,
      certifications: "Certificazioni",
      certifiedBodies: (count) => `Enti certificati: ${count}`,
      publications: "Pubblicazioni",
      publishedArticles: (count) => `Articoli pubblicati: ${count}`,
      systemHealth: "Stato del Sistema",
      allSystemsOnline: "Operativo",
      dbStatus: "Database",
      dbActive: "Connesso e Attivo",
      multilingualSeo: "Motore Multilingue",
      activeLocalesCount: "5 Lingue Internazionali",
      securitySession: "Sessione di Sicurezza",
      encryptedSession: "Protetta da JWT",
      recentInquiriesTitle: "Ultime Richieste B2B",
      noInquiriesYet: "Nessuna richiesta ricevuta finora.",
      quickShortcuts: "Scorciatoie Rapide",
      shortcutAddProduct: "Gestisci Prodotti",
      shortcutNewCert: "Aggiungi Certificazione",
      shortcutNewArticle: "Crea Articolo",
      shortcutEditHome: "Modifica Pagina Home",
    },
    messagesPage: {
      title: "Richieste Commerciali e Preventivi",
      subtitle: "Gestisci le richieste di preventivo all'ingrosso e i contatti degli importatori internazionali.",
      refresh: "Aggiorna",
      emptyTrash: (count) => `Svuota Cestino (${count})`,
      tabAll: "Tutte le Richieste",
      tabUnread: "Non lette",
      tabContacted: "Contattate",
      tabArchived: "Archiviate",
      tabTrash: "Cestino",
      searchPlaceholder: "Cerca azienda, nome contatto, email...",
      trashNoticeTitle: "Cestino temporaneo (7 giorni):",
      trashNoticeDesc: "Le richieste eliminate vengono conservate qui per 7 giorni prima dell'eliminazione definitiva.",
      loading: "Caricamento richieste in corso...",
      emptyTrashText: "Il cestino è vuoto.",
      noMatches: "Nessuna richiesta corrisponde ai criteri.",
      thCompany: "Azienda & Contatto",
      thProduct: "Prodotto & Volume",
      thDestination: "Paese & Porto",
      thAttachment: "Allegato",
      thStatus: "Stato",
      thAutoPurge: "Auto-eliminazione (7g)",
      thDate: "Data",
      thActions: "Azioni",
      viewDetails: "Vedi dettagli",
      moveToTrash: "Sposta nel cestino",
      restore: "Ripristina",
      permanentDelete: "Elimina definitivamente",
      statusUnread: "Non letta",
      statusRead: "Letta",
      statusContacted: "Contattata",
      statusArchived: "Archiviata",
      statusTrash: "Cestino",
      modalCancel: "Annulla",
      modalConfirm: "Conferma",
      modalProcessing: "Elaborazione...",
    },
    homepagePage: {
      title: "Gestione Contenuti Pagina Home",
      subtitle: "Modifica i titoli dell'hero banner, i testi descrittivi e le CTA in tutte le lingue.",
      heroSection: "Sezione Hero Banner",
      heroDesc: "Banner principale che accoglie i visitatori internazionali.",
      badge: "Badge / Slogan",
      headline: "Titolo Principale",
      tagline: "Sottotitolo Narrativo",
      primaryCta: "Pulsante Primario (Scopri)",
      secondaryCta: "Pulsante Secondario (Richiedi Preventivo)",
      aboutSection: "Panoramica Chi Siamo",
      aboutDesc: "Presentazione aziendale nella pagina iniziale.",
      whyChooseSection: "Perché Scegliere Verdalia",
      whyChooseDesc: "Standard qualitativi, tracciabilità ed eccellenza.",
      exportSection: "Sezione Export & Logistica",
      exportDesc: "Capacità di spedizione e porti serviti.",
      saveBtn: (lang) => `Salva Contenuto Home (${lang.toUpperCase()})`,
    },
    aboutPage: {
      title: "Editor Contenuti Chi Siamo",
      subtitle: "Modifica la storia aziendale, il frantoio Amari e gli impegni per la qualità.",
      saveSuccess: (lang) => `Contenuto Chi Siamo per (${lang.toUpperCase()}) salvato con successo!`,
      heroSection: "Banner & Introduzione",
      heroDesc: "Intestazione principale della pagina.",
      heritageSection: "Eredità & Frantoio Amari",
      heritageDesc: "Storia di famiglia e radici olivicole.",
      pillarsSection: "Visione & Impegni",
      pillarsDesc: "Valori etici e standard produttivi.",
      saveBtn: (lang) => `Salva Pagina Chi Siamo (${lang.toUpperCase()})`,
    },
    exportPage: {
      title: "Editor Logistica & Export",
      subtitle: "Personalizza rotte marittime, spedizioni flexitank sfuse e incoterms.",
      saveSuccess: (lang) => `Contenuto Export per (${lang.toUpperCase()}) salvato con successo!`,
      shippingSection: "Logistica Internazionale",
      shippingDesc: "Linee di navigazione, container e destinazioni globali.",
      logisticsSection: "Controllo Qualità & Temperatura",
      logisticsDesc: "Sicurezza flexitank e normative di trasporto.",
      saveBtn: (lang) => `Salva Contenuto Export (${lang.toUpperCase()})`,
    },
    productsPage: {
      title: "Gestione Catalogo Prodotti",
      subtitle: "Gestisci oli extra vergini, formati sfusi o imbottigliati e specifiche di acidità.",
      addNew: "Aggiungi Nuovo Prodotto",
      tableThProduct: "Prodotto & Qualità",
      tableThSpecs: "Acidità & Specifiche",
      tableThStatus: "Stato",
      tableThActions: "Azioni",
      modalCreateTitle: "Aggiungi Nuovo Olio",
      modalEditTitle: "Modifica Prodotto",
    },
    certificationsPage: {
      title: "Certificazioni & Accreditamenti",
      subtitle: "Gestisci certificazioni internazionali (BRC, IFS, ISO 22000, BIO, Halal, Kosher).",
      addNew: "Aggiungi Certificazione",
      tableThCert: "Certificazione",
      tableThIssuer: "Ente di Certificazione",
      tableThStatus: "Stato",
      tableThActions: "Azioni",
    },
    publicationsPage: {
      title: "Notizie & Analisi di Mercato",
      subtitle: "Pubblica rapporti sul raccolto, analisi del mercato oleario e comunicati.",
      addNew: "Nuovo Articolo",
      tableThTitle: "Titolo Articolo",
      tableThStatus: "Stato",
      tableThActions: "Azioni",
    },
    mediaPage: {
      title: "Libreria Multimediale",
      subtitle: "Carica e organizza fotografie dei prodotti, del frantoio e certificati di analisi.",
      uploadNew: "Carica Nuovo File",
      tableThFile: "File & Anteprima",
      tableThSize: "Dimensione",
      tableThDate: "Data",
      tableThActions: "Azioni",
      noMedia: "Nessun file multimediale caricato.",
    },
    contactsPage: {
      title: "Contatti Istituzionali & Sedi",
      subtitle: "Configura la sede centrale, email commerciali e uffici di rappresentanza.",
      hqSection: "Sede Legale & Frantoio",
      partnersSection: "Partner Internazionali",
      addPartner: "Aggiungi Ufficio Partner",
    },
    seoPage: {
      title: "Configurazione SEO Multilingue",
      subtitle: "Ottimizza il posizionamento sui motori di ricerca, meta tag e parole chiave.",
      metaTitle: "Titolo Meta",
      metaDesc: "Descrizione Meta",
      keywords: "Parole Chiave",
      ogTitle: "Titolo Social (OpenGraph)",
    },
    settingsPage: {
      title: "Sicurezza & Impostazioni Amministratore",
      subtitle: "Gestisci le credenziali di accesso e i protocolli di sicurezza della sessione.",
      changePasswordTitle: "Modifica Password Amministratore",
      currentPassword: "Password Attuale",
      newPassword: "Nuova Password",
      confirmPassword: "Conferma Nuova Password",
      updateBtn: "Aggiorna Credenziali",
    },
  },
};

interface AdminI18nContextType {
  adminLocale: Locale;
  setAdminLocale: (loc: Locale) => void;
  adminDict: AdminDictionary;
}

const AdminI18nContext = createContext<AdminI18nContextType>({
  adminLocale: "en",
  setAdminLocale: () => {},
  adminDict: ADMIN_DICTIONARIES.en,
});

const ADMIN_LOCALE_STORAGE_KEY = "verdalia_admin_locale";

export const AdminI18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminLocale, setAdminLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY);
      if (saved && (LOCALES as string[]).includes(saved)) {
        setAdminLocaleState(saved as Locale);
      }
    } catch {
      // localStorage unavailable or restricted
    }
  }, []);

  const setAdminLocale = (loc: Locale) => {
    setAdminLocaleState(loc);
    try {
      localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, loc);
    } catch {
      // noop
    }
  };

  const adminDict = ADMIN_DICTIONARIES[adminLocale] || ADMIN_DICTIONARIES.en;

  return (
    <AdminI18nContext.Provider
      value={{
        adminLocale,
        setAdminLocale,
        adminDict,
      }}
    >
      {children}
    </AdminI18nContext.Provider>
  );
};

export const useAdminI18n = () => useContext(AdminI18nContext);
