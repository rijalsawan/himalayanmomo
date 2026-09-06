import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/getSiteSettings';

// Same reasoning as sitemap.ts: prefer the admin-configured public domain
// over the raw deployment env var so the advertised sitemap URL matches the
// domain Google should actually be indexing.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const BASE_URL = (
    settings.siteUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ).replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout/',
          '/orders/',
          '/profile/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
