"use client";

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileCTA() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-surface border-t-2 border-border shadow-lg p-4"
        >
          <div className="flex gap-3">
            <Button
              className="flex-1 pill-button"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="h-[52px] px-6 rounded-full border-2 border-accent bg-white dark:bg-surface hover:bg-accent hover:text-white transition-all"
            >
              <a
                href="https://wa.me/17862881850?text=Hola%20Nico%2C%20quiero%20un%20letrero"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 text-accent hover:text-white" />
              </a>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}