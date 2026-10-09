"use client";

import { useEffect, useState } from "react";
import {
  INTERVALO_TEMPORIZADOR_MS,
  msRestantes,
} from "@/lib/temporizador";

type Estado = {
  corriendo: boolean;
  restanteMs: number;
  finMs: number;
};

export function useTemporizador(totalMs: number) {
  const [estado, setEstado] = useState<Estado>(() => ({
    corriendo: true,
    restanteMs: totalMs,
    finMs: Date.now() + totalMs,
  }));

  useEffect(() => {
    if (!estado.corriendo) return;
    const id = setInterval(() => {
      setEstado((previo) => {
        const restante = msRestantes(previo.finMs, Date.now());
        if (restante === 0) {
          return { ...previo, corriendo: false, restanteMs: 0 };
        }
        return { ...previo, restanteMs: restante };
      });
    }, INTERVALO_TEMPORIZADOR_MS);
    return () => clearInterval(id);
  }, [estado.corriendo, estado.finMs]);

  function detener() {
    setEstado((previo) => ({
      ...previo,
      corriendo: false,
      restanteMs: msRestantes(previo.finMs, Date.now()),
    }));
  }

  function reanudar() {
    setEstado((previo) =>
      previo.restanteMs > 0 && !previo.corriendo
        ? { ...previo, corriendo: true, finMs: Date.now() + previo.restanteMs }
        : previo,
    );
  }

  return {
    restanteMs: estado.restanteMs,
    corriendo: estado.corriendo,
    terminado: !estado.corriendo && estado.restanteMs === 0,
    detener,
    reanudar,
  };
}
