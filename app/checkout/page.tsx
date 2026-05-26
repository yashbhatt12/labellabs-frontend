'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { apiClient } from '@/app/lib/api';
import { calculateTotal, formatCurrency } from '@/app/lib/utils';
import { Loader, Check, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutItem {
  productId: string;
  quantity: number;
}

export default function Checkout() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user data
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');
    setFormData((prev) => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    }));

    // Load cart
    const storedCart = localStorage.getItem('cart_items');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart:', error);
      }
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    setLoading(false);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  const subtotal = cartItems.reduce((sum) => sum + 1000 * 1, 0);
  const { tax, shipping, total } = calculateTotal(subtotal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        setError('Please fill in all required fields');
        setProcessing(false);
        return;
      }

      // Create Razorpay order
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_xxxxx';

      const options = {
        key: razorpayKey,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'LabelLabs',
        description: `Order for ${cartItems.length} items`,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await apiClient.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (verifyResponse.success) {
              // Create order on backend
              const orderResponse = await apiClient.createOrder(
                `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
                response.razorpay_payment_id,
                formData.notes
              );

              if (orderResponse.success) {
                setOrderPlaced(true);
                localStorage.removeItem('cart_items');
                window.dispatchEvent(new Event('storage'));

                // Redirect after 3 seconds
                setTimeout(() => {
                  router.push(`/orders/${orderResponse.data?.id}`);
                }, 3000);
              } else {
                setError('Failed to create order. Please contact support.');
              }
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setError('An error occurred during payment verification.');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Please try again.');
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred. Please try again.');
      setProcessing(false);
    }
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

  if (orderPlaced) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-8 text-center max-w-md">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={32} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been confirmed. You will be redirected to order details shortly.
            </p>
            <Loader className="animate-spin text-brand-navy mx-auto" size={24} />
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Street address"
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                          placeholder="Maharashtra"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="400059"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Special delivery instructions (optional)"
                    rows={3}
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Item {item.productId.slice(0, 8)}... × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(1000 * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
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
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-brand-navy">{formatCurrency(total)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }}
                  disabled={processing || cartItems.length === 0}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size={16} className="animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Pay with Razorpay'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your payment is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
