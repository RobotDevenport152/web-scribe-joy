import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Thermometer, Feather, Droplets, ShieldCheck, Zap } from 'lucide-react';
import alpacaFiberImg from '@/assets/alpaca-fiber.jpg';

const FiberSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    { icon: Thermometer, title: t('fiber.warm'), desc: t('fiber.warmDesc') },
    { icon: Feather, title: t('fiber.light'), desc: t('fiber.lightDesc') },
    { icon: Droplets, title: t('fiber.moisture'), desc: t('fiber.moistureDesc') },
    { icon: ShieldCheck, title: t('fiber.mite'), desc: t('fiber.miteDesc') },
    { icon: Zap, title: t('fiber.static'), desc: t('fiber.staticDesc') },
  ];

  return (
    <section ref={ref} className="py-20 md:py-32 bg-cream-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-gold mb-3 font-body">
            {t('fiber.sectionLabel')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {t('fiber.title')}
          </h2>
          <div className="gold-line w-16 mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed">
            {t('fiber.desc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={alpacaFiberImg}
              alt="Alpaca Fiber"
              className="w-full rounded-sm shadow-soft"
              loading="lazy"
              width={1200}
              height={800}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center md:text-left"
          >
            <div className="inline-block bg-accent/10 rounded-sm px-6 py-4 mb-6">
              <span className="text-4xl font-display font-bold text-gold">25%</span>
              <p className="text-sm text-foreground font-body mt-1">{t('fiber.sleepBoost')}</p>
            </div>
            <p className="text-sm text-muted-foreground font-body">{t('fiber.sleepDesc')}</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bg-card p-6 rounded-sm shadow-soft text-center"
            >
              <f.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="font-display text-sm font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FiberSection;
