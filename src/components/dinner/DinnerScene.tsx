"use client";

import clsx from "clsx";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { CatBody, CatPaws, makeRig, type Gaze, type Rig } from "./CatCharacter";
import { CAT_ORDER, CATS, SEATS, USER_SEAT, VIEW_H, VIEW_W, headOf, type CatId } from "./cats";
import { CALICO_FORK, CALICO_SPOON, EmptyChair, PatioFloor, StringLights, TableBase, TableTop, makeTableRig } from "./DinnerTable";
import { IDLE, REACTIONS, sleep, type Point, type Reaction, type ReactionCtx } from "./reactions";

export type CatState = "idle" | "hover" | "reacting" | "cooldown" | "rareReaction";

type Runtime = { state: CatState; clicks: number; lastClick: number; sec: number };

type Props = {
  interactive?: boolean;
  youSeated?: boolean;
  present?: CatId[];
  selected?: boolean;
  seatLabel?: string;
  showSeatLabel?: boolean;
  bubbles?: boolean;
  idle?: boolean;
  analytics?: boolean;
  onEngage?: () => void;
  onSeatHover?: (hovered: boolean) => void;
  onSeatClick?: () => void;
  onSequenceDone?: () => void;
  className?: string;
};

const BACK: CatId[] = CAT_ORDER.filter((id) => SEATS[id].back);
const FRONT: CatId[] = CAT_ORDER.filter((id) => !SEATS[id].back);
const SESSION_GAP = 8000;
const COOLDOWN = 400;

