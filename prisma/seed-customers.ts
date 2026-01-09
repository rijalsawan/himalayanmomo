import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const sampleCustomers = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 111-2222',
    address: '123 Broadway, New York, NY 10001',
    password: 'password123',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 222-3333',
    address: '456 Park Avenue, Brooklyn, NY 11201',
    password: 'password123',
  },
  {
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '(555) 333-4444',
    address: '789 Queens Blvd, Queens, NY 11101',
    password: 'password123',
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 444-5555',
    address: '321 5th Avenue, Manhattan, NY 10002',
    password: 'password123',
  },
  {
    name: 'David Wilson',
    email: 'dwilson@email.com',
    phone: '(555) 555-6666',
    address: '654 Grand Street, Bronx, NY 10451',
    password: 'password123',
  },
  {
    name: 'Jessica Martinez',
    email: 'jmartinez@email.com',
    phone: '(555) 666-7777',
    address: '987 Victory Blvd, Staten Island, NY 10301',
    password: 'password123',
  },
  {
    name: 'Robert Taylor',
    email: 'rtaylor@email.com',
    phone: '(555) 777-8888',
    address: '147 Grove Street, Jersey City, NJ 07302',
    password: 'password123',
  },
  {
    name: 'Amanda Brown',
    email: 'amanda.b@email.com',
    phone: '(555) 888-9999',
    address: '258 Washington St, Hoboken, NJ 07030',
    password: 'password123',
  },
  {
    name: 'Christopher Lee',
    email: 'clee@email.com',
    phone: '(555) 999-0000',
    address: '369 Market Street, Newark, NJ 07101',
    password: 'password123',
  },
  {
    name: 'Ashley Garcia',
    email: 'agarcia@email.com',
    phone: '(555) 000-1111',
    address: '741 Central Ave, Yonkers, NY 10701',
    password: 'password123',
  },
  // Customers without orders (no phone/address)
  {
    name: 'New User 1',
    email: 'newuser1@email.com',
    phone: null,
    address: null,
    password: 'password123',
  },
  {
    name: 'New User 2',
    email: 'newuser2@email.com',
    phone: null,
    address: null,
    password: 'password123',
  },
  {
    name: 'Pending Customer',
    email: 'pending@email.com',
    phone: '(555) 123-0000',
    address: null,
    password: 'password123',
  },
  // Admin user
  {
    name: 'Admin User',
    email: 'admin@momoshop.com',
    phone: '(555) 100-0000',
    address: '1 Admin Plaza, New York, NY 10001',
    password: 'admin123',
    role: 'ADMIN' as const,
  },
];

async function main() {
  console.log('🌱 Starting to seed customers...\n');

  for (const customer of sampleCustomers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: customer.email },
    });

    if (existingUser) {
      console.log(`⏭️  Skipping ${customer.name} (already exists)`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(customer.password, 10);

    await prisma.user.create({
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        password: hashedPassword,
        role: customer.role || 'USER',
      },
    });

    console.log(`✅ Created: ${customer.name}`);
  }

  console.log('\n🎉 Customer seeding completed!');
  
  // Show summary
  const totalUsers = await prisma.user.count();
  const usersWithOrders = await prisma.user.count({
    where: {
      orders: {
        some: {},
      },
    },
  });
  const usersWithoutOrders = totalUsers - usersWithOrders;

  console.log(`\n📊 Summary:`);
  console.log(`   Total customers: ${totalUsers}`);
  console.log(`   With orders: ${usersWithOrders}`);
  console.log(`   Without orders: ${usersWithoutOrders}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
