"use client";

import { Pause, Play } from "lucide-react";
import type { RespuestaPausa } from "@/lib/esquemas";
import { formatearTiempo, progreso } from "@/lib/temporizador";
import { useTemporizador } from "./use-temporizador";

type Props = {
  pausa: RespuestaPausa;
  onSiguiente: () => void;
};

const RADIO = 52;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

export function PasoPausa({ pausa, onSiguiente }: Props) {
  const totalMs = pausa.actividad.minutos * 60_000;
  const { restanteMs, corriendo, terminado, detener, reanudar } = useTemporizador(totalMs);
  const avance = progreso(totalMs, restanteMs);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p
        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
          pausa.origen === "ia" ? "bg-pausa-suave text-pausa" : "bg-amber-50 text-amber-800"
        }`}
      >
        {pausa.origen === "ia" ? "Pausa adaptada con IA" : "Modo demo: actividad sin adaptación por IA"}
      </p>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{pausa.actividad.nombre}</h2>
        <p className="text-base text-tinta-suave">{pausa.introduccion}</p>
      </div>

      {terminado ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-2xl font-semibold text-exito">Tu tiempo terminó</p>
          <p className="text-base text-tinta-suave">Cuando estés lista o listo, continúa con tu siguiente paso.</p>
        </div>
      ) : (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r={RADIO} fill="none" stroke="#eff3ff" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={RADIO}
              fill="none"
              stroke="#2748d6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUNFERENCIA}
              strokeDashoffset={CIRCUNFERENCIA * (1 - avance)}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span role="timer" aria-label="Tiempo restante" className="text-4xl font-bold tabular-nums text-pausa">
              {formatearTiempo(restanteMs)}
            </span>
            <span className="text-sm text-tinta-suave">minutos</span>
          </div>
        </div>
      )}

      <ol className="flex w-full flex-col gap-3 text-left">
        {pausa.pasos.map((paso, indice) => (
          <li key={paso} className="flex gap-3 text-base">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pausa-suave text-sm font-semibold text-pausa">
              {indice + 1}
            </span>
            <span className="pt-0.5">{paso}</span>
          </li>
        ))}
      </ol>

      {terminado ? (
        <button
          type="button"
          onClick={onSiguiente}
          className="h-14 w-full rounded-xl bg-pausa text-lg font-semibold text-white transition hover:bg-pausa-oscuro"
        >
          Continuar
        </button>
      ) : (
        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onSiguiente}
            className="h-14 flex-1 rounded-xl bg-pausa px-2 text-base font-semibold text-white transition hover:bg-pausa-oscuro sm:text-lg"
          >
            Terminé mi pausa
          </button>
          {corriendo ? (
            <button
              type="button"
              onClick={detener}
              className="inline-flex h-14 items-center gap-2 rounded-xl border border-linea px-4 font-medium text-tinta-suave hover:border-pausa"
            >
              <Pause aria-hidden="true" size={18} />
              Detener
            </button>
          ) : (
            <button
              type="button"
              onClick={reanudar}
              className="inline-flex h-14 items-center gap-2 rounded-xl border border-linea px-4 font-medium text-pausa hover:border-pausa"
            >
              <Play aria-hidden="true" size={18} />
              Reanudar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
