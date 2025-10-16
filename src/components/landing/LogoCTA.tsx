"use client";

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function LogoCTA() {
  const { t } = useLanguage();

  return (
    <section className="section-spacing bg-gradient-to-br from-accent/5 via-white to-success/5">
      <div className="container-fresh">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="card-fresh p-8 lg:p-12 max-w-4xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-6">
                {t('logoCTA.badge')}
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-black mb-4">
                {t('logoCTA.title')}
              </h2>
              
              <p className="text-muted mb-6 leading-relaxed">
                {t('logoCTA.description')}
              </p>

              <ul className="space-y-3 mb-8">
                {[t('logoCTA.benefit1'), t('logoCTA.benefit2'), t('logoCTA.benefit3')].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className="pill-button"
              >
                <a href="/logo-design">
                  {t('logoCTA.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://i.ibb.co/7TwWWW8/Captura-de-pantalla-2025-10-15-a-las-2-02-03-p-m.png"
                  alt="Logo Design Example"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}