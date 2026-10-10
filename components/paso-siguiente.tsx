"use client";

import { useState } from "react";
import {
  DESCRIPCION_PASOS_SIGUIENTES,
  EMOCIONES,
  PASO_SIGUIENTE_IDS,
  PASOS_SIGUIENTES,
  type Emocion,
  type PasoSiguienteId,
} from "@/lib/catalogo";
import { BASE_BOTON, RELLENO_EXITO, TARJETA_ACTIVA_SUAVE, TARJETA_BASE } from "./estilos";
import { MarcaSeleccion } from "./marca-seleccion";
import { SelectorIntensidad } from "./selector-intensidad";

export type ResultadoPausa = {
  intensidadFinal: number;
  accionElegida: PasoSiguienteId;
};

type Props = {
  emocion: Emocion | null;
  registroId: string | null;
  onFinalizar: (resultado: ResultadoPausa) => void;
};

export function PasoSiguiente({ emocion, registroId, onFinalizar }: Props) {
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  const [intensidadAhora, setIntensidadAhora] = useState<number | null>(null);
  const [pasoElegido, setPasoElegido] = useState<PasoSiguienteId | null>(null);
  const [errores, setErrores] = useState<{ intensidad?: string; paso?: string }>({});

  async function confirmar() {
    const nuevosErrores = {
      intensidad: intensidadAhora === null ? "Elige qué tan fuerte la sientes ahora." : undefined,
      paso: pasoElegido === null ? "Elige el pequeño paso que quieres dar." : undefined,
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
      <section className="flex flex-col gap-3">
        <h2 id="pregunta-ahora" className="text-lg font-semibold">
          ¿Qué tan fuerte sientes esa emoción ahora?
        </h2>
        {emocion && (
          <p className="text-sm font-medium text-pausa">Emoción elegida al inicio: {EMOCIONES[emocion]}</p>
        )}
        <p className="text-base leading-relaxed text-tinta-suave">
          Marca del 0 al 10 cuánto la sientes en este momento. No hay una respuesta correcta.
        </p>
        <SelectorIntensidad
          id="pregunta-ahora"
          valor={intensidadAhora}
          extremos={["0: No la siento", "10: La siento muy fuerte"]}
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

      <section className="flex flex-col gap-3">
        <h2 id="pregunta-paso" className="text-lg font-semibold">
          ¿Qué pequeño paso quieres dar ahora?
        </h2>
        <div role="radiogroup" aria-labelledby="pregunta-paso" className="flex flex-col gap-3">
          {PASO_SIGUIENTE_IDS.map((id) => {
            const activo = pasoElegido === id;
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
                className={`${TARJETA_BASE} flex min-h-14 items-start gap-3 rounded-2xl border bg-white px-4 py-4 text-left text-base ${
                  activo ? TARJETA_ACTIVA_SUAVE : "border-linea"
                }`}
              >
                <span className="pt-0.5">
                  <MarcaSeleccion activo={activo} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-semibold text-tinta">{PASOS_SIGUIENTES[id]}</span>
                  <span className="text-sm leading-relaxed text-tinta-suave">
                    {DESCRIPCION_PASOS_SIGUIENTES[id]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm leading-relaxed text-tinta-suave">
          Puedes elegir lo que te sirva ahora y cambiar de idea después.
        </p>
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
