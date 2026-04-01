import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useCartStore, formatPrice } from '@/stores/cartStore';
import { motion } from 'framer-motion';
import { ShieldCheck, Feather, Droplets, Bug, Zap, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductTraceability } from '@/components/traceability/ProductTraceability';
import { CertificationBadges } from '@/components/traceability/CertificationBadges';
import { ProductJsonLd } from '@/components/storefront/ProductJsonLd';
import { CrossSell } from '@/components/storefront/CrossSell';
import { LiveInventory } from '@/components/storefront/LiveInventory';
import { toast } from 'sonner';

const BENEFITS = [
  { icon: ShieldCheck, labelZh: '保暖', labelEn: 'Warmth', descZh: '3倍于羊毛', descEn: '3× warmer than wool' },
  { icon: Feather, labelZh: '轻盈', labelEn: 'Light', descZh: '仅羊毛被30%重量', descEn: '30% weight of wool' },
  { icon: Droplets, labelZh: '排潮', labelEn: 'Moisture', descZh: '吸收35%水蒸气', descEn: '35% vapor absorption' },
  { icon: Bug, labelZh: '抑螨', labelEn: 'Anti-mite', descZh: '64.37%趋避率', descEn: '64.37% avoidance' },
  { icon: Zap, labelZh: '阻电', labelEn: 'Anti-static', descZh: '天然抗静电', descEn: 'Natural anti-static' },
];

