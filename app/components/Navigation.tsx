'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authStorage } from '@/app/lib/auth';
import { User } from '@/app/types';
import { ShoppingCart, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedUser = authStorage.getUser();
    setUser(storedUser);

    // Get cart count from localStorage
    const cartData = localStorage.getItem('cart_items');
    if (cartData) {
      try {
        const items = JSON.parse(cartData);
        setCartCount(Array.isArray(items) ? items.length : 0);
      } catch {
        setCartCount(0);
      }
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedUser = authStorage.getUser();
      setUser(updatedUser);
      const cartData = localStorage.getItem('cart_items');
      if (cartData) {
        try {
          const items = JSON.parse(cartData);
          setCartCount(Array.isArray(items) ? items.length : 0);
        } catch {
          setCartCount(0);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    authStorage.logout();
    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold text-brand-navy">LabelLabs</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                isActive('/about') ? 'text-brand-navy font-semibold' : 'text-gray-600 hover:text-brand-navy'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${
                isActive('/contact') ? 'text-brand-navy font-semibold' : 'text-gray-600 hover:text-brand-navy'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-brand-navy transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-brand-red rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Hi, {user.name.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand-navy transition-colors"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-primary text-sm px-4 py-2">
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-navy"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 py-4 space-y-4">
            <Link href="/about" className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-navy">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-navy">
              Contact
            </Link>
            <hr className="border-gray-200" />
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-brand-navy"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2 text-sm btn-primary">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
