import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.footerBrandName || 'MO:MO Station';
  const ogImage = settings.ogImage || '/og-image.png';
  const description =
    'Explore our authentic Nepali momos menu. Steamed, fried, or in jhol - find your favorite.';

  return {
    title: 'Menu',
    description:
      'Explore our authentic Nepali momos menu. From classic steamed momos to crispy fried varieties, jhol momo in spicy soup, and vegetarian options. Order online for delivery or pickup.',
    keywords: [
      'momo menu',
      'nepali food menu',
      'dumpling menu',
      'steamed momos',
      'fried momos',
      'jhol momo',
      'vegetarian momos',
      'chicken momos',
      'buff momos',
      'paneer momos',
    ],
    openGraph: {
      title: `Menu | ${siteName}`,
      description,
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Menu | ${siteName}`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: '/menu',
    },
  };
}

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
