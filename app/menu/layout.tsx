import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore our authentic Nepali momos menu. From classic steamed momos to crispy fried varieties, jhol momo in spicy soup, and vegetarian options. Order online for delivery or pickup.',
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
    title: 'Menu | MO:MO Station',
    description: 'Explore our authentic Nepali momos menu. Steamed, fried, or in jhol - find your favorite.',
    type: 'website',
    images: ['/og-menu.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu | MO:MO Station',
    description: 'Explore our authentic Nepali momos menu. Steamed, fried, or in jhol - find your favorite.',
  },
  alternates: {
    canonical: '/menu',
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
