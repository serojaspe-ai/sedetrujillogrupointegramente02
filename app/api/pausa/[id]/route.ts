import { NextResponse } from "next/server";
import { cierrePausaSchema } from "@/lib/esquemas";
import { completarRegistroPausa } from "@/lib/registros";
import { z } from "zod";

const identificadorSchema = z.string().uuid();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!identificadorSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Identificador no válido." }, { status: 400 });
  }

  const cuerpo: unknown = await request.json().catch(() => null);
  const cierre = cierrePausaSchema.safeParse(cuerpo);
  if (!cierre.success) {
    return NextResponse.json({ error: "Revisa tus respuestas e inténtalo de nuevo." }, { status: 400 });
  }

  const completado = await completarRegistroPausa(id, cierre.data);
  if (!completado) {
    return NextResponse.json(
      { error: "No se pudo guardar la elección de esta pausa." },
      { status: 409 },
    );
  }
  return NextResponse.json({ ok: true });
}
