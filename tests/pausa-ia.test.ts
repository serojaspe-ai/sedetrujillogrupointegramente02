import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { VOLVER_AL_PRESENTE } from "@/lib/catalogo";
import { adaptarPausa, construirMensajeUsuario } from "@/lib/pausa-ia";

const claveOriginal = process.env.ANTHROPIC_API_KEY;

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
});

afterEach(() => {
  if (claveOriginal === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = claveOriginal;
});

const entrada = {
  actividad: VOLVER_AL_PRESENTE,
  emocion: "enojo" as const,
  intensidad: 6,
  situacion: "discusion-casa" as const,
  minutos: 5 as const,
};

describe("adaptarPausa", () => {
  it("usa el catálogo en modo demo cuando no hay clave de API", async () => {
    const adaptacion = await adaptarPausa(entrada);
    expect(adaptacion.origen).toBe("demo");
    expect(adaptacion.pasos).toEqual([...VOLVER_AL_PRESENTE.pasos]);
  });

  it("no inventa la situación cuando Otros no tiene descripción", () => {
    const mensaje = construirMensajeUsuario({
      ...entrada,
      emocion: "inquietud",
      intensidad: 7,
      situacion: "otros",
    });
    expect(mensaje).toContain("Intensidad: 7/10");
    expect(mensaje).toContain("Duración: 5 minutos");
    expect(mensaje).toContain("No se describió la situación");
    expect(mensaje).not.toContain("Situación:");
  });

  it("incluye la descripción escrita en Otros como dato entre comillas", () => {
    const mensaje = construirMensajeUsuario({
      ...entrada,
      emocion: "enojo",
      intensidad: 4,
      situacion: "otros",
      descripcion: "Tuve un malentendido con una profesora.",
    });
    expect(mensaje).toContain('"""Tuve un malentendido con una profesora."""');
  });

  it("usa el texto de la opción elegida cuando no es Otros", () => {
    const mensaje = construirMensajeUsuario({
      ...entrada,
      emocion: "frustracion",
      intensidad: 6,
      situacion: "tareas-acumuladas",
    });
    expect(mensaje).toContain("Situación: Se me acumularon varias tareas.");
  });

  it("vuelve al catálogo si la clave no es válida o no hay conexión", async () => {
    process.env.ANTHROPIC_API_KEY = "clave-invalida-para-prueba";
    const adaptacion = await adaptarPausa(entrada);
    expect(adaptacion.origen).toBe("demo");
    expect(adaptacion.pasos.length).toBeGreaterThanOrEqual(2);
  }, 20_000);
});
