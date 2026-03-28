import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import nzAlpacaImg from '@/assets/nz-alpaca.jpg';

const CountUp = ({ end, suffix = '' }: { end: string; suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-3xl md:text-4xl font-display font-bold text-gold"
    >
      {end}{suffix}
    </motion.span>
  );
};

const BrandHeritageSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: '25+', label: t('brand.years') },
    { value: '800+', label: t('brand.farms') },
    { value: '70%', label: t('brand.market') },
    { value: '100+', label: t('brand.material') },
  ];

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img
              src={nzAlpacaImg}
              alt="New Zealand Alpaca"
              className="w-full rounded-sm shadow-soft"
              loading="lazy"
              width={1200}
              height={800}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-gold mb-3 font-body">
              {t('brand.sectionLabel')}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              {t('brand.title')}
            </h2>
            <div className="gold-line w-16 mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-4 font-body">
              {t('brand.desc')}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10 font-body">
              {t('brand.desc2')}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <CountUp end={stat.value} />
                  <p className="text-xs text-muted-foreground mt-1 font-body">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandHeritageSection;
