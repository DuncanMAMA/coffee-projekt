-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables
create table public.roasters (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.origins (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.regions (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.processes (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.varietals (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.coffees (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  roaster_id uuid references public.roasters(id),
  origin_id uuid references public.origins(id),
  region_id uuid references public.regions(id),
  process_id uuid references public.processes(id),
  varietal_id uuid references public.varietals(id),
  rating numeric(3, 1),
  brew_methods text[],
  tasting_notes text[],
  location text,
  gradient text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.roasters enable row level security;
alter table public.origins enable row level security;
alter table public.regions enable row level security;
alter table public.processes enable row level security;
alter table public.varietals enable row level security;
alter table public.coffees enable row level security;

-- Policies for reference tables (shared across all users for autocomplete)
create policy "Allow authenticated read access to roasters" on public.roasters for select using (auth.role() = 'authenticated');
create policy "Allow authenticated insert to roasters" on public.roasters for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated read access to origins" on public.origins for select using (auth.role() = 'authenticated');
create policy "Allow authenticated insert to origins" on public.origins for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated read access to regions" on public.regions for select using (auth.role() = 'authenticated');
create policy "Allow authenticated insert to regions" on public.regions for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated read access to processes" on public.processes for select using (auth.role() = 'authenticated');
create policy "Allow authenticated insert to processes" on public.processes for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated read access to varietals" on public.varietals for select using (auth.role() = 'authenticated');
create policy "Allow authenticated insert to varietals" on public.varietals for insert with check (auth.role() = 'authenticated');

-- Policies for coffees table (user-specific data)
create policy "Users can view own coffees" on public.coffees 
  for select using (auth.uid() = user_id);

create policy "Users can insert own coffees" on public.coffees 
  for insert with check (auth.uid() = user_id);

create policy "Users can update own coffees" on public.coffees 
  for update using (auth.uid() = user_id);

create policy "Users can delete own coffees" on public.coffees 
  for delete using (auth.uid() = user_id);

-- Migration: Add user_id to existing coffees table if it doesn't exist
-- Run this separately if you already have data:
-- ALTER TABLE public.coffees ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

