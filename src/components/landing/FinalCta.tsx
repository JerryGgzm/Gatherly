"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

const WINDOWS = [
  { x: 14, y: 58, d: 0 },
  { x: 27, y: 50, d: 1.1 },
  { x: 41, y: 62, d: 0.4 },
  { x: 58, y: 55, d: 1.8 },
  { x: 72, y: 48, d: 0.8 },
  { x: 86, y: 60, d: 1.4 },
];

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden bg-night text-cream">
      <div className="relative aspect-[16/9] max-h-[760px] min-h-[520px] w-full">
        <Image src="/art/seattle-night.png" alt="" fill sizes="100vw" className="object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/10 to-night/30" />

        {!reduce &&
          WINDOWS.map((w, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute h-[7%] w-[5%] -translate-x-1/2 rounded-full bg-lemon mix-blend-screen blur-lg"
              style={{ left: `${w.x}%`, top: `${w.y}%` }}
              animate={inView ? { opacity: [0, 0.9, 0.2, 0.8, 0] } : { opacity: 0 }}
              transition={{ duration: 4.5, delay: w.d, repeat: Infinity }}
            />
          ))}

        <div className="absolute inset-x-0 top-[8%] flex flex-col items-center px-4 text-center">
          <h2 className="text-5xl text-cream drop-shadow-[3px_3px_0_#242424] sm:text-7xl">Who will you meet next?</h2>
          <p className="mt-4 max-w-md text-lg text-cream/80">Every window has someone you haven&apos;t met yet.</p>
          <Button href="/explore" size="lg" className="mt-8" arrow>
            Find my table
          </Button>
        </div>
      </div>
      <footer className="relative border-t-[2.5px] border-ink bg-ink px-4 py-8 text-center font-display text-sm text-cream/70">
        Gatherly.pub · Seattle · Made for people who wonder who else is out there.
      </footer>
    </section>
  );
}
