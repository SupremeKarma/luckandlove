-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for the 'products' table to ensure a clean slate.
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
DROP POLICY IF EXISTS "Users can insert new products." ON public.products;
DROP POLICY IF EXISTS "Users can update products." ON public.products;
DROP POLICY IF EXISTS "Users can delete products." ON public.products;


-- RLS Policies for products (public read, authenticated write)
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');


-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
  
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);
