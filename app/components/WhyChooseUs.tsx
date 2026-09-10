'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import SectionBackdrop from './SectionBackdrop';
import { 
  ChefHat, 
  ScrollText, 
  Leaf, 
  Truck,
  Award,
  Star,
  Heart,
  Clock,
  Shield,
  Sparkles,
  Coffee,
  Utensils,
  MapPin,
  Phone,
  Globe,
  Package,
  Rocket,
  Smile,
  Gift,
  BadgeCheck,
  Users,
  Trophy,
  Target,
  ThumbsUp,
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  ChefHat,
  ScrollText,
  Leaf,
  Truck,
  Award,
  Star,
  Heart,
  Clock,
  Shield,
  Sparkles,
  Coffee,
  Utensils,
  MapPin,
  Phone,
  Globe,
  Package,
  Rocket,
  Smile,
  Gift,
  BadgeCheck,
  Users,
  Trophy,
  Target,
  ThumbsUp,
};

interface WhyChooseUsSettings {
  whySubtitle: string;
  whyHeadline: string;
  whyHighlightText: string;
  whyDescription: string;
  whyCtaText: string;
  whyFeature1Icon: string;
  whyFeature1Title: string;
  whyFeature1Desc: string;
  whyFeature2Icon: string;
  whyFeature2Title: string;
  whyFeature2Desc: string;
  whyFeature3Icon: string;
  whyFeature3Title: string;
  whyFeature3Desc: string;
  whyFeature4Icon: string;
  whyFeature4Title: string;
  whyFeature4Desc: string;
  sectionBackgroundStyle: string;
}

const defaultSettings: WhyChooseUsSettings = {
  whySubtitle: 'Why Choose Us',
  whyHeadline: 'What Makes Us',
  whyHighlightText: 'Special',
  whyDescription: "We're not just a restaurant — we're a family dedicated to bringing you the most authentic Nepali dining experience.",
  whyCtaText: 'Ready to experience the difference?',
  whyFeature1Icon: 'ChefHat',
  whyFeature1Title: 'Handmade Fresh Daily',
  whyFeature1Desc: 'Every momo is handcrafted by our skilled chefs each morning using traditional techniques.',
  whyFeature2Icon: 'ScrollText',
  whyFeature2Title: 'Authentic Family Recipes',
  whyFeature2Desc: 'Recipes passed down through generations, straight from the heart of Nepal.',
  whyFeature3Icon: 'Leaf',
  whyFeature3Title: 'Premium Ingredients',
  whyFeature3Desc: 'We source the freshest local ingredients and authentic Himalayan spices.',
  whyFeature4Icon: 'Truck',
  whyFeature4Title: 'Fast Delivery',
  whyFeature4Desc: 'Hot and fresh momos delivered to your doorstep in 30 minutes or less.',
  sectionBackgroundStyle: 'dots',
};

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [settings, setSettings] = useState<WhyChooseUsSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings({
            whySubtitle: data.whySubtitle || defaultSettings.whySubtitle,
            whyHeadline: data.whyHeadline || defaultSettings.whyHeadline,
            whyHighlightText: data.whyHighlightText || defaultSettings.whyHighlightText,
            whyDescription: data.whyDescription || defaultSettings.whyDescription,
            whyCtaText: data.whyCtaText || defaultSettings.whyCtaText,
            whyFeature1Icon: data.whyFeature1Icon || defaultSettings.whyFeature1Icon,
            whyFeature1Title: data.whyFeature1Title || defaultSettings.whyFeature1Title,
            whyFeature1Desc: data.whyFeature1Desc || defaultSettings.whyFeature1Desc,
            whyFeature2Icon: data.whyFeature2Icon || defaultSettings.whyFeature2Icon,
            whyFeature2Title: data.whyFeature2Title || defaultSettings.whyFeature2Title,
            whyFeature2Desc: data.whyFeature2Desc || defaultSettings.whyFeature2Desc,
            whyFeature3Icon: data.whyFeature3Icon || defaultSettings.whyFeature3Icon,
            whyFeature3Title: data.whyFeature3Title || defaultSettings.whyFeature3Title,
            whyFeature3Desc: data.whyFeature3Desc || defaultSettings.whyFeature3Desc,
            whyFeature4Icon: data.whyFeature4Icon || defaultSettings.whyFeature4Icon,
            whyFeature4Title: data.whyFeature4Title || defaultSettings.whyFeature4Title,
            whyFeature4Desc: data.whyFeature4Desc || defaultSettings.whyFeature4Desc,
            sectionBackgroundStyle: data.sectionBackgroundStyle || defaultSettings.sectionBackgroundStyle,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const features = [
    { icon: settings.whyFeature1Icon, title: settings.whyFeature1Title, description: settings.whyFeature1Desc },
    { icon: settings.whyFeature2Icon, title: settings.whyFeature2Title, description: settings.whyFeature2Desc },
    { icon: settings.whyFeature3Icon, title: settings.whyFeature3Title, description: settings.whyFeature3Desc },
    { icon: settings.whyFeature4Icon, title: settings.whyFeature4Title, description: settings.whyFeature4Desc },
  ];

  return (
    <section className="section-padding bg-dark relative overflow-hidden border-b-[3px] border-dark" ref={ref}>
      <SectionBackdrop style={settings.sectionBackgroundStyle} tone="dark" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 font-mono-brutal text-[11px] font-medium uppercase tracking-[0.08em] px-3.5 py-2 bg-warm-light text-dark border-[3px] border-warm-light shadow-brutal-golden">
            {settings.whySubtitle}
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-warm-light mt-5 tracking-tight">
            {settings.whyHeadline}{' '}
            <span className="font-accent italic text-golden">{settings.whyHighlightText}</span>
          </h2>
          <p className="text-warm-light/60 mt-4">
            {settings.whyDescription}
          </p>
        </motion.div>

        {/* Features Bento Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || ChefHat;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`border-[3px] border-warm-light/15 bg-warm-light/[0.04] p-7 group hover:bg-warm-light/[0.07] hover:border-golden/40 transition-colors duration-300 ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div className="w-14 h-14 border-[1.5px] border-golden/50 bg-golden/10 flex items-center justify-center group-hover:border-golden group-hover:bg-golden/20 transition-colors">
                  <Icon className="w-7 h-7 text-golden" />
                </div>
                <h3 className="font-heading text-xl font-bold text-warm-light mt-6">
                  {feature.title}
                </h3>
                <p className="text-warm-light/55 mt-3 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-warm-light/60 mb-6 font-heading text-lg">
            {settings.whyCtaText}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.querySelector('#menu');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 font-heading font-bold px-8 py-4 border-[3px] border-brand bg-brand text-warm-light shadow-brutal-golden brutal-hover hover:bg-brand-light transition-colors"
            >
              Explore Our Menu
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 font-heading font-bold px-8 py-4 border-[3px] border-warm-light/40 text-warm-light hover:border-warm-light hover:bg-warm-light/10 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
