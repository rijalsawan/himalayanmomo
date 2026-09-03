'use client';

import { useEffect, useRef, useState } from 'react';
import { Rocket, Gift } from 'lucide-react';

interface AnnouncementSettings {
  comingSoonEnabled: boolean;
  comingSoonMessage: string;
  promoEnabled: boolean;
  promoMessage: string;
}

const defaultSettings: AnnouncementSettings = {
  comingSoonEnabled: true,
  comingSoonMessage: "We're opening soon! Please don't place an order just yet.",
  promoEnabled: true,
  promoMessage: 'Get 10% OFF online Pickup & Dine-In orders!',
};

export default function AnnouncementBar() {
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            comingSoonEnabled: data.comingSoonEnabled ?? defaultSettings.comingSoonEnabled,
            comingSoonMessage: data.comingSoonMessage || defaultSettings.comingSoonMessage,
            promoEnabled: data.promoEnabled ?? defaultSettings.promoEnabled,
            promoMessage: data.promoMessage || defaultSettings.promoMessage,
          });
        } else {
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching announcement settings:', error);
        setSettings(defaultSettings);
      }
    };
    fetchSettings();
  }, []);

  const isVisible = !!settings && (settings.comingSoonEnabled || settings.promoEnabled);

  // Keep --announcement-h in sync with the rendered bar height so the fixed
  // Navbar and the page-content spacer (both rendered by Navbar) can offset
  // themselves correctly, without every page needing to know about the bar.
  useEffect(() => {
    const root = document.documentElement;

    if (!isVisible) {
      root.style.setProperty('--announcement-h', '0px');
      return;
    }

    const el = barRef.current;
    if (!el) return;

    const updateHeight = () => {
      root.style.setProperty('--announcement-h', `${el.offsetHeight}px`);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.style.setProperty('--announcement-h', '0px');
    };
  }, [isVisible]);

  if (!isVisible || !settings) return null;

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-[#F4A261] to-primary text-white animate-slide-down"
    >
      <div className="container-custom py-2">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs sm:text-sm font-medium">
          {settings.comingSoonEnabled && (
            <span className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              {settings.comingSoonMessage}
            </span>
          )}
          {settings.comingSoonEnabled && settings.promoEnabled && (
            <span className="hidden sm:inline text-white/60">•</span>
          )}
          {settings.promoEnabled && (
            <span className="flex items-center gap-1.5 font-semibold">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              {settings.promoMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
