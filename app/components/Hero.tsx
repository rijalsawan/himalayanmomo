'use client';

import { ArrowRight, ArrowDown, Sparkles, Clock, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#FDF8F3]"
    >
      {/* Animated Gradient Background - CSS only */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-primary/25 via-[#F4A261]/15 to-transparent blur-3xl animate-blob-1" />
        <div className="absolute -bottom-40 -left-40 w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-[#F4A261]/25 via-primary/15 to-transparent blur-3xl animate-blob-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-r from-primary/5 via-[#F4A261]/10 to-primary/5 blur-3xl animate-blob-3" />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Floating decorative shapes */}
      <div className="absolute top-32 right-[20%] w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 border border-primary/20 hidden lg:block animate-float-1" />
      <div className="absolute bottom-40 left-[15%] w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F4A261]/20 border border-[#F4A261]/30 hidden lg:block animate-float-2" />
      <div className="absolute top-1/2 right-[8%] w-8 h-8 rounded-lg bg-[#2D6A4F]/20 border border-[#2D6A4F]/30 hidden xl:block animate-float-3" />

      {/* Main Content */}
      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="animate-fade-up delay-1">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Authentic Nepali Cuisine
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-[#1A1A1A] mt-6 leading-[1.1] animate-fade-up delay-2">
              Taste the{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Himalayan</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#F4A261]/30 -z-0 animate-scale-x delay-4" />
              </span>
              <br />
              <span className="text-[#1A1A1A]">Magic in Every Bite</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg mt-6 max-w-xl leading-relaxed animate-fade-up delay-3">
              Handcrafted momos made fresh daily using traditional family recipes 
              passed down through generations. Experience the authentic flavors of Nepal.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-up delay-4">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-[#B8420A] text-white group px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Explore Menu
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 sm:gap-10 mt-12 animate-fade-up delay-5">
              {[
                { icon: Award, value: '15+', label: 'Years Experience' },
                { icon: Users, value: '50K+', label: 'Happy Customers' },
                { icon: Clock, value: '20min', label: 'Avg. Prep Time' },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A]/5 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#1A1A1A] font-heading">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="order-1 lg:order-2 relative animate-fade-in delay-2">
            {/* Main circular image container */}
            <div className="relative mx-auto w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#F4A261]/20 animate-spin-slow-reverse" />
              
              {/* Main image - with clip-path to ensure perfect circle */}
              <div className="absolute inset-8 rounded-full overflow-hidden shadow-2xl shadow-primary/20">
                <div className="absolute inset-[-10%] w-[120%] h-[120%]">
                  <Image
                    src="/momo.webp"
                    alt="Delicious Momos"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating badge cards */}
              <div className="absolute left-0 sm:-left-8 top-1/4 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg sm:shadow-xl shadow-black/10 animate-fade-in-left delay-5 animate-float-card-1 max-w-[120px] sm:max-w-none">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#2D6A4F]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-2xl">🥟</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-sm font-semibold text-[#1A1A1A]">Fresh Daily</div>
                    <div className="text-[9px] sm:text-xs text-gray-500">Handcrafted</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 sm:-right-8 bottom-1/4 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg sm:shadow-xl shadow-black/10 animate-fade-in-right delay-6 animate-float-card-2 max-w-[120px] sm:max-w-none">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-2xl">🌶️</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] sm:text-sm font-semibold text-[#1A1A1A]">Spicy</div>
                    <div className="text-[9px] sm:text-xs text-gray-500">Mild to Hot</div>
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 sm:-bottom-6 bg-gradient-to-r from-primary to-[#B8420A] rounded-full px-3 sm:px-6 py-1.5 sm:py-3 shadow-lg sm:shadow-xl shadow-primary/30 animate-fade-up delay-7">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-white font-semibold text-[10px] sm:text-sm">⭐ 4.9</span>
                  <span className="text-white/70 text-[10px] sm:text-sm">2K+ Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors animate-fade-in delay-8"
      >
        <span className="text-xs uppercase tracking-widest font-medium hidden sm:block">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce-soft" />
      </button>
    </section>
  );
}
