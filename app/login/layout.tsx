import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.footerBrandName || 'MO:MO Station';
  const ogImage = settings.ogImage || '/og-image.png';

  return {
    title: 'Sign In',
    description: `Sign in to your ${siteName} account to track orders, save favorites, and enjoy exclusive offers on authentic Nepali momos.`,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `Sign In | ${siteName}`,
      description: 'Sign in to your account to track orders and save favorites.',
      type: 'website',
      images: [ogImage],
    },
  };
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
