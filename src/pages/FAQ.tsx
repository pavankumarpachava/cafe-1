import { motion } from 'framer-motion';
import { HelpCircle, Coffee, CreditCard, Truck, Gift, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Orders & Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. You can also use your earned credits towards your purchase.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can modify or cancel your order within 5 minutes of placing it. After that, our baristas start preparing your drinks and modifications are not possible.',
      },
      {
        q: 'How do I apply a promo code?',
        a: 'Enter your promo code at checkout in the "Discount Code" field. The discount will be automatically applied to your order total.',
      },
    ],
  },
  {
    title: 'Delivery & Pickup',
    icon: Truck,
    questions: [
      {
        q: 'What are your delivery areas?',
        a: 'We currently deliver within a 5-mile radius of our store locations. Enter your address at checkout to see if delivery is available in your area.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 20-30 minutes. During peak hours, delivery may take up to 45 minutes. You can track your order in real-time.',
      },
      {
        q: 'Is there a minimum order for delivery?',
        a: 'Yes, the minimum order for delivery is $15. Orders under $15 are available for pickup only.',
      },
    ],
  },
  {
    title: 'Rewards Program',
    icon: Gift,
    questions: [
      {
        q: 'How do I earn credits?',
        a: 'You earn 1 credit for every $1 spent. Credits are automatically added to your account after each purchase. Sign up to start earning!',
      },
      {
        q: 'How can I redeem my credits?',
        a: 'Credits can be redeemed at checkout. Every 100 credits equals $5 off your order. Simply check the "Use Credits" option during checkout.',
      },
      {
        q: 'Do credits expire?',
        a: 'Credits expire 12 months after they are earned. We\'ll send you a reminder email before your credits expire.',
      },
    ],
  },
  {
    title: 'Products',
    icon: Coffee,
    questions: [
      {
        q: 'Are your coffee beans ethically sourced?',
        a: 'Yes! All our coffee beans are ethically sourced from sustainable farms. We work directly with farmers to ensure fair wages and environmentally friendly practices.',
      },
      {
        q: 'Do you offer dairy-free options?',
        a: 'Absolutely! We offer oat milk, almond milk, soy milk, and coconut milk as alternatives. Just customize your drink during ordering.',
      },
      {
        q: 'What are your seasonal specials?',
        a: 'We rotate seasonal drinks throughout the year. Currently featuring our Christmas collection with Gingerbread Latte, Peppermint Mocha, and Eggnog Latte.',
      },
    ],
  },
  {
    title: 'Store Hours',
    icon: Clock,
    questions: [
      {
        q: 'What are your store hours?',
        a: 'Most locations are open Monday-Friday 6am-9pm, Saturday-Sunday 7am-10pm. Holiday hours may vary.',
      },
      {
        q: 'Are you open on holidays?',
        a: 'We\'re open on most holidays with modified hours. Check our website or app for specific holiday schedules.',
      },
    ],
  },
];

export default function FAQ() {
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
            <HelpCircle className="w-16 h-16 mx-auto text-gold mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-gold">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about Café 1%
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h2 className="font-display text-xl font-bold">{category.title}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center p-8 bg-card rounded-2xl border"
          >
            <h3 className="font-display text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">Our team is here to help</p>
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
