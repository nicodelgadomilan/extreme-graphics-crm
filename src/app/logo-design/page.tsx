"use client";

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ChevronDown, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function LogoDesignPage() {
  const { t, language } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Get translations directly from the context
  const translations = {
    es: {
      plans: {
        basic: {
          features: [
            'Diseño de logo personalizado.',
            'Hasta 3 rondas de revisiones.',
            'Entrega final del logo en formatos .PNG y .JPG (alta resolución).',
            'Un concepto de diseño.',
            'Tiempo de entrega: 5 días.'
          ]
        },
        standard: {
          features: [
            'Diseño de logo personalizado.',
            'Hasta 7 rondas de revisiones.',
            'Entrega final del logo en formatos .PNG y .JPG (alta resolución).',
            'Dos conceptos iniciales para elegir.',
            'Versión en blanco y negro.',
            'Tiempo de entrega: 5 días.'
          ]
        },
        premium: {
          features: [
            'Diseño de logo personalizado.',
            'Hasta 7 rondas de revisiones.',
            'Logo final en .PNG, .JPG, .SVG, .PDF.',
            'Tres conceptos iniciales.',
            'Versión en blanco y negro.',
            'Guía de estilo de marca (colores + fuentes).',
            'Archivos editables (.AI, .EPS).',
            'Mini set de branding: tarjeta, membrete, firma de email.',
            'Tiempo de entrega: 7 días.'
          ]
        }
      },
      process: {
        steps: [
          { title: 'Consulta', description: 'Discutimos tu visión, valores de marca y preferencias de diseño.' },
          { title: 'Creación de Conceptos', description: 'Nuestros diseñadores crean conceptos iniciales basados en tus requisitos.' },
          { title: 'Refinamiento', description: 'Trabajamos contigo para refinar y perfeccionar tu diseño elegido.' },
          { title: 'Entrega Final', description: 'Recibe tu logo en todos los formatos requeridos, listo para usar.' }
        ]
      },
      faq: {
        items: [
          {
            question: '¿Cuánto tiempo se tarda en recibir mi logo?',
            answer: 'Los tiempos de entrega varían según el paquete: los paquetes Básico y Estándar tardan 5 días, mientras que el paquete Premium tarda 7 días. Las opciones de entrega urgente pueden estar disponibles bajo petición.'
          },
          {
            question: '¿Qué pasa si necesito revisiones?',
            answer: 'Todos los paquetes incluyen múltiples rondas de revisiones. El paquete Básico incluye 3 rondas, mientras que los paquetes Estándar y Premium incluyen hasta 7 rondas para garantizar tu completa satisfacción.'
          },
          {
            question: '¿Qué formatos de archivo recibiré?',
            answer: 'Los formatos de archivo varían según el paquete. Todos los paquetes incluyen archivos PNG y JPG de alta resolución. El paquete Premium también incluye formatos SVG, PDF, AI y EPS para máxima flexibilidad.'
          },
          {
            question: '¿Puedo usar mi logo para fines comerciales?',
            answer: '¡Sí! Una vez que tu logo esté completo y pagado, posees todos los derechos para usarlo para cualquier propósito comercial o personal.'
          },
          {
            question: '¿Ofrecen servicios de branding más allá del diseño de logo?',
            answer: '¡Sí! Nuestro paquete Premium incluye un mini set de branding con diseños de tarjeta de presentación, membrete y firma de email. También ofrecemos servicios de branding completos - contáctanos para más información.'
          }
        ]
      }
    },
    en: {
      plans: {
        basic: {
          features: [
            'Custom logo design.',
            'Up to 3 rounds of revisions.',
            'Final logo delivery in .PNG and .JPG (high resolution) formats.',
            'One design concept.',
            'Turnaround time: 5 days.'
          ]
        },
        standard: {
          features: [
            'Custom logo design.',
            'Up to 7 rounds of revisions.',
            'Final logo delivery in .PNG and .JPG (high resolution) formats.',
            'Two initial concepts to choose from.',
            'Black and white version.',
            'Turnaround time: 5 days.'
          ]
        },
        premium: {
          features: [
            'Custom logo design.',
            'Up to 7 rounds of revisions.',
            'Final logo in .PNG, .JPG, .SVG, .PDF.',
            'Three initial concepts.',
            'Black and white version.',
            'Brand style guide (colors + fonts).',
            'Editable files (.AI, .EPS).',
            'Mini branding set: card, letterhead, email signature.',
            'Turnaround time: 7 days.'
          ]
        }
      },
      process: {
        steps: [
          { title: 'Consultation', description: 'We discuss your vision, brand values, and design preferences.' },
          { title: 'Concept Creation', description: 'Our designers create initial concepts based on your requirements.' },
          { title: 'Refinement', description: 'We work with you to refine and perfect your chosen design.' },
          { title: 'Final Delivery', description: 'Receive your logo in all required formats, ready to use.' }
        ]
      },
      faq: {
        items: [
          {
            question: 'How long does it take to receive my logo?',
            answer: 'Delivery times vary by package: Basic and Standard packs take 5 days, while the Premium pack takes 7 days. Rush delivery options may be available upon request.'
          },
          {
            question: 'What if I need revisions?',
            answer: 'All packages include multiple rounds of revisions. Basic pack includes 3 rounds, while Standard and Premium packs include up to 7 rounds to ensure your complete satisfaction.'
          },
          {
            question: 'What file formats will I receive?',
            answer: 'File formats vary by package. All packages include high-resolution PNG and JPG files. The Premium pack also includes SVG, PDF, AI, and EPS formats for maximum flexibility.'
          },
          {
            question: 'Can I use my logo for commercial purposes?',
            answer: 'Yes! Once your logo is complete and paid for, you own all rights to use it for any commercial or personal purposes.'
          },
          {
            question: 'Do you offer branding services beyond logo design?',
            answer: 'Yes! Our Premium pack includes a mini branding set with business card, letterhead, and email signature designs. We also offer comprehensive branding services - contact us for more information.'
          }
        ]
      }
    }
  };

  const currentTranslations = translations[language as 'es' | 'en'];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-accent/5 to-white">
          <div className="container-fresh">
            <div className="max-w-5xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Contact Info */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-sm">
                  <a href="tel:+17862881850" className="flex items-center gap-2 text-text hover:text-accent transition-colors font-semibold">
                    <Phone className="w-4 h-4" />
                    <span>{t('logoDesign.contact.speak')}: +1 (786) 288-1850</span>
                  </a>
                  <span className="hidden sm:inline text-muted">•</span>
                  <a href="mailto:nicoextremegraphics@gmail.com" className="flex items-center gap-2 text-text hover:text-accent transition-colors font-semibold">
                    <Mail className="w-4 h-4" />
                    <span>{t('logoDesign.contact.email')}</span>
                  </a>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tight uppercase">
                  {t('logoDesign.title')}
                </h1>
                
                <p className="text-2xl lg:text-3xl font-bold text-accent mb-8">
                  {t('logoDesign.tagline')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="section-spacing bg-white">
          <div className="container-fresh">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tight">
                {t('logoDesign.plans.title')}
              </h2>
              <p className="text-lg text-muted">
                {t('logoDesign.plans.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 * 0.1 }}
                className="border-2 rounded-2xl p-8 bg-white hover:shadow-xl transition-all border-border"
              >
                <h3 className="text-2xl font-black mb-2 uppercase">{t('logoDesign.plans.basic.name')}</h3>
                <div className="text-4xl font-black text-accent mb-2">{t('logoDesign.plans.basic.price')}</div>
                <p className="text-sm text-muted mb-6 min-h-[60px]">{t('logoDesign.plans.basic.description')}</p>

                <ul className="space-y-3 mb-8 min-h-[280px]">
                  {currentTranslations.plans.basic.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full h-12 font-bold uppercase bg-secondary hover:bg-accent hover:text-white text-text transition-all">
                  {t('logoDesign.plans.basic.cta')}
                </Button>
              </motion.div>

              {/* Standard Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 * 0.1 }}
                className="border-2 rounded-2xl p-8 bg-white hover:shadow-xl transition-all border-accent shadow-lg scale-105"
              >
                <div className="inline-block px-4 py-1 bg-accent text-white text-xs font-bold rounded-full mb-4 uppercase">
                  {t('logoDesign.plans.standard.popular')}
                </div>
                
                <h3 className="text-2xl font-black mb-2 uppercase">{t('logoDesign.plans.standard.name')}</h3>
                <div className="text-4xl font-black text-accent mb-2">{t('logoDesign.plans.standard.price')}</div>
                <p className="text-sm text-muted mb-6 min-h-[60px]">{t('logoDesign.plans.standard.description')}</p>

                <ul className="space-y-3 mb-8 min-h-[280px]">
                  {currentTranslations.plans.standard.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full h-12 font-bold uppercase bg-accent hover:bg-accent-hover text-white transition-all">
                  {t('logoDesign.plans.standard.cta')}
                </Button>
              </motion.div>

              {/* Premium Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 2 * 0.1 }}
                className="border-2 rounded-2xl p-8 bg-white hover:shadow-xl transition-all border-border"
              >
                <h3 className="text-2xl font-black mb-2 uppercase">{t('logoDesign.plans.premium.name')}</h3>
                <div className="text-4xl font-black text-accent mb-2">{t('logoDesign.plans.premium.price')}</div>
                <p className="text-sm text-muted mb-6 min-h-[60px]">{t('logoDesign.plans.premium.description')}</p>

                <ul className="space-y-3 mb-8 min-h-[280px]">
                  {currentTranslations.plans.premium.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full h-12 font-bold uppercase bg-secondary hover:bg-accent hover:text-white text-text transition-all">
                  {t('logoDesign.plans.premium.cta')}
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio CTA */}
        <section className="section-spacing bg-bg">
          <div className="container-fresh">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl lg:text-5xl font-black mb-6 uppercase">
                  {t('logoDesign.portfolio.title')}
                </h2>
                <p className="text-lg text-muted mb-8">
                  {t('logoDesign.portfolio.subtitle')}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="aspect-square rounded-xl bg-white shadow-md overflow-hidden">
                    <img 
                      src="https://i.ibb.co/7TwWWW8/Captura-de-pantalla-2025-10-15-a-las-2-02-03-p-m.png"
                      alt="Logo Example 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl bg-white shadow-md overflow-hidden">
                    <img 
                      src="https://i.ibb.co/7TwWWW8/Captura-de-pantalla-2025-10-15-a-las-2-02-03-p-m.png"
                      alt="Logo Example 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl bg-white shadow-md overflow-hidden">
                    <img 
                      src="https://i.ibb.co/7TwWWW8/Captura-de-pantalla-2025-10-15-a-las-2-02-03-p-m.png"
                      alt="Logo Example 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl bg-white shadow-md overflow-hidden">
                    <img 
                      src="https://i.ibb.co/7TwWWW8/Captura-de-pantalla-2025-10-15-a-las-2-02-03-p-m.png"
                      alt="Logo Example 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-spacing bg-white">
          <div className="container-fresh">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl lg:text-5xl font-black mb-6 uppercase">
                {t('logoDesign.process.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {currentTranslations.process.steps.map((step: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="stepper-circle mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-spacing bg-gradient-to-br from-accent/10 via-white to-success/10">
          <div className="container-fresh">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card-fresh p-12 text-center"
              >
                <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase">
                  {t('logoDesign.finalCTA.title')}
                </h2>
                <p className="text-xl font-bold text-accent mb-4">
                  {t('logoDesign.finalCTA.subtitle')}
                </p>
                <p className="text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
                  {t('logoDesign.finalCTA.description')}
                </p>
                <Button className="pill-button text-lg px-12 h-14">
                  {t('logoDesign.finalCTA.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-spacing bg-white">
          <div className="container-fresh">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-black mb-6 uppercase">
                  {t('logoDesign.faq.title')}
                </h2>
              </div>

              <div className="space-y-4">
                {currentTranslations.faq.items.map((faq: any, index: number) => (
                  <div
                    key={index}
                    className="border-2 border-border rounded-xl overflow-hidden bg-white hover:border-accent transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >
                      <span className="font-bold text-text pr-8">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent transition-transform flex-shrink-0 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {openFaqIndex === index && (
                      <div className="px-6 pb-5">
                        <div className="pt-2 border-t border-border">
                          <p className="text-muted leading-relaxed mt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}