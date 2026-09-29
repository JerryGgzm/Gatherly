"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <Link href="/" className={clsx("group inline-flex items-baseline font-display leading-none", className)} aria-label="Gatherly.pub home">
      <span className={clsx("text-2xl font-bold tracking-tight", light ? "text-cream" : "text-ink")}>Gatherly</span>
      <motion.span
        aria-hidden
        className="mx-[2px] inline-block h-2.5 w-2.5 rounded-full border-2 border-ink bg-orange"
        animate={reduce ? undefined : { y: [0, -9, 0, -3, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 4, ease: "easeOut" }}
      />
      <span className={clsx("text-sm font-semibold", light ? "text-lemon" : "text-orange")}>pub</span>
    </Link>
  );
}
