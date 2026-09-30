"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CatBody, CatPaws, makeRig } from "./CatCharacter";
import { CATS, VIEW_W, type Seat } from "./cats";
import { StringLights } from "./DinnerTable";
import { sleep } from "./reactions";

const INK = "#242424";
const COLORS = ["#FF6B35", "#FFD84D", "#3D7EFF", "#63C174", "#9368F7", "#FF7BA9"];
const VIEW_H = 480;
const SEAT: Seat = { x: 400, y: 404, s: 1.4, turn: 0, pawY: -18, pawDX: 0, back: false, plate: { x: 400, y: 404 }, shoulder: { x: 22, y: -62 } };
const RAISED = 128;

/** Paw tips with both arms flung up to `RAISED`, in view-box units: shoulder + 40-unit arm rotated by RAISED. */
const TIPS = [-1, 1].map((d) => {
  const a = (RAISED * Math.PI) / 180;
  const len = SEAT.pawY + 58;
  return { x: SEAT.x + d * (SEAT.shoulder!.x + len * Math.sin(a)) * SEAT.s, y: SEAT.y + (SEAT.shoulder!.y + len * Math.cos(a)) * SEAT.s };
});

type Shape = "rect" | "dot" | "flower" | "petal";
type Piece = { id: number; x: number; y: number; dx: number; up: number; fall: number; rot: number; color: string; shape: Shape; size: number; delay: number };

let nextId = 0;

function burst(rand: () => number, count = 28): Piece[] {
  const shapes: Shape[] = ["rect", "dot", "flower", "petal", "flower", "rect"];
  return Array.from({ length: count }, (_, i) => {
    const tip = TIPS[i % 2];
    const side = i % 2 ? 1 : -1;
    return {
      id: nextId++,
      x: tip.x,
      y: tip.y,
      dx: side * (30 + rand() * 230) - side * 40 * rand(),
      up: 90 + rand() * 150,
      fall: 200 + rand() * 140,
      rot: (rand() - 0.5) * 900,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      shape: shapes[Math.floor(rand() * shapes.length)],
      size: 0.8 + rand() * 0.7,
      delay: rand() * 0.12,
    };
  });
}

