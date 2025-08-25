-- Create products table for the e-commerce catalog
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  stock INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table for purchase tracking
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create carts table for persistent shopping carts
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rentals table for the rentals finder
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT,
  type TEXT,
  amenities JSONB,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tournaments table for gaming tournaments
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  game TEXT,
  prize NUMERIC,
  start_date TIMESTAMP WITH TIME ZONE,
  participants JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'upcoming',
  max_participants INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_messages table for global chat
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  channel TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rides table for ride-sharing
CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT DEFAULT 'requested',
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE,
    full_name text,
    avatar_url text,
    website text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    addresses jsonb
);

-- Enable Row Level Security on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, authenticated write)
CREATE POLICY "Products are viewable by everyone." ON public.products
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products." ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products." ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products." ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');


-- RLS Policies for orders (users can only see their own)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for carts (users can only access their own)
CREATE POLICY "Users can view their own cart" ON public.carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart" ON public.carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON public.carts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for rentals (public read)
CREATE POLICY "Anyone can view rentals" ON public.rentals
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert rentals" ON public.rentals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for tournaments (public read, authenticated join)
CREATE POLICY "Anyone can view tournaments" ON public.tournaments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tournaments" ON public.tournaments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for chat messages (authenticated users can read and create)
CREATE POLICY "Authenticated users can view chat messages" ON public.chat_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can send chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for rides (users can manage their own rides)
CREATE POLICY "Users can view their own rides" ON public.rides
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rides" ON public.rides
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for profiles (users can manage their own profile)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);


-- Insert demo products
INSERT INTO public.products (name, price, description, image_url, category, subcategory, stock, rating, in_stock) VALUES
('Quantum Smartphone X1', 999.99, 'Next-gen smartphone with quantum computing capabilities', 'https://placehold.co/600x400.png', 'Electronics', 'Smartphones', 50, 4.8, true),
('Neural Gaming Laptop', 2499.99, 'High-performance laptop with AI acceleration', 'https://placehold.co/600x400.png', 'Electronics', 'Laptops', 25, 4.9, true),
('Cyber Pizza Deluxe', 24.99, 'Futuristic pizza with lab-grown ingredients', 'https://placehold.co/600x400.png', 'Food', 'Pizza', 100, 4.5, true),
('Holographic Apartment', 2500.00, 'Luxury apartment with holographic displays', 'https://placehold.co/600x400.png', 'Rentals', 'Apartment', 5, 4.7, true),
('Sports Car Rental', 299.99, 'High-performance electric sports car', 'https://placehold.co/600x400.png', 'Rentals', 'Vehicles', 10, 4.8, true);

-- Insert demo tournaments
INSERT INTO public.tournaments (name, game, prize, start_date, status, max_participants) VALUES
('Cyber Championship 2024', 'Free Fire', 10000, now() + interval '7 days', 'upcoming', 100),
('Neural League Finals', 'PUBG Mobile', 25000, now() + interval '14 days', 'upcoming', 64),
('Quantum Battle Royale', 'Call of Duty Mobile', 15000, now() + interval '21 days', 'upcoming', 128);

-- Insert demo rentals
INSERT INTO public.rentals (name, price, location, type, amenities, image_url, available, rating) VALUES
('Cyber Apartment Downtown', 2500, 'Neo Tokyo District', 'apartment', '["wifi", "pet_friendly", "parking"]', 'https://placehold.co/600x400.png', true, 4.8),
('Luxury Penthouse', 5000, 'Sky Tower', 'penthouse', '["pool", "gym", "concierge"]', 'https://placehold.co/600x400.png', true, 4.9),
('Tesla Model S', 150, 'City Center', 'car', '["autopilot", "premium_sound"]', 'https://placehold.co/600x400.png', true, 4.7);

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.carts;
