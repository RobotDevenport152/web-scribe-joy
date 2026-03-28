import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-espresso py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-display text-lg tracking-[0.3em] uppercase mb-4" style={{ color: 'hsl(40 33% 96%)' }}>
              {t('footer.brand')}
            </h3>
            <p className="text-sm font-body" style={{ color: 'hsl(30 15% 65%)' }}>
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-gold font-body">
              {t('footer.links')}
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop" className="text-sm font-body transition-colors" style={{ color: 'hsl(30 15% 65%)' }}>
                {t('nav.shop')}
              </Link>
              <Link to="/#about" className="text-sm font-body transition-colors" style={{ color: 'hsl(30 15% 65%)' }}>
                {t('nav.about')}
              </Link>
              <Link to="/#certifications" className="text-sm font-body transition-colors" style={{ color: 'hsl(30 15% 65%)' }}>
                {t('nav.certifications')}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-4 text-gold font-body">
              {t('footer.contact')}
            </h4>
            <div className="flex flex-col gap-2 text-sm font-body" style={{ color: 'hsl(30 15% 65%)' }}>
              <p>info@pacificalpacas.com</p>
              <p>WeChat: pacificalpacas</p>
              <p>Auckland, New Zealand</p>
            </div>
          </div>
        </div>

        <div className="gold-line mb-8" />
        <p className="text-center text-xs font-body" style={{ color: 'hsl(30 15% 65% / 0.6)' }}>
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
