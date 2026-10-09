"use client";

import { useRef } from "react";
import { ENLACES } from "@/lib/catalogo";

export function ContactoProfesional() {
  const dialogo = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        className="inline-flex items-center gap-2 rounded-full border border-rosa-viva/50 bg-rosa-suave px-4 py-2 text-sm font-semibold text-[#9d174d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97] motion-reduce:transform-none"
      >
        <IconoMensaje />
        Quiero hablar con alguien
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby="titulo-contacto"
        className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-linea p-0 text-tinta shadow-xl backdrop:bg-tinta/40"
      >
        <div className="flex flex-col gap-4 p-6">
          <h2 id="titulo-contacto" className="text-xl font-semibold">
            Hablar con alguien
          </h2>
          <p className="text-sm text-tinta-suave">
            Si sientes que necesitas acompañamiento, estos espacios pueden ayudarte.
            Esta herramienta no reemplaza la atención profesional.
          </p>

          <div className="rounded-xl border border-linea p-4">
            <p className="font-semibold">Bienestar Universitario UCV</p>
            <p className="mt-1 text-sm text-tinta-suave">
              Consulta sus canales de atención en la página oficial de la universidad.
            </p>
            <a
              href={ENLACES.bienestar}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-pausa underline underline-offset-2"
            >
              Ir a Bienestar Universitario
            </a>
          </div>

          <div className="rounded-xl border border-linea p-4">
            <p className="font-semibold">Línea 113, opción 5</p>
            <p className="mt-1 text-sm text-tinta-suave">
              Atención de salud mental del Ministerio de Salud (MINSA).
            </p>
          </div>

          <button
            type="button"
            onClick={() => dialogo.current?.close()}
            className="h-12 rounded-xl bg-pausa font-semibold text-white hover:bg-pausa-oscuro"
          >
            Cerrar
          </button>
        </div>
      </dialog>
    </>
  );
}

function IconoMensaje() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
