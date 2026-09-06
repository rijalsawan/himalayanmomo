'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Sparkles, Clock, Award, Users, Timer, Star, Trophy, Heart, Zap, Target, TrendingUp, Shield, ThumbsUp, CheckCircle, Percent, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Award,
  Users,
  Clock,
  Timer,
  Star,
  Trophy,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
  Shield,
  ThumbsUp,
  CheckCircle,
};

interface SiteSettings {
  heroBadgeText: string;
  heroHeadingLine1: string;
  heroHighlightText: string;
  heroHeadingLine2: string;
  heroDescription: string;
  heroLogo: string;
  stat1Icon: string;
  stat1Value: string;
  stat1Label: string;
  stat2Icon: string;
  stat2Value: string;
  stat2Label: string;
  stat3Icon: string;
  stat3Value: string;
  stat3Label: string;
  testimonialStat1Value: string;
  testimonialStat2Value: string;
}

const defaultSettings: SiteSettings = {
  heroBadgeText: 'Authentic Nepali Mo:Mo',
  heroHeadingLine1: 'Taste the',
  heroHighlightText: 'Himalayan',
  heroHeadingLine2: 'Magic in Every Bite',
  heroDescription: 'Handcrafted momos made fresh daily using traditional family recipes passed down through generations. Experience the authentic flavors of Nepal.',
  heroLogo: '/brandlogo.svg',
  stat1Icon: 'Award',
  stat1Value: '15+',
  stat1Label: 'Years Experience',
  stat2Icon: 'Users',
  stat2Value: '50K+',
  stat2Label: 'Happy Customers',
  stat3Icon: 'Clock',
  stat3Value: '20min',
  stat3Label: 'Avg. Prep Time',
  testimonialStat1Value: '500+',
  testimonialStat2Value: '4.9',
};

