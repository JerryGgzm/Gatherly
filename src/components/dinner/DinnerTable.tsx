"use client";

import { animationControls, motion } from "framer-motion";
import { CAT_ORDER, SEATS, TABLE, USER_SEAT } from "./cats";

const INK = "#242424";
const { cx, cy, rx, ry, depth } = TABLE;

export const TABLE_PARTS = ["dishes", "fork", "spoon", "napkin"] as const;
export type TablePart = (typeof TABLE_PARTS)[number];
export type TableRig = Record<TablePart, ReturnType<typeof animationControls>>;
export const makeTableRig = (): TableRig => Object.fromEntries(TABLE_PARTS.map((p) => [p, animationControls()])) as TableRig;

export const CALICO_FORK = { x: SEATS.calico.plate.x - 40, y: SEATS.calico.plate.y - 2 };
export const CALICO_SPOON = { x: SEATS.calico.plate.x - 28, y: SEATS.calico.plate.y + 18 };

function Pivot({ r }: { r: number }) {
  return <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="transparent" />;
}

const NAPKINS = ["#FF7BA9", "#63C174", "#FFD84D", "#3D7EFF", "#9368F7", "#FF6B35"];
const GLASSES = ["#FFD84D", "#FF7BA9", "#9368F7", "#63C174", "#3D7EFF", "#FF6B35"];

