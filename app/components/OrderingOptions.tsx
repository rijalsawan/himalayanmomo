'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Store, UtensilsCrossed, Truck, Percent } from 'lucide-react';
import Link from 'next/link';

interface OrderingSettings {
  deliveryEnabled: boolean;
  promoEnabled: boolean;
  promoMessage: string;
}

const defaultSettings: OrderingSettings = {
  deliveryEnabled: false,
  promoEnabled: true,
  promoMessage: 'Get 10% OFF online Pickup & Dine-In orders!',
};

export default function OrderingOptions() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [settings, setSettings] = useState<OrderingSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            deliveryEnabled: !!data.deliveryEnabled,
            promoEnabled: data.promoEnabled ?? defaultSettings.promoEnabled,
            promoMessage: data.promoMessage || defaultSettings.promoMessage,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const options = [
    {
      icon: Store,
      title: 'Pickup',
      description: 'Order ahead and swing by whenever it suits you. Fresh, hot, and ready when you arrive.',
      available: true,
    },
    {
      icon: UtensilsCrossed,
      title: 'Online Order & Dine-In',
      description: 'Order online for dine-in and skip the wait, or walk in and enjoy the full experience with us.',
      available: true,
    },
    {
      icon: Truck,
      title: 'Delivery',
      description: settings.deliveryEnabled
        ? 'Hot and fresh momos delivered straight to your doorstep.'
        : "We're working on bringing delivery to your door. Hang tight!",
      available: settings.deliveryEnabled,
    },
  ];

  return (
    <section id="ordering" className="section-padding bg-warm-light border-b-[3px] border-dark relative overflow-hidden" ref={ref}>
      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="eyebrow-brutal mx-auto">
            How To Order
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark mt-5 tracking-tight">
            Ways to{' '}
            <span className="font-accent italic text-brand">Enjoy Us</span>
          </h2>
          <p className="text-dark/70 mt-4">
            Pickup and online ordering for dine-in are open right now. Delivery is on its way.
          </p>
        </motion.div>

        {/* Options Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className={`relative border-brutal bg-cream p-7 transition-shadow duration-300 ${
                  option.available ? 'shadow-brutal-sm hover:shadow-brutal' : 'shadow-brutal-sm opacity-90'
                }`}
              >
                {/* Status tag */}
                <div
                  className={`inline-flex items-center gap-1.5 font-mono-brutal text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border-[1.5px] border-dark ${
                    option.available ? 'bg-herb text-warm-light' : 'bg-warm-light text-dark/50'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 ${option.available ? 'bg-warm-light' : 'bg-dark/40'}`} />
                  {option.available ? 'Available Now' : 'Coming Soon'}
                </div>

                {/* Coming soon stamp, rotated like a rubber stamp */}
                {!option.available && (
                  <div className="absolute top-5 right-5 rotate-[12deg] border-[3px] border-brand text-brand font-mono-brutal text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 opacity-70 select-none">
                    Coming Soon
                  </div>
                )}

                <div className={`w-14 h-14 border-[1.5px] border-dark flex items-center justify-center mt-6 ${
                  option.available ? 'bg-golden/40' : 'bg-dark/5'
                }`}>
                  <Icon className={`w-7 h-7 ${option.available ? 'text-dark' : 'text-dark/40'}`} />
                </div>

                <h3 className={`font-heading text-xl font-bold mt-5 ${option.available ? 'text-dark' : 'text-dark/50'}`}>
                  {option.title}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${option.available ? 'text-dark/70' : 'text-dark/40'}`}>
                  {option.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Promo banner */}
        {settings.promoEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10"
          >
            <Link href="/menu" className="block">
              <div className="flex flex-wrap items-center justify-center gap-3 border-brutal bg-brand text-warm-light shadow-brutal-sm brutal-hover px-6 py-4 text-center">
                <span className="flex items-center justify-center w-8 h-8 border-[1.5px] border-warm-light/50 flex-shrink-0">
                  <Percent className="w-4 h-4" />
                </span>
                <span className="font-mono-brutal text-xs sm:text-sm font-bold uppercase tracking-wide">
                  {settings.promoMessage}
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
