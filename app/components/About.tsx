'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import SectionBackdrop from './SectionBackdrop';

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
  sectionBackgroundStyle: string;
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
  sectionBackgroundStyle: 'dots',
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
            sectionBackgroundStyle: data.sectionBackgroundStyle || defaultSettings.sectionBackgroundStyle,
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
    <section id="about" className="section-padding bg-cream border-b-[3px] border-dark relative overflow-hidden" ref={ref}>
      <SectionBackdrop style={settings.sectionBackgroundStyle} tone="light" />
      <div className="container-custom relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-16 lg:gap-16 items-center"
        >
          {/* Image Gallery */}
          <motion.div variants={itemVariants} className="relative min-w-0 pb-8 pr-4 lg:pb-4">
            <div className="grid grid-cols-2 gap-5">
              {/* Main Image */}
              <div className="col-span-2">
                <div className="relative border-brutal shadow-brutal overflow-hidden aspect-[16/10] rotate-[-0.6deg] bg-warm-light">
                  <img
                    src={settings.aboutImage1}
                    alt="Restaurant interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Secondary Images */}
              <div className="relative border-brutal shadow-brutal-sm overflow-hidden aspect-square rotate-[1deg] bg-warm-light">
                <img
                  src={settings.aboutImage2}
                  alt="Chef preparing momos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative border-brutal shadow-brutal-sm overflow-hidden aspect-square rotate-[-1.2deg] bg-warm-light">
                <img
                  src={settings.aboutImage3}
                  alt="Fresh momos"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute bottom-0 right-0 lg:-bottom-4 lg:-right-4 bg-brand text-warm-light border-brutal shadow-brutal-sm px-5 py-4 rotate-[2deg] hidden md:block"
            >
              <div className="text-3xl font-extrabold font-heading leading-none">{settings.aboutBadgeNumber}</div>
              <div className="font-mono-brutal text-[10px] uppercase tracking-wide mt-1.5 opacity-90">{settings.aboutBadgeText}</div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="min-w-0">
            <div className="eyebrow-brutal">
              {settings.aboutSubtitle}
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark mt-5 leading-[1.05] tracking-tight">
              {settings.aboutHeadline.split(' ').slice(0, 3).join(' ')}{' '}
              <span className="font-accent italic text-brand">
                {settings.aboutHeadline.split(' ').slice(3).join(' ')}
              </span>
            </h2>

            <div className="space-y-4 mt-6 text-dark/70 leading-relaxed">
              <p>{settings.aboutParagraph}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="border-brutal-thin bg-warm-light px-3 py-4 text-center"
                >
                  <div className="text-2xl md:text-3xl font-extrabold text-brand font-heading leading-none">
                    {stat.value}
                  </div>
                  <div className="font-mono-brutal text-[10px] uppercase tracking-wide text-dark/60 mt-2">
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
