"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { EMOCIONES, PASOS_SIGUIENTES, SITUACION_OTROS, SITUACIONES } from "@/lib/catalogo";
import { mensajeCierre } from "@/lib/cierre";
import { elegirFrase } from "@/lib/frases";
import { BASE_BOTON } from "./estilos";
import { NubeAcompanante } from "./nube-acompanante";
import type { ResultadoPausa } from "./paso-siguiente";
import type { RespuestasSentir } from "./paso-sentir";

function BarraIntensidad({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-tinta-suave">{etiqueta}</span>
        <span className="font-bold tabular-nums text-tinta">{valor}/10</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/80" role="img" aria-label={`${etiqueta}: ${valor} de 10`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-[width] duration-700 ease-out motion-reduce:transition-none`}
          style={{ width: `${valor * 10}%` }}
        />
      </div>
    </div>
  );
}

type Props = {
  respuestas: RespuestasSentir;
  resultado: ResultadoPausa;
  onReiniciar: () => void;
};

export function PasoResultado({ respuestas, resultado, onReiniciar }: Props) {
  const [frase] = useState(() => elegirFrase(respuestas.emocion ?? "ansiedad"));
  const intensidadInicial = respuestas.intensidad ?? 0;

  const situacionTexto =
    respuestas.situacion === SITUACION_OTROS && respuestas.descripcion.trim()
      ? respuestas.descripcion.trim()
      : respuestas.situacion
        ? SITUACIONES[respuestas.situacion]
        : "—";

  return (
    <div className="flex flex-col gap-8">
      <section
        aria-labelledby="titulo-resumen"
        className="flex flex-col gap-4 rounded-2xl border-2 border-turquesa-viva bg-white p-5 shadow-lg shadow-turquesa-viva/25 motion-safe:animate-entrada"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-turquesa-suave to-turquesa-viva">
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

        <div className="flex flex-col gap-3 rounded-xl bg-celeste-suave p-4">
          <BarraIntensidad etiqueta="Al inicio" valor={intensidadInicial} color="from-rosa-viva to-pink-500" />
          <BarraIntensidad etiqueta="Ahora" valor={resultado.intensidadFinal} color="from-turquesa-viva to-sky-400" />
          <p className="pt-1 text-base leading-relaxed text-tinta">
            {mensajeCierre(intensidadInicial, resultado.intensidadFinal)}
          </p>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-base">
          <dt className="text-tinta-suave">Emoción</dt>
          <dd className="font-medium">{respuestas.emocion ? EMOCIONES[respuestas.emocion] : "—"}</dd>
          <dt className="text-tinta-suave">Intensidad inicial</dt>
          <dd className="font-medium">{intensidadInicial}/10</dd>
          <dt className="text-tinta-suave">Intensidad final</dt>
          <dd className="font-medium">{resultado.intensidadFinal}/10</dd>
          <dt className="text-tinta-suave">Situación</dt>
          <dd className="font-medium">{situacionTexto}</dd>
          <dt className="text-tinta-suave">Siguiente paso</dt>
          <dd className="font-medium">{PASOS_SIGUIENTES[resultado.accionElegida]}</dd>
        </dl>
      </section>

      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-rosa-suave via-celeste-suave to-turquesa-suave px-6 py-8 text-center">
        <NubeAcompanante className="h-20 w-20" />
        <p className="text-2xl font-semibold leading-relaxed text-tinta motion-safe:animate-entrada sm:text-3xl" aria-live="polite">
          {frase}
        </p>
      </div>

      <button
        type="button"
        onClick={onReiniciar}
        className={`${BASE_BOTON} inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-pausa bg-white font-semibold text-pausa hover:bg-pausa-suave`}
      >
        <RotateCcw aria-hidden="true" size={18} />
        Iniciar otro recorrido
      </button>
    </div>
  );
}
