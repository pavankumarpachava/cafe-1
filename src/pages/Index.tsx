import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  HeroSection,
  VideoSection,
  FeaturedSection,
  ChristmasSection,
  RewardsTeaser,
  WhyUsSection,
  SustainabilitySection,
} from '@/components/home/HomeSections';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturedSection />
          <ChristmasSection />
          <VideoSection />
          <RewardsTeaser />
          <SustainabilitySection />
          <WhyUsSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
