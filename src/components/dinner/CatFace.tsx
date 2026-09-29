import { CATS, type CatId } from "./cats";

const INK = "#242424";
const HEAD = "M7 14 L6 3.5 L12.5 8.5 Q16 7.6 19.5 8.5 L26 3.5 L25 14 Q28 18.5 26.4 23 Q23.5 29 16 29 Q8.5 29 5.6 23 Q4 18.5 7 14Z";

/** Tiny head-only badge of a dinner cat, for seat rows and banners. `null` draws an unknown guest. */
export function CatFace({ id, className }: { id: CatId | null; className?: string }) {
  if (!id) {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden>
        <path d={HEAD} fill="#EADFC8" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <text x={16} y={24} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} fontFamily="var(--font-fredoka), sans-serif">
          ?
        </text>
      </svg>
    );
  }
  const c = CATS[id].colors;
  const tabby = CATS[id].pattern === "tabby";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d={HEAD} fill={c.base} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      {id === "calico" && (
        <>
          <path d="M7 14 L6 3.5 L12.5 8.5 Q11 13 7.4 16Z" fill={c.patch} />
          <path d="M19.5 8.5 L26 3.5 L25 14 Q22 12 19.5 8.5Z" fill={c.dark} />
        </>
      )}
      {tabby && <path d="M13.2 10 L14 13.4 M16 9.4 V13.2 M18.8 10 L18 13.4" stroke={c.dark} strokeWidth={1.6} strokeLinecap="round" />}
      {id === "tuxedo" && <path d="M16 15 Q10.5 18 10.5 23 Q12 28 16 28 Q20 28 21.5 23 Q21.5 18 16 15Z" fill={c.chest} />}
      {[12, 20].map((x) => (
        <g key={x}>
          <circle cx={x} cy={18} r={2.3} fill={c.eye} stroke={INK} strokeWidth={1} />
          <ellipse cx={x} cy={18} rx={0.8} ry={1.6} fill={INK} />
        </g>
      ))}
      <path d="M14.8 21.6 H17.2 L16 23Z" fill="#F08BA0" stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
      {id === "white" && (
        <g stroke={c.acc} strokeWidth={1.8} fill="#1F4E36">
          <circle cx={12.5} cy={10.6} r={2.4} />
          <circle cx={19.5} cy={10.6} r={2.4} />
          <path d="M14.9 10.6 H17.1" fill="none" />
        </g>
      )}
      {(id === "orange" || id === "gray") && <path d="M9.5 27 Q16 31.5 22.5 27" fill="none" stroke={c.acc} strokeWidth={3} strokeLinecap="round" />}
      {id === "tuxedo" && <path d="M12 27 L16 29 L12 31Z M20 27 L16 29 L20 31Z" fill={c.acc} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />}
      {id === "calico" && <circle cx={16} cy={29.6} r={1.9} fill={c.acc} stroke={INK} strokeWidth={0.9} />}
    </svg>
  );
}
