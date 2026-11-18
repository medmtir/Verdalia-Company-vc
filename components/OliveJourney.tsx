"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface JourneyStage {
  id: string;
  number: number;
  time: number;
  title: {
    en: string;
    fr: string;
    ar: string;
  };
  tag: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const OliveJourney: React.FC = () => {
  const { locale, dir } = useI18n();
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(10);

  const isScrubbingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const stages: JourneyStage[] = useMemo(
    () => [
      {
        id: "groves",
        number: 1,
        time: 0.0,
        title: {
          en: "Tunisian Groves & Terroir",
          fr: "Oliveraies & Terroir Tunisien",
          ar: "المزارع التونسية العريقة",
        },
        tag: {
          en: "100% Single-Origin",
          fr: "Origine 100% Tunisie",
          ar: "أصل تونسي 100%",
        },
      },
      {
        id: "harvest",
        number: 2,
        time: 1.7,
        title: {
          en: "Careful Harvest & Mill Entry",
          fr: "Récolte & Entrée au Moulin",
          ar: "الجني والفرز الفوري",
        },
        tag: {
          en: "< 0.3% Low Acidity Target",
          fr: "Acidité Minimale < 0.3%",
          ar: "حموضة دنيا < 0.3%",
        },
      },
      {
        id: "extraction",
        number: 3,
        time: 3.5,
        title: {
          en: "Continuous Cold Extraction",
          fr: "Extraction à Froid Continue",
          ar: "عصر ميكانيكي بارد",
        },
        tag: {
          en: "Cold Pressed < 27°C",
          fr: "Pression à Froid < 27°C",
          ar: "عصر بارد أقل من 27°س",
        },
      },
      {
        id: "storage",
        number: 4,
        time: 5.5,
        title: {
          en: "Nitrogen-Inerted Storage",
          fr: "Stockage sous Azote Inerte",
          ar: "تخزين خامل تحت النيتروجين",
        },
        tag: {
          en: "Zero Oxidation Tanks",
          fr: "Cuves Inox Anti-Oxydation",
          ar: "خزانات فولاذية معزولة",
        },
      },
      {
        id: "packaging",
        number: 5,
        time: 7.3,
        title: {
          en: "Bulk Flexitank & IBC Packaging",
          fr: "Empotage Vrac Flexitank & IBC",
          ar: "التعبئة السائبة وفليكسي تانك",
        },
        tag: {
          en: "24,000L FCL / 1,000L IBC",
          fr: "Flexitank 24 000L / IBC",
          ar: "حاويات 24,000 لتر و IBC",
        },
      },
      {
        id: "shipping",
        number: 6,
        time: 9.0,
        title: {
          en: "Maritime Export to 45+ Markets",
          fr: "Export Maritime vers 45+ Pays",
          ar: "شحن بحري دولي نحو 45+ دولة",
        },
        tag: {
          en: "Radès & Sousse Ports",
          fr: "Ports de Radès & Sousse",
          ar: "ميناءا رادس وسوسة",
        },
      },
    ],
    []
  );

  // Initialize video metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 10);
      setIsVideoReady(true);
    }
  };

  // Smooth scroll sync via requestAnimationFrame
  const updateScroll = useCallback(() => {
    if (!containerRef.current || !videoRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScroll = rect.height - windowHeight;

    if (totalScroll <= 0) return;

    // Calculate how far down the section is scrolled (0 to 1)
    const scrolled = Math.max(0, Math.min(1, -rect.top / totalScroll));
    setProgress(scrolled);

    // Only scrub if the user is in scroll mode (not during manual autoplay)
    if (!isPlaying) {
      const dur = videoRef.current.duration || videoDuration || 10;
      targetTimeRef.current = scrolled * (dur - 0.05);

      // Smooth seek towards targetTime
      const current = videoRef.current.currentTime;
      const diff = targetTimeRef.current - current;

      if (Math.abs(diff) > 0.02) {
        if ("fastSeek" in videoRef.current && typeof (videoRef.current as any).fastSeek === "function") {
          try {
            (videoRef.current as any).fastSeek(targetTimeRef.current);
          } catch {
            videoRef.current.currentTime = targetTimeRef.current;
          }
        } else {
          videoRef.current.currentTime = targetTimeRef.current;
        }
      }
    }

    // Determine active stage
    const currentVideoTime = videoRef.current.currentTime;
    let currentIdx = 0;
    for (let i = stages.length - 1; i >= 0; i--) {
      if (currentVideoTime >= stages[i].time - 0.2) {
        currentIdx = i;
        break;
      }
    }
    setActiveStageIndex(currentIdx);
  }, [isPlaying, stages, videoDuration]);

  // Main scroll & animation loop
  useEffect(() => {
    let ticking = false;

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    // Initial calculation
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateScroll]);

  // Update time when video plays automatically
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || videoDuration || 10;

    if (isPlaying) {
      const p = current / dur;
      setProgress(p);

      let currentIdx = 0;
      for (let i = stages.length - 1; i >= 0; i--) {
        if (current >= stages[i].time - 0.2) {
          currentIdx = i;
          break;
        }
      }
      setActiveStageIndex(currentIdx);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const jumpToStage = (index: number) => {
    if (!containerRef.current || !videoRef.current) return;
    const stage = stages[index];
    if (!stage) return;

    const dur = videoRef.current.duration || videoDuration || 10;
    const targetProgress = Math.min(1, Math.max(0, stage.time / dur));

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const totalScroll = rect.height - window.innerHeight;
    const targetScrollY = scrollTop + targetProgress * totalScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    videoRef.current.currentTime = stage.time;
    setActiveStageIndex(index);
    setProgress(targetProgress);
  };

  const currentStage = stages[activeStageIndex] || stages[0];
  const currentTitle =
    currentStage.title[locale as "en" | "fr" | "ar"] || currentStage.title.en;
  const currentTag =
    currentStage.tag[locale as "en" | "fr" | "ar"] || currentStage.tag.en;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black text-white"
      style={{
        // 320vh height gives enough scroll runway for a smooth 10s video scrubbing experience
        height: "320vh",
      }}
    >
      {/* Sticky Fullscreen 100vw x 100dvh Viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-black"
      >
        {/* Fullscreen Video with dynamic subtle 3D camera zoom on scroll */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden transition-transform duration-300 ease-out"
          style={{
            transform: shouldReduceMotion
              ? "none"
              : `scale(${1 + progress * 0.08})`,
          }}
        >
          <video
            ref={videoRef}
            src="/videos/verdalia-final.mp4"
            poster="/images/facility/storage-tanks.jpg"
            muted={isMuted}
            playsInline
            preload="auto"
            loop
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Subtle cinematic vignette scrim for contrast and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />
        </div>

        {/* =======================================================
            MINIMAL LUXURY HUD OVERLAYS (NO HEAVY TEXT CLUTTER)
            ======================================================= */}

        {/* TOP BAR: Brand Badge & Active Chapter */}
        <header className="absolute top-0 inset-x-0 z-20 px-6 sm:px-12 py-6 sm:py-8 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-verdalia-gold animate-pulse shadow-[0_0_12px_#C9A227]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-white/95 drop-shadow">
              VERDALIA · THE JOURNEY
            </span>
          </div>

          {/* Active Stage Badge */}
          <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs sm:text-sm font-mono tracking-wider shadow-lg">
            <span className="text-verdalia-gold font-bold">
              0{currentStage.number}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-gray-300">0{stages.length}</span>
          </div>
        </header>

        {/* CENTER / BOTTOM FLOATING TITLE: Sleek 1-Line Indicator */}
        <div className="absolute bottom-20 sm:bottom-24 inset-x-6 sm:inset-x-12 z-20 pointer-events-none flex flex-col items-center sm:items-start max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center sm:items-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-verdalia-gold/40 text-verdalia-gold text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2 shadow-md">
                <Sparkles className="w-3 h-3 text-verdalia-gold" />
                <span>
                  {locale === "fr"
                    ? `Étape 0${currentStage.number}`
                    : locale === "ar"
                    ? `المرحلة 0${currentStage.number}`
                    : `Stage 0${currentStage.number}`}{" "}
                  · {currentTag}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] tracking-tight text-center sm:text-left">
                {currentTitle}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM QUICK STAGE NAVIGATION PILLS */}
        <div className="absolute bottom-6 inset-x-6 sm:inset-x-12 z-20 flex items-center justify-between gap-4 pointer-events-auto">
          {/* Stage selector dots / pills */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 scrollbar-none">
            {stages.map((st, idx) => {
              const isActive = idx === activeStageIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => jumpToStage(idx)}
                  className={`group relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none ${
                    isActive
                      ? "bg-verdalia-gold text-verdalia-dark shadow-[0_0_15px_rgba(201,162,39,0.5)] font-bold scale-105"
                      : "bg-black/50 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/75 border border-white/10"
                  }`}
                  aria-label={`Jump to stage ${st.number}`}
                >
                  <span className="font-mono text-[11px]">0{st.number}</span>
                  <span className="hidden md:inline whitespace-nowrap text-[11px] uppercase tracking-wider">
                    {st.title[locale as "en" | "fr" | "ar"]?.split(" ")[0] ||
                      st.title.en.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Video Control Buttons (Play/Pause & Mute) */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-verdalia-gold hover:border-verdalia-gold flex items-center justify-center transition-all shadow-md focus:outline-none"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 translate-x-0.5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-verdalia-gold hover:border-verdalia-gold flex items-center justify-center transition-all shadow-md focus:outline-none"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* BOTTOM FULL-WIDTH HAIRLINE PROGRESS BAR */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 z-30">
          <div
            className="h-full bg-gradient-to-r from-verdalia-gold to-[#f0d068] transition-all duration-75 shadow-[0_0_10px_#C9A227]"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>

        {/* SCROLL HELPER HINT (Only visible at the very beginning) */}
        {progress < 0.08 && (
          <div className="absolute bottom-28 right-6 sm:right-12 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white/80 text-[11px] uppercase tracking-widest font-mono animate-bounce">
            <span>Scroll to explore</span>
            <ChevronDown className="w-3.5 h-3.5 text-verdalia-gold" />
          </div>
        )}
      </div>
    </div>
  );
};
