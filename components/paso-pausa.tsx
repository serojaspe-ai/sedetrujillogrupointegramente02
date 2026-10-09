"use client";

import { Eye, MessageCircle, PenLine, Pause, Play, Wind } from "lucide-react";
import type { RespuestaPausa } from "@/lib/esquemas";
import { formatearTiempo, progreso } from "@/lib/temporizador";
import { BASE_BOTON, RELLENO_PRIMARIO, RELLENO_SECUNDARIO } from "./estilos";
import { useTemporizador } from "./use-temporizador";

type Props = {
  pausa: RespuestaPausa;
  onSiguiente: () => void;
};

const RADIO = 52;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;
const ICONOS_PASO = [Eye, Wind, MessageCircle, PenLine];
const COLORES_PASO = [
  "bg-rosa-suave text-[#be185d]",
  "bg-celeste-suave text-[#0369a1]",
  "bg-turquesa-suave text-[#0f766e]",
  "bg-pausa-suave text-pausa",
];

export function PasoPausa({ pausa, onSiguiente }: Props) {
  const totalMs = pausa.actividad.minutos * 60_000;
  const { restanteMs, corriendo, terminado, detener, reanudar } = useTemporizador(totalMs);
  const avance = progreso(totalMs, restanteMs);

  return (
    <div className="flex flex-col items-center gap-7 text-center motion-safe:animate-entrada">
      <p
        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
          pausa.origen === "ia"
            ? "bg-celeste-suave text-[#0369a1]"
            : "border border-dashed border-amber-400 bg-amber-50 text-amber-900"
        }`}
      >
        {pausa.origen === "ia" ? "Pausa adaptada con IA" : "Modo demo: actividad sin adaptación por IA"}
      </p>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{pausa.actividad.nombre}</h2>
        <p className="text-base leading-relaxed text-tinta-suave">{pausa.introduccion}</p>
      </div>

      {terminado ? (
        <div className="flex flex-col items-center gap-3 py-4 motion-safe:animate-pop">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E3F6F3] text-3xl">
            ✓
          </span>
          <p className="text-2xl font-semibold text-exito">Tu tiempo terminó</p>
          <p className="text-base text-tinta-suave">Cuando estés listo, continúa con tu siguiente paso.</p>
        </div>
      ) : (
        <div
          className={`relative flex h-52 w-52 items-center justify-center ${
            corriendo ? "motion-safe:animate-respirar" : ""
          }`}
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <linearGradient id="gradiente-progreso" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2748d6" />
                <stop offset="55%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={RADIO} fill="#ffffff" stroke="#eaf4fc" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={RADIO}
              fill="none"
              stroke="url(#gradiente-progreso)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUNFERENCIA}
              strokeDashoffset={CIRCUNFERENCIA * (1 - avance)}
              className="transition-[stroke-dashoffset] duration-300 ease-linear motion-reduce:transition-none"
            />
          </svg>
          <div className="relative flex flex-col items-center">
            <span
              role="timer"
              aria-label="Tiempo restante"
              className="text-4xl font-bold tabular-nums text-pausa"
            >
              {formatearTiempo(restanteMs)}
            </span>
            <span className="text-sm text-tinta-suave">{corriendo ? "minutos" : "en pausa"}</span>
          </div>
        </div>
      )}

      <ol className="flex w-full flex-col gap-3 text-left">
        {pausa.pasos.map((paso, indice) => {
          const Icono = ICONOS_PASO[indice % ICONOS_PASO.length];
          return (
            <li
              key={paso}
              className="flex items-start gap-4 rounded-2xl border border-linea bg-white p-4 leading-relaxed shadow-sm motion-safe:animate-entrada"
              style={{ animationDelay: `${150 + indice * 110}ms` }}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${COLORES_PASO[indice % COLORES_PASO.length]}`}
              >
                <Icono aria-hidden="true" size={20} />
              </span>
              <span className="pt-1.5 text-base">{paso}</span>
            </li>
          );
        })}
      </ol>

      {terminado ? (
        <button
          type="button"
          onClick={onSiguiente}
          className={`${BASE_BOTON} ${RELLENO_PRIMARIO} h-14 w-full text-lg font-semibold`}
        >
          Continuar
        </button>
      ) : (
        <div className="flex w-full items-center gap-3">
          <button
            type="button"
            onClick={onSiguiente}
            className={`${BASE_BOTON} ${RELLENO_PRIMARIO} h-14 flex-1 px-2 text-base font-semibold sm:text-lg`}
          >
            Terminé mi pausa
          </button>
          {corriendo ? (
            <button
              type="button"
              onClick={detener}
              className={`${BASE_BOTON} ${RELLENO_SECUNDARIO} inline-flex h-14 items-center gap-2 px-4 font-medium`}
            >
              <Pause aria-hidden="true" size={18} />
              Detener
            </button>
          ) : (
            <button
              type="button"
              onClick={reanudar}
              className={`${BASE_BOTON} inline-flex h-14 items-center gap-2 rounded-2xl border border-pausa bg-white px-4 font-medium text-pausa hover:bg-pausa-suave`}
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
