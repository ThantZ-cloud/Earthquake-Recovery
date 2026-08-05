-- Cleanup + recreate admin schema (run in Supabase SQL Editor)
-- This drops existing policies first to avoid "already exists" errors

-- 1. Drop existing admin-related policies on profiles
drop policy if exists "Users read own profile" on profiles;
drop policy if exists "Users insert own profile" on profiles;
drop policy if exists "Admins read all profiles" on profiles;
drop policy if exists "Admins update all profiles" on profiles;

-- Drop policies on other tables
drop policy if exists "Public read emergency phones" on emergency_phones;
drop policy if exists "Admin insert emergency phones" on emergency_phones;
drop policy if exists "Admin update emergency phones" on emergency_phones;
drop policy if exists "Admin delete emergency phones" on emergency_phones;

drop policy if exists "Public read enabled quiz questions" on quiz_questions;
drop policy if exists "Admin read all quiz questions" on quiz_questions;
drop policy if exists "Admin insert quiz questions" on quiz_questions;
drop policy if exists "Admin update quiz questions" on quiz_questions;
drop policy if exists "Admin delete quiz questions" on quiz_questions;

drop policy if exists "Public read active announcements" on announcements;
drop policy if exists "Admin read all announcements" on announcements;
drop policy if exists "Admin insert announcements" on announcements;
drop policy if exists "Admin update announcements" on announcements;
drop policy if exists "Admin delete announcements" on announcements;

drop policy if exists "Admins read all feedback" on feedback;
drop policy if exists "Admins delete feedback" on feedback;

drop policy if exists "Admins read all locations" on locations;

drop policy if exists "Authenticated read admins" on admins;

-- 2. Recreate with fixed RLS (using separate admins table)
-- Admins table for RLS checks
create table if not exists admins (
  user_id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default now()
);

alter table admins enable row level security;

create policy "Authenticated read admins"
  on admins for select
  using (auth.role() = 'authenticated');

-- Profiles policies
create policy "Users read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users insert own profile"
  on profiles for insert with check (auth.uid() = id and role = 'user');

create policy "Admins read all profiles"
  on profiles for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admins update all profiles"
  on profiles for update using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- Emergency phones
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

-- Quiz questions
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

-- Announcements
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

-- Feedback
create policy "Admins read all feedback"
  on feedback for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

create policy "Admins delete feedback"
  on feedback for delete using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- Locations
create policy "Admins read all locations"
  on locations for select using (
    exists (select 1 from admins where user_id = auth.uid())
  );

-- 3. Promote yourself (run after the above)
-- Replace 'your@email.com' with your actual email
-- insert into admins (user_id)
-- select id from auth.users where email = 'your@email.com'
-- on conflict (user_id) do nothing;
-- 
-- insert into profiles (id, role)
-- select id, 'admin' from auth.users where email = 'your@email.com'
-- on conflict (id) do update set role = 'admin';