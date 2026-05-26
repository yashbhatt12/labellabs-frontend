'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Product } from '@/app/types';
import { apiClient } from '@/app/lib/api';
import { formatCurrency } from '@/app/lib/utils';
import { ShoppingCart, Download, Loader, ChevronLeft, Star, Truck, Shield } from 'lucide-react';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.getProductById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingToCart(true);
      const response = await apiClient.addToCart(product.id, quantity);
      if (response.success) {
        alert('Added to cart successfully!');
        // Update cart in localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]');
        cartItems.push({ productId: product.id, quantity });
        localStorage.setItem('cart_items', JSON.stringify(cartItems));
        // Dispatch storage event to update Navigation
        window.dispatchEvent(new Event('storage'));
        router.push('/cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const manufacturerColors: Record<string, string> = {
    avery: 'bg-teal-100 text-teal-800',
    'avery dennison': 'bg-teal-100 text-teal-800',
    zebra: 'bg-purple-100 text-purple-800',
    tsc: 'bg-red-100 text-red-800',
    impinj: 'bg-amber-100 text-amber-800',
    citizen: 'bg-blue-100 text-blue-800',
    epson: 'bg-green-100 text-green-800',
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="animate-spin text-brand-navy" size={32} />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Product not found</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const badgeClass = manufacturerColors[product.manufacturer.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 hover:text-brand-navy transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <span>/</span>
            <a href="/products" className="hover:text-brand-navy transition-colors">
              Products
            </a>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
                    <div className="aspect-square flex items-center justify-center">
                      <img
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Manufacturer Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${badgeClass}`}>
                        {product.manufacturer}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`rounded border-2 overflow-hidden ${
                            currentImageIndex === index ? 'border-brand-navy' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full aspect-square object-cover hover:opacity-80 transition-opacity"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  No images available
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">SKU: {product.sku}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                  ))}
                  <Star size={20} className="text-gray-300" />
                </div>
                <span className="text-sm text-gray-600">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-brand-navy mb-2">{formatCurrency(product.price)}</p>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg text-green-700 font-semibold">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    In Stock
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg text-red-700 font-semibold">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 bg-transparent"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addingToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b">
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-brand-teal" size={24} />
                  <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders above ₹10,000</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-brand-coral" size={24} />
                  <p className="text-sm font-semibold text-gray-900">Secure</p>
                  <p className="text-xs text-gray-600">Safe & encrypted checkout</p>
                </div>
                <div className="text-center">
                  <Star className="mx-auto mb-2 text-brand-amber" size={24} />
                  <p className="text-sm font-semibold text-gray-900">Quality</p>
                  <p className="text-xs text-gray-600">Premium products only</p>
                </div>
              </div>

              {/* Datasheet Download */}
              {product.datasheet && (
                <button className="flex items-center gap-2 px-4 py-2 border border-brand-navy rounded-lg text-brand-navy hover:bg-blue-50 transition-colors mb-8">
                  <Download size={20} />
                  <span>Download Datasheet (PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>

            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="pb-4 border-b border-gray-200 last:border-0">
                    <p className="text-sm font-semibold text-gray-600 uppercase">{key}</p>
                    <p className="text-gray-900 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No specifications available</p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
