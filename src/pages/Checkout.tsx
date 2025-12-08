import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Trash2, CreditCard, Award, Store, Car, Truck, 
  Snowflake, Flame, Check, ChevronRight, Loader2, Apple, Wallet
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckoutSkeleton } from '@/components/ui/skeleton-loader';
import { isProductCold, MA_COLD_BEVERAGE_TAX_RATE } from '@/data/products';

type FulfillmentMethod = 'delivery' | 'pickup' | 'drivethru';
type PaymentMethod = 'card' | 'apple-pay' | 'google-pay';
type CheckoutStep = 1 | 2 | 3;

const DELIVERY_FEE = 3.99;

interface DeliveryFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

interface CardFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingZip: string;
  saveCard: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const Checkout = () => {
  const { cart, cartTotal, user, isAuthenticated, isGuest, placeOrder, removeFromCart, isLoading, addCard } = useStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [useCredits, setUseCredits] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [carDetails, setCarDetails] = useState({ model: '', color: '' });
  const navigate = useNavigate();

  // Form states
  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormData>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const [cardForm, setCardForm] = useState<CardFormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingZip: '',
    saveCard: false,
  });

  const [deliveryErrors, setDeliveryErrors] = useState<FormErrors>({});
  const [cardErrors, setCardErrors] = useState<FormErrors>({});

  // Redirect to login if not authenticated and not guest
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isGuest) {
      navigate('/login?next=/checkout');
    }
  }, [isAuthenticated, isGuest, isLoading, navigate]);

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
  const discountAmount = discountApplied ? cartTotal * 0.1 : 0;
  const creditsDiscount = useCredits && user ? Math.min(user.credits, cartTotal) : 0;
  
  const subtotal = cartTotal;
  const finalTotal = Math.max(0, subtotal + taxCalculation.totalTax + deliveryFee - discountAmount - creditsDiscount);
  const creditsEarned = isAuthenticated ? Math.floor(finalTotal) : 0;

  // Validation functions
  const validateDeliveryForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (fulfillmentMethod === 'delivery') {
      if (!deliveryForm.firstName.trim()) errors.firstName = 'First name is required';
      if (!deliveryForm.lastName.trim()) errors.lastName = 'Last name is required';
      if (!deliveryForm.address.trim()) errors.address = 'Address is required';
      if (!deliveryForm.city.trim()) errors.city = 'City is required';
      if (!deliveryForm.zipCode.trim()) errors.zipCode = 'ZIP code is required';
      else if (!/^\d{5}(-\d{4})?$/.test(deliveryForm.zipCode)) errors.zipCode = 'Invalid ZIP code';
      if (!deliveryForm.phone.trim()) errors.phone = 'Phone number is required';
      else if (!/^\d{10,}$/.test(deliveryForm.phone.replace(/\D/g, ''))) errors.phone = 'Invalid phone number';
    }
    
    setDeliveryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateCardForm = (): boolean => {
    if (paymentMethod !== 'card') return true;
    
    const errors: FormErrors = {};
    
    if (!cardForm.cardholderName.trim()) errors.cardholderName = 'Cardholder name is required';
    if (!cardForm.cardNumber.trim()) errors.cardNumber = 'Card number is required';
    else if (cardForm.cardNumber.replace(/\s/g, '').length !== 16) errors.cardNumber = 'Invalid card number';
    if (!cardForm.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) errors.expiryDate = 'Invalid format (MM/YY)';
    if (!cardForm.cvv.trim()) errors.cvv = 'CVV is required';
    else if (!/^\d{3,4}$/.test(cardForm.cvv)) errors.cvv = 'Invalid CVV';
    if (!cardForm.billingZip.trim()) errors.billingZip = 'Billing ZIP is required';
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME20' || discountCode.toUpperCase() === 'CAFE10') {
      setDiscountApplied(true);
    }
  };

  const handleContinueToPayment = () => {
    if (validateDeliveryForm()) {
      setCurrentStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateCardForm()) return;
    
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save card if requested
    if (cardForm.saveCard && isAuthenticated) {
      const last4 = cardForm.cardNumber.replace(/\s/g, '').slice(-4);
      const [month, year] = cardForm.expiryDate.split('/');
      addCard({
        type: cardForm.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
        lastFour: last4,
        expiryMonth: month,
        expiryYear: `20${year}`,
        isDefault: false,
      });
    }
    
    const order = placeOrder(useCredits, fulfillmentMethod);
    
    if (order) {
      const orderDetails = {
        ...order,
        total: finalTotal,
        subtotal: subtotal,
        tax: taxCalculation.totalTax,
        deliveryFee,
        discountAmount,
        isGuest: isGuest && !isAuthenticated,
        fulfillmentMethod,
        deliveryAddress: fulfillmentMethod === 'delivery' ? deliveryForm : null,
      };
      
      setIsProcessingPayment(false);
      navigate('/order/success', { state: { orderDetails } });
    }
  };

  const handleDigitalPayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate digital payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const order = placeOrder(useCredits, fulfillmentMethod);
    
    if (order) {
      const orderDetails = {
        ...order,
        total: finalTotal,
        subtotal: subtotal,
        tax: taxCalculation.totalTax,
        deliveryFee,
        discountAmount,
        isGuest: isGuest && !isAuthenticated,
        fulfillmentMethod,
        paymentMethod: paymentMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay',
      };
      
      setIsProcessingPayment(false);
      navigate('/order/success', { state: { orderDetails } });
    }
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <CheckoutSkeleton />
        <Footer />
      </div>
    );
  }

  // Redirect check - show nothing while redirecting
  if (!isAuthenticated && !isGuest) {
    return null;
  }

  if (cart.length === 0) {
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

  const isDeliveryValid = fulfillmentMethod !== 'delivery' || 
    (deliveryForm.firstName && deliveryForm.lastName && deliveryForm.address && 
     deliveryForm.city && deliveryForm.zipCode && deliveryForm.phone);

  return (
    <div className="min-h-screen">
        <Navbar />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>

            <h1 className="text-3xl font-display font-bold mb-6">Checkout</h1>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => step < currentStep && setCurrentStep(step as CheckoutStep)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-all ${
                      currentStep >= step 
                        ? 'bg-gold text-white' 
                        : 'bg-secondary text-muted-foreground'
                    } ${step < currentStep ? 'cursor-pointer hover:opacity-80' : ''}`}
                    disabled={step >= currentStep}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </button>
                  <span className={`ml-2 text-sm font-medium ${currentStep >= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step === 1 ? 'Delivery' : 'Payment'}
                  </span>
                  {step < 2 && <ChevronRight className="w-4 h-4 mx-4 text-muted-foreground" />}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Delivery Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Order Items */}
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
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                className={`mt-2 ${deliveryErrors.firstName ? 'border-destructive' : ''}`}
                                placeholder="John"
                                value={deliveryForm.firstName}
                                onChange={(e) => setDeliveryForm(prev => ({ ...prev, firstName: e.target.value }))}
                              />
                              {deliveryErrors.firstName && (
                                <p className="text-xs text-destructive mt-1">{deliveryErrors.firstName}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                id="lastName"
                                className={`mt-2 ${deliveryErrors.lastName ? 'border-destructive' : ''}`}
                                placeholder="Doe"
                                value={deliveryForm.lastName}
                                onChange={(e) => setDeliveryForm(prev => ({ ...prev, lastName: e.target.value }))}
                              />
                              {deliveryErrors.lastName && (
                                <p className="text-xs text-destructive mt-1">{deliveryErrors.lastName}</p>
                              )}
                            </div>
                            <div className="sm:col-span-2">
                              <Label htmlFor="address">Address *</Label>
                              <Input
                                id="address"
                                className={`mt-2 ${deliveryErrors.address ? 'border-destructive' : ''}`}
                                placeholder="123 Coffee Street"
                                value={deliveryForm.address}
                                onChange={(e) => setDeliveryForm(prev => ({ ...prev, address: e.target.value }))}
                              />
                              {deliveryErrors.address && (
                                <p className="text-xs text-destructive mt-1">{deliveryErrors.address}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="city">City *</Label>
                              <Input
                                id="city"
                                className={`mt-2 ${deliveryErrors.city ? 'border-destructive' : ''}`}
                                placeholder="Boston"
                                value={deliveryForm.city}
                                onChange={(e) => setDeliveryForm(prev => ({ ...prev, city: e.target.value }))}
                              />
                              {deliveryErrors.city && (
                                <p className="text-xs text-destructive mt-1">{deliveryErrors.city}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="zipCode">ZIP Code *</Label>
                              <Input
                                id="zipCode"
                                className={`mt-2 ${deliveryErrors.zipCode ? 'border-destructive' : ''}`}
                                placeholder="02101"
                                value={deliveryForm.zipCode}
                                onChange={(e) => setDeliveryForm(prev => ({ ...prev, zipCode: e.target.value }))}
                              />
                              {deliveryErrors.zipCode && (
                                <p className="text-xs text-destructive mt-1">{deliveryErrors.zipCode}</p>
                              )}
                            </div>
                            <div className="sm:col-span-2">
                              <Label htmlFor="phone">Phone Number *</Label>
                              <Input
                                id="phone"
                                className={`mt-2 ${deliveryErrors.phone ? 'border-destructive' : ''}`}
                                placeholder="(555) 123-4567"
                                value={deliveryForm.phone}
                                onChange={(e) => setDeliveryForm(prev => ({ ...prev, phone: e.target.value }))}
                              />
                              {deliveryErrors.phone && (
                                <p className="text-xs text-destructive mt-1">{deliveryErrors.phone}</p>
                              )}
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

                      <Button
                        className="w-full btn-gold py-6 text-lg"
                        onClick={handleContinueToPayment}
                        disabled={fulfillmentMethod === 'delivery' && !isDeliveryValid}
                      >
                        Continue to Payment
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Payment Method Selection */}
                      <div className="bg-card rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                          className="space-y-3"
                        >
                          {/* Credit/Debit Card */}
                          <div>
                            <RadioGroupItem value="card" id="card-payment" className="peer sr-only" />
                            <Label
                              htmlFor="card-payment"
                              className="flex items-center gap-3 p-4 bg-secondary rounded-lg cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 hover:bg-secondary/80 transition-all"
                            >
                              <CreditCard className="w-6 h-6 text-gold" />
                              <span className="font-medium">Credit / Debit Card</span>
                            </Label>
                          </div>

                          {/* Apple Pay */}
                          <div>
                            <RadioGroupItem value="apple-pay" id="apple-pay" className="peer sr-only" />
                            <Label
                              htmlFor="apple-pay"
                              className="flex items-center gap-3 p-4 bg-secondary rounded-lg cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 hover:bg-secondary/80 transition-all"
                            >
                              <Apple className="w-6 h-6" />
                              <span className="font-medium">Apple Pay</span>
                            </Label>
                          </div>

                          {/* Google Pay */}
                          <div>
                            <RadioGroupItem value="google-pay" id="google-pay" className="peer sr-only" />
                            <Label
                              htmlFor="google-pay"
                              className="flex items-center gap-3 p-4 bg-secondary rounded-lg cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-gold peer-data-[state=checked]:bg-gold/10 hover:bg-secondary/80 transition-all"
                            >
                              <Wallet className="w-6 h-6 text-blue-500" />
                              <span className="font-medium">Google Pay</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Card Details Form */}
                      {paymentMethod === 'card' && (
                        <div className="bg-card rounded-xl p-6">
                          <h2 className="text-xl font-semibold mb-4">Card Details</h2>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardholderName">Cardholder Name *</Label>
                              <Input
                                id="cardholderName"
                                className={`mt-2 ${cardErrors.cardholderName ? 'border-destructive' : ''}`}
                                placeholder="John Doe"
                                value={cardForm.cardholderName}
                                onChange={(e) => setCardForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                              />
                              {cardErrors.cardholderName && (
                                <p className="text-xs text-destructive mt-1">{cardErrors.cardholderName}</p>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor="cardNumber">Card Number *</Label>
                              <Input
                                id="cardNumber"
                                className={`mt-2 font-mono ${cardErrors.cardNumber ? 'border-destructive' : ''}`}
                                placeholder="1234 5678 9012 3456"
                                value={cardForm.cardNumber}
                                onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                                maxLength={19}
                              />
                              {cardErrors.cardNumber && (
                                <p className="text-xs text-destructive mt-1">{cardErrors.cardNumber}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="expiryDate">Expiry Date *</Label>
                                <Input
                                  id="expiryDate"
                                  className={`mt-2 ${cardErrors.expiryDate ? 'border-destructive' : ''}`}
                                  placeholder="MM/YY"
                                  value={cardForm.expiryDate}
                                  onChange={(e) => setCardForm(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                                  maxLength={5}
                                />
                                {cardErrors.expiryDate && (
                                  <p className="text-xs text-destructive mt-1">{cardErrors.expiryDate}</p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV *</Label>
                                <Input
                                  id="cvv"
                                  className={`mt-2 ${cardErrors.cvv ? 'border-destructive' : ''}`}
                                  placeholder="123"
                                  type="password"
                                  value={cardForm.cvv}
                                  onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                  maxLength={4}
                                />
                                {cardErrors.cvv && (
                                  <p className="text-xs text-destructive mt-1">{cardErrors.cvv}</p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="billingZip">Billing ZIP *</Label>
                                <Input
                                  id="billingZip"
                                  className={`mt-2 ${cardErrors.billingZip ? 'border-destructive' : ''}`}
                                  placeholder="02101"
                                  value={cardForm.billingZip}
                                  onChange={(e) => setCardForm(prev => ({ ...prev, billingZip: e.target.value }))}
                                />
                                {cardErrors.billingZip && (
                                  <p className="text-xs text-destructive mt-1">{cardErrors.billingZip}</p>
                                )}
                              </div>
                            </div>

                            {isAuthenticated && (
                              <div className="flex items-center gap-2 pt-2">
                                <Checkbox
                                  id="saveCard"
                                  checked={cardForm.saveCard}
                                  onCheckedChange={(checked) => setCardForm(prev => ({ ...prev, saveCard: checked as boolean }))}
                                />
                                <label htmlFor="saveCard" className="text-sm cursor-pointer">
                                  Save this card for future purchases
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Digital Payment Button */}
                      {(paymentMethod === 'apple-pay' || paymentMethod === 'google-pay') && (
                        <div className="bg-card rounded-xl p-6 text-center">
                          <p className="text-muted-foreground mb-4">
                            Click below to complete your payment with {paymentMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}
                          </p>
                          <Button
                            className={`w-full py-6 text-lg ${paymentMethod === 'apple-pay' ? 'bg-black hover:bg-black/90 text-white' : 'bg-white hover:bg-gray-100 text-black border'}`}
                            onClick={handleDigitalPayment}
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                {paymentMethod === 'apple-pay' ? (
                                  <>
                                    <Apple className="w-5 h-5 mr-2" />
                                    Pay with Apple Pay
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="w-5 h-5 mr-2 text-blue-500" />
                                    Pay with Google Pay
                                  </>
                                )}
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Place Order Button (for card payment) */}
                      {paymentMethod === 'card' && (
                        <Button
                          className="w-full btn-gold py-6 text-lg"
                          onClick={handlePlaceOrder}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing Payment...
                            </>
                          ) : (
                            `Pay $${finalTotal.toFixed(2)}`
                          )}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setCurrentStep(1)}
                        disabled={isProcessingPayment}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Delivery
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar */}
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

                    {isAuthenticated && (
                      <div className="text-sm text-gold flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        You'll earn {creditsEarned} credits
                      </div>
                    )}

                    {isGuest && !isAuthenticated && (
                      <p className="text-xs text-muted-foreground bg-secondary p-3 rounded-lg">
                        Create an account to earn rewards on every purchase!
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
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
