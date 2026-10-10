import type { Emocion } from "@/lib/catalogo";

const PALETA: Record<Emocion, { cara: string; trazo: string }> = {
  estres: { cara: "#E0F2FE", trazo: "#0369A1" },
  ansiedad: { cara: "#CCFBF1", trazo: "#115E59" },
  tristeza: { cara: "#FCE7F3", trazo: "#9D174D" },
  enojo: { cara: "#FFE4D6", trazo: "#C2410C" },
};

export const REACCION_EMOCION: Record<Emocion, string> = {
  estres: "motion-safe:animate-sacudir",
  ansiedad: "motion-safe:animate-vibrar",
  tristeza: "motion-safe:animate-respirar",
  enojo: "motion-safe:animate-pop",
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
      {emocion === "estres" && (
        <>
          <path d="M18 22 L26 25" />
          <path d="M46 22 L38 25" />
          <path d="M28 14 L30 18" />
          <path d="M36 14 L34 18" />
          <path d="M20 35 H28" />
          <path d="M36 35 H44" />
          <path d="M24 46 L28 42 L32 46 L36 42 L40 46" />
        </>
      )}
      {emocion === "ansiedad" && (
        <>
          <path d="M16 26 L26 22" />
          <path d="M48 26 L38 22" />
          <circle cx="23" cy="36" r="4" />
          <circle cx="41" cy="36" r="4" />
          <path d="M26 47 Q32 42 38 47" />
          <path d="M54 12 Q57 17 54 20 Q51 17 54 12 Z" fill="#2DD4BF" stroke="none" />
        </>
      )}
      {emocion === "enojo" && (
        <>
          <path d="M14 24 L28 33" />
          <path d="M50 24 L36 33" />
          <path d="M20 39 H28" />
          <path d="M36 39 H44" />
          <path d="M22 50 H42" />
          <path d="M26 46 V50" />
          <path d="M32 46 V50" />
          <path d="M38 46 V50" />
        </>
      )}
      {emocion === "tristeza" && (
        <>
          <path d="M16 34 Q22 29 28 34" />
          <path d="M36 34 Q42 29 48 34" />
          <path d="M22 52 Q32 44 42 52" />
          <path d="M22 26 Q25 24 28 26" />
          <path d="M24 38 Q22 42 24 44 Q26 42 24 38 Z" fill="#60A5FA" stroke="none" />
        </>
      )}
    </svg>
  );
}
