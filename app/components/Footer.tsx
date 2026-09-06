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
  Globe,
  Twitter,
  Video,
  Youtube,
  Linkedin,
  MessageCircle,
  LucideIcon,
} from 'lucide-react';

// Social icon mapping
const socialIconMap: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Twitter,
  Video,
  Youtube,
  Linkedin,
  Globe,
  MessageCircle,
  Mail,
  Phone,
};

interface QuickLink {
  text: string;
  href: string;
}

interface FooterMenuItem {
  id: string;
  name: string;
  slug: string;
}

interface FooterSettings {
  // CTA Section
  footerCtaHeadline: string;
  footerCtaHighlight: string;
  footerCtaDescription: string;
  footerCtaButton1Text: string;
  footerCtaButton1Url: string;
  footerCtaButton2Text: string;
  footerCtaButton2Url: string;
  // Brand
  footerBrandName: string;
  footerBrandDescription: string;
  footerCopyright: string;
  // Links
  footerQuickLinksTitle: string;
  footerQuickLinks: QuickLink[];
  footerMenuTitle: string;
  footerMenuItemIds: string[];
  footerContactTitle: string;
  // Visibility
  footerShowSocials: boolean;
  footerShowQuickLinks: boolean;
  footerShowMenuLinks: boolean;
  footerShowContact: boolean;
  // Contact info (from contact section)
  contactAddressStreet: string;
  contactAddressCity: string;
  contactAddressState: string;
  contactAddressZip: string;
  contactPhone: string;
  contactEmail: string;
  contactHoursLine1: string;
  contactHoursLine2: string;
  // Social links
  contactSocial1Icon: string;
  contactSocial1Url: string;
  contactSocial2Icon: string;
  contactSocial2Url: string;
  contactSocial3Icon: string;
  contactSocial3Url: string;
}

