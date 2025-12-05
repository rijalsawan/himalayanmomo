export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  location?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The best momos I\'ve ever had outside of Nepal! The jhol momo is absolutely incredible - the soup is perfectly spiced and the dumplings are so tender. This place is now my go-to for authentic Nepali food.',
    date: '2024-11-15',
    location: 'New York, NY',
  },
  {
    id: 'testimonial-2',
    name: 'Rajesh Thapa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'As someone from Kathmandu, I can say these momos taste just like home. The achar is perfectly balanced and brings back so many memories. The staff is friendly and the atmosphere is warm and welcoming.',
    date: '2024-11-10',
    location: 'Queens, NY',
  },
  {
    id: 'testimonial-3',
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'I brought my whole family here and everyone loved it! The vegetable momos are perfect for my vegetarian daughter, and the buff momos were a hit with my husband. Will definitely be coming back!',
    date: '2024-10-28',
    location: 'Brooklyn, NY',
  },
  {
    id: 'testimonial-4',
    name: 'Michael Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    text: 'Great food, generous portions, and reasonable prices. The fried momos are crispy perfection. Only wish they had more seating during peak hours. The masala chai is a must-try!',
    date: '2024-10-20',
    location: 'Manhattan, NY',
  },
  {
    id: 'testimonial-5',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'The flavors here are unmatched! You can taste the authenticity in every bite. The chefs clearly know what they\'re doing. My new favorite spot for momos in the city!',
    date: '2024-10-15',
    location: 'Jersey City, NJ',
  },
  {
    id: 'testimonial-6',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'First time trying Nepali food and I\'m hooked! The staff was super helpful in explaining the menu. The chicken momo with spicy achar is now my favorite comfort food.',
    date: '2024-10-05',
    location: 'Hoboken, NJ',
  },
];
