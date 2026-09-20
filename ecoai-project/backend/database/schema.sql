-- ============================================================
-- EcoAI Schema
-- ============================================================

-- Enable UUIDs
create extension if not exists "uuid-ossp";

-- ---------- users (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  bio text,
  streak_count int not null default 0,
  longest_streak int not null default 0,
  verified_tree_count int not null default 0,
  is_verified boolean not null default false,
  last_checkin timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- zones (satellite-identified planting zones) ----------
create type zone_status as enum ('available','adopted','verified','flagged');

create table if not exists public.zones (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  region text,
  country text,
  center_lat double precision not null,
  center_lng double precision not null,
  radius_meters int not null default 500,
  ndvi_baseline double precision,
  ndvi_current double precision,
  confidence_score int not null default 0, -- 0..8
  land_use text,
  rainfall text,
  radar_confirm boolean default false,
  wildfire_detected boolean default false,
  status zone_status not null default 'available',
  adopted_by uuid references public.profiles(id) on delete set null,
  adopted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_zones_status on public.zones(status);
create index if not exists idx_zones_center on public.zones(center_lat, center_lng);

-- ---------- posts (verified plantings, hash-chained) ----------
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  zone_id uuid references public.zones(id) on delete set null,
  image_url text not null,
  caption text,
  latitude double precision not null,
  longitude double precision not null,
  captured_at timestamptz not null,
  species text,
  tree_count int not null default 1,
  prev_hash text,
  current_hash text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_user on public.posts(user_id, created_at desc);
create index if not exists idx_posts_zone on public.posts(zone_id);
create index if not exists idx_posts_geo on public.posts(latitude, longitude);

-- ---------- streak events ----------
create table if not exists public.checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  checked_in_at timestamptz not null default now()
);

create index if not exists idx_checkins_user on public.checkins(user_id, checked_in_at desc);

-- ---------- audit log for chain integrity ----------
create table if not exists public.chain_audit (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  event text not null,
  prev_hash text,
  new_hash text,
  created_at timestamptz not null default now()
);

-- ---------- helper: compute next hash input (called from app) ----------
create or replace function public.next_chain_hash_input(
  p_user_id uuid,
  p_latitude double precision,
  p_longitude double precision,
  p_timestamp timestamptz,
  p_image_url text
) returns text language sql immutable as $$
  select coalesce(
    (select current_hash from public.posts
     where user_id = p_user_id
     order by created_at desc limit 1),
    'GENESIS'
  ) || '|' || p_user_id::text || '|' ||
  p_latitude::text || ',' || p_longitude::text || '|' ||
  p_timestamp::text || '|' || p_image_url;
$$;
