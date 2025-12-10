import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Leaf, Award, Coffee, Play } from 'lucide-react';
import heroImage from '@/assets/hero-christmas-coffee.jpg';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shop/ProductCard';
import { products, christmasProducts } from '@/data/products';

// Lazy load Snowfall to improve LCP
const Snowfall = lazy(() => import('@/components/effects/Snowfall').then(m => ({ default: m.Snowfall })));

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [showEffects, setShowEffects] = useState(false);
  
  // Delay non-critical effects for better LCP
  useEffect(() => {
    // Use requestIdleCallback with fallback for Safari
    const rIC = typeof window !== 'undefined' && 'requestIdleCallback' in window 
      ? window.requestIdleCallback 
      : null;
    
    if (rIC) {
      const handle = rIC(() => setShowEffects(true));
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => setShowEffects(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const decorY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Static Background for instant LCP */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Christmas coffee at Café 1%"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-transparent h-32" />
      </div>

      {/* Lazy loaded Snowfall */}
      {showEffects && (
        <Suspense fallback={null}>
          <Snowfall intensity="heavy" />
        </Suspense>
      )}

      {/* Floating decorations - only after initial paint */}
      {showEffects && (
        <>
          <motion.div
            style={{ y: decorY1 }}
            className="absolute top-20 right-20 w-32 h-32 opacity-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full bg-gradient-to-br from-christmas to-gold blur-2xl"
            />
          </motion.div>
          <motion.div
            style={{ y: decorY2 }}
            className="absolute bottom-40 left-10 w-48 h-48 opacity-15"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full bg-gradient-to-br from-gold to-christmas blur-3xl"
            />
          </motion.div>
        </>
      )}

      {/* Content - renders immediately */}
      <motion.div
        style={{ opacity, y: textY }}
        className="relative h-full flex items-center"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-christmas/90 text-christmas-foreground rounded-full backdrop-blur-sm"
            >
              ✨ Holiday Season Special
            </motion.span>
            
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Brew the
              <motion.span 
                className="block text-gradient-gold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Moment.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Warm. Bold. Yours. Experience the magic of Christmas in every sip.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/shop">
                <Button size="lg" className="btn-gold text-lg px-8 py-6 group">
                  Explore Menu
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/shop?category=Christmas">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 backdrop-blur-sm bg-background/10">
                  <Gift className="mr-2 w-5 h-5" />
                  Christmas Specials
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator with enhanced animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-gold rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export function VideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-christmas/5 rounded-full blur-3xl"
      />

      <motion.div style={{ opacity }} className="container mx-auto px-4">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-gold/20 text-gold rounded-full">
            🎬 Behind the Scenes
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            The Art of Craft
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch how our master baristas create the perfect cup, every time.
          </p>
        </motion.div>

        <motion.div 
          style={{ y, scale }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl group"
        >
          {/* Embedded YouTube Shorts Video */}
          <div className="relative aspect-video bg-secondary">
            <iframe
              src="https://www.youtube.com/embed/HzOnOaMyEtQ?rel=0&modestbranding=1&autoplay=0"
              title="Christmas Coffee Making"
              className="w-full h-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Floating elements with parallax */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-6 -right-6 w-24 h-24 bg-christmas/20 rounded-full blur-xl pointer-events-none"
          />
          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/20 rounded-full blur-xl pointer-events-none"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export function FeaturedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  const featured = products.slice(0, 4);

  return (
    <section ref={ref} className="py-24 bg-secondary relative overflow-hidden">
      {/* Multi-layer parallax background elements */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 40]) }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-christmas/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          style={{ y: titleY }}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Signature Drinks
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Crafted with passion, served with love. Discover our most beloved creations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{ y: useTransform(scrollYProgress, [0, 1], [20 * (index + 1), -20 * (index + 1)]) }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/shop">
            <Button variant="outline" size="lg" className="group">
              View All Drinks
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function ChristmasSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const decorY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section ref={ref} className="py-24 bg-christmas/5 relative overflow-hidden">
      {/* Enhanced parallax decorative elements */}
      <motion.div
        style={{ y: decorY }}
        className="absolute top-0 left-0 w-64 h-64 bg-christmas/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: decorY2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [100, -100]) }}
        className="absolute top-1/2 left-1/4 w-48 h-48 bg-christmas/5 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          style={{ y: contentY }}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-christmas text-christmas-foreground rounded-full">
            🎄 Limited Edition
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Christmas Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Warm up your holidays with our festive seasonal favorites.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {christmasProducts.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              style={{ 
                y: useTransform(scrollYProgress, [0, 1], [30 * (index + 1), -30 * (index + 1)]) 
              }}
            >
              <ProductCard product={product} featured />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RewardsTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const x2 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const cardY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section ref={ref} className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          style={{ y: cardY }}
          className="glass rounded-3xl p-8 md:p-16 relative overflow-hidden"
        >
          <motion.div
            style={{ x }}
            className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ x: x2 }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-christmas/10 rounded-full blur-3xl"
          />
          
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Sip. Earn.
                <span className="text-gradient-gold"> Repeat.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join our rewards program and earn credits with every purchase.
                100 credits = $5 off your next order.
              </p>
              <Link to="/signup">
                <Button size="lg" className="btn-gold">
                  Join Rewards
                  <Award className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '1 credit', label: 'Per $1 spent' },
                { value: '50', label: 'Signup bonus' },
                { value: '2x', label: 'This week' },
                { value: 'Free', label: 'To join' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  style={{ 
                    y: useTransform(scrollYProgress, [0, 1], [10 * (i + 1), -10 * (i + 1)]) 
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-card p-6 rounded-xl text-center shadow-lg"
                >
                  <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function WhyUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const features = [
    {
      icon: Coffee,
      title: 'Premium Beans',
      description: 'Hand-selected from the world\'s finest coffee regions.',
    },
    {
      icon: Leaf,
      title: 'Sustainably Sourced',
      description: 'Ethically traded, environmentally conscious.',
    },
    {
      icon: Award,
      title: 'Expert Roasters',
      description: 'Decades of expertise in every batch.',
    },
    {
      icon: Gift,
      title: 'Perfect Gifts',
      description: 'Curated collections for every occasion.',
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [40, 0]) }}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Why Café 1%?
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Every cup tells a story of passion, quality, and care.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{ y: useTransform(scrollYProgress, [0, 1], [20 * (index + 1), -20 * (index + 1)]) }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-gold" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-primary-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SustainabilitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent"
      />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              style={{ scale: imageScale }}
              className="aspect-square rounded-3xl bg-gradient-to-br from-green-900/20 to-gold/20 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="w-48 h-48 border-4 border-dashed border-gold/30 rounded-full"
                />
                <Leaf className="absolute w-24 h-24 text-gold/50" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
              🌱 Sustainability
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ethically Sourced,
              <span className="text-gradient-gold block">Expertly Roasted</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We partner directly with farmers around the world, ensuring fair wages and sustainable practices. 
              Every bean tells a story of community, quality, and care for our planet.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '100%', label: 'Fair Trade' },
                { value: '15+', label: 'Partner Farms' },
                { value: '0', label: 'Carbon Footprint' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-secondary rounded-xl"
                >
                  <div className="text-2xl font-bold text-gold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
