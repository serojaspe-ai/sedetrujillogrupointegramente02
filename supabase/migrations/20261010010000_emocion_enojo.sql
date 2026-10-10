-- Agrega "enojo" a las emociones permitidas. Los registros anteriores se conservan.
alter table public.registros_pausas drop constraint if exists registros_pausas_emocion_check;

alter table public.registros_pausas
  add constraint registros_pausas_emocion_check
  check (emocion in ('estres', 'ansiedad', 'tristeza', 'enojo', 'frustracion', 'inquietud'));
