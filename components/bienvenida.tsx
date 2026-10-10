"use client";

import { Cloud, Leaf, Sun } from "lucide-react";
import { BASE_BOTON, RELLENO_PRIMARIO } from "./estilos";

type Props = {
  onComenzar: () => void;
};

export function Bienvenida({ onComenzar }: Props) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-rosa-viva/30 blur-3xl motion-safe:animate-flotar" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-celeste-viva/30 blur-3xl motion-safe:animate-flotar-lento" />
        <div className="absolute bottom-1/3 left-1/3 h-64 w-64 rounded-full bg-turquesa-viva/25 blur-3xl motion-safe:animate-flotar" />
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#1F7A6D] shadow-sm motion-safe:animate-flotar-lento sm:left-16 sm:top-16 sm:h-16 sm:w-16"
      >
        <Leaf size={28} />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-14 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#0369A1] shadow-sm motion-safe:animate-flotar sm:right-16 sm:top-20 sm:h-16 sm:w-16"
      >
        <Cloud size={28} />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#B45309] shadow-sm motion-safe:animate-flotar sm:bottom-16 sm:right-24 sm:h-16 sm:w-16"
      >
        <Sun size={28} />
      </span>

      <div className="relative z-10 flex max-w-md flex-col items-center gap-6 motion-safe:animate-entrada">
        <p className="text-lg font-semibold tracking-wide text-pausa">Respira +</p>
        <h1 className="text-4xl font-bold leading-tight text-tinta sm:text-5xl">Este momento es para ti</h1>
        <p className="text-lg leading-relaxed text-tinta-suave">
          Date una pausa para reconocer lo que sientes y elegir cómo seguir. Vamos a tu ritmo.
        </p>
        <button
          type="button"
          onClick={onComenzar}
          className={`${BASE_BOTON} ${RELLENO_PRIMARIO} mt-4 h-16 w-full max-w-xs text-xl font-semibold`}
        >
          Comenzar mi pausa
        </button>
      </div>
    </main>
  );
}
