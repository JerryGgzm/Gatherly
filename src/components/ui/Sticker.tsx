"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useState } from "react";

type Props = {
  label: string;
  icon: string;
  color: string;
  selected?: boolean;
  dimmed?: boolean;
  tilt?: number;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  onBlocked?: () => void;
  blocked?: boolean;
  className?: string;
};

const PARTICLES = Array.from({ length: 8 }, (_, i) => i);

export function Sticker({
  label,
  icon,
  color,
  selected = false,
  dimmed = false,
  tilt = 0,
  size = "md",
  onClick,
  onBlocked,
  blocked = false,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const controls = useAnimationControls();
  const [burst, setBurst] = useState(0);

  const handle = () => {
    if (blocked) {
      if (!reduce) controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.35 } });
      onBlocked?.();
      return;
    }
    if (!selected) setBurst((b) => b + 1);
    onClick?.();
  };

  const dims = size === "lg" ? "w-36 h-36 sm:w-40 sm:h-40" : size === "sm" ? "w-24 h-24" : "w-28 h-28 sm:w-32 sm:h-32";

  return (
    <motion.button
      type="button"
      onClick={onClick || onBlocked ? handle : undefined}
      animate={controls}
      aria-pressed={onClick ? selected : undefined}
      className={clsx("relative", dimmed && !selected && "opacity-70", className)}
      style={{ rotate: tilt }}
    >
      <motion.div
        className={clsx(
          "relative flex flex-col items-center justify-center gap-1 rounded-[28px] border-[2.5px] border-ink bg-white shadow-[4px_4px_0_#242424]",
          dims,
        )}
        whileHover={reduce ? undefined : { rotate: [-2, 2, -2], scale: 1.05, boxShadow: "7px 7px 0 #242424" }}
        transition={{ rotate: { duration: 0.5, repeat: Infinity }, default: { duration: 0.18 } }}
        style={{ background: selected ? color : "#FFFFFF" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink text-2xl sm:h-14 sm:w-14 sm:text-3xl"
          style={{ background: selected ? "#FFFFFF" : `${color}33` }}
        >
          {icon}
        </span>
        <span className="font-display text-sm font-bold sm:text-base">{label}</span>

        <AnimatePresence>
          {selected && (
            <motion.span
              initial={reduce ? { opacity: 0 } : { scale: 2.2, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="absolute -right-3 -top-3 rounded-full border-2 border-ink bg-ink px-2 py-0.5 font-display text-[11px] font-bold text-cream"
            >
              ✓ Selected
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {!reduce && burst > 0 && (
        <span key={burst} className="pointer-events-none absolute inset-0">
          {PARTICLES.map((i) => {
            const angle = (i / PARTICLES.length) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full border border-ink"
                style={{ background: i % 2 ? color : "#FFD84D" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            );
          })}
        </span>
      )}
    </motion.button>
  );
}
