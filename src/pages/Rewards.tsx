import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { Gift, Star, Coffee, Award, TrendingUp, History } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStore } from '@/context/StoreContext';

const rewardTiers = [
  { name: 'Bronze', minCredits: 0, maxCredits: 100, perks: ['5% off orders', 'Birthday reward'], color: 'from-amber-700 to-amber-500' },
  { name: 'Silver', minCredits: 100, maxCredits: 300, perks: ['10% off orders', 'Free size upgrade', 'Early access'], color: 'from-gray-400 to-gray-300' },
  { name: 'Gold', minCredits: 300, maxCredits: 500, perks: ['15% off orders', 'Free drink monthly', 'Priority pickup', 'Exclusive events'], color: 'from-yellow-500 to-yellow-300' },
  { name: 'Platinum', minCredits: 500, maxCredits: Infinity, perks: ['20% off orders', 'Free drinks weekly', 'VIP events', 'Personal barista'], color: 'from-purple-400 to-pink-300' },
];

export default function Rewards() {
  const { user, isAuthenticated, orders } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentCredits = user?.credits || 0;
  const currentTier = rewardTiers.find(tier => currentCredits >= tier.minCredits && currentCredits < tier.maxCredits) || rewardTiers[0];
  const nextTier = rewardTiers[rewardTiers.indexOf(currentTier) + 1];
  const progressToNext = nextTier 
    ? ((currentCredits - currentTier.minCredits) / (nextTier.minCredits - currentTier.minCredits)) * 100 
    : 100;

  // Get credit history from orders
  const creditHistory = orders.map(order => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    description: `Order #${order.id.slice(0, 8)}`,
    earned: order.creditsEarned,
    used: order.creditsUsed,
  }));

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Gift className="w-16 h-16 mx-auto text-gold mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-gold">Rewards</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Earn credits with every purchase and unlock exclusive perks
            </p>
          </motion.div>

          {/* Current Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className={`bg-gradient-to-r ${currentTier.color} text-white overflow-hidden`}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Current Balance</p>
                    <h2 className="text-5xl font-bold mb-2">{currentCredits}</h2>
                    <p className="text-white/90">Credits Available</p>
                  </div>
                  <div className="text-center md:text-right">
                    <Award className="w-12 h-12 mx-auto md:ml-auto mb-2" />
                    <p className="text-2xl font-bold">{currentTier.name}</p>
                    <p className="text-white/80">Member</p>
                  </div>
                </div>
                {nextTier && (
                  <div className="mt-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{currentCredits} credits</span>
                      <span>{nextTier.minCredits} to {nextTier.name}</span>
                    </div>
                    <Progress value={progressToNext} className="h-3 bg-white/30" />
                    <p className="text-center mt-2 text-white/80">
                      {nextTier.minCredits - currentCredits} more credits to reach {nextTier.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Reward Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-gold" />
              Reward Tiers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewardTiers.map((tier, index) => (
                <Card 
                  key={tier.name}
                  className={`relative overflow-hidden ${currentTier.name === tier.name ? 'ring-2 ring-gold' : ''}`}
                >
                  {currentTier.name === tier.name && (
                    <div className="absolute top-2 right-2 bg-gold text-gold-foreground text-xs px-2 py-1 rounded-full">
                      Current
                    </div>
                  )}
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center mb-2`}>
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{tier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {tier.maxCredits === Infinity ? `${tier.minCredits}+ credits` : `${tier.minCredits}-${tier.maxCredits} credits`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-gold" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* How to Earn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-gold" />
              How to Earn Credits
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Coffee className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">Make Purchases</h3>
                  <p className="text-muted-foreground text-sm">Earn 1 credit for every $1 spent on coffee and drinks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">Refer Friends</h3>
                  <p className="text-muted-foreground text-sm">Get 50 bonus credits when a friend makes their first order</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">Special Events</h3>
                  <p className="text-muted-foreground text-sm">Earn double credits during promotions and holidays</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Credit History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <History className="w-6 h-6 text-gold" />
              Credit History
            </h2>
            <Card>
              <CardContent className="p-6">
                {creditHistory.length > 0 ? (
                  <div className="space-y-4">
                    {creditHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <div className="text-right">
                          {item.earned > 0 && (
                            <p className="text-green-500 font-medium">+{item.earned} credits</p>
                          )}
                          {item.used > 0 && (
                            <p className="text-red-500 font-medium">-{item.used} credits</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Coffee className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No credit history yet</p>
                    <Link to="/shop">
                      <Button className="mt-4 btn-gold">Start Shopping</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
