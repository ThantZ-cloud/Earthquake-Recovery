-- Push notification tokens (FCM on Android via Capacitor bridge)
create table if not exists public.push_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  token text not null unique,
  platform text not null default 'android'
    check (platform in ('android', 'ios', 'web')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists push_tokens_user_id_idx on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

-- Users manage their own tokens
create policy "Users select own push tokens"
  on public.push_tokens for select
  using (auth.uid() = user_id);

create policy "Users insert own push tokens"
  on public.push_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users update own push tokens"
  on public.push_tokens for update
  using (auth.uid() = user_id);

create policy "Users delete own push tokens"
  on public.push_tokens for delete
  using (auth.uid() = user_id);

-- Keep updated_at fresh on token changes
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists push_tokens_touch_updated_at on public.push_tokens;
create trigger push_tokens_touch_updated_at
  before update on public.push_tokens
  for each row
  execute function public.touch_updated_at();

-- Alert dedupe log: one row per (user_id, quake_id) ever pushed
create table if not exists public.alert_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  quake_id text not null,
  sent_at timestamp with time zone default now(),
  unique (user_id, quake_id)
);

create index if not exists alert_log_user_id_idx on public.alert_log (user_id);

alter table public.alert_log enable row level security;

-- Users can read their own alert history (optional)
create policy "Users select own alert log"
  on public.alert_log for select
  using (auth.uid() = user_id);
