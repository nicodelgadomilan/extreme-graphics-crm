"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = language === 'es' ? [
    {
      question: '¿Cuál es el tiempo de producción?',
      answer: 'El tiempo de producción varía según el tipo de letrero. Generalmente, los letreros estándar toman de 5 a 10 días hábiles. Ofrecemos servicio express con recargo adicional.'
    },
    {
      question: '¿Realizan envíos a todo Estados Unidos?',
      answer: 'Sí, realizamos envíos mediante UPS a todos los estados de EE.UU. El costo de envío varía según el tamaño, peso y destino. Te proporcionamos una cotización exacta antes de confirmar tu pedido.'
    },
    {
      question: '¿Qué incluye el servicio de instalación?',
      answer: 'Nuestro servicio de instalación profesional incluye: evaluación del sitio, preparación de superficie, instalación segura y limpieza. El costo varía según la altura, complejidad y ubicación. Precio desde $149.'
    },
    {
      question: '¿Ofrecen garantía en sus productos?',
      answer: 'Sí, todos nuestros letreros cuentan con garantía de materiales y mano de obra. Los letreros de interior tienen 2 años de garantía, y los de exterior 1 año contra defectos de fabricación.'
    },
    {
      question: '¿Cuáles son los horarios de atención?',
      answer: 'Estamos disponibles de lunes a viernes de 9:00 AM a 6:00 PM EST. También puedes contactarnos por WhatsApp al +1 (786) 288-1850 en cualquier momento y te responderemos lo antes posible.'
    }
  ] : [
    {
      question: 'What is the production time?',
      answer: 'Production time varies by sign type. Generally, standard signs take 5-10 business days. We offer express service with additional charge.'
    },
    {
      question: 'Do you ship nationwide?',
      answer: 'Yes, we ship via UPS to all US states. Shipping cost varies by size, weight, and destination. We provide an exact quote before confirming your order.'
    },
    {
      question: 'What does installation service include?',
      answer: 'Our professional installation service includes: site evaluation, surface preparation, safe installation, and cleanup. Cost varies by height, complexity, and location. Starting from $149.'
    },
    {
      question: 'Do you offer warranty on products?',
      answer: 'Yes, all our signs come with materials and workmanship warranty. Interior signs have 2-year warranty, exterior signs have 1-year warranty against manufacturing defects.'
    },
    {
      question: 'What are your business hours?',
      answer: 'We are available Monday to Friday 9:00 AM to 6:00 PM EST. You can also contact us via WhatsApp at +1 (786) 288-1850 anytime and we will respond as soon as possible.'
    }
  ];

  return (
    <section id="faq" className="section-spacing bg-white">
      <div className="container-fresh">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-muted">
              {t('faq.subtitle')}
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="border border-border rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-text pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-accent transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted leading-relaxed mt-3">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}