import { describe, expect, it } from "vitest";
import { elegirActividad } from "@/lib/seleccion";
import { formatearTiempo, msRestantes, progreso } from "@/lib/temporizador";

describe("elegirActividad", () => {
  it("usa la actividad preferida por emoción cuando el tiempo es compatible", () => {
    expect(elegirActividad("enojo", 5).id).toBe("volver-presente");
    expect(elegirActividad("frustracion", 2).id).toBe("antes-responder");
    expect(elegirActividad("inquietud", 10).id).toBe("una-cosa-a-la-vez");
  });

  it("vuelve a Volver al presente si la preferida no admite el tiempo", () => {
    expect(elegirActividad("inquietud", 2).id).toBe("volver-presente");
  });
});

describe("temporizador", () => {
  it("calcula el tiempo restante sin bajar de cero", () => {
    expect(msRestantes(10_000, 4_000)).toBe(6_000);
    expect(msRestantes(10_000, 12_000)).toBe(0);
  });

  it("formatea minutos y segundos", () => {
    expect(formatearTiempo(300_000)).toBe("05:00");
    expect(formatearTiempo(61_000)).toBe("01:01");
    expect(formatearTiempo(1)).toBe("00:01");
    expect(formatearTiempo(0)).toBe("00:00");
  });

  it("calcula el progreso transcurrido", () => {
    expect(progreso(120_000, 120_000)).toBe(0);
    expect(progreso(120_000, 60_000)).toBe(0.5);
    expect(progreso(120_000, 0)).toBe(1);
  });
});
