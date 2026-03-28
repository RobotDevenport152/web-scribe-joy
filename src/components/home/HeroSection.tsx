import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import heroImg from '@/assets/hero-comforter.jpg';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={heroImg}
        alt="Pacific Alpacas Luxury Duvet"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm tracking-[0.3em] uppercase text-cream/80 mb-4 font-body"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-4"
          style={{ color: 'hsl(40 33% 96%)' }}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-display italic text-lg md:text-xl mb-10"
          style={{ color: 'hsl(43 70% 55%)' }}
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/shop"
            className="inline-block px-10 py-4 border font-body text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-gold"
            style={{
              borderColor: 'hsl(43 85% 38%)',
              color: 'hsl(40 33% 96%)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(43 85% 38%)';
              e.currentTarget.style.color = 'hsl(40 33% 96%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'hsl(40 33% 96%)';
            }}
          >
            {t('hero.cta')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 flex flex-col items-center"
          style={{ color: 'hsl(40 33% 96% / 0.6)' }}
        >
          <span className="text-xs tracking-widest mb-2 font-body">{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
