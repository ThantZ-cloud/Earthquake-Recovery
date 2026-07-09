-- Feedback table for star ratings + comments
create table feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text default '',
  created_at timestamp with time zone default now(),
  unique(user_id)
);

alter table feedback enable row level security;

-- Anyone can insert (logged in or anonymous)
create policy "Anyone can insert feedback"
  on feedback for insert
  with check (true);

-- Users read own feedback
create policy "Users read own feedback"
  on feedback for select
  using (auth.uid() = user_id);
