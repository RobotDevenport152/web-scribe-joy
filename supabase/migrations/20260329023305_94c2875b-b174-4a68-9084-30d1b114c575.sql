INSERT INTO storage.buckets (id, name, public) VALUES ('farm-images', 'farm-images', true);

CREATE POLICY "auth_upload_farm_images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'farm-images');
CREATE POLICY "public_read_farm_images" ON storage.objects FOR SELECT USING (bucket_id = 'farm-images');
CREATE POLICY "auth_update_farm_images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'farm-images');
CREATE POLICY "auth_delete_farm_images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'farm-images');

CREATE POLICY "growers_own_update" ON public.growers FOR UPDATE TO authenticated USING (
  owner_name = (SELECT email FROM auth.users WHERE id = auth.uid())::text
) WITH CHECK (
  owner_name = (SELECT email FROM auth.users WHERE id = auth.uid())::text
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.products;