import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Leaf, Award, Coffee, Play } from 'lucide-react';
import heroImage from '@/assets/hero-christmas-coffee.jpg';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/shop/ProductCard';
import { products, christmasProducts } from '@/data/products';

// Snowflake component
function Snowflake({ delay, left }: { delay: number; left: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-card/80 rounded-full pointer-events-none"
      style={{ left: `${left}%` }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: '100vh',
        opacity: [0, 1, 1, 0],
        x: [0, 20, -10, 15],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    delay: i * 0.3,
    left: Math.random() * 100,
  }));

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <img
          src={heroImage}
          alt="Christmas coffee"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      </motion.div>

      {/* Snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowflakes.map((sf, i) => (
          <Snowflake key={i} delay={sf.delay} left={sf.left} />
        ))}
      </div>

      {/* Content with parallax */}
      <motion.div
        style={{ opacity, y: textY }}
        className="relative h-full flex items-center"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-christmas/90 text-christmas-foreground rounded-full"
            >
              ✨ Holiday Season Special
            </motion.span>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
              Brew the
              <span className="block text-gradient-gold">Moment.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-lg">
              Warm. Bold. Yours. Experience the magic of Christmas in every sip.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="btn-gold text-lg px-8 py-6 group">
                  Explore Menu
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/shop?category=Christmas">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                  <Gift className="mr-2 w-5 h-5" />
                  Christmas Specials
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center"
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

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
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
          style={{ y }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl group"
        >
          {/* Video placeholder with parallax effect */}
          <div className="relative aspect-video bg-gradient-to-br from-espresso to-primary">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            {/* Coffee steam animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-32 h-32 bg-card/10 rounded-full blur-2xl"
              />
            </div>

            {/* Play button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-gold transition-colors">
                <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </motion.button>

            {/* Decorative text */}
            <div className="absolute bottom-8 left-8 text-card">
              <p className="text-sm font-medium opacity-70">Watch Now</p>
              <p className="text-2xl font-display font-bold">Crafting Excellence</p>
            </div>
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
            className="absolute -top-6 -right-6 w-24 h-24 bg-christmas/20 rounded-full blur-xl"
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
            className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/20 rounded-full blur-xl"
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

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const featured = products.slice(0, 4);

  return (
    <section ref={ref} className="py-24 bg-secondary relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
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
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop">
            <Button variant="outline" size="lg" className="group">
              View All Drinks
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
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

  const decorY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section ref={ref} className="py-24 bg-christmas/5 relative overflow-hidden">
      {/* Parallax decorative elements */}
      <motion.div
        style={{ y: decorY }}
        className="absolute top-0 left-0 w-64 h-64 bg-christmas/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: decorY2 }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
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
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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

  const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const x2 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="py-24">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-8 md:p-16 relative overflow-hidden">
          <motion.div
            style={{ x }}
            className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
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
              style={{ x: x2 }}
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
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-card p-6 rounded-xl text-center shadow-lg"
                >
                  <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
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

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

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
        style={{ y }}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Why Coffee Store?
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Every cup tells a story of passion, quality, and care.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors"
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