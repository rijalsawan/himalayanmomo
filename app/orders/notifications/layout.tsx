import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | MO:MO Station',
  description: 'View your order updates, promotions, and notifications from MO:MO Station.',
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
