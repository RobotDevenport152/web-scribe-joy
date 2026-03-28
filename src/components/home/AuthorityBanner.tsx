import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ShieldCheck, Leaf, Award, Tv, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const BADGES = [
  {
    icon: Leaf,
    titleZh: '银蕨认证',
    titleEn: 'FernMark',
    detailZh: '新西兰政府银蕨认证 NZFM101008\n经过新西兰政府严苛审核通过',
    detailEn: 'NZ Government FernMark NZFM101008\nPassed rigorous NZ government review',
    color: 'text-emerald-400',
  },
  {
    icon: ShieldCheck,
    titleZh: 'NZ Made',
    titleEn: 'NZ Made',
    detailZh: 'NZ Made & Grown 认证\n证书号 803724，100%新西兰制造',
    detailEn: 'NZ Made & Grown Certification\nLicence #803724, 100% Made in NZ',
    color: 'text-green-400',
  },
  {
    icon: Star,
    titleZh: '胡润至尚优品 2023',
    titleEn: 'Hurun Best of Best 2023',
    detailZh: '第十九届2023胡润至尚优品金奖\n"软装家居"新秀奖',
    detailEn: '19th Hurun Best of the Best 2023 Gold Award\n"Soft Furnishing" New Arrival Award',
    color: 'text-yellow-400',
  },
  {
    icon: Award,
    titleZh: '国际羊驼协会',
    titleEn: 'IAA Member',
    detailZh: '国际羊驼协会成员 Cert. 02-041\n新西兰唯一企业成员',
    detailEn: 'International Alpaca Association Cert. 02-041\nOnly NZ corporate member',
    color: 'text-amber-400',
  },
  {
    icon: Tv,
    titleZh: 'CCTV 报道',
    titleEn: 'CCTV Coverage',
    detailZh: '央视 CCTV13 专题报道\n30+主流媒体广泛关注',
    detailEn: 'Featured on CCTV13\nCovered by 30+ mainstream media',
    color: 'text-red-400',
  },
];

const AuthorityBanner = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section ref={ref} className="bg-foreground py-8 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto pb-2 md:justify-center scrollbar-hide">
          {BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.button
                key={badge.titleEn}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelected(idx)}
                className="flex flex-col items-center gap-2 min-w-[100px] flex-shrink-0 group cursor-pointer"
              >
                <Icon className={`w-8 h-8 ${badge.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-body text-primary-foreground/80 text-center whitespace-nowrap">
                  {lang === 'zh' ? badge.titleZh : badge.titleEn}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogTitle className="font-display text-lg">
            {selected !== null && (lang === 'zh' ? BADGES[selected].titleZh : BADGES[selected].titleEn)}
          </DialogTitle>
          {selected !== null && (
            <div className="py-4">
              <div className="flex justify-center mb-4">
                {(() => { const Icon = BADGES[selected].icon; return <Icon className={`w-16 h-16 ${BADGES[selected].color}`} />; })()}
              </div>
              <p className="text-sm font-body text-foreground whitespace-pre-line text-center">
                {lang === 'zh' ? BADGES[selected].detailZh : BADGES[selected].detailEn}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AuthorityBanner;
