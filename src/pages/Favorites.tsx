import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/components/layout/PageTransition';

const Favorites = () => {
  const { wishlist } = useStore();

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-8 pb-24">
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-christmas/10 mb-4">
                <Heart className="w-8 h-8 text-christmas" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Your Favorites
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {wishlist.length > 0 
                  ? 'Your collection of favorite drinks, ready to order anytime.'
                  : 'Save your favorite drinks for quick access later.'}
              </p>
            </motion.div>

            {wishlist.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-3">No favorites yet</h2>
                  <p className="text-muted-foreground mb-6">
                    Explore our menu and tap the heart icon on drinks you love to add them here.
                  </p>
                  <Link to="/shop">
                    <Button className="btn-gold" size="lg">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Browse Menu
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Favorites;