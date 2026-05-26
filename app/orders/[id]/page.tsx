'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Order, OrderStatus } from '@/app/types';
import { apiClient } from '@/app/lib/api';
import { formatCurrency, formatDate, formatDateTime } from '@/app/lib/utils';
import { Loader, Download, Truck, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<OrderStatus, string> = {
  [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PROCESSING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
};

const statusSteps = [
  { status: OrderStatus.CONFIRMED, label: 'Confirmed', icon: CheckCircle2 },
  { status: OrderStatus.PROCESSING, label: 'Processing', icon: Clock },
  { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
  { status: OrderStatus.DELIVERED, label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
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
        const response = await apiClient.getOrderById(id);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || 'Order not found');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [id, router]);

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

  if (!order || error) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{error || 'Order not found'}</p>
              <Link href="/orders" className="btn-primary">
                Back to Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentStatusIndex = statusSteps.findIndex((step) => step.status === order.status);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/orders" className="text-brand-navy hover:underline mb-2 inline-block">
                ← Back to Orders
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Order {order.invoiceNumber}</h1>
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Download size={20} />
              <span>Download Invoice</span>
            </button>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute w-20 h-1 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ marginTop: '-32px', marginLeft: '48px' }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Order Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                    statusColors[order.status as OrderStatus]
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-mono text-sm text-gray-900 break-all">{order.paymentId}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${index === order.items.length - 1 ? '' : 'border-b'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product?.name || 'Product'}</p>
                      <p className="text-sm text-gray-600">SKU: {item.product?.sku || 'N/A'}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {formatCurrency((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Quantity: {item.quantity}</span>
                    <span>Unit Price: {formatCurrency(item.product?.price || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                  {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18%)</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-brand-navy">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <p className="text-sm font-semibold text-blue-900 mb-2">Order Notes</p>
              <p className="text-blue-800">{order.notes}</p>
            </div>
          )}

          {/* Support */}
          <div className="mt-8 text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-3">Need help with your order?</p>
            <p className="text-sm text-gray-600">
              Contact our support team at{' '}
              <a href="mailto:support@sna-infotech.co.in" className="text-brand-navy hover:underline">
                support@sna-infotech.co.in
              </a>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Monday – Saturday, 10 AM – 6 PM IST | 022-42182620
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
