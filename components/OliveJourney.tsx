"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";

interface JourneyChapter {
  id: string;
  number: number;
  start: number;
  end: number;
  desktopSrc: string;
  mobileSrc: string;
  fallbackSrc: string;
  title: {
    en: string;
    fr: string;
    ar: string;
    es: string;
    it: string;
  };
  desc: {
    en: string;
    fr: string;
    ar: string;
    es: string;
    it: string;
  };
}

export const OliveJourney: React.FC = () => {
  const { locale, dir } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [progress, setProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isReducedMotionState, setIsReducedMotionState] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotionState(mediaQuery.matches || Boolean(shouldReduceMotion));

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotionState(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [shouldReduceMotion]);

  const chapters: JourneyChapter[] = useMemo(
    () => [
      {
        id: "groves",
        number: 1,
        start: 0.0,
        end: 0.143,
        desktopSrc: "/images/journey/01-groves-desktop.jpg",
        mobileSrc: "/images/journey/01-groves-mobile.jpg",
        fallbackSrc: "/images/facility/olive-grove.jpg",
        title: {
          en: "Olive Groves",
          fr: "Les Oliveraies",
          ar: "مزارع الزيتون",
          es: "Los Olivares",
          it: "Gli Uliveti",
        },
        desc: {
          en: "Cultivated olive groves across Tunisia, delivering certified 100% Tunisian origin.",
          fr: "Oliveraies de Tunisie garantissant une traçabilité et une origine 100% tunisienne.",
          ar: "مزارع زيتون عبر تونس تضمن مصدراً وأصلاً تونسياً معتمداً بنسبة 100%.",
          es: "Olivares en Túnez que garantizan origen 100% tunecino certificado.",
          it: "Uliveti in Tunisia che garantiscono un'origine 100% tunisina certificata.",
        },
      },
      {
        id: "harvest",
        number: 2,
        start: 0.143,
        end: 0.286,
        desktopSrc: "/images/journey/02-harvest-desktop.jpg",
        mobileSrc: "/images/journey/02-harvest-mobile.jpg",
        fallbackSrc: "/images/facility/olive-grove.jpg",
        title: {
          en: "Harvest",
          fr: "La Récolte",
          ar: "موسم الجني",
          es: "La Cosecha",
          it: "La Raccolta",
        },
        desc: {
          en: "Local harvest of selected Tunisian olive varieties for balanced acidity and flavor.",
          fr: "Récolte locale d'olives tunisiennes sélectionnées pour un profil aromatique équilibré.",
          ar: "جني محلي لمحصول الزيتون التونسي للحصول على توازن في الحموضة والنكهة.",
          es: "Cosecha local de variedades de aceitunas tunecinas seleccionadas para acidez equilibrada.",
          it: "Raccolta locale di olive tunisine selezionate per un'acidità equilibrata.",
        },
      },
      {
        id: "extraction",
        number: 3,
        start: 0.286,
        end: 0.429,
        desktopSrc: "/images/journey/03-extraction-desktop.jpg",
        mobileSrc: "/images/journey/03-extraction-mobile.jpg",
        fallbackSrc: "/images/facility/storage-tanks.jpg",
        title: {
          en: "Cold Extraction",
          fr: "L'Extraction à Froid",
          ar: "العصر على البارد",
          es: "Extracción en Frío",
          it: "Estrazione a Freddo",
        },
        desc: {
          en: "Mechanical cold extraction safeguarding natural chemical and sensory quality.",
          fr: "Extraction mécanique à froid préservant la qualité physico-chimique et sensorielle.",
          ar: "عصر ميكانيكي على البارد يحافظ على الخصائص الكيميائية والحسية الطبيعية.",
          es: "Extracción mecánica en frío preservando la calidad química y sensorial natural.",
          it: "Estrazione meccanica a freddo che preserva la qualità chimica e sensoriale naturale.",
        },
      },
      {
        id: "filtration",
        number: 4,
        start: 0.429,
        end: 0.571,
        desktopSrc: "/images/journey/04-filtration-desktop.jpg",
        mobileSrc: "/images/journey/04-filtration-mobile.jpg",
        fallbackSrc: "/images/facility/storage-tanks.jpg",
        title: {
          en: "Filtration & Lab Testing",
          fr: "Filtration & Contrôle Qualité",
          ar: "الفلترة والتحاليل المخبرية",
          es: "Filtración y Pruebas de Laboratorio",
          it: "Filtrazione e Analisi di Laboratorio",
        },
        desc: {
          en: "Precision filtration and laboratory batch-tested lots verifying purity and IOC standards.",
          fr: "Filtration de précision et analyses en laboratoire par lot certifiant la conformité COI.",
          ar: "فلترة دقيقة وتحاليل مخبرية لكل دفعة لتأكيد النقاء والمطابقة لمعايير المجلس الدولي للزيتون.",
          es: "Filtración de precisión y análisis de laboratorio por lote verificando pureza y normas COI.",
          it: "Filtrazione di precisione e analisi di laboratorio per lotto verificando purezza e norme COI.",
        },
      },
      {
        id: "storage",
        number: 5,
        start: 0.571,
        end: 0.714,
        desktopSrc: "/images/journey/05-storage-desktop.jpg",
        mobileSrc: "/images/journey/05-storage-mobile.jpg",
        fallbackSrc: "/images/facility/storage-tanks.jpg",
        title: {
          en: "Inert Nitrogen Storage",
          fr: "Stockage sous Azote Inerte",
          ar: "التخزين تحت غاز النيتروجين الخامل",
          es: "Almacenamiento con Nitrógeno Inerte",
          it: "Stoccaggio in Azoto Inerte",
        },
        desc: {
          en: "Controlled storage in stainless steel tanks under inert nitrogen shielding against oxidation.",
          fr: "Stockage contrôlé en cuves inox sous azote inerte pour préserver l'huile contre l'oxydation.",
          ar: "تخزين خاضع للرقابة في خزانات من الفولاذ المقاوم للصدأ تحت النيتروجين الخامل للحماية من الأكسدة.",
          es: "Almacenamiento controlado en tanques de acero inoxidable bajo nitrógeno inerte.",
          it: "Stoccaggio controllato in serbatoi di acciaio inox sotto azoto inerte.",
        },
      },
      {
        id: "packaging",
        number: 6,
        start: 0.714,
        end: 0.857,
        desktopSrc: "/images/journey/06-packaging-desktop.jpg",
        mobileSrc: "/images/journey/06-packaging-mobile.jpg",
        fallbackSrc: "/images/packaging/ibc-container.jpg",
        title: {
          en: "Bulk Packaging",
          fr: "Conditionnement Vrac",
          ar: "التعبئة في أحجام كبرى",
          es: "Envasado a Granel",
          it: "Confezionamento Sfuso",
        },
        desc: {
          en: "Bulk formats for export in 24,000L flexitanks, 1,000L IBC totes, and 208L steel drums.",
          fr: "Formats vrac adaptés à l'export en flexitanks 24 000L, conteneurs IBC 1 000L et fûts 208L.",
          ar: "تعبئة بأحجام كبرى للتصدير في حاويات فليكسي تانك 24,000 لتر، وخزانات IBC 1,000 لتر، وبراميل 208 لتر.",
          es: "Formatos a granel para exportación en flexitanks de 24.000L, IBC de 1.000L y bidones de 208L.",
          it: "Formati sfusi per l'esportazione in flexitank da 24.000L, IBC da 1.000L e fusti da 208L.",
        },
      },
      {
        id: "delivery",
        number: 7,
        start: 0.857,
        end: 1.0,
        desktopSrc: "/images/journey/07-delivery-desktop.jpg",
        mobileSrc: "/images/journey/07-delivery-mobile.jpg",
        fallbackSrc: "/images/facility/port-containers.jpg",
        title: {
          en: "Maritime Delivery",
          fr: "Expédition Maritime",
          ar: "الشحن البحري",
          es: "Envío Marítimo",
          it: "Spedizione Marittima",
        },
        desc: {
          en: "Direct shipments from the commercial ports of Radès and Sousse to 45+ international markets.",
          fr: "Expéditions maritimes depuis les ports de Radès et Sousse vers plus de 45 marchés internationaux.",
          ar: "شحنات بحرية مباشرة من ميناءي رادس وسوسة نحو أكثر من 45 سوقاً دولياً.",
          es: "Envíos directos desde los puertos de Radès y Sousse a más de 45 mercados internacionales.",
          it: "Spedizioni dirette dai porti di Radès e Sousse verso oltre 45 mercati internazionali.",
        },
      },
    ],
    []
  );

  // Setup GSAP ScrollTrigger for pinned scrub (~700vh total scroll)
  useEffect(() => {
    if (isReducedMotionState) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=600%",
      pin: pin,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        // Find active chapter index
        const foundIndex = chapters.findIndex(
          (c) => p >= c.start && (p < c.end || c.number === chapters.length)
        );
        if (foundIndex !== -1) {
          setActiveChapterIndex(foundIndex);
        }
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [isReducedMotionState, chapters]);

  // Click on progress step to smoothly fly directly to that chapter
  const handleStepClick = (index: number) => {
    if (isReducedMotionState) {
      setActiveChapterIndex(index);
      return;
    }

    const st = scrollTriggerRef.current;
    if (!st) return;

    const targetProgress = chapters[index].start + 0.015;
    const scrollTarget = st.start + targetProgress * (st.end - st.start);

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  // Image fallback handler
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackSrc: string
  ) => {
    const target = e.currentTarget;
    if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc)) {
      target.src = fallbackSrc;
    }
  };

  // Reduced motion alternative: clean full-bleed stacked gallery
  if (isReducedMotionState) {
    return (
      <section className="bg-[#0b1609] text-white">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="relative w-full min-h-screen flex items-end p-8 sm:p-16 overflow-hidden border-b border-white/10"
          >
            <picture className="absolute inset-0 z-0">
              <source media="(max-width: 767px)" srcSet={ch.mobileSrc} />
              <source media="(min-width: 768px)" srcSet={ch.desktopSrc} />
              <img
                src={ch.desktopSrc}
                alt={ch.title.en}
                onError={(e) => handleImageError(e, ch.fallbackSrc)}
                className="w-full h-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10" />

            <div className="relative z-20 max-w-3xl">
              <span className="text-xs uppercase tracking-[0.25em] text-verdalia-gold font-semibold block mb-2">
                0{ch.number} / 07
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3">
                {ch.title[locale as keyof typeof ch.title] || ch.title.en}
              </h2>
              <p className="text-base sm:text-lg text-gray-200 font-light leading-relaxed">
                {ch.desc[locale as keyof typeof ch.desc] || ch.desc.en}
              </p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative bg-[#070e06] text-white">
      {/* 100vh Pinned Viewport Container - Edge-to-Edge Luxury Showcase */}
      <div
        ref={pinRef}
        className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none"
      >
        {/* ====================================================
            FULL-SCREEN CINEMATIC CAMERA ZOOM & DISSOLVE STACK
            ==================================================== */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {chapters.map((ch, idx) => {
            const isFirst = idx === 0;
            const slotDuration = ch.end - ch.start;

            // Normalized local progress in chapter range: 0.0 -> 1.0
            const localProgress = Math.min(
              1,
              Math.max(0, (progress - ch.start) / slotDuration)
            );

            // Compute Scene Opacity & Camera Zoom (Fly-through / Zoom into the scene)
            let opacity = 0;
            let scale = 1.0 + 0.32 * localProgress; // Continuous forward camera flight

            if (idx === activeChapterIndex) {
              if (localProgress > 0.8 && idx < chapters.length - 1) {
                // Cross-dissolving out into the next scene while zooming deeper
                opacity = 1 - (localProgress - 0.8) / 0.2;
                scale = 1.25 + 0.15 * ((localProgress - 0.8) / 0.2);
              } else {
                opacity = 1;
              }
            } else if (idx === activeChapterIndex + 1) {
              // Next scene emerging seamlessly
              const prevChapter = chapters[idx - 1];
              const prevLocal = Math.min(
                1,
                Math.max(0, (progress - prevChapter.start) / (prevChapter.end - prevChapter.start))
              );
              if (prevLocal > 0.8) {
                opacity = (prevLocal - 0.8) / 0.2;
                scale = 1.0 + 0.06 * opacity;
              }
            } else if (isFirst && progress < ch.start) {
              opacity = 1;
              scale = 1.0;
            }

            // GPU Optimization: do not render off-screen inactive scenes
            const isNearActive =
              Math.abs(idx - activeChapterIndex) <= 1 ||
              (isFirst && activeChapterIndex === 0);

            if (!isNearActive && opacity === 0) {
              return null;
            }

            return (
              <div
                key={ch.id}
                className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
                style={{
                  zIndex: idx + 1,
                  opacity,
                  transition: "opacity 0.25s linear",
                }}
              >
                {/* 100% Full-Bleed Edge-to-Edge Picture with Continuous Camera Zoom */}
                <div
                  className="absolute inset-0 w-full h-full will-change-transform"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <picture className="w-full h-full block">
                    <source media="(max-width: 767px)" srcSet={ch.mobileSrc} />
                    <source media="(min-width: 768px)" srcSet={ch.desktopSrc} />
                    <img
                      src={ch.desktopSrc}
                      alt={ch.title.en}
                      loading={idx < 2 ? "eager" : "lazy"}
                      decoding={idx < 2 ? "sync" : "async"}
                      onError={(e) => handleImageError(e, ch.fallbackSrc)}
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>
                </div>

                {/* Subtle Cinematic Vignette (Preserves maximum photo brilliance while ensuring text contrast) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* ====================================================
            DISCREET LUXURY REAL-ESTATE TOP HEADER
            (Minimal branding like "THE SOVEL", does not block image)
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-7 sm:pt-9 w-full flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-verdalia-gold animate-pulse shadow-[0_0_10px_#C9A227]" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white/90 drop-shadow">
              VERDALIA COMPANY · THE JOURNEY
            </span>
          </div>

          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono tracking-widest text-white/80 shadow-sm">
            <span className="text-verdalia-gold font-bold">
              0{currentChapter.number}
            </span>
            <span className="text-white/30">/</span>
            <span>07</span>
          </div>
        </div>

        {/* ====================================================
            MINIMAL FLOATING CAPTION (Bottom-Left on Desktop & Mobile)
            Discreet luxury overlay leaving 92%+ of screen completely clear
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12 w-full flex flex-col justify-end pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              {/* Elegant floating caption pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 mb-3 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-verdalia-gold" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-verdalia-gold">
                  {locale === "fr"
                    ? `Étape 0${currentChapter.number}`
                    : locale === "ar"
                    ? `المرحلة 0${currentChapter.number}`
                    : `Chapter 0${currentChapter.number}`}
                </span>
              </div>

              {/* Chapter Title */}
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-wide mb-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                {currentChapter.title[locale as keyof typeof currentChapter.title] ||
                  currentChapter.title.en}
              </h2>

              {/* Verified Sentence */}
              <p className="text-xs sm:text-base text-gray-200/95 font-light leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-lg">
                {currentChapter.desc[locale as keyof typeof currentChapter.desc] ||
                  currentChapter.desc.en}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ====================================================
            MINIMALIST PROGRESS RAIL
            Desktop: Sleek vertical dots on right edge
            Mobile: Sleek horizontal bar at bottom edge
            ==================================================== */}
        {/* Desktop Vertical Rail */}
        <div
          className="hidden md:flex flex-col gap-3.5 absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
          role="tablist"
          aria-label="Olive Oil Journey Chapters"
        >
          {chapters.map((ch, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <div
                key={ch.id}
                className="relative flex items-center justify-end group"
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Tooltip on hover */}
                <div
                  className={`absolute right-7 whitespace-nowrap px-3 py-1 rounded-md text-[11px] font-medium tracking-wide transition-all duration-200 pointer-events-none ${
                    hoveredStep === idx
                      ? "opacity-100 translate-x-0 bg-black/85 text-white border border-verdalia-gold/30 shadow-xl"
                      : "opacity-0 translate-x-2"
                  }`}
                >
                  <span className="text-verdalia-gold font-mono mr-1.5">
                    0{ch.number}
                  </span>
                  {ch.title[locale as keyof typeof ch.title] || ch.title.en}
                </div>

                {/* Dot Button */}
                <button
                  onClick={() => handleStepClick(idx)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Jump to chapter 0${ch.number}: ${ch.title.en}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-verdalia-gold ${
                    isActive
                      ? "bg-verdalia-gold scale-125 shadow-[0_0_12px_#C9A227]"
                      : "bg-white/35 hover:bg-white/80 hover:scale-110"
                  }`}
                >
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Horizontal Rail */}
        <div
          className="flex md:hidden items-center justify-center gap-2 pb-4 z-30 pointer-events-auto"
          role="tablist"
          aria-label="Olive Oil Journey Chapters Mobile"
        >
          {chapters.map((ch, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={ch.id}
                onClick={() => handleStepClick(idx)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Jump to chapter 0${ch.number}`}
                className={`transition-all duration-300 rounded-full focus:outline-none ${
                  isActive
                    ? "w-7 h-1.5 bg-verdalia-gold shadow-[0_0_8px_#C9A227]"
                    : "w-2 h-1.5 bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
