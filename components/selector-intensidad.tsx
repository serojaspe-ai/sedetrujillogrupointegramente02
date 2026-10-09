import { INTENSIDADES } from "@/lib/catalogo";

type Props = {
  id: string;
  valor: number | null;
  onChange: (valor: number) => void;
};

function colorNivel(n: number): string {
  if (n <= 3) return "bg-teal-600";
  if (n <= 6) return "bg-sky-600";
  return "bg-pink-600";
}

export function SelectorIntensidad({ id, valor, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <span className="text-sm text-tinta-suave">
          {valor === null ? "Elige un número del 0 al 10" : "Tu elección"}
        </span>
        <span aria-live="polite" className="flex items-baseline gap-1">
          <span
            key={valor ?? "vacio"}
            className={`text-4xl font-bold tabular-nums motion-safe:animate-pop ${
              valor === null ? "text-tinta-suave/40" : "text-pausa"
            }`}
          >
            {valor ?? "–"}
          </span>
          <span className="text-base font-medium text-tinta-suave">/10</span>
        </span>
      </div>

      <div role="radiogroup" aria-labelledby={id} className="grid grid-cols-11 gap-1 sm:gap-1.5">
        {INTENSIDADES.map((n) => {
          const activo = valor === n;
          const lleno = valor !== null && n <= valor;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => onChange(n)}
              className={`h-11 rounded-lg border text-sm font-semibold transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 ${
                lleno
                  ? `border-transparent text-white shadow-sm ${colorNivel(n)}`
                  : "border-linea bg-white text-tinta hover:border-pausa"
              } ${activo ? "ring-2 ring-pausa/35 ring-offset-2" : ""}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
