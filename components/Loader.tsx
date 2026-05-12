"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;

export default function Loader({
  onDone,
}: {
  onDone?: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    const total = 2600;
    let raf = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / total);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(() => onDone?.(), 1100);
        }, 240);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-cream-50 text-ink-950"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease }}
        >
          <div className="flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/70">
              Rahul · Full Stack Developer
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/45">
              v. 2026
            </span>
          </div>

          <div className="flex flex-1 items-end px-6 pb-12 md:px-10 md:pb-16">
            <div className="flex w-full items-end justify-between">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease }}
                className="display text-[24vw] leading-[0.82] md:text-[18vw]"
              >
                <span className="inline-block text-ink-950/30">start </span>
                <span className="inline-block">{progress}%</span>
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="font-mono mb-6 hidden text-[11px] uppercase tracking-[0.3em] text-ink-950/55 md:mb-10 md:inline"
              >
                preparing the experience
              </motion.span>
            </div>
          </div>

          <div className="relative h-px w-full bg-ink-950/10">
            <motion.div
              className="absolute left-0 top-0 h-px bg-red"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between px-6 pb-8 pt-5 md:px-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-950/45">
              © Rahul · Independent Freelancer
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-950/45">
              Available for freelance · 2026
            </span>
          </div>

          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.9, ease }}
            style={{ transformOrigin: "bottom" }}
            className="absolute inset-0 bg-ink-950"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
