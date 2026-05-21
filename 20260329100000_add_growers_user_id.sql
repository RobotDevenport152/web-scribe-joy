-- B04: Add user_id column to growers so portal lookup works via auth.uid()
ALTER TABLE public.growers ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS growers_user_id_idx ON public.growers(user_id);

-- Update the own-update policy to support both user_id and email matching
DROP POLICY IF EXISTS "growers_own_update" ON public.growers;
CREATE POLICY "growers_own_update" ON public.growers
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid()
    OR owner_name = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
  WITH CHECK (
    user_id = auth.uid()
    OR owner_name = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  );
