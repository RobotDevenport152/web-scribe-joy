-- Fix 1: Orders only readable by their owner via user_id (not email)
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

-- Fix 2: Only authenticated users can insert orders with their own user_id
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Fix 3: Promo codes only readable by authenticated users, active codes only
DROP POLICY IF EXISTS "Public can read promo codes" ON public.promo_codes;
CREATE POLICY "Authenticated users can read active promo codes" ON public.promo_codes
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_active = true);

-- Fix 4: Farm images only manageable by the grower who owns the folder
DROP POLICY IF EXISTS "Authenticated users can upload farm images" ON storage.objects;
CREATE POLICY "Growers can manage own farm images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'farm-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Fix 5: user_id column on growers (IF NOT EXISTS — may already exist from prior migration)
ALTER TABLE public.growers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS growers_user_id_idx ON public.growers(user_id);

-- Update grower update policy to support both user_id and email for backward compat
DROP POLICY IF EXISTS "Growers can update own profile" ON public.growers;
DROP POLICY IF EXISTS "growers_own_update" ON public.growers;
CREATE POLICY "Growers can update own profile" ON public.growers
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR owner_name = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
  WITH CHECK (
    user_id = auth.uid()
    OR owner_name = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  );

-- Fix 6: Atomic promo code claiming — validates and increments used_count in one transaction
CREATE OR REPLACE FUNCTION claim_promo_code(p_code text, p_subtotal numeric)
RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_discount numeric := 0;
BEGIN
  SELECT * INTO v_promo FROM promo_codes
    WHERE code = p_code AND is_active = true
    FOR UPDATE;
  IF NOT FOUND THEN RETURN 0; END IF;
  IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < now() THEN RETURN 0; END IF;
  IF v_promo.usage_limit IS NOT NULL AND v_promo.used_count >= v_promo.usage_limit THEN RETURN 0; END IF;
  IF v_promo.min_order_nzd IS NOT NULL AND p_subtotal < v_promo.min_order_nzd THEN RETURN 0; END IF;
  IF v_promo.discount_type = 'percent' THEN
    v_discount := round(p_subtotal * v_promo.discount_value / 100, 2);
  ELSE
    v_discount := v_promo.discount_value;
  END IF;
  UPDATE promo_codes SET used_count = used_count + 1 WHERE id = v_promo.id;
  RETURN v_discount;
END;
$$;

-- Fix 7: Disable public listing of the farm-images bucket
UPDATE storage.buckets SET public = false WHERE id = 'farm-images';