function Plate() {
  return (
    <g>
      <ellipse cx={2} cy={4} rx={30} ry={14} fill={INK} opacity={0.9} />
      <ellipse rx={30} ry={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
      <ellipse rx={19} ry={8.5} fill="none" stroke="#E7DED0" strokeWidth={2.4} />
    </g>
  );
}

function Glass({ color }: { color: string }) {
  return (
    <g>
      <ellipse cx={0} cy={2} rx={12} ry={5} fill={color} stroke={INK} strokeWidth={2.4} />
      <path d="M-7 0 L-6 -20 L6 -20 L7 0 Z" fill="#DDF1FF" fillOpacity={0.75} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <ellipse cx={0} cy={-20} rx={6} ry={2.4} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
      <path d="M-3 -16 L-3 -5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Napkin({ color }: { color: string }) {
  return <path d="M-14 -6 L10 -8 L14 6 L-10 8 Z" fill={color} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />;
}

function Fork() {
  const d = "M0 12 L0 -2 M-3.5 -2 L-3.5 -11 M0 -2 L0 -11 M3.5 -2 L3.5 -11 M-3.5 -2 L3.5 -2";
  return (
    <g transform="rotate(-18)">
      <path d={d} stroke={INK} strokeWidth={4.6} strokeLinecap="round" fill="none" />
      <path d={d} stroke="#E4E8EE" strokeWidth={2} strokeLinecap="round" fill="none" />
    </g>
  );
}

function Spoon() {
  return (
    <g transform="rotate(64)">
      <path d="M0 12 L0 -2" stroke={INK} strokeWidth={4.6} strokeLinecap="round" />
      <path d="M0 12 L0 -2" stroke="#E4E8EE" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={0} cy={-6} rx={4.6} ry={6} fill="#E4E8EE" stroke={INK} strokeWidth={2.2} />
    </g>
  );
}

function Setting({ x, y, i, plain = false }: { x: number; y: number; i: number; plain?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {!plain && (
        <>
          <g transform="translate(-42 8)">
            <Napkin color={NAPKINS[i]} />
          </g>
          <g transform="translate(-40 -2)">
            <Fork />
          </g>
        </>
      )}
      <Plate />
      <g transform="translate(40 -2)">
        <Glass color={GLASSES[i]} />
      </g>
    </g>
  );
}

function Fish() {
  return (
    <g>
      <ellipse cx={3} cy={5} rx={58} ry={24} fill={INK} />
      <ellipse rx={58} ry={24} fill="#FFFDF7" stroke={INK} strokeWidth={3.4} />
      <ellipse rx={46} ry={17} fill="none" stroke="#63C174" strokeWidth={2.4} strokeDasharray="2 7" strokeLinecap="round" />
      <path d="M-30 0 C-18 -14 14 -14 24 0 C14 14 -18 14 -30 0 Z" fill="#FF9A6B" stroke={INK} strokeWidth={2.8} />
      <path d="M22 0 L40 -11 L37 0 L40 11 Z" fill="#FF9A6B" stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />
      <path d="M-8 -9 Q-4 0 -8 9 M2 -9 Q6 0 2 9" stroke="#E0663A" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <circle cx={-21} cy={-2} r={2.4} fill={INK} />
      <ellipse cx={-40} cy={10} rx={7} ry={4} fill="#FFD84D" stroke={INK} strokeWidth={2} />
      <path d="M-44 10 L-36 10 M-40 7 L-40 13" stroke="#E7B800" strokeWidth={1.4} />
      <path d="M40 12 q4 -6 9 -2 q-3 5 -9 2Z" fill="#63C174" stroke={INK} strokeWidth={1.6} />
    </g>
  );
}

function Candle({ glow }: { glow: boolean }) {
  return (
    <g>
      <motion.ellipse cx={0} cy={-34} rx={22} ry={16} fill="#FFD84D" initial={false} animate={{ opacity: glow ? 0.55 : 0.28 }} />
      <ellipse cx={0} cy={2} rx={12} ry={5} fill="#FF6B35" stroke={INK} strokeWidth={2.4} />
      <rect x={-6} y={-26} width={12} height={27} rx={3} fill="#FFFDF7" stroke={INK} strokeWidth={2.4} />
      <motion.path
        d="M0 -40 C5 -34 4 -28 0 -27 C-4 -28 -5 -34 0 -40 Z"
        fill="#FF9F1C"
        stroke={INK}
        strokeWidth={1.8}
        animate={{ scaleY: [1, 1.12, 0.94, 1], rotate: [0, 3, -3, 0] }}
        style={{ originY: 1 }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </g>
  );
}

function Vase() {
  return (
    <g>
      <path d="M-4 -24 C-10 -34 -6 -44 0 -48 M2 -24 C6 -32 12 -36 14 -42" stroke="#3F9A53" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-50} r={6} fill="#FF7BA9" stroke={INK} strokeWidth={2} />
      <circle cx={0} cy={-50} r={2} fill="#FFD84D" />
      <circle cx={15} cy={-45} r={5} fill="#9368F7" stroke={INK} strokeWidth={2} />
      <path d="M-8 0 C-12 -10 -8 -20 -4 -24 L4 -24 C8 -20 12 -10 8 0 Z" fill="#3D7EFF" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M-5 -14 Q0 -12 5 -14" stroke="#FFFFFF" strokeWidth={1.8} fill="none" opacity={0.7} />
    </g>
  );
}

export function PatioFloor({ uid }: { uid: string }) {
  const id = `${uid}-patio`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <ellipse cx={400} cy={452} rx={396} ry={130} />
        </clipPath>
      </defs>
      <ellipse cx={408} cy={462} rx={396} ry={130} fill={INK} />
      <ellipse cx={400} cy={452} rx={396} ry={130} fill="#F4D3A6" />
      <g clipPath={`url(#${id})`} stroke="#E2B47E" strokeWidth={3}>
        {Array.from({ length: 22 }, (_, i) => (
          <path key={`a${i}`} d={`M${-200 + i * 64} 300 L${40 + i * 64} 600`} />
        ))}
        {Array.from({ length: 22 }, (_, i) => (
          <path key={`b${i}`} d={`M${1000 - i * 64} 300 L${760 - i * 64} 600`} />
        ))}
      </g>
      <ellipse cx={400} cy={452} rx={396} ry={130} fill="none" stroke={INK} strokeWidth={4} />
      <ellipse cx={400} cy={452} rx={372} ry={114} fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeDasharray="3 12" strokeLinecap="round" opacity={0.7} />
    </g>
  );
}

export function TableBase() {
  return (
    <g>
      <ellipse cx={cx + 8} cy={cy + depth + 40} rx={rx * 0.86} ry={ry * 0.5} fill={INK} opacity={0.12} />
      <ellipse cx={cx + 6} cy={cy + depth + 6} rx={rx} ry={ry} fill={INK} />
      <path
        d={`M${cx - rx} ${cy} L${cx - rx} ${cy + depth} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy + depth} L${cx + rx} ${cy} Z`}
        fill="#C9542B"
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </g>
  );
}

export function TableTop({ rig, glow, youSeated }: { rig: TableRig; glow: boolean; youSeated: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#E8743F" stroke={INK} strokeWidth={4} />
      <ellipse cx={cx} cy={cy - 2} rx={rx - 14} ry={ry - 9} fill="#FFF6E6" stroke={INK} strokeWidth={2.6} />
      <ellipse cx={cx} cy={cy - 2} rx={rx - 34} ry={ry - 24} fill="none" stroke="#FF6B35" strokeWidth={2.6} strokeDasharray="2 12" strokeLinecap="round" opacity={0.5} />
      <motion.ellipse cx={cx} cy={cy} rx={rx - 14} ry={ry - 9} fill="#FFD84D" initial={false} animate={{ opacity: glow ? 0.3 : 0 }} transition={{ duration: 0.3 }} />

      <motion.g animate={rig.dishes}>
        <g transform={`translate(${cx} ${cy})`}>
          <Pivot r={rx + 20} />
        </g>
        {CAT_ORDER.map((id, i) => {
          const p = SEATS[id].plate;
          return <Setting key={id} x={p.x} y={p.y} i={i} plain={id === "calico"} />;
        })}
        <Setting x={USER_SEAT.plate.x} y={USER_SEAT.plate.y} i={5} />
        {youSeated && (
          <g transform={`translate(${USER_SEAT.plate.x} ${USER_SEAT.plate.y + 22})`}>
            <path d="M-20 6 L-16 -8 L16 -8 L20 6 Z" fill="#FFFFFF" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
            <text y={3} textAnchor="middle" fontFamily="var(--font-display)" fontWeight={700} fontSize={11} fill={INK}>
              You
            </text>
          </g>
        )}

        <NapkinWiggle rig={rig} />
        <g transform={`translate(${CALICO_FORK.x} ${CALICO_FORK.y})`}>
          <motion.g animate={rig.fork}>
            <Pivot r={20} />
            <Fork />
          </motion.g>
        </g>
        <g transform={`translate(${CALICO_SPOON.x} ${CALICO_SPOON.y})`}>
          <motion.g animate={rig.spoon}>
            <Pivot r={20} />
            <Spoon />
          </motion.g>
        </g>

        <g transform={`translate(${cx} ${cy + 8})`}>
          <Fish />
        </g>
        <g transform={`translate(${cx + 78} ${cy - 22})`}>
          <Candle glow={glow} />
        </g>
        <g transform={`translate(${cx - 84} ${cy - 18})`}>
          <Vase />
        </g>
      </motion.g>
    </g>
  );
}

function NapkinWiggle({ rig }: { rig: TableRig }) {
  const p = SEATS.calico.plate;
  return (
    <g transform={`translate(${p.x - 42} ${p.y + 8})`}>
      <motion.g animate={rig.napkin}>
        <Pivot r={18} />
        <Napkin color={NAPKINS[3]} />
      </motion.g>
    </g>
  );
}

export function StringLights({ bright }: { bright: boolean }) {
  const bulbs = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const x = 20 + t * 760;
    const y = 18 + Math.sin(t * Math.PI) * 46;
    return { x, y };
  });
  const colors = ["#FFD84D", "#FF7BA9", "#63C174", "#3D7EFF", "#FF6B35"];
  return (
    <g>
      <path d="M20 18 Q400 110 780 18" fill="none" stroke={INK} strokeWidth={2.4} />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y})`}>
          <motion.circle cy={9} r={14} fill="#FFE8A3" initial={false} animate={{ opacity: bright ? 0.7 : 0.25 }} transition={{ duration: 0.35, delay: i * 0.02 }} />
          <path d="M0 0 L0 3" stroke={INK} strokeWidth={2} />
          <ellipse cy={9} rx={5} ry={6.5} fill={colors[i % colors.length]} stroke={INK} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

export function EmptyChair({ out, youSeated, color = "#FF6B35" }: { out: boolean; youSeated: boolean; color?: string }) {
  return (
    <g transform={`translate(${USER_SEAT.x} ${USER_SEAT.y})`}>
      <motion.g initial={false} animate={{ y: youSeated ? -6 : out ? 12 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <ellipse cx={4} cy={-10} rx={48} ry={14} fill={INK} />
        <ellipse cx={0} cy={-14} rx={48} ry={14} fill={color} stroke={INK} strokeWidth={4} />
        <path d="M-40 58 L-42 78 M40 58 L42 78" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <rect x={-50} y={-6} width={100} height={68} rx={18} fill={INK} transform="translate(5 5)" />
        <rect x={-50} y={-6} width={100} height={68} rx={18} fill={color} stroke={INK} strokeWidth={4} />
        <rect x={-36} y={6} width={72} height={16} rx={8} fill="#FFFFFF" opacity={0.35} />
        <rect x={-36} y={32} width={72} height={16} rx={8} fill="#FFFFFF" opacity={0.2} />
      </motion.g>
    </g>
  );
}
