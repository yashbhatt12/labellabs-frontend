'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-brand-navy mb-4">LabelLabs</div>
            <p className="text-sm text-gray-600 mb-4">
              Premium barcode and RFID solutions for businesses across industries.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-brand-navy" />
                <a href="tel:02242182620" className="hover:text-brand-navy transition-colors">
                  022-42182620
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-brand-navy" />
                <a href="mailto:support@sna-infotech.co.in" className="hover:text-brand-navy transition-colors">
                  support@sna-infotech.co.in
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-brand-navy flex-shrink-0 mt-0.5" />
                <span>17, Navyug Industrial Estate, Vazir Glass Factory Lane, JB Nagar, Andheri East, Mumbai 400059</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=barcode-labels" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Barcode Labels
                </Link>
              </li>
              <li>
                <Link href="/products?category=barcode-printers" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Barcode Printers
                </Link>
              </li>
              <li>
                <Link href="/products?category=barcode-scanners" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Barcode Scanners
                </Link>
              </li>
              <li>
                <Link href="/products?category=thermal-ribbons" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Thermal Ribbons
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-brand-navy transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-red to-brand-navy rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SNA</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">SNA Infotech Private Limited</p>
              <p className="text-xs text-gray-500">GSTIN: 27AAJCS6773P1ZD</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center md:text-right">
            © {currentYear} SNA Infotech Private Limited. All rights reserved. | Powered by LabelLabs
          </p>
        </div>

        {/* Support Hours */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-xs text-gray-600">
          <p>
            <strong>Support Hours:</strong> Monday – Saturday, 10 AM – 6 PM IST
          </p>
        </div>
      </div>
    </footer>
  );
}
