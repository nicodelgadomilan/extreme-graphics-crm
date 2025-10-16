"use client";

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/lib/auth-client';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { data: session, refetch } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const { authClient } = await import('@/lib/auth-client');
      const { error } = await authClient.signOut();
      if (error?.code) {
        toast.error(error.code);
      } else {
        localStorage.removeItem('bearer_token');
        await refetch();
        router.push('/');
        toast.success(language === 'es' ? 'Sesión cerrada exitosamente' : 'Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error(language === 'es' ? 'Error al cerrar sesión' : 'Error signing out');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
      <nav className="container-fresh">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="https://i.ibb.co/pvYRfyNZ/logo.png" 
              alt="Extreme Graphics Logo" 
              className="h-14 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-text hover:text-accent transition-colors">
              {t('nav.home')}
            </a>
            <a href="/servicios" className="text-sm font-medium text-text hover:text-accent transition-colors">
              {t('nav.services')}
            </a>
            <a href="#portfolio" className="text-sm font-medium text-text hover:text-accent transition-colors">
              {t('nav.portfolio')}
            </a>
            <a href="/logo-design" className="text-sm font-medium text-text hover:text-accent transition-colors">
              {t('nav.logoDesign')}
            </a>
            <a href="#faq" className="text-sm font-medium text-text hover:text-accent transition-colors">
              {t('nav.faq')}
            </a>
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2 p-1 bg-secondary rounded-full">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  language === 'es' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-muted hover:text-text'
                }`}
              >
                🇪🇸
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  language === 'en' 
                    ? 'bg-white text-accent shadow-sm' 
                    : 'text-muted hover:text-text'
                }`}
              >
                🇺🇸
              </button>
            </div>

            {/* Auth Actions */}
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    {t('nav.admin')}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {language === 'es' ? 'Salir' : 'Logout'}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  {language === 'es' ? 'Iniciar Sesión' : 'Login'}
                </Button>
              </Link>
            )}

            <Button
              className="pill-button"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.cta')}
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-text"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border"
          >
            <div className="container-fresh py-6 space-y-4">
              <a href="/" className="block text-sm font-medium text-text hover:text-accent">
                {t('nav.home')}
              </a>
              <a href="/servicios" className="block text-sm font-medium text-text hover:text-accent">
                {t('nav.services')}
              </a>
              <a href="#portfolio" className="block text-sm font-medium text-text hover:text-accent">
                {t('nav.portfolio')}
              </a>
              <a href="/logo-design" className="block text-sm font-medium text-text hover:text-accent">
                {t('nav.logoDesign')}
              </a>
              <a href="#faq" className="block text-sm font-medium text-text hover:text-accent">
                {t('nav.faq')}
              </a>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                      language === 'es' ? 'bg-accent text-white' : 'bg-secondary text-muted'
                    }`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                      language === 'en' ? 'bg-accent text-white' : 'bg-secondary text-muted'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>

                {/* Mobile Auth Actions */}
                {session?.user ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        {t('nav.admin')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      {language === 'es' ? 'Iniciar Sesión' : 'Login'}
                    </Button>
                  </Link>
                )}
                
                <Button className="pill-button w-full">
                  {t('hero.cta')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}