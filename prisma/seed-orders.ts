import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Sample menu items for orders
const menuItems = [
  { name: 'Classic Chicken Momo', price: 12.99, image: '/images/menu/chicken-momo.jpg' },
  { name: 'Spicy Buff Momo', price: 13.99, image: '/images/menu/buff-momo.jpg' },
  { name: 'Vegetable Momo', price: 10.99, image: '/images/menu/veg-momo.jpg' },
  { name: 'Pork Momo', price: 13.99, image: '/images/menu/pork-momo.jpg' },
  { name: 'Cheese Momo', price: 14.99, image: '/images/menu/cheese-momo.jpg' },
  { name: 'Jhol Momo', price: 14.99, image: '/images/menu/jhol-momo.jpg' },
  { name: 'Fried Momo', price: 13.99, image: '/images/menu/fried-momo.jpg' },
  { name: 'Momo Platter', price: 24.99, image: '/images/menu/platter.jpg' },
  { name: 'Mango Lassi', price: 4.99, image: '/images/menu/lassi.jpg' },
  { name: 'Masala Chai', price: 3.49, image: '/images/menu/chai.jpg' },
];

const statuses: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

// Status distribution (weighted towards completed orders for realistic stats)
const statusWeights = [
  { status: 'PENDING', weight: 5 },
  { status: 'CONFIRMED', weight: 8 },
  { status: 'PREPARING', weight: 10 },
  { status: 'READY', weight: 5 },
  { status: 'OUT_FOR_DELIVERY', weight: 7 },
  { status: 'DELIVERED', weight: 55 },
  { status: 'CANCELLED', weight: 10 },
];

function getWeightedStatus(): OrderStatus {
  const totalWeight = statusWeights.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of statusWeights) {
    random -= item.weight;
    if (random <= 0) {
      return item.status as OrderStatus;
    }
  }
  return 'DELIVERED';
}

function getRandomItems() {
  const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
  const items = [];
  
  for (let i = 0; i < numItems; i++) {
    const item = menuItems[Math.floor(Math.random() * menuItems.length)];
    const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
    items.push({
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
    });
  }
  
  return items;
}

function getRandomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 12) + 10); // 10 AM - 10 PM
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

const addresses = [
  '123 Main Street, New York, NY 10001',
  '456 Oak Avenue, Brooklyn, NY 11201',
  '789 Pine Road, Queens, NY 11101',
  '321 Elm Street, Manhattan, NY 10002',
  '654 Maple Lane, Bronx, NY 10451',
  '987 Cedar Drive, Staten Island, NY 10301',
  '147 Birch Way, Jersey City, NJ 07302',
  '258 Willow Court, Hoboken, NJ 07030',
  '369 Spruce Boulevard, Newark, NJ 07101',
  '741 Cherry Circle, Yonkers, NY 10701',
];

const phones = [
  '(555) 123-4567',
  '(555) 234-5678',
  '(555) 345-6789',
  '(555) 456-7890',
  '(555) 567-8901',
  '(555) 678-9012',
  '(555) 789-0123',
  '(555) 890-1234',
  '(555) 901-2345',
  '(555) 012-3456',
];

async function main() {
  console.log('🌱 Starting to seed 100 dummy orders...\n');

  // First, get or create a test user
  let testUser = await prisma.user.findFirst({
    where: { email: 'testuser@example.com' },
  });

  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        phone: '(555) 000-0000',
        address: '100 Test Street, New York, NY 10001',
      },
    });
    console.log('✅ Created test user');
  }

  // Get all existing users to distribute orders
  const users = await prisma.user.findMany({ take: 20 });
  
  if (users.length === 0) {
    console.log('❌ No users found. Creating test user...');
    return;
  }

  console.log(`📊 Found ${users.length} users to distribute orders\n`);

  const orders = [];
  
  for (let i = 0; i < 100; i++) {
    const items = getRandomItems();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08875; // NYC tax rate
    const deliveryFee = Math.random() > 0.3 ? 3.99 : 0; // 70% have delivery fee
    const total = subtotal + tax + deliveryFee;
    
    const user = users[Math.floor(Math.random() * users.length)];
    const status = getWeightedStatus();
    const createdAt = getRandomDate(30); // Orders from last 30 days
    
    orders.push({
      userId: user.id,
      status,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      deliveryFee,
      total: parseFloat(total.toFixed(2)),
      address: addresses[Math.floor(Math.random() * addresses.length)],
      phone: phones[Math.floor(Math.random() * phones.length)],
      notes: Math.random() > 0.7 ? 'Extra spicy please!' : null,
      createdAt,
      updatedAt: createdAt,
      items: {
        create: items,
      },
    });
  }

  // Create orders one by one (to handle nested creates)
  let created = 0;
  for (const orderData of orders) {
    await prisma.order.create({
      data: orderData,
    });
    created++;
    if (created % 10 === 0) {
      console.log(`📦 Created ${created}/100 orders...`);
    }
  }

  console.log('\n✅ Successfully seeded 100 dummy orders!');
  
  // Print stats
  const stats = await prisma.order.groupBy({
    by: ['status'],
    _count: true,
  });
  
  console.log('\n📊 Order Status Distribution:');
  stats.forEach((s) => {
    console.log(`   ${s.status}: ${s._count}`);
  });

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: 'DELIVERED' },
  });
  
  console.log(`\n💰 Total Revenue (Delivered): $${totalRevenue._sum.total?.toFixed(2)}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
