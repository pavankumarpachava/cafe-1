import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  Coffee, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/context/StoreContext';

type OrderStatus = 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered';

interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: typeof Package;
  time?: string;
}

const trackingSteps: TrackingStep[] = [
  { 
    status: 'confirmed', 
    label: 'Order Confirmed', 
    description: 'We\'ve received your order',
    icon: CheckCircle2 
  },
  { 
    status: 'preparing', 
    label: 'Preparing', 
    description: 'Your coffee is being crafted',
    icon: Coffee 
  },
  { 
    status: 'ready', 
    label: 'Ready', 
    description: 'Your order is ready for pickup/delivery',
    icon: Package 
  },
  { 
    status: 'out_for_delivery', 
    label: 'Out for Delivery', 
    description: 'On the way to you',
    icon: Truck 
  },
  { 
    status: 'delivered', 
    label: 'Delivered', 
    description: 'Enjoy your coffee!',
    icon: CheckCircle2 
  },
];

const statusOrder: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];

function OrderTracking() {
  const { orderId } = useParams();
  const { orders } = useStore();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('confirmed');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const order = orders.find(o => o.id === orderId);

  // Simulate real-time status updates
  useEffect(() => {
    if (!order) return;

    const statusProgression = setInterval(() => {
      setCurrentStatus(prev => {
        const currentIndex = statusOrder.indexOf(prev);
        if (currentIndex < statusOrder.length - 1) {
          return statusOrder[currentIndex + 1];
        }
        clearInterval(statusProgression);
        return prev;
      });
      setEstimatedTime(prev => Math.max(0, prev - 5));
    }, 8000); // Progress every 8 seconds for demo

    return () => clearInterval(statusProgression);
  }, [order]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const currentStepIndex = statusOrder.indexOf(currentStatus);

  if (!order) {
    return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />
          <main className="py-24">
            <div className="container mx-auto px-4 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
              <p className="text-muted-foreground mb-8">
                We couldn't find an order with that ID.
              </p>
              <Link to="/profile/orders">
                <Button>View Your Orders</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link 
                  to="/profile/orders" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Orders
                </Link>
                <h1 className="text-3xl font-display font-bold">Track Your Order</h1>
                <p className="text-muted-foreground">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Status Card */}
            <Card className="mb-8 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gold/20 to-christmas/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {trackingSteps[currentStepIndex].label}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {trackingSteps[currentStepIndex].description}
                    </p>
                  </div>
                  <Badge className="bg-gold text-gold-foreground">
                    {currentStatus === 'delivered' ? 'Complete' : 'In Progress'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                {/* Estimated Time */}
                {currentStatus !== 'delivered' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-8 p-4 bg-secondary rounded-lg"
                  >
                    <Clock className="w-5 h-5 text-gold" />
                    <span className="font-medium">Estimated time:</span>
                    <span className="text-gold font-bold">{estimatedTime} minutes</span>
                  </motion.div>
                )}

                {/* Progress Steps */}
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />
                  <motion.div 
                    className="absolute left-6 top-6 w-0.5 bg-gold origin-top"
                    initial={{ height: 0 }}
                    animate={{ 
                      height: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` 
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />

                  {/* Steps */}
                  <div className="space-y-8">
                    {trackingSteps.map((step, index) => {
                      const isCompleted = index <= currentStepIndex;
                      const isCurrent = index === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <motion.div
                          key={step.status}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <motion.div
                            animate={{
                              scale: isCurrent ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: isCurrent ? Infinity : 0,
                            }}
                            className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-gold text-gold-foreground' 
                                : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                            {isCurrent && (
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-gold"
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </motion.div>
                          <div className="flex-1 pt-2">
                            <h3 className={`font-semibold ${
                              isCompleted ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            {isCompleted && index < currentStepIndex && (
                              <p className="text-xs text-gold mt-1">
                                Completed {new Date().toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-gold" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    {order.creditsUsed > 0 && (
                      <div className="flex justify-between items-center text-gold">
                        <span>Credits Applied</span>
                        <span>-${order.creditsUsed.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg mt-2">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {order.creditsEarned > 0 && (
                    <div className="p-3 bg-gold/10 rounded-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-gold">
                          +{order.creditsEarned} Credits Earned!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Use them on your next order
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Location */}
            <Card className="mt-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-christmas/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-christmas" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Delivery Address</h3>
                    <p className="text-muted-foreground">
                      123 Coffee Street, Brewville, CA 90210
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}

export default OrderTracking;
