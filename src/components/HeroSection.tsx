import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Thermometer, Feather, Droplets, Bug, Zap } from 'lucide-react';
import GrowerNetworkSection from '@/components/GrowerNetworkSection';
import Footer from '@/components/Footer';
import { SleepQuizDialog } from '@/components/SleepQuizDialog';

export default function HeroSection() {
  const { t, locale } = useApp();
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-comforter.jpg" alt="Pacific Alpacas Luxury Duvet" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/30 to-primary/70" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p className="text-primary-foreground/70 text-xs tracking-[0.4em] uppercase font-body mb-6 animate-fade-in">
            {t.hero.subtitle}
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground font-light mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t.hero.title}
          </h1>
          <p className="font-display text-xl md:text-2xl text-gold-light italic mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {t.hero.tagline}
          </p>
          <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <a href="/shop" className="border border-primary-foreground/40 text-primary-foreground px-10 py-4 text-sm tracking-[0.2em] uppercase font-body hover:bg-primary-foreground/10 transition-all">
              {t.hero.cta}
            </a>
            <button
              onClick={() => setQuizOpen(true)}
              className="border border-gold/40 text-gold px-8 py-4 text-sm tracking-[0.2em] uppercase font-body hover:bg-gold/10 transition-all"
            >
              {locale === 'zh' ? '睡眠测试' : 'Sleep Quiz'}
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-primary-foreground/40 text-xs tracking-[0.3em] uppercase font-body mb-2">{t.hero.scroll}</p>
            <div className="w-px h-12 bg-primary-foreground/20 mx-auto" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src="/images/nz-alpaca.jpg" alt="New Zealand Alpaca" className="rounded-sm shadow-lg" loading="lazy" width={1200} height={800} />
            </div>
            <div>
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-body">{t.about.badge}</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mt-4 mb-6 leading-tight">{t.about.title}</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">{t.about.desc}</p>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">{t.about.process}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { val: '25+', label: t.about.stats.years },
                  { val: '800+', label: t.about.stats.farms },
                  { val: '70%', label: t.about.stats.market },
                  { val: '100+', label: t.about.stats.capacity },
                ].map(s => (
                  <div key={s.val} className="text-center">
                    <p className="font-display text-3xl font-semibold text-gold">{s.val}</p>
                    <p className="text-xs text-muted-foreground font-body mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fiber / Why Alpaca */}
      <section id="fiber" className="py-24 bg-cream-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-body">{t.fiber.badge}</span>
            <h2 className="font-display text-3xl md:text-5xl mt-4 mb-4">{t.fiber.title}</h2>
            <p className="max-w-2xl mx-auto text-muted-foreground font-body">{t.fiber.desc}</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <img src="/images/alpaca-fiber.jpg" alt="Alpaca Fiber" className="rounded-sm shadow-lg" loading="lazy" width={1024} height={1024} />
            <div className="space-y-2">
              <div className="bg-background rounded-lg p-6 text-center mb-6">
                <p className="font-display text-5xl font-bold text-gold">25%</p>
                <p className="text-muted-foreground font-body text-sm mt-2">{t.fiber.deepSleep}</p>
                <p className="text-muted-foreground/60 font-body text-xs mt-1">{t.fiber.climate}</p>
              </div>
              {[
                { icon: Thermometer, ...t.fiber.warmth },
                { icon: Feather, ...t.fiber.light },
                { icon: Droplets, ...t.fiber.moisture },
                { icon: Bug, ...t.fiber.mite },
                { icon: Zap, ...t.fiber.static },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-background rounded-lg p-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl mb-2">{t.process.title}</h2>
            <p className="text-primary-foreground/60 font-body text-sm">{t.process.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {t.process.steps.map((step: any, i: number) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-gold text-lg font-semibold">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-primary-foreground/50 font-body text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grower Network */}
      <GrowerNetworkSection />

      {/* Credentials */}
      <section id="credentials" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-body">{t.credentials.badge}</span>
            <h2 className="font-display text-3xl md:text-5xl mt-4">{t.credentials.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[t.credentials.fernmark, t.credentials.nzmade, t.credentials.iaa, t.credentials.hurun].map((cred: any, i: number) => (
              <div key={i} className="bg-card rounded-lg p-6 border border-border hover:border-gold/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <span className="text-gold font-display font-bold">{['🏅', '🇳🇿', '🦙', '🏆'][i]}</span>
                </div>
                <h3 className="font-display font-semibold mb-2">{cred.title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{cred.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sleep Quiz */}
      <SleepQuizDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </>
  );
}