const POINTS: ReactionCtx["points"] = {
  seat: { x: USER_SEAT.x, y: USER_SEAT.y - 20 },
  fork: CALICO_FORK,
  spoon: CALICO_SPOON,
  head: headOf,
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

function hitBox(id: CatId) {
  const s = SEATS[id];
  const w = Math.max(120 * s.s, 100);
  const top = s.y - 158 * s.s;
  const bottom = s.back ? s.y - 14 : s.y + 12;
  return { left: pct(s.x - w / 2, VIEW_W), top: pct(top, VIEW_H), width: pct(w, VIEW_W), height: pct(bottom - top, VIEW_H) };
}

export function DinnerScene({
  interactive = true,
  youSeated = false,
  present = CAT_ORDER,
  selected = false,
  seatLabel = "Your seat",
  showSeatLabel = true,
  bubbles = true,
  idle = true,
  analytics = false,
  onEngage,
  onSeatHover,
  onSeatClick,
  onSequenceDone,
  className,
}: Props) {
  const reduce = !!useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.25 });

  const [rigs] = useState(() => Object.fromEntries(CAT_ORDER.map((id) => [id, makeRig()])) as Record<CatId, Rig>);
  const [table] = useState(makeTableRig);
  const [hovered, setHovered] = useState<CatId | "seat" | null>(null);
  const [pointer, setPointer] = useState<Point | null>(null);
  const [overrides, setOverrides] = useState<Partial<Record<CatId, Point>>>({});
  const [bubble, setBubble] = useState<{ id: CatId; text: string; key: number } | null>(null);

  const runtime = useRef<Record<CatId, Runtime>>(
    Object.fromEntries(CAT_ORDER.map((id) => [id, { state: "idle", clicks: 0, lastClick: 0, sec: 0 }])) as Record<CatId, Runtime>,
  );
  const busy = useRef(false);
  const sessionClicks = useRef(0);
  const lookTokens = useRef<Partial<Record<CatId, number>>>({});
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef<number | null>(null);
  const doneRef = useRef(onSequenceDone);
  const presentRef = useRef(present);

  useEffect(() => {
    doneRef.current = onSequenceDone;
    presentRef.current = present;
  });

  useEffect(() => {
    const all = [...CAT_ORDER.flatMap((id) => Object.values(rigs[id])), ...Object.values(table)];
    const unmounts = all.map((c) => c.mount());
    return () => unmounts.forEach((u) => u());
  }, [rigs, table]);

  const emit = useCallback(
    (event: Parameters<typeof track>[0], props?: Parameters<typeof track>[1]) => {
      if (analytics) track(event, props);
    },
    [analytics],
  );

  const look = useCallback((id: CatId, target: Point, ms: number) => {
    const token = Math.random();
    lookTokens.current[id] = token;
    setOverrides((o) => ({ ...o, [id]: target }));
    setTimeout(() => {
      if (lookTokens.current[id] !== token) return;
      setOverrides((o) => {
        const n = { ...o };
        delete n[id];
        return n;
      });
    }, ms);
  }, []);

  const say = useCallback(
    (id: CatId, text?: string) => {
      if (!text || !bubbles) return;
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      setBubble({ id, text, key: Date.now() });
      bubbleTimer.current = setTimeout(() => setBubble(null), 1500);
    },
    [bubbles],
  );

  const ctx = useCallback(
    (id: CatId): ReactionCtx => ({
      rig: rigs[id],
      rigs,
      table,
      look,
      points: POINTS,
      maybe: (p, run) => {
        if (Math.random() >= (isTouch() ? p / 2 : p)) return false;
        run();
        emit("hero_cross_cat_reaction", { cat_id: id });
        return true;
      },
    }),
    [rigs, table, look, emit],
  );

  const play = useCallback(
    async (id: CatId, reaction: Reaction, rare: boolean) => {
      const r = runtime.current[id];
      r.state = rare ? "rareReaction" : "reacting";
      say(id, reaction.bubble);
      try {
        await reaction.run(ctx(id));
      } finally {
        r.state = "cooldown";
        await sleep(COOLDOWN);
        r.state = "idle";
      }
    },
    [ctx, say],
  );

  const clickCat = (id: CatId, now: number) => {
    const r = runtime.current[id];
    if (busy.current || r.state === "reacting" || r.state === "rareReaction" || r.state === "cooldown") return;
    onEngage?.();
    if (now - r.lastClick > SESSION_GAP) r.clicks = 0;
    r.clicks += 1;
    r.lastClick = now;
    sessionClicks.current += 1;

    const set = REACTIONS[id];
    let reaction: Reaction;
    let rare = false;
    if (r.clicks === 1) reaction = set.signature;
    else if (r.clicks >= 5) {
      reaction = set.rare;
      rare = true;
      r.clicks = 1;
    } else {
      reaction = set.secondary[r.sec % set.secondary.length];
      r.sec += 1;
    }
    emit("hero_cat_click", { cat_id: id, reaction_id: reaction.id, session_click_count: sessionClicks.current });
    if (rare) emit("hero_cat_rare_reaction", { cat_id: id, reaction_id: reaction.id });
    void play(id, reaction, rare);
  };

  useEffect(() => {
    if (!idle || reduce || !inView) return;
    const timers: Partial<Record<CatId, ReturnType<typeof setTimeout>>> = {};
    const schedule = (id: CatId, first: boolean) => {
      const delay = first ? 1200 + Math.random() * 5000 : 4000 + Math.random() * 6000;
      timers[id] = setTimeout(() => {
        const r = runtime.current[id];
        if ((r.state === "idle" || r.state === "hover") && !busy.current && presentRef.current.includes(id)) {
          void IDLE[Math.floor(Math.random() * IDLE.length)](ctx(id), id);
        }
        schedule(id, false);
      }, delay);
    };
    CAT_ORDER.forEach((id) => schedule(id, true));
    return () => CAT_ORDER.forEach((id) => clearTimeout(timers[id]));
  }, [idle, reduce, inView, ctx]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    busy.current = true;
    (async () => {
      await sleep(380);
      if (cancelled) return;
      say("orange", "Hey, you made it.");
      await Promise.all([
        REACTIONS.orange.signature.run(ctx("orange")),
        sleep(250).then(() => rigs.gray.eyes.start({ scaleY: [1, 0.1, 0.1, 1], transition: { duration: 0.9 } })),
      ]);
      if (cancelled) return;
      busy.current = false;
      doneRef.current?.();
    })();
    return () => {
      cancelled = true;
      busy.current = false;
    };
  }, [selected, ctx, say, rigs]);

  const clickSeat = () => {
    emit("hero_empty_seat_click");
    if (onSeatClick) return onSeatClick();
    CAT_ORDER.forEach((id) => look(id, POINTS.seat, 1400));
    const r = runtime.current.orange;
    if (r.state === "idle" || r.state === "hover") void play("orange", REACTIONS.orange.signature, false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!hovered || hovered === "seat" || raf.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEW_W;
    const y = ((e.clientY - rect.top) / rect.height) * VIEW_H;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      setPointer({ x, y });
    });
  };

  const hoverCat = (id: CatId | null) => {
    setHovered(id);
    if (!id) setPointer(null);
    else emit("hero_cat_hover", { cat_id: id });
  };

  const hoverSeat = (on: boolean) => {
    setHovered(on ? "seat" : null);
    onSeatHover?.(on);
    if (on) emit("hero_empty_seat_hover");
  };

  const gazeFor = (id: CatId): Gaze => {
    if (selected) return "viewer";
    if (overrides[id]) return overrides[id]!;
    if (hovered === "seat") return POINTS.seat;
    if (hovered === id && pointer) return pointer;
    return null;
  };

  const seatHot = hovered === "seat" || selected;
  const layer = (id: CatId) => ({
    def: CATS[id],
    seat: SEATS[id],
    rig: rigs[id],
    gaze: gazeFor(id),
    hovered: hovered === id,
    present: present.includes(id),
    reduce,
    uid,
  });

  return (
    <motion.div
      ref={box}
      className={clsx("relative aspect-[4/3] w-full select-none", className)}
      animate={{ scale: selected ? 1.03 : 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      onPointerMove={onPointerMove}
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <PatioFloor uid={uid} />
        <StringLights bright={seatHot} />
        {BACK.map((id) => (
          <CatBody key={id} {...layer(id)} />
        ))}
        <TableBase />
        <TableTop rig={table} glow={seatHot} youSeated={youSeated} />
        {BACK.map((id) => (
          <CatPaws key={id} {...layer(id)} />
        ))}
        {FRONT.map((id) => (
          <g key={id}>
            <CatBody {...layer(id)} />
            <CatPaws {...layer(id)} />
          </g>
        ))}
        <EmptyChair out={seatHot} youSeated={youSeated} />
      </svg>

      {interactive &&
        CAT_ORDER.filter((id) => present.includes(id)).map((id) => (
          <button
            key={id}
            type="button"
            aria-label={CATS[id].aria}
            className="cursor-paw absolute rounded-[40%] outline-none focus-visible:ring-4 focus-visible:ring-orange focus-visible:ring-offset-2"
            style={hitBox(id)}
            onClick={(e) => clickCat(id, e.timeStamp)}
            onMouseEnter={() => hoverCat(id)}
            onMouseLeave={() => hoverCat(null)}
            onFocus={() => setHovered(id)}
            onBlur={() => setHovered(null)}
          />
        ))}

      {interactive && !youSeated && (
        <button
          type="button"
          aria-label="Take the empty seat and start finding a dinner"
          className="absolute rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-orange focus-visible:ring-offset-2"
          style={{ left: pct(USER_SEAT.x - 62, VIEW_W), top: pct(USER_SEAT.y - 36, VIEW_H), width: pct(124, VIEW_W), height: pct(118, VIEW_H) }}
          onClick={clickSeat}
          onMouseEnter={() => hoverSeat(true)}
          onMouseLeave={() => hoverSeat(false)}
          onFocus={() => hoverSeat(true)}
          onBlur={() => hoverSeat(false)}
        />
      )}

      {showSeatLabel && !youSeated && (
        <motion.span
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-lemon px-2.5 py-0.5 font-display text-[11px] font-bold shadow-[2px_2px_0_#242424] sm:text-xs"
          style={{ left: "50%", top: pct(USER_SEAT.y + 86, VIEW_H) }}
          animate={{ scale: seatHot ? 1.08 : 1, y: seatHot ? 4 : 0 }}
        >
          {seatLabel}
        </motion.span>
      )}

      <AnimatePresence>
        {CAT_ORDER.map((id) => {
          const talking = bubble?.id === id;
          const labelled = interactive && hovered === id && !talking;
          if (!talking && !labelled) return null;
          const s = SEATS[id];
          return (
            <motion.div
              key={talking ? `b-${bubble!.key}` : `l-${id}`}
              className="pointer-events-none absolute z-20"
              style={{ left: pct(s.x, VIEW_W), top: pct(s.y - 150 * s.s, VIEW_H) }}
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.16 }}
            >
              <div
                className={clsx(
                  "-translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl border-[2.5px] border-ink font-display font-semibold shadow-[2px_2px_0_#242424]",
                  talking ? "bg-white px-3 py-1 text-sm sm:text-base" : "bg-ink px-2.5 py-0.5 text-[11px] text-cream sm:text-xs",
                )}
              >
                {talking ? bubble!.text : CATS[id].label}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
