import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, formatPrice } from '@/stores/cartStore';
import { SleepQuizDialog } from '@/components/shop/SleepQuizDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  { value: 'all', labelZh: '全部', labelEn: 'All' },
  { value: 'duvet', labelZh: '羊驼被', labelEn: 'Duvets' },
  { value: 'coat', labelZh: '大衣', labelEn: 'Coats' },
  { value: 'vest', labelZh: '马甲', labelEn: 'Vests' },
  { value: 'scarf', labelZh: '围巾', labelEn: 'Scarves' },
  { value: 'baby', labelZh: '初生被', labelEn: 'Baby' },
];

const TIERS = [
  { value: 'all', labelZh: '全部等级', labelEn: 'All Tiers' },
  { value: 'classic', labelZh: '经典款', labelEn: 'Classic' },
  { value: 'luxury', labelZh: '轻奢款', labelEn: 'Luxury' },
  { value: 'premium', labelZh: '高奢款', labelEn: 'Premium' },
  { value: 'cloud_of_dreams', labelZh: '梦幻款', labelEn: 'Cloud of Dreams' },
];

type SortOption = 'default' | 'price_asc' | 'price_desc';

export default function ShopPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const currency = useCartStore((s) => s.currency);
  const [category, setCategory] = useState('all');
  const [tier, setTier] = useState('all');
  const [sort, setSort] = useState<SortOption>('default');
  const [quizOpen, setQuizOpen] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category, tier],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (category !== 'all') query = query.eq('category', category);
      if (tier !== 'all') query = query.eq('tier', tier);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const sorted = products ? [...products].sort((a, b) => {
    if (sort === 'price_asc') return a.price_nzd - b.price_nzd;
    if (sort === 'price_desc') return b.price_nzd - a.price_nzd;
    return 0;
  }) : [];

  const stockLabel = (qty: number | null) => {
    if (!qty || qty <= 0) return { text: lang === 'zh' ? '已售罄' : 'Sold Out', color: 'bg-destructive text-destructive-foreground' };
    if (qty < 3) return { text: lang === 'zh' ? '即将售罄' : 'Almost Gone', color: 'bg-destructive/90 text-destructive-foreground' };
    if (qty <= 10) return { text: lang === 'zh' ? `仅剩 ${qty} 件` : `Only ${qty} left`, color: 'bg-amber-500 text-white' };
    return null;
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Quiz Banner */}
      <div className="bg-accent/10 border-b border-accent/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="font-display text-foreground">
            {lang === 'zh' ? '不知道选哪款？' : "Not sure which to choose?"}
          </p>
          <button
            onClick={() => setQuizOpen(true)}
            className="px-5 py-2 bg-accent text-accent-foreground rounded-sm font-body text-sm hover:bg-accent/90 transition-colors"
          >
            {lang === 'zh' ? '找到适合你的被子 →' : 'Find Your Perfect Duvet →'}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-display text-foreground mb-2">
          {lang === 'zh' ? '产品展示' : 'Our Collection'}
        </h1>
        <div className="gold-line w-16 mb-8" />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Category */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-1.5 rounded-sm text-sm font-body border transition-colors ${
                  category === c.value
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {lang === 'zh' ? c.labelZh : c.labelEn}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-border mx-2 hidden md:block" />

          {/* Tier */}
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded-sm bg-background text-foreground font-body"
          >
            {TIERS.map((t) => (
              <option key={t.value} value={t.value}>
                {lang === 'zh' ? t.labelZh : t.labelEn}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-1.5 text-sm border border-border rounded-sm bg-background text-foreground font-body"
          >
            <option value="default">{lang === 'zh' ? '默认排序' : 'Default'}</option>
            <option value="price_asc">{lang === 'zh' ? '价格从低到高' : 'Price: Low to High'}</option>
            <option value="price_desc">{lang === 'zh' ? '价格从高到低' : 'Price: High to Low'}</option>
          </select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-body">
            {lang === 'zh' ? '暂无产品' : 'No products found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {sorted.map((product, idx) => {
                const images = product.images as { url: string; alt: string; is_primary: boolean }[] | null;
                const primaryImage = images?.find((i) => i.is_primary) || images?.[0];
                const stock = stockLabel(product.stock_quantity);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={`/shop/${product.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-secondary mb-4">
                        {primaryImage && (
                          <img
                            src={primaryImage.url}
                            alt={primaryImage.alt}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        {stock && (
                          <Badge className={`absolute top-3 right-3 ${stock.color} text-xs`}>
                            {stock.text}
                          </Badge>
                        )}
                        {product.is_featured && (
                          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs">
                            {lang === 'zh' ? '推荐' : 'Featured'}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                        {lang === 'zh' ? product.name_zh : product.name_en}
                      </h3>
                      <p className="text-sm text-muted-foreground font-body mt-1">
                        {lang === 'zh' ? product.name_en : product.name_zh}
                      </p>
                      <p className="mt-2 font-display text-lg text-accent">
                        {formatPrice(product.price_nzd, currency)}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <SleepQuizDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
}
