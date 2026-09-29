"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "paper" | "dark" | "lemon" | "quiet";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-orange text-white",
  secondary: "bg-blue text-white",
  paper: "bg-white text-ink",
  dark: "bg-ink text-cream",
  lemon: "bg-lemon text-ink",
  quiet: "bg-transparent text-ink shadow-none! border-transparent! hover:bg-ink/5",
};

const SIZE: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  arrow?: boolean;
  disabled?: boolean;
};

type AsLink = Common & { href: string; onClick?: () => void; type?: never };
type AsButton = Common & { href?: undefined; onClick?: () => void; type?: "button" | "submit" };

const MotionLink = motion.create(Link);

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", className, children, arrow, disabled } = props;
  const reduce = useReducedMotion();
  const classes = clsx(
    "group relative inline-flex select-none items-center justify-center gap-2 rounded-full border-[2.5px] border-ink font-display font-semibold shadow-[4px_4px_0_#242424] transition-shadow duration-150 hover:shadow-[6px_6px_0_#242424] active:shadow-[1px_1px_0_#242424]",
    VARIANT[variant],
    SIZE[size],
    disabled && "pointer-events-none opacity-50",
    className,
  );
  const motionProps = reduce
    ? {}
    : {
        whileHover: { x: -2, y: -2, scale: 1.03, rotate: -1 },
        whileTap: { x: 2, y: 2, scale: 0.98, rotate: 0 },
        transition: { type: "spring" as const, stiffness: 500, damping: 22 },
      };
  const inner = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );
  if (props.href !== undefined) {
    return (
      <MotionLink href={props.href} onClick={props.onClick} className={classes} aria-disabled={disabled} {...motionProps}>
        {inner}
      </MotionLink>
    );
  }
  return (
    <motion.button type={props.type ?? "button"} onClick={props.onClick} disabled={disabled} className={classes} {...motionProps}>
      {inner}
    </motion.button>
  );
}

export function Pill({ className, ...rest }: ComponentProps<"span">) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-xs font-semibold uppercase tracking-wide",
        className,
      )}
      {...rest}
    />
  );
}
