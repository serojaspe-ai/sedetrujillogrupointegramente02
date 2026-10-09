import { NextResponse } from "next/server";
import { elegirActividad } from "@/lib/seleccion";
import { adaptarPausa } from "@/lib/pausa-ia";
import { solicitudPausaSchema } from "@/lib/esquemas";

export async function POST(request: Request) {
  const cuerpo: unknown = await request.json().catch(() => null);
  const solicitud = solicitudPausaSchema.safeParse(cuerpo);
  if (!solicitud.success) {
    return NextResponse.json(
      { error: "Revisa las respuestas e inténtalo de nuevo." },
      { status: 400 },
    );
  }

  const { emocion, minutos, situacion } = solicitud.data;
  const actividad = elegirActividad(emocion, minutos);
  const adaptacion = await adaptarPausa({ actividad, situacion, minutos });

  return NextResponse.json({
    actividad: { id: actividad.id, nombre: actividad.nombre, minutos },
    introduccion: adaptacion.introduccion,
    pasos: adaptacion.pasos,
    origen: adaptacion.origen,
  });
}
