import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch public site settings (no auth required)
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      // Return default settings if none exist
      settings = {
        id: 'default',
        heroBadgeText: 'Authentic Nepali Mo:Mo',
        heroHeadingLine1: 'Taste the',
        heroHighlightText: 'Himalayan',
        heroHeadingLine2: 'Magic in Every Bite',
        heroDescription: 'Handcrafted momos made fresh daily using traditional family recipes passed down through generations. Experience the authentic flavors of Nepal.',
        heroLogo: '/brandlogo.svg',
        stat1Icon: 'Award',
        stat1Value: '15+',
        stat1Label: 'Years Experience',
        stat2Icon: 'Users',
        stat2Value: '50K+',
        stat2Label: 'Happy Customers',
        stat3Icon: 'Clock',
        stat3Value: '20min',
        stat3Label: 'Avg. Prep Time',
        // About/Story Section
        aboutImage1: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
        aboutImage2: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
        aboutImage3: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
        aboutBadgeNumber: '15+',
        aboutBadgeText: 'Years of Excellence',
        aboutSubtitle: 'Our Story',
        aboutHeadline: 'A Journey of Authentic Flavors',
        aboutParagraph: 'What started as a small family kitchen in the heart of Nepal has grown into a beloved destination for momo enthusiasts. Our founder, inspired by generations of family recipes, brought the authentic taste of Himalayan momos to share with the world.',
        aboutStat1Value: '15+',
        aboutStat1Label: 'Years',
        aboutStat2Value: '50K+',
        aboutStat2Label: 'Customers',
        aboutStat3Value: '25+',
        aboutStat3Label: 'Recipes',
        aboutStat4Value: '100%',
        aboutStat4Label: 'Fresh Daily',
        // Popular Dishes
        popularDishIds: [],
        // Why Choose Us Section
        whySubtitle: 'Why Choose Us',
        whyHeadline: 'What Makes Us',
        whyHighlightText: 'Special',
        whyDescription: "We're not just a restaurant — we're a family dedicated to bringing you the most authentic Nepali dining experience.",
        whyCtaText: 'Ready to experience the difference?',
        whyFeature1Icon: 'ChefHat',
        whyFeature1Title: 'Handmade Fresh Daily',
        whyFeature1Desc: 'Every momo is handcrafted by our skilled chefs each morning using traditional techniques.',
        whyFeature2Icon: 'ScrollText',
        whyFeature2Title: 'Authentic Family Recipes',
        whyFeature2Desc: 'Recipes passed down through generations, straight from the heart of Nepal.',
        whyFeature3Icon: 'Leaf',
        whyFeature3Title: 'Premium Ingredients',
        whyFeature3Desc: 'We source the freshest local ingredients and authentic Himalayan spices.',
        whyFeature4Icon: 'Truck',
        whyFeature4Title: 'Fast Delivery',
        whyFeature4Desc: 'Hot and fresh momos delivered to your doorstep in 30 minutes or less.',
        // Testimonials Section
        testimonialSubtitle: 'Testimonials',
        testimonialHeadline: 'Loved by Momo Enthusiasts',
        testimonialDescription: "Join thousands of satisfied customers who've made us their favorite spot",
        // Testimonial Stats
        testimonialStat1Icon: 'Users',
        testimonialStat1Value: '500+',
        testimonialStat1Label: 'Happy Customers',
        testimonialStat2Icon: 'Star',
        testimonialStat2Value: '4.9',
        testimonialStat2Label: 'Average Rating',
        testimonialStat3Icon: 'CheckCircle',
        testimonialStat3Value: '100%',
        testimonialStat3Label: 'Authentic Recipes',
        // Contact Section
        contactSubtitle: 'Contact Us',
        contactHeadline: "Let's Start a Conversation",
        contactDescription: "Have a question or want to make a reservation? We'd love to hear from you!",
        contactFormTitle: 'Send us a Message',
        contactFormSubtitle: "We'll get back to you within 24 hours",
        // Contact Info
        contactAddressLabel: 'Visit Us',
        contactAddressStreet: '123 Momo Street',
        contactAddressCity: 'San Francisco',
        contactAddressState: 'CA',
        contactAddressZip: '94102',
        contactPhoneLabel: 'Call Us',
        contactPhone: '(415) 555-MOMO',
        contactEmailLabel: 'Email Us',
        contactEmail: 'hello@momostation.com',
        contactHoursLabel: 'Open Hours',
        contactHoursLine1: 'Mon-Thu: 11AM-10PM',
        contactHoursLine2: 'Fri-Sat: 10AM-11PM',
        // Social Links
        contactSocial1Name: 'Instagram',
        contactSocial1Url: 'https://instagram.com',
        contactSocial1Icon: 'Instagram',
        contactSocial2Name: 'Facebook',
        contactSocial2Url: 'https://facebook.com',
        contactSocial2Icon: 'Facebook',
        contactSocial3Name: 'TikTok',
        contactSocial3Url: 'https://tiktok.com',
        contactSocial3Icon: 'Video',
        // Footer Section
        footerCtaHeadline: 'Ready to taste the Himalayas?',
        footerCtaHighlight: 'Himalayas',
        footerCtaDescription: 'Order online or visit us today for an authentic momo experience.',
        footerCtaButton1Text: 'Order Now',
        footerCtaButton1Url: '/menu',
        footerCtaButton2Text: 'Contact Us',
        footerCtaButton2Url: '#contact',
        footerBrandName: 'MO:MO Station',
        footerBrandDescription: 'Authentic Nepali Dumplings. Experience the authentic taste of Nepal with our handcrafted momos, made fresh daily with love and tradition.',
        footerQuickLinksTitle: 'Quick Links',
        footerQuickLinks: [
          { text: 'Home', href: '#home' },
          { text: 'About Us', href: '#about' },
          { text: 'Our Menu', href: '#menu' },
          { text: 'Testimonials', href: '#testimonials' },
          { text: 'Contact', href: '#contact' },
        ],
        footerMenuTitle: 'Our Menu',
        footerMenuItemIds: [],
        footerContactTitle: 'Get in Touch',
        footerCopyright: 'All rights reserved. Made with love for momo lovers.',
        footerShowSocials: true,
        footerShowQuickLinks: true,
        footerShowMenuLinks: true,
        footerShowContact: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}
