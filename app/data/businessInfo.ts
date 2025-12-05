export const businessInfo = {
  name: 'Himalayan Momos',
  tagline: 'Authentic Nepali Dumplings & Cuisine',
  description: 'Experience the authentic taste of Nepal with our handcrafted momos, made fresh daily using traditional family recipes passed down through generations.',
  
  contact: {
    phone: '+1 (555) 123-4567',
    email: 'hello@himalayanmomos.com',
    address: {
      street: '123 Himalayan Way',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
  },

  hours: {
    monday: { open: '11:00 AM', close: '10:00 PM', closed: false },
    tuesday: { open: '11:00 AM', close: '10:00 PM', closed: false },
    wednesday: { open: '11:00 AM', close: '10:00 PM', closed: false },
    thursday: { open: '11:00 AM', close: '10:00 PM', closed: false },
    friday: { open: '11:00 AM', close: '11:00 PM', closed: false },
    saturday: { open: '10:00 AM', close: '11:00 PM', closed: false },
    sunday: { open: '10:00 AM', close: '9:00 PM', closed: false },
  },

  social: {
    instagram: 'https://instagram.com/himalayanmomos',
    facebook: 'https://facebook.com/himalayanmomos',
    tiktok: 'https://tiktok.com/@himalayanmomos',
    twitter: 'https://twitter.com/himalayanmomos',
  },

  features: [
    {
      id: 'handmade',
      title: 'Handmade Fresh Daily',
      description: 'Every momo is handcrafted by our skilled chefs each morning using traditional techniques.',
      icon: 'ChefHat',
    },
    {
      id: 'authentic',
      title: 'Authentic Family Recipes',
      description: 'Recipes passed down through generations, straight from the heart of Nepal.',
      icon: 'ScrollText',
    },
    {
      id: 'ingredients',
      title: 'Premium Ingredients',
      description: 'We source the freshest local ingredients and authentic Himalayan spices.',
      icon: 'Leaf',
    },
    {
      id: 'delivery',
      title: 'Fast Delivery',
      description: 'Hot and fresh momos delivered to your doorstep in 30 minutes or less.',
      icon: 'Truck',
    },
  ],

  stats: [
    { label: 'Years of Experience', value: '15+' },
    { label: 'Momos Served', value: '500K+' },
    { label: 'Happy Customers', value: '50K+' },
    { label: 'Five Star Reviews', value: '2K+' },
  ],

  story: {
    title: 'A Taste of the Himalayas',
    subtitle: 'Our Story',
    paragraphs: [
      'Our journey began in the heart of the Himalayas, where our grandmother first taught us the art of making perfect momos. Each fold, each filling, each spice blend carries the wisdom of generations.',
      'Today, we bring that same love and authenticity to every plate we serve. From our kitchen to your table, we promise an experience that transports you to the bustling streets of Kathmandu — where the aroma of steaming momos fills the air and every bite tells a story.',
    ],
  },

  
};

export type BusinessInfo = typeof businessInfo;
