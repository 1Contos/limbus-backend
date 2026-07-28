create extension if not exists pgcrypto;

create table if not exists public.licenses (
  id text primary key default gen_random_uuid()::text,
  owner_email text null,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  credits integer not null default 100 check (credits >= 0),
  device_status text not null default 'livre' check (device_status in ('livre', 'vinculado')),
  status text not null default 'ativa' check (status in ('ativa', 'banida')),
  expires_at timestamptz null,
  created_at timestamptz not null default now()
);

create index if not exists licenses_owner_email_idx on public.licenses (owner_email);
create index if not exists licenses_status_idx on public.licenses (status);
