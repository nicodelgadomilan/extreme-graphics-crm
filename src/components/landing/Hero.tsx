"use client";

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, ArrowRight, CheckCircle, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { QuoteFunnel } from './QuoteFunnel';
import { NicoAIChat } from './NicoAIChat';

export function Hero() {
  const { t } = useLanguage();
  const [showQuoteFunnel, setShowQuoteFunnel] = useState(false);
  const [showNicoAI, setShowNicoAI] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://i.ibb.co/Xf06C9F7/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        
        {/* Additional blur effect on edges for better text contrast */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Content */}
        <div className="container-fresh py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="badge-trust bg-white/95 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('hero.badge1')}</span>
                </div>
                <div className="badge-trust bg-white/95 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('hero.badge2')}</span>
                </div>
                <div className="badge-trust bg-white/95 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('hero.badge3')}</span>
                </div>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight text-white drop-shadow-2xl">
                {t('hero.title')}
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/90 mb-10 leading-relaxed drop-shadow-lg">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="pill-button shadow-xl"
                  onClick={() => setShowQuoteFunnel(true)}
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  className="h-[52px] px-8 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 text-white transition-all shadow-xl"
                  onClick={() => setShowNicoAI(true)}
                >
                  <Bot className="w-5 h-5 mr-2 text-accent" />
                  {t('hero.nicoAI')}
                </Button>
              </div>

              {/* WhatsApp Link */}
              <div className="mt-6">
                <a
                  href="https://wa.me/17862881850?text=Hola%20Nico%2C%20quiero%20un%20letrero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors drop-shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('hero.whatsapp')}: +1 (786) 288-1850</span>
                </a>
              </div>
            </motion.div>

            {/* Right Column - Image Only */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <img 
                  src="https://i.ibb.co/1G8SZkfz/Whats-App-Image-2025-10-15-at-13-13-26.jpg"
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/30 rounded-full blur-3xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <QuoteFunnel open={showQuoteFunnel} onOpenChange={setShowQuoteFunnel} />
      <NicoAIChat open={showNicoAI} onOpenChange={setShowNicoAI} />
    </>
  );
}