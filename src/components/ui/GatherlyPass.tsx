"use client";

import clsx from "clsx";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

export function GatherlyPass({ name, className, active = false }: { name?: string; className?: string; active?: boolean }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const lightsX = useTransform(sry, [-12, 12], ["-8%", "8%"]);

  return (
    <div className={clsx("[perspective:900px]", className)}>
      <motion.div
        onMouseMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 24);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
        }}
        onMouseLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.6/1] w-full overflow-hidden rounded-[26px] border-[2.5px] border-ink bg-night text-cream shadow-[6px_6px_0_#242424]"
      >
        <motion.div className="absolute inset-0" style={{ x: lightsX }} aria-hidden>
          <svg viewBox="0 0 320 200" className="absolute bottom-0 h-[70%] w-[120%] -translate-x-[8%]" preserveAspectRatio="xMidYMax slice">
            {[
              [10, 80, 36], [50, 50, 30], [84, 96, 40], [128, 40, 26], [158, 70, 44], [206, 30, 30], [240, 86, 36], [280, 60, 34],
            ].map(([x, h, w], i) => (
              <g key={i}>
                <rect x={x} y={200 - h - 40} width={w} height={h + 40} fill={["#3A2F6B", "#4B3C8A", "#35295E"][i % 3]} stroke="#242424" strokeWidth={2} />
                {Array.from({ length: Math.floor(h / 18) }, (_, r) =>
                  Array.from({ length: Math.floor(w / 12) }, (_, c) => (
                    <rect
                      key={`${r}-${c}`}
                      x={x + 4 + c * 12}
                      y={200 - h - 32 + r * 18}
                      width={5}
                      height={7}
                      fill={(r + c + i) % 3 === 0 ? "#FFD84D" : "#5B4B9A"}
                      className={(r + c + i) % 5 === 0 ? "animate-flicker" : undefined}
                    />
                  )),
                )}
              </g>
            ))}
            <path d="M296 30 L300 4 L304 30 Z M292 30 h16 v6 h-16z M298 36 v60 M302 36 v60" stroke="#FFF7E8" strokeWidth={2} fill="#FFF7E8" opacity={0.7} />
          </svg>
        </motion.div>
        <div className="relative flex h-full flex-col justify-between p-5 sm:p-6" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start justify-between">
            <div className="font-display leading-none">
              <span className="text-xl font-bold">Gatherly</span>
              <span className="mx-[2px] inline-block h-2 w-2 rounded-full bg-orange" />
              <span className="text-xs font-semibold text-lemon">pub</span>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream/70">Gatherly Pass</div>
            </div>
            <span className={clsx("rounded-full border-2 border-ink px-2.5 py-0.5 font-display text-[11px] font-bold", active ? "bg-grass text-ink" : "bg-lemon text-ink")}>
              {active ? "ACTIVE" : "MONTHLY"}
            </span>
          </div>
          <div>
            <div className="font-display text-sm text-cream/70">{name ? `${name}'s pass` : "Your name here"}</div>
            <div className="font-display text-xl font-bold sm:text-2xl">Unlimited dinners this month</div>
            <div className="mt-1 font-display text-lemon">
              <span className="text-2xl font-bold">$30</span> / month
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
