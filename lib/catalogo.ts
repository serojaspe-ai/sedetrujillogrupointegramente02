export const EMOCION_IDS = ["frustracion", "enojo", "inquietud"] as const;
export type Emocion = (typeof EMOCION_IDS)[number];

export const EMOCIONES: Record<Emocion, string> = {
  frustracion: "Frustración",
  enojo: "Enojo",
  inquietud: "Inquietud",
};

export const TIEMPO_OPCIONES = [2, 5, 10] as const;
export type Minutos = (typeof TIEMPO_OPCIONES)[number];

export const SITUACION_IDS = [
  "trabajo-grupo",
  "discusion-casa",
  "tareas-acumuladas",
] as const;
export type Situacion = (typeof SITUACION_IDS)[number];

export const SITUACIONES: Record<Situacion, string> = {
  "trabajo-grupo": "Sus compañeros no cumplieron su parte del trabajo",
  "discusion-casa": "Tuvo una discusión en casa",
  "tareas-acumuladas": "Se le acumularon varias tareas",
};

export const PASO_SIGUIENTE_IDS = ["esperar", "explicar", "apoyo"] as const;
export type PasoSiguienteId = (typeof PASO_SIGUIENTE_IDS)[number];

export const PASOS_SIGUIENTES: Record<PasoSiguienteId, string> = {
  esperar: "Esperar antes de responder",
  explicar: "Explicar lo que necesito",
  apoyo: "Pedir apoyo",
};

export type Actividad = {
  id: string;
  nombre: string;
  descripcion: string;
  minutosSoportados: readonly Minutos[];
  pasos: readonly string[];
};

export const VOLVER_AL_PRESENTE: Actividad = {
  id: "volver-presente",
  nombre: "Volver al presente",
  descripcion: "Conecta con lo que te rodea para salir del modo de alerta.",
  minutosSoportados: [2, 5, 10],
  pasos: [
    "Siéntate con los pies apoyados en el suelo.",
    "Observa 5 cosas que puedes ver a tu alrededor.",
    "Respira lento: inhala 4 segundos y exhala 6.",
    "Di en voz baja dónde estás y qué día es hoy.",
  ],
};

export const ANTES_DE_RESPONDER: Actividad = {
  id: "antes-responder",
  nombre: "Antes de responder",
  descripcion: "Te das un momento para decidir con calma qué quieres decir.",
  minutosSoportados: [2, 5, 10],
  pasos: [
    "Antes de escribir o hablar, haz una pausa.",
    "Respira profundo tres veces.",
    "Pregúntate: ¿qué necesito de esta situación?",
    "Escribe una frase sin enviarla, solo para ordenar tus ideas.",
  ],
};

export const UNA_COSA_A_LA_VEZ: Actividad = {
  id: "una-cosa-a-la-vez",
  nombre: "Una cosa a la vez",
  descripcion: "Reduces la carga eligiendo un solo paso pequeño.",
  minutosSoportados: [5, 10],
  pasos: [
    "Elige una sola tarea pequeña que puedas hacer ahora.",
    "Anótala en una hoja o en tu celular.",
    "Trabaja solo en esa tarea durante la pausa.",
    "Al terminar, decide cuál es el siguiente paso.",
  ],
};

export const ACTIVIDADES: readonly Actividad[] = [
  VOLVER_AL_PRESENTE,
  ANTES_DE_RESPONDER,
  UNA_COSA_A_LA_VEZ,
];

export const INTENSIDADES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const ENLACES = {
  inicio: "https://www.ucv.edu.pe/",
  bienestar:
    "https://www.ucv.edu.pe/vicerrectorado-bienestar-y-responsabilidad-social-universitaria",
  redes: [
    { nombre: "Facebook", url: "https://web.facebook.com/UCV.Peru" },
    { nombre: "Instagram", url: "https://www.instagram.com/ucv_peru/" },
    { nombre: "YouTube", url: "https://www.youtube.com/user/UnivCesarVallejo" },
    { nombre: "LinkedIn", url: "https://www.linkedin.com/school/ucvperu/" },
    { nombre: "TikTok", url: "https://www.tiktok.com/@ucv_peru" },
  ],
} as const;
