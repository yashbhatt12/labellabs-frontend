'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Product } from '@/app/types';
import { apiClient } from '@/app/lib/api';
import { calculateTotal, formatCurrency } from '@/app/lib/utils';
import { Trash2, ShoppingCart, Loader } from 'lucide-react';
import Link from 'next/link';

interface CartItemData {
  productId: string;
  quantity: number;
  product?: Product;
}

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);

    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart_items');
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart);
        setCartItems(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error('Failed to parse cart:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
    );

    // Update localStorage
    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart_items', JSON.stringify(updated));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));

    // Update localStorage
    const updated = cartItems.filter((item) => item.productId !== productId);
    localStorage.setItem('cart_items', JSON.stringify(updated));
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.removeItem('cart_items');
    }
  };

  // Calculate totals (mock prices for demonstration)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 1000;
    return sum + price * item.quantity;
  }, 0);

  const { tax, shipping, total } = calculateTotal(subtotal);

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

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              {cartItems.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.productId}
                      className={`p-6 flex gap-6 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <ShoppingCart size={32} className="text-gray-400" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.product?.name || `Product ${item.productId}`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          SKU: {item.product?.sku || 'N/A'}
                        </p>

                        {/* Quantity & Price */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-0 bg-transparent text-sm"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-brand-navy">
                              {formatCurrency((item.product?.price || 1000) * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatCurrency(item.product?.price || 1000)} each
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}

                  {/* Cart Actions */}
                  <div className="p-6 bg-gray-50 border-t flex gap-4">
                    <Link href="/products" className="btn-secondary">
                      Continue Shopping
                    </Link>
                    <button onClick={handleClearCart} className="btn-secondary">
                      Clear Cart
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <Link href="/products" className="btn-primary inline-block">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-brand-navy">{formatCurrency(total)}</span>
                </div>

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push('/login');
                      return;
                    }
                    router.push('/checkout');
                  }}
                  disabled={cartItems.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                {subtotal < 3000 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>Minimum order:</strong> ₹3,000 (₹{3000 - subtotal} more needed)
                    </p>
                  </div>
                )}

                {subtotal >= 10000 && shipping === 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 mt-3">
                    <p className="text-xs text-green-800">
                      ✓ Free shipping on this order!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
