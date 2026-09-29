"use client";

import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Location } from "@/lib/data";
import { MusicNote, Sparkle } from "./Props";

type Props = {
  location: Location;
  active?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  tilt?: number;
};

type Pt = [number, number];

function Glints({ points, on, color = "#FFFFFF" }: { points: Pt[]; on: boolean; color?: string }) {
  const reduce = useReducedMotion();
  return (
    <>
      {points.map(([x, y], i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute w-[2.6%]"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={reduce ? { opacity: on ? 1 : 0.4 } : { opacity: [0, on ? 1 : 0.6, 0], scale: [0.4, 1, 0.4] }}
          transition={{ duration: on ? 1.2 : 2.4, repeat: Infinity, delay: i * 0.37 }}
        >
          <Sparkle color={color} />
        </motion.div>
      ))}
    </>
  );
}

function Glow({ x, y, w, h, color, on, pulse = false }: { x: number; y: number; w: number; h: number; color: string; on: boolean; pulse?: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full mix-blend-screen blur-xl"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, background: color, x: "-50%", y: "-50%" }}
      animate={{ opacity: on ? (pulse ? [0.55, 0.95, 0.6] : 0.8) : 0 }}
      transition={pulse ? { duration: 1.4, repeat: Infinity } : { duration: 0.4 }}
    />
  );
}

function Petals() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-[1.4%] w-[1.1%] rounded-[60%_0_60%_0] border border-ink/40 bg-pink"
          style={{ left: `${6 + i * 5}%`, top: "22%" }}
          animate={{ y: ["0%", "1800%"], x: ["0%", "400%"], rotate: [0, 260], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6 + (i % 3), repeat: Infinity, delay: i * 0.7, ease: "linear" }}
        />
      ))}
    </>
  );
}

function Bubble({ show, x, y, text }: { show: boolean; x: number; y: number; text: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-2xl border-[2.5px] border-ink bg-white px-3 py-1 font-display text-xs font-bold shadow-[2px_2px_0_#242424] sm:text-sm"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Overlay({ location, on }: { location: Location; on: boolean }) {
  const reduce = useReducedMotion();

  if (location.id === "slu") {
    return (
      <>
        <Glow x={33} y={62} w={36} h={26} color="rgba(120,230,140,0.7)" on={on} />
        <Glow x={69} y={51} w={14} h={12} color="rgba(255,216,77,0.9)" on={on} pulse />
        <Glints on={on} points={[[78, 36], [92, 44], [84, 60], [95, 66], [56, 82], [76, 88]]} />
        <Bubble show={on} x={36} y={22} text={location.hoverLine} />
      </>
    );
  }

  if (location.id === "udistrict") {
    return (
      <>
        <Petals />
        <Glow x={69} y={64} w={16} h={14} color="rgba(160,210,255,0.9)" on={on} pulse />
        <Glints on={on} points={[[64, 64], [72, 60], [70, 70], [76, 66]]} />
        <Bubble show={on} x={56} y={30} text={location.hoverLine} />
      </>
    );
  }

  if (location.id === "capitolhill") {
    return (
      <>
        <motion.div className="pointer-events-none absolute inset-0 bg-[#1b1440] mix-blend-multiply" animate={{ opacity: on ? 0.55 : 0 }} transition={{ duration: 0.5 }} />
        <Glow x={62} y={29} w={22} h={10} color="rgba(255,123,169,0.9)" on={on} pulse />
        <Glow x={40} y={40} w={46} h={10} color="rgba(255,216,77,0.7)" on={on} pulse />
        <Glow x={20} y={57} w={14} h={12} color="rgba(255,190,90,0.8)" on={on} />
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute w-[3.6%]"
              style={{ left: `${17 + i * 4}%`, top: "50%" }}
              animate={{ y: ["0%", "-260%"], opacity: [0, 1, 0], rotate: [0, 14] }}
              transition={{ duration: on ? 1.6 : 3, repeat: Infinity, delay: i * 0.7 }}
            >
              <MusicNote className="w-full" color={["#9368F7", "#FF7BA9", "#3D7EFF"][i]} />
            </motion.div>
          ))}
        <Bubble show={on} x={62} y={16} text={location.hoverLine} />
      </>
    );
  }

  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#FF6B35] via-[#FF7BA9]/60 to-transparent mix-blend-multiply"
        animate={{ opacity: on ? 0.5 : 0 }}
        transition={{ duration: 0.6 }}
      />
      <Glow x={43} y={43} w={18} h={9} color="rgba(170,220,255,0.9)" on={on} pulse />
      <Glints on={on} points={[[86, 54], [94, 60], [84, 70], [92, 78], [97, 52], [88, 84]]} />
      <Bubble show={on} x={52} y={8} text={location.hoverLine} />
    </>
  );
}

export function InteractiveLocation({ location, active, selected, onSelect, className, tilt = 0 }: Props) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const on = hover || !!active;

  return (
    <motion.div
      className={clsx("group relative", className)}
      style={{ rotate: tilt }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={reduce ? undefined : { y: -4 }}
    >
      <button
        type="button"
        onClick={onSelect}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-pressed={selected}
        aria-label={`${location.name}: ${location.tagline}`}
        className={clsx(
          "relative block w-full overflow-hidden rounded-[28px] border-[2.5px] border-ink bg-cream text-left shadow-[5px_5px_0_#242424] transition-shadow group-hover:shadow-[8px_8px_0_#242424]",
          selected && "ring-4 ring-offset-2 ring-offset-cream",
        )}
        style={selected ? ({ "--tw-ring-color": location.accent } as React.CSSProperties) : undefined}
      >
        <motion.div
          className="relative aspect-[4/3] w-full"
          animate={{ scale: selected ? 1.07 : on && !reduce ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        >
          <Image src={location.image} alt="" fill sizes="(max-width: 768px) 92vw, 46vw" className="object-cover" />
          <Overlay location={location} on={on} />
        </motion.div>
        <div className="absolute left-4 top-4 flex flex-col items-start gap-1">
          <motion.span
            className="rounded-full border-[2.5px] border-ink bg-white px-3 py-1 font-display text-lg font-bold shadow-[3px_3px_0_#242424] sm:text-xl"
            animate={on && !reduce ? { y: [0, -6, 0], rotate: [0, -2, 0] } : { y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {location.name}
          </motion.span>
          <span className="rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-xs font-semibold text-white" style={{ background: location.accent }}>
            {location.tagline}
          </span>
        </div>
      </button>
    </motion.div>
  );
}
