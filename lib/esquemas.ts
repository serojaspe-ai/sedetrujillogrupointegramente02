import { z } from "zod";
import {
  DESCRIPCION_MAX_CARACTERES,
  EMOCION_IDS,
  SITUACION_IDS,
} from "./catalogo";

export const solicitudPausaSchema = z.object({
  emocion: z.enum(EMOCION_IDS),
  minutos: z.union([z.literal(2), z.literal(5), z.literal(10)]),
  intensidad: z.number().int().min(0).max(10),
  situacion: z.enum(SITUACION_IDS),
  descripcion: z.string().max(DESCRIPCION_MAX_CARACTERES).optional(),
});

export type SolicitudPausa = z.infer<typeof solicitudPausaSchema>;

export const respuestaPausaSchema = z.object({
  actividad: z.object({
    id: z.string(),
    nombre: z.string(),
    minutos: z.number(),
  }),
  introduccion: z.string(),
  pasos: z.array(z.string()),
  origen: z.enum(["ia", "demo"]),
});

export type RespuestaPausa = z.infer<typeof respuestaPausaSchema>;

export const adaptacionIaSchema = z.object({
  introduccion: z.string().min(1).max(220),
  pasos: z.array(z.string().min(1).max(180)).min(2).max(5),
});
