const INK = "#242424";

export function Sparkle({ className, color = "#FFFFFF" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M10 1 Q11 9 19 10 Q11 11 10 19 Q9 11 1 10 Q9 9 10 1 Z" fill={color} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
}

export function MusicNote({ className, color = "#9368F7" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 30 40" className={className} aria-hidden>
      <path d="M11 32 L11 6 L27 2 L27 26" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={7} cy={32} rx={6} ry={5} fill={color} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={23} cy={27} rx={6} ry={5} fill={color} stroke={INK} strokeWidth={2.5} />
    </svg>
  );
}
