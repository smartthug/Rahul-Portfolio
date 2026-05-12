"use client";

import { useEffect, useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import SectionTracker from "@/components/SectionTracker";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import WhatIDo from "@/components/sections/WhatIDo";
import Experience from "@/components/sections/Experience";
import ScrollSVG from "@/components/sections/ScrollSVG";
import Clients from "@/components/sections/Clients";
import TechStack from "@/components/sections/TechStack";
import Reel from "@/components/sections/Reel";
import Motto from "@/components/sections/Motto";
import Footer from "@/components/sections/Footer";

export default function Page() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      document.body.style.overflow = "";
      const lenis = (window as unknown as { __lenis?: { start: () => void } })
        .__lenis;
      lenis?.start();
    } else {
      document.body.style.overflow = "hidden";
      const lenis = (window as unknown as { __lenis?: { stop: () => void } })
        .__lenis;
      lenis?.stop();
    }
  }, [ready]);

  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <SectionTracker />
      <Loader onDone={() => setReady(true)} />

      <Navbar />

      <main className="relative">
        <Hero />

        <Marquee
          items={[
            "react",
            "next.js",
            "node",
            "mongodb",
            "java",
            "ai",
            "three.js",
            "tailwind",
          ]}
        />

        <About />

        <WhatIDo />

        <Experience />

        <ScrollSVG />

        <Clients />

        <Marquee
          reverse
          items={[
            "open for freelance",
            "mern · next · ai",
            "based in india",
            "available 2026",
          ]}
        />

        <Reel />

        <TechStack />

        <Motto />

        <Footer />
      </main>
    </SmoothScroll>
  );
}
