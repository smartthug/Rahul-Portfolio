"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Connect", href: "#connect" },
];

export default function Navbar() {
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 220], [0, 0.9]);
  const padding = useTransform(scrollY, [0, 220], [22, 14]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-US", opts).format(now) + " IST");
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  // Lock body scroll while menu open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const lenis = (window as unknown as { __lenis?: { stop: () => void } })
        .__lenis;
      lenis?.stop();
      return () => {
        document.body.style.overflow = prev;
        const lenis2 = (window as unknown as { __lenis?: { start: () => void } })
          .__lenis;
        lenis2?.start();
      };
    }
  }, [open]);

  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: 0.2 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundColor: useTransform(
              bgOpacity,
              (v) => `rgba(246,241,232,${v})`
            ) as unknown as string,
            backdropFilter: useTransform(
              scrollY,
              [0, 220],
              ["blur(0px)", "blur(16px)"]
            ) as unknown as string,
          }}
        />

        <motion.nav
          className="mx-auto flex max-w-[1700px] items-center justify-between px-4 sm:px-6 md:px-10"
          style={{ paddingTop: padding, paddingBottom: padding }}
        >
          <a
            href="#top"
            data-cursor="hover"
            className="group flex items-center gap-3"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-ink-950/15 bg-cream-100">
              <Image
                src="/logo.gif"
                alt="Rahul"
                width={36}
                height={36}
                unoptimized
                className="h-full w-full object-cover opacity-90"
              />
            </span>
            <span className="font-display text-base font-extrabold leading-none sm:text-lg">
              rahul<span className="text-red">.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex lg:gap-8">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  data-cursor="hover"
                  className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/80 transition-colors hover:text-ink-950"
                >
                  <span className="text-ink-950/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hover-line">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/55">
              {time}
            </span>
            <a
              href="#connect"
              data-cursor="hover"
              data-cursor-label="Say hi"
              className="group relative inline-flex items-center gap-2 rounded-full border border-ink-950/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950 transition-colors hover:border-red hover:text-red"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red shadow-[0_0_10px_rgba(235,89,57,0.7)]" />
              Open for Freelance
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-cursor="hover"
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-ink-950/20 bg-cream-50 lg:hidden"
          >
            <span className="sr-only">{open ? "Close" : "Menu"}</span>
            <span
              className={`absolute h-px w-4 bg-ink-950 transition-transform duration-300 ${
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-ink-950 transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-ink-950 transition-transform duration-300 ${
                open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 flex flex-col bg-cream-50"
            >
              <div className="h-[68px] sm:h-[76px]" />

              <div className="flex flex-1 flex-col justify-between px-6 pb-10 pt-4 sm:px-8">
                <ul className="flex flex-col">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.li
                      key={item.label}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.18 + i * 0.06,
                        duration: 0.7,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                      className="border-b border-ink-950/12 py-4"
                    >
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline justify-between"
                      >
                        <span className="display text-[14vw] leading-[0.95] tracking-tightest sm:text-[10vw]">
                          {item.label.toLowerCase()}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/45">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between">
                    <a
                      href="mailto:rahuldeva5555@gmail.com"
                      className="font-display text-lg font-extrabold text-ink-950"
                    >
                      rahuldeva5555@gmail.com
                    </a>
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-950/55">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
                      {time}
                    </span>
                  </div>

                  <ul className="grid grid-cols-2 gap-2">
                    {[
                      { label: "GitHub", href: "https://github.com/smartthug" },
                      {
                        label: "LinkedIn",
                        href: "https://www.linkedin.com/in/rahuldeva5/",
                      },
                    ].map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-md border border-ink-950/15 bg-cream-100 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-950/85"
                        >
                          <span>{s.label}</span>
                          <span className="text-red">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
