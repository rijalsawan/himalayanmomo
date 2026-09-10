'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Sparkles, Clock, Award, Users, Timer, Star, Trophy, Heart, Zap, Target, TrendingUp, Shield, ThumbsUp, CheckCircle, Percent, LucideIcon } from 'lucide-react';
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
      className="relative min-h-screen flex items-center overflow-hidden bg-warm-light bg-dot-grid border-b-[3px] border-dark"
    >
      {/* Hard-edged floating shapes (brutalist stand-in for the old soft gradient blobs) */}
      <div className="absolute top-24 -right-16 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-brand border-brutal hidden sm:block animate-float-1" aria-hidden="true" />
      <div className="absolute bottom-16 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-golden border-brutal rotate-[12deg] hidden sm:block animate-float-2" aria-hidden="true" />

      {/* Main Content */}
      <div className="container-custom relative z-10 pt-28 pb-16 lg:pt-24 w-full min-w-0">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1 relative min-w-0">
            {/* Badge */}
            <div className="eyebrow-brutal animate-fade-up">
              <span className="relative w-4 h-4 flex-shrink-0 overflow-hidden">
                <Image src={settings.heroLogo || '/brandlogo.svg'} alt="" fill className="object-contain" />
              </span>
              {settings.heroBadgeText}
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-[4.2rem] font-extrabold text-dark mt-6 leading-[0.98] tracking-tight animate-fade-up delay-2 break-words">
              {settings.heroHeadingLine1}{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative font-accent italic text-brand">{settings.heroHighlightText}</span>
              </span>
              <br />
              <span className="text-dark">{settings.heroHeadingLine2}</span>
            </h1>
            {/* Description */}
            <p className="text-dark/70 text-lg mt-6 max-w-xl leading-relaxed animate-fade-up delay-3">
              {settings.heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-8 animate-fade-up delay-4">
              <Link href="/menu" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-heading font-bold text-base px-7 py-3.5 border-brutal bg-dark text-warm-light shadow-brutal-sm brutal-hover hover:shadow-brutal hover:bg-brand transition-colors">
                  Explore Menu
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/checkout" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-heading font-bold text-base px-7 py-3.5 border-brutal bg-warm-light text-dark shadow-brutal-sm brutal-hover hover:shadow-brutal hover:bg-cream transition-colors">
                  Order for Pickup
                </button>
              </Link>
            </div>

            {/* Stats Strip */}
            <div className="flex flex-wrap items-stretch gap-3 sm:gap-4 mt-10 animate-fade-up delay-5">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 border-brutal-thin bg-warm-light px-4 py-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 border-[1.5px] border-dark bg-golden/40 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-dark" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-dark font-heading leading-tight">
                      {stat.value}
                    </div>
                    <div className="font-mono-brutal text-dark/60 text-[10px] sm:text-[11px] uppercase tracking-wide leading-tight whitespace-nowrap">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Logo as the hero's main visual asset */}
          <div className="order-1 lg:order-2 relative animate-fade-in delay-2 min-w-0">
            <div className="relative mx-auto w-full max-w-[230px] sm:max-w-[340px] lg:max-w-[400px] aspect-square">
              {/* Animated dashed rings orbiting the logo, brutalist stand-ins for a "seal" badge */}
              <div className="absolute -inset-3 sm:-inset-5 rounded-full border-2 border-dashed border-brand/50 animate-spin-slow pointer-events-none" aria-hidden="true" />
              <div className="absolute -inset-6 sm:-inset-9 rounded-full border-2 border-dashed border-golden/40 animate-spin-slow-reverse pointer-events-none" aria-hidden="true" />

              {/* Main logo panel - the centerpiece asset, circular to match the brand seal */}
              <div className="absolute inset-0 rounded-full border-brutal bg-warm-light shadow-brutal-lg overflow-hidden">
                {!settingsLoaded ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream">
                    <div className="w-16 h-16 border-[3px] border-dashed border-dark/30 rounded-full animate-spin-slow" />
                    <span className="font-mono-brutal text-[10px] uppercase tracking-widest text-dark/40">Loading logo...</span>
                  </div>
                ) : (
                  <Image
                    src={settings.heroLogo || '/brandlogo.svg'}
                    alt="MO:MO Station logo"
                    fill
                    priority
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 400px"
                    className="object-contain p-5 sm:p-6"
                  />
                )}
              </div>

              {/* Floating promo chip */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-6 sm:bottom-6 flex items-center gap-2 bg-brand text-warm-light border-brutal shadow-brutal-sm pl-2 pr-4 py-2 animate-float-2 whitespace-nowrap z-10">
                <span className="flex items-center justify-center w-7 h-7 border-[1.5px] border-warm-light/40 flex-shrink-0">
                  <Percent className="w-3.5 h-3.5" />
                </span>
                <span className="font-mono-brutal text-[11px] font-bold tracking-wide uppercase">10% Off Online Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee ticker strip */}
        <div className="mt-12 lg:mt-20 relative overflow-hidden border-y-[2px] border-dark py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee">
            {Array.from({ length: 2 }).map((_, loopIndex) => (
              <div key={loopIndex} className="flex items-center flex-shrink-0" aria-hidden={loopIndex === 1}>
                {['Steamed', 'Fried', 'Jhol Momo', 'Chili Momo', 'Pickup Only', 'Online Ordering'].map((word) => (
                  <span key={word} className="flex items-center">
                    <span className="font-mono-brutal text-xs sm:text-sm font-bold uppercase tracking-widest text-dark/50 px-6">
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 bg-brand flex-shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
