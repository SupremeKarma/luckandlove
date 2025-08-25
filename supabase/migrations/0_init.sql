-- Create the products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT,
  subcategory TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL,
  rating REAL
);

-- Create the profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  addresses JSONB,
  email TEXT
);

-- RLS (Row Level Security) POLICIES

-- PRODUCTS
-- 1. Enable RLS for the products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies on the products table to ensure a clean slate.
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all access to products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;

-- 3. Create a single, simple policy to allow public read access (SELECT) to everyone.
CREATE POLICY "Allow public read access to products"
ON public.products
FOR SELECT
USING (true);


-- PROFILES
-- 1. Enable RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies on the profiles table.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;


-- 3. Create policies for the profiles table.
CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);
