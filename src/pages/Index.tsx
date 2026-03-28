import HeroSection from '@/components/home/HeroSection';
import BrandHeritageSection from '@/components/home/BrandHeritageSection';
import FiberSection from '@/components/home/FiberSection';
import ProcessSection from '@/components/home/ProcessSection';
import CertificationsSection from '@/components/home/CertificationsSection';

const Index = () => {
  return (
    <>
      <HeroSection />
      <section id="about">
        <BrandHeritageSection />
      </section>
      <section id="fiber">
        <FiberSection />
      </section>
      <ProcessSection />
      <section id="certifications">
        <CertificationsSection />
      </section>
    </>
  );
};

export default Index;
