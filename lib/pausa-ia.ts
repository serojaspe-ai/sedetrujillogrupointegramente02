import Anthropic from "@anthropic-ai/sdk";
import type { Actividad, Minutos, Situacion } from "./catalogo";
import { SITUACIONES } from "./catalogo";
import { adaptacionIaSchema } from "./esquemas";

const MODELO_POR_DEFECTO = "claude-haiku-5-5";
const TIMEOUT_MS = 8000;

const INSTRUCCIONES_SISTEMA = `Eres un asistente de Pausa UCV, una herramienta para estudiantes universitarios peruanos.
Tu única tarea es adaptar las instrucciones de una pausa breve a una situación cotidiana.
Reglas:
- Usa un lenguaje cercano, sencillo y amable, en español de Perú, con tratamiento de "tú".
- No diagnostiques, no menciones trastornos ni recomiendes medicamentos.
- No cambies la actividad: solo adapta sus pasos a la situación indicada.
- Cada paso debe poder hacerse en el tiempo indicado.
- Responde únicamente con un objeto JSON con esta forma: {"introduccion": string, "pasos": string[]}. "pasos" debe tener entre 2 y 5 elementos.`;

export type EntradaAdaptacion = {
  actividad: Actividad;
  situacion: Situacion;
  minutos: Minutos;
};

export type Adaptacion = {
  introduccion: string;
  pasos: string[];
  origen: "ia" | "demo";
};

function adaptacionDemo(actividad: Actividad): Adaptacion {
  return {
    introduccion: actividad.descripcion,
    pasos: [...actividad.pasos],
    origen: "demo",
  };
}

function extraerJson(texto: string): unknown {
  const inicio = texto.indexOf("{");
  const fin = texto.lastIndexOf("}");
  if (inicio === -1 || fin <= inicio) return null;
  try {
    return JSON.parse(texto.slice(inicio, fin + 1));
  } catch {
    return null;
  }
}

export async function adaptarPausa({
  actividad,
  situacion,
  minutos,
}: EntradaAdaptacion): Promise<Adaptacion> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return adaptacionDemo(actividad);
  }

  try {
    const cliente = new Anthropic({ maxRetries: 0 });
    const mensaje = await cliente.messages.create(
      {
        model: process.env.ANTHROPIC_MODEL || MODELO_POR_DEFECTO,
        max_tokens: 800,
        system: INSTRUCCIONES_SISTEMA,
        messages: [
          {
            role: "user",
            content: [
              `Situación: ${SITUACIONES[situacion]}.`,
              `Actividad: ${actividad.nombre}. Duración: ${minutos} minutos.`,
              `Pasos base de referencia: ${actividad.pasos.join(" | ")}`,
              "Adapta la introducción y los pasos a la situación.",
            ].join("\n"),
          },
        ],
      },
      { timeout: TIMEOUT_MS },
    );

    const texto = mensaje.content
      .map((bloque) => (bloque.type === "text" ? bloque.text : ""))
      .join("");
    const validada = adaptacionIaSchema.safeParse(extraerJson(texto));
    if (!validada.success) {
      return adaptacionDemo(actividad);
    }
    return { ...validada.data, origen: "ia" };
  } catch (error) {
    console.error(
      "Pausa UCV: adaptación con IA no disponible, se usa el catálogo.",
      error instanceof Error ? error.name : "error desconocido",
    );
    return adaptacionDemo(actividad);
  }
}
