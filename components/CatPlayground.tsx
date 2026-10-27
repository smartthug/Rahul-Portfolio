"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Pet playground on the hazard-stripe floor under the project cards.
 * - Cats chase a red ball, jump at it and swipe it ("*SWIP!*"); click a cat to pet it.
 * - The ball can be dragged and thrown; it has gravity, bounce and rolling friction.
 * - Widget: count (click = toggle wizard hats), + add cat, − remove cat, dog (scares the cats away).
 * Physics runs in one requestAnimationFrame loop that writes transforms directly
 * (no React re-render per frame) and pauses when the playground is off-screen.
 * With reduced motion the cats sit still and the dog simply sends them home.
 */

const CAT_W = 80;
const CAT_H = 64;
const BALL_R = 20;
const DOG_W = 110;
const DOG_H = 64;
const G = 1600; // gravity, px/s²
const MAX_CATS = 8;

type Cat = {
  id: number;
  x: number;
  y: number; // jump offset (≤ 0)
  vy: number;
  dir: 1 | -1;
  speed: number;
  mode: "chase" | "sit" | "flee";
  modeT: number;
  swipeCD: number;
  walking: boolean;
};

let nextId = 1;

export default function CatPlayground() {
  const areaRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const catEls = useRef(new Map<number, HTMLDivElement>());

  const [catIds, setCatIds] = useState<number[]>(() => [nextId++]);
  const [hats, setHats] = useState(false);
  const [dogOn, setDogOn] = useState(false);

  const sim = useRef({
    W: 800,
    H: 380,
    minX: 110,
    ball: { x: 500, y: 300, vx: 0, vy: 0, rot: 0, drag: false },
    cats: new Map<number, Cat>(),
    dog: { x: -DOG_W, active: false },
    reduced: false,
    ready: false,
  });

  const floorY = () => sim.current.H - 20;

  /* ---------- floating speech bubbles ---------- */
  const bubble = useCallback((text: string, x: number, y: number, tone = "bg-white") => {
    const area = areaRef.current;
    if (!area) return;
    const el = document.createElement("div");
    el.className = `pet-bubble pointer-events-none absolute z-30 whitespace-nowrap border-2 border-black px-1.5 py-0.5 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0_#000] ${tone}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = text;
    el.setAttribute("aria-hidden", "true");
    area.appendChild(el);
    window.setTimeout(() => el.remove(), 1200);
  }, []);

  const makeCat = (id: number, x: number, dropIn: boolean): Cat => ({
    id,
    x,
    y: dropIn ? -220 : 0,
    vy: 0,
    dir: Math.random() < 0.5 ? 1 : -1,
    speed: 90 + Math.random() * 70,
    mode: "chase",
    modeT: 0,
    swipeCD: 0.6,
    walking: false,
  });

  /* ---------- keep simulation cats in sync with React's list ---------- */
  useEffect(() => {
    const s = sim.current;
    for (const id of catIds) {
      if (!s.cats.has(id)) {
        const span = Math.max(1, s.W - s.minX - CAT_W);
        s.cats.set(id, makeCat(id, s.minX + Math.random() * span, s.ready && !s.reduced));
      }
    }
    for (const id of [...s.cats.keys()]) if (!catIds.includes(id)) s.cats.delete(id);
  }, [catIds]);

  /* ---------- size + visibility + main loop ---------- */
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const s = sim.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const r = area.getBoundingClientRect();
      s.W = r.width;
      s.H = r.height;
      const wr = widgetRef.current?.getBoundingClientRect();
      s.minX = wr ? wr.right - r.left + 12 : 110;
      if (!s.ready) {
        s.ball.x = s.minX + (s.W - s.minX) * 0.62;
        s.ball.y = floorY() - BALL_R;
        let k = 0;
        s.cats.forEach((c) => (c.x = s.minX + (s.W - s.minX - CAT_W) * (0.2 + 0.15 * k++)));
        s.ready = true;
      }
      s.ball.x = Math.min(Math.max(s.ball.x, s.minX + BALL_R), s.W - BALL_R);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(area);

    let raf = 0;
    let last = 0;
    let visible = false;

    const step = (t: number) => {
      raf = 0;
      const dt = Math.min(0.033, last ? (t - last) / 1000 : 0.016);
      last = t;
      tick(dt);
      render();
      if (visible && !document.hidden) raf = requestAnimationFrame(step);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) start();
    });
    io.observe(area);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);

    render();
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- physics ---------- */
  const tick = (dt: number) => {
    const s = sim.current;
    const fy = floorY();
    const b = s.ball;

    // ball
    if (!b.drag) {
      b.vy += G * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.y > fy - BALL_R) {
        b.y = fy - BALL_R;
        b.vy = Math.abs(b.vy) < 90 ? 0 : -b.vy * 0.55;
        b.vx *= 1 - Math.min(1, 2.4 * dt);
      }
      if (b.y < BALL_R) {
        b.y = BALL_R;
        b.vy = -b.vy * 0.5;
      }
      if (b.x < s.minX + BALL_R) {
        b.x = s.minX + BALL_R;
        b.vx = Math.abs(b.vx) * 0.7;
      }
      if (b.x > s.W - BALL_R) {
        b.x = s.W - BALL_R;
        b.vx = -Math.abs(b.vx) * 0.7;
      }
      if (Math.abs(b.vx) < 4) b.vx = 0;
    }
    b.rot += (b.vx * dt) / BALL_R;

    // dog
    if (s.dog.active) {
      s.dog.x += 520 * dt;
      if (s.dog.x > s.W + 40) {
        s.dog.active = false;
        setDogOn(false);
      }
    }

    // cats
    const gone: number[] = [];
    for (const c of s.cats.values()) {
      if (c.y < 0 || c.vy !== 0) {
        c.vy += G * dt;
        c.y += c.vy * dt;
        if (c.y >= 0) {
          c.y = 0;
          c.vy = 0;
        }
      }
      c.swipeCD -= dt;
      c.walking = false;

      if (c.mode === "flee") {
        c.x += c.dir * 470 * dt;
        c.walking = true;
        if (c.x > s.W + 20 || c.x < -CAT_W - 20) gone.push(c.id);
        continue;
      }
      if (s.reduced) continue;

      if (c.mode === "sit") {
        c.modeT -= dt;
        if (c.modeT <= 0) c.mode = "chase";
      }

      const cx = c.x + CAT_W / 2;
      const dx = b.x - cx;
      if (c.mode === "chase" && Math.abs(dx) > 30) {
        c.dir = dx > 0 ? 1 : -1;
        c.x += c.dir * c.speed * dt;
        c.walking = c.y === 0;
      }

      // jump at a ball that's falling overhead
      if (c.y === 0 && Math.abs(dx) < 70 && b.y < fy - 110 && b.vy > 0 && Math.random() < 0.05) c.vy = -620;

      // swipe when the paw (front of the head) reaches the ball
      const pawX = cx + c.dir * 26;
      const pawY = fy - 34 + c.y;
      if (c.swipeCD <= 0 && Math.hypot(b.x - pawX, b.y - pawY) < BALL_R + 26 && !b.drag) {
        b.vx = c.dir * (260 + Math.random() * 380);
        b.vy = -(380 + Math.random() * 560);
        c.swipeCD = 0.9 + Math.random() * 0.9;
        bubble("*SWIP!* 🐾", cx, fy - CAT_H - 26 + c.y, "bg-sun");
        if (Math.random() < 0.25) {
          c.mode = "sit";
          c.modeT = 1.2 + Math.random() * 1.4;
        }
      }
      c.x = Math.min(Math.max(c.x, s.minX), s.W - CAT_W);
    }

    // keep cats from stacking exactly on top of each other
    const list = [...s.cats.values()].filter((c) => c.mode !== "flee");
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const d = list[j].x - list[i].x;
        if (Math.abs(d) < 34) {
          const push = (34 - Math.abs(d)) * 0.5 * (d >= 0 ? 1 : -1);
          list[i].x -= push * 0.5;
          list[j].x += push * 0.5;
        }
      }

    if (gone.length) {
      gone.forEach((id) => s.cats.delete(id));
      setCatIds((ids) => ids.filter((id) => !gone.includes(id)));
    }
  };

  const render = () => {
    const s = sim.current;
    const fy = floorY();
    const b = s.ball;
    if (ballRef.current) {
      ballRef.current.style.transform = `translate3d(${b.x - BALL_R}px, ${b.y - BALL_R}px, 0) rotate(${b.rot}rad)`;
    }
    if (dogRef.current) {
      dogRef.current.style.transform = `translate3d(${s.dog.x}px, ${fy - DOG_H + 4}px, 0)`;
    }
    for (const c of s.cats.values()) {
      const el = catEls.current.get(c.id);
      if (!el) continue;
      el.style.transform = `translate3d(${c.x}px, ${fy - CAT_H + 2 + c.y}px, 0)`;
      const inner = el.firstElementChild as HTMLElement | null;
      if (inner) inner.style.transform = `scaleX(${c.dir})`;
      el.classList.toggle("pet-walking", c.walking);
    }
  };

  /* ---------- interactions ---------- */
  const addCat = () => setCatIds((ids) => (ids.length >= MAX_CATS ? ids : [...ids, nextId++]));

  const removeCat = () => {
    const s = sim.current;
    const id = catIds[catIds.length - 1];
    const c = id !== undefined ? s.cats.get(id) : undefined;
    if (c) bubble("poof! 💨", c.x + CAT_W / 2, floorY() - CAT_H - 24);
    setCatIds((ids) => ids.slice(0, -1));
  };

  const releaseDog = () => {
    const s = sim.current;
    if (s.dog.active) return;
    if (s.reduced) {
      // No chase animation: the cats just head home.
      s.cats.forEach((c) => bubble("bye! 👋", c.x + CAT_W / 2, floorY() - CAT_H - 24));
      setCatIds([]);
      return;
    }
    s.dog.x = -DOG_W;
    s.dog.active = true;
    setDogOn(true);
    bubble("WOOF! 🐕", 60, floorY() - DOG_H - 30, "bg-coral");
    s.cats.forEach((c) => {
      c.mode = "flee";
      c.dir = 1;
      c.vy = -380; // startled hop
      bubble("!!", c.x + CAT_W / 2, floorY() - CAT_H - 28, "bg-rose");
    });
    renderNow();
  };

  const petCat = (id: number) => {
    const c = sim.current.cats.get(id);
    if (!c || c.mode === "flee") return;
    c.mode = "sit";
    c.modeT = 1.6;
    bubble("Meow~ ❤️", c.x + CAT_W / 2, floorY() - CAT_H - 26 + c.y, "bg-rose");
  };

  const renderNow = () => requestAnimationFrame(() => render());

  /* ---------- ball dragging ---------- */
  useEffect(() => {
    const ball = ballRef.current;
    const area = areaRef.current;
    if (!ball || !area) return;
    const s = sim.current;
    let lastPts: { x: number; y: number; t: number }[] = [];

    const local = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      s.ball.drag = true;
      try {
        ball.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released — dragging still works via move events */
      }
      s.ball.vx = s.ball.vy = 0;
      lastPts = [{ ...local(e), t: performance.now() }];
      ball.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!s.ball.drag) return;
      const p = local(e);
      s.ball.x = Math.min(Math.max(p.x, s.minX + BALL_R), s.W - BALL_R);
      s.ball.y = Math.min(Math.max(p.y, BALL_R), floorY() - BALL_R);
      lastPts.push({ ...p, t: performance.now() });
      if (lastPts.length > 5) lastPts.shift();
      render();
    };
    const up = () => {
      if (!s.ball.drag) return;
      s.ball.drag = false;
      ball.style.cursor = "";
      const a = lastPts[0];
      const z = lastPts[lastPts.length - 1];
      const dt = Math.max(16, z.t - a.t) / 1000;
      const clamp = (v: number) => Math.max(-1500, Math.min(1500, v));
      s.ball.vx = clamp((z.x - a.x) / dt);
      s.ball.vy = clamp((z.y - a.y) / dt);
    };
    ball.addEventListener("pointerdown", down);
    ball.addEventListener("pointermove", move);
    ball.addEventListener("pointerup", up);
    ball.addEventListener("pointercancel", up);
    return () => {
      ball.removeEventListener("pointerdown", down);
      ball.removeEventListener("pointermove", move);
      ball.removeEventListener("pointerup", up);
      ball.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={areaRef} className="relative h-[320px] overflow-hidden sm:h-[380px]">
      {/* widget post down to the floor */}
      <span aria-hidden className="absolute bottom-5 left-[44px] top-[300px] w-2 bg-grape-deep sm:left-[49px]" />

      {/* control widget */}
      <div
        ref={widgetRef}
        role="group"
        aria-label="Pet playground controls"
        className="absolute left-2 top-4 z-40 h-[276px] w-[84px] [filter:drop-shadow(4px_4px_0_#000)] sm:top-6 sm:w-[94px]"
      >
        <div aria-hidden className="absolute inset-0 bg-black [clip-path:polygon(5%_4%,20%_2%,40%_5%,60%_2%,80%_5%,95%_4%,92%_15%,95%_30%,92%_45%,95%_60%,92%_75%,95%_90%,90%_96%,80%_94%,60%_97%,40%_94%,20%_96%,6%_94%,8%_85%,5%_70%,8%_55%,5%_40%,8%_25%,5%_10%)]" />
        <div className="absolute inset-[3px] flex flex-col items-center justify-between bg-[#fefcf7] px-2 py-4 [clip-path:polygon(5%_4%,20%_2%,40%_5%,60%_2%,80%_5%,95%_4%,92%_15%,95%_30%,92%_45%,95%_60%,92%_75%,95%_90%,90%_96%,80%_94%,60%_97%,40%_94%,20%_96%,6%_94%,8%_85%,5%_70%,8%_55%,5%_40%,8%_25%,5%_10%)]">
          <button
            type="button"
            onClick={() => setHats((h) => !h)}
            aria-pressed={hats}
            aria-label={`${catIds.length} ${catIds.length === 1 ? "cat" : "cats"} — toggle wizard hats`}
            title="Toggle wizard hats 🧙"
            className="flex min-h-[44px] flex-col items-center font-mono text-xs font-black text-black hover:scale-105"
          >
            <CatIcon />
            <span aria-live="polite">{catIds.length}</span>
          </button>
          <PetButton label="Add a cat" className="bg-[#38bdf8]" onClick={addCat} disabled={catIds.length >= MAX_CATS || dogOn}>
            +
          </PetButton>
          <PetButton label="Remove a cat" className="bg-[#fda4af]" onClick={removeCat} disabled={catIds.length === 0 || dogOn}>
            −
          </PetButton>
          <PetButton label="Release the dog" className="bg-[#f59e0b]" onClick={releaseDog} disabled={dogOn || catIds.length === 0}>
            <DogIcon />
          </PetButton>
        </div>
      </div>

      {/* ball */}
      <div
        ref={ballRef}
        aria-hidden
        className="absolute left-0 top-0 z-20 h-10 w-10 cursor-grab touch-none rounded-full border-[3px] border-black bg-[#ff4757] shadow-[3px_3px_0_#000]"
      >
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <path d="M6 14 C 16 20, 26 8, 34 16 M8 28 C 18 22, 24 34, 33 27" stroke="#111" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* cats */}
      {catIds.map((id) => (
        <div
          key={id}
          ref={(el) => {
            if (el) catEls.current.set(id, el);
            else catEls.current.delete(id);
          }}
          aria-hidden
          onClick={() => petCat(id)}
          className="absolute left-0 top-0 z-10 cursor-pointer"
          style={{ width: CAT_W, height: CAT_H, transform: "translate3d(-200px, 0, 0)" }}
        >
          <div className="h-full w-full">
            <CatSprite hat={hats} />
          </div>
        </div>
      ))}

      {/* dog */}
      <div
        ref={dogRef}
        aria-hidden
        className={`pet-walking absolute left-0 top-0 z-10 ${dogOn ? "" : "hidden"}`}
        style={{ width: DOG_W, height: DOG_H, transform: `translate3d(${-DOG_W}px, 0, 0)` }}
      >
        <DogSprite />
      </div>

      {/* hazard floor */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-0 h-5 border-y-[3px] border-black bg-hazard" />
    </div>
  );
}

function PetButton({
  label,
  className,
  onClick,
  disabled,
  children,
}: {
  label: string;
  className: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 w-14 items-center justify-center border-[3px] border-black text-2xl font-black leading-none text-black shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 sm:w-16 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- original artwork ---------- */

function CatSprite({ hat }: { hat: boolean }) {
  return (
    <svg viewBox="0 0 80 64" className="pet-svg h-full w-full overflow-visible">
      {/* tail */}
      <path className="pet-tail" d="M18 46 C 6 44, 4 30, 10 18" stroke="#111" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* legs */}
      <rect className="pet-leg-a" x="22" y="48" width="6" height="14" rx="3" fill="#111" />
      <rect className="pet-leg-b" x="30" y="48" width="6" height="14" rx="3" fill="#111" />
      <rect className="pet-leg-b" x="46" y="48" width="6" height="14" rx="3" fill="#111" />
      <rect className="pet-leg-a" x="54" y="48" width="6" height="14" rx="3" fill="#111" />
      {/* body */}
      <ellipse cx="40" cy="44" rx="23" ry="12" fill="#111" />
      {/* head */}
      <path d="M50 22 L52 7 L59 17 L64 17 L71 7 L73 22 Z" fill="#111" />
      <circle cx="61" cy="28" r="13" fill="#111" />
      <path d="M53 11 L54.5 17 L57.5 16 Z M70 11 L68.5 17 L65.5 16 Z" fill="#ff8fab" />
      {/* eyes */}
      <ellipse cx="56.5" cy="27" rx="3" ry="3.6" fill="#d9f99d" />
      <ellipse cx="66" cy="27" rx="3" ry="3.6" fill="#d9f99d" />
      <ellipse cx="57.3" cy="27.5" rx="1.1" ry="2.4" fill="#111" />
      <ellipse cx="66.8" cy="27.5" rx="1.1" ry="2.4" fill="#111" />
      {/* nose + whiskers */}
      <path d="M60 32 L63 32 L61.5 34 Z" fill="#ff8fab" />
      <path d="M52 33 L44 31 M52 35 L44 36 M71 33 L78 31 M71 35 L78 36" stroke="#9ca3af" strokeWidth="0.9" />
      {/* collar */}
      <path d="M50 38 Q61 43 72 38" stroke="#e11d48" strokeWidth="3" fill="none" />
      <circle cx="61" cy="42.5" r="2.2" fill="#ffde4a" stroke="#111" strokeWidth="0.8" />
      {hat ? (
        <g>
          <path d="M49 19 L62 -16 L74 19 Z" fill="#6d28d9" stroke="#111" strokeWidth="1.5" />
          <ellipse cx="61.5" cy="19" rx="16" ry="3.5" fill="#6d28d9" stroke="#111" strokeWidth="1.5" />
          <path d="M60 2 l1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z" fill="#ffde4a" />
          <circle cx="66" cy="12" r="1.3" fill="#ffde4a" />
          <circle cx="57" cy="13" r="1" fill="#ffde4a" />
        </g>
      ) : null}
    </svg>
  );
}

function DogSprite() {
  return (
    <svg viewBox="0 0 110 64" className="pet-svg h-full w-full overflow-visible">
      <path className="pet-tail" d="M20 30 C 10 26, 8 16, 14 10" stroke="#8b5a2b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect className="pet-leg-a" x="24" y="40" width="8" height="22" rx="4" fill="#8b5a2b" />
      <rect className="pet-leg-b" x="34" y="40" width="8" height="22" rx="4" fill="#7a4a20" />
      <rect className="pet-leg-b" x="64" y="40" width="8" height="22" rx="4" fill="#7a4a20" />
      <rect className="pet-leg-a" x="74" y="40" width="8" height="22" rx="4" fill="#8b5a2b" />
      <ellipse cx="52" cy="34" rx="34" ry="14" fill="#a8652e" stroke="#111" strokeWidth="2" />
      <ellipse cx="44" cy="30" rx="9" ry="6" fill="#f3d3a8" />
      <circle cx="88" cy="20" r="14" fill="#a8652e" stroke="#111" strokeWidth="2" />
      <ellipse cx="101" cy="25" rx="8" ry="6" fill="#f3d3a8" stroke="#111" strokeWidth="2" />
      <circle cx="107" cy="23" r="2.6" fill="#111" />
      <path d="M80 8 C 72 10, 72 26, 78 30 C 82 22, 84 14, 80 8 Z" fill="#6b3e18" stroke="#111" strokeWidth="2" />
      <circle cx="92" cy="16" r="2.3" fill="#111" />
      <path d="M100 30 Q102 38 97 38 Q94 36 96 30" fill="#ff6b81" stroke="#111" strokeWidth="1.5" />
      <path d="M74 30 L80 34" stroke="#e11d48" strokeWidth="4" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg viewBox="0 0 32 32" className="mb-0.5 h-8 w-8" aria-hidden>
      <path d="M6 14 L8 4 L13 10 L19 10 L24 4 L26 14 C 27 22, 22 27, 16 27 C 10 27, 5 22, 6 14 Z" fill="none" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12.5" cy="16" r="1.6" fill="#111" />
      <circle cx="19.5" cy="16" r="1.6" fill="#111" />
      <path d="M15 20 L17 20 L16 21.3 Z" fill="#111" />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <path d="M9 9 C 4 9, 3 18, 6 20 L9 15 M23 9 C 28 9, 29 18, 26 20 L23 15" fill="none" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 9 C 11 6, 21 6, 23 9 L24 19 C 24 25, 20 28, 16 28 C 12 28, 8 25, 8 19 Z" fill="none" stroke="#111" strokeWidth="2" />
      <circle cx="13" cy="15" r="1.5" fill="#111" />
      <circle cx="19" cy="15" r="1.5" fill="#111" />
      <ellipse cx="16" cy="21" rx="2.2" ry="1.6" fill="#111" />
    </svg>
  );
}
