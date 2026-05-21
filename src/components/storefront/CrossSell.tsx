import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore, formatPrice } from '@/stores/cartStore';

interface Props {
  categoryId: string;
  currentProductId: string;
}

export function CrossSell({ categoryId, currentProductId }: Props) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const currency = useCartStore((s) => s.currency);

  const { data: products } = useQuery({
    queryKey: ['crosssell', categoryId, currentProductId],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, slug, name_zh, name_en, price_nzd, images')
        .eq('category', categoryId)
        .eq('is_active', true)
        .neq('id', currentProductId)
        .limit(4);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <p className="eyebrow mb-3">{lang === 'zh' ? '您可能也喜欢' : 'YOU MAY ALSO LIKE'}</p>
        <h2 className="font-display text-4xl font-light text-foreground mb-10">
          {lang === 'zh' ? '相关推荐' : 'Related Products'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => {
            const images = p.images as { url: string; alt: string; is_primary?: boolean }[] | null;
            const img = images?.[0];
            return (
              <Link key={p.id} to={`/shop/${p.slug}`} className="group">
                <div className="aspect-[4/3] overflow-hidden bg-secondary mb-3">
                  {img && (
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="font-display text-base text-foreground group-hover:text-pa-gold transition-colors">
                  {lang === 'zh' ? p.name_zh : p.name_en}
                </h3>
                <p className="mt-1 font-body text-sm text-pa-gold">
                  {formatPrice(p.price_nzd, currency)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
