"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { SeatHoldBanner } from "@/components/booking/SeatHoldBanner";
import { TicketCard } from "@/components/ui/TicketCard";
import { track } from "@/lib/analytics";
import { bookedId, holdActive, openMatch, seatsLeft, useDinners, useNow, useStartTable, useTakeSeat, type TableSpec } from "@/lib/booking";
import { NIGHTS, nightByKey, nightKey, type Dinner, type Night } from "@/lib/data";
import { useDemo } from "@/lib/store";
import { EmptyTables } from "./EmptyTables";
import { StartTableCard } from "./StartTableCard";
import { StartTableDrawer, type StartDraft } from "./StartTableDrawer";
import { FilterBar } from "./FilterBar";
import { EMPTY_FILTERS, type Filters } from "./filters";
import { TablePreview } from "./TablePreview";

const matches = (f: Filters) => (d: Dinner) =>
  (f.nights.length === 0 || f.nights.includes(nightKey(d))) &&
  (f.areas.length === 0 || f.areas.includes(d.location)) &&
  (f.themes.length === 0 || d.themes.some((t) => f.themes.includes(t))) &&
  (f.budgets.length === 0 || f.budgets.includes(d.budget));

function toQuery(f: Filters) {
  const q = new URLSearchParams();
  if (f.nights.length) q.set("night", f.nights.join(","));
  if (f.areas.length) q.set("area", f.areas.join(","));
  if (f.themes.length) q.set("themes", f.themes.join(","));
  if (f.budgets.length) q.set("budget", f.budgets.join(","));
  const s = q.toString();
  return s ? `/explore?${s}` : "/explore";
}

type Taking = { id: string; stage: "pulling" | "seated"; dest: string };

