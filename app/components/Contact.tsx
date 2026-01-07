'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Loader2,
  ArrowRight,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Video,
  Youtube,
  Linkedin,
  Globe,
  MessageCircle,
  LucideIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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

interface ContactSettings {
  contactSubtitle: string;
  contactHeadline: string;
  contactDescription: string;
  contactFormTitle: string;
  contactFormSubtitle: string;
  contactAddressLabel: string;
  contactAddressStreet: string;
  contactAddressCity: string;
  contactAddressState: string;
  contactAddressZip: string;
  contactPhoneLabel: string;
  contactPhone: string;
  contactEmailLabel: string;
  contactEmail: string;
  contactHoursLabel: string;
  contactHoursLine1: string;
  contactHoursLine2: string;
  contactSocial1Icon: string;
  contactSocial1Url: string;
  contactSocial2Icon: string;
  contactSocial2Url: string;
  contactSocial3Icon: string;
  contactSocial3Url: string;
}

const defaultSettings: ContactSettings = {
  contactSubtitle: 'Contact Us',
  contactHeadline: "Let's Start a Conversation",
  contactDescription: "Have a question or want to make a reservation? We'd love to hear from you!",
  contactFormTitle: 'Send us a Message',
  contactFormSubtitle: "We'll get back to you within 24 hours",
  contactAddressLabel: 'Visit Us',
  contactAddressStreet: '123 Momo Street',
  contactAddressCity: 'San Francisco',
  contactAddressState: 'CA',
  contactAddressZip: '94102',
  contactPhoneLabel: 'Call Us',
  contactPhone: '(415) 555-MOMO',
  contactEmailLabel: 'Email Us',
  contactEmail: 'hello@momostation.com',
  contactHoursLabel: 'Open Hours',
  contactHoursLine1: 'Mon-Thu: 11AM-10PM',
  contactHoursLine2: 'Fri-Sat: 10AM-11PM',
  contactSocial1Icon: 'Instagram',
  contactSocial1Url: 'https://instagram.com',
  contactSocial2Icon: 'Facebook',
  contactSocial2Url: 'https://facebook.com',
  contactSocial3Icon: 'Video',
  contactSocial3Url: 'https://tiktok.com',
};

export default function Contact() {
  const [settings, setSettings] = useState<ContactSettings>(defaultSettings);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSettings(prev => ({
              ...prev,
              contactSubtitle: data.contactSubtitle || prev.contactSubtitle,
              contactHeadline: data.contactHeadline || prev.contactHeadline,
              contactDescription: data.contactDescription || prev.contactDescription,
              contactFormTitle: data.contactFormTitle || prev.contactFormTitle,
              contactFormSubtitle: data.contactFormSubtitle || prev.contactFormSubtitle,
              contactAddressLabel: data.contactAddressLabel || prev.contactAddressLabel,
              contactAddressStreet: data.contactAddressStreet || prev.contactAddressStreet,
              contactAddressCity: data.contactAddressCity || prev.contactAddressCity,
              contactAddressState: data.contactAddressState || prev.contactAddressState,
              contactAddressZip: data.contactAddressZip || prev.contactAddressZip,
              contactPhoneLabel: data.contactPhoneLabel || prev.contactPhoneLabel,
              contactPhone: data.contactPhone || prev.contactPhone,
              contactEmailLabel: data.contactEmailLabel || prev.contactEmailLabel,
              contactEmail: data.contactEmail || prev.contactEmail,
              contactHoursLabel: data.contactHoursLabel || prev.contactHoursLabel,
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
        console.error('Error fetching contact settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', phone: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formatAddress = () => {
    return `${settings.contactAddressStreet}, ${settings.contactAddressCity}, ${settings.contactAddressState} ${settings.contactAddressZip}`;
  };

  const contactItems = [
    {
      icon: MapPin,
      label: settings.contactAddressLabel,
      value: formatAddress(),
      href: `https://maps.google.com/?q=${encodeURIComponent(formatAddress())}`,
    },
    {
      icon: Phone,
      label: settings.contactPhoneLabel,
      value: settings.contactPhone,
      href: `tel:${settings.contactPhone.replace(/\D/g, '')}`,
    },
    {
      icon: Mail,
      label: settings.contactEmailLabel,
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    },
    {
      icon: Clock,
      label: settings.contactHoursLabel,
      value: `${settings.contactHoursLine1}\n${settings.contactHoursLine2}`,
      href: null,
    },
  ];

  const socialLinks = [
    { icon: settings.contactSocial1Icon, href: settings.contactSocial1Url },
    { icon: settings.contactSocial2Icon, href: settings.contactSocial2Url },
    { icon: settings.contactSocial3Icon, href: settings.contactSocial3Url },
  ].filter(s => s.icon && s.href);

  return (
    <section id="contact" className="section-padding bg-[#1A1A1A] relative overflow-hidden" ref={ref}>
      {/* Background Elements */}
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
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
            <span className="w-8 h-px bg-primary/50" />
            {settings.contactSubtitle}
            <span className="w-8 h-px bg-primary/50" />
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-4">
            {(() => {
              const words = settings.contactHeadline.split(' ');
              const lastWord = words.pop();
              return (
                <>
                  {words.join(' ')} <span className="text-primary">{lastWord}</span>
                </>
              );
            })()}
          </h2>
          <p className="text-gray-400 mt-4 text-base md:text-lg">
            {settings.contactDescription}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="space-y-4">
              {contactItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/30 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-white font-medium group-hover:text-primary transition-colors whitespace-pre-line">
                          {item.value}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="text-white font-medium whitespace-pre-line">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="pt-4"
            >
              <p className="text-gray-500 text-sm mb-3">Follow us on social media</p>
              <div className="flex gap-3">
                {socialLinks.map((social, idx) => {
                  const IconComponent = socialIconMap[social.icon] || Globe;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#1A1A1A]">
                    {settings.contactFormTitle}
                  </h3>
                  <p className="text-sm text-gray-500">{settings.contactFormSubtitle}</p>
                </div>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#1A1A1A]">
                    Message Sent!
                  </h4>
                  <p className="text-gray-500 mt-2 max-w-sm">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[#1A1A1A] mb-2"
                      >
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-[#1A1A1A] mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#1A1A1A] mb-2"
                    >
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[#1A1A1A] mb-2"
                    >
                      Your Message <span className="text-primary">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="How can we help you today?"
                      className="resize-none bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
