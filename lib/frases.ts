import type { Emocion } from "./catalogo";

export const FRASES: Record<Emocion, readonly string[]> = {
  estres: [
    "Una cosa a la vez. Entre tantos pendientes, también mereces un momento para ti 🌿😊",
    "Tienes permiso para hacer una pausa y continuar a tu ritmo ☀️💛",
    "Cada pequeño avance cuenta. Date crédito por lo que ya has podido hacer 🌱✨",
    "Puedes empezar por algo sencillo y dejar espacio para cuidarte 🌼😊",
    "Trátate con la misma paciencia que le darías a alguien que quieres 🤗💛",
  ],
  ansiedad: [
    "Puedes ir paso a paso. Date tiempo para elegir cómo continuar 🌿💛",
    "Concéntrate en un paso pequeño y posible. Ese también cuenta 🌱😊",
    "Mereces paciencia y cariño mientras atraviesas este momento 🌷✨",
    "Puedes buscar compañía y compartir lo que sientes. Mereces ser escuchado 🤗💛",
    "Date espacio para cuidar de ti mientras encuentras tu siguiente paso ☀️😊",
  ],
  tristeza: [
    "Hoy mereces tratarte con cariño, tal como estás 🌷💛",
    "En los días difíciles, los pequeños gestos de cuidado también cuentan 🌼✨",
    "Tu presencia importa. Mereces compañía, atención y cariño 🤗💛",
    "Puedes acercarte a alguien de confianza y dejar que te escuche ☀️💛",
    "Date permiso para avanzar despacito. Cada pequeño intento cuenta 🌱😊",
  ],
  enojo: [
    "Puedes darte un momento antes de responder. Lo que sientes merece ser escuchado 💛🌿",
    "Tus palabras importan. Date tiempo para encontrar cómo expresar lo que necesitas 😊✨",
    "Hacer una pausa también es cuidarte. Puedes continuar a tu ritmo ☀️💛",
    "No tienes que resolverlo todo ahora. Un pequeño paso puede ser suficiente por hoy 🌱😊",
    "Mereces expresar lo que te pasa con respeto y sentirte escuchado 🤗💛",
  ],
};

export function elegirFrase(emocion: Emocion, azar: () => number = Math.random): string {
  const lista = FRASES[emocion];
  const indice = Math.min(lista.length - 1, Math.floor(azar() * lista.length));
  return lista[indice];
}
