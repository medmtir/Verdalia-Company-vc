"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n/context";
import dynamic from 'next/dynamic';
const QuoteModal = dynamic(() => import('@/components/ui/QuoteModal').then(m => m.QuoteModal), { ssr: false });
import {
  Globe,
  Ship,
  FileCheck2,
  Package,
  Layers,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Container,
  Headphones,
} from "lucide-react";

export default function ExportPage() {
  const { dict, locale, dir } = useI18n();
  const ep = dict.exportPage;
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const steps = [
    {
      num: "01",
      title: locale === "fr" ? "Demande Initiale du Client" : locale === "ar" ? "استلام طلب العميل" : locale === "es" ? "Consulta Inicial del Cliente" : locale === "it" ? "Richiesta Iniziale del Cliente" : "Customer Inquiry",
      desc:
        locale === "fr"
          ? "Prise de contact, présentation de votre marché cible et de vos besoins volumétriques."
          : locale === "ar"
          ? "التواصل الأولي وتحديد السوق المستهدف والكميات التقديرية المطلوبة."
          : locale === "es"
          ? "Contacto inicial, presentación del mercado objetivo y volúmenes requeridos."
          : locale === "it"
          ? "Contatto iniziale, definizione del mercato di riferimento e dei volumi necessari."
          : "Initial consultation discussing target market requirements, oil grades, and target shipment windows.",
    },
    {
      num: "02",
      title: locale === "fr" ? "Définition des Exigences Produit" : locale === "ar" ? "تحديد المواصفات الفنية" : locale === "es" ? "Definición de Requisitos del Producto" : locale === "it" ? "Definizione dei Requisiti di Prodotto" : "Product Requirements Definition",
      desc:
        locale === "fr"
          ? "Sélection du grade (extra vierge, bio, raffiné), acidité maximale et type de conditionnement."
          : locale === "ar"
          ? "اختيار صنف الزيت، معايير الحموضة، ونوع العبوات المطلوبة (سائب أو معبأ)."
          : locale === "es"
          ? "Selección del grado (virgen extra, bio, refinado), acidez y formato a granel."
          : locale === "it"
          ? "Selezione del grado (extra vergine, bio, raffinato), acidità e tipo di imballaggio."
          : "We align on acidity, taste profile and bulk format (flexitank, IBC or drums).",
    },
    {
      num: "03",
      title: locale === "fr" ? "Proposition Commerciale & Technique" : locale === "ar" ? "تقديم العرض التجاري" : locale === "es" ? "Oferta Comercial y Técnica" : locale === "it" ? "Offerta Commerciale e Tecnica" : "Commercial & Technical Offer",
      desc:
        locale === "fr"
          ? "Transmission du devis pro forma, des conditions Incoterms (FOB, CIF, CFR) et des fiches d'analyse."
          : locale === "ar"
          ? "تقديم عرض الأسعار المفصل، شروط الشحن الدولية (FOB, CIF)، ونتائج التحاليل."
          : locale === "es"
          ? "Envío de factura proforma, Incoterms (FOB, CIF) y certificados analíticos."
          : locale === "it"
          ? "Invio del preventivo proforma, termini Incoterms (FOB, CIF) e certificati di laboratorio."
          : "Submission of formal proforma invoice, Incoterms (FOB Rades/Sousse, CIF global ports), and lab certificates.",
    },
    {
      num: "04",
      title: locale === "fr" ? "Confirmation du lot" : locale === "ar" ? "تأكيد العقد والدفعات" : locale === "es" ? "Confirmación del Lote" : locale === "it" ? "Conferma del Lotto" : "Lot confirmation",
      desc:
        locale === "fr"
          ? "Validation des échantillons et signature du contrat d'approvisionnement."
          : locale === "ar"
          ? "اعتماد العينات المسبقة وتوقيع عقد التوريد الرسمي."
          : locale === "es"
          ? "Validación de muestras pre-embarque y firma del contrato de suministro."
          : locale === "it"
          ? "Approvazione dei campioni pre-imbarco e firma del contratto di fornitura."
          : "Pre-shipment sample approval and sales contract signing.",
    },
    {
      num: "05",
      title: locale === "fr" ? "Documentation Export & Analyses" : locale === "ar" ? "الوثائق الجمركية والمخبرية" : locale === "es" ? "Documentación de Exportación" : locale === "it" ? "Documentazione di Export e Analisi" : "Export Documentation & Lab Analysis",
      desc:
        locale === "fr"
          ? "Établissement du certificat d'origine, certificat phytosanitaire, analyses COI accréditées et EUR.1."
          : locale === "ar"
          ? "إصدار شهادات المنشأ، الشهادة الصحية النباتية، والتحاليل المخبرية المعتمدة."
          : locale === "es"
          ? "Emisión de certificado de origen, certificado fitosanitario, EUR.1 y análisis del COI."
          : locale === "it"
          ? "Rilascio del certificato di origine, certificato fitosanitario, EUR.1 e test COI accreditati."
          : "Issuance of EUR.1 movement certificate, Certificate of Origin, Phytosanitary health clearance, and IOC lab tests.",
    },
    {
      num: "06",
      title: locale === "fr" ? "Coordination Logistique & Chargement" : locale === "ar" ? "التنسيق اللوجستي والشحن" : locale === "es" ? "Coordinación Logística y Carga" : locale === "it" ? "Coordinamento Logistico e Imbarco" : "Shipment Coordination & Loading",
      desc:
        locale === "fr"
          ? "Mise en conteneur sécurisée (Flexitanks ou palettes cerclées), scellés douaniers et chargement à bord."
          : locale === "ar"
          ? "تعبئة الحاويات في ظروف صحية محكمة، تركيب الأختام الجمركية والشحن على متن السفن."
          : locale === "es"
          ? "Carga segura en contenedores (Flexitanks o pallets), precintos aduaneros y embarque."
          : locale === "it"
          ? "Caricamento sicuro in container (Flexitank o pallet), sigilli doganali e imbarco su nave."
          : "Container stuffing under hygienic supervision, installation of thermal liners/flexitanks, customs sealing and vessel boarding.",
    },
    {
      num: "07",
      title: locale === "fr" ? "Livraison Internationale & Suivi" : locale === "ar" ? "التسليم الدولي والمتابعة" : locale === "es" ? "Entrega Internacional y Seguimiento" : locale === "it" ? "Consegna Internazionale e Assistenza" : "International Delivery & Support",
      desc:
        locale === "fr"
          ? "Transmission des connaissements maritimes (Bill of Lading), dédouanement à destination et suivi de satisfaction."
          : locale === "ar"
          ? "إرسال وثائق الشحن البحرية، متابعة وصول البضائع، وتقديم الدعم الفني والتجاري المستمر."
          : locale === "es"
          ? "Envío de conocimientos de embarque (B/L), soporte aduanero y seguimiento de satisfacción."
          : locale === "it"
          ? "Spedizione delle polizze di carico (B/L), supporto doganale e monitoraggio della soddisfazione."
          : "Original Bill of Lading dispatch, real-time cargo tracking, customs clearance support, and post-delivery follow-up.",
    },
  ];

  const packagings = [
    {
      title: "Flexitank",
      capacity: "21 000 – 24 000 L / 20ft FCL",
      image: "/images/facility/port-containers.jpg",
      badge: "Vrac Industriel",
      desc:
        locale === "fr"
          ? "Citernes souples alimentaires à usage unique certifiées COA, idéales pour les raffineries et embouteilleurs industriels mondiaux."
          : locale === "ar"
          ? "خزانات فليكسي تانك صحية أحادية الاستخدام، مثالية للكميات الصناعية الكبرى والمستوردين بالصهاريج."
          : locale === "es"
          ? "Cisternas flexibles alimentarias de un solo uso, óptimas para volúmenes industriales a granel."
          : locale === "it"
          ? "Cisterne flessibili per uso alimentare a perdere, ideali per volumi industriali sfusi."
          : "Food-grade single-use bladder tanks ideal for high-volume industrial importers and refiners.",
      icon: Ship,
    },
    {
      title: locale === "fr" ? "Conteneur IBC" : locale === "ar" ? "حاوية IBC سعة 1000 لتر" : locale === "es" ? "Contenedor IBC" : locale === "it" ? "Cisterna IBC" : "IBC Tote Tank",
      capacity: "1 000 L (800 - 1 000 kg)",
      image: "/images/packaging/ibc-container.jpg",
      badge: "Semi-Vrac / Distribution",
      desc:
        locale === "fr"
          ? "Cuves IBC alimentaires haute densité avec armature de protection en acier galvanisé, vanne scellée et palette intégrée."
          : locale === "ar"
          ? "حاويات IBC مع قفص فولاذي واقٍ، وصمام محكم الغلق ملائمة للكميات المتوسطة وللموزعين الإقليميين."
          : locale === "es"
          ? "Contenedores IBC de grado alimentario con jaula de acero. Prácticos para volúmenes intermedios."
          : locale === "it"
          ? "Cisterne IBC alimentari con gabbia in acciaio. Pratiche per volumi intermedi e distributori."
          : "Rigid intermediate bulk containers with protective steel cage, sealed discharge valve, and pallet base.",
      icon: Package,
    },
    {
      title: locale === "fr" ? "Fûts Acier Scellés" : locale === "ar" ? "براميل فولاذية" : locale === "es" ? "Bidones de acero" : locale === "it" ? "Fusti in acciaio" : "Steel Drums",
      capacity: "208 L (approx. 190 kg)",
      image: "/images/packaging/steel-drum.jpg",
      badge: "Standard Maritime",
      desc:
        locale === "fr"
          ? "Fûts métalliques avec vernis intérieur alimentaire certifié, étanches sous atmosphère contrôlée, palettisables par 4."
          : locale === "ar"
          ? "براميل فولاذية صحية محكمة الغلق وقابلة للتكديس، ممتازة للنقل البحري والبري."
          : locale === "es"
          ? "Bidones alimentarios sellados y apilables, adaptados para transporte marítimo y terrestre."
          : locale === "it"
          ? "Fusti alimentari sigillati e impilabili, adatti per trasporto marittimo e stradale."
          : "Hermetically sealed food-grade lacquered steel drums suited for flexible palletized maritime cargo.",
      icon: Layers,
    },
    {
      title: locale === "fr" ? "Seaux & Bidons Alimentaires" : locale === "ar" ? "سلات وبيدونات غذائية" : locale === "es" ? "Cubos y Bidones" : locale === "it" ? "Secchielli e Taniche" : "Pails & Jerrycans",
      capacity: "10 L – 25 L",
      image: "/images/packaging/pails-buckets.jpg",
      badge: "Restauration / CHR",
      desc:
        locale === "fr"
          ? "Emballages rigides en PEHD alimentaire avec poignées ergonomiques et bouchons inviolables, parfaits pour la restauration."
          : locale === "ar"
          ? "أوعية وسلات غذائية قوية بمقابض مريحة وأغطية آمنة، ملائمة لقطاع الفنادق والمطاعم."
          : locale === "es"
          ? "Envases plásticos alimentarios reforzados con asas ergonómicas para hostelería y gastronomía."
          : locale === "it"
          ? "Secchielli alimentari rinforzati per ristorazione professionale e catering."
          : "Durable food-grade HDPE pails and jugs with tamper-evident caps, designed for HORECA and foodservice.",
      icon: Package,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-verdalia-offwhite text-verdalia-dark" dir={dir}>
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Banner */}
        <section className="relative py-20 bg-[#203A1A] text-white overflow-hidden mb-16">
          <div className="absolute inset-0 z-0 opacity-30">
            <Image
              src="/images/facility/port-containers.jpg"
              alt="Terminal maritime et logistique export Verdalia"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {ep.bannerBadge}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 leading-tight">
              {ep.bannerTitle} <br className="hidden sm:inline" />
              <span className="italic font-normal text-verdalia-gold">
                {ep.bannerTitleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mt-4 leading-relaxed font-light">
              {ep.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* Commercial Services Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
              {ep.servicesBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
              {ep.servicesTitle}
            </h2>
            <p className="text-sm text-verdalia-gray mt-2">
              {ep.servicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-verdalia-border shadow-card">
              <Globe className="w-8 h-8 text-verdalia-olive mb-4" />
              <h3 className="font-serif text-base font-bold mb-2">
                {ep.s1Title}
              </h3>
              <p className="text-xs text-verdalia-gray leading-relaxed">
                {ep.s1Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-verdalia-border shadow-card">
              <FileCheck2 className="w-8 h-8 text-verdalia-olive mb-4" />
              <h3 className="font-serif text-base font-bold mb-2">
                {ep.s2Title}
              </h3>
              <p className="text-xs text-verdalia-gray leading-relaxed">
                {ep.s2Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-verdalia-border shadow-card">
              <Package className="w-8 h-8 text-verdalia-olive mb-4" />
              <h3 className="font-serif text-base font-bold mb-2">
                {ep.s3Title}
              </h3>
              <p className="text-xs text-verdalia-gray leading-relaxed">
                {ep.s3Desc}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-verdalia-border shadow-card">
              <Headphones className="w-8 h-8 text-verdalia-olive mb-4" />
              <h3 className="font-serif text-base font-bold mb-2">
                {ep.s4Title}
              </h3>
              <p className="text-xs text-verdalia-gray leading-relaxed">
                {ep.s4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* 7-Step Export Process Timeline - Animated */}
        <section className="bg-verdalia-beige/60 py-24 border-y border-verdalia-border mb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
                {ep.stepsBadge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
                {ep.stepsTitle}
              </h2>
              <p className="text-sm text-verdalia-gray mt-2">
                {ep.stepsSubtitle}
              </p>
            </div>

            <style>{`
              @keyframes stepReveal {
                from { opacity: 0; transform: translateY(28px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              .step-card { opacity: 0; animation: stepReveal 0.55s ease forwards; }
              .step-card:nth-child(1)  { animation-delay: 0.05s; }
              .step-card:nth-child(2)  { animation-delay: 0.18s; }
              .step-card:nth-child(3)  { animation-delay: 0.31s; }
              .step-card:nth-child(4)  { animation-delay: 0.44s; }
              .step-card:nth-child(5)  { animation-delay: 0.57s; }
              .step-card:nth-child(6)  { animation-delay: 0.70s; }
              .step-card:nth-child(7)  { animation-delay: 0.83s; }
              @keyframes connectorGrow {
                from { transform: scaleX(0); opacity: 0; }
                to   { transform: scaleX(1); opacity: 1; }
              }
              .step-arrow { transform-origin: left; opacity: 0; animation: connectorGrow 0.3s ease forwards; }
              .step-arrow-1 { animation-delay: 0.25s; }
              .step-arrow-2 { animation-delay: 0.38s; }
              .step-arrow-3 { animation-delay: 0.51s; }
              .step-arrow-4 { animation-delay: 0.64s; }
              .step-arrow-5 { animation-delay: 0.77s; }
              .step-arrow-6 { animation-delay: 0.90s; }
            `}</style>

            {/* Desktop: horizontal flow with arrows */}
            <div className="hidden md:flex items-start gap-0">
              {steps.map((s, index) => (
                <React.Fragment key={s.num}>
                  <div className="group step-card flex-1 min-h-[280px] bg-white rounded-xl border border-verdalia-border shadow-card p-5 flex flex-col hover:shadow-luxury hover:scale-[1.05] transition-all duration-300 cursor-default">
                    <div className="w-9 h-9 rounded-full bg-verdalia-olive text-white flex items-center justify-center text-xs font-bold mb-4 shadow group-hover:scale-110 transition-transform">
                      {s.num}
                    </div>
                    <h4 className="font-serif text-[11px] font-bold text-verdalia-dark uppercase tracking-wider mb-2 leading-tight">
                      {s.title}
                    </h4>
                    <p className="text-[10px] text-verdalia-gray leading-relaxed flex-1">
                      {s.desc}
                    </p>
                    <div className="mt-4 h-0.5 rounded bg-gradient-to-r from-verdalia-olive to-verdalia-gold" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`step-arrow step-arrow-${index + 1} flex items-center pt-10 flex-shrink-0 px-0.5`}>
                      <div className="w-4 h-[2px] bg-verdalia-olive/40" />
                      <ArrowRight className="w-3 h-3 text-verdalia-olive/60 -ml-0.5 flex-shrink-0" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile: vertical timeline */}
            <div className="md:hidden relative space-y-4 border-l-2 border-verdalia-olive/30 pl-6">
              {steps.map((s) => (
                <div key={s.num} className="step-card relative bg-white rounded-xl border border-verdalia-border shadow-card p-5">
                  <div className="absolute -left-[calc(1.5rem+5px)] top-5 w-[10px] h-[10px] rounded-full bg-verdalia-olive border-2 border-verdalia-beige" />
                  <div className="w-8 h-8 rounded-full bg-verdalia-olive text-white flex items-center justify-center text-xs font-bold mb-3 shadow">
                    {s.num}
                  </div>
                  <h4 className="font-serif text-xs font-bold text-verdalia-dark uppercase tracking-wider mb-2">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-verdalia-gray leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Formats vrac & Conditionnements Industriels */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-verdalia-olive">
              {ep.packagingBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-verdalia-dark mt-2">
              {ep.packagingTitle}
            </h2>
            <p className="text-sm text-verdalia-gray mt-2">
              {ep.packagingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packagings.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.title}
                  className="group bg-white rounded-xl border border-verdalia-border shadow-card hover:shadow-luxury transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Preview */}
                    <div className="relative aspect-[4/3] bg-verdalia-beige/40 overflow-hidden border-b border-verdalia-border">
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-verdalia-dark/90 backdrop-blur-sm text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                        {pkg.badge}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded bg-verdalia-beige flex items-center justify-center text-verdalia-olive flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif text-base font-bold text-verdalia-dark leading-tight">
                          {pkg.title}
                        </h3>
                      </div>
                      
                      <div className="inline-block bg-verdalia-olive/10 text-verdalia-olive text-[11px] font-bold px-2 py-0.5 rounded mb-3">
                        {pkg.capacity}
                      </div>

                      <p className="text-xs text-verdalia-gray leading-relaxed">
                        {pkg.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="w-full py-2 px-3 text-xs font-semibold rounded bg-verdalia-beige/60 hover:bg-verdalia-olive hover:text-white transition-colors text-verdalia-dark border border-verdalia-border text-center"
                    >
                      {locale === "fr" ? "Demander cotation" : locale === "ar" ? "طلب تسعيرة" : "Request Quote"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Range Showcase Banner */}
          <div className="mt-10 bg-white rounded-xl border border-verdalia-border shadow-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-full md:w-1/3 aspect-[16/10] rounded-lg overflow-hidden bg-verdalia-beige/30 flex-shrink-0 border border-verdalia-border">
              <Image
                src="/images/packaging/full-packaging-range.jpg"
                alt="Gamme complète emballages Verdalia"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-verdalia-olive">
                {locale === "fr" ? "Flexibilité & Sécurité Alimentaire" : locale === "ar" ? "مرونة وأمان غذائي" : "Flexibility & Food Safety"}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-verdalia-dark mt-1 mb-2">
                {locale === "fr" ? "Du vrac industriel aux emballages de précision" : locale === "ar" ? "من الصهاريج الكبرى إلى العبوات الدقيقة" : "From Industrial Bulk to Precision Packaging"}
              </h3>
              <p className="text-xs text-verdalia-gray leading-relaxed mb-4">
                {locale === "fr"
                  ? "Tous nos contenants sont neufs, certifiés contact alimentaire avec traçabilité complète de lot et scellés inviolables pour garantir l'intégrité organoleptique de l'huile durant le transit."
                  : locale === "ar"
                  ? "جميع العبوات والحاويات جديدة تماماً ومعتمدة للأغذية مع تتبع كامل للدفعة وأختام غير قابلة للتلاعب لضمان سلامة وجودة الزيت."
                  : "All containers are certified brand new, food-grade with batch traceability and tamper-evident seals to safeguard oil organoleptic integrity throughout global transit."}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-verdalia-olive">
                <span className="flex items-center gap-1.5">✓ Certifié ISO 22000 & IFS</span>
                <span className="flex items-center gap-1.5">✓ Fiches techniques COA fournies</span>
                <span className="flex items-center gap-1.5">✓ Palettisation conforme normes maritimes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-verdalia-olive to-verdalia-dark text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              {ep.ctaTitle}
            </h2>
            <p className="text-sm text-verdalia-light/90 mb-8 font-light leading-relaxed">
              {ep.ctaSubtitle}
            </p>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="btn-gold px-8 py-4 text-xs font-bold tracking-widest uppercase"
            >
              {ep.ctaBtn}
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </div>
  );
}
