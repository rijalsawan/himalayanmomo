import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Bricolage_Grotesque, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import AuthProvider from "./providers/AuthProvider";
import AuthPromptWrapper from "./components/AuthPromptWrapper";
import { getSiteSettings } from "@/lib/getSiteSettings";

// Brutalist typography system: bold grotesque display font, a clean grotesque
// body font, a mono font for uppercase labels/tags/eyebrows, and an italic
// serif used only for single-word accents inside headings.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

// Static fallback keywords (these rarely change)
const siteKeywords = [
  "momos",
  "nepali food",
  "dumplings",
  "himalayan cuisine",
  "authentic nepali restaurant",
  "nepali dumplings",
  "steamed momos",
  "fried momos",
  "jhol momo",
  "momo delivery",
  "best momos",
  "nepali restaurant near me",
  "authentic dumplings",
  "asian cuisine",
  "food delivery",
];

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// This route tree (title, OG/Twitter tags, JSON-LD, favicons, etc.) is otherwise
// statically prerendered once at build time, which froze whatever business info
// existed in the database at build - admin edits to site settings (address, phone,
// social preview image, ...) never reached the live site or search engines without
// a full redeploy. Revalidate periodically so the real, admin-entered info actually
// propagates on its own.
export const revalidate = 300; // 5 minutes

// Dynamic metadata generation - fetches from database
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const siteName = settings.siteTitle?.split('|')[0]?.trim() || "MO:MO Station";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.siteTitle || `${siteName} | Authentic Nepali Momos & Dumplings`,
      template: `%s | ${siteName}`,
    },
    description: settings.siteDescription,
    keywords: siteKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: siteName,
      title: settings.siteTitle || `${siteName} | Authentic Nepali Momos & Dumplings`,
      description: settings.siteDescription,
      images: [
        {
          url: settings.ogImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: settings.ogImageAlt || `${siteName} - Authentic Nepali Momos`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle || `${siteName} | Authentic Nepali Momos & Dumplings`,
      description: settings.siteDescription,
      images: [settings.twitterImage || "/twitter-image.png"],
      creator: settings.twitterHandle || "@momostation",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: settings.faviconSvg || "/favicon.svg", type: "image/svg+xml" },
        { url: settings.favicon || "/favicon-32.svg", type: "image/svg+xml", sizes: "32x32" },
      ],
      apple: [
        { url: settings.appleTouchIcon || "/apple-touch-icon.svg", type: "image/svg+xml", sizes: "180x180" },
      ],
      shortcut: settings.faviconSvg || "/favicon.svg",
    },
    manifest: "/manifest.json",
    alternates: {
      canonical: siteUrl,
    },
    category: "food & drink",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${bricolage.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <CartSidebar />
            <AuthPromptWrapper />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
