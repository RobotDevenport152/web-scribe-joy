import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-pa-green py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-display text-lg tracking-[0.3em] uppercase text-pa-ivory mb-4">
              {t('footer.brand')}
            </h3>
            <p className="text-sm font-body font-light leading-relaxed text-pa-warm-gray">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="eyebrow mb-4">{t('footer.links')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop" className="text-sm font-body font-light text-pa-warm-gray hover:text-pa-ivory transition-colors">
                {t('nav.shop')}
              </Link>
              <Link to="/#about" className="text-sm font-body font-light text-pa-warm-gray hover:text-pa-ivory transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/#certifications" className="text-sm font-body font-light text-pa-warm-gray hover:text-pa-ivory transition-colors">
                {t('nav.certifications')}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-4">{t('footer.contact')}</h4>
            <div className="flex flex-col gap-2 text-sm font-body font-light text-pa-warm-gray">
              <p>info@pacificalpacas.com</p>
              <p>WeChat: pacificalpacas</p>
              <p>Auckland, New Zealand</p>
            </div>
          </div>
        </div>

        <div className="gold-line mb-8" />
        <p className="text-center text-xs font-body font-light text-pa-warm-gray/60">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
