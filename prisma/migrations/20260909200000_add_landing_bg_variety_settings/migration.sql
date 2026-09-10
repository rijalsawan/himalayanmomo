-- AlterTable: additive, defaulted columns only - safe for existing rows
ALTER TABLE "SiteSettings" ADD COLUMN     "heroBackgroundStyle" TEXT NOT NULL DEFAULT 'momos';
ALTER TABLE "SiteSettings" ADD COLUMN     "sectionBackgroundStyle" TEXT NOT NULL DEFAULT 'dots';
