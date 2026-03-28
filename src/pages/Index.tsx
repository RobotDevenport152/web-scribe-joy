import HeroSection from '@/components/home/HeroSection';
import AuthorityBanner from '@/components/home/AuthorityBanner';
import BrandHeritageSection from '@/components/home/BrandHeritageSection';
import SleepScienceSection from '@/components/home/SleepScienceSection';
import FiberSection from '@/components/home/FiberSection';
import ProcessSection from '@/components/home/ProcessSection';
import GrowerNetworkSection from '@/components/home/GrowerNetworkSection';
import MediaCoverageSection from '@/components/home/MediaCoverageSection';
import CertificationsSection from '@/components/home/CertificationsSection';

const Index = () => {
  return (
    <>
      <HeroSection />
      <AuthorityBanner />
      <section id="about">
        <BrandHeritageSection />
      </section>
      <SleepScienceSection />
      <section id="fiber">
        <FiberSection />
      </section>
      <ProcessSection />
      <GrowerNetworkSection />
      <MediaCoverageSection />
      <section id="certifications">
        <CertificationsSection />
      </section>
    </>
  );
};

export default Index;
