import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { Currency } from '@/lib/store';

type DbProduct = Tables<'products'>;

// Convert DB product to legacy Product format for compatibility
export function dbToLegacyProduct(p: DbProduct) {
  const images = Array.isArray(p.images) ? (p.images as string[]) : [];
  return {
    id: p.id,
    nameEn: p.name_en,
    nameZh: p.name_zh,
    descEn: p.description_en || '',
    descZh: p.description_zh || '',
    category: p.category as any,
    prices: {
      NZD: Number(p.price_nzd),
      CNY: Number(p.price_nzd) * 4.5,
      USD: Number(p.price_nzd) * 0.6,
    } as Record<Currency, number>,
    image: images[0] || '/placeholder.svg',
    badge: p.is_featured ? 'Featured' : undefined,
    variants: Array.isArray(p.size_options)
      ? (p.size_options as any[]).map((v: any) => ({ label: v.name || v.label || v, value: v.name || v.value || v }))
      : undefined,
    stock: p.stock_quantity ?? 0,
    featured: p.is_featured ?? false,
    slug: p.slug,
    rating: 0,
    reviewCount: 0,
    weight: p.weight_grams ? `${p.weight_grams}g` : null,
    fillPower: p.fill_material || null,
    certifications: Array.isArray(p.certifications) ? (p.certifications as string[]) : [],
  };
}

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(dbToLegacyProduct);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return dbToLegacyProduct(data);
    },
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(6);
      if (error) throw error;
      return (data ?? []).map(dbToLegacyProduct);
    },
  });
}
