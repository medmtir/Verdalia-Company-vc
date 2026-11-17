"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";

interface RealJourneyStage {
  id: string;
  number: number;
  desktopSrc: string;
  mobileSrc: string;
  name: string;
  caption: string;
}

const REAL_STAGES: RealJourneyStage[] = [
  {
    id: "grove-tree",
    number: 1,
    desktopSrc: "/images/journey/01-groves-desktop.jpg",
    mobileSrc: "/images/journey/01-groves-mobile.jpg",
    name: "Oliveraies Tunisiennes",
    caption: "Arbres séculaires & récolte locale",
  },
  {
    id: "harvest-mill",
    number: 2,
    desktopSrc: "/images/journey/02-harvest-desktop.jpg",
    mobileSrc: "/images/journey/02-harvest-mobile.jpg",
    name: "Récolte & Entrée Moulin",
    caption: "Olives fraîches vers l'extraction",
  },
  {
    id: "cold-extraction",
    number: 3,
    desktopSrc: "/images/journey/03-extraction-desktop.jpg",
    mobileSrc: "/images/journey/03-extraction-mobile.jpg",
    name: "Extraction à Froid",
    caption: "Écoulement continu d'huile d'olive extra vierge",
  },
  {
    id: "tank-flexitank",
    number: 4,
    desktopSrc: "/images/facility/storage-tanks.jpg",
    mobileSrc: "/images/facility/storage-tanks.jpg",
    name: "Cuves Inox & Flexitanks 24 000L",
    caption: "Stockage sous azote inerte & empotage vrac",
  },
  {
    id: "port-logistics",
    number: 5,
    desktopSrc: "/images/facility/port-containers.jpg",
    mobileSrc: "/images/facility/port-containers.jpg",
    name: "Logistique Portuaire (Radès & Sousse)",
    caption: "Chargement conteneurs export aux terminaux",
  },
  {
    id: "cargo-ship",
    number: 6,
    desktopSrc: "/images/journey/07-delivery-desktop.jpg",
    mobileSrc: "/images/journey/07-delivery-mobile.jpg",
    name: "Expédition Maritime Mondiale",
    caption: "Cargos en mer vers 45+ marchés internationaux",
  },
];

