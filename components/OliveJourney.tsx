"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import {
  TreePine,
  Wheat,
  Droplets,
  ShieldCheck,
  Container,
  Ship,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface JourneyStage {
  id: string;
  number: number;
  desktopSrc: string;
  mobileSrc: string;
  icon: any;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  subtitle: {
    en: string;
    fr: string;
    ar: string;
  };
  desc: {
    en: string;
    fr: string;
    ar: string;
  };
  highlights: {
    en: string[];
    fr: string[];
    ar: string[];
  };
}

const STAGES: JourneyStage[] = [
  {
    id: "groves",
    number: 1,
    desktopSrc: "/images/journey/stage-1.webp",
    mobileSrc: "/images/journey/stage-1-mobile.webp",
    icon: TreePine,
    title: {
      en: "Tunisian Groves",
      fr: "Oliveraies de Tunisie",
      ar: "المزارع التونسية",
    },
    subtitle: {
      en: "Mediterranean terroir & ancient soil",
      fr: "Terroir méditerranéen & sols préservés",
      ar: "تربة متوسطية خصبة ومزارع عريقة",
    },
    desc: {
      en: "Centuries of olive-growing tradition across central and northern Tunisia, yielding certified 100% single-origin Tunisian olive oil.",
      fr: "Des siècles de tradition oléicole à travers le centre et le nord de la Tunisie, garantissant une origine 100% tunisienne certifiée et traçable.",
      ar: "تقاليد فلاحية عريقة في ربوع تونس لإنتاج زيت زيتون تونسي معتمد ومضمون المصدر بنسبة 100%.",
    },
    highlights: {
      en: ["100% Tunisian Origin", "Chemlali & Chétoui cultivars", "Sustainable agriculture"],
      fr: ["Origine 100% Tunisie", "Variétés Chemlali & Chétoui", "Agriculture raisonnée"],
      ar: ["مصدر تونسي 100%", "أصناف شملالي وشتوي", "فلاحة مستدامة"],
    },
  },
  {
    id: "harvest",
    number: 2,
    desktopSrc: "/images/journey/stage-2.webp",
    mobileSrc: "/images/journey/stage-2-mobile.webp",
    icon: Wheat,
    title: {
      en: "Harvest & Mill Entry",
      fr: "Récolte & Entrée Moulin",
      ar: "الجني ودخول المعصرة",
    },
    subtitle: {
      en: "Fresh lot selection & sorting",
      fr: "Tri rigoureux des lots frais",
      ar: "فرز دقيق للمحصول الطازج",
    },
    desc: {
      en: "Olives are harvested at optimal maturity and delivered promptly to our certified milling units to preserve aromatic freshness and low acidity.",
      fr: "Récolte soignée à maturité optimale et acheminement rapide vers nos unités de trituration pour préserver la fraîcheur et une acidité minimale.",
      ar: "جني المحصول في مرحلة النضج المثالية ونقله السريع إلى معاصرنا للحفاظ على النكهة الطازجة وأدنى نسبة حموضة.",
    },
    highlights: {
      en: ["Optimal harvest timing", "Leaf-stripping & washing", "Strict lot traceability"],
      fr: ["Récolte à maturité idéale", "Effeuillage & lavage doux", "Traçabilité par lot"],
      ar: ["جني في أوج النضج", "إزالة الشوائب والغسيل", "تتبع دقيق لكل دفعة"],
    },
  },
  {
    id: "extraction",
    number: 3,
    desktopSrc: "/images/journey/stage-3.webp",
    mobileSrc: "/images/journey/stage-3-mobile.webp",
    icon: Droplets,
    title: {
      en: "Cold Extraction",
      fr: "Extraction à Froid",
      ar: "العصر الميكانيكي على البارد",
    },
    subtitle: {
      en: "Mechanical first cold-press (<27°C)",
      fr: "Première pression mécanique (<27°C)",
      ar: "عصر أولي ميكانيكي (<27°C)",
    },
    desc: {
      en: "Continuous physical extraction using modern Alfa Laval stainless steel decanters without chemical solvents, locking in natural polyphenols and flavor.",
      fr: "Extraction continue par centrifugation mécanique sur lignes inox modernes sans aucun solvant, préservant la pureté physico-chimique et sensorielle.",
      ar: "عصر ميكانيكي مستمر بواسطة أحدث الآلات الفولاذية دون إضافات كيميائية، لحماية النقاء الطبيعي والنكهة.",
    },
    highlights: {
      en: ["Strictly below 27°C", "Solvent-free physical process", "IOC standard certified"],
      fr: ["Température contrôlée (<27°C)", "Procédé 100% mécanique", "Conforme aux normes COI"],
      ar: ["حرارة تحت 27 درجة مئوية", "عصر فيزيائي خالص", "مطابق لمواصفات المجلس الدولي"],
    },
  },
  {
    id: "storage",
    number: 4,
    desktopSrc: "/images/journey/stage-4.webp",
    mobileSrc: "/images/journey/stage-4-mobile.webp",
    icon: ShieldCheck,
    title: {
      en: "Inert Nitrogen Storage",
      fr: "Stockage sous Azote Inerte",
      ar: "التخزين تحت النيتروجين الخامل",
    },
    subtitle: {
      en: "Stainless steel tanks & zero oxidation",
      fr: "Cuves inox & protection anti-oxydation",
      ar: "خزانات فولاذية عازلة للأكسدة",
    },
    desc: {
      en: "Oil is transferred into temperature-controlled food-grade stainless steel tanks capped with an inert nitrogen blanket to eliminate air contact.",
      fr: "L'huile est stockée en cuves inox thermorégulées sous couverture d'azote inerte pour stopper toute oxydation et garantir une stabilité parfaite jusqu'à l'embarquement.",
      ar: "حفظ الزيت في خزانات فولاذية صحية معزولة تماماً بغطاء من غاز النيتروجين الخامل لمنع الأكسدة وضمان استقرار الجودة.",
    },
    highlights: {
      en: ["AISI 316 stainless tanks", "Inert N₂ gas barrier", "Constant temperature control"],
      fr: ["Cuves inox alimentaire 316", "Inertage systématique à l'azote", "Thermorégulation constante"],
      ar: ["فولاذ صحي 316", "عزل تام بالنيتروجين N₂", "تحكم حراري دائم"],
    },
  },
  {
    id: "packaging",
    number: 5,
    desktopSrc: "/images/journey/stage-5.webp",
    mobileSrc: "/images/journey/stage-5-mobile.webp",
    icon: Container,
    title: {
      en: "Bulk Packaging",
      fr: "Conditionnement Vrac",
      ar: "التعبئة الصناعية والشحن السائب",
    },
    subtitle: {
      en: "Flexitank 24,000L · IBC · 208L Drums",
      fr: "Flexitanks 24 000L · IBC 1 000L · Fûts 208L",
      ar: "فليكسي تانك 24,000 لتر · خزانات IBC · براميل",
    },
    desc: {
      en: "Fitted into multi-layer food-grade flexitanks in 20ft maritime containers, IBC totes, or sealed steel drums under sterile nitrogen-flushed procedures.",
      fr: "Empotage sécurisé en flexitanks multicouches 24 000L dans conteneurs maritimes 20 pieds, conteneurs IBC 1 000L et fûts métalliques scellés.",
      ar: "تعبئة آمنة في حاويات فليكسي تانك 24,000 لتر وخزانات IBC 1,000 لتر وبراميل فولاذية مغلقة ومجهزة للتصدير.",
    },
    highlights: {
      en: ["24,000L flexitank FCL", "Food-grade certified liners", "Camlock safety valves"],
      fr: ["Flexitank 24 000L FCL", "Poches alimentaires certifiées", "Vannes sécurisées Camlock"],
      ar: ["فليكسي تانك 24,000 لتر", "مواد غذائية معتمدة", "صمامات أمان محكمة"],
    },
  },
  {
    id: "shipping",
    number: 6,
    desktopSrc: "/images/journey/stage-6.webp",
    mobileSrc: "/images/journey/stage-6-mobile.webp",
    icon: Ship,
    title: {
      en: "Shipping from Radès & Sousse",
      fr: "Expédition Radès & Sousse",
      ar: "الشحن من ميناءي رادس وسوسة",
    },
    subtitle: {
      en: "Direct sea routes to 45+ countries",
      fr: "Lignes maritimes directes vers 45+ pays",
      ar: "رحلات بحرية مباشرة إلى أكثر من 45 دولة",
    },
    desc: {
      en: "Fast vessel loading at Tunisia's primary commercial ports with full export documentation, laboratory certificates of analysis, and global shipping lines.",
      fr: "Embarquement rapide aux ports de Radès et Sousse avec dossiers d'export complets, certificats d'analyse officiels et liaisons maritimes directes vers les 5 continents.",
      ar: "شحن سريع من الموانئ التجارية التونسية مصحوباً بكافة الوثائق الجمركية وشهادات التحاليل المخبرية الرسمية إلى الموانئ العالمية.",
    },
    highlights: {
      en: ["Radès & Sousse ports", "FOB / CIF commercial terms", "Fast Mediterranean transit"],
      fr: ["Ports de Radès & Sousse", "Modalités FOB & CIF sur mesure", "Transits maritimes rapides"],
      ar: ["ميناءا رادس وسوسة", "شروط تسليم FOB وCIF", "رحلات بحرية سريعة"],
    },
  },
];

