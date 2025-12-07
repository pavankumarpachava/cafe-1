import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Seasonal', path: '/shop?category=Christmas' },
  { name: 'Rewards', path: '/profile/rewards' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isDark, toggleTheme, isAuthenticated } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-xl lg:hidden"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className="text-3xl font-display font-medium hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <Link
                  to={isAuthenticated ? '/profile' : '/login'}
                  onClick={onClose}
                  className="text-3xl font-display font-medium hover:text-gold transition-colors"
                >
                  {isAuthenticated ? 'Profile' : 'Login'}
                </Link>
              </motion.div>
            </nav>

            <div className="flex justify-center pb-12">
              <Button
                variant="outline"
                size="lg"
                onClick={toggleTheme}
                className="gap-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
