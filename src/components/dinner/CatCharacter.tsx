"use client";

import { animationControls, motion } from "framer-motion";
import type { CatDef, CatId, Seat } from "./cats";

const INK = "#242424";
const EAR_PINK = "#F6A5AE";
const NOSE = "#F08C9A";

export const CAT_PARTS = ["body", "sink", "head", "face", "eyes", "earL", "earR", "pawL", "pawR", "tail", "acc"] as const;
export type CatPart = (typeof CAT_PARTS)[number];
export type Controls = ReturnType<typeof animationControls>;
export type Rig = Record<CatPart, Controls>;

export const makeRig = (): Rig => Object.fromEntries(CAT_PARTS.map((p) => [p, animationControls()])) as Rig;

export type Gaze = { x: number; y: number } | "viewer" | null;

/**
 * Framer Motion transforms SVG elements around the centre of their fill-box. An invisible square
 * centred on (0,0) pins that centre to the joint we want to rotate around.
 */
function Pivot({ r }: { r: number }) {
  return <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="transparent" />;
}

const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v));

function gazeMath(seat: Seat, gaze: Gaze) {
  const hx = seat.x;
  const hy = seat.y - 104 * seat.s;
  let fx = 0;
  let fy = 0;
  let turn = seat.turn;
  if (gaze === "viewer") {
    turn = seat.turn * 0.25;
    fy = 0.5;
  } else if (gaze) {
    fx = clamp((gaze.x - hx) / 240);
    fy = clamp((gaze.y - hy) / 200);
  }
  return {
    faceX: turn * 6 + fx * 6,
    headRot: fx * 7,
    pupil: {
      x: clamp(fx * 2.6 + turn * 1.4, -2.8, 2.8),
      y: clamp(fy * 2.4, -2.2, 2.4),
    },
  };
}

// ---------- shapes ----------

const TORSO = "M-28 2 C-34 -26 -30 -58 -17 -76 C-8 -82 8 -82 17 -76 C30 -58 34 -26 28 2 Z";
const HEAD = "M-38 -20 C-40 -44 -22 -58 0 -58 C22 -58 40 -44 38 -20 C36 -2 20 8 0 8 C-20 8 -36 -2 -38 -20 Z";
const EAR = "M-13 14 C-16 -4 -14 -22 -8 -32 C0 -24 8 -16 14 -10 Z";
const EAR_IN = "M-8 6 C-10 -6 -9 -16 -6 -23 C-1 -17 4 -12 8 -8 Z";
const TAIL = "M0 0 C26 -2 40 -26 32 -52 C29 -62 22 -68 15 -70";
const TAIL_TIP = "M32 -52 C29 -62 22 -68 15 -70";

function TorsoPattern({ def }: { def: CatDef }) {
  const c = def.colors;
  if (def.pattern === "tuxedo") return <path d="M-13 -80 C-18 -50 -14 -18 0 4 C14 -18 18 -50 13 -80 Z" fill={c.chest} />;
  if (def.pattern === "calico")
    return (
      <>
        <path d="M-34 -60 C-20 -64 -12 -50 -18 -36 C-24 -24 -34 -22 -40 -26 Z" fill={c.patch} />
        <path d="M34 -44 C22 -44 16 -30 22 -16 C26 -6 34 -6 40 -8 Z" fill={c.dark} />
        <path d="M-36 -14 C-26 -12 -22 -2 -26 6 L-40 6 Z" fill={c.dark} />
        <ellipse cx={0} cy={-40} rx={12} ry={24} fill={c.chest} opacity={0.9} />
      </>
    );
  if (def.pattern === "fluffy")
    return (
      <>
        <path d="M24 -70 C32 -50 34 -24 30 0 L40 0 L40 -70 Z" fill={c.dark} opacity={0.7} />
        <path
          d="M-14 -78 L-9 -64 L-16 -60 L-8 -50 L-13 -44 L0 -32 L13 -44 L8 -50 L16 -60 L9 -64 L14 -78 Z"
          fill={c.chest}
          stroke={c.dark}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </>
    );
  return (
    <>
      <ellipse cx={0} cy={-40} rx={13} ry={25} fill={c.chest} />
      <g stroke={c.dark} strokeWidth={4} strokeLinecap="round" fill="none">
        <path d="M-32 -54 Q-24 -52 -20 -58" />
        <path d="M-33 -38 Q-24 -36 -19 -42" />
        <path d="M-32 -22 Q-24 -20 -19 -26" />
        <path d="M32 -54 Q24 -52 20 -58" />
        <path d="M33 -38 Q24 -36 19 -42" />
        <path d="M32 -22 Q24 -20 19 -26" />
      </g>
    </>
  );
}

