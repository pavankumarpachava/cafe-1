import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  HeroSection,
  FeaturedSection,
  ChristmasSection,
  RewardsTeaser,
  WhyUsSection,
} from '@/components/home/HomeSections';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedSection />
        <ChristmasSection />
        <RewardsTeaser />
        <WhyUsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
