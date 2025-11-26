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

-- Create policies (Allow public read/write for this personal app)
-- Note: For a multi-user app, you would restrict this to authenticated users.
create policy "Allow public access to roasters" on public.roasters for all using (true) with check (true);
create policy "Allow public access to origins" on public.origins for all using (true) with check (true);
create policy "Allow public access to regions" on public.regions for all using (true) with check (true);
create policy "Allow public access to processes" on public.processes for all using (true) with check (true);
create policy "Allow public access to varietals" on public.varietals for all using (true) with check (true);
create policy "Allow public access to coffees" on public.coffees for all using (true) with check (true);
