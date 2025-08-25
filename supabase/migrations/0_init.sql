-- Create products table
CREATE TABLE public.products (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    category text,
    image_url text,
    stock integer NOT NULL DEFAULT 0,
    rating numeric,
    subcategory text
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, authenticated write)
CREATE POLICY "Products are viewable by everyone." ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Users can insert new products." ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update products." ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete products." ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Seed products table with sample data
INSERT INTO public.products (id, name, description, price, category, image_url, stock, rating, subcategory) VALUES
  ('prod-1', 'Smart Home Hub', 'Control all your smart devices from one central hub. Supports voice commands and automation.', 99.99, 'Electronics', 'https://placehold.co/600x400.png', 15, 4.5, 'Smart Home'),
  ('prod-2', 'Wireless Noise-Cancelling Headphones', 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones.', 199.99, 'Electronics', 'https://placehold.co/600x400.png', 8, 4.8, 'Audio'),
  ('prod-3', '4K Ultra HD Monitor', 'A 27-inch 4K monitor with stunning clarity and color accuracy, perfect for professionals.', 449.50, 'Electronics', 'https://placehold.co/600x400.png', 5, 4.7, 'Computers'),
  ('prod-4', 'Mechanical Keyboard', 'A durable and responsive mechanical keyboard for the ultimate typing experience.', 120.00, 'Computer & Office', 'https://placehold.co/600x400.png', 20, 4.6, 'Keyboards & Mice'),
  ('prod-5', 'Classic Leather Jacket', 'A timeless leather jacket made from 100% genuine leather. Stylish and durable.', 249.99, 'Fashion', 'https://placehold.co/600x400.png', 12, 4.9, 'Men''s Apparel'),
  ('prod-6', 'Modern Fit T-Shirt', 'A comfortable and stylish t-shirt made from premium cotton.', 29.99, 'Fashion', 'https://placehold.co/600x400.png', 50, 4.4, 'Men''s Apparel'),
  ('prod-7', 'Performance Running Shoes', 'Lightweight and breathable running shoes designed for maximum comfort and speed.', 130.00, 'Fashion', 'https://placehold.co/600x400.png', 30, 4.7, 'Footwear'),
  ('prod-8', 'Slim-Fit Chinos', 'Versatile slim-fit chinos perfect for both casual and formal occasions.', 75.00, 'Fashion', 'https://placehold.co/600x400.png', 25, 4.5, 'Men''s Apparel'),
  ('prod-9', 'The Art of Programming', 'A comprehensive guide to computer science fundamentals and software design.', 39.99, 'Books', 'https://placehold.co/600x400.png', 40, 4.8, 'Non-Fiction'),
  ('prod-10', 'Sci-Fi Epic: Galaxy''s End', 'An award-winning science fiction novel about the last human colony.', 19.99, 'Books', 'https://placehold.co/600x400.png', 100, 4.9, 'Science Fiction'),
  ('prod-11', 'Minimalist Coffee Table', 'A sleek and modern coffee table with a minimalist design, made from solid oak.', 299.00, 'Furniture', 'https://placehold.co/600x400.png', 10, 4.6, 'Living Room'),
  ('prod-12', 'Ergonomic Office Chair', 'Improve your posture and comfort with this fully adjustable ergonomic office chair.', 350.00, 'Furniture', 'https://placehold.co/600x400.png', 0, 4.7, 'Office Furniture'),
  ('prod-13', 'Organic Facial Cleanser', 'Gentle organic cleanser for all skin types, deeply cleanses and nourishes.', 25.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 50, 4.8, 'Skincare'),
  ('prod-14', 'Yoga Mat', 'High-density, non-slip yoga mat for all your fitness needs.', 35.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 40, 4.6, 'Fitness Equipment'),
  ('prod-15', 'Plush Toy Bear', 'Super soft and cuddly plush bear, perfect for kids of all ages.', 15.00, 'Toys & Hobbies', 'https://placehold.co/600x400.png', 80, 4.9, 'Action Figures'),
  ('prod-16', 'Eco-Friendly Reusable Water Bottle', 'Stay hydrated with this stylish and durable BPA-free reusable water bottle.', 18.00, 'Eco-friendly', 'https://placehold.co/600x400.png', 100, 4.7, 'Reusable Products'),
  ('prod-17', 'Gourmet Coffee Beans', 'A rich and aromatic blend of single-origin coffee beans from Ethiopia.', 12.50, 'Food & Drink', 'https://placehold.co/600x400.png', 70, 4.9, 'Beverages'),
  ('prod-18', 'Smartwatch', 'Track your fitness, receive notifications, and more with this advanced smartwatch.', 199.00, 'Gift & Gadgets', 'https://placehold.co/600x400.png', 25, 4.6, 'Tech Gadgets'),
  ('prod-19', 'Ergonomic Pet Bed', 'Orthopedic pet bed for maximum comfort for your furry friend.', 60.00, 'Pet Supplies', 'https://placehold.co/600x400.png', 30, 4.8, 'Dog Supplies'),
  ('prod-20', 'Baby Diaper Bag', 'Spacious and stylish diaper bag with multiple compartments for all baby essentials.', 45.00, 'Mother & Kids', 'https://placehold.co/600x400.png', 35, 4.7, 'Baby Gear'),
  ('prod-21', 'Gardening Tool Set', 'Essential tools for every gardener, including trowel, cultivator, and pruner.', 55.00, 'Home & Garden', 'https://placehold.co/600x400.png', 20, 4.5, 'Gardening Tools'),
  ('prod-22', 'Latest Smartphone Model', 'The newest smartphone with advanced camera features and long-lasting battery.', 899.00, 'Mobile Phones & Accessories', 'https://placehold.co/600x400.png', 15, 4.9, 'Smartphones'),
  ('prod-23', 'Car Phone Mount', 'Universal car phone mount with strong grip and adjustable viewing angles.', 20.00, 'Automobiles & Motorcycles', 'https://placehold.co/600x400.png', 60, 4.4, 'Car Accessories'),
  ('prod-24', 'Gaming Console', 'Next-gen gaming console for immersive gaming experiences.', 499.99, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 10, 4.9, 'Video Games'),
  ('prod-25', 'Smart Watch X1', 'Stay connected and track your fitness with the new Smart Watch X1.', 120.00, 'Electronics', 'https://placehold.co/600x400.png', 30, 4.5, 'Wearable Tech'),
  ('prod-26', 'Amethyst Serving Tray', 'Elegant serving tray with genuine amethyst inlay, perfect for entertaining.', 75.00, 'Home & Garden', 'https://placehold.co/600x400.png', 10, 4.8, 'Kitchen & Dining'),
  ('prod-27', 'Outdoor Hiking Backpack', 'Durable and spacious backpack for all your outdoor adventures.', 85.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 25, 4.7, 'Outdoor Recreation'),
  ('prod-28', 'Fitness Tracker F2', 'Monitor your heart rate, steps, and sleep with this advanced fitness tracker.', 55.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 40, 4.6, 'Health Supplements'),
  ('prod-29', 'Cute Eye Mask', 'Soft and comfortable eye mask with a fun design for a good night''s sleep.', 12.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 60, 4.5, 'Personal Care'),
  ('prod-30', 'Multi-tier Storage Shelf', 'Versatile plastic shelving unit for organizing any room in your home.', 40.00, 'Home & Garden', 'https://placehold.co/600x400.png', 15, 4.3, 'Furniture'),
  ('prod-31', 'Glitter Wall Clock', 'Sparkling wall clock that adds a touch of glamour to your decor.', 30.00, 'Home & Garden', 'https://placehold.co/600x400.png', 20, 4.2, 'Home Decor'),
  ('prod-32', 'Adjustable Walking Cane', 'Lightweight and adjustable walking cane for support and stability.', 35.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 18, 4.7, 'Personal Care'),
  ('prod-33', 'Home Fitness Stepper', 'Compact stepper machine for a full body workout at home.', 150.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 10, 4.4, 'Fitness Equipment'),
  ('prod-34', 'Silicone Funnel', 'Flexible silicone funnel for easy pouring and transfer of liquids.', 8.00, 'Home & Garden', 'https://placehold.co/600x400.png', 100, 4.8, 'Kitchen & Dining'),
  ('prod-35', 'Turquoise Gemstone Decor', 'Decorative gemstone pieces for a natural and calming home ambiance.', 65.00, 'Home & Garden', 'https://placehold.co/600x400.png', 12, 4.6, 'Home Decor'),
  ('prod-36', 'Insulated Cooler Bag', 'Large capacity cooler bag to keep your food and drinks cool on the go.', 45.00, 'Food & Drink', 'https://placehold.co/600x400.png', 30, 4.7, 'Beverages'),
  ('prod-37', 'Hanging Closet Organizer', 'Space-saving closet organizer with multiple compartments for clothes and accessories.', 25.00, 'Home & Garden', 'https://placehold.co/600x400.png', 50, 4.5, 'Furniture'),
  ('prod-38', 'Resistance Band Set', 'Versatile set of resistance bands for strength training and physical therapy.', 20.00, 'Sports & Entertainment', 'https://placehold.co/600x400.png', 70, 4.6, 'Fitness Equipment'),
  ('prod-39', 'Premium Smartwatch V2', 'Next-gen smartwatch with advanced health monitoring and connectivity features.', 250.00, 'Electronics', 'https://placehold.co/600x400.png', 20, 4.8, 'Wearable Tech'),
  ('prod-40', 'Travel Garment Bag', 'Foldable garment bag to keep your suits and dresses wrinkle-free while traveling.', 50.00, 'Fashion', 'https://placehold.co/600x400.png', 22, 4.5, 'Accessories'),
  ('prod-41', 'Crystal Coaster Set', 'Elegant crystal coasters that protect your surfaces with a touch of luxury.', 30.00, 'Home & Garden', 'https://placehold.co/600x400.png', 45, 4.9, 'Kitchen & Dining'),
  ('prod-42', 'Agate Bookends', 'Natural agate bookends, a unique and stylish way to organize your books.', 55.00, 'Home & Garden', 'https://placehold.co/600x400.png', 15, 4.8, 'Home Decor'),
  ('prod-43', 'Colorful Floral Pillow', 'Vibrant throw pillow with a beautiful floral design to brighten any room.', 28.00, 'Home & Garden', 'https://placehold.co/600x400.png', 35, 4.6, 'Home Decor'),
  ('prod-44', 'Smart Body Scale', 'Advanced smart scale that tracks weight, body fat, muscle mass, and more.', 70.00, 'Health & Beauty', 'https://placehold.co/600x400.png', 28, 4.7, 'Health Supplements'),
  ('prod-45', 'Universal Remote Control', 'Simplify your entertainment system with this easy-to-use universal remote.', 22.00, 'Electronics', 'https://placehold.co/600x400.png', 60, 4.3, 'Video'),
  ('prod-46', 'Pink Agate Serving Platter', 'Stunning pink agate serving platter, perfect for appetizers and desserts.', 85.00, 'Home & Garden', 'https://placehold.co/600x400.png', 8, 4.9, 'Kitchen & Dining'),
  ('prod-47', 'Modern Wall Clock White', 'Chic and minimalist wall clock in white, ideal for contemporary spaces.', 40.00, 'Home & Garden', 'https://placehold.co/600x400.png', 17, 4.5, 'Home Decor'),
  ('prod-48', 'Action Camera Mount', 'Secure mount for action cameras, great for capturing adventures.', 15.00, 'Electronics', 'https://placehold.co/600x400.png', 90, 4.4, 'Cameras'),
  ('prod-49', 'Marble Serving Board', 'Elegant marble serving board, ideal for cheese, charcuterie, and more.', 60.00, 'Home & Garden', 'https://placehold.co/600x400.png', 14, 4.8, 'Kitchen & Dining'),
  ('prod-50', 'Children''s Doll', 'A cute and cuddly doll for children, perfect for playtime.', 25.00, 'Toys & Hobbies', 'https://placehold.co/600x400.png', 50, 4.7, 'Action Figures');

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

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- Policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING ((SELECT auth.uid()) = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Policy to allow authenticated users to insert their profile
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- Create test table
CREATE TABLE public.test (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  random real
);

-- Enable RLS for test table
ALTER TABLE public.test ENABLE ROW LEVEL SECURITY;

-- Policy to allow read access to everyone
CREATE POLICY "Public can read test data" ON public.test
  FOR SELECT USING (true);

-- Policy to allow insert access to everyone
CREATE POLICY "Anyone can insert into test" ON public.test
  FOR INSERT WITH CHECK (true);
