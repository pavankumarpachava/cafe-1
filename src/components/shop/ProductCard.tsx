import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured }: ProductCardProps) {
  const { addToCart } = useStore();

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

  return (
    <Link to={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className={`group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
          featured ? 'border-2 border-gold/20' : ''
        }`}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.main_image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
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
