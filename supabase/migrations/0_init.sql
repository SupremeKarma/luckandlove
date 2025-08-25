
-- Enable Row Level Security
alter table "products" enable row level security;

-- Drop all existing policies on the products table to ensure a clean slate.
-- This is to remove any faulty or conflicting policies that might be causing the error.
DROP POLICY IF EXISTS "Allow public read-only access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.products;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to everyone" ON public.products;
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;

-- Create a new, simple policy to allow public read access to all products.
-- This is the standard and secure way to make a product catalog visible to all visitors.
create policy "Allow public read-only access to products"
on public.products
for select
to authenticated, anon
using (true);
