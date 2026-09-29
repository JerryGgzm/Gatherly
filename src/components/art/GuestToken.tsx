import clsx from "clsx";

const INK = "#242424";

export type GuestKind = "guest" | "you" | "mystery";

type ShapeProps = {
  color: string;
  label?: string;
  kind?: GuestKind;
  r?: number;
};

/** Placeholder for guest mascots. Centered on (0,0) so it can be dropped into any SVG. */
export function GuestTokenShape({ color, label, kind = "guest", r = 34 }: ShapeProps) {
  const fill = kind === "mystery" ? "#9368F7" : color;
  const text = kind === "mystery" ? "?" : kind === "you" ? "You" : (label ?? "").slice(0, 1).toUpperCase();
  return (
    <g>
      <circle cx={4} cy={5} r={r} fill={INK} />
      <circle r={r} fill={fill} stroke={INK} strokeWidth={4} />
      <circle r={r - 9} fill="#FFFFFF" opacity={0.22} />
      <path d={`M${-r * 0.55} ${-r * 0.45} A ${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.1} ${-r * 0.72}`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      {kind === "you" && <circle r={r + 9} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="6 7" />}
      <text
        y={kind === "you" ? r * 0.2 : r * 0.34}
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize={kind === "you" ? r * 0.62 : r}
        fill={INK}
      >
        {text}
      </text>
    </g>
  );
}

export function GuestToken({ className, ...props }: ShapeProps & { className?: string }) {
  const r = props.r ?? 34;
  const pad = props.kind === "you" ? 14 : 6;
  return (
    <svg viewBox={`${-r - pad} ${-r - pad} ${2 * (r + pad) + 4} ${2 * (r + pad) + 4}`} className={clsx("overflow-visible", className)} aria-hidden>
      <GuestTokenShape {...props} r={r} />
    </svg>
  );
}