export const OliveJourney: React.FC = () => {
  const { locale } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // IntersectionObserver to highlight stages without scroll-hijacking or per-frame re-renders
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-stage-index"));
            if (!isNaN(index)) {
              setActiveStageIndex(index);
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -45% 0px",
        threshold: 0.2,
      }
    );

    stageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const currentStage = STAGES[activeStageIndex] || STAGES[0];

  const handleStageClick = (index: number) => {
    const el = stageRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section className="relative bg-[#152512] text-white py-20 lg:py-28 overflow-hidden border-t border-verdalia-gold/20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,162,39,0.15),transparent)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-verdalia-gold/30 text-verdalia-gold text-xs font-bold uppercase tracking-[0.25em] mb-4">
            <span className="w-2 h-2 rounded-full bg-verdalia-gold animate-pulse" />
            <span>
              {locale === "fr"
                ? "Traçabilité & Savoir-Faire"
                : locale === "ar"
                ? "الجودة والمسار المتكامل"
                : "From Grove to Global Ports"}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {locale === "fr" ? (
              <>
                L&apos;Odyssée de l&apos;Huile d&apos;Olive{" "}
                <span className="italic font-normal text-verdalia-gold">Verdalia</span>
              </>
            ) : locale === "ar" ? (
              <>
                رحلة زيت الزيتون من الأرض إلى التصدير{" "}
                <span className="text-verdalia-gold">فيرداليا</span>
              </>
            ) : (
              <>
                The Verdalia Olive Oil{" "}
                <span className="italic font-normal text-verdalia-gold">Journey</span>
              </>
            )}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-gray-300 font-light leading-relaxed">
            {locale === "fr"
              ? "De nos oliveraies tunisiennes jusqu'aux terminaux portuaires mondiaux : une chaîne d'approvisionnement B2B sans intermédiaire, maîtrisée de bout en bout."
              : locale === "ar"
              ? "من مزارع الزيتون التونسية إلى موانئ التصدير العالمية: سلسلة توريد صناعية متكاملة وموثوقة لكبرى الشركات العالمية."
              : "From Tunisian olive groves to international shipping terminals: a secure, vertically integrated B2B supply chain engineered for global bulk importers."}
          </p>
        </div>

        {/* ====================================================
            DESKTOP LAYOUT (2 COLUMNS: STICKY IMAGE + NATURAL SCROLLING STAGES)
            No scroll hijacking! Moderate height, silky smooth natural scroll.
            ==================================================== */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Left Column: Sticky Large Image Showcase */}
          <div className="lg:col-span-6 sticky top-28 h-[72vh] min-h-[520px] max-h-[680px] rounded-2xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-black/60">
            {STAGES.map((s, idx) => {
              const isActive = idx === activeStageIndex;
              return (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out will-change-transform ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={s.desktopSrc}
                    alt={s.title.en}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className={`object-cover object-center transition-transform duration-1000 ease-out ${
                      isActive && !shouldReduceMotion ? "scale-105" : "scale-100"
                    }`}
                  />
                  {/* Cinematic gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#152512]/15 mix-blend-multiply pointer-events-none" />

                  {/* Top-right floating stage pill */}
                  <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-mono">
                    <span className="text-verdalia-gold font-bold">0{s.number}</span>
                    <span className="text-white/40">/</span>
                    <span className="text-gray-300">06</span>
                  </div>

                  {/* Bottom caption bar */}
                  <div className="absolute bottom-6 inset-x-6 z-20 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/15 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-verdalia-gold font-bold">
                        {s.subtitle[locale as keyof typeof s.subtitle] || s.subtitle.en}
                      </p>
                      <h4 className="font-serif text-lg font-bold text-white mt-0.5">
                        {s.title[locale as keyof typeof s.title] || s.title.en}
                      </h4>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-verdalia-gold/20 border border-verdalia-gold/40 flex items-center justify-center text-verdalia-gold font-mono text-xs font-bold">
                      0{s.number}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: 6 Stages with Slim Gold Progress Rail */}
          <div className="lg:col-span-6 relative pl-8 xl:pl-10">
            {/* Slim Gold Vertical Progress Line */}
            <div className="absolute left-2.5 top-6 bottom-6 w-0.5 bg-white/15">
              <div
                className="w-full bg-verdalia-gold transition-all duration-500 ease-out"
                style={{
                  height: `${((activeStageIndex + 1) / STAGES.length) * 100}%`,
                }}
              />
            </div>

            {/* Stages Stack */}
            <div className="space-y-24 py-6">
              {STAGES.map((stage, idx) => {
                const isActive = idx === activeStageIndex;
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    ref={(el) => {
                      stageRefs.current[idx] = el;
                    }}
                    data-stage-index={idx}
                    onClick={() => handleStageClick(idx)}
                    className={`relative cursor-pointer transition-all duration-500 group rounded-2xl p-6 sm:p-8 border ${
                      isActive
                        ? "bg-black/45 border-verdalia-gold/45 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20 opacity-70 hover:opacity-95"
                    }`}
                  >
                    {/* Stage number bullet on rail */}
                    <div
                      className={`absolute -left-[37px] top-8 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? "bg-verdalia-gold border-verdalia-gold scale-125 shadow-[0_0_12px_#C9A227]"
                          : "bg-[#152512] border-white/30 group-hover:border-white/60"
                      }`}
                    >
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <span className="w-10 h-10 rounded-xl bg-verdalia-gold/15 border border-verdalia-gold/30 flex items-center justify-center text-verdalia-gold">
                        <Icon className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="text-[11px] font-mono font-bold tracking-widest text-verdalia-gold uppercase block">
                          Stage 0{stage.number}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-verdalia-gold transition-colors">
                          {stage.title[locale as keyof typeof stage.title] || stage.title.en}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs uppercase tracking-widest text-verdalia-gold/90 font-medium mb-3">
                      {stage.subtitle[locale as keyof typeof stage.subtitle] || stage.subtitle.en}
                    </p>

                    <p className="text-sm text-gray-300 font-light leading-relaxed mb-5">
                      {stage.desc[locale as keyof typeof stage.desc] || stage.desc.en}
                    </p>

                    {/* Key Technical Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      {(stage.highlights[locale as keyof typeof stage.highlights] || stage.highlights.en).map(
                        (h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs text-gray-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-verdalia-gold flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ====================================================
            MOBILE LAYOUT (NO PINNING, NO SCROLL HIJACKING)
            100% natural scroll with clean vertical cards & optimized WebP images
            ==================================================== */}
        <div className="lg:hidden space-y-8">
          {STAGES.map((stage) => {
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className="bg-black/50 border border-white/15 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Mobile-Sized Image */}
                <div className="relative aspect-[16/10] w-full bg-black/80">
                  <Image
                    src={stage.mobileSrc}
                    alt={stage.title.en}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Stage badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-verdalia-gold" />
                    <span className="text-verdalia-gold font-bold">0{stage.number} / 06</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-verdalia-gold/20 text-verdalia-gold flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      {stage.title[locale as keyof typeof stage.title] || stage.title.en}
                    </h3>
                  </div>

                  <p className="text-[11px] uppercase tracking-wider text-verdalia-gold font-medium mb-3">
                    {stage.subtitle[locale as keyof typeof stage.subtitle] || stage.subtitle.en}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
                    {stage.desc[locale as keyof typeof stage.desc] || stage.desc.en}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-white/10">
                    {(stage.highlights[locale as keyof typeof stage.highlights] || stage.highlights.en).map(
                      (h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs text-gray-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-verdalia-gold flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
