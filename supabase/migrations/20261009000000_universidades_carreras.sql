create table if not exists public.universidades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.carreras (
  id uuid primary key default gen_random_uuid(),
  universidad_id uuid not null references public.universidades (id) on delete cascade,
  nombre text not null,
  created_at timestamptz not null default now(),
  unique (universidad_id, nombre)
);

create index if not exists carreras_universidad_id_idx on public.carreras (universidad_id);

alter table public.universidades enable row level security;
alter table public.carreras enable row level security;

create policy "Lectura pública de universidades"
  on public.universidades for select
  to anon, authenticated
  using (true);

create policy "Lectura pública de carreras"
  on public.carreras for select
  to anon, authenticated
  using (true);

insert into public.universidades (nombre)
values ('Universidad César Vallejo')
on conflict (nombre) do nothing;
