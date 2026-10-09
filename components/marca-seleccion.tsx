import { Check } from "lucide-react";

export function MarcaSeleccion({ activo, className = "" }: { activo: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
        activo
          ? "border-pausa bg-pausa text-white shadow-sm shadow-pausa/30"
          : "border-tinta-suave/35 bg-white text-transparent"
      } ${className}`}
    >
      <Check size={14} strokeWidth={3} className={activo ? "motion-safe:animate-pop" : ""} />
    </span>
  );
}
