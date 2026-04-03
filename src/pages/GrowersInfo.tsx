import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, MapPin, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHY_JOIN = [
  { icon: DollarSign, titleEn: '100% Payout Record', titleZh: '100%付款记录', descEn: 'We have paid out every season since 2010', descZh: '自2010年以来每季按时付款' },
  { icon: CreditCard, titleEn: 'Grower Credit', titleZh: '牧场主信用额度', descEn: 'Use your fibre supply as credit toward purchasing our products at below-wholesale prices', descZh: '用您的纤维供应作为信用额度，以低于批发价购买产品' },
  { icon: MapPin, titleEn: 'Collection Points', titleZh: '收集站点', descEn: 'We have pickup points across all of New Zealand', descZh: '全新西兰设有收集站点' },
  { icon: Scale, titleEn: 'Fair Grading', titleZh: '公平分级', descEn: 'Fibre is graded by colour and micron at our Cromwell facility', descZh: '在我们的Cromwell工厂按颜色和微米数分级' },
];

const STEPS = [
  { en: 'Register online', zh: '在线注册' },
  { en: 'Complete a Fibre Consignment Receipt (FCR)', zh: '填写纤维委托收据 (FCR)' },
  { en: 'Drop your fibre at the nearest collection point', zh: '将纤维送到最近的收集站点' },
  { en: 'Fibre is transported to Cromwell for grading and scouring', zh: '纤维运送至Cromwell进行分级和清洗' },
  { en: 'Receive your payout the following November–December', zh: '在次年11月-12月收到付款' },
];

export default function GrowersInfoPage() {
  const { locale } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl mb-4">
              {locale === 'zh' ? '成为合作牧场主' : 'Become a Grower Partner'}
            </h1>
            <p className="font-body text-primary-foreground/70 max-w-2xl mx-auto">
              {locale === 'zh'
                ? '太平洋羊驼是新西兰最大的羊驼纤维池。我们与全国900多个牧场和种畜场合作。'
                : "Pacific Alpacas is New Zealand's largest alpaca fibre pool. We partner with over 900 farms and studs across the country."}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="flex-1 py-16">
        <div className="container mx-auto px-6">
          {/* Why Join */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-center mb-8">
              {locale === 'zh' ? '为什么加入我们' : 'Why Join Us'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_JOIN.map((item, i) => (
                <motion.div key={item.titleEn} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-lg border border-border p-6 text-center hover:border-gold/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{locale === 'zh' ? item.titleZh : item.titleEn}</h3>
                  <p className="text-xs text-muted-foreground font-body">{locale === 'zh' ? item.descZh : item.descEn}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-2xl md:text-3xl text-center mb-8">
              {locale === 'zh' ? '如何运作' : 'How It Works'}
            </h2>
            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-display font-semibold text-sm">
                    {i + 1}
                  </div>
                  <p className="font-body text-sm pt-1.5">{locale === 'zh' ? step.zh : step.en}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Grower Credit */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-gold/10 border border-gold/20 rounded-lg p-8">
              <h3 className="font-display text-xl font-semibold mb-3">
                {locale === 'zh' ? '牧场主信用额度说明' : 'Grower Credit Explained'}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {locale === 'zh'
                  ? '牧场主信用额度是太平洋羊驼向贡献纤维的牧场主提供的产品购买信用额度。它等于您的纤维重量 × 我们对最低等级的估计最低每公斤付款额。'
                  : "Grower Credit is the credit Pacific Alpacas extends to contributing growers toward product purchases. It equals your fibre weight × our estimated minimum payout per kg for the lowest grade."}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/contact"
              className="inline-block px-10 py-4 bg-accent text-accent-foreground font-body font-semibold rounded-sm tracking-wider hover:bg-accent/90 transition">
              {locale === 'zh' ? '注册成为牧场主' : 'Register as a Grower'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
