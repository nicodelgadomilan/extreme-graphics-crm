"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Process() {
  const { t, language } = useLanguage();

  const steps = language === 'es' ? [
    {
      number: '01',
      title: 'Solicita tu Presupuesto',
      description: 'Cuéntanos sobre tu proyecto y recibe una cotización en menos de 24 horas'
    },
    {
      number: '02',
      title: 'Revisa tu Mockup',
      description: 'Te enviamos visualizaciones realistas para que apruebes el diseño'
    },
    {
      number: '03',
      title: 'Producción',
      description: 'Fabricamos tu letrero con materiales premium y tecnología de punta'
    },
    {
      number: '04',
      title: 'Instalación o Envío',
      description: 'Lo instalamos profesionalmente o lo enviamos listo para colocar'
    }
  ] : [
    {
      number: '01',
      title: 'Request Your Quote',
      description: 'Tell us about your project and receive a quote in less than 24 hours'
    },
    {
      number: '02',
      title: 'Review Your Mockup',
      description: 'We send you realistic visualizations so you can approve the design'
    },
    {
      number: '03',
      title: 'Production',
      description: 'We manufacture your sign with premium materials and cutting-edge technology'
    },
    {
      number: '04',
      title: 'Installation or Shipping',
      description: 'We install it professionally or ship it ready to install'
    }
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="container-fresh">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              {t('process.title')}
            </h2>
            <p className="text-lg text-muted">
              {t('process.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Lines (hidden on mobile) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Step Number Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="stepper-circle relative z-10">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </div>

              {/* Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-16 -right-4 z-20">
                  <ArrowRight className="w-6 h-6 text-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}