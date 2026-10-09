import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Emocion, Minutos, PasoSiguienteId, Situacion } from "./catalogo";

export type PausaCodigo = "P1" | "P2" | "P3";

const CODIGO_POR_ACTIVIDAD: Record<string, PausaCodigo> = {
  "volver-presente": "P1",
  "antes-responder": "P2",
  "una-cosa-a-la-vez": "P3",
};

export function codigoPausa(actividadId: string): PausaCodigo {
  return CODIGO_POR_ACTIVIDAD[actividadId] ?? "P1";
}

let cliente: SupabaseClient | null = null;

function clienteServidor(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !clave) return null;
  cliente ??= createClient(url, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

export type NuevoRegistro = {
  emocion: Emocion;
  intensidadInicial: number;
  situacion: Situacion;
  minutos: Minutos;
  pausaCodigo: PausaCodigo;
};

export async function crearRegistroPausa(datos: NuevoRegistro): Promise<string | null> {
  const db = clienteServidor();
  if (!db) return null;

  const { data, error } = await db
    .from("registros_pausas")
    .insert({
      emocion: datos.emocion,
      intensidad_inicial: datos.intensidadInicial,
      situacion: datos.situacion,
      tiempo_minutos: datos.minutos,
      pausa_codigo: datos.pausaCodigo,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Pausa UCV: no se pudo crear el registro de la pausa.", error.code);
    return null;
  }
  return data.id;
}

export async function completarRegistroPausa(
  id: string,
  cierre: { intensidadFinal: number; accionElegida: PasoSiguienteId },
): Promise<boolean> {
  const db = clienteServidor();
  if (!db) return false;

  const { data, error } = await db
    .from("registros_pausas")
    .update({
      intensidad_final: cierre.intensidadFinal,
      accion_elegida: cierre.accionElegida,
    })
    .eq("id", id)
    .is("accion_elegida", null)
    .select("id");

  if (error) {
    console.error("Pausa UCV: no se pudo completar el registro de la pausa.", error.code);
    return false;
  }
  return data.length === 1;
}
