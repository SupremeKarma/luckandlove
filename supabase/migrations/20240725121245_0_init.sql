
-- Enable Row Level Security
alter table "products" enable row level security;
alter table "profiles" enable row level security;

-- Drop all existing policies on the 'products' table to ensure a clean slate.
drop policy if exists "Allow public read access to products" on "products";
drop policy if exists "Allow all access to products" on "products";
drop policy if exists "Enable read access for all users" on "products";
-- Add any other old policy names here if they exist to make sure they are gone.
-- ...

-- Create a new, single, correct policy to allow public read access.
create policy "Allow public read access to products"
on "products"
for select
to anauthenticated, authenticated
using (true);

-- Policies for 'profiles' table
drop policy if exists "Allow individual access to own profile" on "profiles";
create policy "Allow individual access to own profile"
on "profiles"
for select
using (auth.uid() = id);

drop policy if exists "Allow individual update for own profile" on "profiles";
create policy "Allow individual update for own profile"
on "profiles"
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Allow individual insert for own profile" on "profiles";
create policy "Allow individual insert for own profile"
on "profiles"
for insert
with check (auth.uid() = id);

-- This starter migration is meant to be a launching point for your database.
-- You can add your own tables, policies, and functions here.
--
-- For more information, see the Supabase documentation:
-- https://supabase.com/docs/guides/auth/row-level-security
