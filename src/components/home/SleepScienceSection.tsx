import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl text-accent tabular-nums">
      {count}{suffix}
    </span>
  );
}

const COMPARISON = [
  { metricZh: '保暖性', metricEn: 'Warmth', alpaca: 10, wool: 6, silk: 4, unit: '/10' },
  { metricZh: '轻盈度', metricEn: 'Lightness', alpaca: 10, wool: 4, silk: 8, unit: '/10' },
  { metricZh: '排湿性', metricEn: 'Moisture Wicking', alpaca: 9, wool: 6, silk: 6, unit: '/10' },
  { metricZh: '抑螨性', metricEn: 'Anti-mite', alpaca: 9, wool: 4, silk: 6, unit: '/10' },
  { metricZh: '抗静电', metricEn: 'Anti-static', alpaca: 9, wool: 3, silk: 6, unit: '/10' },
  { metricZh: '耐用性', metricEn: 'Durability', alpaca: 9, wool: 8, silk: 5, unit: '/10' },
];

const SleepScienceSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4 font-body">
            {lang === 'zh' ? 'WASM 世界睡眠医学会' : 'WASM - World Association of Sleep Medicine'}
          </p>
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            {lang === 'zh'
              ? '实验数据证明，羊驼被能增加 25% 深度睡眠'
              : 'Proven: Alpaca Duvets Increase Deep Sleep by 25%'}
          </h2>
          <div className="gold-line w-20 mx-auto" />
        </motion.div>

        {/* Counters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { target: 25, suffix: '%', labelZh: '深度睡眠提升', labelEn: 'Deep Sleep Improvement' },
            { target: 64, suffix: '%', labelZh: '螨虫趋避率', labelEn: 'Mite Avoidance Rate' },
            { target: 33, suffix: '°C', labelZh: '被窝恒温', labelEn: 'Duvet Micro-climate' },
          ].map((item, idx) => (
            <motion.div
              key={item.labelEn}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className="text-center"
            >
              <AnimatedCounter target={item.target} suffix={item.suffix} />
              <p className="mt-2 text-sm font-body text-primary-foreground/70">
                {lang === 'zh' ? item.labelZh : item.labelEn}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="font-display text-xl text-center mb-6">
            {lang === 'zh' ? '被窝微环境对比' : 'Duvet Micro-environment Comparison'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-primary-foreground/20">
                  <th className="text-left py-3 pr-4 text-primary-foreground/60">{lang === 'zh' ? '指标' : 'Metric'}</th>
                  <th className="py-3 px-4 text-accent">{lang === 'zh' ? '羊驼被' : 'Alpaca'}</th>
                  <th className="py-3 px-4 text-primary-foreground/60">{lang === 'zh' ? '羊毛被' : 'Wool'}</th>
                  <th className="py-3 px-4 text-primary-foreground/60">{lang === 'zh' ? '蚕丝被' : 'Silk'}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.metricEn} className="border-b border-primary-foreground/10">
                    <td className="py-3 pr-4 text-primary-foreground/80">{lang === 'zh' ? row.metricZh : row.metricEn}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-2 bg-accent rounded-full" style={{ width: `${row.alpaca * 8}px` }} />
                        <span className="text-accent text-xs">{row.alpaca}{row.unit}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-2 bg-primary-foreground/30 rounded-full" style={{ width: `${row.wool * 8}px` }} />
                        <span className="text-primary-foreground/50 text-xs">{row.wool}{row.unit}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-2 bg-primary-foreground/30 rounded-full" style={{ width: `${row.silk * 8}px` }} />
                        <span className="text-primary-foreground/50 text-xs">{row.silk}{row.unit}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-primary-foreground/40 mt-4 text-center font-body">
            {lang === 'zh' ? '数据来源：WASM（世界睡眠医学会）' : 'Source: WASM (World Association of Sleep Medicine)'}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SleepScienceSection;
