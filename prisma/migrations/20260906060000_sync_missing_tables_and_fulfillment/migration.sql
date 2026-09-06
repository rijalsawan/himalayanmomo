-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('PICKUP', 'DINE_IN', 'DELIVERY');

-- CreateEnum
CREATE TYPE "UserNotificationType" AS ENUM ('ORDER_CONFIRMED', 'ORDER_PREPARING', 'ORDER_READY', 'ORDER_OUT_FOR_DELIVERY', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'PROMOTION', 'WELCOME', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fulfillmentType" "FulfillmentType" NOT NULL DEFAULT 'PICKUP';

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroBadgeText" TEXT NOT NULL DEFAULT 'Authentic Nepali Mo:Mo',
    "heroHeadingLine1" TEXT NOT NULL DEFAULT 'Taste the',
    "heroHighlightText" TEXT NOT NULL DEFAULT 'Himalayan',
    "heroHeadingLine2" TEXT NOT NULL DEFAULT 'Magic in Every Bite',
    "heroDescription" TEXT NOT NULL DEFAULT 'Handcrafted momos made fresh daily using traditional family recipes passed down through generations. Experience the authentic flavors of Nepal.',
    "heroLogo" TEXT NOT NULL DEFAULT '/brandlogo.svg',
    "stat1Icon" TEXT NOT NULL DEFAULT 'Award',
    "stat1Value" TEXT NOT NULL DEFAULT '15+',
    "stat1Label" TEXT NOT NULL DEFAULT 'Years Experience',
    "stat2Icon" TEXT NOT NULL DEFAULT 'Users',
    "stat2Value" TEXT NOT NULL DEFAULT '50K+',
    "stat2Label" TEXT NOT NULL DEFAULT 'Happy Customers',
    "stat3Icon" TEXT NOT NULL DEFAULT 'Clock',
    "stat3Value" TEXT NOT NULL DEFAULT '20min',
    "stat3Label" TEXT NOT NULL DEFAULT 'Avg. Prep Time',
    "aboutImage1" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
    "aboutImage2" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
    "aboutImage3" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop',
    "aboutBadgeNumber" TEXT NOT NULL DEFAULT '15+',
    "aboutBadgeText" TEXT NOT NULL DEFAULT 'Years of Excellence',
    "aboutSubtitle" TEXT NOT NULL DEFAULT 'Our Story',
    "aboutHeadline" TEXT NOT NULL DEFAULT 'A Journey of Authentic Flavors',
    "aboutParagraph" TEXT NOT NULL DEFAULT 'What started as a small family kitchen in the heart of Nepal has grown into a beloved destination for momo enthusiasts. Our founder, inspired by generations of family recipes, brought the authentic taste of Himalayan momos to share with the world.',
    "aboutStat1Value" TEXT NOT NULL DEFAULT '15+',
    "aboutStat1Label" TEXT NOT NULL DEFAULT 'Years',
    "aboutStat2Value" TEXT NOT NULL DEFAULT '50K+',
    "aboutStat2Label" TEXT NOT NULL DEFAULT 'Customers',
    "aboutStat3Value" TEXT NOT NULL DEFAULT '25+',
    "aboutStat3Label" TEXT NOT NULL DEFAULT 'Recipes',
    "aboutStat4Value" TEXT NOT NULL DEFAULT '100%',
    "aboutStat4Label" TEXT NOT NULL DEFAULT 'Fresh Daily',
    "popularDishIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whySubtitle" TEXT NOT NULL DEFAULT 'Why Choose Us',
    "whyHeadline" TEXT NOT NULL DEFAULT 'What Makes Us',
    "whyHighlightText" TEXT NOT NULL DEFAULT 'Special',
    "whyDescription" TEXT NOT NULL DEFAULT 'We''re not just a restaurant — we''re a family dedicated to bringing you the most authentic Nepali dining experience.',
    "whyCtaText" TEXT NOT NULL DEFAULT 'Ready to experience the difference?',
    "whyFeature1Icon" TEXT NOT NULL DEFAULT 'ChefHat',
    "whyFeature1Title" TEXT NOT NULL DEFAULT 'Handmade Fresh Daily',
    "whyFeature1Desc" TEXT NOT NULL DEFAULT 'Every momo is handcrafted by our skilled chefs each morning using traditional techniques.',
    "whyFeature2Icon" TEXT NOT NULL DEFAULT 'ScrollText',
    "whyFeature2Title" TEXT NOT NULL DEFAULT 'Authentic Family Recipes',
    "whyFeature2Desc" TEXT NOT NULL DEFAULT 'Recipes passed down through generations, straight from the heart of Nepal.',
    "whyFeature3Icon" TEXT NOT NULL DEFAULT 'Leaf',
    "whyFeature3Title" TEXT NOT NULL DEFAULT 'Premium Ingredients',
    "whyFeature3Desc" TEXT NOT NULL DEFAULT 'We source the freshest local ingredients and authentic Himalayan spices.',
    "whyFeature4Icon" TEXT NOT NULL DEFAULT 'Truck',
    "whyFeature4Title" TEXT NOT NULL DEFAULT 'Fast Delivery',
    "whyFeature4Desc" TEXT NOT NULL DEFAULT 'Hot and fresh momos delivered to your doorstep in 30 minutes or less.',
    "testimonialSubtitle" TEXT NOT NULL DEFAULT 'Testimonials',
    "testimonialHeadline" TEXT NOT NULL DEFAULT 'Loved by Momo Enthusiasts',
    "testimonialDescription" TEXT NOT NULL DEFAULT 'Join thousands of satisfied customers who''ve made us their favorite spot',
    "testimonialStat1Icon" TEXT NOT NULL DEFAULT 'Users',
    "testimonialStat1Value" TEXT NOT NULL DEFAULT '500+',
    "testimonialStat1Label" TEXT NOT NULL DEFAULT 'Happy Customers',
    "testimonialStat2Icon" TEXT NOT NULL DEFAULT 'Star',
    "testimonialStat2Value" TEXT NOT NULL DEFAULT '4.9',
    "testimonialStat2Label" TEXT NOT NULL DEFAULT 'Average Rating',
    "testimonialStat3Icon" TEXT NOT NULL DEFAULT 'CheckCircle',
    "testimonialStat3Value" TEXT NOT NULL DEFAULT '100%',
    "testimonialStat3Label" TEXT NOT NULL DEFAULT 'Authentic Recipes',
    "contactSubtitle" TEXT NOT NULL DEFAULT 'Contact Us',
    "contactHeadline" TEXT NOT NULL DEFAULT 'Let''s Start a Conversation',
    "contactDescription" TEXT NOT NULL DEFAULT 'Have a question or want to make a reservation? We''d love to hear from you!',
    "contactFormTitle" TEXT NOT NULL DEFAULT 'Send us a Message',
    "contactFormSubtitle" TEXT NOT NULL DEFAULT 'We''ll get back to you within 24 hours',
    "contactAddressLabel" TEXT NOT NULL DEFAULT 'Visit Us',
    "contactAddressStreet" TEXT NOT NULL DEFAULT '123 Momo Street',
    "contactAddressCity" TEXT NOT NULL DEFAULT 'San Francisco',
    "contactAddressState" TEXT NOT NULL DEFAULT 'CA',
    "contactAddressZip" TEXT NOT NULL DEFAULT '94102',
    "contactPhoneLabel" TEXT NOT NULL DEFAULT 'Call Us',
    "contactPhone" TEXT NOT NULL DEFAULT '(415) 555-MOMO',
    "contactEmailLabel" TEXT NOT NULL DEFAULT 'Email Us',
    "contactEmail" TEXT NOT NULL DEFAULT 'hello@momostation.com',
    "contactHoursLabel" TEXT NOT NULL DEFAULT 'Open Hours',
    "contactHoursLine1" TEXT NOT NULL DEFAULT 'Mon-Thu: 11AM-10PM',
    "contactHoursLine2" TEXT NOT NULL DEFAULT 'Fri-Sat: 10AM-11PM',
    "contactSocial1Name" TEXT NOT NULL DEFAULT 'Instagram',
    "contactSocial1Url" TEXT NOT NULL DEFAULT 'https://instagram.com',
    "contactSocial1Icon" TEXT NOT NULL DEFAULT 'Instagram',
    "contactSocial2Name" TEXT NOT NULL DEFAULT 'Facebook',
    "contactSocial2Url" TEXT NOT NULL DEFAULT 'https://facebook.com',
    "contactSocial2Icon" TEXT NOT NULL DEFAULT 'Facebook',
    "contactSocial3Name" TEXT NOT NULL DEFAULT 'TikTok',
    "contactSocial3Url" TEXT NOT NULL DEFAULT 'https://tiktok.com',
    "contactSocial3Icon" TEXT NOT NULL DEFAULT 'Video',
    "footerCtaHeadline" TEXT NOT NULL DEFAULT 'Ready to taste the Himalayas?',
    "footerCtaHighlight" TEXT NOT NULL DEFAULT 'Himalayas',
    "footerCtaDescription" TEXT NOT NULL DEFAULT 'Order online or visit us today for an authentic momo experience.',
    "footerCtaButton1Text" TEXT NOT NULL DEFAULT 'Order Now',
    "footerCtaButton1Url" TEXT NOT NULL DEFAULT '/menu',
    "footerCtaButton2Text" TEXT NOT NULL DEFAULT 'Contact Us',
    "footerCtaButton2Url" TEXT NOT NULL DEFAULT '#contact',
    "footerBrandName" TEXT NOT NULL DEFAULT 'MO:MO Station',
    "footerBrandDescription" TEXT NOT NULL DEFAULT 'Authentic Nepali Dumplings. Experience the authentic taste of Nepal with our handcrafted momos, made fresh daily with love and tradition.',
    "footerQuickLinksTitle" TEXT NOT NULL DEFAULT 'Quick Links',
    "footerQuickLinks" JSONB NOT NULL DEFAULT '[{"text": "Home", "href": "#home"}, {"text": "About Us", "href": "#about"}, {"text": "Our Menu", "href": "#menu"}, {"text": "Testimonials", "href": "#testimonials"}, {"text": "Contact", "href": "#contact"}]',
    "footerMenuTitle" TEXT NOT NULL DEFAULT 'Our Menu',
    "footerMenuItemIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "footerContactTitle" TEXT NOT NULL DEFAULT 'Get in Touch',
    "footerCopyright" TEXT NOT NULL DEFAULT 'All rights reserved. Made with love for momo lovers.',
    "footerShowSocials" BOOLEAN NOT NULL DEFAULT true,
    "footerShowQuickLinks" BOOLEAN NOT NULL DEFAULT true,
    "footerShowMenuLinks" BOOLEAN NOT NULL DEFAULT true,
    "footerShowContact" BOOLEAN NOT NULL DEFAULT true,
    "siteUrl" TEXT NOT NULL DEFAULT 'https://momostation.com',
    "siteTitle" TEXT NOT NULL DEFAULT 'MO:MO Station | Authentic Nepali Dumplings',
    "siteDescription" TEXT NOT NULL DEFAULT 'Experience authentic Nepali momos made fresh daily. Handcrafted dumplings with traditional recipes passed down through generations. Order online or visit us today!',
    "siteKeywords" TEXT NOT NULL DEFAULT 'momo, nepali food, dumplings, authentic nepali, himalayan food, nepali restaurant, momo station',
    "favicon" TEXT NOT NULL DEFAULT '/favicon-32.svg',
    "faviconSvg" TEXT NOT NULL DEFAULT '/favicon.svg',
    "appleTouchIcon" TEXT NOT NULL DEFAULT '/apple-touch-icon.svg',
    "ogImage" TEXT NOT NULL DEFAULT '/og-image.svg',
    "ogImageAlt" TEXT NOT NULL DEFAULT 'MO:MO Station - Authentic Nepali Dumplings',
    "twitterImage" TEXT NOT NULL DEFAULT '/twitter-image.svg',
    "twitterHandle" TEXT NOT NULL DEFAULT '@momostation',
    "themeColor" TEXT NOT NULL DEFAULT '#E85D04',
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "comingSoonEnabled" BOOLEAN NOT NULL DEFAULT true,
    "comingSoonMessage" TEXT NOT NULL DEFAULT 'We''re opening soon! Please don''t place an order just yet.',
    "promoEnabled" BOOLEAN NOT NULL DEFAULT true,
    "promoMessage" TEXT NOT NULL DEFAULT 'Get 10% OFF online Pickup & Dine-In orders!',
    "deliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "text" TEXT NOT NULL,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "UserNotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "orderId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'UNREAD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserNotification_userId_read_idx" ON "UserNotification"("userId", "read");

-- CreateIndex
CREATE INDEX "UserNotification_userId_createdAt_idx" ON "UserNotification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

