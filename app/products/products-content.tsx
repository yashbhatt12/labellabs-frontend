'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { Product, Category, Manufacturer } from '@/app/types';
import { apiClient } from '@/app/lib/api';
import { Filter, Loader, X } from 'lucide-react';

export default function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, manufacturersRes] = await Promise.all([
          apiClient.getProducts({
            category: selectedCategory,
            manufacturer: selectedManufacturer,
            search: search,
          }),
          apiClient.getCategories(),
          apiClient.getManufacturers(),
        ]);

        if (productsRes.success && productsRes.data) {
          setProducts(productsRes.data);
        }
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (manufacturersRes.success && manufacturersRes.data) {
          setManufacturers(manufacturersRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedManufacturer, search]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedManufacturer('');
    setSearch('');
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 btn-secondary"
            >
              <Filter size={20} />
              Filters
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`${
                showFilters ? 'block' : 'hidden'
              } md:block md:w-64 flex-shrink-0 bg-white p-6 rounded-lg h-fit`}
            >
              <div className="flex justify-between items-center md:hidden mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={selectedCategory === cat.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Manufacturer Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Manufacturer</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="manufacturer"
                      value=""
                      checked={selectedManufacturer === ''}
                      onChange={(e) => setSelectedManufacturer(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">All Manufacturers</span>
                  </label>
                  {manufacturers.map((mfr) => (
                    <label key={mfr.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="manufacturer"
                        value={mfr.id}
                        checked={selectedManufacturer === mfr.id}
                        onChange={(e) => setSelectedManufacturer(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">{mfr.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedManufacturer || search) && (
                <button onClick={clearFilters} className="btn-secondary w-full">
                  Clear Filters
                </button>
              )}
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader className="animate-spin text-brand-navy" size={32} />
                </div>
              ) : products.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600">No products found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
