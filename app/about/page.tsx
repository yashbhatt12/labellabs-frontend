'use client';

import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Award, Users, Globe, Zap } from 'lucide-react';

export default function About() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-navy to-brand-purple text-white px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About LabelLabs</h1>
            <p className="text-xl opacity-90">
              Your trusted partner for premium barcode and RFID solutions
            </p>
          </div>
        </section>

        {/* Company Info */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                LabelLabs is the premier B2B e-commerce platform for barcode and RFID solutions, powered by 
                <strong> SNA Infotech Private Limited</strong> — a leading provider of industrial labeling and identification solutions.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Since our inception, we've been committed to delivering premium products and exceptional service to businesses across multiple industries including retail, manufacturing, healthcare, logistics, food & beverage, and asset management.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our platform connects you directly with trusted brands like Avery Dennison, Zebra, TSC, Impinj, and more — all with competitive pricing and fast delivery.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Company Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Legal Name</p>
                  <p className="font-semibold text-gray-900">SNA Infotech Private Limited</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">GSTIN</p>
                  <p className="font-mono text-gray-900">27AAJCS6773P1ZD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Owner</p>
                  <p className="font-semibold text-gray-900">Yash Bhatt</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href="mailto:support@sna-infotech.co.in" className="text-brand-navy hover:underline">
                    support@sna-infotech.co.in
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a href="tel:02242182620" className="text-brand-navy hover:underline">
                    022-42182620
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900 text-sm">
                    17, Navyug Industrial Estate, Vazir Glass Factory Lane, JB Nagar, Andheri East, Mumbai 400059
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-3xl font-bold text-brand-navy mb-2">500+</p>
              <p className="text-gray-600">Businesses Served</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-3xl font-bold text-brand-teal mb-2">2M+</p>
              <p className="text-gray-600">Products Shipped</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-3xl font-bold text-brand-coral mb-2">8</p>
              <p className="text-gray-600">Product Categories</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-3xl font-bold text-brand-amber mb-2">99%</p>
              <p className="text-gray-600">Uptime SLA</p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <Award className="w-12 h-12 text-brand-navy mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Quality</h3>
                <p className="text-gray-600 text-sm">
                  Premium products from trusted manufacturers only
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <Users className="w-12 h-12 text-brand-teal mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Service</h3>
                <p className="text-gray-600 text-sm">
                  Dedicated support and expert guidance
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <Globe className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Reliability</h3>
                <p className="text-gray-600 text-sm">
                  Fast delivery and consistent performance
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <Zap className="w-12 h-12 text-brand-amber mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Latest products and technologies
                </p>
              </div>
            </div>
          </div>

          {/* Supported Brands */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Trusted Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
              {['Avery Dennison', 'Zebra', 'TSC', 'Impinj', 'Citizen', 'Epson'].map((brand) => (
                <div
                  key={brand}
                  className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center"
                >
                  <p className="font-semibold text-gray-900">{brand}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-r from-brand-navy to-brand-purple rounded-lg p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg opacity-90 mb-8">
              Questions? Our support team is here to help
            </p>
            <div className="space-y-2 mb-8">
              <p className="text-lg">
                📧 <a href="mailto:support@sna-infotech.co.in" className="hover:underline">
                  support@sna-infotech.co.in
                </a>
              </p>
              <p className="text-lg">
                📞 <a href="tel:02242182620" className="hover:underline">
                  022-42182620
                </a>
              </p>
              <p className="text-base opacity-90">
                Monday – Saturday, 10 AM – 6 PM IST
              </p>
            </div>
            <a href="/contact" className="inline-block bg-white text-brand-navy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Send us a Message
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
