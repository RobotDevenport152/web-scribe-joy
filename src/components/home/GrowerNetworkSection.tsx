import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const REGIONS = [
  { name: 'Northland', x: 172, y: 48 },
  { name: 'Waikato', x: 168, y: 95 },
  { name: 'Bay of Plenty', x: 195, y: 100 },
  { name: 'Hawke\'s Bay', x: 200, y: 145 },
  { name: 'Wellington', x: 175, y: 185 },
  { name: 'Canterbury', x: 165, y: 245 },
  { name: 'Central Otago', x: 140, y: 295 },
  { name: 'Southland', x: 130, y: 320 },
];

const GrowerNetworkSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4 font-body">
            {lang === 'zh' ? '全球供应网络' : 'Global Supply Network'}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {lang === 'zh' ? '来自新西兰 800 家牧场的承诺' : 'A Promise from 800 NZ Farms'}
          </h2>
          <div className="gold-line w-20 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* NZ Map SVG */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="relative mx-auto"
          >
            <svg viewBox="0 0 300 380" className="w-full max-w-[300px] mx-auto">
              {/* Simplified NZ outline */}
              {/* North Island */}
              <path
                d="M160,30 C175,25 190,35 195,50 C200,65 205,75 200,90 C210,95 215,105 210,120 C205,135 210,150 205,165 C200,175 195,185 185,190 C175,195 168,190 160,185 C155,175 155,165 158,150 C155,135 150,120 155,105 C158,90 155,75 160,60 Z"
                className="fill-secondary stroke-accent/30"
                strokeWidth="1"
              />
              {/* South Island */}
              <path
                d="M155,210 C165,205 175,210 180,220 C185,235 190,250 185,265 C180,280 175,295 165,310 C155,325 145,335 135,330 C125,325 120,310 125,295 C130,280 135,265 140,250 C145,235 148,220 155,210 Z"
                className="fill-secondary stroke-accent/30"
                strokeWidth="1"
              />
              {/* Region dots */}
              {REGIONS.map((region, idx) => (
                <motion.g key={region.name}>
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r="4"
                    className="fill-accent"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  />
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r="8"
                    className="fill-accent/20"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  />
                </motion.g>
              ))}
            </svg>
          </motion.div>

          {/* Stats & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { value: '800+', labelZh: '合作养殖户', labelEn: 'Partner Farms' },
                { value: '25', labelZh: '年深耕历史', labelEn: 'Years of Heritage' },
                { value: '100+', labelZh: '吨原料掌控', labelEn: 'Tonnes Controlled' },
                { value: '70%', labelZh: '新西兰市占率', labelEn: 'NZ Market Share' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.labelEn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="text-center py-4"
                >
                  <p className="font-display text-3xl text-accent">{stat.value}</p>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    {lang === 'zh' ? stat.labelZh : stat.labelEn}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="text-foreground/70 font-body text-sm leading-relaxed mb-6">
              {lang === 'zh'
                ? '每一批纤维均可追溯到具体农场。我们的溯源系统让您清楚了解产品的每一个环节——从牧场到成品。'
                : 'Every fiber batch is traceable to its specific farm. Our traceability system lets you understand every step—from farm to finished product.'}
            </p>

            <Link
              to="/trace/NZ-2024-COT-001"
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent font-body text-sm hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm"
            >
              <Search className="w-4 h-4" />
              {lang === 'zh' ? '查询溯源' : 'Trace Your Fiber'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GrowerNetworkSection;
