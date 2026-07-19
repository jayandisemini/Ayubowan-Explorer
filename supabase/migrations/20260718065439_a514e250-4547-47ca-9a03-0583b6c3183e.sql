
-- App role enum + user_roles table (secure)
CREATE TYPE public.app_role AS ENUM ('admin', 'traveler');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'traveler',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles select own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile + traveler role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'traveler');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Destinations (public read)
CREATE TYPE public.destination_type AS ENUM ('culture', 'nature', 'food', 'adventure', 'history');

CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.destination_type NOT NULL,
  description TEXT NOT NULL,
  story TEXT,
  image_url TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.destinations TO anon, authenticated;
GRANT ALL ON public.destinations TO service_role;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "destinations public read" ON public.destinations FOR SELECT TO anon, authenticated USING (true);

-- Food recommendations
CREATE TABLE public.food_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_level INT NOT NULL DEFAULT 1 CHECK (price_level BETWEEN 1 AND 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.food_recommendations TO anon, authenticated;
GRANT ALL ON public.food_recommendations TO service_role;
ALTER TABLE public.food_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "food public read" ON public.food_recommendations FOR SELECT TO anon, authenticated USING (true);

-- Bookings (owner-only)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  travel_date DATE NOT NULL,
  total_budget NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings own select" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bookings own insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookings own update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bookings own delete" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed destinations
INSERT INTO public.destinations (name, type, description, story, image_url, latitude, longitude) VALUES
('Sigiriya Rock Fortress', 'culture', 'Ancient rock fortress rising 200m from the jungle plains.', 'Built by King Kashyapa in the 5th century, Sigiriya is crowned by a sky palace and encircled by frescoes of celestial maidens — a UNESCO World Heritage marvel.', null, 7.9570, 80.7603),
('Ella Rock', 'adventure', 'A dramatic hike above misty tea country and Nine Arches Bridge.', 'Ella''s highlands whisper colonial history through emerald tea terraces and the iconic blue-painted trains of the Podi Menike route.', null, 6.8667, 81.0466),
('Galle Fort', 'history', '17th-century Dutch fort hugging the southern coast.', 'Cobblestone lanes, colonial ramparts, and Indian Ocean sunsets make Galle Fort Sri Lanka''s best-preserved living heritage town.', null, 6.0269, 80.2170),
('Mirissa Beach', 'nature', 'Palm-fringed crescent bay famous for blue whale sightings.', 'By dawn, dhoni boats glide out to meet the largest animals on Earth; by dusk, coconut hills glow gold over the surf.', null, 5.9483, 80.4589),
('Kandy — Temple of the Tooth', 'culture', 'Sacred Buddhist temple beside a serene mountain lake.', 'Home to the sacred tooth relic of the Buddha, Kandy''s Esala Perahera fills the streets with drummers, dancers, and jeweled elephants.', null, 7.2936, 80.6413),
('Yala National Park', 'nature', 'Sri Lanka''s premier safari destination with the world''s densest leopard population.', 'Wild elephants, sloth bears, and the elusive leopard roam scrublands where ancient tanks reflect the setting sun.', null, 6.3719, 81.5178),
('Pettah Market — Colombo', 'food', 'The buzzing culinary heart of Colombo.', 'Wander lanes stacked with spice mounds, fresh jackfruit, and street-cart chefs slinging kottu on hot iron plates.', null, 6.9394, 79.8600);

-- Seed food (linked)
INSERT INTO public.food_recommendations (destination_id, food_name, description, price_level)
SELECT id, 'Egg Hoppers (Bittara Appa)', 'Bowl-shaped rice-flour crepe with a runny egg — the quintessential Sri Lankan breakfast.', 1 FROM public.destinations WHERE name='Sigiriya Rock Fortress'
UNION ALL SELECT id, 'Kottu Roti', 'Chopped godhamba roti stir-fried with vegetables, egg, and spice — hear the rhythmic clang from every roadside kade.', 1 FROM public.destinations WHERE name='Ella Rock'
UNION ALL SELECT id, 'Ambul Thiyal', 'Sour fish curry cured with goraka; a heritage recipe from the south coast.', 2 FROM public.destinations WHERE name='Galle Fort'
UNION ALL SELECT id, 'Coconut Sambol & Fresh Seer Fish', 'Grilled catch of the day served with fiery pol sambol on the sand.', 2 FROM public.destinations WHERE name='Mirissa Beach'
UNION ALL SELECT id, 'Kandyan Rice & Curry', 'A colorful platter of 7+ curries, red rice, and mallum greens.', 2 FROM public.destinations WHERE name='Kandy — Temple of the Tooth'
UNION ALL SELECT id, 'Wambatu Moju', 'Sweet-sour pickled eggplant — a safari-lodge classic.', 1 FROM public.destinations WHERE name='Yala National Park'
UNION ALL SELECT id, 'Isso Wade', 'Crispy lentil-and-prawn fritters from Galle Face — Colombo''s beloved street snack.', 1 FROM public.destinations WHERE name='Pettah Market — Colombo';
