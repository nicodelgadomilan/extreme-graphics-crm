"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Award, Package } from 'lucide-react';

export function Guarantees() {
  const { t, language } = useLanguage();

  const guarantees = language === 'es' ? [
    {
      icon: CheckCircle,
      title: '100% Satisfacción',
      description: 'Si no te gusta, lo rehacemos sin costo'
    },
    {
      icon: Award,
      title: 'Materiales Premium',
      description: 'Solo usamos materiales de primera calidad'
    },
    {
      icon: Shield,
      title: 'Garantía Extendida',
      description: '2 años en interior, 1 año en exterior'
    },
    {
      icon: Package,
      title: 'Envío Seguro',
      description: 'Empaque protegido y rastreo incluido'
    }
  ] : [
    {
      icon: CheckCircle,
      title: '100% Satisfaction',
      description: "If you don't like it, we'll remake it at no cost"
    },
    {
      icon: Award,
      title: 'Premium Materials',
      description: 'We only use top-quality materials'
    },
    {
      icon: Shield,
      title: 'Extended Warranty',
      description: '2 years indoor, 1 year outdoor'
    },
    {
      icon: Package,
      title: 'Safe Shipping',
      description: 'Protected packaging and tracking included'
    }
  ];

  return (
    <section className="section-spacing bg-gradient-to-b from-accent/5 to-transparent">
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
              {t('guarantees.title')}
            </h2>
          </motion.div>
        </div>

        {/* Guarantees Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card-fresh p-6 text-center"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-success rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}