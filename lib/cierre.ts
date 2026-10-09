export type TendenciaIntensidad = "baja" | "igual" | "sube";

export function tendenciaIntensidad(inicial: number, final: number): TendenciaIntensidad {
  if (final < inicial) return "baja";
  if (final > inicial) return "sube";
  return "igual";
}

export function mensajeCierre(inicial: number, final: number): string {
  switch (tendenciaIntensidad(inicial, final)) {
    case "baja":
      return `Tu intensidad bajó de ${inicial} a ${final}. Cada pausa cuenta, y ese cambio es un buen avance.`;
    case "igual":
      return `Tu intensidad se mantuvo en ${inicial}. No todas las pausas cambian la intensidad de inmediato, y eso también está bien.`;
    case "sube":
      return `Tu intensidad subió de ${inicial} a ${final}. Es normal sentirse así. Si lo necesitas, pide apoyo o habla con alguien de confianza.`;
  }
}
