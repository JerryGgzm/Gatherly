"use client";

import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

type InputProps = Omit<React.ComponentProps<"input">, "className"> & {
  label: string;
  hint?: React.ReactNode;
  error?: string | null;
  trailing?: React.ReactNode;
};

export function TextField({ label, hint, error, trailing, ...rest }: InputProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-sm font-bold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${id}-d` : undefined}
          className={clsx(
            "min-h-12 w-full rounded-2xl border-[2.5px] border-ink bg-white px-4 font-sans text-base outline-none transition-shadow placeholder:text-ink-soft/60 focus:shadow-[3px_3px_0_#242424]",
            error && "border-orange",
            trailing && "pr-20",
          )}
          {...rest}
        />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
      {(error || hint) && (
        <p id={`${id}-d`} className={clsx("text-sm", error ? "font-semibold text-orange" : "text-ink-soft")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function TextArea({ label, hint, ...rest }: Omit<React.ComponentProps<"textarea">, "className"> & { label: string; hint?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-sm font-bold">
        {label}
      </label>
      <textarea
        id={id}
        className="min-h-24 w-full rounded-2xl border-[2.5px] border-ink bg-white px-4 py-3 font-sans text-base outline-none transition-shadow placeholder:text-ink-soft/60 focus:shadow-[3px_3px_0_#242424]"
        {...rest}
      />
      {hint && <p className="text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}

/** Big tappable answer card with an emoji "illustration"; bounces and flashes when picked. */
export function ChoiceCard({
  art,
  label,
  sub,
  selected,
  onClick,
  color = "#FFD84D",
  tilt = 0,
  multi = false,
  className,
}: {
  art: string;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
  color?: string;
  tilt?: number;
  multi?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      style={{ rotate: tilt, background: selected ? color : undefined }}
      whileHover={reduce ? undefined : { y: -4, rotate: tilt * -1 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      animate={selected && !reduce ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 20, scale: { duration: 0.3 } }}
      className={clsx(
        "group relative flex min-h-16 w-full items-center gap-4 rounded-[22px] border-[2.5px] border-ink p-4 text-left transition-[box-shadow,background-color] duration-150",
        selected ? "shadow-[5px_5px_0_#242424]" : "bg-white shadow-[3px_3px_0_#242424] hover:shadow-[5px_5px_0_#242424]",
        className,
      )}
    >
      <motion.span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-2xl"
        animate={selected && !reduce ? { rotate: [0, -12, 10, 0] } : { rotate: 0 }}
        transition={{ duration: 0.45 }}
        aria-hidden
      >
        {art}
      </motion.span>
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-base font-bold sm:text-lg">{label}</span>
        {sub && <span className="text-sm text-ink-soft">{sub}</span>}
      </span>
      {selected && (
        <span
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink font-display text-sm font-bold text-cream"
          aria-hidden
        >
          ✓
        </span>
      )}
    </motion.button>
  );
}
