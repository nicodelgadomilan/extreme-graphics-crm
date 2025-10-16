"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container-fresh py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="inline-block mb-4">
              <img 
                src="https://i.ibb.co/pvYRfyNZ/logo.png" 
                alt="Extreme Graphics Logo" 
                className="h-12 w-auto"
              />
            </a>
            <p className="text-sm text-muted leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-text mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <a href="mailto:nicoextremegraphics@gmail.com" className="flex items-start gap-3 text-sm text-muted hover:text-accent transition-colors">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>nicoextremegraphics@gmail.com</span>
              </a>
              <a href="tel:+17862881850" className="flex items-start gap-3 text-sm text-muted hover:text-accent transition-colors">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+1 (786) 288-1850</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-muted">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>1811 NW 79th Ave<br />Miami, FL 33126</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-text mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#services" className="hover:text-accent transition-colors">{t('footer.signs')}</a></li>
              <li><a href="/logo-design" className="hover:text-accent transition-colors">{t('footer.logoDesign')}</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">{t('footer.webDesign')}</a></li>
              <li><a href="#services" className="hover:text-accent transition-colors">{t('footer.vehicleGraphics')}</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-text mb-4">{t('footer.info')}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>{t('footer.shipping')}</li>
              <li>{t('footer.hours')}</li>
              <li><a href="#faq" className="hover:text-accent transition-colors">{t('footer.faq')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
            <p>© {new Date().getFullYear()} Extreme Graphics. {t('footer.rights')}</p>
            <p className="font-semibold">
              🚚 {t('footer.shippingBanner')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}