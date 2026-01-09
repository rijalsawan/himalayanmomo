import { PrismaClient, UserNotificationType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all users
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
  });

  if (users.length === 0) {
    console.log('No users found. Please create users first.');
    return;
  }

  console.log(`Found ${users.length} users. Creating sample notifications...`);

  const notificationTemplates = [
    {
      type: 'WELCOME' as UserNotificationType,
      title: 'Welcome to MO:MO Station! 🥟',
      message: 'Welcome to our family. Explore our authentic Nepali momos and enjoy exclusive offers.',
    },
    {
      type: 'ORDER_CONFIRMED' as UserNotificationType,
      title: 'Order Confirmed! 🎉',
      message: 'Your order has been confirmed and will be prepared shortly.',
    },
    {
      type: 'ORDER_PREPARING' as UserNotificationType,
      title: 'Preparing Your Order 👨‍🍳',
      message: 'Our chefs are now preparing your order. Fresh momos coming your way!',
    },
    {
      type: 'ORDER_READY' as UserNotificationType,
      title: 'Order Ready! 📦',
      message: 'Your order is ready and waiting for delivery.',
    },
    {
      type: 'ORDER_OUT_FOR_DELIVERY' as UserNotificationType,
      title: 'Out for Delivery 🚗',
      message: 'Your order is on its way! Track your rider for live updates.',
    },
    {
      type: 'ORDER_DELIVERED' as UserNotificationType,
      title: 'Order Delivered! ✅',
      message: 'Your order has been delivered. Enjoy your meal!',
    },
    {
      type: 'PROMOTION' as UserNotificationType,
      title: 'Special Offer Just for You! 🎁',
      message: 'Get 20% off on your next order! Use code MOMO20 at checkout. Valid until this weekend.',
    },
    {
      type: 'PROMOTION' as UserNotificationType,
      title: 'Happy Hour! ⏰',
      message: 'Order between 3-5 PM today and get free delivery on all orders!',
    },
  ];

  let createdCount = 0;

  for (const user of users) {
    // Create 3-5 random notifications per user
    const numNotifications = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...notificationTemplates].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numNotifications);

    for (let i = 0; i < selected.length; i++) {
      const template = selected[i];
      const isRead = Math.random() > 0.5; // 50% chance of being read
      
      // Create notification with random date in last 7 days
      const daysAgo = Math.floor(Math.random() * 7);
      const hoursAgo = Math.floor(Math.random() * 24);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(createdAt.getHours() - hoursAgo);

      await prisma.userNotification.create({
        data: {
          userId: user.id,
          type: template.type,
          title: template.title,
          message: template.message,
          read: isRead,
          createdAt,
        },
      });
      createdCount++;
    }

    console.log(`Created ${selected.length} notifications for user: ${user.name || user.id}`);
  }

  console.log(`\n✅ Created ${createdCount} sample notifications for ${users.length} users!`);
}

main()
  .catch((e) => {
    console.error('Error seeding notifications:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
