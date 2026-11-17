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
  Volume2,
  VolumeX,
  Compass,
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
  hasVideoLoop?: boolean;
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
  const [isMuted, setIsMuted] = useState(true);

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
        // TODO: Provide /images/journey/01-groves-desktop.jpg (16:9) and 01-groves-mobile.jpg (9:16)
        desktopSrc: "/images/journey/01-groves-desktop.jpg",
        mobileSrc: "/images/journey/01-groves-mobile.jpg",
        fallbackSrc: "/images/facility/olive-grove.jpg",
        placeholderGradient: "from-[#11220e] via-[#1a3316] to-[#0c1809]",
        title: {
          en: "Olive Groves",
          fr: "Les Oliveraies",
          // TODO: Human review required for AR/ES/IT translations
          ar: "مزارع الزيتون",
          es: "Los Olivares",
          it: "Gli Uliveti",
        },
        desc: {
          en: "Cultivated olive groves across Tunisia, delivering certified 100% Tunisian origin.",
          fr: "Oliveraies de Tunisie garantissant une traçabilité et une origine 100% tunisienne.",
          // TODO: Human review required for AR/ES/IT translations
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
        // TODO: Provide /images/journey/02-harvest-desktop.jpg (16:9) and 02-harvest-mobile.jpg (9:16)
        desktopSrc: "/images/journey/02-harvest-desktop.jpg",
        mobileSrc: "/images/journey/02-harvest-mobile.jpg",
        fallbackSrc: "/images/facility/olive-grove.jpg",
        placeholderGradient: "from-[#152912] via-[#203a1a] to-[#0d1c0b]",
        title: {
          en: "Harvest",
          fr: "La Récolte",
          // TODO: Human review required for AR/ES/IT translations
          ar: "موسم الجني",
          es: "La Cosecha",
          it: "La Raccolta",
        },
        desc: {
          en: "Local harvest of selected Tunisian olive varieties for balanced acidity and flavor.",
          fr: "Récolte locale d'olives tunisiennes sélectionnées pour un profil aromatique équilibré.",
          // TODO: Human review required for AR/ES/IT translations
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
          // TODO: Human review required for AR/ES/IT translations
          ar: "العصر على البارد",
          es: "Extracción en Frío",
          it: "Estrazione a Freddo",
        },
        desc: {
          en: "Mechanical cold extraction safeguarding the natural chemical and sensory quality.",
          fr: "Extraction mécanique à froid préservant la qualité physico-chimique et sensorielle.",
          // TODO: Human review required for AR/ES/IT translations
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
          // TODO: Human review required for AR/ES/IT translations
          ar: "الفلترة والتحاليل المخبرية",
          es: "Filtración y Pruebas de Laboratorio",
          it: "Filtrazione e Analisi di Laboratorio",
        },
        desc: {
          en: "Precision filtration and laboratory batch-tested lots verifying purity and IOC standards compliance.",
          fr: "Filtration de précision et analyses en laboratoire par lot garantissant la conformité aux normes COI.",
          // TODO: Human review required for AR/ES/IT translations
          ar: "فلترة دقيقة وتحاليل مخبرية لكل دفعة لتأكيد النقاء والمطابقة لمعايير المجلس الدولي للزيتون.",
          es: "Filtración de precisión y análisis de laboratorio por lote verificando pureza y normas COI.",
          it: "Filtrazione de precisione e analisi di laboratorio per lotto verificando purezza e norme COI.",
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
        hasVideoLoop: true,
        title: {
          en: "Inert Nitrogen Storage",
          fr: "Stockage sous Azote Inerte",
          // TODO: Human review required for AR/ES/IT translations
          ar: "التخزين تحت غاز النيتروجين الخامل",
          es: "Almacenamiento con Nitrógeno Inerte",
          it: "Stoccaggio in Azoto Inerte",
        },
        desc: {
          en: "Controlled storage in stainless steel tanks under inert nitrogen to shield against oxidation.",
          fr: "Stockage contrôlé en cuves inox sous azote inerte pour préserver l'huile contre l'oxydation.",
          // TODO: Human review required for AR/ES/IT translations
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
          // TODO: Human review required for AR/ES/IT translations
          ar: "التعبئة في أحجام كبرى",
          es: "Envasado a Granel",
          it: "Confezionamento Sfuso",
        },
        desc: {
          en: "Bulk formats tailored for export in 24,000L flexitanks, 1,000L IBC totes, and 208L drums.",
          fr: "Formats vrac adaptés à l'export en flexitanks de 24 000L, conteneurs IBC de 1 000L et fûts de 208L.",
          // TODO: Human review required for AR/ES/IT translations
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
          // TODO: Human review required for AR/ES/IT translations
          ar: "الشحن البحري",
          es: "Envío Marítimo",
          it: "Spedizione Marittima",
        },
        desc: {
          en: "Direct shipments from the commercial ports of Radès and Sousse to 45+ international markets.",
          fr: "Expéditions maritimes depuis les ports de Radès et Sousse vers plus de 45 marchés internationaux.",
          // TODO: Human review required for AR/ES/IT translations
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

  // Image fallback handler to prevent any broken display
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallbackSrc: string
  ) => {
    const target = e.currentTarget;
    if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc)) {
      target.src = fallbackSrc;
    }
  };

  // Route drawing progress for Chapter 07 (0 to 1)
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
            {chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 min-h-[500px] flex flex-col justify-end p-8 sm:p-12"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${ch.placeholderGradient} opacity-60 z-0`} />
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

  return (
    <section ref={containerRef} className="relative bg-[#0d180b] text-white">
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
            const isCurrent = idx === activeChapterIndex;
            const isPast = activeChapterIndex > idx;
            const isFuture = activeChapterIndex < idx;

            // Chapter local progress (0 to 1 inside chapter slice)
            const localProgress = Math.min(
              1,
              Math.max(0, (progress - ch.start) / (ch.end - ch.start))
            );

            // Ken Burns slow zoom: 1.0 -> 1.12
            const scale = 1.0 + 0.12 * localProgress;

            // Smooth circle wipe transition into scene idx (> 0)
            // When user enters this chapter, circle expands from 0% to 150%
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

            // Parallax: background moves slower than darker gradient overlay
            const bgTranslateY = (localProgress - 0.5) * -20;
            const overlayTranslateY = (localProgress - 0.5) * 15;

            // Opacity management: only keep active and immediate adjacent scenes visible
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
                {/* Safe gradient placeholder background */}
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

                  {/* Ambient subtle loop on Chapter 05 (Storage) */}
                  {ch.hasVideoLoop && idx === activeChapterIndex && (
                    <video
                      src="/videos/verdalia-final.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none"
                    />
                  )}
                </div>

                {/* Parallax Gradient Overlay Layer (Dark bottom for pristine text contrast) */}
                <div
                  className="absolute inset-0 z-10 pointer-events-none will-change-transform"
                  style={{
                    transform: `translateY(${overlayTranslateY}px)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30" />
                  <div className="absolute inset-0 bg-[#0d180b]/35 mix-blend-multiply" />
                </div>

                {/* Chapter 07: SVG Animated Maritime Shipping Route */}
                {ch.id === "delivery" && isCurrent && (
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4">
                    <svg
                      viewBox="0 0 1000 600"
                      className="w-full h-full max-w-5xl opacity-90 drop-shadow-[0_0_15px_rgba(201,162,39,0.5)]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Tunisia Origin Ports (Radès & Sousse) */}
                      <g className="animate-pulse">
                        <circle cx="480" cy="310" r="8" fill="#C9A227" />
                        <circle cx="480" cy="310" r="18" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.5" />
                        <circle cx="490" cy="340" r="7" fill="#C9A227" />
                        <circle cx="490" cy="340" r="16" stroke="#C9A227" strokeWidth="1.5" strokeOpacity="0.5" />
                      </g>

                      {/* Port Labels */}
                      <text x="505" y="315" fill="#FFFFFF" fontSize="13" fontWeight="600" letterSpacing="1">
                        PORT DE RADÈS
                      </text>
                      <text x="515" y="345" fill="#FFFFFF" fontSize="13" fontWeight="600" letterSpacing="1">
                        PORT DE SOUSSE
                      </text>

                      {/* Route 1: North Mediterranean / France & Italy */}
                      <path
                        d="M 480 310 Q 420 180 360 110"
                        stroke="#C9A227"
                        strokeWidth="2.5"
                        strokeDasharray="400"
                        strokeDashoffset={400 * (1 - routeProgress)}
                        strokeLinecap="round"
                      />
                      {routeProgress > 0.4 && (
                        <g>
                          <circle cx="360" cy="110" r="6" fill="#C9A227" />
                          <text x="375" y="115" fill="#E5E7EB" fontSize="11" letterSpacing="1">EUROPE (GENOA/MARSEILLE)</text>
                        </g>
                      )}

                      {/* Route 2: Western Mediterranean & Atlantic */}
                      <path
                        d="M 480 310 Q 280 260 120 220"
                        stroke="#C9A227"
                        strokeWidth="2.5"
                        strokeDasharray="450"
                        strokeDashoffset={450 * (1 - routeProgress)}
                        strokeLinecap="round"
                      />
                      {routeProgress > 0.5 && (
                        <g>
                          <circle cx="120" cy="220" r="6" fill="#C9A227" />
                          <text x="135" y="225" fill="#E5E7EB" fontSize="11" letterSpacing="1">AMERICAS & ATLANTIC</text>
                        </g>
                      )}

                      {/* Route 3: Eastern Mediterranean & Middle East */}
                      <path
                        d="M 490 340 Q 680 340 850 310"
                        stroke="#C9A227"
                        strokeWidth="2.5"
                        strokeDasharray="450"
                        strokeDashoffset={450 * (1 - routeProgress)}
                        strokeLinecap="round"
                      />
                      {routeProgress > 0.6 && (
                        <g>
                          <circle cx="850" cy="310" r="6" fill="#C9A227" />
                          <text x="730" y="295" fill="#E5E7EB" fontSize="11" letterSpacing="1">MIDDLE EAST / GCC</text>
                        </g>
                      )}

                      {/* Route 4: Global Asia & Pacific */}
                      <path
                        d="M 490 340 Q 720 420 920 450"
                        stroke="#C9A227"
                        strokeWidth="2.5"
                        strokeDasharray="500"
                        strokeDashoffset={500 * (1 - routeProgress)}
                        strokeLinecap="round"
                      />
                      {routeProgress > 0.75 && (
                        <g>
                          <circle cx="920" cy="450" r="7" fill="#C9A227" className="animate-ping" />
                          <circle cx="920" cy="450" r="6" fill="#C9A227" />
                          <text x="790" y="475" fill="#C9A227" fontSize="12" fontWeight="700" letterSpacing="1.5">
                            45+ GLOBAL MARKETS
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
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

          <div className="flex items-center gap-3 text-xs tracking-wider font-mono text-white/70 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
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
                      ? "opacity-100 translate-x-0 bg-black/80 text-white border border-verdalia-gold/30 shadow-lg"
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
