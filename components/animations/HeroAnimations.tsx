"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface HeroBackgroundParallaxProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroBackgroundParallax: React.FC<HeroBackgroundParallaxProps> = ({
  children,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Gentle parallax: as user scrolls down the first 800px, shift the background down slightly
  const y = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 120]);
  const scale = useTransform(scrollY, [0, 800], [1.06, shouldReduceMotion ? 1 : 1.12]);

  return (
    <motion.div
      style={{ y, scale }}
      className={`absolute inset-0 z-0 origin-center will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface HeroSplitLineProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const HeroSplitLine: React.FC<HeroSplitLineProps> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`overflow-hidden inline-block ${className}`}>
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0.3 : 0.85,
          delay,
          ease: [0.16, 1, 0.3, 1], // luxury custom cubic bezier
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