const defaultSettings: FooterSettings = {
  footerCtaHeadline: 'Ready to taste the Himalayas?',
  footerCtaHighlight: 'Himalayas',
  footerCtaDescription: 'Order online or visit us today for an authentic momo experience.',
  footerCtaButton1Text: 'Order Now',
  footerCtaButton1Url: '/menu',
  footerCtaButton2Text: 'Contact Us',
  footerCtaButton2Url: '#contact',
  footerBrandName: 'MO:MO Station',
  footerBrandDescription: 'Authentic Nepali Dumplings. Experience the authentic taste of Nepal with our handcrafted momos, made fresh daily with love and tradition.',
  footerCopyright: 'All rights reserved. Made with love for momo lovers.',
  footerQuickLinksTitle: 'Quick Links',
  footerQuickLinks: [
    { text: 'Home', href: '#home' },
    { text: 'About Us', href: '#about' },
    { text: 'Our Menu', href: '#menu' },
    { text: 'Testimonials', href: '#testimonials' },
    { text: 'Contact', href: '#contact' },
  ],
  footerMenuTitle: 'Our Menu',
  footerMenuItemIds: [],
  footerContactTitle: 'Get in Touch',
  footerShowSocials: true,
  footerShowQuickLinks: true,
  footerShowMenuLinks: true,
  footerShowContact: true,
  contactAddressStreet: '123 Momo Street',
  contactAddressCity: 'San Francisco',
  contactAddressState: 'CA',
  contactAddressZip: '94102',
  contactPhone: '(415) 555-MOMO',
  contactEmail: 'hello@momostation.com',
  contactHoursLine1: 'Mon-Thu: 11AM-10PM',
  contactHoursLine2: 'Fri-Sat: 10AM-11PM',
  contactSocial1Icon: 'Instagram',
  contactSocial1Url: 'https://instagram.com',
  contactSocial2Icon: 'Facebook',
  contactSocial2Url: 'https://facebook.com',
  contactSocial3Icon: 'Video',
  contactSocial3Url: 'https://tiktok.com',
};

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings);
  const [menuItems, setMenuItems] = useState<FooterMenuItem[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Fetch settings and menu items on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            // Parse footerQuickLinks if it's a string (JSON)
            let quickLinks = data.footerQuickLinks;
            if (typeof quickLinks === 'string') {
              try {
                quickLinks = JSON.parse(quickLinks);
              } catch {
                quickLinks = defaultSettings.footerQuickLinks;
              }
            }
            
            setSettings(prev => ({
              ...prev,
              footerCtaHeadline: data.footerCtaHeadline || prev.footerCtaHeadline,
              footerCtaHighlight: data.footerCtaHighlight || prev.footerCtaHighlight,
              footerCtaDescription: data.footerCtaDescription || prev.footerCtaDescription,
              footerCtaButton1Text: data.footerCtaButton1Text || prev.footerCtaButton1Text,
              footerCtaButton1Url: data.footerCtaButton1Url || prev.footerCtaButton1Url,
              footerCtaButton2Text: data.footerCtaButton2Text || prev.footerCtaButton2Text,
              footerCtaButton2Url: data.footerCtaButton2Url || prev.footerCtaButton2Url,
              footerBrandName: data.footerBrandName || prev.footerBrandName,
              footerBrandDescription: data.footerBrandDescription || prev.footerBrandDescription,
              footerCopyright: data.footerCopyright || prev.footerCopyright,
              footerQuickLinksTitle: data.footerQuickLinksTitle || prev.footerQuickLinksTitle,
              footerQuickLinks: Array.isArray(quickLinks) && quickLinks.length ? quickLinks : prev.footerQuickLinks,
              footerMenuTitle: data.footerMenuTitle || prev.footerMenuTitle,
              footerMenuItemIds: Array.isArray(data.footerMenuItemIds) ? data.footerMenuItemIds : prev.footerMenuItemIds,
              footerContactTitle: data.footerContactTitle || prev.footerContactTitle,
              footerShowSocials: data.footerShowSocials ?? prev.footerShowSocials,
              footerShowQuickLinks: data.footerShowQuickLinks ?? prev.footerShowQuickLinks,
              footerShowMenuLinks: data.footerShowMenuLinks ?? prev.footerShowMenuLinks,
              footerShowContact: data.footerShowContact ?? prev.footerShowContact,
              contactAddressStreet: data.contactAddressStreet || prev.contactAddressStreet,
              contactAddressCity: data.contactAddressCity || prev.contactAddressCity,
              contactAddressState: data.contactAddressState || prev.contactAddressState,
              contactAddressZip: data.contactAddressZip || prev.contactAddressZip,
              contactPhone: data.contactPhone || prev.contactPhone,
              contactEmail: data.contactEmail || prev.contactEmail,
              contactHoursLine1: data.contactHoursLine1 || prev.contactHoursLine1,
              contactHoursLine2: data.contactHoursLine2 || prev.contactHoursLine2,
              contactSocial1Icon: data.contactSocial1Icon || prev.contactSocial1Icon,
              contactSocial1Url: data.contactSocial1Url || prev.contactSocial1Url,
              contactSocial2Icon: data.contactSocial2Icon || prev.contactSocial2Icon,
              contactSocial2Url: data.contactSocial2Url || prev.contactSocial2Url,
              contactSocial3Icon: data.contactSocial3Icon || prev.contactSocial3Icon,
              contactSocial3Url: data.contactSocial3Url || prev.contactSocial3Url,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const res = await fetch('/api/menu', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setMenuItems(data.map((item: { id: string; name: string; slug: string }) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
          })));
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchSettings();
    fetchMenuItems();
  }, []);

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

  const formatAddress = () => {
    return `${settings.contactAddressStreet}, ${settings.contactAddressCity}, ${settings.contactAddressState} ${settings.contactAddressZip}`;
  };

  const socialLinks = [
    { icon: settings.contactSocial1Icon, href: settings.contactSocial1Url },
    { icon: settings.contactSocial2Icon, href: settings.contactSocial2Url },
    { icon: settings.contactSocial3Icon, href: settings.contactSocial3Url },
  ].filter(s => s.icon && s.href);

  // Get selected menu items for footer display
  const selectedMenuItems = settings.footerMenuItemIds
    .map(id => menuItems.find(item => item.id === id))
    .filter((item): item is FooterMenuItem => item !== undefined);

  const currentYear = new Date().getFullYear();

  // Render headline with highlighted word
  const renderHeadline = () => {
    const { footerCtaHeadline, footerCtaHighlight } = settings;
    if (!footerCtaHighlight) return footerCtaHeadline;
    
    const parts = footerCtaHeadline.split(footerCtaHighlight);
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          <span className="font-accent italic text-warm-light">{footerCtaHighlight}</span>
        )}
      </span>
    ));
  };

  return (
    <footer className="bg-dark text-warm-light relative overflow-hidden" ref={ref}>
      {/* Full-bleed brand-red closing CTA band */}
      <div className="relative bg-brand border-b-[3px] border-dark overflow-hidden">
        {/* Diagonal stripe texture */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--color-dark) 0, var(--color-dark) 2px, transparent 2px, transparent 18px)',
          }}
          aria-hidden="true"
        />
        <div className="container-custom py-14 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8"
          >
            <div className="text-center lg:text-left max-w-2xl">
              <span className="font-mono-brutal text-[11px] font-bold uppercase tracking-[0.1em] text-dark/70">
                Don&apos;t Wait Any Longer
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark leading-[0.95] mt-3 tracking-tight">
                {renderHeadline()}
              </h3>
              <p className="text-dark/70 mt-4 text-base md:text-lg max-w-lg mx-auto lg:mx-0">
                {settings.footerCtaDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href={settings.footerCtaButton1Url}
                className="px-8 py-4 bg-dark text-warm-light font-heading font-bold border-brutal shadow-brutal-cream brutal-hover text-center"
              >
                {settings.footerCtaButton1Text}
              </Link>
              <button
                onClick={() => scrollToSection(settings.footerCtaButton2Url)}
                className="px-8 py-4 bg-transparent text-dark font-heading font-bold border-[3px] border-dark hover:bg-dark hover:text-warm-light transition-colors duration-200 text-center"
              >
                {settings.footerCtaButton2Text}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-warm-light) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />

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
              <span className="font-heading text-2xl font-extrabold text-warm-light group-hover:text-golden transition-colors">
                {settings.footerBrandName}
              </span>
            </Link>
            <p className="text-warm-light/50 mt-4 text-sm leading-relaxed max-w-sm">
              {settings.footerBrandDescription}
            </p>

            {/* Social Links */}
            {settings.footerShowSocials && socialLinks.length > 0 && (
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social, idx) => {
                  const IconComponent = socialIconMap[social.icon] || Globe;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 border-[1.5px] border-warm-light/20 flex items-center justify-center hover:bg-brand hover:border-brand transition-all duration-300 group"
                      aria-label={social.icon}
                    >
                      <IconComponent className="w-5 h-5 text-warm-light/60 group-hover:text-warm-light transition-colors" />
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          {settings.footerShowQuickLinks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-mono-brutal font-bold text-golden mb-4 text-[11px] uppercase tracking-[0.08em]">
                {settings.footerQuickLinksTitle}
              </h4>
              <ul className="space-y-3">
                {settings.footerQuickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.href || '#')}
                      className="text-warm-light/50 hover:text-warm-light transition-colors text-sm flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.text}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Menu Links */}
          {settings.footerShowMenuLinks && selectedMenuItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="font-mono-brutal font-bold text-golden mb-4 text-[11px] uppercase tracking-[0.08em]">
                {settings.footerMenuTitle}
            </h4>
            <ul className="space-y-3">
              {selectedMenuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/menu/${item.slug}`}
                    className="text-warm-light/50 hover:text-warm-light transition-colors text-sm flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          )}

          {/* Contact Info */}
          {settings.footerShowContact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-2 md:col-span-1 lg:col-span-2"
            >
              <h4 className="font-mono-brutal font-bold text-golden mb-4 text-[11px] uppercase tracking-[0.08em]">
                {settings.footerContactTitle}
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(formatAddress())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-9 h-9 border-[1.5px] border-warm-light/20 flex items-center justify-center shrink-0 group-hover:border-golden transition-colors">
                      <MapPin className="w-4 h-4 text-golden" />
                    </div>
                    <span className="text-warm-light/50 text-sm group-hover:text-warm-light transition-colors">
                      {settings.contactAddressStreet}
                      <br />
                      {settings.contactAddressCity}, {settings.contactAddressState} {settings.contactAddressZip}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\D/g, '')}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 border-[1.5px] border-warm-light/20 flex items-center justify-center shrink-0 group-hover:border-golden transition-colors">
                      <Phone className="w-4 h-4 text-golden" />
                    </div>
                    <span className="text-warm-light/50 text-sm group-hover:text-warm-light transition-colors">
                      {settings.contactPhone}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 border-[1.5px] border-warm-light/20 flex items-center justify-center shrink-0 group-hover:border-golden transition-colors">
                      <Mail className="w-4 h-4 text-golden" />
                    </div>
                    <span className="text-warm-light/50 text-sm group-hover:text-warm-light transition-colors">
                      {settings.contactEmail}
                    </span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 border-[1.5px] border-warm-light/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-golden" />
                  </div>
                  <div className="text-warm-light/50 text-sm">
                    <span className="text-warm-light font-medium block mb-1">Hours</span>
                    {settings.contactHoursLine1}
                    <br />
                    {settings.contactHoursLine2}
                  </div>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-[3px] border-warm-light/10 relative">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono-brutal text-[11px] text-warm-light/40 text-center md:text-left flex items-center gap-1 flex-wrap justify-center uppercase tracking-wide">
              &copy; {currentYear} {settings.footerBrandName}. {settings.footerCopyright.includes('Made with') ? (
                <>
                  {settings.footerCopyright.split('Made with')[0]}Made with
                  <Heart className="w-3.5 h-3.5 text-brand inline mx-1 fill-brand" />
                  {settings.footerCopyright.split('Made with')[1]?.replace('love', '').trim()}
                </>
              ) : settings.footerCopyright}
            </p>
            <div className="flex items-center gap-6 font-mono-brutal text-[11px] uppercase tracking-wide">
              <button className="text-warm-light/40 hover:text-warm-light transition-colors">
                Privacy Policy
              </button>
              <span className="w-1 h-1 rounded-full bg-warm-light/20" />
              <button className="text-warm-light/40 hover:text-warm-light transition-colors">
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
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 bg-brand text-warm-light border-brutal shadow-brutal-sm flex items-center justify-center hover:bg-dark transition-all duration-300 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
