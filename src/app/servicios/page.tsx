"use client";

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Lightbulb, Palette, Globe, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { NicoAIChat } from '@/components/landing/NicoAIChat';
import { useState } from 'react';
import Link from 'next/link';

export default function ServiciosPage() {
  const [chatOpen, setChatOpen] = useState(false);

  const signServices = [
    {
      icon: Lightbulb,
      name: 'Letreros 3D de Acrílico',
      description: 'Letreros premium de acrílico multicapa con retroiluminación LED. Perfectos para lobbies de oficina, áreas de recepción y escaparates.',
      features: [
        'Colores y tamaños personalizados',
        'Iluminación LED eficiente',
        'Materiales resistentes a la intemperie',
        'Instalación profesional disponible'
      ],
      priceFrom: '$219'
    },
    {
      icon: Lightbulb,
      name: 'Letreros LED Neón',
      description: 'Letreros LED de neón personalizados que dan vida a tu marca con colores vibrantes y diseño moderno.',
      features: [
        'Formas y textos personalizados',
        'Múltiples opciones de colores',
        'Bajo consumo de energía',
        'Control remoto incluido'
      ],
      priceFrom: '$299'
    },
    {
      icon: Package,
      name: 'Letras de Canal',
      description: 'Letras dimensionales profesionales para exteriores de edificios y escaparates con iluminación interna.',
      features: [
        'Construcción de aluminio duradera',
        'Iluminación LED interna',
        'Fuentes y tamaños personalizados',
        'Componentes certificados UL'
      ],
      priceFrom: 'Cotización Personalizada'
    },
    {
      icon: Package,
      name: 'Trofeos y Premios 3D',
      description: 'Trofeos y premios de acrílico personalizados, perfectos para reconocer logros y ocasiones especiales.',
      features: [
        'Grabado personalizado',
        'Múltiples opciones de diseño',
        'Material de acrílico premium',
        'Entrega rápida'
      ],
      priceFrom: '$215'
    }
  ];

  const logoPlans = [
    {
      name: 'PAQUETE BÁSICO',
      price: '$190',
      description: 'Perfecto para startups o individuos en busca de una solución rápida y económica de identidad de marca.',
      features: [
        'Diseño de logo personalizado',
        'Hasta 3 rondas de revisiones',
        'Logo final en .PNG y .JPG (alta res)',
        'Un concepto de diseño',
        'Tiempo de entrega: 5 días'
      ]
    },
    {
      name: 'PAQUETE ESTÁNDAR',
      price: '$290',
      popular: true,
      description: 'Diseñado para pequeñas y medianas empresas que buscan perfeccionar su logo.',
      features: [
        'Diseño de logo personalizado',
        'Hasta 7 rondas de revisiones',
        'Logo final en .PNG y .JPG (alta res)',
        'Dos conceptos iniciales para elegir',
        'Versión en blanco y negro',
        'Tiempo de entrega: 5 días'
      ]
    },
    {
      name: 'PAQUETE PREMIUM',
      price: '$390',
      description: 'Diseñado para empresas en busca de una solución integral de identidad de marca.',
      features: [
        'Diseño de logo personalizado',
        'Hasta 7 rondas de revisiones',
        'Logo final en .PNG, .JPG, .SVG, .PDF',
        'Tres conceptos iniciales',
        'Guía de estilo de marca (colores + fuentes)',
        'Archivos editables (.AI, .EPS)',
        'Set de branding: tarjeta, membrete, firma de email',
        'Tiempo de entrega: 7 días'
      ]
    }
  ];

  const webDesignPlans = [
    {
      name: 'LANDING PAGE',
      price: '$490',
      popular: false,
      description: 'Página de aterrizaje profesional perfecta para promociones, campañas o validación de ideas.',
      features: [
        '1 página optimizada',
        'Diseño responsive (móvil y tablet)',
        'Integración de formulario de contacto',
        'Optimización SEO básica',
        'Integración con Google Analytics',
        'Enlaces a redes sociales',
        '15 días de soporte gratis',
        'Asistencia en configuración de hosting',
        'Tiempo de entrega: 1 semana'
      ]
    },
    {
      name: 'PÁGINA WEB FULL',
      price: '$890',
      popular: true,
      description: 'Sitio web completo con implementación de herramientas, usuarios y funcionalidades adaptadas a tu negocio.',
      features: [
        'Hasta 5 páginas personalizadas',
        'Sistema de usuarios y autenticación',
        'Panel de administración',
        'Herramientas adaptadas al negocio',
        'Base de datos integrada',
        'Diseño responsive completo',
        'Optimización SEO avanzada',
        'Integración de pagos (opcional)',
        'Google Maps y Analytics',
        '30 días de soporte gratis',
        'Tiempo de entrega: 2-3 semanas'
      ]
    }
  ];

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
                <h1 className="text-5xl lg:text-7xl font-black mb-4 tracking-tight uppercase">
                  Nuestros Servicios
                </h1>
                <p className="text-xl lg:text-2xl text-muted mb-8">
                  Soluciones completas para tu negocio: Letreros, Diseño de Logos y Desarrollo Web
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sign Services */}
        <section className="section-spacing bg-white">
          <div className="container-fresh">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl lg:text-4xl font-black mb-4 uppercase tracking-tight">
                Fabricación de Letreros
              </h2>
              <p className="text-lg text-muted">
                Letreros personalizados de alta calidad para hacer destacar tu negocio
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {signServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-2 border-border rounded-2xl p-8 bg-white hover:shadow-xl hover:border-accent transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black mb-1 uppercase">{service.name}</h3>
                        <p className="text-sm text-muted">{service.description}</p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-text">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-xs text-muted uppercase">Desde</span>
                        <p className="text-2xl font-black text-accent">{service.priceFrom}</p>
                      </div>
                      <Button 
                        onClick={() => setChatOpen(true)}
                        className="bg-accent hover:bg-accent-hover text-white font-bold"
                      >
                        Cotizar
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Logo Design */}
        <section className="section-spacing bg-bg">
          <div className="container-fresh">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Palette className="w-8 h-8 text-accent" />
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">
                  Diseño de Logos
                </h2>
              </div>
              <p className="text-lg text-muted">
                Logos profesionales que representan la identidad de tu marca
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
              {logoPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border-2 rounded-2xl p-6 bg-white hover:shadow-xl transition-all ${
                    plan.popular ? 'border-accent shadow-lg scale-105' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded-full mb-3 uppercase">
                      Más Popular
                    </div>
                  )}
                  
                  <h3 className="text-xl font-black mb-2 uppercase">{plan.name}</h3>
                  <div className="text-3xl font-black text-accent mb-2">{plan.price}</div>
                  <p className="text-xs text-muted mb-4">{plan.description}</p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-text">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => setChatOpen(true)}
                    className={`w-full h-10 font-bold uppercase text-sm ${
                      plan.popular 
                        ? 'bg-accent hover:bg-accent-hover text-white' 
                        : 'bg-secondary hover:bg-accent hover:text-white text-text'
                    } transition-all`}
                  >
                    Empezar
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/logo-design">
                <Button className="pill-button">
                  Ver Más Detalles
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Web Design */}
        <section className="section-spacing bg-white">
          <div className="container-fresh">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe className="w-8 h-8 text-accent" />
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight">
                  Diseño de Páginas Web
                </h2>
              </div>
              <p className="text-lg text-muted">
                Sitios web profesionales diseñados para impulsar tu negocio
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {webDesignPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border-2 rounded-2xl p-8 bg-white hover:shadow-xl transition-all ${
                    plan.popular ? 'border-accent shadow-lg' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="inline-block px-4 py-1 bg-accent text-white text-xs font-bold rounded-full mb-4 uppercase">
                      Recomendado
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-black mb-2 uppercase">{plan.name}</h3>
                  <div className="text-4xl font-black text-accent mb-2">{plan.price}</div>
                  <p className="text-sm text-muted mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => setChatOpen(true)}
                    className={`w-full h-12 font-bold uppercase ${
                      plan.popular 
                        ? 'bg-accent hover:bg-accent-hover text-white' 
                        : 'bg-secondary hover:bg-accent hover:text-white text-text'
                    } transition-all`}
                  >
                    Empezar
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
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
                  ¿Listo para Comenzar?
                </h2>
                <p className="text-xl font-bold text-accent mb-4">
                  Habla con Nico, Nuestro Asistente de IA
                </p>
                <p className="text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
                  Nuestro asistente virtual está listo para ayudarte a encontrar la solución perfecta para tu negocio. Recibe una cotización personalizada en minutos.
                </p>
                <Button 
                  onClick={() => setChatOpen(true)}
                  className="pill-button text-lg px-12 h-14"
                >
                  Hablar con Nico IA
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <NicoAIChat open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}