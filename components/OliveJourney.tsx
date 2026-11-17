"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion, motion, AnimatePresence } from "framer-motion";

interface OilStage {
  id: string;
  number: number;
  src: string;
  name: string;
  tagline: string;
}

const OIL_STAGES: OilStage[] = [
  {
    id: "droplet",
    number: 1,
    src: "/images/oil3d/stage-01.jpg",
    name: "Pure Essence",
    tagline: "First Cold-Pressed Gold",
  },
  {
    id: "splash",
    number: 2,
    src: "/images/oil3d/stage-02.jpg",
    name: "Crown Impact",
    tagline: "Kinetic Fluidity",
  },
  {
    id: "ribbon",
    number: 3,
    src: "/images/oil3d/stage-03.jpg",
    name: "Liquid Silk",
    tagline: "Unfiltered Viscosity",
  },
  {
    id: "cascade",
    number: 4,
    src: "/images/oil3d/stage-04.jpg",
    name: "Golden Cascade",
    tagline: "Mediterranean Harvest",
  },
  {
    id: "swirl",
    number: 5,
    src: "/images/oil3d/stage-05.jpg",
    name: "Amber Vortex",
    tagline: "Controlled Aeration",
  },
  {
    id: "bottle",
    number: 6,
    src: "/images/oil3d/stage-06.jpg",
    name: "Verdalia Reserve",
    tagline: "Bottled Perfection",
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
    const x = ((clientX - left) / width - 0.5) * 12; // tilt angle
    const y = ((clientY - top) / height - 0.5) * -12;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // GSAP ScrollTrigger pinned scrub across ~500vh
  useEffect(() => {
    if (isReducedMotionState) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const pin = pinRef.current;
    if (!container || !pin) return;

    const count = OIL_STAGES.length;
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

        // Active stage index computation
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

  // Click on indicator dot to fly directly to that 3D oil stage
  const handleJumpToStage = (index: number) => {
    if (isReducedMotionState) {
      setActiveStageIndex(index);
      return;
    }

    const st = scrollTriggerRef.current;
    if (!st) return;

    const count = OIL_STAGES.length;
    const targetProgress = (index + 0.05) / count;
    const scrollTarget = st.start + targetProgress * (st.end - st.start);

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const currentStage = OIL_STAGES[activeStageIndex] || OIL_STAGES[0];
  const totalStages = OIL_STAGES.length;

  // Reduced motion alternative: static gallery showcase
  if (isReducedMotionState) {
    return (
      <section className="bg-[#0c190a] py-16 text-white">
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
            {OIL_STAGES.map((s) => (
              <div
                key={s.id}
                className="relative aspect-video rounded-2xl overflow-hidden border border-verdalia-gold/20 shadow-2xl"
              >
                <img
                  src={s.src}
                  alt={s.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
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
    <section
      ref={containerRef}
      className="relative bg-[#081207] text-white"
    >
      {/* 100vh Pinned Viewport Container - Edge-to-Edge Pure Visual Experience */}
      <div
        ref={pinRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none"
      >
        {/* ====================================================
            CONTINUOUS 3D LIQUID GOLD SCENE STACK
            ==================================================== */}
        <div
          className="absolute inset-0 z-0 overflow-hidden bg-black transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {OIL_STAGES.map((stage, idx) => {
            const isFirst = idx === 0;
            const slotSize = 1 / totalStages;
            const stageStart = idx * slotSize;
            const stageEnd = (idx + 1) * slotSize;

            // Normalized local progress in current stage (0.0 -> 1.0)
            const localProgress = Math.min(
              1,
              Math.max(0, (progress - stageStart) / slotSize)
            );

            // Compute Opacity & Deep Camera Zoom-In
            let opacity = 0;
            let scale = 1.0 + 0.28 * localProgress; // Continuous camera push into the oil

            if (idx === activeStageIndex) {
              if (localProgress > 0.8 && idx < totalStages - 1) {
                // Cross-dissolve out into next stage while continuing forward zoom
                opacity = 1 - (localProgress - 0.8) / 0.2;
                scale = 1.22 + 0.12 * ((localProgress - 0.8) / 0.2);
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

            // Only render active and immediately adjacent transitioning stages
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
                {/* 100% Full-Bleed 3D Liquid Gold Frame */}
                <div
                  className="absolute inset-0 w-full h-full will-change-transform"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <img
                    src={stage.src}
                    alt={stage.name}
                    loading={idx < 2 ? "eager" : "lazy"}
                    decoding={idx < 2 ? "sync" : "async"}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />
                <div className="absolute inset-0 bg-[#142611]/15 mix-blend-color-burn pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* ====================================================
            MINIMAL FLOATING TOP BRAND EMBLEM (Verdalia Logo)
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-7 sm:pt-9 w-full flex items-center justify-between pointer-events-none">
          {/* Logo with luminous subtle sheen */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
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
              3D Fluidity
            </span>
          </div>

          {/* Minimal Numeric Stage Counter */}
          <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono tracking-widest text-white/90 shadow-md">
            <span className="text-verdalia-gold font-bold">
              0{currentStage.number}
            </span>
            <span className="text-white/30">/</span>
            <span>0{totalStages}</span>
          </div>
        </div>

        {/* ====================================================
            DISCREET FLOATING BOTTOM CAPTION PILL
            (No blocking text cards — just minimal luxury subtitle)
            ==================================================== */}
        <div className="relative z-30 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-8 sm:pb-12 w-full flex items-end justify-between pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/55 backdrop-blur-md border border-white/15 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-verdalia-gold animate-pulse shadow-[0_0_8px_#C9A227]" />
              <span className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
                {currentStage.name}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="text-[11px] sm:text-xs text-verdalia-gold font-medium tracking-wider uppercase">
                {currentStage.tagline}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Scroll Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/60 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            <span>SCROLL TO EXPLORE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-verdalia-gold animate-ping" />
          </div>
        </div>

        {/* ====================================================
            SLIM INTERACTIVE PROGRESS RAIL
            Desktop: Sleek vertical dots on right edge
            Mobile: Sleek horizontal bar at bottom edge
            ==================================================== */}
        {/* Desktop Vertical Rail */}
        <div
          className="hidden md:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-auto"
          role="tablist"
          aria-label="3D Oil Journey Sequence"
        >
          {OIL_STAGES.map((s, idx) => {
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
          aria-label="3D Oil Journey Mobile"
        >
          {OIL_STAGES.map((s, idx) => {
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
