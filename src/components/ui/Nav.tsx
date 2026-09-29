"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { useDemo } from "@/lib/store";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/#how", label: "How it works" },
  { href: "/my-dinner", label: "My dinners" },
  { href: "/connections", label: "Connections" },
  { href: "/profile", label: "Profile" },
];

const FLOW_PREFIXES = ["/signup", "/onboarding", "/book"];

export function useIsFlowRoute() {
  const path = usePathname();
  return FLOW_PREFIXES.some((p) => path.startsWith(p));
}

export function TopNav() {
  const path = usePathname();
  const { state } = useDemo();
  const flow = useIsFlowRoute();
  const onLanding = path === "/";
  const [pastHeroCta, setPastHeroCta] = useState(false);

  useEffect(() => {
    if (!onLanding) return;
    const el = document.getElementById("hero-cta");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPastHeroCta(!e.isIntersecting && e.boundingClientRect.top < 64), {
      rootMargin: "-64px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onLanding]);

  const showCta = onLanding ? pastHeroCta : !path.startsWith("/explore");

  return (
    <header className="sticky top-0 z-50 border-b-[2.5px] border-ink bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        {!flow && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((l) => {
              const active = l.href !== "/#how" && path.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={clsx(
                    "relative rounded-full px-3 py-2 font-display text-[15px] font-semibold transition-colors hover:bg-lemon",
                    active && "bg-ink text-cream hover:bg-ink",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        )}
        <div className="flex items-center gap-2">
          {state.credits > 0 && (
            <span className="hidden rounded-full border-2 border-ink bg-grass-soft px-3 py-1 font-display text-xs font-bold sm:inline">
              ${state.credits} credit
            </span>
          )}
          {!flow ? (
            <AnimatePresence initial={false}>
              {showCta && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  <Button href="/explore" size="sm" arrow>
                    Find a table
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <Link href="/" className="font-display text-sm font-semibold text-ink-soft hover:text-ink">
              Exit
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const TAB_ICONS: Record<string, React.ReactNode> = {
  explore: (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
      <path d="M3 25 V12 h6 v13 M9 25 V6 h8 v19 M17 25 V14 h8 v11" fill="#FFD84D" stroke="#242424" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M12 10h2 M12 14h2 M12 18h2" stroke="#242424" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  dinner: (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
      <ellipse cx={14} cy={15} rx={9} ry={6} fill="#FF6B35" stroke="#242424" strokeWidth={2.2} />
      {[
        [14, 4], [25, 10], [25, 21], [14, 26], [3, 21], [3, 10],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.2} fill="#FFFFFF" stroke="#242424" strokeWidth={1.8} />
      ))}
    </svg>
  ),
  connections: (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
      <circle cx={10} cy={10} r={4.5} fill="#63C174" stroke="#242424" strokeWidth={2.2} />
      <circle cx={19} cy={11} r={4} fill="#9368F7" stroke="#242424" strokeWidth={2.2} />
      <path d="M2 25 q1-8 8-8 q7 0 8 8Z M14 25 q1-7 6-7 q6 0 7 7Z" fill="#FFFFFF" stroke="#242424" strokeWidth={2.2} strokeLinejoin="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
      <circle cx={14} cy={14} r={11} fill="#FFD84D" stroke="#242424" strokeWidth={2.2} />
      <circle cx={10.5} cy={12} r={1.5} fill="#242424" />
      <circle cx={17.5} cy={12} r={1.5} fill="#242424" />
      <path d="M9.5 17 q4.5 4 9 0" fill="none" stroke="#242424" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
};

const TABS = [
  { href: "/explore", label: "Explore", icon: "explore" },
  { href: "/my-dinner", label: "My Dinner", icon: "dinner" },
  { href: "/connections", label: "Connections", icon: "connections" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

export function BottomNav() {
  const path = usePathname();
  const flow = useIsFlowRoute();
  if (flow) return null;
  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-[26px] border-[2.5px] border-ink bg-white shadow-[4px_4px_0_#242424] lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((t) => {
        const active = path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className="relative flex min-h-16 flex-col items-center justify-center gap-0.5 font-display text-[11px] font-bold">
            {active && (
              <motion.span layoutId="tab-pill" className="absolute inset-1.5 rounded-[20px] bg-lemon" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            )}
            <motion.span className="relative" whileTap={{ scale: 0.85 }} animate={active ? { y: -2 } : { y: 0 }}>
              {TAB_ICONS[t.icon]}
            </motion.span>
            <span className="relative">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
