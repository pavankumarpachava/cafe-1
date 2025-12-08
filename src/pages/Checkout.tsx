import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, CreditCard, Award, CheckCircle, Store, Car, Truck, Snowflake, Flame } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AuthModal } from '@/components/auth/AuthModal';
import { isProductCold, MA_COLD_BEVERAGE_TAX_RATE } from '@/data/products';

type FulfillmentMethod = 'delivery' | 'pickup' | 'drivethru';

const DELIVERY_FEE = 3.99;

const Checkout = () => {
  const { cart, cartTotal, user, isAuthenticated, placeOrder, removeFromCart } = useStore();
  const [useCredits, setUseCredits] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [carDetails, setCarDetails] = useState({ model: '', color: '' });
  const navigate = useNavigate();

  // Calculate tax based on MA rules (only cold drinks are taxed)
  const taxCalculation = useMemo(() => {
    let hotSubtotal = 0;
    let coldSubtotal = 0;

    cart.forEach(item => {
      const sizeMultiplier = item.size === 'S' ? 1 : item.size === 'M' ? 1.25 : 1.5;
      const itemPrice = item.product.price * sizeMultiplier * item.quantity;
      
      if (isProductCold(item.product.id)) {
        coldSubtotal += itemPrice;
      } else {
        hotSubtotal += itemPrice;
      }
    });

    const coldTax = coldSubtotal * MA_COLD_BEVERAGE_TAX_RATE;
    
    return {
      hotSubtotal,
      coldSubtotal,
      coldTax,
      totalTax: coldTax,
    };
  }, [cart]);

  const deliveryFee = fulfillmentMethod === 'delivery' ? DELIVERY_FEE : 0;
  const discountAmount = discountApplied ? cartTotal * 0.1 : 0; // 10% discount
  const creditsDiscount = useCredits && user ? Math.min(user.credits, cartTotal) : 0;
  
  const subtotal = cartTotal;
  const finalTotal = Math.max(0, subtotal + taxCalculation.totalTax + deliveryFee - discountAmount - creditsDiscount);
  const creditsEarned = Math.floor(finalTotal);

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME20' || discountCode.toUpperCase() === 'CAFE10') {
      setDiscountApplied(true);
    }
  };

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const order = placeOrder(useCredits, fulfillmentMethod);
    if (order) {
      setOrderDetails({
        ...order,
        total: finalTotal,
        tax: taxCalculation.totalTax,
        deliveryFee,
        discountAmount,
      });
      setOrderPlaced(true);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
            <Link to="/shop">
              <Button className="btn-gold">Continue Shopping</Button>
            </Link>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <PageTransition>
        <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold mb-4">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Your coffee is being prepared.
            </p>
            
            <div className="bg-card rounded-xl p-6 mb-6 text-left space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono text-lg">#{orderDetails.id.slice(0, 8)}</p>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
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
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-gold pt-2">
                <span>Credits earned</span>
                <span className="font-semibold">+{orderDetails.creditsEarned}</span>
              </div>

              <div className="bg-secondary rounded-lg p-4 mt-4">
                <p className="font-medium mb-1">
                  {fulfillmentMethod === 'delivery' ? 'Delivery' : fulfillmentMethod === 'pickup' ? 'Pickup' : 'Drive-Thru'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {fulfillmentMethod === 'delivery' 
                    ? 'Your order will be delivered in 15-30 minutes'
                    : 'Your order will be ready in 5-10 minutes at Café 1% - Downtown'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to={`/order/${orderDetails.id}`}>
                <Button className="w-full btn-gold">Track Order</Button>
              </Link>
              <div className="flex gap-4">
                <Link to="/profile" className="flex-1">
                  <Button variant="outline" className="w-full">View Order History</Button>
                </Link>
                <Link to="/shop" className="flex-1">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
      <Navbar />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cart.map((item, index) => {
                    const sizeMultiplier = item.size === 'S' ? 1 : item.size === 'M' ? 1.25 : 1.5;
                    const itemPrice = item.product.price * sizeMultiplier * item.quantity;
                    const isCold = isProductCold(item.product.id);

                    return (
                      <div key={index} className="flex gap-4 p-4 bg-secondary rounded-lg">
                        <img
                          src={item.product.main_image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.product.name}</h3>
                            {isCold ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                <Snowflake className="w-3 h-3" />
                                Cold
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                                <Flame className="w-3 h-3" />
                                Hot
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.size} • {item.milk} milk • {item.sweetness}% sweet
                          </p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${itemPrice.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fulfillment Method */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Fulfillment Method</h2>
                <RadioGroup
                  value={fulfillmentMethod}
                  onValueChange={(value) => setFulfillmentMethod(value as FulfillmentMethod)}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                    <Label
                      htmlFor="delivery"
                      className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 hover:bg-secondary/80 transition-all"
                    >
                      <Truck className="w-8 h-8 mb-2 text-gold" />
                      <span className="font-medium">Delivery</span>
                      <span className="text-xs text-muted-foreground">15-30 min</span>
                      <span className="text-xs text-gold mt-1">${DELIVERY_FEE.toFixed(2)}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                    <Label
                      htmlFor="pickup"
                      className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 hover:bg-secondary/80 transition-all"
                    >
                      <Store className="w-8 h-8 mb-2 text-gold" />
                      <span className="font-medium">In-Store</span>
                      <span className="text-xs text-muted-foreground">5-10 min</span>
                      <span className="text-xs text-green-600 mt-1">Free</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="drivethru" id="drivethru" className="peer sr-only" />
                    <Label
                      htmlFor="drivethru"
                      className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 hover:bg-secondary/80 transition-all"
                    >
                      <Car className="w-8 h-8 mb-2 text-gold" />
                      <span className="font-medium">Drive-Thru</span>
                      <span className="text-xs text-muted-foreground">5-10 min</span>
                      <span className="text-xs text-green-600 mt-1">Free</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Delivery Address */}
              {fulfillmentMethod === 'delivery' && (
                <div className="bg-card rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      <Input className="mt-2" placeholder="John" defaultValue={user?.name?.split(' ')[0] || ''} />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input className="mt-2" placeholder="Doe" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Address</Label>
                      <Input className="mt-2" placeholder="123 Coffee Street" />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input className="mt-2" placeholder="Boston" />
                    </div>
                    <div>
                      <Label>ZIP Code</Label>
                      <Input className="mt-2" placeholder="02101" />
                    </div>
                  </div>
                </div>
              )}

              {/* Store Location */}
              {(fulfillmentMethod === 'pickup' || fulfillmentMethod === 'drivethru') && (
                <div className="bg-card rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {fulfillmentMethod === 'pickup' ? 'Pickup Location' : 'Drive-Thru Location'}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-gold/10 border-2 border-gold rounded-lg">
                      <Store className="w-6 h-6 text-gold" />
                      <div>
                        <p className="font-medium">Café 1% - Downtown Boston</p>
                        <p className="text-sm text-muted-foreground">123 Main Street, Boston, MA 02101</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                      <Store className="w-6 h-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Café 1% - Back Bay</p>
                        <p className="text-sm text-muted-foreground">456 Newbury Street, Boston, MA 02116</p>
                      </div>
                    </div>
                  </div>

                  {fulfillmentMethod === 'drivethru' && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-medium mb-4">Vehicle Details (Optional)</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Car Model</Label>
                          <Input 
                            className="mt-2" 
                            placeholder="e.g., Toyota Camry"
                            value={carDetails.model}
                            onChange={(e) => setCarDetails(prev => ({ ...prev, model: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Car Color</Label>
                          <Input 
                            className="mt-2" 
                            placeholder="e.g., Silver"
                            value={carDetails.color}
                            onChange={(e) => setCarDetails(prev => ({ ...prev, color: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 bg-gold/10 border-2 border-gold rounded-lg">
                  <CreditCard className="w-6 h-6 text-gold" />
                  <div>
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-muted-foreground">**** **** **** 4242</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {/* Hot vs Cold breakdown */}
                  {taxCalculation.hotSubtotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        Hot drinks
                      </span>
                      <span>${taxCalculation.hotSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {taxCalculation.coldSubtotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Snowflake className="w-3 h-3 text-blue-500" />
                        Cold drinks
                      </span>
                      <span>${taxCalculation.coldSubtotal.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {/* MA Tax */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (MA 6.25% on cold drinks)</span>
                    <span>${taxCalculation.totalTax.toFixed(2)}</span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {fulfillmentMethod === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                    </span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                      {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  {/* Discount Code */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      disabled={discountApplied}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyDiscount}
                      disabled={discountApplied || !discountCode}
                    >
                      {discountApplied ? 'Applied' : 'Apply'}
                    </Button>
                  </div>

                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Use Credits */}
                  {isAuthenticated && user && user.credits > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gold/10 rounded-lg">
                      <Checkbox
                        id="useCredits"
                        checked={useCredits}
                        onCheckedChange={(checked) => setUseCredits(checked as boolean)}
                      />
                      <label htmlFor="useCredits" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gold" />
                          <span className="text-sm font-medium">
                            Use {user.credits} credits
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Save ${Math.min(user.credits, subtotal).toFixed(2)}
                        </p>
                      </label>
                    </div>
                  )}

                  {creditsDiscount > 0 && (
                    <div className="flex justify-between text-gold">
                      <span>Credits discount</span>
                      <span>-${creditsDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-gold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    You'll earn {creditsEarned} credits
                  </div>
                </div>

                <Button
                  className="w-full btn-gold py-6 text-lg"
                  onClick={handlePlaceOrder}
                >
                  {isAuthenticated ? 'Place Order' : 'Sign in to Order'}
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You need to sign in to complete your order and earn rewards.
                  </p>
                )}

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing this order, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handlePlaceOrder}
      />
    </div>
    </PageTransition>
  );
};

export default Checkout;