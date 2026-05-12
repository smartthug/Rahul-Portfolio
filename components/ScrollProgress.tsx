"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] h-px w-full origin-left bg-red"
      style={{
        scaleX,
        boxShadow: "0 0 12px rgba(235,89,57,0.65)",
      }}
    />
  );
}
