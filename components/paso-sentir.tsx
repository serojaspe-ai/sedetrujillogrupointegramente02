"use client";

import { useState } from "react";
import { Angry, Frown, Meh } from "lucide-react";
import {
  EMOCIONES,
  ENLACES,
  SITUACIONES,
  TIEMPO_OPCIONES,
  type Emocion,
  type Minutos,
  type Situacion,
} from "@/lib/catalogo";
import type { SolicitudPausa } from "@/lib/esquemas";
import { SelectorIntensidad } from "./selector-intensidad";

export type RespuestasSentir = {
  emocion: Emocion | null;
  intensidad: number | null;
  situacion: Situacion | null;
  minutos: Minutos | null;
};

type Errores = Partial<Record<keyof RespuestasSentir, string>>;

type Props = {
  respuestas: RespuestasSentir;
  cargando: boolean;
  errorServidor: string | null;
  onCambiar: (cambio: Partial<RespuestasSentir>) => void;
  onEncontrar: (solicitud: SolicitudPausa) => void;
};

const ICONOS: Record<Emocion, typeof Frown> = {
  frustracion: Frown,
  enojo: Angry,
  inquietud: Meh,
};

export function validarRespuestas(
  respuestas: RespuestasSentir,
): { ok: true; solicitud: SolicitudPausa } | { ok: false; errores: Errores } {
  const { emocion, intensidad, situacion, minutos } = respuestas;
  if (emocion && intensidad !== null && situacion && minutos) {
    return { ok: true, solicitud: { emocion, intensidad, situacion, minutos } };
  }
  return {
    ok: false,
    errores: {
      emocion: emocion ? undefined : "Elige cómo te sientes.",
      intensidad: intensidad === null ? "Elige qué tan intensa es la emoción." : undefined,
      situacion: situacion ? undefined : "Elige lo que ocurrió.",
      minutos: minutos ? undefined : "Elige cuánto tiempo quieres pausar.",
    },
  };
}

export function PasoSentir({
  respuestas,
  cargando,
  errorServidor,
  onCambiar,
  onEncontrar,
}: Props) {
  const [errores, setErrores] = useState<Errores>({});

  function cambiar(cambio: Partial<RespuestasSentir>) {
    const limpios = Object.fromEntries(Object.keys(cambio).map((clave) => [clave, undefined]));
    setErrores((previo) => ({ ...previo, ...limpios }));
    onCambiar(cambio);
  }

  function encontrar() {
    const resultado = validarRespuestas(respuestas);
    if (resultado.ok) {
      onEncontrar(resultado.solicitud);
    } else {
      setErrores(resultado.errores);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <Bloque id="pregunta-emocion" titulo="¿Qué estás sintiendo?" error={errores.emocion}>
        <div role="radiogroup" aria-labelledby="pregunta-emocion" className="flex flex-col gap-2">
          {(Object.keys(EMOCIONES) as Emocion[]).map((id) => {
            const Icono = ICONOS[id];
            const activo = respuestas.emocion === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiar({ emocion: id })}
                className={`flex h-14 items-center gap-3 rounded-xl border px-4 text-left text-base transition ${
                  activo
                    ? "border-pausa bg-pausa-suave font-semibold text-pausa"
                    : "border-linea bg-white hover:border-pausa"
                }`}
              >
                <Icono aria-hidden="true" size={22} />
                <span className="flex-1">{EMOCIONES[id]}</span>
                {activo && <span aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
      </Bloque>

      <Bloque id="pregunta-intensidad" titulo="¿Qué tan intensa es?" error={errores.intensidad}>
        <p className="text-sm text-tinta-suave">Elige un número del 0 (nada) al 10 (muy intensa).</p>
        <SelectorIntensidad
          id="pregunta-intensidad"
          valor={respuestas.intensidad}
          onChange={(intensidad) => cambiar({ intensidad })}
        />
      </Bloque>

      <Bloque id="pregunta-situacion" titulo="¿Qué ocurrió?" error={errores.situacion}>
        <div role="radiogroup" aria-labelledby="pregunta-situacion" className="flex flex-col gap-2">
          {(Object.keys(SITUACIONES) as Situacion[]).map((id) => {
            const activo = respuestas.situacion === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiar({ situacion: id })}
                className={`min-h-12 rounded-xl border px-4 py-3 text-left text-base transition ${
                  activo
                    ? "border-pausa bg-pausa-suave font-semibold text-pausa"
                    : "border-linea bg-white hover:border-pausa"
                }`}
              >
                {SITUACIONES[id]}
              </button>
            );
          })}
        </div>
      </Bloque>

      <Bloque id="pregunta-tiempo" titulo="¿Cuánto tiempo quieres pausar?" error={errores.minutos}>
        <div role="radiogroup" aria-labelledby="pregunta-tiempo" className="grid grid-cols-3 gap-2">
          {TIEMPO_OPCIONES.map((minutos) => {
            const activo = respuestas.minutos === minutos;
            return (
              <button
                key={minutos}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiar({ minutos })}
                className={`h-12 rounded-xl border text-base font-semibold transition ${
                  activo
                    ? "border-pausa bg-pausa text-white"
                    : "border-linea bg-white text-pausa hover:border-pausa"
                }`}
              >
                {minutos} min
              </button>
            );
          })}
        </div>
      </Bloque>

      {errorServidor && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-alerta">
          {errorServidor}
        </p>
      )}

      <button
        type="button"
        onClick={encontrar}
        disabled={cargando}
        className="h-14 rounded-xl bg-pausa text-lg font-semibold text-white transition hover:bg-pausa-oscuro disabled:opacity-60"
      >
        {cargando ? "Preparando tu pausa…" : "Encontrar mi pausa"}
      </button>

      <footer className="flex flex-col items-center gap-2 border-t border-linea pt-5 text-sm text-tinta-suave">
        <p>Universidad César Vallejo · Trujillo</p>
        <nav aria-label="Enlaces de la UCV" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a className="text-pausa underline underline-offset-2" href={ENLACES.inicio} target="_blank" rel="noopener noreferrer">
            ucv.edu.pe
          </a>
          {ENLACES.redes.map((red) => (
            <a
              key={red.nombre}
              className="text-pausa underline underline-offset-2"
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {red.nombre}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}

function Bloque({
  id,
  titulo,
  error,
  children,
}: {
  id: string;
  titulo: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 id={id} className="text-lg font-semibold">
        {titulo}
      </h2>
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-alerta">
          {error}
        </p>
      )}
    </section>
  );
}