const COMPARISON = [
  { key: '保暖性', keyEn: 'Warmth', alpaca: '★★★★★', wool: '★★★☆☆', silk: '★★☆☆☆' },
  { key: '轻盈度', keyEn: 'Lightness', alpaca: '★★★★★', wool: '★★☆☆☆', silk: '★★★★☆' },
  { key: '排湿性', keyEn: 'Moisture', alpaca: '★★★★★', wool: '★★★☆☆', silk: '★★★☆☆' },
  { key: '抗螨性', keyEn: 'Anti-mite', alpaca: '★★★★★', wool: '★★☆☆☆', silk: '★★★☆☆' },
  { key: '耐用性', keyEn: 'Durability', alpaca: '★★★★★', wool: '★★★★☆', silk: '★★☆☆☆' },
  { key: '抗静电', keyEn: 'Anti-static', alpaca: '★★★★★', wool: '★☆☆☆☆', silk: '★★★☆☆' },
];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const currency = useCartStore((s) => s.currency);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug!)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">
            {lang === 'zh' ? '产品未找到' : 'Product Not Found'}
          </h1>
          <Link to="/shop" className="text-accent underline">{lang === 'zh' ? '返回产品列表' : 'Back to Shop'}</Link>
        </div>
      </div>
    );
  }

  const images = (product.images as { url: string; alt: string; is_primary: boolean }[] | null) || [];
  const sizes = (product.size_options as { label: string; price_nzd?: number; weight?: number }[] | null) || [];
  const colors = (product.color_options as string[] | null) || [];
  const certs = (product.certifications as string[] | null) || [];

  const currentPrice = selectedSize
    ? sizes.find((s) => s.label === selectedSize)?.price_nzd || product.price_nzd
    : product.price_nzd;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error(lang === 'zh' ? '请选择尺寸' : 'Please select a size');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name_zh,
      nameEn: product.name_en,
      price: currentPrice,
      size: selectedSize || '',
      color: selectedColor || colors[0] || '',
      image: images[0]?.url || '',
    });
    setCartOpen(true);
    toast.success(lang === 'zh' ? '已加入购物车' : 'Added to cart');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <ProductJsonLd product={product} />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 font-body">
          <ChevronLeft className="w-4 h-4" />
          {lang === 'zh' ? '返回产品列表' : 'Back to Shop'}
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <motion.div
              key={activeImageIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square overflow-hidden rounded-sm bg-secondary mb-4"
            >
              {images[activeImageIdx] && (
                <img
                  src={images[activeImageIdx].url}
                  alt={images[activeImageIdx].alt}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-sm overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      idx === activeImageIdx ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">
              {lang === 'zh' ? product.name_zh : product.name_en}
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              {lang === 'zh' ? product.name_en : product.name_zh}
            </p>

            <p className="mt-4 font-display text-2xl text-accent">
              {formatPrice(currentPrice, currency)}
            </p>

            <div className="gold-line w-12 my-6" />

            <p className="text-foreground/80 font-body leading-relaxed">
              {lang === 'zh' ? product.description_zh : product.description_en}
            </p>

            {/* Material */}
            {product.fill_material && (
              <div className="mt-4 text-sm font-body text-muted-foreground">
                <span className="text-foreground font-medium">{lang === 'zh' ? '填充物：' : 'Fill: '}</span>
                {product.fill_material}
              </div>
            )}
            {product.fabric_material && (
              <div className="text-sm font-body text-muted-foreground">
                <span className="text-foreground font-medium">{lang === 'zh' ? '面料：' : 'Fabric: '}</span>
                {product.fabric_material}
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-body font-medium text-foreground mb-2">
                  {lang === 'zh' ? '选择尺寸' : 'Select Size'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setSelectedSize(s.label)}
                      className={`px-4 py-2 rounded-sm border text-sm font-body transition-colors ${
                        selectedSize === s.label
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-foreground hover:border-accent'
                      }`}
                    >
                      {s.label}
                      {s.price_nzd && (
                        <span className="ml-1 text-xs opacity-60">
                          {formatPrice(s.price_nzd, currency)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-body font-medium text-foreground mb-2">
                  {lang === 'zh' ? '颜色' : 'Color'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-sm border text-sm font-body transition-colors ${
                        selectedColor === c
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-foreground hover:border-accent'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity !== null && product.stock_quantity <= 0}
              className="mt-8 w-full py-3 bg-accent text-accent-foreground font-body font-medium rounded-sm hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock_quantity !== null && product.stock_quantity <= 0
                ? (lang === 'zh' ? '已售罄' : 'Sold Out')
                : (lang === 'zh' ? '加入购物车' : 'Add to Cart')}
            </button>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-5 gap-2">
              {BENEFITS.map((b) => (
                <div key={b.labelEn} className="text-center">
                  <b.icon className="w-6 h-6 mx-auto text-accent mb-1" />
                  <p className="text-xs font-body font-medium text-foreground">{lang === 'zh' ? b.labelZh : b.labelEn}</p>
                  <p className="text-[10px] text-muted-foreground">{lang === 'zh' ? b.descZh : b.descEn}</p>
                </div>
              ))}
            </div>

            {/* Certifications */}
            {certs.length > 0 && (
              <div className="mt-6">
                <CertificationBadges certifications={certs} />
              </div>
            )}
          </div>
        </div>

        {/* Traceability */}
        {product.fiber_batch_id && (
          <div className="mt-16">
            <ProductTraceability batchId={product.fiber_batch_id} />
          </div>
        )}

        {/* Comparison Table */}
        <div className="mt-16 mb-12">
          <h2 className="font-display text-2xl text-foreground mb-6">
            {lang === 'zh' ? '被窝指标对比' : 'Duvet Comparison'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body border border-border rounded-sm">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left p-3 font-medium text-foreground">{lang === 'zh' ? '指标' : 'Metric'}</th>
                  <th className="p-3 font-medium text-accent">{lang === 'zh' ? '羊驼被' : 'Alpaca'}</th>
                  <th className="p-3 font-medium text-foreground">{lang === 'zh' ? '羊毛被' : 'Wool'}</th>
                  <th className="p-3 font-medium text-foreground">{lang === 'zh' ? '蚕丝被' : 'Silk'}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.key} className="border-t border-border">
                    <td className="p-3 text-foreground">{lang === 'zh' ? row.key : row.keyEn}</td>
                    <td className="p-3 text-center text-accent">{row.alpaca}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.wool}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.silk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 md:hidden z-40 safe-bottom">
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-lg text-accent">{formatPrice(currentPrice, currency)}</p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity !== null && product.stock_quantity <= 0}
            className="flex-1 py-3 bg-accent text-accent-foreground font-body font-medium rounded-sm disabled:opacity-50"
          >
            {lang === 'zh' ? '加入购物车' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
