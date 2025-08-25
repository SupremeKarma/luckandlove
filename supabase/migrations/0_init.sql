-- Create the products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  subcategory TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  rating NUMERIC(2, 1)
);

-- Create the profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  addresses JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a test table for emulator verification
CREATE TABLE test (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  random FLOAT
);

-- SEED DATA for products
INSERT INTO products (id, name, description, price, category, subcategory, image_url, stock, rating) VALUES
('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'Smart Home', 'https://placehold.co/600x400.png', 15, 4.5),
('prod-2', 'Wireless Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'Audio', 'https://placehold.co/600x400.png', 8, 4.8),
('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'Computers', 'https://placehold.co/600x400.png', 5, 4.7),
('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'Keyboards & Mice', 'https://placehold.co/600x400.png', 20, 4.6),
('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 12, 4.9),
('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 50, 4.3),
('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'Footwear', 'https://placehold.co/600x400.png', 30, 4.7),
('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 25, 4.4),
('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'Non-Fiction', 'https://placehold.co/600x400.png', 40, 4.8),
('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'Science Fiction', 'https://placehold.co/600x400.png', 100, 4.9),
('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'Furniture', 'Living Room', 'https://placehold.co/600x400.png', 10, 4.6),
('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'Office Furniture', 'https://placehold.co/600x400.png', 0, 4.7),
('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'Skincare', 'https://placehold.co/600x400.png', 50, 4.5),
('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'Fitness Equipment', 'https://placehold.co/600x400.png', 40, 4.6),
('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'Action Figures', 'https://placehold.co/600x400.png', 80, 4.8),
('prod-16', 'Eco-Friendly Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'Reusable Products', 'https://placehold.co/600x400.png', 100, 4.7),
('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'Beverages', 'https://placehold.co/600x400.png', 70, 4.9),
('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'Tech Gadgets', 'https://placehold.co/600x400.png', 25, 4.6),
('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'Dog Supplies', 'https://placehold.co/600x400.png', 30, 4.8),
('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'Baby Gear', 'https://placehold.co/600x400.png', 35, 4.7);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on the products table to ensure a clean slate
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.products;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
-- ... and any other potential policies that might have been created

-- Create a single, correct policy for public read access on products
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT
  USING (true);

-- Policies for profiles table
CREATE POLICY "Allow individual read access" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Allow individual update access" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Policies for test table
ALTER TABLE test ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON public.test
  FOR ALL
  USING (true);
