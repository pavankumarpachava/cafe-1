import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Settings } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: `We collect information you provide directly, including:
    • Account information (name, email, password)
    • Order history and preferences
    • Payment information (securely processed by third-party providers)
    • Communication preferences
    • Feedback and support inquiries
    
    We also automatically collect:
    • Device information and browser type
    • Location data (with your permission)
    • Usage patterns and preferences`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `Your information helps us:
    • Process and deliver your orders
    • Personalize your experience and recommendations
    • Manage your rewards and credits
    • Send order updates and promotional offers
    • Improve our products and services
    • Prevent fraud and ensure security
    • Comply with legal obligations`,
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `We implement industry-standard security measures:
    • Encryption of data in transit and at rest
    • Secure payment processing (PCI-DSS compliant)
    • Regular security audits and updates
    • Access controls and authentication
    • Employee training on data protection
    
    We never sell your personal information to third parties.`,
  },
  {
    icon: Settings,
    title: 'Your Rights & Choices',
    content: `You have the right to:
    • Access your personal data
    • Correct inaccurate information
    • Delete your account and data
    • Opt out of marketing communications
    • Export your data in a portable format
    • Restrict certain processing of your data
    
    To exercise these rights, visit your account settings or contact us.`,
  },
  {
    icon: Mail,
    title: 'Communications',
    content: `We may send you:
    • Order confirmations and updates (required)
    • Account and security alerts (required)
    • Promotional offers and rewards (opt-in)
    • Newsletter and coffee tips (opt-in)
    
    You can manage your preferences in account settings or unsubscribe from marketing emails at any time.`,
  },
];

export default function PrivacyPolicy() {
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
            <Shield className="w-16 h-16 mx-auto text-gold mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Privacy <span className="text-gold">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your privacy matters to us. Here's how we protect it.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: December 2024
            </p>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-gold/10 to-primary/5 border-gold/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  At Café 1%, we are committed to protecting your privacy and ensuring 
                  the security of your personal information. This policy explains how we 
                  collect, use, and safeguard your data when you use our website, mobile 
                  app, and services.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-gold" />
                      </div>
                      <h2 className="font-display text-xl font-bold">{section.title}</h2>
                    </div>
                    <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center p-8 bg-card rounded-2xl border"
          >
            <h3 className="font-display text-xl font-bold mb-2">Questions About Privacy?</h3>
            <p className="text-muted-foreground mb-4">
              Contact our privacy team at privacy@cafe1percent.com
            </p>
            <a href="/contact" className="inline-block">
              <button className="btn-gold px-6 py-3 rounded-full font-medium">
                Contact Us
              </button>
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
