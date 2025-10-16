"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Award } from 'lucide-react';

export function WhyChooseUs() {
  const { t, language } = useLanguage();

  const benefits = language === 'es' ? [
    {
      icon: Shield,
      title: 'Materiales Premium',
      description: 'Usamos solo materiales de la más alta calidad con garantía extendida'
    },
    {
      icon: Clock,
      title: 'Entrega Rápida',
      description: 'Mockup en 24h y producción express disponible'
    },
    {
      icon: Truck,
      title: 'Instalación Profesional',
      description: 'Equipo certificado para instalación segura y precisa'
    },
    {
      icon: Award,
      title: '10+ Años de Experiencia',
      description: 'Más de 500 proyectos exitosos en todo Estados Unidos'
    }
  ] : [
    {
      icon: Shield,
      title: 'Premium Materials',
      description: 'We use only the highest quality materials with extended warranty'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: '24h mockup and express production available'
    },
    {
      icon: Truck,
      title: 'Professional Installation',
      description: 'Certified team for safe and precise installation'
    },
    {
      icon: Award,
      title: '10+ Years Experience',
      description: 'Over 500 successful projects across the United States'
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
              {t('whyChooseUs.title')}
            </h2>
            <p className="text-lg text-muted">
              {t('whyChooseUs.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-text mb-2">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}