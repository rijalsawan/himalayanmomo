import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import AuthProvider from "./providers/AuthProvider";
import AuthPromptWrapper from "./components/AuthPromptWrapper";
import { getSiteSettings } from "@/lib/getSiteSettings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
          url: settings.ogImage || "/og-image.svg",
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
      images: [settings.twitterImage || "/twitter-image.svg"],
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
        className={`${inter.variable} ${poppins.variable} ${quicksand.variable} font-sans antialiased`}
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
