import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured }: ProductCardProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Randomly select initial image on mount
  const randomInitialIndex = useMemo(() => {
    return Math.floor(Math.random() * (product.images?.length || 1));
  }, [product.id]);

  const images = product.images || [product.main_image];
  const displayImage = images[isHovering ? currentImageIndex : randomInitialIndex] || product.main_image;
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      product,
      quantity: 1,
      size: 'M',
      milk: 'whole',
      sweetness: 50,
      ice: 'regular',
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast({
      title: inWishlist ? 'Removed from favorites' : 'Added to favorites',
      description: inWishlist 
        ? `${product.name} removed from your favorites.`
        : `${product.name} added to your favorites.`,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering || images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newIndex = Math.min(Math.floor(percentage * images.length), images.length - 1);
    setCurrentImageIndex(newIndex);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className={`group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
          featured ? 'border-2 border-gold/20' : ''
        }`}
      >
        <div 
          className="relative aspect-square overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setCurrentImageIndex(0);
          }}
          onMouseMove={handleMouseMove}
        >
          <motion.img
            key={displayImage}
            src={displayImage}
            alt={product.name}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Image indicator dots */}
          {images.length > 1 && isHovering && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-gold w-3' : 'bg-card/60'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Wishlist Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-lg hover:bg-card transition-colors z-10"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                inWishlist ? 'fill-christmas text-christmas' : 'text-muted-foreground hover:text-christmas'
              }`} 
            />
          </motion.button>

          {/* Quick Add Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              size="icon"
              className="btn-gold rounded-full w-12 h-12 shadow-lg"
              onClick={handleQuickAdd}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              product.category === 'Christmas'
                ? 'bg-christmas text-christmas-foreground'
                : 'bg-card/90 backdrop-blur-sm text-card-foreground'
            }`}>
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gold">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex gap-1">
              {product.tastingNotes?.slice(0, 2).map((note) => (
                <span
                  key={note}
                  className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}