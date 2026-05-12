"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const NODES = [
  { id: "01", label: "BRIEF" },
  { id: "02", label: "UI" },
  { id: "03", label: "API" },
  { id: "04", label: "DATA" },
  { id: "05", label: "AI" },
  { id: "06", label: "SHIP" },
];

const CX = 500;
const CY = 500;
const R_OUTER = 460;
const R_MID = 360;
const R_INNER = 240;
const TICKS = 60;
const NODE_RADIUS = R_MID;

function polar(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + Math.cos(a) * radius,
    y: CY + Math.sin(a) * radius,
  };
}

function nodePositions() {
  return NODES.map((n, i) => {
    const angle = (360 / NODES.length) * i;
    return { ...n, angle, ...polar(angle, NODE_RADIUS) };
  });
}

function buildHexPath() {
  const pts = nodePositions();
  return (
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ") + " Z"
  );
}

export default function ScrollSVG() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Path lengths (perimeters) for stroke-dashoffset
  const C_OUTER = 2 * Math.PI * R_OUTER;
  const C_MID = 2 * Math.PI * R_MID;
  const C_INNER = 2 * Math.PI * R_INNER;

  const offOuter = useTransform(scrollYProgress, [0.1, 0.4], [C_OUTER, 0]);
  const offMid = useTransform(scrollYProgress, [0.2, 0.5], [C_MID, 0]);
  const offInner = useTransform(scrollYProgress, [0.3, 0.6], [C_INNER, 0]);
  const hexDash = 3000;
  const offHex = useTransform(scrollYProgress, [0.4, 0.7], [hexDash, 0]);
  const ticksOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const labelsOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const crosshairScale = useTransform(scrollYProgress, [0.55, 0.75], [0.4, 1]);
  const needleAngle = useTransform(scrollYProgress, [0.05, 1], [0, 360]);
  const headlineY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);

  const nodes = nodePositions();
  const hexPath = buildHexPath();

  return (
    <section
      ref={ref}
      id="build-loop"
      className="relative isolate w-full overflow-hidden bg-cream-50 py-20 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 md:px-10">
        <div className="mb-8 flex flex-col gap-2 border-t border-ink-950/15 pt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-0 sm:mb-10">
          <span className="mono-eyebrow">/ Process · The build loop</span>
          <span className="mono-eyebrow hidden text-ink-950/45 md:inline">
            Scroll to draw
          </span>
        </div>

        {/* Mobile headline (above the SVG) */}
        <div className="md:hidden">
          <span className="mono-eyebrow text-ink-950/55">how i ship</span>
          <h2 className="display mt-3 text-[13vw] tracking-tightest leading-[0.9]">
            <span>brief </span>
            <span className="text-stroke">→</span>
            <span> code </span>
            <span className="text-red">→</span>
            <span> ship.</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] text-ink-950/65">
            Six steps, repeated weekly. Each scroll-tick traces one path of the
            loop.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-8 flex max-w-[1700px] flex-col items-center px-4 sm:px-6 md:mt-0 md:px-10">
        {/* Headline (left aligned over the diagram) */}
        <motion.div
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="pointer-events-none absolute left-6 top-2 z-10 hidden flex-col md:left-10 md:flex"
        >
          <span className="mono-eyebrow text-ink-950/55">how i ship</span>
          <h2 className="display mt-3 text-[6vw] tracking-tightest leading-[0.9]">
            <span>brief </span>
            <span className="text-stroke">→</span>
            <span> code </span>
            <span className="text-red">→</span>
            <span> ship.</span>
          </h2>
          <p className="mt-4 max-w-xs text-base text-ink-950/65">
            Six steps, repeated weekly. Each scroll-tick traces one path of the
            loop.
          </p>
        </motion.div>

        {/* Right-side legend */}
        <motion.div
          style={{ opacity: labelsOpacity }}
          className="pointer-events-none absolute right-6 top-2 z-10 hidden md:right-10 md:block"
        >
          <ul className="space-y-2 border-l border-ink-950/15 pl-4">
            {nodes.map((n) => (
              <li
                key={n.id}
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-950/75"
              >
                <span className="text-ink-950/35">{n.id}</span>
                <span>{n.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* SVG */}
        <div className="relative aspect-square w-full max-w-[420px] sm:max-w-[600px] md:max-w-[820px]">
          <svg
            viewBox="0 0 1000 1000"
            className="h-full w-full"
            aria-hidden
          >
            {/* Background subtle grid */}
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(235,89,57,0.18)" />
                <stop offset="60%" stopColor="rgba(235,89,57,0.04)" />
                <stop offset="100%" stopColor="rgba(235,89,57,0)" />
              </radialGradient>
              <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(235,89,57,0)" />
                <stop offset="100%" stopColor="#eb5939" />
              </linearGradient>
            </defs>

            <circle cx={CX} cy={CY} r={R_OUTER} fill="url(#centerGlow)" />

            {/* Outer ring */}
            <motion.circle
              cx={CX}
              cy={CY}
              r={R_OUTER}
              fill="none"
              stroke="#0d0d0d"
              strokeOpacity={0.35}
              strokeWidth={1}
              strokeDasharray={C_OUTER}
              style={{ strokeDashoffset: offOuter as unknown as number }}
            />

            {/* Mid ring */}
            <motion.circle
              cx={CX}
              cy={CY}
              r={R_MID}
              fill="none"
              stroke="#0d0d0d"
              strokeOpacity={0.45}
              strokeWidth={1}
              strokeDasharray={C_MID}
              style={{ strokeDashoffset: offMid as unknown as number }}
            />

            {/* Inner ring */}
            <motion.circle
              cx={CX}
              cy={CY}
              r={R_INNER}
              fill="none"
              stroke="#eb5939"
              strokeOpacity={0.85}
              strokeWidth={1.5}
              strokeDasharray={C_INNER}
              style={{ strokeDashoffset: offInner as unknown as number }}
            />

            {/* Tick marks around outer ring */}
            <motion.g style={{ opacity: ticksOpacity }}>
              {Array.from({ length: TICKS }).map((_, i) => {
                const angle = (360 / TICKS) * i;
                const isMajor = i % 5 === 0;
                const inner = isMajor ? R_OUTER - 24 : R_OUTER - 12;
                const outer = R_OUTER;
                const p1 = polar(angle, inner);
                const p2 = polar(angle, outer);
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="#0d0d0d"
                    strokeOpacity={isMajor ? 0.65 : 0.3}
                    strokeWidth={isMajor ? 1.2 : 1}
                  />
                );
              })}
            </motion.g>

            {/* Connecting hexagon between nodes */}
            <motion.path
              d={hexPath}
              fill="none"
              stroke="#0d0d0d"
              strokeOpacity={0.55}
              strokeWidth={1.2}
              strokeDasharray={hexDash}
              style={{ strokeDashoffset: offHex as unknown as number }}
            />

            {/* Radial diagonals from center to each node */}
            <motion.g style={{ opacity: labelsOpacity }}>
              {nodes.map((n) => (
                <line
                  key={`d-${n.id}`}
                  x1={CX}
                  y1={CY}
                  x2={n.x}
                  y2={n.y}
                  stroke="#0d0d0d"
                  strokeOpacity={0.18}
                  strokeWidth={1}
                  strokeDasharray="4 6"
                />
              ))}
            </motion.g>

            {/* Sweeping needle */}
            <Needle angle={needleAngle} />

            {/* Node circles */}
            <motion.g style={{ opacity: labelsOpacity }}>
              {nodes.map((n) => (
                <g key={`n-${n.id}`}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={14}
                    fill="#f6f1e8"
                    stroke="#0d0d0d"
                    strokeWidth={1.2}
                  />
                  <circle cx={n.x} cy={n.y} r={5} fill="#eb5939" />
                  <text
                    x={n.x}
                    y={n.y - 30}
                    textAnchor="middle"
                    className="fill-ink-950 font-mono"
                    fontSize="20"
                    fontWeight="500"
                    style={{ letterSpacing: "0.18em" }}
                  >
                    {n.id} {n.label}
                  </text>
                </g>
              ))}
            </motion.g>

            {/* Central crosshair + monogram */}
            <motion.g
              style={{
                scale: crosshairScale,
                transformOrigin: "center",
                transformBox: "fill-box",
              }}
            >
              <circle
                cx={CX}
                cy={CY}
                r={60}
                fill="#f6f1e8"
                stroke="#0d0d0d"
                strokeWidth={1.2}
              />
              <line
                x1={CX - 80}
                y1={CY}
                x2={CX + 80}
                y2={CY}
                stroke="#0d0d0d"
                strokeOpacity={0.35}
                strokeWidth={1}
              />
              <line
                x1={CX}
                y1={CY - 80}
                x2={CX}
                y2={CY + 80}
                stroke="#0d0d0d"
                strokeOpacity={0.35}
                strokeWidth={1}
              />
              <text
                x={CX}
                y={CY + 12}
                textAnchor="middle"
                fontSize="38"
                className="font-display fill-ink-950"
                style={{ fontWeight: 800, letterSpacing: "-0.04em" }}
              >
                RK
              </text>
              <circle
                cx={CX}
                cy={CY}
                r={3}
                fill="#eb5939"
              />
            </motion.g>

            {/* Curved scroll-text along inner ring */}
            <motion.g style={{ opacity: labelsOpacity }}>
              <defs>
                <path
                  id="textCircle"
                  d={`M ${CX} ${CY} m -${R_INNER + 30} 0 a ${R_INNER + 30} ${
                    R_INNER + 30
                  } 0 1 1 ${(R_INNER + 30) * 2} 0 a ${R_INNER + 30} ${
                    R_INNER + 30
                  } 0 1 1 -${(R_INNER + 30) * 2} 0`}
                />
              </defs>
              <text
                fontSize="18"
                className="font-mono fill-ink-950/70"
                style={{ letterSpacing: "0.34em" }}
              >
                <textPath href="#textCircle" startOffset="0%">
                  build · ship · iterate · build · ship · iterate · build · ship
                  · iterate · build · ship · iterate ·
                </textPath>
              </text>
            </motion.g>
          </svg>
        </div>

        {/* Mobile legend (below) */}
        <ul className="mt-10 grid w-full grid-cols-3 gap-3 md:hidden">
          {nodes.map((n) => (
            <li
              key={n.id}
              className="flex items-center gap-2 rounded-md border border-ink-950/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
            >
              <span className="text-ink-950/40">{n.id}</span>
              <span>{n.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Needle({ angle }: { angle: MotionValue<number> }) {
  return (
    <motion.g style={{ rotate: angle, originX: "500px", originY: "500px" }}>
      <line
        x1={CX}
        y1={CY}
        x2={CX}
        y2={CY - R_OUTER + 30}
        stroke="url(#needleGrad)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle
        cx={CX}
        cy={CY - R_OUTER + 30}
        r={5}
        fill="#eb5939"
      />
    </motion.g>
  );
}