export function ExploreView({ initial }: { initial: Filters }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { state } = useDemo();
  const now = useNow();
  const { reserve } = useTakeSeat();
  const [filters, setFilters] = useState(initial);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [taking, setTaking] = useState<Taking | null>(null);
  const left = useRef(false);

  const dinners = useDinners();
  const startTable = useStartTable();
  const [draft, setDraft] = useState<StartDraft | null>(null);
  const results = useMemo(() => dinners.filter(matches(filters)), [dinners, filters]);

  const heldId = holdActive(state.hold, now) ? state.hold.dinnerId : null;
  const mine = bookedId(state);
  const isFull = (d: Dinner) => seatsLeft(d, state.hold, now, mine) <= 0 && d.id !== heldId && d.id !== mine;

  const groups = NIGHTS.filter((n) => filters.nights.length === 0 || filters.nights.includes(nightKey(n))).map((n) => {
    const list = results.filter((d) => nightKey(d) === nightKey(n));
    const allFull = list.length > 0 && list.every(isFull);
    return {
      night: n,
      key: nightKey(n),
      label: `${n.dayLabel} · ${n.month.charAt(0)}${n.month.slice(1).toLowerCase()} ${n.day}`,
      dinners: list,
      canStart: list.length === 0 || allFull,
      reason: list.length === 0 ? ("empty" as const) : ("full" as const),
      status: list.length === 0 ? "No tables yet" : allFull ? "All full" : `${list.length} ${list.length === 1 ? "table" : "tables"}`,
    };
  });

  const findOpen = (spec: TableSpec) => openMatch(dinners, spec, state.hold, now);

  const preview =
    dinners.find((d) => d.id === (taking?.id ?? previewId)) ?? results.find((d) => d.id === heldId) ?? results.find((d) => !isFull(d)) ?? results[0];

  const openStart = (night: Night | null) => {
    const picked = filters.nights.length === 1 ? nightByKey(filters.nights[0]) : undefined;
    setDraft({
      night: night ?? picked ?? null,
      lockNight: !!night,
      area: filters.areas.length === 1 ? filters.areas[0] : null,
      themes: filters.themes,
      budget: filters.budgets.length === 1 ? filters.budgets[0] : null,
    });
  };

  const onStart = (spec: TableSpec) => {
    const d = startTable(spec);
    setDraft(null);
    if (d) setTimeout(() => takeSeat(d), 350);
  };

  useEffect(() => {
    if (results.length === 0) track("explore_empty_state", { filters: toQuery(filters) });
  }, [results.length, filters]);

  const leave = (dest: string) => {
    if (left.current) return;
    left.current = true;
    router.push(dest);
  };

  useEffect(() => {
    if (!taking || taking.stage !== "pulling") return;
    const seat = setTimeout(() => setTaking((t) => t && { ...t, stage: "seated" }), 650);
    return () => clearTimeout(seat);
  }, [taking]);

  useEffect(() => {
    if (!taking) return;
    const fallback = setTimeout(() => leave(taking.dest), dinners.find((d) => d.id === taking.id)?.seatsTaken ? 2400 : 1500);
    return () => clearTimeout(fallback);
    // Only (re)arm when a new take-seat sequence starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taking?.id]);

  const change = (next: Filters) => {
    setFilters(next);
    setPreviewId(null);
    window.history.replaceState(null, "", toQuery(next));
    track("explore_filter_change", {
      nights: next.nights.join(","),
      areas: next.areas.join(","),
      themes: next.themes.join(","),
      budgets: next.budgets.join(","),
    });
  };

  const takeSeat = (d: Dinner) => {
    if (taking) return;
    const dest = reserve(d);
    if (reduce || !window.matchMedia("(min-width: 1024px)").matches) return leave(dest);
    setPreviewId(d.id);
    setTaking({ id: d.id, stage: "pulling", dest });
  };

  const hasHold = !!state.hold && !!now;
  const hasFilters = filters.areas.length + filters.themes.length + filters.budgets.length > 0;

  return (
    <>
      <SeatHoldBanner showContinue />

      <section className="dotted-bg border-b-[2.5px] border-ink">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-blue">Explore</p>
          <h1 className="mt-1 text-5xl sm:text-6xl">Pick a night.</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-soft">You choose the night and the neighborhood. We choose the five people across the table.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["🕖 Always 7:00 PM", "🪑 Six seats per table", "🎟️ $15 to book · food is split at dinner"].map((t, i) => (
              <span
                key={t}
                className="rounded-full border-2 border-ink bg-white px-3 py-1 font-display text-sm font-semibold shadow-[2px_2px_0_#242424]"
                style={{ rotate: `${[-1, 0.8, -0.6][i]}deg` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-10">
          <FilterBar value={filters} onChange={change} count={results.length} />

          {results.length === 0 && filters.nights.length === 0 ? (
            <EmptyTables onStart={() => openStart(null)} onClear={() => change(EMPTY_FILTERS)} />
          ) : (
            <div className="flex flex-col gap-10" onMouseLeave={() => !taking && setPreviewId(null)}>
              <AnimatePresence initial={false}>
                {groups.map((g) => (
                  <motion.div
                    key={g.key}
                    layout={!reduce}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl">{g.label}</h2>
                      <span className="h-0.5 flex-1 rounded-full bg-ink/15" />
                      <span className="font-display text-sm font-semibold text-ink-soft">{g.status}</span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {g.dinners.map((d, i) => (
                        <TicketCard
                          key={d.id}
                          dinner={d}
                          now={now}
                          tilt={i % 2 ? 0.7 : -0.7}
                          onTakeSeat={takeSeat}
                          pending={taking?.id === d.id}
                          onPreview={(x) => !taking && setPreviewId(x?.id ?? null)}
                        />
                      ))}
                      {g.canStart && <StartTableCard night={g.night} reason={g.reason} filtered={hasFilters} onStart={() => openStart(g.night)} />}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <aside className="hidden lg:block" aria-label="Table preview">
          <div className={clsx("sticky", hasHold ? "top-36" : "top-24")}>
            {preview && (
              <TablePreview
                dinner={preview}
                heldForYou={heldId === preview.id}
                seatsOpen={seatsLeft(preview, state.hold, now, mine)}
                taking={taking?.id === preview.id ? taking.stage : "idle"}
                onTakeSeat={() => takeSeat(preview)}
                onSequenceDone={() => taking && setTimeout(() => leave(taking.dest), 250)}
              />
            )}
          </div>
        </aside>
      </section>

      <StartTableDrawer
        draft={draft}
        findOpen={findOpen}
        onClose={() => setDraft(null)}
        onStart={onStart}
        onJoin={(d) => {
          setDraft(null);
          setTimeout(() => takeSeat(d), 350);
        }}
      />
    </>
  );
}
