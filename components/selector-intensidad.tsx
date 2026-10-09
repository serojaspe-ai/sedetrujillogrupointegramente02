import { INTENSIDADES } from "@/lib/catalogo";

type Props = {
  id: string;
  valor: number | null;
  onChange: (valor: number) => void;
};

export function SelectorIntensidad({ id, valor, onChange }: Props) {
  return (
    <div role="radiogroup" aria-labelledby={id} className="grid grid-cols-6 gap-2 sm:grid-cols-11">
      {INTENSIDADES.map((n) => {
        const activo = valor === n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onChange(n)}
            className={`h-11 rounded-xl border text-base font-semibold transition ${
              activo
                ? "border-pausa bg-pausa text-white"
                : "border-linea bg-white text-tinta hover:border-pausa"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
