import prisma from './prisma';

export interface SiteSettings {
  id: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  favicon: string;
  faviconSvg: string;
  appleTouchIcon: string;
  themeColor: string;
  backgroundColor: string;
  ogImage: string;
  ogImageAlt: string;
  twitterImage: string;
  twitterHandle: string;
  heroLogo: string;
}

// Default settings fallback
const defaultSettings: SiteSettings = {
  id: 'default',
  siteTitle: 'MO:MO Station | Authentic Nepali Momos & Dumplings',
  siteDescription: 'Experience authentic Nepali momos handcrafted with love using traditional family recipes. Steamed, fried, or in jhol - taste the Himalayas in every bite.',
  siteUrl: 'https://momostation.com',
  favicon: '/favicon-32.svg',
  faviconSvg: '/favicon.svg',
  appleTouchIcon: '/apple-touch-icon.svg',
  themeColor: '#E85D04',
  backgroundColor: '#FDF8F3',
  ogImage: '/og-image.svg',
  ogImageAlt: 'MO:MO Station - Authentic Nepali Dumplings',
  twitterImage: '/twitter-image.svg',
  twitterHandle: '@momostation',
  heroLogo: '/brandlogo.svg',
};

// Cache the settings to avoid repeated DB calls
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
      select: {
        id: true,
        siteTitle: true,
        siteDescription: true,
        siteUrl: true,
        favicon: true,
        faviconSvg: true,
        appleTouchIcon: true,
        themeColor: true,
        backgroundColor: true,
        ogImage: true,
        ogImageAlt: true,
        twitterImage: true,
        twitterHandle: true,
        heroLogo: true,
      },
    });

    if (settings) {
      cachedSettings = settings as SiteSettings;
      cacheTimestamp = now;
      return cachedSettings;
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
  }

  return defaultSettings;
}

// Force cache invalidation (call after settings are updated)
export function invalidateSiteSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
}
