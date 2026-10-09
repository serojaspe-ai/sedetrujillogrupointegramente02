import type { Emocion } from "@/lib/catalogo";

const PALETA: Record<Emocion, { cara: string; trazo: string }> = {
  frustracion: { cara: "#FCE7F3", trazo: "#9D174D" },
  enojo: { cara: "#FFE4EA", trazo: "#9F1239" },
  inquietud: { cara: "#CCFBF1", trazo: "#115E59" },
};

export const REACCION_EMOCION: Record<Emocion, string> = {
  frustracion: "motion-safe:animate-sacudir",
  enojo: "motion-safe:animate-pop",
  inquietud: "motion-safe:animate-vibrar",
};

export function IlustracionEmocion({
  emocion,
  reaccion = false,
  className = "",
}: {
  emocion: Emocion;
  reaccion?: boolean;
  className?: string;
}) {
  const { cara, trazo } = PALETA[emocion];
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      fill="none"
      stroke={trazo}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${reaccion ? REACCION_EMOCION[emocion] : ""}`}
    >
      <circle cx="32" cy="32" r="29" fill={cara} stroke="none" />
      {emocion === "frustracion" && (
        <>
          <path d="M16 22 L28 28" />
          <path d="M48 22 L36 28" />
          <circle cx="23" cy="36" r="2.6" fill={trazo} stroke="none" />
          <circle cx="41" cy="36" r="2.6" fill={trazo} stroke="none" />
          <path d="M24 49 Q32 42 40 49" />
        </>
      )}
      {emocion === "enojo" && (
        <>
          <path d="M14 24 L28 33" />
          <path d="M50 24 L36 33" />
          <path d="M20 37 H28" />
          <path d="M36 37 H44" />
          <rect x="24" y="43" width="16" height="7" rx="2" />
          <path d="M32 43 V50" />
        </>
      )}
      {emocion === "inquietud" && (
        <>
          <path d="M16 24 Q21 19 27 24" />
          <path d="M37 24 Q43 19 48 24" />
          <circle cx="23" cy="35" r="2.6" fill={trazo} stroke="none" />
          <circle cx="41" cy="35" r="2.6" fill={trazo} stroke="none" />
          <path d="M22 46 Q27 42 32 46 T42 46" />
          <path d="M54 12 Q57 17 54 20 Q51 17 54 12 Z" fill="#2DD4BF" stroke="none" />
        </>
      )}
    </svg>
  );
}
