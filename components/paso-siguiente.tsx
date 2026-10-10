"use client";

import { useState } from "react";
import { Clock, MessageSquare, Users, type LucideIcon } from "lucide-react";
import {
  DESCRIPCION_PASOS_SIGUIENTES,
  PASO_SIGUIENTE_IDS,
  PASOS_SIGUIENTES,
  type PasoSiguienteId,
} from "@/lib/catalogo";
import { BASE_BOTON, RELLENO_EXITO, TARJETA_ACTIVA_SUAVE, TARJETA_BASE } from "./estilos";
import { SelectorIntensidad } from "./selector-intensidad";

export type ResultadoPausa = {
  intensidadFinal: number;
  accionElegida: PasoSiguienteId;
};

type Props = {
  registroId: string | null;
  onFinalizar: (resultado: ResultadoPausa) => void;
};

const ICONOS_PASO: Record<PasoSiguienteId, { Icono: LucideIcon; fondo: string }> = {
  esperar: { Icono: Clock, fondo: "bg-celeste-suave text-[#0369a1]" },
  explicar: { Icono: MessageSquare, fondo: "bg-rosa-suave text-[#be185d]" },
  apoyo: { Icono: Users, fondo: "bg-turquesa-suave text-[#0f766e]" },
};

export function PasoSiguiente({ registroId, onFinalizar }: Props) {
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  const [intensidadAhora, setIntensidadAhora] = useState<number | null>(null);
  const [pasoElegido, setPasoElegido] = useState<PasoSiguienteId | null>(null);
  const [errores, setErrores] = useState<{ intensidad?: string; paso?: string }>({});

  async function confirmar() {
    const nuevosErrores = {
      intensidad: intensidadAhora === null ? "Elige qué tan fuerte la sientes ahora." : undefined,
      paso: pasoElegido === null ? "Elige lo que te ayudaría ahora." : undefined,
    };
    setErrores(nuevosErrores);
    if (intensidadAhora === null || pasoElegido === null) return;

    if (registroId) {
      setGuardando(true);
      setErrorGuardado(null);
      try {
        const respuesta = await fetch(`/api/pausa/${registroId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intensidadFinal: intensidadAhora, accionElegida: pasoElegido }),
        });
        if (!respuesta.ok) throw new Error(`Estado ${respuesta.status}`);
      } catch {
        setErrorGuardado("No pudimos guardar tu elección. Inténtalo de nuevo.");
        setGuardando(false);
        return;
      }
      setGuardando(false);
    }
    onFinalizar({ intensidadFinal: intensidadAhora, accionElegida: pasoElegido });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 id="pregunta-ahora" className="text-lg font-semibold">
          ¿Qué tan intenso es lo que sientes ahora?
        </h2>
        <SelectorIntensidad
          id="pregunta-ahora"
          valor={intensidadAhora}
          extremos={["0: Nada", "10: Muy fuerte"]}
          onChange={(valor) => {
            setIntensidadAhora(valor);
            setErrores((previo) => ({ ...previo, intensidad: undefined }));
          }}
        />
        {errores.intensidad && (
          <p role="alert" className="text-sm font-medium text-alerta">
            {errores.intensidad}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="pregunta-paso" className="text-lg font-semibold">
          ¿Qué te ayudaría ahora?
        </h2>
        <div role="radiogroup" aria-labelledby="pregunta-paso" className="grid gap-4">
          {PASO_SIGUIENTE_IDS.map((id) => {
            const activo = pasoElegido === id;
            const { Icono, fondo } = ICONOS_PASO[id];
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => {
                  setPasoElegido(id);
                  setErrores((previo) => ({ ...previo, paso: undefined }));
                }}
                className={`${TARJETA_BASE} flex items-center gap-4 rounded-2xl border bg-white p-4 text-left ${
                  activo ? TARJETA_ACTIVA_SUAVE : "border-linea"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${fondo}`}
                >
                  <Icono size={30} strokeWidth={2.2} />
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-base font-semibold text-tinta">{PASOS_SIGUIENTES[id]}</span>
                  <span className="text-sm text-tinta-suave">{DESCRIPCION_PASOS_SIGUIENTES[id]}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                    activo ? "border-pausa bg-pausa" : "border-tinta-suave/40 bg-white"
                  }`}
                />
              </button>
            );
          })}
        </div>
        {errores.paso && (
          <p role="alert" className="text-sm font-medium text-alerta">
            {errores.paso}
          </p>
        )}
      </section>

      {errorGuardado && (
        <p role="alert" className="text-sm font-medium text-alerta">
          {errorGuardado}
        </p>
      )}
      <button
        type="button"
        onClick={confirmar}
        disabled={guardando}
        className={`${BASE_BOTON} ${RELLENO_EXITO} h-14 text-lg font-semibold`}
      >
        {guardando ? "Guardando…" : "Ver mi resumen"}
      </button>
    </div>
  );
}
