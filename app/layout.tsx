import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Quicksand } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";
import AuthProvider from "./providers/AuthProvider";
import AuthPromptWrapper from "./components/AuthPromptWrapper";

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

const siteConfig = {
  name: "MO:MO Station",
  description: "Experience authentic Nepali momos handcrafted with love using traditional family recipes. Steamed, fried, or in jhol - taste the Himalayas in every bite. Order online for delivery or pickup.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  keywords: [
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
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Authentic Nepali Momos & Dumplings`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Authentic Nepali Momos & Dumplings`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Authentic Nepali Momos`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Authentic Nepali Momos & Dumplings`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@momostation",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteConfig.url,
  },
  category: "food & drink",
};

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
