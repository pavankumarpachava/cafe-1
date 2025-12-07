import { motion } from 'framer-motion';
import { RotateCcw, Shield, Clock, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Returns() {
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
            <RotateCcw className="w-16 h-16 mx-auto text-gold mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Returns & <span className="text-gold">Refunds</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your satisfaction is our priority
            </p>
          </motion.div>

          {/* Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-gold/20 to-primary/10 border-gold/30">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 mx-auto text-gold mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">100% Satisfaction Guarantee</h2>
                <p className="text-muted-foreground">
                  If your drink isn't perfect, we'll make it right. No questions asked.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Policy Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-gold" />
                  <CardTitle>Quick Resolution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Report any issues within 2 hours of receiving your order and we'll resolve it immediately - either with a remake or a full refund.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-8 h-8 text-gold" />
                  <CardTitle>Easy Process</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contact us through the app, website, or by calling our support line. Describe the issue and we'll take care of the rest.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* What's Covered */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6">What's Covered</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Eligible for Refund
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Wrong order delivered</li>
                      <li>• Missing items from order</li>
                      <li>• Quality issues (taste, temperature)</li>
                      <li>• Spilled or damaged drinks</li>
                      <li>• Order never arrived</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      Not Eligible
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Change of mind after consuming</li>
                      <li>• Incorrect customization selected</li>
                      <li>• More than 2 hours after delivery</li>
                      <li>• Promotional items marked final sale</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* How to Request */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold mb-6">How to Request a Refund</h2>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Open Order History', desc: 'Go to your profile and find the order in question' },
                { step: '2', title: 'Select "Report Issue"', desc: 'Choose the specific item and describe what went wrong' },
                { step: '3', title: 'Add Photo (Optional)', desc: 'A photo helps us improve and speeds up the process' },
                { step: '4', title: 'Receive Resolution', desc: 'Get a refund to your original payment method or credits' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center p-8 bg-card rounded-2xl border"
          >
            <h3 className="font-display text-xl font-bold mb-2">Need Immediate Help?</h3>
            <p className="text-muted-foreground mb-4">Our support team is available 7am-10pm daily</p>
            <a href="/contact" className="inline-block">
              <button className="btn-gold px-6 py-3 rounded-full font-medium">
                Contact Support
              </button>
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
