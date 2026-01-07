'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  Clock,
  ChevronRight,
  Heart,
  Sparkles,
} from 'lucide-react';
import { businessInfo } from '../data/businessInfo';

const footerLinks = {
  quickLinks: [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Our Menu', href: '#menu' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ],
  menu: [
    { name: 'Classic Momos', href: '#menu' },
    { name: 'Specialty Momos', href: '#menu' },
    { name: 'Sides & Extras', href: '#menu' },
    { name: 'Beverages', href: '#menu' },
  ],
  support: [
    { name: 'FAQs', href: '#' },
    { name: 'Delivery Info', href: '#' },
    { name: 'Catering', href: '#' },
    { name: 'Gift Cards', href: '#' },
  ],
};

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: businessInfo.social.instagram },
  { name: 'Facebook', icon: Facebook, href: businessInfo.social.facebook },
  { name: 'TikTok', icon: Sparkles, href: businessInfo.social.tiktok },
];

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#111111] text-white relative overflow-hidden" ref={ref}>
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      {/* Top CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container-custom py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center justify-between gap-6"
          >
            <div className="text-center lg:text-left">
              <h3 className="font-heading text-2xl md:text-3xl font-bold">
                Ready to taste the <span className="text-primary">Himalayas</span>?
              </h3>
              <p className="text-gray-400 mt-2">
                Order online or visit us today for an authentic momo experience.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/menu"
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 text-center"
              >
                Order Now
              </Link>
              <button
                onClick={() => scrollToSection('#contact')}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full border border-white/20 hover:border-white/30 transition-all duration-300 text-center"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12 md:py-16 relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand Column - Takes 2 cols on lg */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-2 md:col-span-3 lg:col-span-2"
          >
            <Link href="/" className="inline-block group">
              <span className="font-heading text-2xl font-bold text-white group-hover:text-primary transition-colors">
                {businessInfo.name}
              </span>
            </Link>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-sm">
              {businessInfo.tagline}. Experience the authentic taste of Nepal with our handcrafted momos, made fresh daily with love and tradition.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Menu Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Our Menu
            </h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-2 md:col-span-1 lg:col-span-2"
          >
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${businessInfo.contact.address.street}, ${businessInfo.contact.address.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    {businessInfo.contact.address.street}
                    <br />
                    {businessInfo.contact.address.city}, {businessInfo.contact.address.state} {businessInfo.contact.address.zip}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${businessInfo.contact.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    {businessInfo.contact.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${businessInfo.contact.email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    {businessInfo.contact.email}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div className="text-gray-400 text-sm">
                  <span className="text-white font-medium block mb-1">Hours</span>
                  Mon-Thu: 11AM-10PM
                  <br />
                  Fri-Sat: 10AM-11PM
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left flex items-center gap-1 flex-wrap justify-center">
              © {currentYear} {businessInfo.name}. All rights reserved. Made with
              <Heart className="w-4 h-4 text-primary inline mx-1 fill-primary" />
              for momo lovers.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </button>
              <span className="w-1 h-1 rounded-full bg-gray-600" />
              <button className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all duration-300 z-40 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
