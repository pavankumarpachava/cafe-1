import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Award, ArrowRight, Coffee, Truck, Store, Car } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!orderDetails) {
    return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-semibold mb-4">No order found</h1>
            <p className="text-muted-foreground mb-6">It looks like you haven't placed an order yet.</p>
            <Link to="/shop">
              <Button className="btn-gold">Start Shopping</Button>
            </Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const getFulfillmentIcon = () => {
    switch (orderDetails.fulfillmentMethod) {
      case 'delivery': return <Truck className="w-5 h-5" />;
      case 'pickup': return <Store className="w-5 h-5" />;
      case 'drivethru': return <Car className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getFulfillmentText = () => {
    switch (orderDetails.fulfillmentMethod) {
      case 'delivery': return 'Delivery • 15-30 min';
      case 'pickup': return 'In-Store Pickup • 5-10 min';
      case 'drivethru': return 'Drive-Thru • 5-10 min';
      default: return 'Order Processing';
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <Navbar />
        
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#D4AF37', '#C62828', '#4A2F22', '#F5E8D3'][Math.floor(Math.random() * 4)],
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        <main className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              {/* Success Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-display font-bold mb-3"
                >
                  Order Confirmed!
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-lg"
                >
                  Thank you for your order. Your coffee is being prepared with love.
                </motion.p>
              </div>

              {/* Order Card */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-lg mb-6"
              >
                {/* Order ID & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                    <p className="font-mono text-xl font-semibold">#{orderDetails.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-full">
                    {getFulfillmentIcon()}
                    <span className="font-medium text-sm">{getFulfillmentText()}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="py-6 border-b">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-gold" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {orderDetails.items.map((item: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                            <img
                              src={item.product.main_image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="py-6 border-b space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${orderDetails.subtotal?.toFixed(2) || orderDetails.total?.toFixed(2)}</span>
                  </div>
                  {orderDetails.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (MA 6.25% on cold drinks)</span>
                      <span>${orderDetails.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetails.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetails.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${orderDetails.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2">
                    <span>Total Paid</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Credits Earned */}
                {orderDetails.creditsEarned > 0 && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="py-6 flex items-center justify-between bg-gradient-to-r from-gold/10 to-gold/5 -mx-6 md:-mx-8 px-6 md:px-8 rounded-b-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold">Credits Earned</p>
                        <p className="text-sm text-muted-foreground">Use them on your next order!</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gold">+{orderDetails.creditsEarned}</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Guest User Prompt */}
              {orderDetails.isGuest && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-r from-gold/20 to-christmas-red/20 rounded-xl p-6 mb-6 text-center"
                >
                  <h3 className="font-semibold mb-2">Create an account to earn rewards!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign up now to save your order history and earn credits on every purchase.
                  </p>
                  <Link to="/signup">
                    <Button className="btn-gold">
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to={`/order/${orderDetails.id}`} className="flex-1">
                  <Button className="w-full btn-gold py-6" size="lg">
                    <Package className="w-5 h-5 mr-2" />
                    Track Order
                  </Button>
                </Link>
                <Link to="/shop" className="flex-1">
                  <Button variant="outline" className="w-full py-6" size="lg">
                    Continue Shopping
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default OrderSuccess;
