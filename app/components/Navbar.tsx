'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useCart } from '../context/CartContext';
import { useSession, signOut } from 'next-auth/react';
import AnnouncementBar from './AnnouncementBar';

const navLinks = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Menu', href: '/#menu' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [brandLogo, setBrandLogo] = useState('/brandlogo.svg');
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

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.heroLogo) setBrandLogo(data.heroLogo);
      })
      .catch(() => {});
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

  return (
    <>
      <AnnouncementBar />
      <nav
        style={{ top: 'var(--announcement-h, 0px)' }}
        className={`fixed left-0 right-0 z-50 border-b-[3px] border-dark transition-colors duration-300 ${
          scrolled ? 'bg-cream' : 'bg-warm-light'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px] gap-3">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0 min-w-0">
              <span className="relative w-10 h-10 md:w-12 md:h-12 border-brutal bg-white flex-shrink-0 overflow-hidden">
                <Image src={brandLogo} alt="MO:MO Station logo" fill sizes="48px" className="object-contain p-1" />
              </span>
              <div className="flex flex-col min-w-0 leading-none">
                <span className="font-heading font-extrabold text-base md:text-lg text-dark tracking-tight truncate">
                  MO:MO Station
                </span>
                <span className="font-accent text-[13px] md:text-sm text-brand truncate">
                  Himalayan Express
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => (
                link.href === '/menu' ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`font-mono-brutal text-[12px] font-bold uppercase tracking-[0.04em] px-3.5 py-2 border-[2px] transition-all duration-150 ${
                      isActiveLink(link.href)
                        ? 'bg-dark text-warm-light border-dark'
                        : 'border-transparent text-dark/75 hover:border-dark hover:bg-white hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="font-mono-brutal text-[12px] font-bold uppercase tracking-[0.04em] px-3.5 py-2 border-[2px] border-transparent text-dark/75 transition-all duration-150 hover:border-dark hover:bg-white hover:text-dark hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5"
                  >
                    {link.name}
                  </button>
                )
              ))}

              {/* Cart Button */}
              <button
                onClick={openCart}
                aria-label="Open cart"
                className="relative w-11 h-11 border-brutal bg-white flex items-center justify-center transition-all duration-150 hover:bg-dark hover:text-warm-light hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 ml-1"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white text-[11px] border-[1.5px] border-dark flex items-center justify-center font-bold animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Auth Section */}
              {status === 'loading' ? (
                <div className="w-11 h-11 border-brutal bg-gray-200 animate-pulse" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2.5 py-1.5 border-brutal bg-white hover:bg-cream transition-colors ml-1">
                      <Avatar className="w-7 h-7 rounded-none border-[1.5px] border-dark">
                        <AvatarImage 
                          src={session.user?.image || undefined} 
                          alt={session.user?.name || 'User'}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="bg-brand/10 rounded-none">
                          <User className="w-4 h-4 text-brand" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-bold text-dark max-w-[100px] truncate">
                        {session.user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-dark/60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-none border-[2px] border-dark shadow-brutal-sm">
                    <div className="px-3 py-2 border-b-[1.5px] border-dark">
                      <p className="text-sm font-bold text-dark">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-dark/60 truncate">
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
                <div className="flex items-center gap-2 ml-1">
                  <Link href="/login">
                    <button className="font-mono-brutal text-[12px] font-bold uppercase tracking-[0.04em] px-4 py-2.5 border-[2px] border-dark bg-white text-dark transition-all duration-150 hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="font-mono-brutal text-[12px] font-bold uppercase tracking-[0.04em] px-4 py-2.5 border-brutal bg-dark text-warm-light shadow-brutal-sm transition-all duration-150 hover:bg-brand hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center gap-2 md:hidden flex-shrink-0">
              {/* Mobile Cart Button */}
              <button
                onClick={openCart}
                aria-label="Open cart"
                className="relative w-10 h-10 border-brutal bg-white flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 transition-transform flex-shrink-0"
              >
                <ShoppingCart className="w-5 h-5 text-dark" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white text-[11px] border-[1.5px] border-dark flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Toggle menu"
                    className="flex-shrink-0 w-10 h-10 border-brutal bg-white flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 transition-transform"
                  >
                    <Menu className="w-5 h-5 text-dark" />
                    <span className="sr-only">Toggle menu</span>
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-warm-light p-0 overflow-y-auto rounded-none border-l-[3px] border-dark">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b-[3px] border-dark bg-cream">
                      <div className="flex items-center gap-3">
                        <span className="relative w-12 h-12 border-brutal bg-white flex-shrink-0 overflow-hidden">
                          <Image src={brandLogo} alt="MO:MO Station logo" fill sizes="48px" className="object-contain p-1" />
                        </span>
                        <div className="flex flex-col min-w-0 leading-none">
                          <span className="font-heading font-extrabold text-base text-dark truncate">
                            MO:MO Station
                          </span>
                          <span className="font-accent text-sm text-brand truncate">
                            Himalayan Express
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex flex-col p-4 gap-1.5">
                      {navLinks.map((link) => (
                        link.href === '/menu' ? (
                          <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center font-mono-brutal text-xs font-bold uppercase tracking-[0.05em] text-dark/80 hover:text-dark hover:bg-white hover:border-dark border-[2px] border-transparent transition-colors py-3 px-3"
                          >
                            {link.name}
                          </Link>
                        ) : (
                          <button
                            key={link.name}
                            onClick={() => handleNavClick(link.href)}
                            className="flex items-center font-mono-brutal text-xs font-bold uppercase tracking-[0.05em] text-dark/80 hover:text-dark hover:bg-white hover:border-dark border-[2px] border-transparent transition-colors py-3 px-3 text-left"
                          >
                            {link.name}
                          </button>
                        )
                      ))}
                    </nav>

                    {/* Mobile Auth Section */}
                    <div className="mt-auto p-4 border-t-[3px] border-dark">
                      {session ? (
                        <div className="space-y-3">
                          {/* User Info */}
                          <div className="flex items-center gap-3 p-3 bg-white border-brutal-thin">
                            <Avatar className="w-10 h-10 rounded-none border-[1.5px] border-dark flex-shrink-0">
                              <AvatarImage 
                                src={session.user?.image || undefined} 
                                alt={session.user?.name || 'User'}
                                referrerPolicy="no-referrer"
                              />
                              <AvatarFallback className="bg-brand/10 rounded-none">
                                <User className="w-5 h-5 text-brand" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-dark text-sm truncate">
                                {session.user?.name}
                              </p>
                              <p className="text-xs text-dark/60 truncate">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                          
                          {/* User Links */}
                          <div className="grid grid-cols-2 gap-2">
                            <Link
                              href="/profile"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-center gap-2 p-3 font-mono-brutal text-xs font-bold uppercase text-dark/80 hover:text-dark hover:bg-white transition-colors border-brutal-thin"
                            >
                              <User className="w-4 h-4" />
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-center gap-2 p-3 font-mono-brutal text-xs font-bold uppercase text-dark/80 hover:text-dark hover:bg-white transition-colors border-brutal-thin"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Orders
                            </Link>
                          </div>
                          
                          <button
                            onClick={() => {
                              signOut({ callbackUrl: '/' });
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center justify-center font-mono-brutal text-xs font-bold uppercase tracking-[0.05em] border-[2px] border-red-600 text-red-600 hover:bg-red-50 py-3 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full font-mono-brutal text-xs font-bold uppercase tracking-[0.05em] border-brutal bg-dark text-warm-light shadow-brutal-sm h-12"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-full font-mono-brutal text-xs font-bold uppercase tracking-[0.05em] border-brutal bg-white text-dark h-12"
                          >
                            Create Account
                          </Link>
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
      {/* Spacer that grows with the announcement bar so fixed nav never overlaps page content */}
      <div style={{ height: 'var(--announcement-h, 0px)' }} />
    </>
  );
}
