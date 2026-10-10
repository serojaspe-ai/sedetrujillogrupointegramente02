"use client";

import { ArrowRight, Leaf } from "lucide-react";

type Props = {
  onComenzar: () => void;
};

export function Bienvenida({ onComenzar }: Props) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#fbcfe8] via-[#bae6fd] to-[#99f6e4] px-6 py-12 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-rosa-viva/40 blur-3xl motion-safe:animate-flotar" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-celeste-viva/40 blur-3xl motion-safe:animate-flotar-lento" />
        <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-turquesa-viva/40 blur-3xl motion-safe:animate-flotar" />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-5 motion-safe:animate-entrada">
        <p className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-2xl font-bold text-pausa shadow-sm sm:text-3xl">
          <Leaf aria-hidden="true" size={26} className="text-[#0F766E]" />
          Respira +
        </p>

        <div className="relative flex w-full items-center justify-center py-2">
          <Decoraciones />
          <IlustracionNube />
        </div>

        <h1 className="break-words text-[38px] font-extrabold leading-[1.1] text-tinta sm:text-[64px]">
          Este momento{" "}
          <span className="whitespace-nowrap text-[#06B6D4]">es para ti</span>
        </h1>

        <p className="max-w-xl text-[18px] leading-relaxed text-tinta sm:text-[22px]">
          Date una pausa para reconocer lo que sientes y elegir cómo seguir. Vamos a tu ritmo.
        </p>

        <button
          type="button"
          onClick={onComenzar}
          className="group mt-2 inline-flex h-16 w-full max-w-sm items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pausa to-[#06B6D4] px-8 text-xl font-bold text-white shadow-xl shadow-pausa/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none"
        >
          Comenzar mi pausa
          <ArrowRight
            aria-hidden="true"
            size={22}
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </button>
      </div>
    </main>
  );
}

function IlustracionNube() {
  return (
    <svg viewBox="0 0 200 180" className="h-56 w-56 motion-safe:animate-flotar sm:h-72 sm:w-72" aria-hidden="true">
      <g fill="#67E8F9">
        <circle cx="62" cy="92" r="25" />
        <circle cx="92" cy="72" r="33" />
        <circle cx="128" cy="88" r="27" />
        <rect x="58" y="88" width="96" height="40" rx="20" />
      </g>
      <g fill="#FFFFFF">
        <circle cx="62" cy="92" r="22" />
        <circle cx="92" cy="72" r="30" />
        <circle cx="128" cy="88" r="24" />
        <rect x="62" y="88" width="88" height="36" rx="18" />
      </g>
      <ellipse cx="82" cy="100" rx="7" ry="4" fill="#FBCFE8" />
      <ellipse cx="128" cy="100" rx="7" ry="4" fill="#FBCFE8" />
      <circle cx="90" cy="88" r="3.5" fill="#15203B" />
      <circle cx="120" cy="88" r="3.5" fill="#15203B" />
      <path d="M96 99 Q105 107 114 99" fill="none" stroke="#15203B" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M105 152 C80 134 74 120 84 114 C92 109 100 115 105 122 C110 115 118 109 126 114 C136 120 130 134 105 152 Z"
        fill="#F472B6"
        stroke="#DB2777"
        strokeWidth="2"
      />
      <path d="M68 116 Q74 130 88 134" fill="none" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" />
      <path d="M142 116 Q136 130 122 134" fill="none" stroke="#0EA5E9" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Decoraciones() {
  return (
    <>
      <Flor className="absolute left-0 top-2 h-12 w-12 motion-safe:animate-flotar-lento sm:left-4 sm:h-16 sm:w-16" />
      <Flor className="absolute bottom-2 right-0 h-10 w-10 motion-safe:animate-flotar sm:right-4 sm:h-14 sm:w-14" />
      <Destello className="absolute right-6 top-0 h-7 w-7 motion-safe:animate-flotar sm:right-12 sm:h-9 sm:w-9" />
      <Destello className="absolute bottom-6 left-6 h-6 w-6 motion-safe:animate-flotar-lento sm:left-14 sm:h-8 sm:w-8" />
      <svg aria-hidden="true" viewBox="0 0 120 40" className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 text-[#67E8F9] sm:w-36">
        <path d="M4 30 Q30 4 60 22 T116 14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </>
  );
}

function Flor({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className}>
      <g fill="#FBCFE8">
        <circle cx="24" cy="12" r="9" />
        <circle cx="36" cy="22" r="9" />
        <circle cx="31" cy="37" r="9" />
        <circle cx="17" cy="37" r="9" />
        <circle cx="12" cy="22" r="9" />
      </g>
      <circle cx="24" cy="25" r="6" fill="#FDE68A" />
    </svg>
  );
}

function Destello({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22 C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z"
        fill="#5EEAD4"
      />
    </svg>
  );
}
