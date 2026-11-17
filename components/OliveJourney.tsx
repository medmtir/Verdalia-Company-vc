"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import {
  TreePine,
  Wheat,
  Droplets,
  Filter,
  ShieldCheck,
  Container,
  Ship,
  Sparkles,
} from "lucide-react";

interface JourneyChapter {
  id: string;
  number: number;
  icon: any;
  start: number;
  end: number;
  desktopSrc: string;
  mobileSrc: string;
  fallbackSrc: string;
  placeholderGradient: string;
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
  const { locale } = useI18n();
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
        icon: TreePine,
        start: 0.0,
        end: 0.143,
        desktopSrc: "/images/journey/01-groves-desktop.jpg",
        mobileSrc: "/images/journey/01-groves-mobile.jpg",
        fallbackSrc: "/images/facility/olive-grove.jpg",
        placeholderGradient: "from-[#11220e] via-[#1a3316] to-[#0c1809]",
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
        icon: Wheat,
        start: 0.143,
        end: 0.286,
        desktopSrc: "/images/journey/02-harvest-desktop.jpg",
        mobileSrc: "/images/journey/02-harvest-mobile.jpg",
        fallbackSrc: "/images/facility/olive-grove.jpg",
        placeholderGradient: "from-[#152912] via-[#203a1a] to-[#0d1c0b]",
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
        icon: Droplets,
        start: 0.286,
        end: 0.429,
        desktopSrc: "/images/journey/03-extraction-desktop.jpg",
        mobileSrc: "/images/journey/03-extraction-mobile.jpg",
        fallbackSrc: "/images/facility/storage-tanks.jpg",
        placeholderGradient: "from-[#162e12] via-[#24421d] to-[#0e1d0c]",
        title: {
          en: "Cold Extraction",
          fr: "L'Extraction à Froid",
          ar: "العصر على البارد",
          es: "Extracción en Frío",
          it: "Estrazione a Freddo",
        },
        desc: {
          en: "Mechanical cold extraction safeguarding the natural chemical and sensory quality.",
          fr: "Extraction mécanique à froid préservant la qualité physico-chimique et sensorielle.",
          ar: "عصر ميكانيكي على البارد يحافظ على الخصائص الكيميائية والحسية الطبيعية.",
          es: "Extracción mecánica en frío preservando la calidad química y sensorial natural.",
          it: "Estrazione meccanica a freddo che preserva la qualità chimica e sensoriale naturale.",
        },
      },
      {
        id: "filtration",
        number: 4,
        icon: Filter,
        start: 0.429,
        end: 0.571,
        desktopSrc: "/images/journey/04-filtration-desktop.jpg",
        mobileSrc: "/images/journey/04-filtration-mobile.jpg",
        fallbackSrc: "/images/facility/storage-tanks.jpg",
        placeholderGradient: "from-[#132610] via-[#1f3b19] to-[#0c180a]",
        title: {
          en: "Filtration & Lab Testing",
          fr: "Filtration & Contrôle Qualité",
          ar: "الفلترة والتحاليل المخبرية",
          es: "Filtración y Pruebas de Laboratorio",
          it: "Filtrazione e Analisi di Laboratorio",
        },
        desc: {
          en: "Precision filtration and laboratory batch-tested lots verifying purity and IOC standards compliance.",
          fr: "Filtration de précision et analyses en laboratoire par lot garantissant la conformité aux normes COI.",
          ar: "فلترة دقيقة وتحاليل مخبرية لكل دفعة لتأكيد النقاء والمطابقة لمعايير المجلس الدولي للزيتون.",
          es: "Filtración de precisión y análisis de laboratorio por lote verificando pureza y normas COI.",
          it: "Filtrazione di precisione e analisi di laboratorio per lotto verificando purezza e norme COI.",
        },
      },
      {
        id: "storage",
        number: 5,
        icon: ShieldCheck,
        start: 0.571,
        end: 0.714,
        desktopSrc: "/images/journey/05-storage-desktop.jpg",
        mobileSrc: "/images/journey/05-storage-mobile.jpg",
        fallbackSrc: "/images/facility/storage-tanks.jpg",
        placeholderGradient: "from-[#10200e] via-[#1b3317] to-[#091307]",
        title: {
          en: "Inert Nitrogen Storage",
          fr: "Stockage sous Azote Inerte",
          ar: "التخزين تحت غاز النيتروجين الخامل",
          es: "Almacenamiento con Nitrógeno Inerte",
          it: "Stoccaggio in Azoto Inerte",
        },
        desc: {
          en: "Controlled storage in stainless steel tanks under inert nitrogen to shield against oxidation.",
          fr: "Stockage contrôlé en cuves inox sous azote inerte pour préserver l'huile contre l'oxydation.",
          ar: "تخزين خاضع للرقابة في خزانات من الفولاذ المقاوم للصدأ تحت النيتروجين الخامل للحماية من الأكسدة.",
          es: "Almacenamiento controlado en tanques de acero inoxidable bajo nitrógeno inerte para proteger contra la oxidación.",
          it: "Stoccaggio controllato in serbatoi di acciaio inox sotto azoto inerte per schermare dall'ossidazione.",
        },
      },
      {
        id: "packaging",
        number: 6,
        icon: Container,
        start: 0.714,
        end: 0.857,
        desktopSrc: "/images/journey/06-packaging-desktop.jpg",
        mobileSrc: "/images/journey/06-packaging-mobile.jpg",
        fallbackSrc: "/images/packaging/ibc-container.jpg",
        placeholderGradient: "from-[#132410] via-[#213b1b] to-[#0d170a]",
        title: {
          en: "Bulk Packaging",
          fr: "Conditionnement Vrac",
          ar: "التعبئة في أحجام كبرى",
          es: "Envasado a Granel",
          it: "Confezionamento Sfuso",
        },
        desc: {
          en: "Bulk formats tailored for export in 24,000L flexitanks, 1,000L IBC totes, and 208L drums.",
          fr: "Formats vrac adaptés à l'export en flexitanks de 24 000L, conteneurs IBC de 1 000L et fûts de 208L.",
          ar: "تعبئة بأحجام كبرى للتصدير في حاويات فليكسي تانك 24,000 لتر، وخزانات IBC 1,000 لتر، وبراميل 208 لتر.",
          es: "Formatos a granel para exportación en flexitanks de 24.000L, IBC de 1.000L y bidones de 208L.",
          it: "Formati sfusi per l'esportazione in flexitank da 24.000L, IBC da 1.000L e fusti da 208L.",
        },
      },
      {
        id: "delivery",
        number: 7,
        icon: Ship,
        start: 0.857,
        end: 1.0,
        desktopSrc: "/images/journey/07-delivery-desktop.jpg",
        mobileSrc: "/images/journey/07-delivery-mobile.jpg",
        fallbackSrc: "/images/facility/port-containers.jpg",
        placeholderGradient: "from-[#0e1c0c] via-[#183015] to-[#081107]",
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

  // Setup GSAP ScrollTrigger for pinned scrub across 700vh total
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
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        // Find active chapter
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

  // Click on progress dot to smoothly scroll to chapter
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

  // Route drawing progress for Chapter 07
  const deliveryChapter = chapters[6];
  const routeProgress = Math.min(
    1,
    Math.max(
      0,
      (progress - deliveryChapter.start) /
        (deliveryChapter.end - deliveryChapter.start)
    )
  );

  // Reduced motion alternative: clean stacked sections
  if (isReducedMotionState) {
    return (
      <section className="py-20 bg-[#101E0E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {locale === "fr"
                ? "Du Terroir aux Ports Mondiaux"
                : locale === "ar"
                ? "من مزارع تونس إلى موانئ العالم"
                : "From Grove to Global Ports"}
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold mt-3">
              {locale === "fr"
                ? "L'Odyssée de l'Huile Verdalia"
                : locale === "ar"
                ? "رحلة زيت الزيتون فيرداليا"
                : "The Verdalia Olive Oil Journey"}
            </h2>
          </div>

          <div className="space-y-16">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 min-h-[500px] flex flex-col justify-end p-8 sm:p-12"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${ch.placeholderGradient} opacity-60 z-0`}
                />
                <picture className="absolute inset-0 z-0">
                  <source media="(max-width: 767px)" srcSet={ch.mobileSrc} />
                  <source media="(min-width: 768px)" srcSet={ch.desktopSrc} />
                  <img
                    src={ch.desktopSrc}
                    alt={ch.title.en}
                    onError={(e) => handleImageError(e, ch.fallbackSrc)}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-60"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10" />

                <div className="relative z-20 max-w-2xl">
                  <span
                    className="font-serif text-6xl sm:text-8xl font-bold block select-none text-transparent leading-none mb-3"
                    style={{ WebkitTextStroke: "1.5px rgba(201, 162, 39, 0.45)" }}
                  >
                    0{ch.number}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                    {ch.title[locale as keyof typeof ch.title] || ch.title.en}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-200/90 font-light leading-relaxed">
                    {ch.desc[locale as keyof typeof ch.desc] || ch.desc.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Calculate local progress in active chapter for continuous transformation animations
  const currentChapterStart = currentChapter.start;
  const currentChapterEnd = currentChapter.end;
  const currentLocalProgress = Math.min(
    1,
    Math.max(
      0,
      (progress - currentChapterStart) / (currentChapterEnd - currentChapterStart)
    )
  );

  return (
    <section ref={containerRef} className="relative bg-[#0b1609] text-white">
      {/* 100vh Pinned Viewport Container */}
      <div
        ref={pinRef}
        className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between"
      >
        {/* ====================================================
            7 FULL-BLEED SCENE LAYERS STACKED ABSOLUTELY
            ==================================================== */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {chapters.map((ch, idx) => {
            const isFirst = idx === 0;
            const isPast = activeChapterIndex > idx;
            const isFuture = activeChapterIndex < idx;

            // Chapter local progress
            const localProgress = Math.min(
              1,
              Math.max(0, (progress - ch.start) / (ch.end - ch.start))
            );

            // Ken Burns slow zoom: 1.0 -> 1.12
            const scale = 1.0 + 0.12 * localProgress;

            // Smooth circle wipe transition into scene idx (> 0)
            let clipPathStyle = "circle(150% at 50% 50%)";
            if (!isFirst) {
              if (progress < ch.start) {
                clipPathStyle = "circle(0% at 50% 50%)";
              } else {
                const wipeTransition = Math.min(
                  1,
                  Math.max(0, (progress - ch.start) / ((ch.end - ch.start) * 0.3))
                );
                clipPathStyle = `circle(${wipeTransition * 150}% at 50% 50%)`;
              }
            }

            // Parallax
            const bgTranslateY = (localProgress - 0.5) * -24;
            const overlayTranslateY = (localProgress - 0.5) * 16;

            const isVisible =
              idx === activeChapterIndex ||
              idx === activeChapterIndex - 1 ||
              idx === activeChapterIndex + 1;

            if (!isVisible && !isFirst && isFuture) {
              return null;
            }

            return (
              <div
                key={ch.id}
                className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
                style={{
                  clipPath: isFirst ? undefined : clipPathStyle,
                  zIndex: idx + 1,
                  opacity: isPast && idx < activeChapterIndex - 1 ? 0 : 1,
                  transition: "opacity 0.4s ease-out",
                }}
              >
                {/* Safe gradient fallback */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${ch.placeholderGradient} z-0`}
                />

                {/* Ken Burns Animated Picture Layer */}
                <div
                  className="absolute inset-0 w-full h-full will-change-transform"
                  style={{
                    transform: `scale(${scale}) translateY(${bgTranslateY}px)`,
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

                {/* Parallax Gradient Overlay Layer (Dark bottom for pristine typography contrast) */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none will-change-transform"
                  style={{
                    transform: `translateY(${overlayTranslateY}px)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />
                  <div className="absolute inset-0 bg-[#0c180a]/35 mix-blend-multiply" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ====================================================
            SCROLL-DRIVEN 3D CINEMATIC MOTION STORY LAYER
            Acts out the physical olive journey as user scrolls:
            Olive detaching -> falling -> cold pressing -> golden drops -> 
            filtration -> inert N2 tank filling -> flexitank pumping -> container ship sailing
            ==================================================== */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg sm:max-w-2xl h-80 sm:h-96 flex items-center justify-center">
            {/* 1. SCENE 1: OLIVE ON THE TREE BRANCH DETACHING */}
            {activeChapterIndex === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex flex-col items-center"
              >
                {/* Tree Branch SVG */}
                <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
                  <path
                    d="M 10 20 Q 90 40 210 15"
                    stroke="#4A6B3D"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Leaves */}
                  <ellipse cx="60" cy="18" rx="20" ry="8" fill="#5F8A4B" transform="rotate(-20 60 18)" />
                  <ellipse cx="120" cy="35" rx="24" ry="10" fill="#75A85D" transform="rotate(25 120 35)" />
                  <ellipse cx="170" cy="20" rx="22" ry="9" fill="#5F8A4B" transform="rotate(-15 170 20)" />
                  {/* Stem */}
                  <path
                    d={`M 115 35 Q 112 55 ${110 + currentLocalProgress * 6} ${65 + currentLocalProgress * 20}`}
                    stroke="#8B7355"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={currentLocalProgress > 0.4 ? "4 4" : "none"}
                  />
                </svg>

                {/* 3D Shaded Ripe Olive */}
                <div
                  className="relative -mt-6 transition-transform will-change-transform"
                  style={{
                    transform: `translateY(${currentLocalProgress * 140}px) rotate(${
                      currentLocalProgress * 45
                    }deg) scale(${1 + currentLocalProgress * 0.15})`,
                  }}
                >
                  <div className="w-14 h-20 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#4b6a2b] via-[#2f4a1a] to-[#1a2d0d] shadow-[0_15px_30px_rgba(0,0,0,0.7),inset_-4px_-6px_12px_rgba(0,0,0,0.8),inset_4px_6px_10px_rgba(255,255,255,0.4)] border border-[#5d8536]/30 flex items-center justify-center">
                    {/* Specular Highlight */}
                    <div className="w-3.5 h-6 rounded-full bg-white/40 blur-[1px] -translate-y-3 -translate-x-2 rotate-[-20deg]" />
                  </div>
                  {/* Dropping motion trail */}
                  {currentLocalProgress > 0.3 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-t from-verdalia-gold/50 to-transparent blur-[1px]" />
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. SCENE 2: HARVEST COLLECTION CRADLE */}
            {activeChapterIndex === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* Falling Olives Flurry */}
                <div className="relative w-48 h-48">
                  <div
                    className="absolute left-16 transition-all duration-300 will-change-transform"
                    style={{
                      top: `${currentLocalProgress * 120}px`,
                      transform: `rotate(${currentLocalProgress * 120}deg)`,
                    }}
                  >
                    <div className="w-12 h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#4b6a2b] via-[#2f4a1a] to-[#1a2d0d] shadow-xl border border-white/20">
                      <div className="w-2.5 h-4 rounded-full bg-white/45 blur-[0.5px] mt-2 ml-2 rotate-[-15deg]" />
                    </div>
                  </div>
                  <div
                    className="absolute left-28 transition-all duration-300 will-change-transform"
                    style={{
                      top: `${Math.max(0, (currentLocalProgress - 0.15) * 110)}px`,
                      transform: `rotate(${currentLocalProgress * -90}deg)`,
                    }}
                  >
                    <div className="w-10 h-14 rounded-full bg-gradient-to-br from-[#3b5522] via-[#223612] to-[#14220b] shadow-lg" />
                  </div>
                </div>

                {/* Harvesting Net Cradle */}
                <svg width="260" height="70" viewBox="0 0 260 70" fill="none">
                  <path
                    d={`M 10 20 Q 130 ${45 + currentLocalProgress * 15} 250 20`}
                    stroke="#C9A227"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                  <path
                    d={`M 30 30 Q 130 ${55 + currentLocalProgress * 15} 230 30`}
                    stroke="#C9A227"
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                    strokeDasharray="4 4"
                  />
                </svg>
              </motion.div>
            )}

            {/* 3. SCENE 3: MECHANICAL COLD EXTRACTION & GOLDEN DROPLET BURST */}
            {activeChapterIndex === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* Mechanical Press Rollers */}
                <div className="flex items-center gap-12 sm:gap-16 relative">
                  <div
                    className="w-16 sm:w-20 h-28 rounded-xl bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-2xl border border-white/40 flex items-center justify-center transition-transform"
                    style={{
                      transform: `translateX(${currentLocalProgress * 22}px) rotate(${
                        currentLocalProgress * 180
                      }deg)`,
                    }}
                  >
                    <div className="w-full h-1 bg-gray-600/60 my-1" />
                  </div>

                  {/* Crushing Center & Golden Oil Stream */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3b5522] via-verdalia-gold to-[#b38b1d] transition-all will-change-transform shadow-[0_0_25px_#C9A227]"
                      style={{
                        transform: `scale(${Math.max(0.2, 1 - currentLocalProgress * 0.7)})`,
                        opacity: 1 - currentLocalProgress * 0.5,
                      }}
                    />
                  </div>

                  <div
                    className="w-16 sm:w-20 h-28 rounded-xl bg-gradient-to-l from-gray-400 via-gray-200 to-gray-500 shadow-2xl border border-white/40 flex items-center justify-center transition-transform"
                    style={{
                      transform: `translateX(${-currentLocalProgress * 22}px) rotate(${
                        -currentLocalProgress * 180
                      }deg)`,
                    }}
                  >
                    <div className="w-full h-1 bg-gray-600/60 my-1" />
                  </div>
                </div>

                {/* Flowing Golden Oil Droplets Stream */}
                <div className="relative mt-4 flex flex-col items-center">
                  <div
                    className="w-1.5 bg-gradient-to-b from-verdalia-gold via-[#e8c85a] to-transparent rounded-full shadow-[0_0_15px_#C9A227] transition-all"
                    style={{
                      height: `${currentLocalProgress * 120}px`,
                    }}
                  />
                  <div
                    className="w-9 h-12 rounded-[50%_50%_50%_50%/70%_70%_35%_35%] bg-gradient-to-b from-[#FFF2B2] via-verdalia-gold to-[#8B6E16] shadow-[0_0_30px_#C9A227] border border-white/60 -mt-2 animate-pulse"
                    style={{
                      transform: `scale(${0.7 + currentLocalProgress * 0.5}) translateY(${
                        currentLocalProgress * 20
                      }px)`,
                    }}
                  >
                    <div className="w-2 h-4 rounded-full bg-white/70 blur-[0.5px] mt-1.5 ml-1.5" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. SCENE 4: PRECISION LABORATORY FILTRATION */}
            {activeChapterIndex === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* Multi-tier Filter Chamber */}
                <div className="w-48 sm:w-60 h-44 rounded-2xl border-2 border-verdalia-gold/40 bg-black/60 backdrop-blur-md p-4 flex flex-col justify-between shadow-[0_0_30px_rgba(201,162,39,0.25)] relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] tracking-widest text-verdalia-gold font-mono uppercase">
                    <span>MICRO-FILTRATION</span>
                    <Sparkles className="w-3.5 h-3.5 text-verdalia-gold animate-spin" />
                  </div>

                  {/* Filter Mesh Lines */}
                  <div className="space-y-3 my-2">
                    <div className="h-0.5 w-full bg-verdalia-gold/50 shadow-[0_0_8px_#C9A227]" />
                    <div className="h-0.5 w-full bg-verdalia-gold/70 shadow-[0_0_10px_#C9A227]" />
                    <div className="h-0.5 w-full bg-verdalia-gold/90 shadow-[0_0_12px_#C9A227]" />
                  </div>

                  {/* Crystal-Clear Flowing Oil Stream */}
                  <div
                    className="absolute inset-x-8 bottom-0 bg-gradient-to-t from-verdalia-gold/90 via-[#e0ba38]/60 to-transparent transition-all rounded-b-xl"
                    style={{
                      height: `${currentLocalProgress * 100}%`,
                    }}
                  />

                  <div className="relative z-10 text-center">
                    <span className="text-xs font-serif font-bold text-white tracking-wider">
                      IOC GRADE CERTIFIED
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. SCENE 5: MONUMENTAL TANK WITH NITROGEN (N2) BLANKET */}
            {activeChapterIndex === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* 3D Stainless Steel Tank Section */}
                <div className="w-44 sm:w-56 h-60 rounded-3xl border-2 border-gray-300/60 bg-gradient-to-b from-gray-800/80 via-black/80 to-gray-900/90 backdrop-blur-lg shadow-2xl relative overflow-hidden flex flex-col justify-end p-3">
                  {/* Nitrogen Blanket Gas Layer */}
                  <div className="absolute top-2 inset-x-3 bg-cyan-400/20 border border-cyan-400/40 rounded-lg p-1.5 flex items-center justify-between text-[9px] font-mono text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                    <span>INERT N₂ SEAL</span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>

                  {/* Oil Level Filling Inside Tank */}
                  <div
                    className="w-full bg-gradient-to-t from-[#8B6E16] via-verdalia-gold to-[#FFF0A0] rounded-2xl shadow-[0_0_25px_#C9A227] transition-all will-change-transform relative"
                    style={{
                      height: `${Math.max(10, currentLocalProgress * 85)}%`,
                    }}
                  >
                    {/* Meniscus Ripple */}
                    <div className="absolute top-0 inset-x-0 h-2 bg-white/70 rounded-full blur-[0.5px] animate-pulse" />
                  </div>

                  {/* Manometer Gauge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded border border-verdalia-gold/40 text-[10px] font-mono text-verdalia-gold">
                    {Math.round(currentLocalProgress * 100)}% CAPACITY
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. SCENE 6: 24,000L FLEXITANK BULK PACKAGING PUMP */}
            {activeChapterIndex === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center"
              >
                {/* 20ft Shipping Container Frame */}
                <div className="w-64 sm:w-80 h-48 rounded-xl border-2 border-amber-600/70 bg-gradient-to-b from-[#2A1B0E]/90 to-black/90 backdrop-blur-md p-3 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-mono text-verdalia-gold font-bold">
                    <span>20FT CONTAINER FCL</span>
                    <span className="text-white/80">FOOD-GRADE MULTI-PLY</span>
                  </div>

                  {/* Inflating Heavy-Duty Flexitank Bladder */}
                  <div className="relative w-full h-28 bg-black/40 rounded-lg flex items-end justify-center p-1.5 overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-[#1A3316] via-verdalia-gold/70 to-[#FFF2B2] rounded-lg border border-verdalia-gold shadow-[0_0_20px_rgba(201,162,39,0.4)] transition-all will-change-transform"
                      style={{
                        height: `${Math.max(25, currentLocalProgress * 95)}%`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-white text-xs sm:text-sm drop-shadow-md">
                      {Math.round(currentLocalProgress * 24000).toLocaleString()}{" "}
                      / 24,000 L
                    </div>
                  </div>

                  {/* Bottom Valve & Bulkhead Steel Bars */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      VALVE 3" CAMLOCK LOCKED
                    </span>
                    <span className="text-verdalia-gold font-semibold">
                      READY FOR PORT
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. SCENE 7: MARITIME CONTAINER VESSEL & GLOBAL PORTS MAP */}
            {activeChapterIndex === 6 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full flex flex-col items-center justify-center"
              >
                {/* SVG Mediterranean Maritime Shipping Route Map */}
                <svg
                  viewBox="0 0 1000 550"
                  className="w-full h-full max-w-4xl opacity-90 drop-shadow-[0_0_20px_rgba(201,162,39,0.5)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Radès & Sousse Anchor Nodes */}
                  <g className="animate-pulse">
                    <circle cx="480" cy="300" r="9" fill="#C9A227" />
                    <circle cx="480" cy="300" r="20" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.5" />
                    <circle cx="495" cy="335" r="8" fill="#C9A227" />
                    <circle cx="495" cy="335" r="18" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.5" />
                  </g>

                  {/* Port Labels */}
                  <text x="510" y="305" fill="#FFFFFF" fontSize="13" fontWeight="700" letterSpacing="1">
                    PORT DE RADÈS
                  </text>
                  <text x="525" y="340" fill="#FFFFFF" fontSize="13" fontWeight="700" letterSpacing="1">
                    PORT DE SOUSSE
                  </text>

                  {/* Maritime Route Lines radiating to international markets */}
                  <path
                    d="M 480 300 Q 420 180 350 110"
                    stroke="#C9A227"
                    strokeWidth="3"
                    strokeDasharray="420"
                    strokeDashoffset={420 * (1 - routeProgress)}
                    strokeLinecap="round"
                  />
                  {routeProgress > 0.35 && (
                    <g>
                      <circle cx="350" cy="110" r="6" fill="#C9A227" />
                      <text x="365" y="115" fill="#E5E7EB" fontSize="11" letterSpacing="1">EUROPE / GENOA</text>
                    </g>
                  )}

                  <path
                    d="M 480 300 Q 280 250 110 210"
                    stroke="#C9A227"
                    strokeWidth="3"
                    strokeDasharray="450"
                    strokeDashoffset={450 * (1 - routeProgress)}
                    strokeLinecap="round"
                  />
                  {routeProgress > 0.5 && (
                    <g>
                      <circle cx="110" cy="210" r="6" fill="#C9A227" />
                      <text x="125" y="215" fill="#E5E7EB" fontSize="11" letterSpacing="1">AMERICAS & ATLANTIC</text>
                    </g>
                  )}

                  <path
                    d="M 495 335 Q 680 330 850 290"
                    stroke="#C9A227"
                    strokeWidth="3"
                    strokeDasharray="450"
                    strokeDashoffset={450 * (1 - routeProgress)}
                    strokeLinecap="round"
                  />
                  {routeProgress > 0.65 && (
                    <g>
                      <circle cx="850" cy="290" r="6" fill="#C9A227" />
                      <text x="730" y="275" fill="#E5E7EB" fontSize="11" letterSpacing="1">MIDDLE EAST & ASIA</text>
                    </g>
                  )}

                  {routeProgress > 0.8 && (
                    <g className="animate-bounce">
                      <rect x="380" y="440" width="240" height="42" rx="21" fill="#142611" stroke="#C9A227" strokeWidth="2" />
                      <text x="500" y="466" fill="#C9A227" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="1.5">
                        DELIVERED TO 45+ MARKETS
                      </text>
                    </g>
                  )}
                </svg>
              </motion.div>
            )}
          </div>
        </div>

        {/* ====================================================
            TOP BAR INSIDE PINNED SCREEN (Luxury Brand Header)
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-8 sm:pt-10 w-full flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-verdalia-gold animate-pulse shadow-[0_0_10px_#C9A227]" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.26em] text-verdalia-gold drop-shadow">
              {locale === "fr"
                ? "L'Odyssée de l'Huile Verdalia"
                : locale === "ar"
                ? "رحلة زيت الزيتون فيرداليا"
                : "The Verdalia Olive Oil Journey"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs tracking-wider font-mono text-white/80 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-sm">
            <span className="text-verdalia-gold font-bold">
              0{currentChapter.number}
            </span>
            <span className="text-white/30">/</span>
            <span>07</span>
          </div>
        </div>

        {/* ====================================================
            MINIMAL TEXT LAYER (Huge Number + Title + Verified Sentence)
            Bottom-left on Desktop, Bottom on Mobile
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-12 sm:pb-16 w-full flex flex-col justify-end pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              {/* Huge Outlined Chapter Number */}
              <div className="flex items-baseline gap-4 mb-2">
                <span
                  className="font-serif text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter select-none text-transparent leading-none"
                  style={{
                    WebkitTextStroke: "1.5px rgba(201, 162, 39, 0.45)",
                    textShadow: "0 0 35px rgba(0,0,0,0.85)",
                  }}
                >
                  0{currentChapter.number}
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-verdalia-gold font-semibold drop-shadow">
                  {locale === "fr"
                    ? "Étape"
                    : locale === "ar"
                    ? "المرحلة"
                    : "Chapter"}{" "}
                  0{currentChapter.number}
                </span>
              </div>

              {/* Chapter Title */}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide mb-3 drop-shadow-md">
                {currentChapter.title[locale as keyof typeof currentChapter.title] ||
                  currentChapter.title.en}
              </h2>

              {/* Verified Sentence */}
              <p className="text-sm sm:text-base md:text-lg text-gray-200/95 font-light leading-relaxed max-w-xl drop-shadow">
                {currentChapter.desc[locale as keyof typeof currentChapter.desc] ||
                  currentChapter.desc.en}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ====================================================
            PROGRESS RAIL
            Desktop: Vertical on Right Side
            Mobile: Horizontal at Bottom
            ==================================================== */}
        {/* Desktop Vertical Progress Rail */}
        <div
          className="hidden md:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
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
                  className={`absolute right-8 whitespace-nowrap px-3 py-1 rounded-md text-xs font-medium tracking-wide transition-all duration-200 pointer-events-none ${
                    hoveredStep === idx
                      ? "opacity-100 translate-x-0 bg-black/85 text-white border border-verdalia-gold/30 shadow-lg"
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
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-verdalia-gold focus:ring-offset-2 focus:ring-offset-[#101E0E] ${
                    isActive
                      ? "bg-verdalia-gold scale-125 shadow-[0_0_12px_#C9A227]"
                      : "bg-white/30 hover:bg-white/70 hover:scale-110"
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile Horizontal Bottom Progress Rail */}
        <div
          className="flex md:hidden items-center justify-center gap-3.5 pb-6 pt-2 z-30 pointer-events-auto"
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
                    ? "w-8 h-2.5 bg-verdalia-gold shadow-[0_0_10px_#C9A227]"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
