import type { CatId } from "./cats";
import type { Controls, Rig } from "./CatCharacter";
import type { TableRig } from "./DinnerTable";

export type Point = { x: number; y: number };

export type ReactionCtx = {
  rig: Rig;
  rigs: Record<CatId, Rig>;
  table: TableRig;
  /** Temporarily point one cat's gaze somewhere. */
  look: (id: CatId, target: Point, ms: number) => void;
  /** Run a neighbour reaction with the given probability; returns whether it fired. */
  maybe: (probability: number, run: () => void) => boolean;
  points: { seat: Point; fork: Point; spoon: Point; head: (id: CatId) => Point };
};

export type Reaction = {
  id: string;
  bubble?: string;
  run: (ctx: ReactionCtx) => Promise<unknown>;
};

export type CatReactions = {
  signature: Reaction;
  secondary: Reaction[];
  rare: Reaction;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Frames = Record<string, number[]>;
export const k = (c: Controls, frames: Frames, ms: number, times?: number[]) =>
  c.start({ ...frames, transition: { duration: ms / 1000, ease: "easeInOut", times } });

const blink = (r: Rig, ms = 180) => k(r.eyes, { scaleY: [1, 0.1, 1] }, ms);
const slowBlink = (r: Rig) => k(r.eyes, { scaleY: [1, 0.1, 0.1, 1] }, 900, [0, 0.35, 0.7, 1]);
const tailFlick = (r: Rig, amt = 12) => k(r.tail, { rotate: [0, amt, -amt / 2, 0] }, 500);
const earTwitch = (r: Rig, ear: "earL" | "earR" = "earR") => k(r[ear], { rotate: [0, -16, 6, 0] }, 380);

export const REACTIONS: Record<CatId, CatReactions> = {
  orange: {
    signature: {
      id: "wave",
      bubble: "Hey, you made it.",
      run: async (c) => {
        c.maybe(0.3, () => {
          c.look("tuxedo", c.points.head("orange"), 1100);
          void sleep(500).then(() => tailFlick(c.rigs.tuxedo, 8));
        });
        await Promise.all([
          k(c.rig.body, { y: [0, -5, -5, 0] }, 1000),
          k(c.rig.head, { rotate: [0, -3, 2, 0] }, 1000),
          k(c.rig.pawR, { y: [0, -44, -44, -44, -44, 0], rotate: [0, -24, 8, -24, 8, 0] }, 1100),
        ]);
      },
    },
    secondary: [
      { id: "tailTap", run: (c) => k(c.rig.tail, { rotate: [0, 22, -2, 22, -2, 0] }, 800) },
      {
        id: "lookSeat",
        run: async (c) => {
          c.look("orange", c.points.seat, 900);
          await Promise.all([earTwitch(c.rig, "earL"), k(c.rig.body, { y: [0, -3, 0] }, 700)]);
          await sleep(300);
        },
      },
      {
        id: "sniff",
        run: (c) =>
          Promise.all([k(c.rig.head, { y: [0, 7, 5, 7, 0], rotate: [0, 0, 2, -2, 0] }, 900), k(c.rig.body, { y: [0, 3, 3, 0] }, 900)]),
      },
    ],
    rare: {
      id: "bigWave",
      bubble: "Hey, you made it.",
      run: (c) =>
        Promise.all([
          k(c.rig.body, { y: [0, -18, -18, -18, 0] }, 1800),
          k(c.rig.pawL, { y: [0, -46, -46, -46, 0], rotate: [0, 24, -8, 24, 0] }, 1800),
          k(c.rig.pawR, { y: [0, -46, -46, -46, 0], rotate: [0, -24, 8, -24, 0] }, 1800),
          k(c.table.dishes, { x: [0, -2, 2, -2, 2, 0] }, 700),
        ]),
    },
  },

  tuxedo: {
    signature: {
      id: "judge",
      bubble: "…yes?",
      run: async (c) => {
        await sleep(300);
        await Promise.all([
          k(c.rig.head, { rotate: [0, 10, 10, 0] }, 1100, [0, 0.35, 0.8, 1]),
          k(c.rig.eyes, { scaleY: [1, 0.62, 0.62, 1] }, 1100, [0, 0.35, 0.8, 1]),
          sleep(700).then(() => tailFlick(c.rig, 10)),
        ]);
      },
    },
    secondary: [
      { id: "earSwivel", run: (c) => k(c.rig.earR, { rotate: [0, -28, -28, 0] }, 800, [0, 0.25, 0.75, 1]) },
      {
        id: "glanceOrange",
        run: async (c) => {
          c.look("tuxedo", c.points.head("orange"), 600);
          await sleep(900);
        },
      },
      { id: "slowBlink", run: (c) => slowBlink(c.rig) },
    ],
    rare: {
      id: "turnAway",
      run: (c) =>
        Promise.all([
          k(c.rig.body, { rotate: [0, -7, -7, -2, 0] }, 2200, [0, 0.15, 0.68, 0.8, 1]),
          k(c.rig.face, { x: [0, -11, -11, -11, 0] }, 2200, [0, 0.15, 0.68, 0.82, 1]),
          sleep(1500).then(() => k(c.rig.eyes, { scaleY: [1, 0.6, 0.6] }, 400)),
          sleep(2000).then(() => k(c.rig.eyes, { scaleY: [0.6, 1] }, 200)),
        ]),
    },
  },

  white: {
    signature: {
      id: "shades",
      bubble: "Nice choice.",
      run: async (c) => {
        c.maybe(0.3, () => {
          c.look("orange", c.points.head("white"), 1200);
          void earTwitch(c.rigs.orange, "earR");
        });
        await Promise.all([
          k(c.rig.pawL, { y: [0, -40, -40, 0] }, 700, [0, 0.4, 0.7, 1]),
          k(c.rig.acc, { y: [0, 21, 21, 21, 0] }, 1200, [0, 0.3, 0.5, 0.82, 1]),
          k(c.rig.head, { rotate: [0, 0, 7, 7, 0] }, 1200, [0, 0.3, 0.45, 0.8, 1]),
        ]);
      },
    },
    secondary: [
      {
        id: "overShades",
        run: (c) => Promise.all([k(c.rig.acc, { y: [0, 12, 12, 0] }, 900), k(c.rig.head, { y: [0, 3, 3, 0] }, 900)]),
      },
      { id: "headShake", run: (c) => k(c.rig.head, { rotate: [0, -7, 7, -4, 0] }, 600) },
      { id: "fluffTail", run: (c) => k(c.rig.tail, { rotate: [0, 18, -12, 10, 0] }, 800) },
    ],
    rare: {
      id: "shadesSlip",
      run: (c) =>
        Promise.all([
          k(c.rig.acc, { y: [0, 21, 30, 30, 30, 0] }, 2100, [0, 0.2, 0.32, 0.6, 0.72, 0.9]),
          k(c.rig.pawL, { y: [0, 0, 0, -40, -40, 0] }, 2100, [0, 0.2, 0.6, 0.72, 0.9, 1]),
          k(c.rig.body, { y: [0, 0, 0, 0] }, 2100),
        ]),
    },
  },

  calico: {
    signature: {
      id: "tapFork",
      bubble: "Wasn't me.",
      run: async (c) => {
        const cross = () => {
          c.look("gray", c.points.fork, 1000);
          void earTwitch(c.rigs.gray, "earL");
          c.look("tuxedo", c.points.head("calico"), 700);
        };
        c.maybe(0.3, cross);
        await Promise.all([
          k(c.rig.pawR, { x: [0, 26, 0], y: [0, -3, 0] }, 450),
          sleep(160).then(() => k(c.table.fork, { x: [0, 20], rotate: [0, 14] }, 300)),
        ]);
        await k(c.rig.face, { x: [0, -9, -9, 0] }, 900, [0, 0.2, 0.8, 1]);
        void sleep(3500).then(() => k(c.table.fork, { x: [20, 0], rotate: [14, 0] }, 600));
      },
    },
    secondary: [
      {
        id: "bellJiggle",
        run: (c) => Promise.all([k(c.rig.acc, { rotate: [0, -16, 14, -8, 0] }, 600), k(c.rig.body, { y: [0, -4, 0] }, 400)]),
      },
      {
        id: "napkinPaw",
        run: (c) =>
          Promise.all([
            k(c.rig.pawR, { x: [0, 12, 2, 12, 0], y: [0, -3, 0, -3, 0] }, 800),
            k(c.table.napkin, { rotate: [0, 10, -3, 12, 4], x: [0, 3, 3, 5, 3] }, 800),
          ]),
      },
    ],
    rare: {
      id: "knockSpoon",
      bubble: "That wasn't me.",
      run: async (c) => {
        await k(c.rig.pawR, { x: [0, 26, 0] }, 400);
        c.look("gray", c.points.spoon, 1200);
        c.look("tuxedo", c.points.head("calico"), 1200);
        await Promise.all([
          k(c.table.spoon, { x: [0, -40, -70], y: [0, 50, 170], rotate: [0, 140, 320], opacity: [1, 1, 0] }, 900),
          k(c.rig.face, { x: [0, -10, -10, -10, 0] }, 1600, [0, 0.15, 0.5, 0.85, 1]),
        ]);
        void sleep(1200).then(async () => {
          c.table.spoon.set({ x: 0, y: 0, rotate: 0 });
          await k(c.table.spoon, { opacity: [0, 1] }, 500);
        });
      },
    },
  },

  gray: {
    signature: {
      id: "shy",
      bubble: "Hi.",
      run: async (c) => {
        await Promise.all([
          k(c.rig.body, { y: [0, -3, -3, 0], scale: [1, 0.97, 0.97, 1] }, 900),
          k(c.rig.earL, { rotate: [0, -18, -18, 0] }, 900),
          k(c.rig.earR, { rotate: [0, -18, -18, 0] }, 900),
        ]);
        await slowBlink(c.rig);
      },
    },
    secondary: [
      {
        id: "lookNeighbor",
        run: async (c) => {
          c.look("gray", c.points.head("orange"), 900);
          await sleep(1000);
        },
      },
      { id: "lowerHead", run: (c) => k(c.rig.head, { y: [0, 6, 6, 0], rotate: [0, -4, -4, 0] }, 900) },
      { id: "curlTail", run: (c) => k(c.rig.tail, { rotate: [0, -32, -32, 0] }, 900) },
    ],
    rare: {
      id: "peek",
      run: async (c) => {
        c.maybe(0.35, () => void k(c.rigs.calico.body, { rotate: [0, 4, 4, 0], x: [0, 5, 5, 0] }, 1600));
        await Promise.all([
          k(c.rig.sink, { y: [0, 96, 96, 58, 58, 0] }, 2200, [0, 0.22, 0.45, 0.6, 0.85, 1]),
          k(c.rig.eyes, { scaleY: [1, 1, 1, 0.2, 1, 1] }, 2200, [0, 0.22, 0.6, 0.7, 0.8, 1]),
        ]);
      },
    },
  },
};

/** Low-key things a cat does on its own every few seconds. */
export const IDLE: ((c: ReactionCtx, id: CatId) => Promise<unknown>)[] = [
  (c) => blink(c.rig),
  (c) => blink(c.rig),
  (c) => slowBlink(c.rig),
  (c) => earTwitch(c.rig, "earL"),
  (c) => earTwitch(c.rig, "earR"),
  (c) => tailFlick(c.rig),
  (c) => k(c.rig.face, { x: [0, -5, -5, 0] }, 1600, [0, 0.2, 0.8, 1]),
  (c) => k(c.rig.face, { x: [0, 5, 5, 0] }, 1600, [0, 0.2, 0.8, 1]),
  (c) => k(c.rig.head, { y: [0, 5, 5, 0] }, 900),
  (c) => k(c.rig.body, { rotate: [0, 1.6, -1, 0] }, 1400),
  (c) =>
    Promise.all([
      k(c.rig.pawL, { y: [0, -36, -36, -36, 0], rotate: [0, 10, 14, 10, 0] }, 1500),
      k(c.rig.head, { rotate: [0, -8, -8, -8, 0], y: [0, 3, 3, 3, 0] }, 1500),
    ]),
  (c, id) => {
    const others = (["orange", "tuxedo", "gray", "calico", "white"] as CatId[]).filter((o) => o !== id);
    c.look(id, c.points.head(others[Math.floor(Math.random() * others.length)]), 1400);
    return sleep(1400);
  },
];
