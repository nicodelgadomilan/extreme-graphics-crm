"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      portfolio: 'Portafolio',
      logoDesign: 'Diseño de Logo',
      faq: 'Preguntas Frecuentes',
      contact: 'Contacto',
      admin: 'Admin'
    },
    hero: {
      title: 'Letreros Profesionales que Impulsan tu Negocio',
      subtitle: 'Fabricación personalizada, instalación profesional y envíos a todo Estados Unidos. Recibe tu mockup y presupuesto en 24 horas.',
      badge1: '15+ años',
      badge2: 'Envíos a todo EE.UU.',
      badge3: 'Mockup en 24h',
      cta: 'Solicitar Presupuesto',
      whatsapp: 'WhatsApp',
      nicoAI: 'Hablar con Nico IA',
      mockupTitle: 'Tu Diseño Aquí',
      mockupSubtitle: 'Visualización 3D realista incluida'
    },
    categories: {
      title: 'Tipos de Letreros',
      subtitle: 'Selecciona el tipo de letrero perfecto para tu negocio',
      imageComingSoon: 'Imagen próximamente',
      cta: 'Cotizar',
      acrylicPlate: {
        label: 'Acrílico Placa',
        benefit: 'Estos letreros están fabricados sobre una placa de acrílico de 1/4" espesor con impresión directa UV, lo que los hace altamente resistentes, duraderos y aptos para colocar tanto en interiores como exteriores.'
      },
      multilayer3D: {
        label: 'Multicapa 3D',
        benefit: 'Letreros de mayor impacto visual, fabricados con varias capas de acrílico recortado e impreso, generando un efecto 3D. Son piezas más detalladas, con acabados artesanales ideales para ambientes interiores donde se busca destacar.'
      },
      acrylicLetters: {
        label: 'Letras Acrílicas',
        benefit: 'Letras individuales con acabado premium'
      },
      pvcLetters: {
        label: 'Letras PVC con Cara Acrílica',
        benefit: 'Opción de mayor solidez y cuerpo visual. Fabricadas en PVC de media pulgada con una cara frontal de acrílico de 1/4", combinan volumen y detalle. Recomendadas para interiores que buscan un impacto visual con calidad superior sin llegar al costo del multicapa.'
      },
      indoorOutdoor: {
        label: 'Indoor/Outdoor',
        benefit: 'Letras corporales de aluminio con frente de acrílico e iluminación LED. Fabricación robusta para uso en interiores o exteriores, con acabados profesionales y alta visibilidad tanto de día como de noche.'
      }
    },
    portfolio: {
      title: 'Trabajos Destacados',
      subtitle: 'Proyectos reales que transformaron negocios',
      imageComingSoon: 'Galería próximamente',
      viewAll: 'Ver Portfolio Completo'
    },
    testimonials: {
      title: 'Lo Que Dicen Nuestros Clientes',
      subtitle: 'Más de 500 empresas confían en nosotros',
      items: [
        {
          name: 'María González',
          business: 'Cafetería Luna',
          text: 'El letrero que nos hicieron superó nuestras expectativas. La calidad es increíble y el servicio fue excelente.',
          rating: 5
        },
        {
          name: 'Carlos Rodríguez',
          business: 'Taller Mecánico Pro',
          text: 'Profesionales de principio a fin. El mockup nos ayudó a visualizar todo antes de producir. 100% recomendados.',
          rating: 5
        },
        {
          name: 'Ana Martínez',
          business: 'Boutique Elegance',
          text: 'Excelente trabajo y muy rápidos. En menos de una semana teníamos nuestro letrero instalado y se ve espectacular.',
          rating: 5
        }
      ]
    },
    process: {
      title: 'Proceso Simple y Rápido',
      subtitle: 'De la idea a la instalación en pocos días',
      steps: [
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
      ]
    },
    guarantees: {
      title: 'Nuestra Garantía',
      items: [
        {
          title: '100% Satisfacción',
          description: 'Si no te gusta, lo rehacemos sin costo'
        },
        {
          title: 'Materiales Premium',
          description: 'Solo usamos materiales de primera calidad'
        },
        {
          title: 'Garantía Extendida',
          description: '2 años en interior, 1 año en exterior'
        },
        {
          title: 'Envío Seguro',
          description: 'Empaque protegido y rastreo incluido'
        }
      ]
    },
    whyChooseUs: {
      title: '¿Por Qué Elegirnos?',
      subtitle: 'Calidad, rapidez y servicio profesional garantizado',
      items: [
        {
          title: 'Materiales Premium',
          description: 'Usamos solo materiales de la más alta calidad con garantía extendida'
        },
        {
          title: 'Entrega Rápida',
          description: 'Mockup en 24h y producción express disponible'
        },
        {
          title: 'Instalación Profesional',
          description: 'Equipo certificado para instalación segura y precisa'
        },
        {
          title: '10+ Años de Experiencia',
          description: 'Más de 500 proyectos exitosos en todo Estados Unidos'
        }
      ]
    },
    logoCTA: {
      badge: 'Diseño de Logo',
      title: '¿Necesitas un Logo Profesional?',
      description: 'Creamos logos que representan la esencia de tu marca y destacan en cualquier formato.',
      benefit1: 'Diseño 100% original y personalizado',
      benefit2: 'Múltiples revisiones incluidas',
      benefit3: 'Archivos en todos los formatos',
      cta: 'Ver Planes de Logo',
      visualTitle: 'Diseño Profesional'
    },
    faq: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Todo lo que necesitas saber sobre nuestros servicios',
      items: [
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
      ]
    },
    footer: {
      tagline: 'Letreros profesionales que transforman negocios en todo Estados Unidos.',
      contact: 'Contacto',
      services: 'Servicios',
      info: 'Información',
      signs: 'Letreros',
      logoDesign: 'Diseño de Logo',
      webDesign: 'Diseño Web',
      vehicleGraphics: 'Gráfica Vehicular',
      shipping: 'Envíos a todo EE.UU.',
      hours: 'Lun-Vie 9AM-6PM EST',
      faq: 'Preguntas Frecuentes',
      rights: 'Todos los derechos reservados.',
      shippingBanner: 'Envíos a todos los estados desde Miami, FL'
    },
    logoDesign: {
      hero: {
        title: 'Diseño de Logo Profesional',
        subtitle: 'Crea una identidad visual memorable para tu marca',
        description: 'Nuestro equipo de diseñadores expertos creará un logo único que capture la esencia de tu negocio y destaque en cualquier medio.'
      },
      contact: {
        speak: 'Habla con un especialista',
        email: 'nicoextremegraphics@gmail.com'
      },
      title: 'Obtén tu Diseño de Logo',
      tagline: 'Innova. Personaliza. Destaca.',
      plans: {
        title: 'Paquetes de Diseño de Logo',
        subtitle: '¡Elige la opción de diseño de logo personalizado que mejor se adapte a tus necesidades!',
        basic: {
          name: 'PAQUETE BÁSICO',
          price: '$190',
          description: 'Perfecto para startups o individuos en busca de una solución de identidad de marca rápida y económica.',
          features: [
            'Diseño de logo personalizado.',
            'Hasta 3 rondas de revisiones.',
            'Entrega final del logo en formatos .PNG y .JPG (alta resolución).',
            'Un concepto de diseño.',
            'Tiempo de entrega: 5 días.'
          ],
          cta: 'Comenzar'
        },
        standard: {
          name: 'PAQUETE ESTÁNDAR',
          price: '$290',
          popular: 'MÁS POPULAR',
          description: 'Diseñado para pequeñas y medianas empresas que buscan refinar su logo.',
          features: [
            'Diseño de logo personalizado.',
            'Hasta 7 rondas de revisiones.',
            'Entrega final del logo en formatos .PNG y .JPG (alta resolución).',
            'Dos conceptos iniciales para elegir.',
            'Versión en blanco y negro.',
            'Tiempo de entrega: 5 días.'
          ],
          cta: 'Comenzar'
        },
        premium: {
          name: 'PAQUETE PREMIUM',
          price: '$390',
          description: 'Diseñado para empresas en busca de una solución integral de identidad de marca.',
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
          ],
          cta: 'Comenzar'
        }
      },
      portfolio: {
        title: 'Mira Nuestro Trabajo',
        subtitle: 'Ve cómo hemos ayudado a empresas como la tuya a crear logos impresionantes y memorables que destacan de la competencia.'
      },
      process: {
        title: 'Nuestro Proceso',
        steps: [
          {
            title: 'Consulta',
            description: 'Discutimos tu visión, valores de marca y preferencias de diseño.'
          },
          {
            title: 'Creación de Conceptos',
            description: 'Nuestros diseñadores crean conceptos iniciales basados en tus requisitos.'
          },
          {
            title: 'Refinamiento',
            description: 'Trabajamos contigo para refinar y perfeccionar tu diseño elegido.'
          },
          {
            title: 'Entrega Final',
            description: 'Recibe tu logo en todos los formatos requeridos, listo para usar.'
          }
        ]
      },
      finalCTA: {
        title: 'Hazlo Tuyo',
        subtitle: 'Personaliza Tu Arte',
        description: '¡Envía tu diseño y lo convertiremos en arte! Nuestros artistas expertos crearán una pieza personalizada que te encantará. Déjanos ayudarte a dar vida a tu visión.',
        cta: 'Obtén una Cotización Gratis'
      },
      faq: {
        title: 'Preguntas Frecuentes',
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
    }
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      portfolio: 'Portfolio',
      logoDesign: 'Logo Design',
      faq: 'FAQ',
      contact: 'Contact',
      admin: 'Admin'
    },
    hero: {
      title: 'Professional Signs that Boost Your Business',
      subtitle: 'Custom fabrication, professional installation, and nationwide shipping. Get your mockup and quote in 24 hours.',
      badge1: '15+ years',
      badge2: 'Shipping to all US',
      badge3: 'Mockup in 24h',
      cta: 'Get a Quote',
      whatsapp: 'WhatsApp',
      nicoAI: 'Talk to Nico AI',
      mockupTitle: 'Your Design Here',
      mockupSubtitle: 'Realistic 3D visualization included'
    },
    categories: {
      title: 'Sign Types',
      subtitle: 'Choose the perfect sign type for your business',
      imageComingSoon: 'Image coming soon',
      cta: 'Get Quote',
      acrylicPlate: {
        label: 'Acrylic Plate',
        benefit: 'These signs are made on a 1/4" thick acrylic plate with direct UV printing, making them highly resistant, durable, and suitable for both indoor and outdoor placement.'
      },
      multilayer3D: {
        label: '3D Multilayer',
        benefit: 'Signs with greater visual impact, made with multiple layers of cut and printed acrylic, creating a 3D effect. They are more detailed pieces with artisanal finishes, ideal for indoor environments looking to stand out.'
      },
      acrylicLetters: {
        label: 'Acrylic Letters',
        benefit: 'Individual letters with premium finish'
      },
      pvcLetters: {
        label: 'PVC Letters with Acrylic Face',
        benefit: 'Option with greater solidity and visual body. Made of half-inch PVC with a 1/4" acrylic front face, combining volume and detail. Recommended for interiors seeking visual impact with superior quality without reaching the cost of multilayer.'
      },
      indoorOutdoor: {
        label: 'Indoor/Outdoor',
        benefit: 'Aluminum body channel letters with acrylic face and LED lighting. Robust fabrication for indoor or outdoor use, with professional finishes and high visibility both day and night.'
      }
    },
    portfolio: {
      title: 'Featured Work',
      subtitle: 'Real projects that transformed businesses',
      imageComingSoon: 'Gallery coming soon',
      viewAll: 'View Full Portfolio'
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Over 500 businesses trust us',
      items: [
        {
          name: 'Maria Gonzalez',
          business: 'Luna Café',
          text: 'The sign they made exceeded our expectations. The quality is incredible and the service was excellent.',
          rating: 5
        },
        {
          name: 'Carlos Rodriguez',
          business: 'Pro Mechanics Shop',
          text: 'Professionals from start to finish. The mockup helped us visualize everything before production. 100% recommended.',
          rating: 5
        },
        {
          name: 'Ana Martinez',
          business: 'Elegance Boutique',
          text: 'Excellent work and very fast. In less than a week we had our sign installed and it looks spectacular.',
          rating: 5
        }
      ]
    },
    process: {
      title: 'Simple and Fast Process',
      subtitle: 'From idea to installation in just a few days',
      steps: [
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
      ]
    },
    guarantees: {
      title: 'Our Guarantee',
      items: [
        {
          title: '100% Satisfaction',
          description: "If you don't like it, we'll remake it at no cost"
        },
        {
          title: 'Premium Materials',
          description: 'We only use top-quality materials'
        },
        {
          title: 'Extended Warranty',
          description: '2 years indoor, 1 year outdoor'
        },
        {
          title: 'Safe Shipping',
          description: 'Protected packaging and tracking included'
        }
      ]
    },
    whyChooseUs: {
      title: 'Why Choose Us?',
      subtitle: 'Quality, speed, and guaranteed professional service',
      items: [
        {
          title: 'Premium Materials',
          description: 'We use only the highest quality materials with extended warranty'
        },
        {
          title: 'Fast Delivery',
          description: '24h mockup and express production available'
        },
        {
          title: 'Professional Installation',
          description: 'Certified team for safe and precise installation'
        },
        {
          title: '10+ Years Experience',
          description: 'Over 500 successful projects across the United States'
        }
      ]
    },
    logoCTA: {
      badge: 'Logo Design',
      title: 'Need a Professional Logo?',
      description: 'We create logos that represent your brand essence and stand out in any format.',
      benefit1: '100% original and custom design',
      benefit2: 'Multiple revisions included',
      benefit3: 'Files in all formats',
      cta: 'View Logo Plans',
      visualTitle: 'Professional Design'
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about our services',
      items: [
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
      ]
    },
    footer: {
      tagline: 'Professional signs that transform businesses across the United States.',
      contact: 'Contact',
      services: 'Services',
      info: 'Information',
      signs: 'Signs',
      logoDesign: 'Logo Design',
      webDesign: 'Web Design',
      vehicleGraphics: 'Vehicle Graphics',
      shipping: 'Shipping to all US',
      hours: 'Mon-Fri 9AM-6PM EST',
      faq: 'FAQ',
      rights: 'All rights reserved.',
      shippingBanner: 'Shipping to all states from Miami, FL'
    },
    logoDesign: {
      hero: {
        title: 'Professional Logo Design',
        subtitle: 'Create a memorable visual identity for your brand',
        description: 'Our team of expert designers will create a unique logo that captures your business essence and stands out in any medium.'
      },
      contact: {
        speak: 'Talk to a specialist',
        email: 'nicoextremegraphics@gmail.com'
      },
      title: 'Get Your Logo Design',
      tagline: 'Innova. Personalize. Stand out.',
      plans: {
        title: 'Logo Design Packages',
        subtitle: 'Choose the custom logo design package that best fits your needs!',
        basic: {
          name: 'BASIC PACKAGE',
          price: '$190',
          description: 'Perfect for startups or individuals looking for a quick and affordable brand identity solution.',
          features: [
            'Custom logo design.',
            'Up to 3 rounds of revisions.',
            'Final logo delivered in .PNG and .JPG (high resolution).',
            'One design concept.',
            'Delivery time: 5 days.'
          ],
          cta: 'Start Now'
        },
        standard: {
          name: 'STANDARD PACKAGE',
          price: '$290',
          popular: 'MOST POPULAR',
          description: 'Designed for small and medium businesses looking to refine their logo.',
          features: [
            'Custom logo design.',
            'Up to 7 rounds of revisions.',
            'Final logo delivered in .PNG and .JPG (high resolution).',
            'Two initial concepts to choose from.',
            'Black and white version.',
            'Delivery time: 5 days.'
          ],
          cta: 'Start Now'
        },
        premium: {
          name: 'PREMIUM PACKAGE',
          price: '$390',
          description: 'Designed for businesses seeking an integrated brand identity solution.',
          features: [
            'Custom logo design.',
            'Up to 7 rounds of revisions.',
            'Final logo in .PNG, .JPG, .SVG, .PDF.',
            'Three initial concepts.',
            'Black and white version.',
            'Brand style guide (colors + fonts).',
            'Editable files (.AI, .EPS).',
            'Mini branding set: business card, letterhead, email signature.',
            'Delivery time: 7 days.'
          ],
          cta: 'Start Now'
        }
      },
      portfolio: {
        title: 'Check Our Work',
        subtitle: 'See how we helped businesses like yours create impressive and memorable logos that stand out from the competition.'
      },
      process: {
        title: 'Our Process',
        steps: [
          {
            title: 'Consultation',
            description: 'We discuss your vision, brand values, and design preferences.'
          },
          {
            title: 'Concept Creation',
            description: 'Our designers create initial concepts based on your requirements.'
          },
          {
            title: 'Refinement',
            description: 'We work with you to refine and perfect your chosen design.'
          },
          {
            title: 'Final Delivery',
            description: 'Receive your logo in all required formats, ready to use.'
          }
        ]
      },
      finalCTA: {
        title: 'Make It Yours',
        subtitle: 'Personalize Your Art',
        description: 'Send us your design and we will turn it into art! Our expert artists will create a personalized piece that you will love. Let us help you bring your vision to life.',
        cta: 'Get a Free Quote'
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            question: 'How long does it take to receive my logo?',
            answer: 'Delivery times vary by package: Basic and Standard packages take 5 days, while the Premium package takes 7 days. URGENT delivery options may be available upon request.'
          },
          {
            question: 'What if I need revisions?',
            answer: 'All packages include multiple rounds of revisions. The Basic package includes 3 rounds, while Standard and Premium packages include up to 7 rounds to ensure your complete satisfaction.'
          },
          {
            question: 'What file formats will I receive?',
            answer: 'File formats vary by package. All packages include high-resolution PNG and JPG files. The Premium package also includes SVG, PDF, AI, and EPS formats for maximum flexibility.'
          },
          {
            question: 'Can I use my logo for commercial purposes?',
            answer: 'Yes! Once your logo is complete and paid for, you own all rights to use it for any commercial or personal purpose.'
          },
          {
            question: 'Do they offer branding services beyond logo design?',
            answer: 'Yes! Our Premium package includes a mini branding set with business card, letterhead, and email signature designs. We also offer complete branding services - contact us for more information.'
          }
        ]
      }
    }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        setLanguage(savedLang);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}