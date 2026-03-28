import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
  };

  const getRecommendation = () => {
    const budget = answers[2];
    if (budget === 'premium') return { zh: '高奢款春秋被', en: 'Premium Luxury Duvet', slug: 'premium-luxury-spring-autumn' };
    if (budget === 'mid') return { zh: '轻奢款羊驼被', en: 'Luxury Alpaca Duvet', slug: 'premium-luxury-spring-autumn' };
    return { zh: '经典款羊驼被', en: 'Classic Alpaca Duvet', slug: 'premium-luxury-spring-autumn' };
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {lang === 'zh' ? '找到适合你的被子' : 'Find Your Perfect Duvet'}
          </DialogTitle>
        </DialogHeader>

        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="py-4"
            >
              {/* Progress */}
              <div className="flex gap-1 mb-6">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`} />
                ))}
              </div>

              <p className="font-body text-foreground mb-4">
                {lang === 'zh' ? STEPS[step].questionZh : STEPS[step].questionEn}
              </p>

              <div className="space-y-2">
                {STEPS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-sm border border-border hover:border-accent hover:bg-accent/5 transition-colors font-body text-sm text-foreground"
                  >
                    {lang === 'zh' ? opt.zh : opt.en}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 text-center">
            <p className="text-accent text-lg font-display mb-2">
              {lang === 'zh' ? '为您推荐' : 'Recommended for You'}
            </p>
            <p className="font-display text-xl text-foreground mb-4">
              {lang === 'zh' ? getRecommendation().zh : getRecommendation().en}
            </p>
            <Link
              to={`/shop/${getRecommendation().slug}`}
              onClick={() => onOpenChange(false)}
              className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-sm font-body hover:bg-accent/90 transition-colors"
            >
              {lang === 'zh' ? '查看产品' : 'View Product'}
            </Link>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
