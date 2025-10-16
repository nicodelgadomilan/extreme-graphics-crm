"use client";

import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Categories } from '@/components/landing/Categories';
import { Process } from '@/components/landing/Process';
import { Portfolio } from '@/components/landing/Portfolio';
import { Guarantees } from '@/components/landing/Guarantees';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { Testimonials } from '@/components/landing/Testimonials';
import { LogoCTA } from '@/components/landing/LogoCTA';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { MobileCTA } from '@/components/landing/MobileCTA';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Process />
        <Portfolio />
        <Guarantees />
        <WhyChooseUs />
        <Testimonials />
        <LogoCTA />
        <FAQ />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
}