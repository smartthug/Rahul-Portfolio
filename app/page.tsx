import ScrollFX from "@/components/ScrollFX";
import SideDots from "@/components/SideDots";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Corridor from "@/components/sections/Corridor";
import Projects from "@/components/sections/Projects";
import Desktop from "@/components/sections/Desktop";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <ScrollFX />
      <SideDots />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Corridor />
        <Projects />
        <Desktop />
        <Contact />
      </main>
    </>
  );
}
