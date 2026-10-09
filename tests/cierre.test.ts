import { describe, expect, it } from "vitest";
import { mensajeCierre, tendenciaIntensidad } from "@/lib/cierre";

describe("tendenciaIntensidad", () => {
  it("distingue si la intensidad bajó, se mantuvo o subió", () => {
    expect(tendenciaIntensidad(7, 4)).toBe("baja");
    expect(tendenciaIntensidad(5, 5)).toBe("igual");
    expect(tendenciaIntensidad(3, 6)).toBe("sube");
  });
});

describe("mensajeCierre", () => {
  it("muestra ambos valores en cada caso", () => {
    expect(mensajeCierre(7, 4)).toContain("de 7 a 4");
    expect(mensajeCierre(5, 5)).toContain("se mantuvo en 5");
    expect(mensajeCierre(3, 6)).toContain("de 3 a 6");
  });

  it("acompaña sin diagnosticar cuando la intensidad sube", () => {
    expect(mensajeCierre(3, 6)).toContain("pide apoyo");
  });
});
