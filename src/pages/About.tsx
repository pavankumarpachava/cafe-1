import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Coffee, Leaf, Heart, Award } from 'lucide-react';

const About = () => {
  const milestones = [
    { year: '2020', title: 'The Beginning', description: 'Started with a small roastery and a big dream.' },
    { year: '2021', title: 'First Store', description: 'Opened our flagship location downtown.' },
    { year: '2022', title: 'Going Online', description: 'Launched our e-commerce platform.' },
    { year: '2023', title: 'Sustainability', description: 'Achieved 100% ethically sourced beans.' },
    { year: '2024', title: 'Community', description: '10,000+ happy coffee lovers and counting.' },
  ];

  const values = [
    {
      icon: Coffee,
      title: 'Quality First',
      description: 'Every bean is hand-selected for exceptional flavor.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices at every step.',
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Supporting local farmers and giving back.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning roasts crafted with passion.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200"
              alt="Coffee beans"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                Our Story
              </h1>
              <p className="text-xl text-muted-foreground">
                From bean to cup, we're dedicated to crafting the perfect coffee experience.
                Our journey started with a simple belief: great coffee brings people together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-center mb-16"
            >
              What We Stand For
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-8 rounded-2xl text-center hover-lift"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-center mb-16"
            >
              Our Journey
            </motion.h2>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative pl-8 pb-12 last:pb-0 border-l-2 border-gold/30"
                >
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-gold" />
                  <span className="text-gold font-bold">{milestone.year}</span>
                  <h3 className="text-xl font-semibold mt-1">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-center mb-16"
            >
              From Bean to Cup
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { step: '01', title: 'Source', desc: 'Hand-picked from the finest farms' },
                { step: '02', title: 'Roast', desc: 'Expertly roasted in small batches' },
                { step: '03', title: 'Brew', desc: 'Prepared with precision and care' },
                { step: '04', title: 'Enjoy', desc: 'Delivered fresh to your doorstep' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-5xl font-bold text-gold/50">{item.step}</span>
                  <h3 className="text-xl font-semibold mt-4 mb-2">{item.title}</h3>
                  <p className="text-primary-foreground/70">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
