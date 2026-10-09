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
import type { RespuestasSentir } from "./paso-sentir";
import { SelectorIntensidad } from "./selector-intensidad";

type Props = {
  respuestas: RespuestasSentir;
  onReiniciar: () => void;
};

export function PasoSiguiente({ respuestas, onReiniciar }: Props) {
  const [intensidadAhora, setIntensidadAhora] = useState<number | null>(null);
  const [pasoElegido, setPasoElegido] = useState<PasoSiguienteId | null>(null);
  const [confirmado, setConfirmado] = useState(false);
  const [errores, setErrores] = useState<{ intensidad?: string; paso?: string }>({});

  function confirmar() {
    const nuevosErrores = {
      intensidad: intensidadAhora === null ? "Elige cómo te sientes ahora." : undefined,
      paso: pasoElegido === null ? "Elige el paso que quieres dar." : undefined,
    };
    setErrores(nuevosErrores);
    if (!nuevosErrores.intensidad && !nuevosErrores.paso) setConfirmado(true);
  }

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-3">
        <h2 id="pregunta-ahora" className="text-lg font-semibold">
          ¿Cómo te sientes ahora?
        </h2>
        <p className="text-sm text-tinta-suave">Elige un número del 0 (nada) al 10 (muy intensa).</p>
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
        <div role="radiogroup" aria-labelledby="pregunta-paso" className="flex flex-col gap-2">
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
                className={`flex h-14 items-center gap-3 rounded-xl border px-4 text-left text-base transition disabled:cursor-default ${
                  activo
                    ? "border-pausa bg-pausa-suave font-semibold text-pausa"
                    : "border-linea bg-white hover:border-pausa"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    activo ? "border-pausa" : "border-tinta-suave"
                  }`}
                >
                  {activo && <span className="h-2.5 w-2.5 rounded-full bg-pausa" />}
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
        <section aria-labelledby="titulo-resumen" className="flex flex-col gap-3 rounded-2xl border border-exito/40 bg-emerald-50/40 p-5">
          <h2 id="titulo-resumen" className="text-lg font-semibold text-exito">
            Tu siguiente paso
          </h2>
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
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-pausa font-semibold text-pausa hover:bg-pausa-suave"
          >
            <RotateCcw aria-hidden="true" size={18} />
            Iniciar otro recorrido
          </button>
        </section>
      ) : (
        <button
          type="button"
          onClick={confirmar}
          className="h-14 rounded-xl bg-exito text-lg font-semibold text-white transition hover:opacity-90"
        >
          Elegir este paso
        </button>
      )}
    </div>
  );
}
