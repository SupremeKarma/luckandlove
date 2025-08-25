-- Create products table
CREATE TABLE public.products (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    category text,
    image_url text,
    stock integer DEFAULT 0,
    rating numeric
);

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text UNIQUE,
    full_name text,
    avatar_url text,
    website text,
    addresses jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove all previous policies on products table to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
DROP POLICY IF EXISTS "Users can insert new products." ON public.products;
DROP POLICY IF EXISTS "Users can update products." ON public.products;
DROP POLICY IF EXISTS "Users can delete products." ON public.products;

-- RLS Policy for products
CREATE POLICY "Allow read access to all users" ON public.products
  FOR SELECT
  USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- Insert demo data for products
INSERT INTO public.products (id, name, description, price, category, image_url, stock, rating) VALUES
('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'https://placehold.co/600x400.png', 15, 4.5),
('prod-2', 'Wireless Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'https://placehold.co/600x400.png', 8, 4.7),
('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'https://placehold.co/600x400.png', 5, 4.8),
('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'https://placehold.co/600x400.png', 20, 4.6),
('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'https://placehold.co/600x400.png', 12, 4.9),
('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'https://placehold.co/600x400.png', 50, 4.3),
('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'https://placehold.co/600x400.png', 30, 4.7),
('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'https://placehold.co/600x400.png', 25, 4.4),
('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'https://placehold.co/600x400.png', 40, 4.8),
('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'https://placehold.co/600x400.png', 100, 4.9),
('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'Furniture', 'https://placehold.co/600x400.png', 10, 4.6),
('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'https://placehold.co/600x400.png', 0, 4.8),
('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 50, 4.7),
('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 40, 4.5),
('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'https://placehold.co/600x400.png', 80, 4.9),
('prod-16', 'Eco-Friendly Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'https://placehold.co/600x400.png', 100, 4.6),
('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'https://placehold.co/600x400.png', 70, 4.8),
('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'https://placehold.co/600x400.png', 25, 4.7),
('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'https://placehold.co/600x400.png', 30, 4.9),
('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'https://placehold.co/600x400.png', 35, 4.6);
