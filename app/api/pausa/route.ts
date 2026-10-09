import { NextResponse } from "next/server";
import { elegirActividad } from "@/lib/seleccion";
import { adaptarPausa } from "@/lib/pausa-ia";
import { solicitudPausaSchema } from "@/lib/esquemas";
import { SITUACION_OTROS } from "@/lib/catalogo";

export async function POST(request: Request) {
  const cuerpo: unknown = await request.json().catch(() => null);
  const solicitud = solicitudPausaSchema.safeParse(cuerpo);
  if (!solicitud.success) {
    return NextResponse.json(
      { error: "Revisa las respuestas e inténtalo de nuevo." },
      { status: 400 },
    );
  }

  const { emocion, intensidad, minutos, situacion, descripcion } = solicitud.data;
  const actividad = elegirActividad(emocion, minutos);
  const descripcionLimpia =
    situacion === SITUACION_OTROS ? descripcion?.trim() || undefined : undefined;
  const adaptacion = await adaptarPausa({
    actividad,
    emocion,
    intensidad,
    situacion,
    descripcion: descripcionLimpia,
    minutos,
  });

  return NextResponse.json({
    actividad: { id: actividad.id, nombre: actividad.nombre, minutos },
    introduccion: adaptacion.introduccion,
    pasos: adaptacion.pasos,
    origen: adaptacion.origen,
  });
}
