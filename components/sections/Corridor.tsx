/** Transition band between About and Projects: two stripes that swing across each other as you scroll. */
export default function Corridor() {
  return (
    <div data-fx aria-hidden className="relative flex h-[32dvh] min-h-[220px] items-center justify-center overflow-hidden bg-[#0a0a0b]">
      <div
        className="absolute left-[-10%] top-[48%] h-9 w-[130%] bg-[#9b1c1c]"
        style={{ transform: "rotate(calc(-12deg + var(--pp) * 16deg))" }}
      />
      <div
        className="absolute left-[-10%] top-[40%] h-7 w-[130%] bg-grape/80"
        style={{ transform: "rotate(calc(12deg - var(--pp) * 18deg))" }}
      />
      <div className="relative text-center" style={{ transform: "translateX(calc((0.5 - var(--pp)) * 40%))" }}>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#ff4d4d]">
          sys_corridor_01 // loading selected work
        </p>
        <p className="mt-2 font-sans text-[clamp(1.2rem,2.4vw,1.7rem)] font-black italic uppercase tracking-tight text-white [text-shadow:2px_2px_0_#000]">
          Compiling real projects...
        </p>
      </div>
    </div>
  );
}
