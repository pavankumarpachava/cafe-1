import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, CreditCard, Award, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Checkout = () => {
  const { cart, cartTotal, user, isAuthenticated, placeOrder, removeFromCart } = useStore();
  const [useCredits, setUseCredits] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigate = useNavigate();

  const creditsDiscount = useCredits && user ? Math.min(user.credits, cartTotal) : 0;
  const finalTotal = Math.max(0, cartTotal - creditsDiscount);
  const creditsEarned = Math.floor(finalTotal);

  const handlePlaceOrder = () => {
    const order = placeOrder(useCredits);
    if (order) {
      setOrderDetails(order);
      setOrderPlaced(true);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
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
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold mb-4">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. Your coffee is being prepared.
            </p>
            <div className="bg-card rounded-xl p-6 mb-6 text-left">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="font-mono mb-4">#{orderDetails.id.slice(0, 8)}</p>
              <div className="flex justify-between mb-2">
                <span>Total</span>
                <span className="font-semibold">${orderDetails.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gold">
                <span>Credits earned</span>
                <span className="font-semibold">+{orderDetails.creditsEarned}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link to="/profile" className="flex-1">
                <Button variant="outline" className="w-full">View Orders</Button>
              </Link>
              <Link to="/shop" className="flex-1">
                <Button className="w-full btn-gold">Continue Shopping</Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
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

                    return (
                      <div key={index} className="flex gap-4 p-4 bg-secondary rounded-lg">
                        <img
                          src={item.product.main_image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
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

              {/* Shipping Info */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input className="mt-2" placeholder="John" />
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
                    <Input className="mt-2" placeholder="New York" />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input className="mt-2" placeholder="10001" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
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
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  {/* Discount Code */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>

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
                          Save ${Math.min(user.credits, cartTotal).toFixed(2)}
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
                  Place Order
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing this order, you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
