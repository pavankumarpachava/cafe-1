import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, Trash2, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/context/StoreContext';
import { SavedCard } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { toast } from 'sonner';

const cardBrands = {
  visa: {
    name: 'Visa',
    gradient: 'from-blue-600 to-blue-800',
    icon: '💳',
  },
  mastercard: {
    name: 'Mastercard',
    gradient: 'from-red-500 to-orange-500',
    icon: '💳',
  },
  amex: {
    name: 'American Express',
    gradient: 'from-blue-400 to-cyan-500',
    icon: '💳',
  },
};

export default function ProfilePayments() {
  const { user, addCard, deleteCard, setDefaultCard } = useStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cardholderName: '',
    cvv: '',
  });

  const detectCardType = (number: string): 'visa' | 'mastercard' | 'amex' => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    return 'visa';
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handleAddCard = () => {
    const cardNumber = newCard.cardNumber.replace(/\s/g, '');
    if (cardNumber.length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }
    if (!newCard.expiryDate || newCard.expiryDate.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }
    if (!newCard.cardholderName.trim()) {
      toast.error('Please enter the cardholder name');
      return;
    }

    const [expiryMonth, expiryYear] = newCard.expiryDate.split('/');
    const card: Omit<SavedCard, 'id'> = {
      lastFour: cardNumber.slice(-4),
      type: detectCardType(cardNumber),
      expiryMonth,
      expiryYear,
      isDefault: (user?.savedCards?.length || 0) === 0,
    };

    addCard(card);
    setNewCard({ cardNumber: '', expiryDate: '', cardholderName: '', cvv: '' });
    setIsAddingCard(false);
    toast.success('Payment method added successfully');
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    toast.success('Payment method removed');
  };

  const handleSetDefault = (id: string) => {
    setDefaultCard(id);
    toast.success('Default payment method updated');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
                <p className="text-muted-foreground mt-1">Manage your saved payment methods</p>
              </div>
              
              <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    {/* Card Preview */}
                    <div className={`relative h-44 rounded-xl bg-gradient-to-br ${cardBrands[detectCardType(newCard.cardNumber)].gradient} p-6 text-white shadow-xl overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div className="w-10 h-8 bg-yellow-300/80 rounded" />
                          <span className="text-lg font-bold">
                            {cardBrands[detectCardType(newCard.cardNumber)].name}
                          </span>
                        </div>
                        
                        <div className="font-mono text-xl tracking-wider mb-4">
                          {newCard.cardNumber || '•••• •••• •••• ••••'}
                        </div>
                        
                        <div className="flex justify-between">
                          <div>
                            <div className="text-xs text-white/70">Card Holder</div>
                            <div className="font-medium uppercase">
                              {newCard.cardholderName || 'Your Name'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-white/70">Expires</div>
                            <div className="font-medium">
                              {newCard.expiryDate || 'MM/YY'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({ 
                            ...newCard, 
                            cardNumber: formatCardNumber(e.target.value) 
                          })}
                          className="font-mono"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          placeholder="John Doe"
                          value={newCard.cardholderName}
                          onChange={(e) => setNewCard({ 
                            ...newCard, 
                            cardholderName: e.target.value 
                          })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={newCard.expiryDate}
                            onChange={(e) => setNewCard({ 
                              ...newCard, 
                              expiryDate: formatExpiryDate(e.target.value) 
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={newCard.cvv}
                            onChange={(e) => setNewCard({ 
                              ...newCard, 
                              cvv: e.target.value.replace(/\D/g, '') 
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsAddingCard(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleAddCard}
                      >
                        Add Card
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Saved Cards */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {user?.savedCards && user.savedCards.length > 0 ? (
                  user.savedCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            {/* Card Icon */}
                            <div className={`w-16 h-10 rounded-lg bg-gradient-to-br ${cardBrands[card.type].gradient} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                              {card.type.toUpperCase()}
                            </div>

                            {/* Card Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  {cardBrands[card.type].name} •••• {card.lastFour}
                                </span>
                                {card.isDefault && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    <Star className="w-3 h-3 fill-current" />
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Expires {card.expiryMonth}/{card.expiryYear}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!card.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSetDefault(card.id)}
                                  className="gap-1"
                                >
                                  <Check className="w-4 h-4" />
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteCard(card.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <CreditCard className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No payment methods</h3>
                    <p className="text-muted-foreground mb-6">
                      Add a card to make checkout faster and easier
                    </p>
                    <Button onClick={() => setIsAddingCard(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Card
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Security Note */}
            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">Your payment info is secure</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    We use industry-standard encryption to protect your payment information. 
                    Your full card number is never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
