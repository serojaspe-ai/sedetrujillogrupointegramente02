"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  Footprints,
  ListChecks,
  MapPin,
  MessageCircle,
  PauseCircle,
  PenLine,
  Pause,
  Play,
  Timer,
  Wind,
  type LucideIcon,
} from "lucide-react";
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

const ICONOS_POR_ACTIVIDAD: Record<string, LucideIcon[]> = {
  "volver-presente": [Footprints, Eye, Wind, MapPin],
  "antes-responder": [PauseCircle, Wind, MessageCircle, PenLine],
  "una-cosa-a-la-vez": [ListChecks, PenLine, Timer, Flag],
};

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
  const [indice, setIndice] = useState(0);

  const iconos = ICONOS_POR_ACTIVIDAD[pausa.actividad.id] ?? [];
  const total = pausa.pasos.length;
  const Icono = iconos[indice % Math.max(iconos.length, 1)] ?? Eye;

  return (
    <div className="flex flex-col items-center gap-6 text-center motion-safe:animate-entrada">
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
        <div className="relative flex flex-col items-center gap-3">
          <div
            className={`relative flex h-60 w-60 items-center justify-center ${
              corriendo ? "motion-safe:animate-respirar" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 top-6 h-4 w-4 rounded-full bg-rosa-viva/70 motion-safe:animate-flotar"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 top-14 h-3 w-3 rounded-full bg-celeste-viva/80 motion-safe:animate-flotar-lento"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 -left-1 h-3 w-3 rounded-full bg-turquesa-viva/80 motion-safe:animate-flotar-lento"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-1 right-6 h-4 w-4 rounded-full bg-rosa-viva/60 motion-safe:animate-flotar"
            />
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <linearGradient id="gradiente-progreso" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="50%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r={RADIO} fill="#ffffff" stroke="#e0f2fe" strokeWidth="8" />
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
                className="text-5xl font-bold tabular-nums text-pausa"
              >
                {formatearTiempo(restanteMs)}
              </span>
              <span className="text-sm text-tinta-suave">{corriendo ? "minutos" : "en pausa"}</span>
            </div>
          </div>
          <p className="max-w-xs text-base font-medium leading-relaxed text-tinta">
            Este tiempo es para ti. Puedes terminar cuando lo necesites.
          </p>
        </div>
      )}

      {!terminado && total > 0 && (
        <section
          aria-label="Indicación actual"
          className="flex w-full flex-col gap-4 rounded-3xl bg-gradient-to-br from-rosa-suave via-celeste-suave to-turquesa-suave p-5 text-left shadow-sm"
        >
          <div className="flex items-center justify-between text-sm font-semibold text-tinta">
            <span>
              Indicación {indice + 1} de {total}
            </span>
            <span className="flex gap-1.5" aria-hidden="true">
              {pausa.pasos.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === indice ? "w-6 bg-pausa" : i < indice ? "w-2 bg-turquesa-viva" : "w-2 bg-white"
                  }`}
                />
              ))}
            </span>
          </div>

          <div className="flex items-start gap-4" key={indice}>
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm motion-safe:animate-pop ${
                COLORES_PASO[indice % COLORES_PASO.length]
              }`}
            >
              <Icono aria-hidden="true" size={28} strokeWidth={2.2} />
            </span>
            <p className="pt-1 text-xl font-medium leading-relaxed text-tinta motion-safe:animate-entrada">
              {pausa.pasos[indice]}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIndice((i) => Math.max(0, i - 1))}
              disabled={indice === 0}
              className={`${BASE_BOTON} inline-flex h-12 items-center gap-1 rounded-2xl border border-pausa bg-white px-4 font-semibold text-pausa hover:bg-pausa-suave disabled:opacity-40`}
            >
              <ChevronLeft aria-hidden="true" size={18} />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setIndice((i) => Math.min(total - 1, i + 1))}
              disabled={indice === total - 1}
              className={`${BASE_BOTON} inline-flex h-12 items-center gap-1 rounded-2xl border border-pausa bg-white px-4 font-semibold text-pausa hover:bg-pausa-suave disabled:opacity-40`}
            >
              Siguiente
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        </section>
      )}

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
              Pausar
            </button>
          ) : (
            <button
              type="button"
              onClick={reanudar}
              className={`${BASE_BOTON} inline-flex h-14 items-center gap-2 rounded-2xl border border-pausa bg-white px-4 font-medium text-pausa hover:bg-pausa-suave`}
            >
              <Play aria-hidden="true" size={18} />
              Continuar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