export const OliveJourney: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const [progress, setProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isReducedMotionState, setIsReducedMotionState] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotionState(mediaQuery.matches || Boolean(shouldReduceMotion));

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotionState(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [shouldReduceMotion]);

  // Subtle interactive 3D mouse tilt on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotionState || window.innerWidth < 768) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 10;
    const y = ((clientY - top) / height - 0.5) * -10;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // GSAP ScrollTrigger pinned scrub (~600vh total)
  useEffect(() => {
    if (isReducedMotionState) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const count = REAL_STAGES.length;
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=500%",
      pin: pin,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.35,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        const stageIndex = Math.min(
          count - 1,
          Math.max(0, Math.floor(p * count))
        );
        setActiveStageIndex(stageIndex);
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [isReducedMotionState]);

  // Click on indicator dot to fly directly to that real stage
  const handleJumpToStage = (index: number) => {
    if (isReducedMotionState) {
      setActiveStageIndex(index);
      return;
    }

    const st = scrollTriggerRef.current;
    if (!st) return;

    const count = REAL_STAGES.length;
    const targetProgress = (index + 0.05) / count;
    const scrollTarget = st.start + targetProgress * (st.end - st.start);

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const currentStage = REAL_STAGES[activeStageIndex] || REAL_STAGES[0];
  const totalStages = REAL_STAGES.length;

  // Normalized local progress in active stage (0.0 -> 1.0)
  const slotSize = 1 / totalStages;
  const currentLocalProgress = Math.min(
    1,
    Math.max(
      0,
      (progress - activeStageIndex * slotSize) / slotSize
    )
  );

  // Reduced motion alternative: static gallery showcase
  if (isReducedMotionState) {
    return (
      <section className="bg-[#0b1609] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center mb-10">
            <Image
              src="/images/verdalia-logo.png"
              alt="Verdalia Company"
              width={160}
              height={50}
              className="h-10 w-auto brightness-0 invert opacity-90 drop-shadow"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REAL_STAGES.map((s) => (
              <div
                key={s.id}
                className="relative aspect-video rounded-2xl overflow-hidden border border-verdalia-gold/20 shadow-2xl"
              >
                <img
                  src={s.desktopSrc}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs uppercase tracking-widest text-verdalia-gold font-semibold">
                    0{s.number} · {s.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative bg-black text-white">
      {/* 100vh Pinned Viewport Container - Edge-to-Edge Pure Visual Experience */}
      <div
        ref={pinRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none"
      >
        {/* ====================================================
            FULL-BLEED CINEMATIC CAMERA ZOOM & DISSOLVE STACK
            Real footage from the tree to the cargo ship at sea
            ==================================================== */}
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-black transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {REAL_STAGES.map((stage, idx) => {
            const isFirst = idx === 0;
            const stageStart = idx * slotSize;

            const localProgress = Math.min(
              1,
              Math.max(0, (progress - stageStart) / slotSize)
            );

            // Compute Opacity & Deep Camera Zoom-In (flying into the real scene)
            let opacity = 0;
            let scale = 1.0 + 0.3 * localProgress;

            if (idx === activeStageIndex) {
              if (localProgress > 0.8 && idx < totalStages - 1) {
                // Cross-dissolve out into next stage while continuing forward zoom
                opacity = 1 - (localProgress - 0.8) / 0.2;
                scale = 1.24 + 0.12 * ((localProgress - 0.8) / 0.2);
              } else {
                opacity = 1;
              }
            } else if (idx === activeStageIndex + 1) {
              // Next stage seamlessly emerging
              const prevStart = (idx - 1) * slotSize;
              const prevLocal = Math.min(
                1,
                Math.max(0, (progress - prevStart) / slotSize)
              );
              if (prevLocal > 0.8) {
                opacity = (prevLocal - 0.8) / 0.2;
                scale = 1.0 + 0.05 * opacity;
              }
            } else if (isFirst && progress < stageStart) {
              opacity = 1;
              scale = 1.0;
            }

            const isNearActive =
              Math.abs(idx - activeStageIndex) <= 1 ||
              (isFirst && activeStageIndex === 0);

            if (!isNearActive && opacity === 0) {
              return null;
            }

            return (
              <div
                key={stage.id}
                className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
                style={{
                  zIndex: idx + 1,
                  opacity,
                  transition: "opacity 0.2s linear",
                }}
              >
                {/* 100% Full-Bleed Real Image with Continuous Camera Zoom */}
                <div
                  className="absolute inset-0 w-full h-full will-change-transform"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <picture className="w-full h-full block">
                    <source media="(max-width: 767px)" srcSet={stage.mobileSrc} />
                    <source media="(min-width: 768px)" srcSet={stage.desktopSrc} />
                    <img
                      src={stage.desktopSrc}
                      alt={stage.name}
                      loading={idx < 2 ? "eager" : "lazy"}
                      decoding={idx < 2 ? "sync" : "async"}
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>
                </div>

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 pointer-events-none" />
                <div className="absolute inset-0 bg-[#142611]/10 mix-blend-color-burn pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* ====================================================
            CONTINUOUS 3D SCROLL MOTION OVERLAYS
            Olive falling -> oil flowing -> container loading -> ship cutting waves
            ==================================================== */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4">
          {/* Stage 1 -> 2: Real Olive Falling from the Tree into the Mill */}
          {activeStageIndex <= 1 && (
            <div
              className="absolute transition-transform will-change-transform"
              style={{
                top: `${20 + (activeStageIndex === 0 ? currentLocalProgress * 40 : 40 + currentLocalProgress * 40)}%`,
                transform: `rotate(${progress * 720}deg) scale(${
                  activeStageIndex === 0 ? 0.9 + currentLocalProgress * 0.4 : 1.3 - currentLocalProgress * 0.5
                })`,
                opacity: progress < 0.28 ? (progress < 0.25 ? 1 : 1 - (progress - 0.25) / 0.03) : 0,
              }}
            >
              {/* 3D Glossy Ripe Olive */}
              <div className="w-12 h-16 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-br from-[#4d6d2a] via-[#2f4a1a] to-[#18290c] shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_-3px_-5px_10px_rgba(0,0,0,0.8),inset_3px_5px_8px_rgba(255,255,255,0.45)] border border-[#648e3a]/40 relative">
                <div className="w-2.5 h-5 rounded-full bg-white/45 blur-[0.5px] mt-2 ml-2 rotate-[-20deg]" />
              </div>
            </div>
          )}

          {/* Stage 3 -> 4: Golden Liquid Oil Stream Filling Storage & Flexitank */}
          {activeStageIndex === 2 && (
            <div className="absolute flex flex-col items-center">
              <div
                className="w-2 bg-gradient-to-b from-[#FFF2B2] via-verdalia-gold to-[#8B6E16] rounded-full shadow-[0_0_25px_#C9A227] transition-all"
                style={{
                  height: `${Math.max(20, currentLocalProgress * 160)}px`,
                }}
              />
              <div
                className="w-10 h-10 rounded-full bg-verdalia-gold/40 animate-ping shadow-[0_0_30px_#C9A227]"
              />
            </div>
          )}

          {/* Stage 6: Mediterranean Sea Shipping Waves cutting the water */}
          {activeStageIndex === 5 && (
            <div className="absolute inset-x-0 bottom-16 flex items-center justify-center opacity-85">
              <svg width="600" height="70" viewBox="0 0 600 70" fill="none" className="max-w-xl w-full">
                <path
                  d="M 20 45 Q 150 20 300 45 T 580 45"
                  stroke="#C9A227"
                  strokeWidth="2.5"
                  strokeDasharray="400"
                  strokeDashoffset={400 * (1 - currentLocalProgress)}
                  strokeLinecap="round"
                />
                <path
                  d="M 50 55 Q 180 35 300 55 T 550 55"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                  strokeDasharray="300"
                  strokeDashoffset={300 * (1 - currentLocalProgress)}
                />
              </svg>
            </div>
          )}
        </div>

        {/* ====================================================
            MINIMAL FLOATING TOP BRAND EMBLEM (Verdalia Logo)
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-7 sm:pt-9 w-full flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            <Image
              src="/images/verdalia-logo.png"
              alt="Verdalia Company"
              width={110}
              height={32}
              priority
              className="h-6 sm:h-7 w-auto object-contain brightness-0 invert opacity-95"
            />
            <span className="hidden sm:inline-block w-px h-3.5 bg-white/20" />
            <span className="hidden sm:inline-block text-[10px] tracking-[0.28em] uppercase text-verdalia-gold font-bold">
              Olive Journey
            </span>
          </div>

          {/* Minimal Stage Counter */}
          <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono tracking-widest text-white/90 shadow-md">
            <span className="text-verdalia-gold font-bold">
              0{currentStage.number}
            </span>
            <span className="text-white/30">/</span>
            <span>0{totalStages}</span>
          </div>
        </div>

        {/* ====================================================
            DISCREET FLOATING BOTTOM CAPTION PILL
            (Pure visual immersion — no blocking text boxes)
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12 w-full flex items-end justify-between pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-2xl"
            >
              <span className="w-2 h-2 rounded-full bg-verdalia-gold animate-pulse shadow-[0_0_8px_#C9A227]" />
              <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
                {currentStage.name}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-[11px] sm:text-xs text-verdalia-gold font-medium tracking-wider">
                {currentStage.caption}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Discreet Scroll Prompt */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/60 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            <span>SCROLL TO ADVANCE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-verdalia-gold animate-ping" />
          </div>
        </div>

        {/* ====================================================
            SLIM INTERACTIVE PROGRESS RAIL
            ==================================================== */}
        {/* Desktop Vertical Rail */}
        <div
          className="hidden md:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
          role="tablist"
          aria-label="Olive Oil Real Journey"
        >
          {REAL_STAGES.map((s, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={s.id}
                onClick={() => handleJumpToStage(idx)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Jump to stage 0${s.number}: ${s.name}`}
                className={`transition-all duration-300 rounded-full flex items-center justify-center focus:outline-none ${
                  isActive
                    ? "w-3 h-8 bg-verdalia-gold shadow-[0_0_12px_#C9A227]"
                    : "w-3 h-3 bg-white/35 hover:bg-white/75 hover:scale-110"
                }`}
              />
            );
          })}
        </div>

        {/* Mobile Horizontal Rail */}
        <div
          className="flex md:hidden items-center justify-center gap-2 pb-3 z-30 pointer-events-auto"
          role="tablist"
          aria-label="Olive Oil Real Journey Mobile"
        >
          {REAL_STAGES.map((s, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={s.id}
                onClick={() => handleJumpToStage(idx)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Jump to stage 0${s.number}`}
                className={`transition-all duration-300 rounded-full focus:outline-none ${
                  isActive
                    ? "w-6 h-1.5 bg-verdalia-gold shadow-[0_0_8px_#C9A227]"
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
