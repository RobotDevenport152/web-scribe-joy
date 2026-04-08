import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AuthorityBanner from '@/components/home/AuthorityBanner';
import BrandHeritageSection from '@/components/home/BrandHeritageSection';
import SleepScienceSection from '@/components/home/SleepScienceSection';
import FiberSection from '@/components/home/FiberSection';
import ProcessSection from '@/components/home/ProcessSection';
import CertificationsSection from '@/components/home/CertificationsSection';
import GrowerNetworkSection from '@/components/home/GrowerNetworkSection';
import MediaCoverageSection from '@/components/home/MediaCoverageSection';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ChatWidget from '@/components/chat/ChatWidget';
import SEOHead from '@/components/SEOHead';
import { useUIStore } from '@/stores/uiStore';

export default function Index() {
  const { language } = useUIStore();
  const locale = language;
  return (
    <div className="min-h-screen">
      <SEOHead
        title={locale === 'zh' ? '太平洋羊驼 — 全球深睡新标准' : 'Pacific Alpacas — New Zealand Premium Alpaca Fiber'}
        description={locale === 'zh'
          ? '太平洋羊驼，自2001年起专注奢华羊驼纤维寝具，800+合作牧场，全球深睡新标准。'
          : 'Pacific Alpacas — Since 2001, luxury alpaca fiber bedding from 800+ NZ farms.'}
      />
      <Navbar />
      <CartDrawer />
      <main>
        <HeroSection />
        <AuthorityBanner />
        <BrandHeritageSection />
        <SleepScienceSection />
        <FiberSection />
        <ProcessSection />
        <CertificationsSection />
        <GrowerNetworkSection />
        <MediaCoverageSection />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