/** Deterministic spread for the reduced-motion still, so server and client render the same thing. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function PieceShape({ shape, color, size }: Pick<Piece, "shape" | "color" | "size">) {
  return (
    <g transform={`scale(${size})`}>
      {shape === "rect" && <rect x={-5} y={-8} width={10} height={16} rx={2} fill={color} stroke={INK} strokeWidth={2} />}
      {shape === "dot" && <circle r={6} fill={color} stroke={INK} strokeWidth={2} />}
      {shape === "petal" && <ellipse rx={5} ry={9} fill={color} stroke={INK} strokeWidth={2} />}
      {shape === "flower" && (
        <g stroke={INK} strokeWidth={1.8}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 6} cy={Math.sin((a * Math.PI) / 180) * 6} r={5} fill={color} />
          ))}
          <circle r={4} fill="#FFD84D" />
        </g>
      )}
    </g>
  );
}

function Flying({ p }: { p: Piece }) {
  return (
    <motion.g
      initial={{ x: p.x, y: p.y, rotate: 0, opacity: 1 }}
      animate={{
        x: [p.x, p.x + p.dx * 0.55, p.x + p.dx],
        y: [p.y, p.y - p.up, p.y - p.up + p.fall],
        rotate: [0, p.rot * 0.4, p.rot],
        opacity: [1, 1, 1, 0],
      }}
      transition={{
        duration: 2.4,
        delay: p.delay,
        times: [0, 0.3, 1],
        ease: ["easeOut", "easeIn"],
        opacity: { duration: 2.4, delay: p.delay, times: [0, 0.3, 0.8, 1] },
      }}
    >
      <PieceShape shape={p.shape} color={p.color} size={p.size} />
    </motion.g>
  );
}

/** Orange ("The social one") flinging confetti and flowers into the sky, on loop. Used on the "You're in." screen. */
export function CelebrationScene({ className, label = "The social one happily throws confetti into the air" }: { className?: string; label?: string }) {
  const reduce = !!useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.3 });
  const [rig] = useState(makeRig);
  const [bursts, setBursts] = useState<{ id: number; pieces: Piece[] }[]>([]);
  const [bubble, setBubble] = useState(false);
  const still = useMemo(() => {
    const r = seeded(7);
    return burst(r, 22).map((p) => ({ ...p, x: p.x + p.dx * 0.8, y: p.y - p.up * (0.3 + r() * 0.6) }));
  }, []);

  useEffect(() => {
    const unmounts = Object.values(rig).map((c) => c.mount());
    return () => unmounts.forEach((u) => u());
  }, [rig]);

  useEffect(() => {
    if (reduce) {
      rig.pawL.set({ rotate: RAISED });
      rig.pawR.set({ rotate: -RAISED });
      return;
    }
    if (!inView) return;
    let cancelled = false;
    let first = true;
    const throwUp = async () => {
      await Promise.all([
        rig.body.start({ y: 6, rotate: 0, transition: { duration: 0.35, ease: "easeInOut" } }),
        rig.pawL.start({ rotate: 22, transition: { duration: 0.35 } }),
        rig.pawR.start({ rotate: -22, transition: { duration: 0.35 } }),
      ]);
      if (cancelled) return;
      void rig.body.start({ y: [6, -16, 0], transition: { duration: 0.7, times: [0, 0.4, 1], ease: "easeOut" } });
      void rig.pawL.start({ rotate: RAISED, transition: { duration: 0.26, ease: [0.2, 0.9, 0.3, 1.2] } });
      void rig.pawR.start({ rotate: -RAISED, transition: { duration: 0.26, ease: [0.2, 0.9, 0.3, 1.2] } });
      void rig.earL.start({ rotate: [0, -10, 0], transition: { duration: 0.5 } });
      void rig.earR.start({ rotate: [0, 10, 0], transition: { duration: 0.5 } });
      void rig.tail.start({ rotate: [0, 18, -8, 0], transition: { duration: 0.9 } });
      await sleep(180);
      if (cancelled) return;
      const id = nextId++;
      setBursts((b) => [...b.slice(-2), { id, pieces: burst(Math.random) }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 2800);
      if (first) {
        first = false;
        setBubble(true);
        setTimeout(() => setBubble(false), 1500);
      }
      await sleep(700);
      if (cancelled) return;
      await Promise.all([
        rig.pawL.start({ rotate: 70, transition: { duration: 0.5, ease: "easeInOut" } }),
        rig.pawR.start({ rotate: -70, transition: { duration: 0.5, ease: "easeInOut" } }),
        rig.head.start({ rotate: [0, 6, -4, 0], transition: { duration: 0.8 } }),
      ]);
      await sleep(500);
    };
    const loop = async () => {
      while (!cancelled) await throwUp();
    };
    void loop();
    return () => {
      cancelled = true;
    };
  }, [inView, reduce, rig]);

  const def = CATS.orange;
  const layer = { def, seat: SEAT, rig, gaze: "viewer" as const, hovered: false, present: true, reduce, uid };

  return (
    <div ref={box} className={clsx("relative aspect-[5/3] w-full select-none overflow-hidden", className)} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#CFE0FF" />
            <stop offset="0.7" stopColor="#FFF1DC" />
          </linearGradient>
        </defs>
        <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-sky)`} />
        {[
          [110, 150, 1],
          [660, 120, 0.8],
          [600, 230, 0.6],
        ].map(([x, y, s], i) => (
          <motion.g key={i} animate={reduce ? undefined : { x: [0, 14, 0] }} transition={{ duration: 9 + i * 2, repeat: Infinity, ease: "easeInOut" }}>
            <g transform={`translate(${x} ${y}) scale(${s})`} fill="#FFFFFF" stroke={INK} strokeWidth={3}>
              <path d="M-50 10 Q-52 -14 -28 -14 Q-20 -36 4 -30 Q20 -44 38 -24 Q60 -24 56 10 Z" />
            </g>
          </motion.g>
        ))}
        <StringLights bright />
        <ellipse cx={408} cy={466} rx={300} ry={40} fill={INK} />
        <ellipse cx={400} cy={458} rx={300} ry={40} fill="#F4D3A6" stroke={INK} strokeWidth={3} />

        {reduce &&
          still.map((p) => (
            <g key={p.id} transform={`translate(${p.x} ${p.y}) rotate(${p.rot % 360})`}>
              <PieceShape shape={p.shape} color={p.color} size={p.size} />
            </g>
          ))}

        <CatBody {...layer} />
        <CatPaws {...layer} />

        {bursts.map((b) => b.pieces.map((p) => <Flying key={p.id} p={p} />))}
      </svg>

      <AnimatePresence>
        {bubble && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-1/2 top-[9%] -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-ink bg-white px-2 py-0.5 font-display text-[11px] font-bold shadow-[2px_2px_0_#242424] sm:text-xs"
          >
            Yay, you&apos;re in!
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
