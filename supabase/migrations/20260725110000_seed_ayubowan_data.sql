-- ===================================================
-- AYUBOWAN TRAVELS — PRODUCTION SEED & SCHEMAS
-- Database Migration: 20260725110000_seed_ayubowan_data.sql
-- ===================================================

-- 1. Ensure Table Structure & Indexes Exist
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'culture',
  description TEXT NOT NULL,
  story TEXT,
  image_url TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.food_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_level INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('tour', 'destination')),
  entity_slug TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  travel_date DATE NOT NULL,
  total_budget NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public destinations read') THEN
    CREATE POLICY "Public destinations read" ON public.destinations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public food read') THEN
    CREATE POLICY "Public food read" ON public.food_recommendations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public reviews read') THEN
    CREATE POLICY "Public reviews read" ON public.reviews FOR SELECT USING (true);
  END IF;
END $$;

-- 2. Seed Initial Destinations
INSERT INTO public.destinations (id, name, type, description, story, image_url, latitude, longitude)
VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'Sigiriya Ancient Fortress',
    'culture',
    'A 5th-century UNESCO World Heritage citadel perched atop a 200-meter sheer granite peak, renowned for royal water gardens and frescoes.',
    'King Kashyapa built his impregnable sky-palace here in 477 AD, guarding the kingdom behind giant stone lion paws.',
    'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80',
    7.9570, 80.7603
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Ella Mountain Pass',
    'nature',
    'Misty hill country village surrounded by emerald tea plantations, Demodara Nine Arch Bridge, and Little Adam''s Peak.',
    'Legend holds that Ravana hid Princess Sita in the caves of Ella Gap surrounded by cloud forests.',
    'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80',
    6.8667, 81.0466
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Mirissa Coastal Bay',
    'adventure',
    'Southern palm-fringed bay famed for blue whale watching cruises, Coconut Tree Hill, and sunset surf break.',
    'Between November and April, giant blue whales migrate along deep undersea trenches just 5 miles off Mirissa headland.',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
    5.9483, 80.4716
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Galle Dutch Fort',
    'history',
    '400-year-old oceanfront fortress containing Dutch colonial ramparts, cobblestone lanes, and maritime museums.',
    'Fortified by the Portuguese in 1588 and expanded by the Dutch East India Company in 1649.',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
    6.0535, 80.2210
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Food Recommendations
INSERT INTO public.food_recommendations (destination_id, food_name, description, price_level)
VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Wild Ceylon Claypot Rice', 'Aromatically baked basmati rice with lotus root, cardamom, and toasted coconut sambal.', 2),
  ('a1111111-1111-1111-1111-111111111111', 'Egg Hoppers & Lunu Miris', 'Crispy bowl-shaped rice flour crêpes with a runny egg center and spicy red onion relish.', 1),
  ('a2222222-2222-2222-2222-222222222222', 'Ceylon Kottu Roti', 'Shredded flatbread flash-fried on hot iron griddles with fresh garden vegetables and roasted spices.', 1),
  ('a2222222-2222-2222-2222-222222222222', 'Silver Tip Ceylon Pekoe Tea', 'Handpicked high-altitude tea leaves served with jaggery palm sugar.', 1),
  ('a3333333-3333-3333-3333-333333333333', 'Grilled Red Snapper & Lime', 'Ocean-fresh fish seasoned with sea salt, curry leaves, and green chili butter.', 2),
  ('a4444444-4444-4444-4444-444444444444', 'Dutch Burgher Lamprais', 'Rice, mixed meat curry, and frikkadels wrapped in banana leaves and slow-baked.', 3)
ON CONFLICT DO NOTHING;