function HeadPattern({ def }: { def: CatDef }) {
  const c = def.colors;
  if (def.pattern === "tuxedo") return <path d="M-3 -48 C-6 -36 -24 -24 -26 -8 C-18 10 18 10 26 -8 C24 -24 6 -36 3 -48 Z" fill={c.chest} />;
  if (def.pattern === "calico")
    return (
      <>
        <path d="M-44 -62 L-5 -62 C-6 -46 -12 -38 -20 -34 C-28 -31 -38 -28 -44 -22 Z" fill={c.patch} />
        <path d="M5 -62 L44 -62 L44 -26 C36 -28 26 -34 18 -40 C11 -46 6 -54 5 -62 Z" fill={c.dark} />
      </>
    );
  if (def.pattern === "fluffy") return <path d="M30 -40 C38 -30 38 -14 30 -2 L44 -2 L44 -40 Z" fill={c.dark} opacity={0.6} />;
  return (
    <>
      <path d="M-14 -10 C-10 4 10 4 14 -10 C10 -18 -10 -18 -14 -10 Z" fill={c.chest} />
      <g stroke={c.dark} strokeWidth={3.6} strokeLinecap="round" fill="none">
        <path d="M-7 -55 L-6 -44" />
        <path d="M0 -57 L0 -42" />
        <path d="M7 -55 L6 -44" />
        <path d="M-39 -28 L-29 -26" />
        <path d="M-39 -20 L-30 -20" />
        <path d="M39 -28 L29 -26" />
        <path d="M39 -20 L30 -20" />
      </g>
    </>
  );
}

function NeckAccessory({ def }: { def: CatDef }) {
  const c = def.colors;
  if (def.accessory === "bowtie")
    return (
      <g stroke={INK} strokeWidth={2.6} strokeLinejoin="round">
        <path d="M0 -74 L-16 -83 Q-19 -74 -16 -65 Z" fill={c.acc} />
        <path d="M0 -74 L16 -83 Q19 -74 16 -65 Z" fill={c.acc} />
        <rect x={-4.5} y={-79} width={9} height={10} rx={3} fill={c.acc} />
      </g>
    );
  if (def.accessory === "bell")
    return (
      <>
        <path d="M-19 -78 Q0 -69 19 -78 L19 -72 Q0 -63 -19 -72 Z" fill={c.acc} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={0} cy={-61} r={5.5} fill="#F2B705" stroke={INK} strokeWidth={2.2} />
        <path d="M-2.6 -60 L2.6 -60" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      </>
    );
  if (def.accessory === "bandana" || def.accessory === "neckerchief") {
    const small = def.accessory === "neckerchief";
    return (
      <g stroke={INK} strokeWidth={2.6} strokeLinejoin="round">
        <path d={small ? "M-19 -77 Q0 -69 19 -77 L3 -54 Q0 -51 -3 -54 Z" : "M-21 -77 Q0 -68 21 -77 L4 -47 Q0 -43 -4 -47 Z"} fill={c.acc} />
        <path d="M17 -78 L27 -84 L25 -74 Z" fill={c.acc} />
        <path d="M17 -77 L28 -70 L20 -68 Z" fill={c.acc} />
        <g fill={c.accDot} stroke="none">
          <circle cx={-9} cy={-70} r={1.7} />
          <circle cx={0} cy={-66} r={1.7} />
          <circle cx={9} cy={-70} r={1.7} />
          {!small && <circle cx={-4} cy={-57} r={1.7} />}
          {!small && <circle cx={4} cy={-57} r={1.7} />}
          {small && <circle cx={0} cy={-58} r={1.7} />}
        </g>
      </g>
    );
  }
  return null;
}

