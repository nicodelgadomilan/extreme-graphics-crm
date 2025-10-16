"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export function Categories() {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'acrylic-plate',
      image: 'https://i.ibb.co/VWRpvNFB/Captura-de-pantalla-2025-10-15-a-las-1-44-06-p-m.png',
      label: t('categories.acrylicPlate.label'),
      benefit: t('categories.acrylicPlate.benefit')
    },
    {
      id: '3d-multilayer',
      image: 'https://i.ibb.co/GvKjgDSm/Captura-de-pantalla-2025-10-15-a-las-1-45-13-p-m.png',
      label: t('categories.multilayer3D.label'),
      benefit: t('categories.multilayer3D.benefit')
    },
    {
      id: 'acrylic-letters',
      image: 'https://i.ibb.co/8gRLmgVx/Captura-de-pantalla-2025-10-15-a-las-1-49-18-p-m.png',
      label: t('categories.acrylicLetters.label'),
      benefit: t('categories.acrylicLetters.benefit')
    },
    {
      id: 'pvc-letters',
      image: 'https://i.ibb.co/1YJXT2z4/Whats-App-Image-2025-10-15-at-13-51-17.jpg',
      label: t('categories.pvcLetters.label'),
      benefit: t('categories.pvcLetters.benefit')
    },
    {
      id: 'indoor-outdoor',
      image: 'https://image.made-in-china.com/2f0j00sGLozyQFArkO/LED-Channel-Letter-Signage-with-Flush-Edge-Metal-Fabricated-Letter-Sign.jpg',
      label: t('categories.indoorOutdoor.label'),
      benefit: t('categories.indoorOutdoor.benefit')
    }
  ];

  return (
    <section id="services" className="section-spacing bg-white">
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
              {t('categories.title')}
            </h2>
            <p className="text-lg text-muted">
              {t('categories.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-fresh p-6"
            >
              {/* Image */}
              <div className="aspect-[4/3] bg-secondary rounded-2xl mb-6 overflow-hidden">
                {category.image.startsWith('http') ? (
                  <img 
                    src={category.image} 
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-3 bg-accent/10 rounded-xl flex items-center justify-center">
                        <span className="text-3xl font-black text-accent">{index + 1}</span>
                      </div>
                      <p className="text-sm text-muted">{t('categories.imageComingSoon')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Label - Now more prominent */}
              <h3 className="text-xl font-bold text-accent mb-4">
                {category.label}
              </h3>

              {/* Benefit - Full description visible */}
              <p className="text-sm text-muted leading-relaxed">
                {category.benefit}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}