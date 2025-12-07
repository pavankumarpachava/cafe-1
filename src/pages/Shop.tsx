import { useState, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { products, categories } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageTransition } from '@/components/layout/PageTransition';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('popular');
  const { wishlist } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const headerScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  
  const selectedCategory = searchParams.get('category') || 'all';

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <PageTransition>
      <div className="min-h-screen" ref={containerRef}>
        <Navbar />
        <main className="pt-8 pb-24 overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Parallax Header */}
            <motion.div
              style={{ y: headerY, opacity: headerOpacity, scale: headerScale }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12 relative"
            >
              {/* Decorative background elements with parallax */}
              <motion.div 
                className="absolute -top-20 left-1/4 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none"
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
              />
              <motion.div 
                className="absolute -top-10 right-1/4 w-40 h-40 bg-christmas/5 rounded-full blur-3xl pointer-events-none"
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
              />
              
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 relative z-10">
                {selectedCategory === 'all' ? 'Our Menu' : selectedCategory}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto relative z-10">
                Discover your perfect cup from our carefully curated selection.
              </p>
            </motion.div>

            {/* Filters with subtle parallax */}
            <motion.div 
              className="flex flex-wrap gap-4 mb-8 items-center justify-between sticky top-20 z-30 py-4 bg-background/80 backdrop-blur-md -mx-4 px-4 border-b border-border/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange('all')}
                  className={selectedCategory === 'all' ? 'btn-gold' : ''}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => handleCategoryChange(category)}
                    className={selectedCategory === category ? 'btn-gold' : ''}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link to="/favorites">
                  <Button variant="outline" className="relative">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                    {wishlist.length > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-christmas text-christmas-foreground text-xs rounded-full flex items-center justify-center">
                        {wishlist.length}
                      </span>
                    )}
                  </Button>
                </Link>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>

            {/* Products Grid with staggered parallax */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ y: 60, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    delay: (index % 4) * 0.1,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  style={{
                    transformOrigin: "center bottom"
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground text-lg">
                  No products found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Shop;
