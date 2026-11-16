"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-verdalia-gold/70 via-verdalia-gold to-[#f0ca4d] z-50 origin-left pointer-events-none shadow-[0_1px_8px_rgba(201,162,39,0.5)]"
      aria-hidden="true"
    />
  );
};
