import {
  ANTES_DE_RESPONDER,
  UNA_COSA_A_LA_VEZ,
  VOLVER_AL_PRESENTE,
  type Actividad,
  type Emocion,
  type Minutos,
} from "./catalogo";

const ACTIVIDAD_POR_EMOCION: Record<Emocion, Actividad> = {
  enojo: VOLVER_AL_PRESENTE,
  frustracion: ANTES_DE_RESPONDER,
  inquietud: UNA_COSA_A_LA_VEZ,
};

export function elegirActividad(emocion: Emocion, minutos: Minutos): Actividad {
  const preferida = ACTIVIDAD_POR_EMOCION[emocion];
  return preferida.minutosSoportados.includes(minutos)
    ? preferida
    : VOLVER_AL_PRESENTE;
}