function Sunglasses({ def }: { def: CatDef }) {
  const c = def.colors;
  return (
    <g>
      <path d="M-6 0 Q0 -4 6 0" fill="none" stroke={c.accDot} strokeWidth={2.6} />
      <path d="M-23 -2 L-34 -6 M23 -2 L34 -6" stroke={c.accDot} strokeWidth={2.4} strokeLinecap="round" />
      {[-14, 14].map((x) => (
        <g key={x}>
          <circle cx={x} cy={0} r={9.5} fill={c.acc} stroke={INK} strokeWidth={2.4} />
          <circle cx={x} cy={0} r={9.5} fill="none" stroke={c.accDot} strokeWidth={1.6} />
          <path d={`M${x - 5} -3 Q${x - 3} -6 ${x} -6`} stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

// ---------- layers ----------

type LayerProps = {
  def: CatDef;
  seat: Seat;
  rig: Rig;
  gaze: Gaze;
  hovered: boolean;
  present: boolean;
  reduce: boolean;
  uid: string;
};

const presence = (present: boolean) => ({
  opacity: present ? 1 : 0,
  y: present ? 0 : 26,
});
const SPRING = { type: "spring" as const, stiffness: 260, damping: 22 };

export function CatBody({ def, seat, rig, gaze, hovered, present, reduce, uid }: LayerProps) {
  const c = def.colors;
  const g = gazeMath(seat, gaze);
  const clipT = `${uid}-${def.id}-torso`;
  const clipH = `${uid}-${def.id}-head`;
  const fluffy = def.pattern === "fluffy";
  const tailW = fluffy ? 20 : 15;
  const swayDur = {
    orange: 3.2,
    tuxedo: 5.4,
    gray: 4.6,
    calico: 2.8,
    white: 4,
  }[def.id as CatId];

  return (
    <g transform={`translate(${seat.x} ${seat.y}) scale(${seat.s})`}>
      {seat.back ? (
        <g>
          <rect x={-46} y={-96} width={92} height={100} rx={24} fill={def.chair} stroke={INK} strokeWidth={4} />
          <rect x={-34} y={-84} width={68} height={40} rx={14} fill="#FFFFFF" opacity={0.25} />
        </g>
      ) : (
        <g>
          <path d="M-30 8 L-34 44 M30 8 L34 44 M0 12 L0 48" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={4} cy={10} rx={44} ry={14} fill={INK} />
          <ellipse cx={0} cy={6} rx={44} ry={14} fill={def.chair} stroke={INK} strokeWidth={4} />
        </g>
      )}

      <motion.g initial={false} animate={presence(present)} transition={SPRING}>
        <motion.g animate={{ scale: hovered ? 1.02 : 1 }} transition={{ duration: 0.18 }}>
          <Pivot r={220} />
          <motion.g animate={rig.sink}>
            <Pivot r={220} />
            <motion.g animate={rig.body}>
              <Pivot r={220} />
              <defs>
                <clipPath id={clipT}>
                  <path d={TORSO} />
                </clipPath>
              </defs>

              <g transform="translate(22 -10)">
                <motion.g
                  animate={reduce ? { rotate: 0 } : { rotate: [0, 5, 0, -4, 0] }}
                  transition={{
                    duration: swayDur,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Pivot r={90} />
                  <motion.g animate={rig.tail}>
                    <Pivot r={90} />
                    <path d={TAIL} fill="none" stroke={INK} strokeWidth={tailW + 6} strokeLinecap="round" />
                    <path d={TAIL} fill="none" stroke={c.base} strokeWidth={tailW} strokeLinecap="round" />
                    {def.pattern === "tabby" && <path d={TAIL} fill="none" stroke={c.dark} strokeWidth={tailW} strokeDasharray="5 9" />}
                    {c.tailTip && <path d={TAIL_TIP} fill="none" stroke={c.tailTip} strokeWidth={tailW} strokeLinecap="round" />}
                  </motion.g>
                </motion.g>
              </g>

              {[-1, 1].map((d) => (
                <g key={d}>
                  <ellipse cx={d * 22} cy={-8} rx={15} ry={12} fill={def.pattern === "calico" && d > 0 ? c.dark : c.base} stroke={INK} strokeWidth={3.2} />
                  <ellipse cx={d * 13} cy={3} rx={10} ry={6} fill={c.paw} stroke={INK} strokeWidth={3} />
                </g>
              ))}
              <path d={TORSO} fill={c.base} />
              <g clipPath={`url(#${clipT})`}>
                <TorsoPattern def={def} />
              </g>
              <path d={TORSO} fill="none" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />

              {def.accessory !== "sunglasses" && (
                <motion.g animate={rig.acc}>
                  <g transform="translate(0 -72)">
                    <Pivot r={40} />
                  </g>
                  <NeckAccessory def={def} />
                </motion.g>
              )}

              <g transform="translate(0 -78)">
                <motion.g animate={{ rotate: g.headRot }} transition={{ type: "spring", stiffness: 140, damping: 16 }}>
                  <Pivot r={110} />
                  <motion.g animate={rig.head}>
                    <Pivot r={110} />
                    <defs>
                      <clipPath id={clipH}>
                        <path d={HEAD} />
                      </clipPath>
                    </defs>
                    {(["earL", "earR"] as const).map((ear) => {
                      const d = ear === "earL" ? -1 : 1;
                      const earColor = def.pattern === "calico" ? (d < 0 ? c.patch : c.dark) : c.base;
                      return (
                        <g key={ear} transform={`translate(${d * 24} -44) scale(${-d} 1)`}>
                          <motion.g animate={rig[ear]}>
                            <Pivot r={40} />
                            <path d={EAR} fill={earColor} stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
                            <path d={EAR_IN} fill={EAR_PINK} />
                          </motion.g>
                        </g>
                      );
                    })}
                    {fluffy && (
                      <g fill={c.base} stroke={INK} strokeWidth={3} strokeLinejoin="round">
                        <path d="M-34 -30 L-48 -22 L-38 -18 L-47 -9 L-36 -8 L-42 2 L-26 -2 Z" />
                        <path d="M34 -30 L48 -22 L38 -18 L47 -9 L36 -8 L42 2 L26 -2 Z" />
                      </g>
                    )}
                    <path d={HEAD} fill={c.base} />
                    <g clipPath={`url(#${clipH})`}>
                      <motion.g
                        animate={{ x: g.faceX }}
                        transition={{
                          type: "spring",
                          stiffness: 140,
                          damping: 16,
                        }}
                      >
                        <HeadPattern def={def} />
                      </motion.g>
                    </g>
                    <path d={HEAD} fill="none" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />

                    <motion.g
                      animate={{ x: g.faceX }}
                      transition={{
                        type: "spring",
                        stiffness: 140,
                        damping: 16,
                      }}
                    >
                      <motion.g animate={rig.face}>
                        {[-14, 14].map((ex) => (
                          <g key={ex} transform={`translate(${ex} -26)`}>
                            <motion.g animate={rig.eyes}>
                              <Pivot r={11} />
                              <ellipse rx={7.6} ry={8.2} fill={c.eye} stroke={INK} strokeWidth={2.6} />
                              <motion.g
                                animate={{ x: g.pupil.x, y: g.pupil.y }}
                                transition={{
                                  type: "spring",
                                  stiffness: 220,
                                  damping: 18,
                                }}
                              >
                                <ellipse rx={2.5} ry={5.8} fill={INK} />
                                <circle cx={-1.6} cy={-2.6} r={1.5} fill="#FFFFFF" />
                              </motion.g>
                            </motion.g>
                          </g>
                        ))}
                        <path d="M-4.6 -15 Q0 -16.8 4.6 -15 L0 -10 Z" fill={NOSE} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
                        <path d="M0 -10 L0 -7 M0 -7 Q-3 -3.5 -7 -5.5 M0 -7 Q3 -3.5 7 -5.5" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
                        <g stroke={c.whisker} strokeWidth={1.5} strokeLinecap="round" opacity={0.85}>
                          <path d="M-13 -11 L-42 -15 M-13 -8 L-43 -7 M-13 -5 L-40 1" />
                          <path d="M13 -11 L42 -15 M13 -8 L43 -7 M13 -5 L40 1" />
                        </g>
                        {def.accessory === "sunglasses" && (
                          <g transform="translate(0 -47)">
                            <motion.g animate={rig.acc}>
                              <Pivot r={40} />
                              <Sunglasses def={def} />
                            </motion.g>
                          </g>
                        )}
                      </motion.g>
                    </motion.g>
                  </motion.g>
                </motion.g>
              </g>
            </motion.g>
          </motion.g>
        </motion.g>
      </motion.g>
    </g>
  );
}

export function CatPaws({ def, seat, rig, hovered, present, uid }: LayerProps) {
  const c = def.colors;
  const clip = `${uid}-${def.id}-shoulders`;
  const legColor = def.pattern === "calico" || def.pattern === "fluffy" ? c.paw : c.base;
  const len = seat.pawY + 58;
  return (
    <g transform={`translate(${seat.x} ${seat.y}) scale(${seat.s})`}>
      <motion.g initial={false} animate={presence(present)} transition={SPRING}>
        <motion.g animate={{ scale: hovered ? 1.02 : 1 }} transition={{ duration: 0.18 }}>
          <Pivot r={220} />
          <motion.g animate={rig.body}>
            <Pivot r={220} />
            {seat.back && (
              <defs>
                <clipPath id={clip}>
                  <rect x={-120} y={-66} width={240} height={300} />
                </clipPath>
              </defs>
            )}
            <g clipPath={seat.back ? `url(#${clip})` : undefined}>
              {(["pawL", "pawR"] as const).map((paw) => {
                const d = paw === "pawL" ? -1 : 1;
                const dx = seat.pawDX - d;
                return (
                  <g key={paw} transform={`translate(${d * (seat.shoulder?.x ?? 16)} ${seat.shoulder?.y ?? -58})`}>
                    <motion.g animate={rig[paw]}>
                      <Pivot r={110} />
                      {len > 8 && (
                        <>
                          <path d={`M0 0 L${dx} ${len - 4}`} stroke={INK} strokeWidth={19} strokeLinecap="round" />
                          <path d={`M0 0 L${dx} ${len - 4}`} stroke={legColor} strokeWidth={13} strokeLinecap="round" />
                        </>
                      )}
                      <ellipse cx={dx} cy={len} rx={10.5} ry={7.8} fill={c.paw} stroke={INK} strokeWidth={3} />
                      <path d={`M${dx - 3.6} ${len + 1} l0 5 M${dx + 3.6} ${len + 1} l0 5`} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
                    </motion.g>
                  </g>
                );
              })}
            </g>
          </motion.g>
        </motion.g>
      </motion.g>
    </g>
  );
}
