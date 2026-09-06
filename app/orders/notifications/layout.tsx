import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'View your order updates, promotions, and notifications.',
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
