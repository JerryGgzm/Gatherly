"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { GuestToken } from "@/components/art/GuestToken";
import { DinnerScene } from "@/components/dinner/DinnerScene";
import { CAT_ORDER } from "@/components/dinner/cats";
import { USER_COLOR } from "@/lib/data";

function Panel({
  step,
  title,
  copy,
  color,
  tilt,
  children,
}: {
  step: number;
  title: string;
  copy: string;
  color: string;
  tilt: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex w-[84vw] shrink-0 flex-col rounded-[30px] border-[2.5px] border-ink bg-[#FFFDF7] p-5 shadow-[5px_5px_0_#242424] sm:w-[62vw] sm:p-7 lg:w-[40vw] lg:max-w-[600px]"
      style={{ rotate: `${tilt}deg` }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-[2.5px] border-ink font-display text-lg font-bold" style={{ background: color }}>
          {step}
        </span>
        <h3 className="text-2xl sm:text-3xl">{title}</h3>
      </div>
      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-[22px] border-[2.5px] border-ink" style={{ background: `${color}30` }}>
        {children}
      </div>
      <p className="mt-4 text-base text-ink-soft sm:text-lg">{copy}</p>
    </div>
  );
}

function CalendarScene() {
  const reduce = useReducedMotion();
  const days = Array.from({ length: 18 }, (_, i) => i + 1);
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 p-4">
      <div className="w-[62%] -rotate-2 rounded-2xl border-[2.5px] border-ink bg-white p-3 shadow-[4px_4px_0_#242424]">
        <div className="-mx-3 -mt-3 mb-2 flex items-center justify-between rounded-t-[13px] border-b-[2.5px] border-ink bg-orange px-3 py-1.5 font-display text-sm font-bold text-white">
          OCTOBER <span className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-cream" /><span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-cream" /></span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-display text-[10px] font-bold text-ink-soft sm:text-xs">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
          {[0, 1, 2].map((i) => (
            <span key={`blank-${i}`} />
          ))}
          {days.map((d) => {
            const dow = (d + 2) % 7; // Oct 1 is a Thursday → index 3
            const isThu = dow === 3;
            const isSat = dow === 5;
            const special = isThu || isSat;
            return (
              <motion.span
                key={d}
                whileHover={special && !reduce ? { y: -4, scale: 1.2, rotate: -6 } : undefined}
                className={clsx(
                  "flex aspect-square items-center justify-center rounded-lg text-[11px] sm:text-sm",
                  special ? "cursor-pointer border-2 border-ink font-bold text-ink" : "text-ink/40",
                )}
                style={{ background: isThu ? "#FFD84D" : isSat ? "#9368F7" : undefined, color: isSat ? "#fff" : undefined }}
              >
                {d}
              </motion.span>
            );
          })}
        </div>
      </div>
      <div className="relative w-[26%]">
        <motion.div
          className="absolute -top-6 left-1/2 z-10 -translate-x-1/2 rotate-6 rounded-lg border-2 border-ink bg-lemon px-2 py-0.5 font-display text-xs font-bold shadow-[2px_2px_0_#242424]"
          animate={reduce ? undefined : { y: [0, -6, 0], rotate: [6, -4, 6] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          Sat ✓
        </motion.div>
        <GuestToken kind="you" color={USER_COLOR} className="w-full" />
      </div>
    </div>
  );
}

function BuildTableScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? CAT_ORDER.length : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const timers = CAT_ORDER.map((_, i) => setTimeout(() => setShown(i + 1), 400 + i * 420));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <DinnerScene present={CAT_ORDER.slice(0, shown)} bubbles={false} className="w-[108%] max-w-none" />
      <span className="absolute right-3 top-3 rotate-3 rounded-full border-2 border-ink bg-white px-2.5 py-0.5 font-display text-xs font-bold shadow-[2px_2px_0_#242424]">
        {shown < CAT_ORDER.length ? `Filling seats… ${shown}/6` : "5 of 6 · one seat saved ✨"}
      </span>
    </div>
  );
}

function ShowUpScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const go = inView && !reduce;
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src="/art/restaurant-door.png" alt="" fill sizes="(max-width: 1024px) 80vw, 40vw" className="object-cover object-[50%_40%]" />
      <motion.div
        className="absolute left-[5%] top-[6%] -rotate-3 rounded-xl border-[2.5px] border-ink bg-white px-3 py-2 font-display shadow-[3px_3px_0_#242424]"
        initial={false}
        animate={go ? { rotateY: [90, 0, 0, 90], opacity: [0, 1, 1, 0] } : { rotateY: 0, opacity: 1 }}
        transition={{ duration: 5, times: [0, 0.12, 0.88, 1], repeat: Infinity, repeatDelay: 0.6 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-orange">Revealed · 3 PM</p>
        <p className="text-sm font-bold sm:text-base">📍 Nonna&apos;s Table</p>
      </motion.div>
      <motion.div
        className="absolute bottom-[6%] right-[5%] rotate-6 rounded-full border-[2.5px] border-ink bg-lemon px-3 py-1 font-display text-sm font-bold shadow-[3px_3px_0_#242424]"
        animate={go ? { y: [0, -6, 0], rotate: [6, -3, 6] } : undefined}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🕖 7:00 PM
      </motion.div>
    </div>
  );
}

function MeetScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [match, setMatch] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(() => setMatch((m) => !m), 3200);
    return () => clearInterval(t);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <DinnerScene youSeated className="w-[108%] max-w-none" />
      <AnimatePresence>
        {match && (
          <motion.div
            className="pointer-events-none absolute bottom-[5%] left-1/2 -translate-x-1/2 -rotate-2 whitespace-nowrap rounded-full border-[2.5px] border-ink bg-pink px-3 py-1 font-display text-sm font-bold shadow-[3px_3px_0_#242424]"
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            You 💛 the orange one · it&apos;s a match
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PANELS = [
  { title: "Pick a night", copy: "Thursday or Saturday. Always 7 PM. That's the whole decision.", color: "#FFD84D", tilt: -1, scene: <CalendarScene /> },
  { title: "We build your table", copy: "We mix shared interests with unexpected perspectives. Five seats filled, one saved for you.", color: "#3D7EFF", tilt: 1, scene: <BuildTableScene /> },
  { title: "Show up", copy: "The restaurant is revealed a few hours before. Arrive at 7, find your table.", color: "#FF6B35", tilt: -0.5, scene: <ShowUpScene /> },
  { title: "See who you meet", copy: "Great conversations, no pressure. If you both want to meet again — it's a match.", color: "#63C174", tilt: 1, scene: <MeetScene /> },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const walker = useTransform(scrollYProgress, [0, 1], ["0vw", "88vw"]);
  const roll = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const heading = (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-orange">How it works</p>
      <h2 className="mt-1 text-4xl sm:text-5xl">Book. Show up. Meet people.</h2>
    </div>
  );

  if (reduce) {
    return (
      <section id="how" className="dotted-bg scroll-mt-16 border-b-[2.5px] border-ink py-16">
        {heading}
        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-center gap-8 px-4">
          {PANELS.map((p, i) => (
            <Panel key={p.title} step={i + 1} {...p}>
              {p.scene}
            </Panel>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="how" ref={section} className="dotted-bg relative scroll-mt-16 border-b-[2.5px] border-ink" style={{ height: `calc(${dist}px + 100vh)` }}>
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-center gap-6 overflow-hidden py-6">
        {heading}
        <motion.div ref={track} style={{ x }} className="flex items-center gap-8 px-4 sm:gap-12 sm:px-[8vw]">
          {PANELS.map((p, i) => (
            <Panel key={p.title} step={i + 1} {...p}>
              {p.scene}
            </Panel>
          ))}
          <div className="w-[4vw] shrink-0" />
        </motion.div>
        <div className="relative mx-4 h-16 border-b-[3px] border-dashed border-ink/30 sm:mx-[4vw]">
          <motion.div className="absolute bottom-1 w-10 sm:w-12" style={{ left: walker, rotate: roll }}>
            <GuestToken kind="you" color={USER_COLOR} className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
