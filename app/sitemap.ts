import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/getSiteSettings';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use the admin-configured public domain instead of the raw deployment env
  // var, which in production can point at the hosting platform's internal/
  // preview URL rather than the real custom domain - submitting the wrong
  // domain here tells Google to index pages under a URL nobody actually visits.
  const settings = await getSiteSettings();
  const BASE_URL = (
    settings.siteUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ).replace(/\/+$/, '');

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Fetch menu items for dynamic pages
  let menuPages: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${BASE_URL}/api/menu`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (response.ok) {
      const menuItems = await response.json();
      menuPages = menuItems.map((item: { slug: string; updatedAt?: string }) => ({
        url: `${BASE_URL}/menu/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching menu items for sitemap:', error);
  }

  return [...staticPages, ...menuPages];
}
