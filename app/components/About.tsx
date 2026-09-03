'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface SiteSettings {
  aboutImage1: string;
  aboutImage2: string;
  aboutImage3: string;
  aboutBadgeNumber: string;
  aboutBadgeText: string;
  aboutSubtitle: string;
  aboutHeadline: string;
  aboutParagraph: string;
  aboutStat1Value: string;
  aboutStat1Label: string;
  aboutStat2Value: string;
  aboutStat2Label: string;
  aboutStat3Value: string;
  aboutStat3Label: string;
  aboutStat4Value: string;
  aboutStat4Label: string;
}

const defaultSettings: SiteSettings = {
  aboutImage1: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
  aboutImage2: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
  aboutImage3: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
  aboutBadgeNumber: '15+',
  aboutBadgeText: 'Years of Excellence',
  aboutSubtitle: 'Our Story',
  aboutHeadline: 'A Journey of Authentic Flavors',
  aboutParagraph: 'What started as a small family kitchen in the heart of Nepal has grown into a beloved destination for momo enthusiasts. Our founder, inspired by generations of family recipes, brought the authentic taste of Himalayan momos to share with the world.',
  aboutStat1Value: '15+',
  aboutStat1Label: 'Years',
  aboutStat2Value: '50K+',
  aboutStat2Label: 'Customers',
  aboutStat3Value: '25+',
  aboutStat3Label: 'Recipes',
  aboutStat4Value: '100%',
  aboutStat4Label: 'Fresh Daily',
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            aboutImage1: data.aboutImage1 || defaultSettings.aboutImage1,
            aboutImage2: data.aboutImage2 || defaultSettings.aboutImage2,
            aboutImage3: data.aboutImage3 || defaultSettings.aboutImage3,
            aboutBadgeNumber: data.aboutBadgeNumber || defaultSettings.aboutBadgeNumber,
            aboutBadgeText: data.aboutBadgeText || defaultSettings.aboutBadgeText,
            aboutSubtitle: data.aboutSubtitle || defaultSettings.aboutSubtitle,
            aboutHeadline: data.aboutHeadline || defaultSettings.aboutHeadline,
            aboutParagraph: data.aboutParagraph || defaultSettings.aboutParagraph,
            aboutStat1Value: data.aboutStat1Value || defaultSettings.aboutStat1Value,
            aboutStat1Label: data.aboutStat1Label || defaultSettings.aboutStat1Label,
            aboutStat2Value: data.aboutStat2Value || defaultSettings.aboutStat2Value,
            aboutStat2Label: data.aboutStat2Label || defaultSettings.aboutStat2Label,
            aboutStat3Value: data.aboutStat3Value || defaultSettings.aboutStat3Value,
            aboutStat3Label: data.aboutStat3Label || defaultSettings.aboutStat3Label,
            aboutStat4Value: data.aboutStat4Value || defaultSettings.aboutStat4Value,
            aboutStat4Label: data.aboutStat4Label || defaultSettings.aboutStat4Label,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const stats = [
    { value: settings.aboutStat1Value, label: settings.aboutStat1Label },
    { value: settings.aboutStat2Value, label: settings.aboutStat2Label },
    { value: settings.aboutStat3Value, label: settings.aboutStat3Label },
    { value: settings.aboutStat4Value, label: settings.aboutStat4Label },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="section-padding bg-[#FDF8F3]" ref={ref}>
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Image Gallery */}
          <motion.div variants={itemVariants} className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Image */}
              <div className="col-span-2">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-xl">
                  <img
                    src={settings.aboutImage1}
                    alt="Restaurant interior"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>

              {/* Secondary Images */}
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img
                  src={settings.aboutImage2}
                  alt="Chef preparing momos"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                <img
                  src={settings.aboutImage3}
                  alt="Fresh momos"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl hidden md:block"
            >
              <div className="text-4xl font-bold font-playfair">{settings.aboutBadgeNumber}</div>
              <div className="text-sm opacity-90">{settings.aboutBadgeText}</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants}>
            <span className="text-primary font-medium text-sm uppercase tracking-widest">
              {settings.aboutSubtitle}
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3">
              {settings.aboutHeadline.split(' ').slice(0, 3).join(' ')}{' '}
              <span className="text-gradient">
                {settings.aboutHeadline.split(' ').slice(3).join(' ')}
              </span>
            </h2>

            <div className="space-y-4 mt-6 text-muted-foreground leading-relaxed">
              <p>{settings.aboutParagraph}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-8 border-t border-border">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-primary font-playfair">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
