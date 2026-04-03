import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { products } from '@/lib/store';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { ShieldCheck, Feather, Droplets, Bug, Zap, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

// Mock fiber_batch_id mapping
const BATCH_MAP: Record<string, string> = {
  'duvet-classic': 'PA-2025-001',
  'duvet-luxury': 'PA-2025-002',
  'duvet-premium': 'PA-2025-003',
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { locale, fp, currency, addToCart, t } = useApp();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl mb-4">{locale === 'zh' ? '产品未找到' : 'Product Not Found'}</h1>
          <Link to="/shop" className="text-gold hover:underline font-body">
            {locale === 'zh' ? '返回产品列表' : 'Back to Shop'}
          </Link>
        </div>
      </div>
    );
  }

  const batchId = BATCH_MAP[product.id];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <CartDrawer />

      <div className="pt-24 pb-16 flex-1">
        <div className="container mx-auto px-6">
          <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-8">
            <ChevronLeft className="w-4 h-4" />
            {locale === 'zh' ? '返回产品列表' : 'Back to Shop'}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="aspect-square rounded-lg overflow-hidden bg-card">
                <img src={product.image} alt={locale === 'zh' ? product.nameZh : product.nameEn} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col">
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-body mb-2">{product.category}</span>
              <h1 className="font-display text-3xl md:text-4xl font-semibold mb-1">
                {locale === 'zh' ? product.nameZh : product.nameEn}
              </h1>
              <p className="text-muted-foreground font-body text-sm mb-2">
                {locale === 'zh' ? product.nameEn : product.nameZh}
              </p>
              <p className="text-gold font-display text-3xl font-semibold mb-4">{fp(product.prices[currency])}</p>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                {locale === 'zh' ? product.descZh : product.descEn}
              </p>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-body text-muted-foreground mb-2">{locale === 'zh' ? '选择尺寸' : 'Select Size'}</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map(v => (
                      <button
                        key={v.value}
                        onClick={() => setSelectedVariant(v.value)}
                        className={`px-4 py-2 rounded-sm border text-sm font-body transition-colors ${
                          selectedVariant === v.value
                            ? 'bg-foreground text-background border-foreground'
                            : 'border-border text-foreground hover:border-gold'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground font-body mb-4">
                {locale === 'zh' ? `库存: ${product.stock} 件` : `Stock: ${product.stock} units`}
              </p>

              <button
                onClick={() => { addToCart(product, selectedVariant || undefined); }}
                disabled={product.stock <= 0}
                className="w-full py-3 bg-accent text-accent-foreground font-body font-semibold rounded-sm tracking-wider hover:bg-accent/90 transition disabled:opacity-50"
              >
                {product.stock <= 0 ? (locale === 'zh' ? '已售罄' : 'Sold Out') : t.products.addToCart}
              </button>

              {/* Verify Authenticity CTA (Task 1.2) */}
              <div className="mt-4">
                {batchId ? (
                  <Link
                    to={`/traceability`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold-dark rounded-sm text-sm font-body hover:bg-gold/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {locale === 'zh' ? '验证产品真实性' : 'Verify Product Authenticity'}
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground/50 text-sm font-body cursor-default">
                        <ShieldCheck className="w-4 h-4" />
                        {locale === 'zh' ? '验证产品真实性' : 'Verify Product Authenticity'}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {locale === 'zh' ? '溯源数据即将上线' : 'Traceability data coming soon'}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-5 gap-3 mt-8">
                {BENEFITS.map((b) => (
                  <div key={b.labelEn} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-1">
                      <b.icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-xs font-body font-semibold">{locale === 'zh' ? b.labelZh : b.labelEn}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{locale === 'zh' ? b.descZh : b.descEn}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Comparison Table */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-16">
            <h2 className="font-display text-2xl text-center mb-6">
              {locale === 'zh' ? '被窝指标对比' : 'Duvet Comparison'}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-2xl mx-auto text-sm font-body">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3">{locale === 'zh' ? '指标' : 'Metric'}</th>
                    <th className="text-center p-3">{locale === 'zh' ? '羊驼被' : 'Alpaca'}</th>
                    <th className="text-center p-3">{locale === 'zh' ? '羊毛被' : 'Wool'}</th>
                    <th className="text-center p-3">{locale === 'zh' ? '蚕丝被' : 'Silk'}</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.key} className="border-b border-border">
                      <td className="p-3 font-semibold">{locale === 'zh' ? row.key : row.keyEn}</td>
                      <td className="p-3 text-center text-gold">{row.alpaca}</td>
                      <td className="p-3 text-center">{row.wool}</td>
                      <td className="p-3 text-center">{row.silk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Cloud of Dreams Story (Task 1.3) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-primary text-primary-foreground rounded-lg overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl mb-6">
                {locale === 'zh' ? '云之梦图案' : 'Cloud of Dreams'}
              </h2>
              <p className="font-body text-primary-foreground/80 leading-relaxed text-sm md:text-base">
                {locale === 'zh'
                  ? '每一床太平洋羊驼被上都绣有我们的注册商标"云之梦"图案。该图案由新西兰丰盛湾阿拉旺部落的毛利艺术家 Patricia Erueti 专为 Pacific Alpacas 设计。购买一床太平洋羊驼被，不仅是拥有顶级品质寝具，更是将一件新西兰文化遗产带回家中。'
                  : "Each of our duvets features our trademarked 'Cloud of Dreams' pattern, designed exclusively for Pacific Alpacas by Māori artist Patricia Erueti of the Arawan tribe from New Zealand's Bay of Plenty. Every purchase carries a piece of New Zealand heritage."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex items-center gap-4 z-40">
        <span className="text-gold font-display text-xl font-semibold">{fp(product.prices[currency])}</span>
        <button
          onClick={() => addToCart(product, selectedVariant || undefined)}
          className="flex-1 py-3 bg-accent text-accent-foreground font-body font-semibold rounded-sm"
        >
          {t.products.addToCart}
        </button>
      </div>

      <Footer />
    </div>
  );
}
