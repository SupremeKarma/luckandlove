-- Create products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  subcategory TEXT,
  image_url TEXT,
  stock INTEGER NOT NULL,
  rating NUMERIC(2, 1)
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  addresses JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

--
-- RLS for products table
--

-- 1. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies for the products table to ensure a clean slate
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON products;
DROP POLICY IF EXISTS "Allow read access to everyone" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;

-- 3. Create a single, correct policy to allow public read access
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
USING (true);

--
-- RLS for profiles table
--

-- 1. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow individual access to own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;

-- 3. Create policies for profiles
CREATE POLICY "Allow individual access to own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed the products table
INSERT INTO products (id, name, description, price, category, subcategory, image_url, stock, rating) VALUES
('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'Smart Home', 'https://placehold.co/600x400.png', 15, 4.5),
('prod-2', 'Wireless Noise-Cancelling Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'Audio', 'https://placehold.co/600x400.png', 8, 4.8),
('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'Computers', 'https://placehold.co/600x400.png', 5, 4.7),
('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'Keyboards & Mice', 'https://placehold.co/600x400.png', 20, 4.6),
('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 12, 4.9),
('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'Women''s Apparel', 'https://placehold.co/600x400.png', 50, 4.4),
('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'Footwear', 'https://placehold.co/600x400.png', 30, 4.7),
('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'Men''s Apparel', 'https://placehold.co/600x400.png', 25, 4.5),
('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'Non-Fiction', 'https://placehold.co/600x400.png', 40, 4.8),
('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'Science Fiction', 'https://placehold.co/600x400.png', 100, 4.9),
('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'Furniture', 'Living Room', 'https://placehold.co/600x400.png', 10, 4.6),
('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'Office Furniture', 'https://placehold.co/600x400.png', 0, 4.7),
('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'Skincare', 'https://placehold.co/600x400.png', 50, 4.8),
('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'Fitness Equipment', 'https://placehold.co/600x400.png', 40, 4.5),
('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'Action Figures', 'https://placehold.co/600x400.png', 80, 4.9),
('prod-16', 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'Reusable Products', 'https://placehold.co/600x400.png', 100, 4.7),
('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'Beverages', 'https://placehold.co/600x400.png', 70, 4.8),
('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'Tech Gadgets', 'https://placehold.co/600x400.png', 25, 4.6),
('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'Dog Supplies', 'https://placehold.co/600x400.png', 30, 4.9),
('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'Baby Gear', 'https://placehold.co/600x400.png', 35, 4.7),
('prod-21', 'Gardening Tool Set', 'Essential tools for every gardener, including trowel, cultivator, and pruner.', 55.00, 'Home & Garden', 'Gardening Tools', 'https://placehold.co/600x400.png', 20, 4.6),
('prod-22', 'Latest Smartphone Model', 'The newest smartphone with advanced camera features and long-lasting battery.', 899.00, 'Mobile Phones & Accessories', 'Smartphones', 'https://placehold.co/600x400.png', 15, 4.9),
('prod-23', 'Car Phone Mount', 'Universal car phone mount with strong grip and adjustable viewing angles.', 20.00, 'Automobiles & Motorcycles', 'Car Accessories', 'https://placehold.co/600x400.png', 60, 4.4),
('prod-24', 'Gaming Console', 'Next-gen gaming console for immersive gaming experiences.', 499.99, 'Sports & Entertainment', 'Video Games', 'https://placehold.co/600x400.png', 10, 4.9),
('prod-25', 'Smart Watch X1', 'Stay connected and track your fitness with the new Smart Watch X1.', 120.00, 'Electronics', 'Wearable Tech', 'https://placehold.co/600x400.png', 30, 4.5),
('prod-26', 'Amethyst Serving Tray', 'Elegant serving tray with genuine amethyst inlay, perfect for entertaining.', 75.00, 'Home & Garden', 'Kitchen & Dining', 'https://placehold.co/600x400.png', 10, 4.8),
('prod-27', 'Outdoor Hiking Backpack', 'Durable and spacious backpack for all your outdoor adventures.', 85.00, 'Sports & Entertainment', 'Outdoor Recreation', 'https://placehold.co/600x400.png', 25, 4.7),
('prod-28', 'Fitness Tracker F2', 'Monitor your heart rate, steps, and sleep with this advanced fitness tracker.', 55.00, 'Health & Beauty', 'Health Supplements', 'https://placehold.co/600x400.png', 40, 4.6),
('prod-29', 'Cute Eye Mask', 'Soft and comfortable eye mask with a fun design for a good night''s sleep.', 12.00, 'Health & Beauty', 'Personal Care', 'https://placehold.co/600x400.png', 60, 4.9),
('prod-30', 'Multi-tier Storage Shelf', 'Versatile plastic shelving unit for organizing any room in your home.', 40.00, 'Home & Garden', 'Furniture', 'https://placehold.co/600x400.png', 15, 4.3),
('prod-31', 'Glitter Wall Clock', 'Sparkling wall clock that adds a touch of glamour to your decor.', 30.00, 'Home & Garden', 'Home Decor', 'https://placehold.co/600x400.png', 20, 4.5),
('prod-32', 'Adjustable Walking Cane', 'Lightweight and adjustable walking cane for support and stability.', 35.00, 'Health & Beauty', 'Personal Care', 'https://placehold.co/600x400.png', 18, 4.7),
('prod-33', 'Home Fitness Stepper', 'Compact stepper machine for a full body workout at home.', 150.00, 'Sports & Entertainment', 'Fitness Equipment', 'https://placehold.co/600x400.png', 10, 4.4),
('prod-34', 'Silicone Funnel', 'Flexible silicone funnel for easy pouring and transfer of liquids.', 8.00, 'Home & Garden', 'Kitchen & Dining', 'https://placehold.co/600x400.png', 100, 4.8),
('prod-35', 'Turquoise Gemstone Decor', 'Decorative gemstone pieces for a natural and calming home ambiance.', 65.00, 'Home & Garden', 'Home Decor', 'https://placehold.co/600x400.png', 12, 4.9),
('prod-36', 'Insulated Cooler Bag', 'Large capacity cooler bag to keep your food and drinks cool on the go.', 45.00, 'Food & Drink', 'Snacks', 'https://placehold.co/600x400.png', 30, 4.6),
('prod-37', 'Hanging Closet Organizer', 'Space-saving closet organizer with multiple compartments for clothes and accessories.', 25.00, 'Home & Garden', 'Furniture', 'https://placehold.co/600x400.png', 50, 4.5),
('prod-38', 'Resistance Band Set', 'Versatile set of resistance bands for strength training and physical therapy.', 20.00, 'Sports & Entertainment', 'Fitness Equipment', 'https://placehold.co/600x400.png', 70, 4.7),
('prod-39', 'Premium Smartwatch V2', 'Next-gen smartwatch with advanced health monitoring and connectivity features.', 250.00, 'Electronics', 'Wearable Tech', 'https://placehold.co/600x400.png', 20, 4.8),
('prod-40', 'Travel Garment Bag', 'Foldable garment bag to keep your suits and dresses wrinkle-free while traveling.', 50.00, 'Fashion', 'Accessories', 'https://placehold.co/600x400.png', 22, 4.6),
('prod-41', 'Crystal Coaster Set', 'Elegant crystal coasters that protect your surfaces with a touch of luxury.', 30.00, 'Home & Garden', 'Kitchen & Dining', 'https://placehold.co/600x400.png', 45, 4.9),
('prod-42', 'Agate Bookends', 'Natural agate bookends, a unique and stylish way to organize your books.', 55.00, 'Home & Garden', 'Home Decor', 'https://placehold.co/600x400.png', 15, 4.8),
('prod-43', 'Colorful Floral Pillow', 'Vibrant throw pillow with a beautiful floral design to brighten any room.', 28.00, 'Home & Garden', 'Home Decor', 'https://placehold.co/600x400.png', 35, 4.7),
('prod-44', 'Smart Body Scale', 'Advanced smart scale that tracks weight, body fat, muscle mass, and more.', 70.00, 'Health & Beauty', 'Health Supplements', 'https://placehold.co/600x400.png', 28, 4.6),
('prod-45', 'Universal Remote Control', 'Simplify your entertainment system with this easy-to-use universal remote.', 22.00, 'Electronics', 'Video', 'https://placehold.co/600x400.png', 60, 4.4),
('prod-46', 'Pink Agate Serving Platter', 'Stunning pink agate serving platter, perfect for appetizers and desserts.', 85.00, 'Home & Garden', 'Kitchen & Dining', 'https://placehold.co/600x400.png', 8, 4.9),
('prod-47', 'Modern Wall Clock White', 'Chic and minimalist wall clock in white, ideal for contemporary spaces.', 40.00, 'Home & Garden', 'Home Decor', 'https://placehold.co/600x400.png', 17, 4.5),
('prod-48', 'Action Camera Mount', 'Secure mount for action cameras, great for capturing adventures.', 15.00, 'Electronics', 'Cameras', 'https://placehold.co/600x400.png', 90, 4.7),
('prod-49', 'Marble Serving Board', 'Elegant marble serving board, ideal for cheese, charcuterie, and more.', 60.00, 'Home & Garden', 'Kitchen & Dining', 'https://placehold.co/600x400.png', 14, 4.8),
('prod-50', 'Children''s Doll', 'A cute and cuddly doll for children, perfect for playtime.', 25.00, 'Toys & Hobbies', 'Action Figures', 'https://placehold.co/600x400.png', 50, 4.9);
