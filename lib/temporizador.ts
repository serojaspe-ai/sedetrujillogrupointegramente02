export const INTERVALO_TEMPORIZADOR_MS = 250;

export function msRestantes(finMs: number, ahoraMs: number): number {
  return Math.max(0, finMs - ahoraMs);
}

export function formatearTiempo(ms: number): string {
  const segundos = Math.ceil(Math.max(0, ms) / 1000);
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

export function progreso(totalMs: number, restanteMs: number): number {
  if (totalMs <= 0) return 1;
  const transcurrido = 1 - restanteMs / totalMs;
  return Math.min(1, Math.max(0, transcurrido));
}
