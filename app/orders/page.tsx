'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Order, OrderStatus } from '@/app/types';
import { apiClient } from '@/app/lib/api';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { Loader, PackageOpen, Download } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PROCESSING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
};

const statusMessages: Record<OrderStatus, string> = {
  [OrderStatus.CONFIRMED]: 'Order Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
};

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await apiClient.getOrders();
        if (response.success && response.data) {
          setOrders(response.data);
        } else {
          setError(response.message || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Invoice Number</p>
                            <p className="text-xl font-bold text-gray-900">{order.invoiceNumber}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              statusColors[order.status as OrderStatus]
                            }`}
                          >
                            {statusMessages[order.status as OrderStatus]}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{item.product?.name || 'Product'}</p>
                            <p className="text-gray-600 text-xs">
                              SKU: {item.product?.sku || 'N/A'} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Totals & Actions */}
                  <div className="p-6 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-600 w-48">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 w-48">
                        <span>Shipping:</span>
                        <span>{formatCurrency(order.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 w-48">
                        <span>Tax (18%):</span>
                        <span>{formatCurrency(order.tax)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 w-48 pt-2 border-t border-gray-300">
                        <span>Total:</span>
                        <span>{formatCurrency(order.total)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="btn-primary text-sm px-6 py-2"
                      >
                        View Details
                      </Link>
                      <button className="btn-secondary text-sm px-6 py-2 flex items-center gap-2">
                        <Download size={16} />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <PackageOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Link href="/products" className="btn-primary inline-block">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
