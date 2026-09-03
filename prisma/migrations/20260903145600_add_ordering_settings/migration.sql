-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('PICKUP', 'DINE_IN', 'DELIVERY');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fulfillmentType" "FulfillmentType" NOT NULL DEFAULT 'PICKUP';

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "comingSoonEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "comingSoonMessage" TEXT NOT NULL DEFAULT 'We''re opening soon! Please don''t place an order just yet.',
ADD COLUMN     "promoEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "promoMessage" TEXT NOT NULL DEFAULT 'Get 10% OFF online Pickup & Dine-In orders!',
ADD COLUMN     "deliveryEnabled" BOOLEAN NOT NULL DEFAULT false;
