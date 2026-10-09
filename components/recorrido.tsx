"use client";

import { useState } from "react";
import type { RespuestaPausa, SolicitudPausa } from "@/lib/esquemas";
import { respuestaPausaSchema } from "@/lib/esquemas";
import { ContactoProfesional } from "./contacto-profesional";
import { PasoPausa } from "./paso-pausa";
import { PasoSentir, type RespuestasSentir } from "./paso-sentir";
import { PasoSiguiente } from "./paso-siguiente";

type Paso = "sentir" | "pausa" | "siguiente";

const TITULOS: Record<Paso, string> = {
  sentir: "Cómo me siento",
  pausa: "Mi pausa",
  siguiente: "Mi siguiente paso",
};

const ORDEN: Paso[] = ["sentir", "pausa", "siguiente"];

const RESPUESTAS_INICIALES: RespuestasSentir = {
  emocion: null,
  intensidad: null,
  situacion: null,
  minutos: null,
};

export function Recorrido() {
  const [paso, setPaso] = useState<Paso>("sentir");
  const [respuestas, setRespuestas] = useState<RespuestasSentir>(RESPUESTAS_INICIALES);
  const [pausa, setPausa] = useState<RespuestaPausa | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [recorridoKey, setRecorridoKey] = useState(0);

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
    setErrorServidor(null);
    setPaso("sentir");
    setRecorridoKey((k) => k + 1);
  }

  const indice = ORDEN.indexOf(paso);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-white px-4 py-8 sm:py-12">
      <header className="flex w-full max-w-xl flex-col gap-1">
        <h1 className="text-3xl font-bold text-tinta">Pausa UCV</h1>
        <p className="text-base text-tinta-suave">Una pausa antes de responder.</p>
      </header>

      <section
        aria-label="Recorrido de pausa"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-linea bg-white shadow-sm"
      >
        <div className="flex items-center gap-3 border-b border-linea bg-pausa-suave px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pausa text-base font-bold text-white">
            {indice + 1}
          </span>
          <h2 className="text-xl font-semibold">{TITULOS[paso]}</h2>
          <span className="ml-auto whitespace-nowrap text-sm text-tinta-suave">Paso {indice + 1} de 3</span>
        </div>

        <div key={`${recorridoKey}-${paso}`} className="px-5 py-6 sm:px-7">
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
            <PasoSiguiente respuestas={respuestas} onReiniciar={reiniciar} />
          )}
        </div>

        <div className="flex flex-col items-center gap-1 border-t border-linea px-5 py-3">
          <ContactoProfesional />
        </div>
      </section>

      <p className="max-w-xl text-center text-sm text-tinta-suave">
        Esta herramienta no reemplaza la atención profesional.
      </p>
    </main>
  );
}
