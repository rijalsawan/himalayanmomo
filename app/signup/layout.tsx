import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.footerBrandName || 'MO:MO Station';
  const ogImage = settings.ogImage || '/og-image.png';

  return {
    title: 'Create Account',
    description: `Create your ${siteName} account to order authentic Nepali momos, track deliveries, save favorites, and get exclusive member offers.`,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `Create Account | ${siteName}`,
      description: `Join ${siteName} to order authentic Nepali momos and get exclusive offers.`,
      type: 'website',
      images: [ogImage],
    },
  };
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
