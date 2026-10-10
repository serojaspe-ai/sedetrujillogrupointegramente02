import type { Emocion } from "./catalogo";

export const FRASES: Record<Emocion, readonly string[]> = {
  frustracion: [
    "Tu esfuerzo cuenta, incluso en los días difíciles. Sigue a tu ritmo ☀️💛",
    "Puedes volver a intentarlo. Cada pequeño paso abre una nueva posibilidad 🌱😊",
    "Hoy también mereces paciencia, cariño y un momento para ti 🌷💛",
    "Darte una pausa también es una forma de seguir adelante 🌿✨",
    "Hay muchas cosas bonitas en ti. Date tiempo para reconocerlas 🌼😊",
  ],
  enojo: [
    "Tu voz importa. Puedes expresar lo que necesitas con respeto y cariño 💛✨",
    "Date un momento para elegir las palabras que te gustaría compartir 🌷😊",
    "Lo que sientes merece espacio, y tú mereces cuidarte mientras lo expresas 🌿💛",
    "Cada pausa te da una oportunidad para elegir cómo quieres responder ☀️✨",
    "Puedes poner límites y cuidar tus relaciones. Tu bienestar también cuenta 🌼💛",
  ],
  inquietud: [
    "Ve de una cosa a la vez. Los pequeños pasos también te llevan hacia adelante 🌱😊",
    "Date permiso para ir a tu ritmo y reconocer cada pequeño avance ☀️💛",
    "Empieza por algo sencillo y posible. Ese primer paso también cuenta 🌼✨",
    "Entre todos tus pendientes, también hay espacio para cuidarte 🌷💛",
    "Hoy puedes dar un paso pequeño y sentir orgullo por haberlo intentado 🌈😊",
  ],
};

export function elegirFrase(emocion: Emocion, azar: () => number = Math.random): string {
  const lista = FRASES[emocion];
  const indice = Math.min(lista.length - 1, Math.floor(azar() * lista.length));
  return lista[indice];
}
