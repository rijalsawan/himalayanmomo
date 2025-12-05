import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Himalayan Momos | Authentic Nepali Dumplings & Cuisine",
  description: "Experience authentic Nepali momos handcrafted with love using traditional family recipes. Steamed, fried, or in jhol - taste the Himalayas in every bite.",
  keywords: ["momos", "nepali food", "dumplings", "himalayan cuisine", "authentic nepali", "restaurant"],
  openGraph: {
    title: "Himalayan Momos | Authentic Nepali Dumplings & Cuisine",
    description: "Experience authentic Nepali momos handcrafted with love using traditional family recipes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${inter.variable} ${poppins.variable} ${quicksand.variable} font-sans antialiased overflow-x-hidden`}
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
