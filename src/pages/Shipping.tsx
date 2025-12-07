import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Package, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent } from '@/components/ui/card';

const shippingOptions = [
  {
    name: 'Express Delivery',
    time: '20-30 mins',
    price: '$4.99',
    description: 'Perfect for when you need your coffee fix fast',
    icon: Truck,
  },
  {
    name: 'Standard Delivery',
    time: '45-60 mins',
    price: '$2.99',
    description: 'Reliable delivery at an affordable price',
    icon: Clock,
  },
  {
    name: 'Free Pickup',
    time: '15 mins',
    price: 'Free',
    description: 'Skip the line and pick up at your convenience',
    icon: MapPin,
  },
];

const deliveryZones = [
  { zone: 'Zone A', radius: '0-2 miles', fee: '$2.99', time: '15-25 mins' },
  { zone: 'Zone B', radius: '2-4 miles', fee: '$3.99', time: '25-35 mins' },
  { zone: 'Zone C', radius: '4-5 miles', fee: '$4.99', time: '35-45 mins' },
];

export default function Shipping() {
  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Truck className="w-16 h-16 mx-auto text-gold mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Shipping & <span className="text-gold">Delivery</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Fast, reliable delivery right to your door
            </p>
          </motion.div>

          {/* Delivery Options */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6">Delivery Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {shippingOptions.map((option) => (
                <Card key={option.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                      <option.icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{option.name}</h3>
                    <p className="text-2xl font-bold text-gold mb-1">{option.price}</p>
                    <p className="text-sm text-muted-foreground mb-2">{option.time}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Delivery Zones */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6">Delivery Zones</h2>
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Zone</th>
                        <th className="text-left py-3 px-4">Distance</th>
                        <th className="text-left py-3 px-4">Delivery Fee</th>
                        <th className="text-left py-3 px-4">Est. Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryZones.map((zone) => (
                        <tr key={zone.zone} className="border-b last:border-0">
                          <td className="py-3 px-4 font-medium">{zone.zone}</td>
                          <td className="py-3 px-4 text-muted-foreground">{zone.radius}</td>
                          <td className="py-3 px-4 text-gold font-medium">{zone.fee}</td>
                          <td className="py-3 px-4 text-muted-foreground">{zone.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Free Shipping */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-gold/20 to-christmas/20 border-gold/30">
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gold mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Free Delivery on Orders $20+</h2>
                <p className="text-muted-foreground">
                  Spend $20 or more and enjoy free standard delivery to your location
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* What to Expect */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6">What to Expect</h2>
            <div className="space-y-4">
              {[
                'Real-time order tracking from preparation to delivery',
                'Temperature-controlled packaging for hot and cold drinks',
                'Contactless delivery option available',
                'SMS notifications with driver location',
                'Quality guarantee - if it\'s not perfect, we\'ll make it right',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
