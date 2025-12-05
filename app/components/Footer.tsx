'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
    { name: 'Momos', href: '#menu' },
    { name: 'Sides', href: '#menu' },
    { name: 'Drinks', href: '#menu' },
    { name: 'Desserts', href: '#menu' },
  ],
};

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: businessInfo.social.instagram },
  { name: 'Facebook', icon: Facebook, href: businessInfo.social.facebook },
  { name: 'Twitter', icon: Twitter, href: businessInfo.social.twitter },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white relative">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-primary via-[#F4A261] to-primary" />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col group">
              <span className="font-playfair text-2xl font-bold text-white">
                Himalayan
              </span>
              <span className="font-dancing text-lg text-[#F4A261] -mt-1">
                Momos
              </span>
            </Link>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              {businessInfo.tagline}. Experience the authentic taste of Nepal
              with our handcrafted momos and traditional dishes.
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
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">
              Our Menu
            </h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair text-lg font-semibold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  {businessInfo.contact.address.street}
                  <br />
                  {businessInfo.contact.address.city},{' '}
                  {businessInfo.contact.address.state}{' '}
                  {businessInfo.contact.address.zip}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`tel:${businessInfo.contact.phone}`}
                  className="text-gray-400 text-sm hover:text-primary transition-colors"
                >
                  {businessInfo.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href={`mailto:${businessInfo.contact.email}`}
                  className="text-gray-400 text-sm hover:text-primary transition-colors"
                >
                  {businessInfo.contact.email}
                </a>
              </li>
            </ul>

            {/* Hours Summary */}
            <div className="mt-6 p-4 rounded-xl bg-white/5">
              <h5 className="font-semibold text-sm mb-2">Opening Hours</h5>
              <div className="text-gray-400 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Mon - Thu</span>
                  <span>11AM - 10PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Fri - Sat</span>
                  <span>10AM - 11PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10AM - 9PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} {businessInfo.name}. All rights reserved. Made with
            ❤️ for momo lovers.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <button className="hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-primary transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-[#B8420A] transition-colors z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
