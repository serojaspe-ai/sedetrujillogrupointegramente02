"use client";

import { useState } from "react";
import { Angry, Check, Frown, Meh } from "lucide-react";
import {
  DESCRIPCION_MAX_CARACTERES,
  EMOCIONES,
  ENLACES,
  SITUACION_OTROS,
  SITUACIONES,
  TIEMPO_OPCIONES,
  type Emocion,
  type Minutos,
  type Situacion,
} from "@/lib/catalogo";
import type { SolicitudPausa } from "@/lib/esquemas";
import { BASE_BOTON, RELLENO_PRIMARIO, TARJETA_ACTIVA, TARJETA_ACTIVA_SUAVE, TARJETA_BASE } from "./estilos";
import { SelectorIntensidad } from "./selector-intensidad";

export type RespuestasSentir = {
  emocion: Emocion | null;
  intensidad: number | null;
  situacion: Situacion | null;
  descripcion: string;
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

const EMOCION_VISUAL: Record<Emocion, { Icono: typeof Frown; fondo: string; tinta: string }> = {
  frustracion: { Icono: Frown, fondo: "bg-[#FBE7EF]", tinta: "text-[#B5487F]" },
  enojo: { Icono: Angry, fondo: "bg-[#F8D3E2]", tinta: "text-[#9C2F66]" },
  inquietud: { Icono: Meh, fondo: "bg-[#E3F6F3]", tinta: "text-[#1F7A6D]" },
};

export function validarRespuestas(
  respuestas: RespuestasSentir,
): { ok: true; solicitud: SolicitudPausa } | { ok: false; errores: Errores } {
  const { emocion, intensidad, situacion, minutos } = respuestas;
  if (emocion && intensidad !== null && situacion && minutos) {
    const descripcion =
      situacion === SITUACION_OTROS ? respuestas.descripcion.trim() || undefined : undefined;
    return { ok: true, solicitud: { emocion, intensidad, situacion, minutos, descripcion } };
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
    <div className="flex flex-col gap-8">
      <Bloque id="pregunta-emocion" titulo="¿Qué estás sintiendo?" error={errores.emocion}>
        <div role="radiogroup" aria-labelledby="pregunta-emocion" className="grid grid-cols-3 gap-3">
          {(Object.keys(EMOCIONES) as Emocion[]).map((id) => {
            const { Icono, fondo, tinta } = EMOCION_VISUAL[id];
            const activo = respuestas.emocion === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiar({ emocion: id })}
                className={`${TARJETA_BASE} relative flex flex-col items-center gap-2 rounded-2xl border bg-white px-2 py-4 text-center text-sm ${
                  activo ? `${TARJETA_ACTIVA} motion-safe:animate-pop` : "border-linea"
                }`}
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 ${fondo} ${tinta} ${
                    activo ? "scale-110" : ""
                  }`}
                >
                  <Icono aria-hidden="true" size={30} strokeWidth={2} />
                </span>
                <span className={activo ? "font-semibold text-pausa" : "text-tinta"}>{EMOCIONES[id]}</span>
                {activo && (
                  <span
                    aria-hidden="true"
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pausa text-white motion-safe:animate-pop"
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Bloque>

      <Bloque id="pregunta-intensidad" titulo="¿Qué tan intensa es?" error={errores.intensidad}>
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
                className={`${TARJETA_BASE} flex min-h-12 items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left text-base ${
                  activo ? TARJETA_ACTIVA_SUAVE : "border-linea"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    activo ? "border-pausa bg-pausa text-white" : "border-tinta-suave/50"
                  }`}
                >
                  {activo && <Check size={12} strokeWidth={3} className="motion-safe:animate-pop" />}
                </span>
                {SITUACIONES[id]}
              </button>
            );
          })}
        </div>

        {respuestas.situacion === SITUACION_OTROS && (
          <div className="flex flex-col gap-2 motion-safe:animate-entrada">
            <label htmlFor="descripcion-otros" className="text-sm font-medium text-tinta">
              Si quieres, cuéntanos un poco más
            </label>
            <textarea
              id="descripcion-otros"
              rows={3}
              maxLength={DESCRIPCION_MAX_CARACTERES}
              value={respuestas.descripcion}
              onChange={(evento) => cambiar({ descripcion: evento.target.value })}
              className="rounded-xl border border-linea bg-white px-4 py-3 text-base transition-colors focus:border-pausa focus:outline-none focus:ring-2 focus:ring-pausa/15"
            />
            <p className="text-xs text-tinta-suave">
              Para esta demostración, usa una situación ficticia y evita datos personales.
            </p>
            <p className="self-end text-xs text-tinta-suave">
              {respuestas.descripcion.length}/{DESCRIPCION_MAX_CARACTERES}
            </p>
          </div>
        )}
      </Bloque>

      <Bloque id="pregunta-tiempo" titulo="¿Cuánto tiempo quieres pausar?" error={errores.minutos}>
        <div role="radiogroup" aria-labelledby="pregunta-tiempo" className="grid grid-cols-3 gap-3">
          {TIEMPO_OPCIONES.map((minutos) => {
            const activo = respuestas.minutos === minutos;
            return (
              <button
                key={minutos}
                type="button"
                role="radio"
                aria-checked={activo}
                onClick={() => cambiar({ minutos })}
                className={`${BASE_BOTON} h-12 rounded-xl border text-base font-semibold ${
                  activo
                    ? "border-pausa bg-pausa text-white shadow-md shadow-pausa/25"
                    : "border-linea bg-white text-pausa hover:border-pausa hover:shadow-sm"
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
        className={`${BASE_BOTON} ${RELLENO_PRIMARIO} h-14 w-full text-lg font-semibold`}
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
