"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'pricing.starter',
    desc: 'pricing.starter.desc',
    price: 299,
    features: [
      'pricing.feature1',
      'pricing.feature2',
      'pricing.feature3',
      'pricing.feature4',
      'pricing.feature5',
    ],
    gradient: 'from-blue-500 to-cyan-500',
    popular: false,
  },
  {
    name: 'pricing.professional',
    desc: 'pricing.professional.desc',
    price: 799,
    features: [
      'pricing.feature6',
      'pricing.feature7',
      'pricing.feature8',
      'pricing.feature9',
      'pricing.feature10',
    ],
    gradient: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    name: 'pricing.enterprise',
    desc: 'pricing.enterprise.desc',
    price: null,
    features: [
      'pricing.feature11',
      'pricing.feature12',
      'pricing.feature13',
      'pricing.feature14',
      'pricing.feature15',
    ],
    gradient: 'from-orange-500 to-red-500',
    popular: false,
  },
];

export function Pricing() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('pricing.title')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <div className={`bg-gradient-to-r ${plan.gradient} px-4 py-1 rounded-full text-white text-sm font-medium flex items-center gap-1`}>
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`glass-effect rounded-2xl p-8 h-full transition-all duration-300 ${
                plan.popular ? 'glow-primary scale-105' : 'hover:glow-secondary'
              }`}>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{t(plan.name)}</h3>
                  <p className="text-muted-foreground text-sm">{t(plan.desc)}</p>
                </div>

                <div className="mb-8">
                  {plan.price ? (
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold gradient-text">${plan.price}</span>
                      <span className="text-muted-foreground ml-2">{t('pricing.perMonth')}</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold gradient-text">Custom</div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{t(feature)}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 glow-primary`
                      : 'gradient-border'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.price ? t('pricing.getStarted') : t('pricing.contactUs')}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}