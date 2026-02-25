-- Kibble Phase 1 Schema
-- Mobile-first food lookup + guidance with moderation scaffolding.
-- Run in Supabase SQL editor on a fresh project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles (linked to Supabase Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = user_id
      and p.is_admin = true
  );
$$;

-- Pets (owned by authenticated users)
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  species text not null check (species in ('cat', 'dog')),
  breed text not null default '',
  weight_kg numeric(6,2) not null,
  age_years numeric(4,1) not null,
  activity_level text not null default 'moderate' check (activity_level in ('low', 'moderate', 'high')),
  is_neutered boolean not null default true,
  life_stage text not null default 'adult' check (life_stage in ('puppy', 'kitten', 'adult', 'senior')),
  goal text not null default 'maintain' check (goal in ('lose', 'maintain', 'gain')),
  target_weight_kg numeric(6,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_pets_updated_at
before update on public.pets
for each row execute function public.set_updated_at();

-- Canonical food catalog
create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  barcode text unique,
  brand text not null,
  product_name text not null,
  food_type text not null check (food_type in ('dry', 'wet', 'raw', 'treat')),
  species text not null default 'both' check (species in ('cat', 'dog', 'both')),
  calories_per_serving numeric(8,2) not null,
  serving_size_g numeric(8,2) not null,
  serving_unit text not null default 'g',
  protein_pct numeric(6,2) not null default 0,
  fat_pct numeric(6,2) not null default 0,
  fiber_pct numeric(6,2) not null default 0,
  moisture_pct numeric(6,2) not null default 0,
  kcal_per_kg numeric(8,2),
  kcal_per_cup numeric(8,2),
  kcal_per_can numeric(8,2),
  can_size_g numeric(8,2),
  package_size_g numeric(8,2),
  aafco_statement text,
  source text not null default 'admin' check (source in ('seed', 'community', 'admin', 'external')),
  moderation_status text not null default 'approved' check (moderation_status in ('pending', 'approved', 'rejected')),
  is_verified boolean not null default false,
  is_active boolean not null default true,
  submitted_by uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_foods_updated_at
before update on public.foods
for each row execute function public.set_updated_at();

create index if not exists idx_foods_barcode on public.foods(barcode);
create index if not exists idx_foods_brand_product on public.foods(brand, product_name);
create index if not exists idx_foods_status_active on public.foods(moderation_status, is_active);

-- User-submitted foods awaiting moderation
create table if not exists public.food_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  barcode text,
  brand text not null,
  product_name text not null,
  food_type text not null check (food_type in ('dry', 'wet', 'raw', 'treat')),
  species text not null default 'both' check (species in ('cat', 'dog', 'both')),
  calories_per_serving numeric(8,2),
  serving_size_g numeric(8,2),
  serving_unit text,
  protein_pct numeric(6,2),
  fat_pct numeric(6,2),
  fiber_pct numeric(6,2),
  moisture_pct numeric(6,2),
  notes text,
  label_photo_url text,
  nutrition_photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  linked_food_id uuid references public.foods(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_food_submissions_updated_at
before update on public.food_submissions
for each row execute function public.set_updated_at();

create index if not exists idx_food_submissions_status on public.food_submissions(status);
create index if not exists idx_food_submissions_submitter on public.food_submissions(submitted_by);

-- Feeding log
create table if not exists public.feeding_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  food_id uuid not null references public.foods(id) on delete restrict,
  servings numeric(6,2) not null default 1,
  calories numeric(8,2) not null,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_feeding_log_owner_date on public.feeding_log(owner_id, logged_at desc);
create index if not exists idx_feeding_log_pet_date on public.feeding_log(pet_id, logged_at desc);

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.foods enable row level security;
alter table public.food_submissions enable row level security;
alter table public.feeding_log enable row level security;

-- Profiles
create policy if not exists profiles_select_own
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists profiles_update_own
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()))
with check (id = auth.uid() or public.is_admin(auth.uid()));

-- Pets
create policy if not exists pets_owner_all
on public.pets for all
to authenticated
using (owner_id = auth.uid() or public.is_admin(auth.uid()))
with check (owner_id = auth.uid() or public.is_admin(auth.uid()));

-- Foods: users can read approved active foods; admins can manage catalog
create policy if not exists foods_read_approved_active
on public.foods for select
to authenticated
using (
  (moderation_status = 'approved' and is_active = true)
  or public.is_admin(auth.uid())
);

create policy if not exists foods_admin_write
on public.foods for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Food submissions: submitter sees own; admins see all and can review
create policy if not exists food_submissions_insert_own
on public.food_submissions for insert
to authenticated
with check (submitted_by = auth.uid());

create policy if not exists food_submissions_select_own_or_admin
on public.food_submissions for select
to authenticated
using (submitted_by = auth.uid() or public.is_admin(auth.uid()));

create policy if not exists food_submissions_update_admin
on public.food_submissions for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Feeding logs
create policy if not exists feeding_log_owner_all
on public.feeding_log for all
to authenticated
using (owner_id = auth.uid() or public.is_admin(auth.uid()))
with check (owner_id = auth.uid() or public.is_admin(auth.uid()));
