create table locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  latitude double precision not null,
  longitude double precision not null,
  label text,
  created_at timestamp with time zone default now()
);

-- One location per user
alter table locations add constraint unique_user_location unique (user_id);

-- Enable row-level security
alter table locations enable row level security;

-- Users can only read their own location
create policy "Users read own location"
  on locations for select
  using (auth.uid() = user_id);

-- Users can insert their own location
create policy "Users insert own location"
  on locations for insert
  with check (auth.uid() = user_id);

-- Users can update their own location
create policy "Users update own location"
  on locations for update
  using (auth.uid() = user_id);
