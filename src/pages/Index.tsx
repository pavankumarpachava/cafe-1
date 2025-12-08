import { lazy, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { HeroSection } from '@/components/home/HomeSections';

// Lazy load non-critical sections for better LCP
const FeaturedSection = lazy(() => 
  import('@/components/home/HomeSections').then(m => ({ default: m.FeaturedSection }))
);
const ChristmasSection = lazy(() => 
  import('@/components/home/HomeSections').then(m => ({ default: m.ChristmasSection }))
);
const VideoSection = lazy(() => 
  import('@/components/home/HomeSections').then(m => ({ default: m.VideoSection }))
);
const RewardsTeaser = lazy(() => 
  import('@/components/home/HomeSections').then(m => ({ default: m.RewardsTeaser }))
);
const WhyUsSection = lazy(() => 
  import('@/components/home/HomeSections').then(m => ({ default: m.WhyUsSection }))
);
const SustainabilitySection = lazy(() => 
  import('@/components/home/HomeSections').then(m => ({ default: m.SustainabilitySection }))
);

// Simple loading skeleton
const SectionSkeleton = () => (
  <div className="py-24 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="h-8 bg-secondary rounded w-48 mx-auto mb-4" />
      <div className="h-4 bg-secondary rounded w-96 mx-auto" />
    </div>
  </div>
);

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main>
          {/* Hero loads immediately for LCP */}
          <HeroSection />
          
          {/* Lazy load below-the-fold content */}
          <Suspense fallback={<SectionSkeleton />}>
            <FeaturedSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <ChristmasSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <VideoSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <RewardsTeaser />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <SustainabilitySection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <WhyUsSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;