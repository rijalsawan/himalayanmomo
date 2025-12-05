'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Menu', href: '/menu' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    
    // Check if it's a hash link for the home page
    if (href.startsWith('/#')) {
      if (isHomePage) {
        const element = document.querySelector(href.replace('/', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = href;
      }
    }
  };

  const isActiveLink = (href: string) => {
    if (href === '/menu') return pathname === '/menu';
    return false;
  };

  // All pages now use light backgrounds, so always use dark text
  const useDarkText = true;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col">
              <span
                className={`font-playfair text-2xl font-bold transition-colors ${
                  useDarkText ? 'text-foreground' : 'text-white'
                }`}
              >
                Himalayan
              </span>
              <span
                className={`font-dancing text-lg -mt-2 transition-colors ${
                  useDarkText ? 'text-primary' : 'text-[#F4A261]'
                }`}
              >
                Momo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href === '/menu' ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActiveLink(link.href)
                      ? 'text-primary'
                      : useDarkText
                      ? 'text-foreground/80'
                      : 'text-white/90'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    useDarkText ? 'text-foreground/80' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </button>
              )
            ))}

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className={`relative p-2 rounded-full transition-colors ${
                useDarkText
                  ? 'text-foreground hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            <Button
              asChild
              className="bg-primary hover:bg-[#B8420A] text-white"
            >
              <Link href="/menu">Order Now</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className={`relative p-2 rounded-full transition-colors ${
                useDarkText
                  ? 'text-foreground hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={useDarkText ? 'text-foreground' : 'text-white'}
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col">
                    <span className="font-playfair text-2xl font-bold text-foreground">
                      Himalayan
                    </span>
                    <span className="font-dancing text-lg text-primary -mt-1">
                      Momos
                    </span>
                  </div>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      link.href === '/menu' ? (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <button
                          key={link.name}
                          onClick={() => handleNavClick(link.href)}
                          className="text-left text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2 border-b border-border"
                        >
                          {link.name}
                        </button>
                      )
                    ))}
                  </nav>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-[#B8420A] text-white mt-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/menu">Order Now</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
