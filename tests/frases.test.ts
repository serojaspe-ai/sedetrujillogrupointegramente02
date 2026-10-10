import { describe, expect, it } from "vitest";
import { FRASES, elegirFrase } from "@/lib/frases";

describe("frases de cierre", () => {
  it("tiene cinco frases para cada emoción", () => {
    expect(FRASES.estres).toHaveLength(5);
    expect(FRASES.ansiedad).toHaveLength(5);
    expect(FRASES.tristeza).toHaveLength(5);
    expect(FRASES.enojo).toHaveLength(5);
  });

  it("elige la frase de la emoción indicada según el azar", () => {
    expect(elegirFrase("ansiedad", () => 0)).toBe(FRASES.ansiedad[0]);
    expect(elegirFrase("ansiedad", () => 0.999)).toBe(FRASES.ansiedad[4]);
    expect(elegirFrase("tristeza", () => 1)).toBe(FRASES.tristeza[4]);
  });
});
