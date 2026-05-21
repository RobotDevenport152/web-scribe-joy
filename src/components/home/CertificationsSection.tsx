import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Globe, Leaf, Trophy } from 'lucide-react';

const CertificationsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const certs = [
    { icon: Leaf, key: 'fernmark', emoji: '🏅' },
    { icon: Globe, key: 'nzmade', emoji: '🇳🇿' },
    { icon: Award, key: 'iaa', emoji: '🦙' },
    { icon: Trophy, key: 'hurun', emoji: '🏆' },
  ] as const;

  return (
    <section ref={ref} className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-gold mb-3 font-body">
            {t('certs.sectionLabel')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            {t('certs.title')}
          </h2>
          <div className="gold-line w-16 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.key}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="bg-card p-8 rounded-sm shadow-soft text-center border border-border hover:shadow-gold transition-shadow duration-300"
            >
              <span className="text-4xl mb-4 block">{cert.emoji}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {t(`certs.${cert.key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {t(`certs.${cert.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
