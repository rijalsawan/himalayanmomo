'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
        className="fixed left-0 right-0 z-50 animate-slide-down px-3 sm:px-5 lg:px-8 pt-3"
      >
      <div
        className={`mx-auto max-w-6xl rounded-full border transition-all duration-300 ${
          scrolled
            ? 'bg-[#FDF8F3]/95 backdrop-blur-md shadow-lg shadow-primary/10 border-[#1A1A1A]/10'
            : 'bg-[#FDF8F3]/85 backdrop-blur-sm shadow-sm border-[#1A1A1A]/5'
        }`}
      >
        <div className="flex items-center justify-between h-14 md:h-16 px-4 sm:px-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 min-w-0">
            <span className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-white ring-1 ring-[#1A1A1A]/10 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image src={brandLogo} alt="MO:MO Station logo" fill sizes="40px" className="object-contain" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-dancing text-lg md:text-xl leading-none text-primary transition-colors">
                Himalayan Express
              </span>
              <span className="font-playfair text-sm md:text-base font-bold text-foreground leading-tight">
                MO:MO Station
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
                  className={`relative text-sm font-medium transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all after:duration-300 ${
                    isActiveLink(link.href)
                      ? 'text-primary after:w-full'
                      : 'text-foreground/75 after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="relative text-sm font-medium text-foreground/75 transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </button>
              )
            ))}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 text-foreground hover:bg-primary/10"
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
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={session.user?.image || undefined} 
                        alt={session.user?.name || 'User'}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-primary/10">
                        <User className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
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
                  <Button className="bg-primary hover:bg-[#7A0407] text-white rounded-full px-6 shadow-md shadow-primary/20">
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
              className="relative p-2 rounded-full transition-all duration-200 active:scale-95 flex-shrink-0 text-foreground hover:bg-primary/10"
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
                  className="flex-shrink-0 w-10 h-10 text-foreground"
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white p-0 overflow-y-auto">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 bg-[#FDF8F3]">
                    <div className="flex items-center gap-3">
                      <span className="relative w-11 h-11 rounded-full overflow-hidden bg-white ring-1 ring-[#1A1A1A]/10 flex-shrink-0">
                        <Image src={brandLogo} alt="MO:MO Station logo" fill sizes="44px" className="object-contain" />
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-dancing text-lg leading-none text-primary">
                          Himalayan Express
                        </span>
                        <span className="font-playfair text-base font-bold text-foreground leading-tight">
                          MO:MO Station
                        </span>
                      </div>
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
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage 
                              src={session.user?.image || undefined} 
                              alt={session.user?.name || 'User'}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="bg-primary/10">
                              <User className="w-5 h-5 text-primary" />
                            </AvatarFallback>
                          </Avatar>
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
                          className="w-full bg-primary hover:bg-[#7A0407] text-white h-12"
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
      {/* Spacer that grows with the announcement bar so fixed nav never overlaps page content */}
      <div style={{ height: 'var(--announcement-h, 0px)' }} />
    </>
  );
}
