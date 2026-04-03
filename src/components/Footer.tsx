import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  const { locale, t } = useApp();

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <h3 className="font-display text-xl tracking-[0.3em] mb-3">PACIFIC ALPACAS</h3>
            <p className="text-primary-foreground/40 font-display italic text-sm">{t.footer.tagline}</p>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-wider uppercase text-primary-foreground/60 mb-4">{t.footer.company}</h4>
            <div className="space-y-2">
              <Link to="/#about" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t.nav.about}</Link>
              <Link to="/#fiber" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t.nav.whyAlpaca}</Link>
              <Link to="/#credentials" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t.nav.credentials}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-wider uppercase text-primary-foreground/60 mb-4">{locale === 'zh' ? '产品与服务' : 'Products'}</h4>
            <div className="space-y-2">
              <Link to="/shop" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{t.nav.products}</Link>
              <Link to="/traceability" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{locale === 'zh' ? '溯源查询' : 'Traceability'}</Link>
              <Link to="/growers-info" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{locale === 'zh' ? '牧场合作' : 'Growers'}</Link>
              <Link to="/wholesale" className="block text-sm font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors">{locale === 'zh' ? '批发询价' : 'Wholesale'}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs tracking-wider uppercase text-primary-foreground/60 mb-4">{t.footer.support}</h4>
            <div className="space-y-2">
              <p className="text-sm font-body text-primary-foreground/50">info@pacificalpacas.com</p>
              <p className="text-sm font-body text-primary-foreground/50">+64 21 950 204</p>
              <p className="text-sm font-body text-primary-foreground/50">{locale === 'zh' ? '微信: pacificalpacas' : 'WeChat: pacificalpacas'}</p>
              <p className="text-sm font-body text-primary-foreground/50">
                1 Pigeon Rock Road, RD2, Cromwell,<br />Central Otago 9382, New Zealand
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/30 text-xs font-body">{t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/pacificalpacas/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-gold transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/channel/UCfI8KvHECEQmRvcTuFSq-SA" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-gold transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/pacific_alpacas/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/40 hover:text-gold transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
