'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Carousel from '@/app/components/Carousel';
import ProductCard from '@/app/components/ProductCard';
import { Product } from '@/app/types';
import { apiClient } from '@/app/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tag, Printer, Scan, Loader } from 'lucide-react';

const categories = [
  {
    id: 'barcode-labels',
    name: 'Barcode Labels',
    icon: Tag,
    description: 'Thermal & direct barcode labels',
    color: 'from-teal-400 to-teal-600',
  },
  {
    id: 'barcode-printers',
    name: 'Barcode Printers',
    icon: Printer,
    description: 'Desktop & industrial printers',
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'barcode-scanners',
    name: 'Barcode Scanners',
    icon: Scan,
    description: 'Handheld & fixed scanners',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'thermal-ribbons',
    name: 'Thermal Ribbons',
    icon: Tag,
    description: 'Transfer ribbons for printers',
    color: 'from-amber-400 to-amber-600',
  },
];

const carouselSlides = [
  {
    id: '1',
    title: 'SPECIAL OFFER',
    description: 'Save 30% on Barcode Labels',
    backgroundColor: 'bg-gradient-to-br from-red-500 to-red-700',
    buttonText: 'Shop Now',
    buttonLink: '/products?category=barcode-labels',
  },
  {
    id: '2',
    title: 'NEW ARRIVAL',
    description: 'Thermal Transfer Ribbons in Stock',
    backgroundColor: 'bg-gradient-to-br from-teal-500 to-teal-700',
    buttonText: 'Explore',
    buttonLink: '/products?category=thermal-ribbons',
  },
  {
    id: '3',
    title: 'BULK DISCOUNT',
    description: 'Buy 5+ Get 15% OFF on Printers',
    backgroundColor: 'bg-gradient-to-br from-purple-500 to-purple-700',
    buttonText: 'Learn More',
    buttonLink: '/products?category=barcode-printers',
  },
  {
    id: '4',
    title: 'FREE SHIPPING',
    description: 'On orders above ₹10,000',
    backgroundColor: 'bg-gradient-to-br from-amber-500 to-amber-700',
    buttonText: 'Order Now',
    buttonLink: '/products',
  },
];

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.getProducts({}, 1, 6);
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Carousel */}
        <Carousel slides={carouselSlides} />

        {/* Categories Section */}
        <section className="bg-white px-4 sm:px-6 lg:px-8 py-12 border-b">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.id} href={`/products?category=${category.id}`}>
                    <div className={`bg-gradient-to-br ${category.color} rounded-lg p-8 text-white cursor-pointer hover:shadow-lg transition-shadow text-center h-full`}>
                      <Icon size={48} className="mx-auto mb-4 opacity-90" />
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm opacity-90 mb-4">{category.description}</p>
                      <button className="text-sm font-semibold hover:underline">Browse →</button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Featured Products</h2>
            <p className="text-center text-gray-600 mb-12">Discover our most popular barcode and RFID solutions</p>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin text-brand-navy" size={32} />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No products available at the moment.</p>
              </div>
            )}

            <div className="flex justify-center">
              <Link href="/products" className="btn-primary px-8 py-3">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-brand-navy">500+</p>
                <p className="text-gray-600 text-sm mt-2">Businesses Trust Us</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-teal-600">2M+</p>
                <p className="text-gray-600 text-sm mt-2">Products Shipped</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-red-600">50+</p>
                <p className="text-gray-600 text-sm mt-2">Product Types</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-amber-600">99%</p>
                <p className="text-gray-600 text-sm mt-2">Uptime SLA</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">Browse our complete range of barcode and RFID solutions</p>
            <Link href="/products" className="btn-primary px-8 py-3 inline-block">
              Shop Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
