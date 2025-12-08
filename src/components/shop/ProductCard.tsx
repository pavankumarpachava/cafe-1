import { useState, useMemo, useRef, useCallback } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Randomly select initial image on mount
  const randomInitialIndex = useMemo(() => {
    return Math.floor(Math.random() * (product.images?.length || 1));
  }, [product.id]);

  const images = product.images || [product.main_image];
  const displayImage = images[isHovering ? currentImageIndex : randomInitialIndex] || product.main_image;
  const inWishlist = isInWishlist(product.id);

  // 3D Tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setTilt({ rotateX, rotateY });

    // Image scroll on hover
    if (images.length > 1) {
      const percentage = x / rect.width;
      const newIndex = Math.min(Math.floor(percentage * images.length), images.length - 1);
      setCurrentImageIndex(newIndex);
    }
  }, [images.length]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setCurrentImageIndex(0);
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

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

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className={`group bg-card rounded-2xl overflow-hidden ${
          featured ? 'border-2 border-gold/20' : ''
        }`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1})`,
          transition: 'transform 0.3s cubic-bezier(0.03, 0.98, 0.52, 0.99), box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
          boxShadow: isHovering 
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 40px rgba(212, 175, 55, 0.15)' 
            : '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="relative aspect-square overflow-hidden">
          {/* Cinematic gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-[1] pointer-events-none"
            animate={{ opacity: isHovering ? 0.5 : 0.2 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Glare effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.rotateY * 3}% ${50 - tilt.rotateX * 3}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              opacity: isHovering ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
          
          <motion.img
            key={displayImage}
            src={displayImage}
            alt={product.name}
            loading="lazy"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ 
              opacity: 1, 
              scale: isHovering ? 1.12 : 1,
            }}
            transition={{ 
              opacity: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
              scale: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
            }}
            className="w-full h-full object-cover"
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-[2]"
            initial={{ x: "-100%" }}
            animate={{ x: isHovering ? "200%" : "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Image indicator dots */}
          {images.length > 1 && isHovering && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
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
            style={{ transform: 'translateZ(20px)' }}
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
            animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
            className="absolute bottom-4 right-4 z-10"
            style={{ transform: 'translateZ(20px)' }}
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
          <div className="absolute top-4 left-4" style={{ transform: 'translateZ(20px)' }}>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              product.category === 'Christmas'
                ? 'bg-christmas text-christmas-foreground'
                : 'bg-card/90 backdrop-blur-sm text-card-foreground'
            }`}>
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-5" style={{ transform: 'translateZ(10px)' }}>
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