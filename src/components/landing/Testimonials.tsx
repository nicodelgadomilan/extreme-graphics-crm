"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Review {
  name: string;
  text: string;
  rating: number;
  time?: string;
  profilePhoto?: string;
}

export function Testimonials() {
  const { t, language } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);

  // Default testimonials as fallback
  const defaultTestimonials = language === 'es' ? [
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
  ] : [
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
  ];

  useEffect(() => {
    async function fetchGoogleReviews() {
      try {
        const response = await fetch('/api/google-reviews');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews.slice(0, 6)); // Show up to 6 reviews
          setAverageRating(data.averageRating);
          setTotalReviews(data.totalReviews);
        } else {
          // Use default testimonials if no reviews
          setReviews(defaultTestimonials);
        }
      } catch (error) {
        console.error('Error fetching Google reviews:', error);
        // Use default testimonials on error
        setReviews(defaultTestimonials);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGoogleReviews();
  }, [language]);

  const displayReviews = reviews.length > 0 ? reviews : defaultTestimonials;

  return (
    <section className="section-spacing bg-bg">
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
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-muted">
              {t('testimonials.subtitle')}
            </p>
            
            {/* Google Rating Badge */}
            {averageRating && totalReviews && !isLoading && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="flex items-center gap-1 bg-surface px-4 py-2 rounded-full border border-border shadow-sm">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-bold text-text">{averageRating.toFixed(1)}</span>
                  <span className="text-muted text-sm">
                    ({totalReviews} {language === 'es' ? 'reseñas' : 'reviews'})
                  </span>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
                    alt="Google" 
                    className="w-4 h-4 ml-2"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-fresh p-8 animate-pulse">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl mb-6"></div>
                <div className="h-4 bg-border rounded w-24 mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-border rounded"></div>
                  <div className="h-3 bg-border rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-border rounded w-32"></div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-3 gap-8">
            {displayReviews.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-fresh p-8"
              >
                {/* Quote Icon */}
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <Quote className="w-6 h-6 text-accent" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-text mb-6 leading-relaxed line-clamp-4">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    {'profilePhoto' in testimonial && testimonial.profilePhoto && (
                      <img 
                        src={testimonial.profilePhoto} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-bold text-text">{testimonial.name}</p>
                      {(testimonial as any).business && (
                        <p className="text-sm text-muted">{(testimonial as any).business}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}