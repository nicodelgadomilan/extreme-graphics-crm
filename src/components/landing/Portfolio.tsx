"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function Portfolio() {
  const { t } = useLanguage();

  // Imágenes reales del portafolio
  const images = [
    { id: 1, url: 'https://i.ibb.co/Lz1SfbZT/Whats-App-Image-2025-10-15-at-13-51-17.jpg', alt: 'Proyecto 1' },
    { id: 2, url: 'https://i.ibb.co/YTTWm9JR/Whats-App-Image-2025-10-15-at-14-18-20.jpg', alt: 'Proyecto 2' },
    { id: 3, url: 'https://i.ibb.co/hx2J42SW/Whats-App-Image-2025-10-15-at-14-18-21-1.jpg', alt: 'Proyecto 3' },
    { id: 4, url: 'https://i.ibb.co/PRfrbvH/Whats-App-Image-2025-10-15-at-14-18-21-2.jpg', alt: 'Proyecto 4' },
    { id: 5, url: 'https://i.ibb.co/hFw6KpBF/Whats-App-Image-2025-10-15-at-14-18-21-3.jpg', alt: 'Proyecto 5' },
    { id: 6, url: 'https://i.ibb.co/ynnyy1pV/Whats-App-Image-2025-10-15-at-14-18-21-4.jpg', alt: 'Proyecto 6' },
    { id: 7, url: 'https://i.ibb.co/7dsD882h/Whats-App-Image-2025-10-15-at-14-18-21-5.jpg', alt: 'Proyecto 7' },
    { id: 8, url: 'https://i.ibb.co/vxVrKy5N/Whats-App-Image-2025-10-15-at-14-18-21.jpg', alt: 'Proyecto 8' },
    { id: 9, url: 'https://i.ibb.co/4gSsn6QX/Whats-App-Image-2025-10-15-at-14-18-21-8.jpg', alt: 'Proyecto 9' }
  ];

  return (
    <section id="portfolio" className="section-spacing bg-white">
      <div className="container-fresh">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              {t('portfolio.title')}
            </h2>
            <p className="text-lg text-muted">
              {t('portfolio.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/portfolio" className="inline-flex items-center gap-2 pill-button">
            {t('portfolio.viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}