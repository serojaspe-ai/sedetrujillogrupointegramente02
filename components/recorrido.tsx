"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import type { RespuestaPausa, SolicitudPausa } from "@/lib/esquemas";
import { respuestaPausaSchema } from "@/lib/esquemas";
import { Bienvenida } from "./bienvenida";
import { ContactoProfesional } from "./contacto-profesional";
import { PasoPausa } from "./paso-pausa";
import { PasoResultado } from "./paso-resultado";
import { PasoSentir, type RespuestasSentir } from "./paso-sentir";
import { PasoSiguiente, type ResultadoPausa } from "./paso-siguiente";

type Paso = "sentir" | "pausa" | "siguiente" | "resultado";

const TITULOS: Record<Paso, string> = {
  sentir: "Cómo me siento",
  pausa: "Mi pausa",
  siguiente: "Mi siguiente paso",
  resultado: "Mi resultado",
};

const ORDEN: Paso[] = ["sentir", "pausa", "siguiente"];

const MENSAJES: Record<Paso, string> = {
  sentir: "Tómate tu tiempo. No hay respuestas correctas.",
  pausa: "Respira a tu ritmo. Solo sigue los pasos, sin prisa.",
  siguiente: "Date un momento para reconocer cómo te sientes y elegir qué hacer después.",
  resultado: "Gracias por acompañarte en esta pausa.",
};

const RESPUESTAS_INICIALES: RespuestasSentir = {
  emocion: null,
  intensidad: null,
  situacion: null,
  descripcion: "",
  minutos: null,
};

export function Recorrido() {
  const [paso, setPaso] = useState<Paso>("sentir");
  const [respuestas, setRespuestas] = useState<RespuestasSentir>(RESPUESTAS_INICIALES);
  const [pausa, setPausa] = useState<RespuestaPausa | null>(null);
  const [resultado, setResultado] = useState<ResultadoPausa | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [recorridoKey, setRecorridoKey] = useState(0);
  const [bienvenida, setBienvenida] = useState(true);

  if (bienvenida) {
    return <Bienvenida onComenzar={() => setBienvenida(false)} />;
  }

  function cambiarRespuestas(cambio: Partial<RespuestasSentir>) {
    setRespuestas((previo) => ({ ...previo, ...cambio }));
  }

  async function encontrarPausa(solicitud: SolicitudPausa) {
    setCargando(true);
    setErrorServidor(null);
    try {
      const respuesta = await fetch("/api/pausa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solicitud),
      });
      if (!respuesta.ok) throw new Error(`Estado ${respuesta.status}`);
      const datos = respuestaPausaSchema.parse(await respuesta.json());
      setPausa(datos);
      setPaso("pausa");
    } catch {
      setErrorServidor("No pudimos preparar tu pausa. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setRespuestas(RESPUESTAS_INICIALES);
    setPausa(null);
    setResultado(null);
    setErrorServidor(null);
    setPaso("sentir");
    setRecorridoKey((k) => k + 1);
  }

  const indice = paso === "resultado" ? ORDEN.length - 1 : ORDEN.indexOf(paso);

  return (
    <main className="relative flex min-h-screen flex-col items-center gap-6 px-4 py-8 sm:py-12">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-rosa-viva/35 blur-3xl motion-safe:animate-flotar" />
        <div className="absolute -right-28 top-1/3 h-96 w-96 rounded-full bg-celeste-viva/35 blur-3xl motion-safe:animate-flotar-lento" />
        <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-turquesa-viva/35 blur-3xl motion-safe:animate-flotar" />
      </div>

      <header className="flex w-full max-w-xl items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1F7A6D] shadow-sm motion-safe:animate-pop">
          <Leaf aria-hidden="true" size={24} />
        </span>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-tinta">Respira +</h1>
          <p className="text-base text-tinta-suave">Una pausa antes de responder.</p>
        </div>
      </header>

      <section
        aria-label="Recorrido de pausa"
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-white bg-white shadow-[0_20px_50px_-24px_rgba(39,72,214,0.35)]"
      >
        <div className="bg-gradient-to-r from-rosa-suave via-celeste-suave to-turquesa-suave px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pausa text-base font-bold text-white shadow-md shadow-pausa/25">
              {indice + 1}
            </span>
            <h2 className="text-xl font-semibold">{TITULOS[paso]}</h2>
            <span className="ml-auto whitespace-nowrap text-sm text-tinta-suave">
              Paso {indice + 1} de 3
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pausa to-[#3fb8a6] transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${((indice + 1) / ORDEN.length) * 100}%` }}
            />
          </div>
        </div>

        <div key={`${recorridoKey}-${paso}`} className="px-5 py-7 motion-safe:animate-entrada sm:px-7">
          <p className="mb-6 text-base leading-relaxed text-tinta-suave">{MENSAJES[paso]}</p>
          {paso === "sentir" && (
            <PasoSentir
              respuestas={respuestas}
              cargando={cargando}
              errorServidor={errorServidor}
              onCambiar={cambiarRespuestas}
              onEncontrar={encontrarPausa}
            />
          )}
          {paso === "pausa" && pausa && (
            <PasoPausa pausa={pausa} onSiguiente={() => setPaso("siguiente")} />
          )}
          {paso === "siguiente" && (
            <PasoSiguiente
              emocion={respuestas.emocion}
              registroId={pausa?.registroId ?? null}
              onFinalizar={(datos) => {
                setResultado(datos);
                setPaso("resultado");
              }}
            />
          )}
          {paso === "resultado" && resultado && (
            <PasoResultado respuestas={respuestas} resultado={resultado} onReiniciar={reiniciar} />
          )}
        </div>

        <div className="flex flex-col items-center gap-1 border-t border-linea/70 px-5 py-3">
          <ContactoProfesional />
        </div>
      </section>

      <p className="max-w-xl text-center text-sm text-tinta-suave">
        Esta herramienta no reemplaza la atención profesional.
      </p>
    </main>
  );
}
