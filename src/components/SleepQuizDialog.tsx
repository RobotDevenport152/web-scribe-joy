import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RecommendResult {
  product_id: string;
  reason_en: string;
  reason_zh: string;
}

interface Product {
  id: string;
  name_en: string;
  name_zh: string;
  tier?: string;
  price_nzd: number;
  description_en: string;
}

const STEPS = [
  {
    questionZh: '您主要的睡眠困扰是什么？',
    questionEn: 'What is your main sleep concern?',
    options: [
      { zh: '怕冷/保暖不足', en: 'Too cold / Insufficient warmth', value: 'cold' },
      { zh: '出汗/闷热', en: 'Sweating / Too hot', value: 'hot' },
      { zh: '过敏/螨虫', en: 'Allergies / Dust mites', value: 'allergy' },
      { zh: '总体睡眠质量差', en: 'Poor overall sleep quality', value: 'quality' },
    ],
  },
  {
    questionZh: '您的体型？',
    questionEn: 'Your body type?',
    options: [
      { zh: '偏瘦', en: 'Slim', value: 'slim' },
      { zh: '中等', en: 'Medium', value: 'medium' },
      { zh: '偏胖', en: 'Large', value: 'large' },
    ],
  },
  {
    questionZh: '您的预算范围？',
    questionEn: 'Your budget range?',
    options: [
      { zh: '¥1,000-2,000', en: 'NZ$249-449', value: 'budget' },
      { zh: '¥2,000-4,000', en: 'NZ$449-899', value: 'mid' },
      { zh: '¥4,000以上', en: 'NZ$899+', value: 'premium' },
    ],
  },
  {
    questionZh: '主要使用季节？',
    questionEn: 'Primary season of use?',
    options: [
      { zh: '春秋', en: 'Spring/Autumn', value: 'spring_autumn' },
      { zh: '冬季', en: 'Winter', value: 'winter' },
      { zh: '四季通用', en: 'All seasons', value: 'all' },
    ],
  },
];

export function SleepQuizDialog({ open, onOpenChange }: Props) {
  const { locale, user } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendResult & { name_en: string; name_zh: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch active products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_en, name_zh, tier, price_nzd, description_en')
        .eq('active', true);
      if (!error && data) setProducts(data as Product[]);
    };
    fetchProducts();
  }, []);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Quiz completed — fetch AI recommendation
      fetchRecommendation(newAnswers);
    }
  };

  const fetchRecommendation = async (quizAnswers: string[]) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('recommend', {
        body: {
          answers: quizAnswers,
          products: products,
        },
      });

      if (error) throw error;

      const result: RecommendResult = data as RecommendResult;
      const productData = products.find(p => p.id === result.product_id);

      if (productData) {
        setRecommendation({
          ...result,
          name_en: productData.name_en,
          name_zh: productData.name_zh,
        });
      } else {
        // Fallback if product not found
        setRecommendation({
          ...result,
          name_en: 'Recommended Product',
          name_zh: '推荐产品',
        });
      }

      // Save assessment to database
      if (user) {
        await supabase.from('sleep_assessments').insert({
          user_id: user.id,
          answers: quizAnswers,
          recommended_products: [result.product_id],
          converted: false,
        });
      }

      setDone(true);
    } catch (err) {
      console.error('Recommendation error:', err);
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setDone(false); setRecommendation(null); };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {locale === 'zh' ? '找到适合你的被子' : 'Find Your Perfect Duvet'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="font-body text-sm text-muted-foreground">
              {locale === 'zh' ? '正在生成推荐...' : 'Generating recommendation...'}
            </p>
          </div>
        ) : !done ? (
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Progress */}
              <div className="flex gap-1 mb-4">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-muted'}`} />
                ))}
              </div>

              <p className="font-body text-sm mb-4">{locale === 'zh' ? STEPS[step].questionZh : STEPS[step].questionEn}</p>

              <div className="space-y-2">
                {STEPS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors font-body text-sm text-foreground"
                  >
                    {locale === 'zh' ? opt.zh : opt.en}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
            <div>
              <p className="text-muted-foreground font-body text-sm mb-2">
                {locale === 'zh' ? '为您推荐' : 'Recommended for You'}
              </p>
              <p className="font-display text-2xl font-semibold">
                {locale === 'zh' ? recommendation?.name_zh : recommendation?.name_en}
              </p>
            </div>

            <div className="bg-muted/30 rounded-sm p-3">
              <p className="font-body text-xs leading-relaxed text-foreground">
                {locale === 'zh' ? recommendation?.reason_zh : recommendation?.reason_en}
              </p>
            </div>

            <Link
              to="/shop"
              onClick={() => onOpenChange(false)}
              className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-sm font-body hover:bg-accent/90 transition-colors"
            >
              {locale === 'zh' ? '查看产品' : 'View Products'}
            </Link>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
