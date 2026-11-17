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
          ar: "مزارع الزيتون العريقة",
          es: "Los Olivares",
          it: "Gli Uliveti",
        },
        desc: {
          en: "Centuries-old groves across Tunisia bathed in Mediterranean sun and fertile coastal soils.",
          fr: "Des oliveraies séculaires à travers la Tunisie, bercées par le soleil méditerranéen.",
          ar: "أشجار زيتون عريقة في ربوع تونس تنعم بشمس البحر الأبيض المتوسط والتربة الخصبة.",
          es: "Olivares centenarios en Túnez bajo el sol mediterráneo y tierras fértiles.",
          it: "Uliveti secolari in Tunisia baciati dal sole mediterraneo e da terreni fertili.",
        },
      },
      {
        id: "harvest",
        number: 2,
        icon: Wheat,
        start: 0.14,
        end: 0.28,
        title: {
          en: "Hand-Picked Harvest",
          fr: "La Récolte Manuelle",
          ar: "موسم الجني اليدوي",
          es: "La Cosecha Manual",
          it: "La Raccolta a Mano",
        },
        desc: {
          en: "Harvested at peak fruit maturity to preserve polyphenol integrity and vibrant green notes.",
          fr: "Cueillies avec soin à maturité optimale pour préserver une haute teneur en polyphénols.",
          ar: "جني يدوي دقيق في مرحلة النضج المثالية للحفاظ على أعلى مستويات البوليفينول الطبيعي.",
          es: "Cosechadas a mano en madurez óptima para asegurar la máxima riqueza en polifenoles.",
          it: "Raccolte a mano a maturazione ottimale per garantire un alto contenuto di polifenoli.",
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
          ar: "العصر الآلي على البارد",
          es: "Extracción en Frío",
          it: "Estrazione a Freddo",
        },
        desc: {
          en: "Continuous extraction within 24 hours strictly below 27°C to lock in purity and flavor.",
          fr: "Extraction continue en moins de 24h sous 27°C, préservant la fraîcheur aromatique.",
          ar: "عصر ميكانيكي مستمر في أقل من 24 ساعة تحت 27 درجة مئوية لضمان النقاء والنكهة الفائقة.",
          es: "Extracción continua en menos de 24h por debajo de 27°C para conservar toda la pureza.",
          it: "Estrazione continua entro 24 ore sotto i 27°C per preservare purezza e freschezza.",
        },
      },
      {
        id: "filtration",
        number: 4,
        icon: Filter,
        start: 0.42,
        end: 0.56,
        title: {
          en: "Precision Filtration",
          fr: "Filtration & Clarification",
          ar: "الفلترة والتنقية الدقيقة",
          es: "Filtración de Precisión",
          it: "Filtrazione di Precisione",
        },
        desc: {
          en: "Rigorous clarification ensuring crystal clarity and chemical stability for sea voyages.",
          fr: "Clarification méticuleuse assurant une limpidité cristalline et une stabilité longue durée.",
          ar: "تنقية دقيقة تضمن صفاء الزيت وثباته الكيميائي والفيزيائي طوال مسارات الشحن البحري.",
          es: "Clarificación rigurosa garantizando transparencia cristalina y máxima estabilidad.",
          it: "Chiarificazione rigorosa per garantire limpidezza cristallina e stabilità a lungo termine.",
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
          ar: "التخزين المعزول بالنيتروجين",
          es: "Almacenamiento con Nitrógeno",
          it: "Stoccaggio in Azoto Inerte",
        },
        desc: {
          en: "Temperature-controlled stainless steel tanks shielded under nitrogen to prevent oxidation.",
          fr: "Citernes inox thermo-régulées saturées d'azote inerte pour stopper toute oxydation.",
          ar: "خزانات فولاذية مقاومة للصدأ معزولة بالكامل بغاز النيتروجين الخامل لمنع الأكسدة تماماً.",
          es: "Tanques de acero inoxidable termorregulados con nitrógeno para evitar la oxidación.",
          it: "Cisterne in acciaio inox termoregolate e inertizzate con azoto contro ogni ossidazione.",
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
          fr: "Conditionnement Vrac Sécurisé",
          ar: "التعبئة الصناعية الآمنة",
          es: "Envasado a Granel",
          it: "Confezionamento Sfuso",
        },
        desc: {
          en: "Food-grade 24,000L flexitanks, 1,000L IBC totes, and 208L sealed steel drums.",
          fr: "Flexitanks certifiés 24 000L, conteneurs IBC 1 000L et fûts scellés 208L pour l'export.",
          ar: "حاويات فليكسي تانك غذائية 24,000 لتر، وخزانات IBC سعة 1,000 لتر وبراميل فولاذية 208 لتر.",
          es: "Flexitanks de 24.000L, contenedores IBC de 1.000L y bidones de acero de 208L.",
          it: "Flexitank certificati da 24.000L, cisterne IBC da 1.000L e fusti sigillati da 208L.",
        },
      },
      {
        id: "delivery",
        number: 7,
        icon: Ship,
        start: 0.85,
        end: 1.0,
        title: {
          en: "Global Maritime Delivery",
          fr: "Expédition Maritime Mondiale",
          ar: "الشحن البحري الدولي",
          es: "Envío Marítimo Global",
          it: "Spedizione Marittima Globale",
        },
        desc: {
          en: "Fast vessel loading from Radès and Sousse ports serving 45+ international markets.",
          fr: "Départ direct des ports de Radès et Sousse vers plus de 45 destinations mondiales.",
          ar: "انطلاق بحري سريع ومباشر من ميناءي رادس وسوسة نحو أكثر من 45 وجهة دولية حول العالم.",
          es: "Embarque rápido desde los puertos de Radès y Sousse hacia más de 45 países.",
          it: "Spedizione rapida dai porti di Radès e Sousse verso oltre 45 mercati internazionali.",
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