// A subtle line-art mountain silhouette echoing the brand mark, used as a
// low-opacity background accent behind the heading (not a copy of the logo).
const MountainMotif = () => (
  <svg
    viewBox="0 0 400 160"
    fill="none"
    className="absolute -top-10 left-0 w-[280px] sm:w-[360px] opacity-[0.06] pointer-events-none select-none"
    aria-hidden="true"
  >
    <path
      d="M0 150 L60 70 L100 105 L150 30 L200 90 L240 55 L290 120 L330 80 L400 150 Z"
      stroke="var(--color-brand)"
      strokeWidth="3"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setSettingsLoaded(true);
      }
    };

    fetchSettings();
  }, []);

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

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Award;
  };

  const stats = [
    { icon: getIcon(settings.stat1Icon), value: settings.stat1Value, label: settings.stat1Label },
    { icon: getIcon(settings.stat2Icon), value: settings.stat2Value, label: settings.stat2Label },
    { icon: getIcon(settings.stat3Icon), value: settings.stat3Value, label: settings.stat3Label },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#FDF8F3]"
    >
      {/* Animated Gradient Background - CSS only */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-primary/20 via-[#F4A261]/15 to-transparent blur-3xl animate-blob-1" />
        <div className="absolute -bottom-40 -left-40 w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-[#F4A261]/20 via-primary/15 to-transparent blur-3xl animate-blob-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-r from-primary/5 via-[#F4A261]/10 to-primary/5 blur-3xl animate-blob-3" />

        {/* Faint topographic contour-line motif (nods to the Himalayan brand mark) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.05]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <pattern id="contours" width="220" height="220" patternUnits="userSpaceOnUse">
            <path d="M0 110 Q55 60 110 110 T220 110" stroke="#1A1A1A" strokeWidth="1" fill="none" />
            <path d="M0 150 Q55 100 110 150 T220 150" stroke="#1A1A1A" strokeWidth="1" fill="none" />
            <path d="M0 70 Q55 20 110 70 T220 70" stroke="#1A1A1A" strokeWidth="1" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#contours)" />
        </svg>
      </div>

      {/* Floating decorative shapes */}
      <div className="absolute top-32 right-[20%] w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 border border-primary/20 hidden lg:block animate-float-1" />
      <div className="absolute bottom-40 left-[15%] w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F4A261]/20 border border-[#F4A261]/30 hidden lg:block animate-float-2" />
      <div className="absolute top-1/2 right-[8%] w-8 h-8 rounded-lg bg-[#2D6A4F]/20 border border-[#2D6A4F]/30 hidden xl:block animate-float-3" />

      {/* Main Content */}
      <div className="container-custom relative z-10 pt-28 pb-16 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1 relative">
            <MountainMotif />

            {/* Badge */}
            <div className="relative inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-primary/15 shadow-sm animate-fade-up">
              <span className="relative w-6 h-6 rounded-full overflow-hidden bg-primary/5 flex-shrink-0">
                <Image src={settings.heroLogo || '/brandlogo.svg'} alt="" fill className="object-contain" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {settings.heroBadgeText}
              </span>
            </div>

            {/* Headline */}
            <h1 className="relative font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-[4.2rem] font-bold text-[#1A1A1A] mt-6 leading-[1.05] tracking-tight animate-fade-up delay-2">
              {settings.heroHeadingLine1}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">{settings.heroHighlightText}</span>
                <svg
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 w-full h-4 text-primary/30 animate-scale-x delay-4"
                  aria-hidden="true"
                >
                  <path d="M2 14 Q50 2 100 12 T198 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <br />
              <span className="text-[#1A1A1A]">{settings.heroHeadingLine2}</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg mt-6 max-w-xl leading-relaxed animate-fade-up delay-3">
              {settings.heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-up delay-4">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-[#7A0407] text-white group px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Explore Menu
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/checkout">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#1A1A1A]/10 hover:border-primary/40 hover:bg-primary/5 text-[#1A1A1A] px-8 rounded-full transition-all duration-300"
                >
                  Order for Pickup
                </Button>
              </Link>
            </div>

            {/* Stats Strip */}
            <div className="flex items-stretch gap-6 sm:gap-10 mt-12 pt-8 border-t border-[#1A1A1A]/10 animate-fade-up delay-5">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 relative">
                  {index > 0 && (
                    <span className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 h-8 w-px bg-[#1A1A1A]/10" />
                  )}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-heading leading-tight">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm leading-tight">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Brand Badge Showcase */}
          <div className="order-1 lg:order-2 relative animate-fade-in delay-2">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] aspect-square">
              {/* Soft red halo behind the badge */}
              <div className="absolute -inset-8 sm:-inset-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(179,6,10,0.16),transparent_65%)]" />

              {/* Rotating dashed ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/25 animate-spin-slow" />

              {/* Thin inner ring for depth */}
              <div className="absolute inset-5 sm:inset-7 rounded-full border border-primary/10" />

              {/* Logo badge */}
              <div className="absolute inset-9 sm:inset-12 rounded-full bg-white border-4 border-white shadow-2xl shadow-primary/25 overflow-hidden animate-float-card-1">
                {!settingsLoaded ? (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-[#F4A261]/10 animate-pulse-soft" />
                ) : (
                  <Image
                    src={settings.heroLogo || '/brandlogo.svg'}
                    alt="MO:MO Station logo"
                    fill
                    priority
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 400px"
                    className="object-contain p-3 sm:p-4"
                  />
                )}
              </div>

              {/* Floating rating chip */}
              <div className="absolute -left-2 sm:-left-8 top-4 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-xl shadow-black/5 border border-white animate-float-1">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1A1A] leading-tight">
                    {settings.testimonialStat2Value} <span className="text-gray-400 font-normal text-xs">/ 5</span>
                  </div>
                  <div className="text-[11px] text-gray-500 leading-tight whitespace-nowrap">
                    {settings.testimonialStat1Value} reviews
                  </div>
                </div>
              </div>

              {/* Floating promo chip */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-4 sm:bottom-10 flex items-center gap-2 bg-primary text-white rounded-full pl-2 pr-4 py-2 shadow-xl shadow-primary/30 animate-float-2 whitespace-nowrap">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15">
                  <Percent className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold tracking-wide">10% Off Online Orders</span>
              </div>

              {/* Floating fresh-daily chip */}
              <div className="hidden sm:flex absolute -right-2 top-1/3 items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2.5 shadow-lg shadow-black/5 border border-white animate-float-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Sparkles className="w-4 h-4 text-primary" />
                </span>
                <span className="text-xs font-semibold text-[#1A1A1A] whitespace-nowrap">Made Fresh Daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee ticker strip */}
        <div className="mt-10 lg:mt-20 relative overflow-hidden border-y border-[#1A1A1A]/10 py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee">
            {Array.from({ length: 2 }).map((_, loopIndex) => (
              <div key={loopIndex} className="flex items-center flex-shrink-0" aria-hidden={loopIndex === 1}>
                {['Steamed', 'Fried', 'Jhol Momo', 'Chili Momo', 'Pickup Only', 'Online Ordering'].map((word) => (
                  <span key={word} className="flex items-center">
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#1A1A1A]/40 px-6">
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('#about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#1A1A1A]/40 hover:text-primary transition-colors animate-fade-in delay-8"
      >
        <span className="text-[10px] uppercase tracking-widest font-medium hidden sm:block">Scroll</span>
        <span className="w-6 h-9 rounded-full border-2 border-current flex items-start justify-center p-1">
          <span className="w-1 h-1.5 rounded-full bg-current animate-bounce-soft" />
        </span>
        <ArrowDown className="w-3 h-3 sm:hidden animate-bounce-soft" />
      </button>
    </section>
  );
}
