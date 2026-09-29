"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useState } from "react";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type HeroState = "default" | "engaged" | "seatHovered" | "seatSelected" | "conversionReady";

function useParallax(sx: MotionValue<number>, sy: MotionValue<number>, depth: number) {
  return {
    x: useTransform(sx, (v) => v * depth),
    y: useTransform(sy, (v) => v * depth),
  };
}

export function Hero() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [hero, setHero] = useState<HeroState>("default");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const bg = useParallax(sx, sy, 2);
  const scene = useParallax(sx, sy, 3);

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const start = "/explore";
  const selected = hero === "seatSelected" || hero === "conversionReady";
  const ready = hero === "conversionReady";

  const takeSeat = (source: "seat" | "cta") => {
    if (ready) {
      router.push(start);
      return;
    }
    if (selected) return;
    if (source === "cta") track("hero_take_seat_click");
    track("hero_conversion_started", { source });
    setHero("seatSelected");
  };

  return (
    <section onMouseMove={onMove} className="relative overflow-hidden border-b-[2.5px] border-ink bg-gradient-to-b from-[#FFE3C4] via-cream to-cream">
      <div className="dotted-bg absolute inset-0" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-x-8 gap-y-4 px-4 pt-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:pt-10">
        <motion.div
          className="relative max-w-xl lg:col-start-1 lg:row-start-1 lg:self-end"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex -rotate-2 items-center gap-2 rounded-full border-[2.5px] border-ink bg-lemon px-3 py-1 font-display text-sm font-bold shadow-[3px_3px_0_#242424]">
            <span className="h-2 w-2 rounded-full bg-orange" /> Seattle · Thursdays & Saturdays · 7 PM
          </span>
          <div className="relative mt-5 min-h-[2.1em] text-[40px] leading-[1.02] sm:text-6xl lg:min-h-[3.1em] lg:text-7xl">
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.h1
                  key="room"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  There&apos;s room at the <span className="text-orange">table.</span>
                </motion.h1>
              ) : (
                <motion.h1 key="meet" exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
                  Meet people you wouldn&apos;t have met{" "}
                  <span className="relative inline-block">
                    otherwise.
                    <svg viewBox="0 0 300 20" className="absolute -bottom-2 left-0 w-full" aria-hidden>
                      <motion.path
                        d="M4 14 Q80 2 150 10 T296 8"
                        fill="none"
                        stroke="#FF6B35"
                        strokeWidth={6}
                        strokeLinecap="round"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.8, duration: 0.7 }}
                      />
                    </svg>
                  </span>
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-5 font-display text-xl font-medium text-ink-soft sm:text-2xl">Five strangers are waiting. Take the sixth seat.</p>
        </motion.div>

        <motion.div className="relative mx-auto w-full max-w-[640px] lg:col-start-2 lg:row-span-2 lg:row-start-1" style={scene}>
          <DinnerScene
            analytics
            selected={selected}
            onEngage={() => setHero((h) => (h === "default" ? "engaged" : h))}
            onSeatHover={(on) => setHero((h) => (h === "seatSelected" || h === "conversionReady" ? h : on ? "seatHovered" : "engaged"))}
            onSeatClick={() => takeSeat("seat")}
            onSequenceDone={() => setHero("conversionReady")}
          />
        </motion.div>

        <div id="hero-cta" className="relative z-10 lg:col-start-1 lg:row-start-2 lg:self-start">
          <div className="flex flex-wrap items-center gap-3">
            <motion.div animate={hero === "seatHovered" || ready ? { scale: 1.05 } : { scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 18 }}>
              <Button onClick={() => takeSeat("cta")} size="lg" arrow={ready} className={clsx(ready && "bg-ink! text-cream")}>
                {ready ? "Let's find your table" : "Take a seat"}
              </Button>
            </motion.div>
            <Button href="#how" variant="paper" size="lg">
              See how it works
            </Button>
          </div>
          <p className="mt-5 text-sm text-ink-soft">$15 a dinner · You pick the night, we build the table.</p>
        </div>
      </div>

      <div className="relative -mt-4 aspect-[1024/470] w-full overflow-hidden sm:-mt-10 lg:-mt-24">
        <motion.div className="absolute inset-[-14px]" style={bg}>
          <Image
            src="/art/seattle-skyline.png"
            alt="Illustrated Seattle: the Space Needle below Queen Anne Hill, downtown towers, Smith Tower, the Great Wheel on the waterfront, a ferry on Elliott Bay and Mount Rainier"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_80%]"
          />
        </motion.div>
        <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-cream to-cream/0" />
      </div>
    </section>
  );
}
