import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartItem, cartTotal } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-foreground/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[101] bg-card shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Your Cart
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground mb-4">Your cart is empty</p>
                    <Link to="/shop" onClick={onClose}>
                      <Button className="btn-gold">Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => {
                      const sizeMultiplier = item.size === 'S' ? 1 : item.size === 'M' ? 1.25 : 1.5;
                      const itemPrice = item.product.price * sizeMultiplier;

                      return (
                        <motion.div
                          key={index}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="flex gap-4 p-3 bg-secondary rounded-lg"
                        >
                          <img
                            src={item.product.main_image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{item.product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.size} • {item.milk} milk
                            </p>
                            <p className="font-semibold text-gold">
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeFromCart(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateCartItem(index, { ...item, quantity: item.quantity - 1 });
                                  }
                                }}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  updateCartItem(index, { ...item, quantity: item.quantity + 1 });
                                }}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-gold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <Link to="/checkout" onClick={onClose} className="block">
                    <Button className="w-full btn-gold py-6 text-lg">
                      Checkout
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
