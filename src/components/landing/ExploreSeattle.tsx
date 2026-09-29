"use client";

import { useState } from "react";
import { InteractiveLocation } from "@/components/art/InteractiveLocation";
import { LocationDrawer } from "@/components/ui/LocationDrawer";
import { LOCATIONS, type Location } from "@/lib/data";

export function ExploreSeattle() {
  const [open, setOpen] = useState<Location | null>(null);
  return (
    <section className="border-b-[2.5px] border-ink bg-cream-deep py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-blue">Explore Seattle</p>
        <h2 className="mt-1 max-w-2xl text-4xl sm:text-5xl">Four neighborhoods. Lots of tables.</h2>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">Hover around. Tap a neighborhood to see what&apos;s cooking.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          {LOCATIONS.map((l, i) => (
            <InteractiveLocation key={l.id} location={l} tilt={i % 3 === 0 ? -0.8 : 0.8} selected={open?.id === l.id} onSelect={() => setOpen(l)} />
          ))}
        </div>
      </div>
      <LocationDrawer location={open} onClose={() => setOpen(null)} />
    </section>
  );
}
