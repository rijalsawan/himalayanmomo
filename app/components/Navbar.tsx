'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '../context/CartContext';
import { useSession, signOut } from 'next-auth/react';

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
  const { data: session, status } = useSession();
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slide-down ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom overflow-hidden">
        <div className="flex items-center justify-between h-16 md:h-20">
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
            <button
              onClick={openCart}
              className={`relative p-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
                useDarkText
                  ? 'text-foreground hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold animate-scale-in"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A] max-w-[100px] truncate">
                      {session.user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-[#1A1A1A] hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-[#B8420A] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-1 md:hidden flex-shrink-0">
            {/* Mobile Cart Button */}
            <button
              onClick={openCart}
              className={`relative p-2 rounded-full transition-all duration-200 active:scale-95 flex-shrink-0 ${
                useDarkText
                  ? 'text-foreground hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold"
                >
                  {totalItems}
                </span>
              )}
            </button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex-shrink-0 w-10 h-10 ${useDarkText ? 'text-foreground' : 'text-white'}`}
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white p-0 overflow-y-auto">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col">
                      <span className="font-playfair text-xl font-bold text-foreground">
                        Himalayan
                      </span>
                      <span className="font-dancing text-base text-primary -mt-1">
                        Momos
                      </span>
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <nav className="flex flex-col p-4">
                    {navLinks.map((link) => (
                      link.href === '/menu' ? (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center text-base font-medium text-foreground/80 hover:text-primary hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <button
                          key={link.name}
                          onClick={() => handleNavClick(link.href)}
                          className="flex items-center text-base font-medium text-foreground/80 hover:text-primary hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg text-left"
                        >
                          {link.name}
                        </button>
                      )
                    ))}
                  </nav>

                  {/* Mobile Auth Section */}
                  <div className="mt-auto p-4 border-t border-gray-100">
                    {session ? (
                      <div className="space-y-3">
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {session.user?.image ? (
                              <img
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-[#1A1A1A] text-sm truncate">
                              {session.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {session.user?.email}
                            </p>
                          </div>
                        </div>
                        
                        {/* User Links */}
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 p-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-gray-50 transition-colors rounded-lg border border-gray-200"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 p-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-gray-50 transition-colors rounded-lg border border-gray-200"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Orders
                          </Link>
                        </div>
                        
                        <Button
                          onClick={() => {
                            signOut({ callbackUrl: '/' });
                            setIsOpen(false);
                          }}
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          asChild
                          className="w-full bg-primary hover:bg-[#B8420A] text-white h-12"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/login">Sign In</Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white h-12"
                          onClick={() => setIsOpen(false)}
                        >
                          <Link href="/signup">Create Account</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
