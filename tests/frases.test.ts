import { describe, expect, it } from "vitest";
import { FRASES, elegirFrase } from "@/lib/frases";

describe("frases de cierre", () => {
  it("tiene cinco frases para cada emoción", () => {
    expect(FRASES.frustracion).toHaveLength(5);
    expect(FRASES.enojo).toHaveLength(5);
    expect(FRASES.inquietud).toHaveLength(5);
  });

  it("elige la frase de la emoción indicada según el azar", () => {
    expect(elegirFrase("enojo", () => 0)).toBe(FRASES.enojo[0]);
    expect(elegirFrase("enojo", () => 0.999)).toBe(FRASES.enojo[4]);
    expect(elegirFrase("inquietud", () => 1)).toBe(FRASES.inquietud[4]);
  });
});
