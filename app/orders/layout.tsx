import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'Track your MO:MO Station orders. View order history, check delivery status, and reorder your favorites.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
