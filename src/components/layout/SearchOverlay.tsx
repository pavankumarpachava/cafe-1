import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(products.slice(0, 6));

  useEffect(() => {
    if (query) {
      const filtered = products.filter(
        p => p.name.toLowerCase().includes(query.toLowerCase()) ||
             p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 8));
    } else {
      setResults(products.slice(0, 6));
    }
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end mb-8">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search our menu..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-16 pl-14 text-xl bg-secondary border-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary transition-colors group"
                    >
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-medium group-hover:text-gold transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.category} • ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {query && results.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No results found for "{query}"
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
