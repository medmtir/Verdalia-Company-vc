"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  TreePine,
  Wheat,
  Droplets,
  Filter,
  ShieldCheck,
  Container,
  Ship,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface JourneyChapter {
  id: string;
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  start: number;
  end: number;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [progress, setProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReducedMotionState, setIsReducedMotionState] = useState(false);

  // Fallback check for prefers-reduced-motion
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
        end: 0.14,
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
        start: 0.14,
        end: 0.28,
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
        start: 0.28,
        end: 0.42,
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
        start: 0.42,
        end: 0.56,
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
          it: "Filtrazione di precisione e analisi di laboratorio per lotto verificando purezza e norme COI.",
        },
      },
      {
        id: "storage",
        number: 5,
        icon: ShieldCheck,
        start: 0.56,
        end: 0.7,
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
        start: 0.7,
        end: 0.85,
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
        start: 0.85,
        end: 1.0,
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

  // Setup GSAP ScrollTrigger for pinned scrub
  useEffect(() => {
    if (isReducedMotionState) return;

    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    const container = containerRef.current;
    const pin = pinRef.current;

    if (!container || !pin || !video) return;

    // Check screen width for lighter scroll distance on mobile
    const isMobile = window.innerWidth < 768;
    const scrollDistance = isMobile ? "+=350%" : "+=550%";

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: scrollDistance,
      pin: pin,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: isMobile ? 0.3 : 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        // Update video current time smoothly
        if (video && video.duration && !isNaN(video.duration)) {
          const targetTime = p * video.duration;
          // Guard against out of bounds
          video.currentTime = Math.min(Math.max(targetTime, 0), video.duration);
        }

        // Determine active chapter based on progress range
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

  // Click on a chapter step to smoothly scroll directly to it
  const handleStepClick = (index: number) => {
    if (isReducedMotionState) {
      setActiveChapterIndex(index);
      return;
    }

    const st = scrollTriggerRef.current;
    if (!st) return;

    const targetProgress = chapters[index].start + 0.02;
    const scrollTarget = st.start + targetProgress * (st.end - st.start);

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const CurrentIcon = currentChapter.icon;

  const currentTitle =
    currentChapter.title[locale as keyof typeof currentChapter.title] ||
    currentChapter.title.en;
  const currentDesc =
    currentChapter.desc[locale as keyof typeof currentChapter.desc] ||
    currentChapter.desc.en;

  // Reduced motion alternative: standard video with chapter cards below
  if (isReducedMotionState) {
    return (
      <section className="py-20 bg-[#142611] text-white border-y border-verdalia-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-verdalia-gold">
              {locale === "fr"
                ? "Du Terroir aux Ports Mondiaux"
                : locale === "ar"
                ? "من مزارع تونس إلى موانئ العالم"
                : "From Grove to Global Ports"}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mt-2">
              {locale === "fr"
                ? "L'Odyssée de l'Huile Verdalia"
                : locale === "ar"
                ? "رحلة زيت الزيتون فيرداليا"
                : "The Verdalia Olive Oil Journey"}
            </h2>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-verdalia-gold/30 bg-black aspect-video max-w-5xl mx-auto mb-12">
            <video
              src="/videos/verdalia-final.mp4"
              poster="/images/facility/storage-tanks.jpg"
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {chapters.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-verdalia-gold/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-verdalia-gold/20 text-verdalia-gold font-bold text-xs flex items-center justify-center">
                      0{ch.number}
                    </span>
                    <Icon className="w-5 h-5 text-verdalia-gold" />
                    <h3 className="font-serif text-base font-bold text-white">
                      {ch.title[locale as keyof typeof ch.title] || ch.title.en}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {ch.desc[locale as keyof typeof ch.desc] || ch.desc.en}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Scroll-driven pinned cinematic experience
  return (
    <section ref={containerRef} className="relative bg-[#101E0E] text-white">
      {/* 100vh Pinned Viewport Container */}
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Background Scrub Video Layer */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src="/videos/verdalia-final.mp4"
            poster="/images/facility/storage-tanks.jpg"
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedMetadata={() => setIsVideoReady(true)}
            className="w-full h-full object-cover"
          />
          {/* Multi-layered cinematic scrim overlays for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-[#142611]/30 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Top Header Bar inside pinned screen */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-verdalia-gold animate-pulse shadow-[0_0_8px_#C9A227]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-verdalia-gold">
              {locale === "fr"
                ? "L'Odyssée de l'Huile Verdalia"
                : locale === "ar"
                ? "رحلة زيت الزيتون فيرداليا"
                : "The Verdalia Olive Oil Journey"}
            </span>
          </div>

          {/* Sound & Controls Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs">
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="text-white/80 hover:text-verdalia-gold transition-colors flex items-center gap-1.5"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-verdalia-gold" />
              )}
              <span className="hidden sm:inline text-[11px] font-medium">
                {isMuted ? "Muted" : "Audio On"}
              </span>
            </button>
            <span className="text-white/30">•</span>
            <span className="text-[11px] text-white/70 font-mono">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* Center/Lower Chapter Storytelling Card with Smooth Transitions */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full pb-8 sm:pb-12 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black/65 backdrop-blur-xl border border-verdalia-gold/30 rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              {/* Chapter Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verdalia-gold/15 border border-verdalia-gold/40 text-verdalia-gold text-xs font-bold uppercase tracking-wider mb-3">
                <CurrentIcon className="w-3.5 h-3.5" />
                <span>
                  {locale === "fr"
                    ? `Étape 0${currentChapter.number} / 07`
                    : locale === "ar"
                    ? `المرحلة 0${currentChapter.number} / 07`
                    : `Chapter 0${currentChapter.number} of 07`}
                </span>
              </div>

              {/* Chapter Title */}
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-3">
                {currentTitle}
              </h3>

              {/* Chapter Short Sentence */}
              <p className="text-sm sm:text-base text-gray-200/90 font-light leading-relaxed max-w-2xl mx-auto">
                {currentDesc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Interactive 7-Step Progress Bar */}
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
            {/* Step Indicators */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
              {chapters.map((ch, idx) => {
                const isActive = activeChapterIndex === idx;
                const isPassed = activeChapterIndex > idx;
                const StepIcon = ch.icon;

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleStepClick(idx)}
                    className={`group relative flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-verdalia-gold/20 text-verdalia-gold scale-105 shadow-[0_0_15px_rgba(201,162,39,0.3)]"
                        : isPassed
                        ? "text-white/80 hover:text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                    title={ch.title[locale as keyof typeof ch.title] || ch.title.en}
                  >
                    {/* Step bar fill */}
                    <div className="w-full h-1 sm:h-1.5 rounded-full bg-white/20 overflow-hidden mb-1.5">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isActive || isPassed
                            ? "bg-verdalia-gold w-full"
                            : "w-0"
                        }`}
                      />
                    </div>

                    {/* Step Icon + Number */}
                    <div className="flex items-center gap-1">
                      <StepIcon className="w-3 h-3 hidden sm:inline" />
                      <span className="text-[10px] sm:text-xs font-bold font-mono">
                        0{ch.number}
                      </span>
                    </div>

                    {/* Desktop Tooltip on hover */}
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-black/85 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-20 border border-white/10 hidden md:block">
                      {ch.title[locale as keyof typeof ch.title] || ch.title.en}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Hint */}
            <p className="text-[11px] text-white/50 tracking-wider uppercase mt-3 text-center">
              {locale === "fr"
                ? "Faites défiler pour explorer le voyage ou cliquez sur une étape"
                : locale === "ar"
                ? "مرر للأسفل لاكتشاف المسار أو اضغط على إحدى المراحل"
                : "Scroll to navigate the journey or click any chapter"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
