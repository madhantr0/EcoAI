-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.zones    enable row level security;
alter table public.posts    enable row level security;
alter table public.checkins enable row level security;
alter table public.chain_audit enable row level security;

-- profiles: anyone can read, only owner can update
create policy "profiles_read_all" on public.profiles
  for select using (true);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

-- zones: read all, write only via service role (backend)
create policy "zones_read_all" on public.zones
  for select using (true);

-- posts: read all, insert own, update own only before verification window
create policy "posts_read_all" on public.posts
  for select using (true);

create policy "posts_insert_own" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "posts_update_own_recent" on public.posts
  for update using (
    auth.uid() = user_id
    and created_at > now() - interval '5 minutes'
  );

-- checkins: own only
create policy "checkins_read_own" on public.checkins
  for select using (auth.uid() = user_id);

create policy "checkins_insert_own" on public.checkins
  for insert with check (auth.uid() = user_id);

-- audit: read-only for owner
create policy "audit_read_own" on public.chain_audit
  for select using (auth.uid() = user_id);
