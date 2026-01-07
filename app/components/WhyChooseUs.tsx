'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
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
    <section className="section-padding bg-dark relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-[#F4A261]/10 blur-3xl"
      />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest">
            {settings.whySubtitle}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
            {settings.whyHeadline}{' '}
            <span className="text-gradient">{settings.whyHighlightText}</span>
          </h2>
          <p className="text-gray-400 mt-4">
            {settings.whyDescription}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || ChefHat;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass-dark p-8 rounded-2xl text-center group hover:bg-white/10 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-[#FF6B1A] flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="font-playfair text-xl font-semibold text-white mt-6">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mt-3 text-sm leading-relaxed">
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
          <p className="text-gray-400 mb-6">
            {settings.whyCtaText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.querySelector('#menu');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full bg-primary hover:bg-[#B8420A] text-white font-medium transition-colors"
            >
              Explore Our Menu
            </button>
            <button
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full border-2 border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
