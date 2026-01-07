import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your MO:MO Station account to track orders, save favorites, and enjoy exclusive offers on authentic Nepali momos.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Sign In | MO:MO Station',
    description: 'Sign in to your account to track orders and save favorites.',
    type: 'website',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
