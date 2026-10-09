create table if not exists public.registros_pausas (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  emocion text not null check (emocion in ('frustracion', 'enojo', 'inquietud')),
  intensidad_inicial integer not null check (intensidad_inicial between 0 and 10),
  intensidad_final integer check (intensidad_final between 0 and 10),
  situacion text not null check (
    situacion in ('trabajo-grupo', 'discusion-casa', 'tareas-acumuladas', 'no-salio-esperado', 'otros')
  ),
  tiempo_minutos integer not null check (tiempo_minutos in (2, 5, 10)),
  pausa_codigo text not null check (pausa_codigo in ('P1', 'P2', 'P3')),
  accion_elegida text check (accion_elegida in ('esperar', 'explicar', 'apoyo'))
);

alter table public.registros_pausas enable row level security;

revoke all on public.registros_pausas from anon, authenticated;
