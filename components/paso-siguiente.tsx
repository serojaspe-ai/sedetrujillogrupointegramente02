"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import {
  EMOCIONES,
  PASO_SIGUIENTE_IDS,
  PASOS_SIGUIENTES,
  SITUACION_OTROS,
  SITUACIONES,
  type PasoSiguienteId,
} from "@/lib/catalogo";
import { BASE_BOTON, RELLENO_EXITO, TARJETA_ACTIVA_SUAVE, TARJETA_BASE } from "./estilos";
import type { RespuestasSentir } from "./paso-sentir";
import { SelectorIntensidad } from "./selector-intensidad";

type Props = {
  respuestas: RespuestasSentir;
  registroId: string | null;
  onReiniciar: () => void;
};

export function PasoSiguiente({ respuestas, registroId, onReiniciar }: Props) {
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  const [intensidadAhora, setIntensidadAhora] = useState<number | null>(null);
  const [pasoElegido, setPasoElegido] = useState<PasoSiguienteId | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [errores, setErrores] = useState<{ intensidad?: string; paso?: string }>({});

  async function confirmar() {
    const nuevosErrores = {
      intensidad: intensidadAhora === null ? "Elige cómo te sientes ahora." : undefined,
      paso: pasoElegido === null ? "Elige el paso que quieres dar." : undefined,
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
    setConfirmado(true);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 id="pregunta-ahora" className="text-lg font-semibold">
          ¿Cómo te sientes ahora?
        </h2>
        <SelectorIntensidad
          id="pregunta-ahora"
          valor={intensidadAhora}
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
          ¿Qué quieres hacer?
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
                disabled={confirmado}
                onClick={() => {
                  setPasoElegido(id);
                  setErrores((previo) => ({ ...previo, paso: undefined }));
                }}
                className={`${TARJETA_BASE} flex min-h-14 items-center gap-3 rounded-2xl border bg-white px-4 text-left text-base disabled:cursor-default ${
                  activo ? TARJETA_ACTIVA_SUAVE : "border-linea"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    activo ? "border-pausa" : "border-tinta-suave/50"
                  }`}
                >
                  {activo && (
                    <span className="h-2.5 w-2.5 rounded-full bg-pausa motion-safe:animate-pop" />
                  )}
                </span>
                {PASOS_SIGUIENTES[id]}
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

      {confirmado ? (
        <section
          aria-labelledby="titulo-resumen"
          className="flex flex-col gap-4 rounded-2xl border border-exito/30 bg-white p-5 shadow-sm motion-safe:animate-entrada"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E3F6F3]">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-exito"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M5 12.5l4.5 4.5L19 7"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={0}
                  className="motion-safe:animate-trazar"
                />
              </svg>
            </span>
            <h2 id="titulo-resumen" className="text-lg font-semibold text-exito">
              Tu siguiente paso está listo
            </h2>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-base">
            <dt className="text-tinta-suave">Emoción</dt>
            <dd className="font-medium">
              {respuestas.emocion ? EMOCIONES[respuestas.emocion] : "—"}
            </dd>
            <dt className="text-tinta-suave">Intensidad</dt>
            <dd className="font-medium">
              {respuestas.intensidad ?? "—"}/10 al inicio, {intensidadAhora}/10 ahora
            </dd>
            <dt className="text-tinta-suave">Situación</dt>
            <dd className="font-medium">
              {respuestas.situacion === SITUACION_OTROS && respuestas.descripcion.trim()
                ? respuestas.descripcion.trim()
                : respuestas.situacion
                  ? SITUACIONES[respuestas.situacion]
                  : "—"}
            </dd>
            <dt className="text-tinta-suave">Paso elegido</dt>
            <dd className="font-medium">{pasoElegido ? PASOS_SIGUIENTES[pasoElegido] : "—"}</dd>
          </dl>
          <button
            type="button"
            onClick={onReiniciar}
            className={`${BASE_BOTON} inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-pausa bg-white font-semibold text-pausa hover:bg-pausa-suave`}
          >
            <RotateCcw aria-hidden="true" size={18} />
            Iniciar otro recorrido
          </button>
        </section>
      ) : (
        <>
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
            {guardando ? "Guardando…" : "Elegir este paso"}
          </button>
        </>
      )}
    </div>
  );
}
