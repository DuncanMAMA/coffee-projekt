-- RUN THIS IN SUPABASE SQL EDITOR TO MIGRATE EXISTING DATABASE
-- This updates your existing database to support multi-user authentication

-- Step 1: Add user_id column to coffees table
ALTER TABLE public.coffees ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Drop old public policies
DROP POLICY IF EXISTS "Allow public access to roasters" ON public.roasters;
DROP POLICY IF EXISTS "Allow public access to origins" ON public.origins;
DROP POLICY IF EXISTS "Allow public access to regions" ON public.regions;
DROP POLICY IF EXISTS "Allow public access to processes" ON public.processes;
DROP POLICY IF EXISTS "Allow public access to varietals" ON public.varietals;
DROP POLICY IF EXISTS "Allow public access to coffees" ON public.coffees;

-- Step 3: Create new authentication-based policies for reference tables
CREATE POLICY "Allow authenticated read access to roasters" ON public.roasters 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to roasters" ON public.roasters 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access to origins" ON public.origins 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to origins" ON public.origins 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access to regions" ON public.regions 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to regions" ON public.regions 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access to processes" ON public.processes 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to processes" ON public.processes 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access to varietals" ON public.varietals 
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert to varietals" ON public.varietals 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Step 4: Create user-specific policies for coffees table
CREATE POLICY "Users can view own coffees" ON public.coffees 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coffees" ON public.coffees 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coffees" ON public.coffees 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own coffees" ON public.coffees 
  FOR DELETE USING (auth.uid() = user_id);

-- Step 5: IMPORTANT - Assign existing coffees to your user account
-- After you create your account, get your user ID from Supabase Dashboard > Authentication > Users
-- Then run this command, replacing 'YOUR_USER_ID_HERE' with your actual user ID:
-- UPDATE public.coffees SET user_id = 'YOUR_USER_ID_HERE' WHERE user_id IS NULL;
