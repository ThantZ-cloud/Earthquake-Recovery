-- Admin Dashboard schema
-- Run this in Supabase SQL Editor after locations.sql and feedback.sql

-- 1. Admins table (for RLS admin checks - avoids infinite recursion)
create table if not exists admins (
  user_id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default now()
);

alter table admins enable row level security;

-- Any authenticated user can read the admins table (for checking admin status)
-- NOTE: Do NOT use "exists (select 1 from admins ...)" here — it queries the same
-- table inside its own policy, causing infinite recursion.
create policy "Authenticated read admins"
  on admins for select
  using (auth.role() = 'authenticated');

-- 2. Profiles (role-based access for app use)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users insert own profile"
  on profiles for insert with check (auth.uid() = id and role = 'user');

-- Admins can read/update all profiles (using admins table, not profiles)
create policy "Admins read all profiles"
  on profiles for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admins update all profiles"
  on profiles for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- 3. Emergency phones (data-driven)
create table if not exists emergency_phones (
  id uuid default gen_random_uuid() primary key,
  city text not null,
  name text not null,
  name_my text,
  phone text not null,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

alter table emergency_phones enable row level security;

create policy "Public read emergency phones"
  on emergency_phones for select using (true);

create policy "Admin insert emergency phones"
  on emergency_phones for insert with check (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin update emergency phones"
  on emergency_phones for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin delete emergency phones"
  on emergency_phones for delete using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- 4. Quiz questions (bilingual)
create table if not exists quiz_questions (
  id uuid default gen_random_uuid() primary key,
  question_en text not null,
  question_my text,
  options_en jsonb not null,
  options_my jsonb,
  answer int not null,
  category text not null,
  enabled boolean default true,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

alter table quiz_questions enable row level security;

create policy "Public read enabled quiz questions"
  on quiz_questions for select using (enabled = true);

create policy "Admin read all quiz questions"
  on quiz_questions for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin insert quiz questions"
  on quiz_questions for insert with check (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin update quiz questions"
  on quiz_questions for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin delete quiz questions"
  on quiz_questions for delete using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- 5. Announcements (broadcast banners)
create table if not exists announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  title_my text,
  body text not null,
  body_my text,
  severity text default 'info' check (severity in ('info','warning','danger')),
  active boolean default true,
  expires_at timestamp with time zone,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

alter table announcements enable row level security;

create policy "Public read active announcements"
  on announcements for select using (
    active = true and (expires_at is null or expires_at > now())
  );

create policy "Admin read all announcements"
  on announcements for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin insert announcements"
  on announcements for insert with check (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin update announcements"
  on announcements for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admin delete announcements"
  on announcements for delete using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- 6. Admin RLS on feedback (read all, not just own)
create policy "Admins read all feedback"
  on feedback for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admins delete feedback"
  on feedback for delete using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- 7. Admin RLS on locations (read all)
create policy "Admins read all locations"
  on locations for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- To promote yourself to admin, run BOTH:
-- 1. Add to admins table (for RLS)
insert into admins (user_id)
select id from auth.users where email = 'admin@gmail.com'
on conflict (user_id) do nothing;

-- 2. Update profiles table (for app display)
insert into profiles (id, role)
select id, 'admin' from auth.users where email = 'admin@gmail.com'
on conflict (id) do update set role = 'admin';