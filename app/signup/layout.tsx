import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your MO:MO Station account to order authentic Nepali momos, track deliveries, save favorites, and get exclusive member offers.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Create Account | MO:MO Station',
    description: 'Join MO:MO Station to order authentic Nepali momos and get exclusive offers.',
    type: 'website',
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
