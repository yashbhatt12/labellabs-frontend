'use client';

import { useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, Loader } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you would send this to a backend API
      // For now, we'll simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitted(true);

      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-navy to-brand-purple text-white px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl opacity-90">
              Get in touch with our team. We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Phone */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-navy bg-opacity-10 p-3 rounded-lg">
                    <Phone size={24} className="text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:02242182620" className="text-brand-navy hover:underline">
                      022-42182620
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-teal bg-opacity-10 p-3 rounded-lg">
                    <Mail size={24} className="text-brand-teal" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:support@sna-infotech.co.in" className="text-brand-navy hover:underline break-all">
                      support@sna-infotech.co.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-coral bg-opacity-10 p-3 rounded-lg">
                    <MapPin size={24} className="text-brand-coral" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600 text-sm">
                      17, Navyug Industrial Estate, Vazir Glass Factory Lane, JB Nagar, Andheri East, Mumbai 400059
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-amber bg-opacity-10 p-3 rounded-lg">
                    <Clock size={24} className="text-brand-amber" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Support Hours</h3>
                    <p className="text-gray-600 text-sm">
                      Monday – Saturday
                      <br />
                      10 AM – 6 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="you@example.com"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="9876543210"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field"
                      disabled={loading}
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="order-issue">Order Issue</option>
                      <option value="bulk-order">Bulk Order</option>
                      <option value="technical-support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Tell us how we can help..."
                      rows={6}
                      disabled={loading}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">What are your business hours?</h3>
                <p className="text-gray-600 text-sm">
                  We're available Monday – Saturday, 10 AM – 6 PM IST. You can reach us via email anytime.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">What's the minimum order value?</h3>
                <p className="text-gray-600 text-sm">
                  The minimum order value is ₹3,000. Free shipping is available on orders above ₹10,000.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">How long is the delivery time?</h3>
                <p className="text-gray-600 text-sm">
                  Most orders are delivered within 3-5 business days. Express delivery may be available for bulk orders.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Do you offer bulk discounts?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! For large orders, please contact our sales team for custom pricing.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Can I cancel or modify my order?</h3>
                <p className="text-gray-600 text-sm">
                  Orders can be modified within 24 hours of placement. Cancellations are not available after payment.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept all major payment methods via Razorpay including credit cards, debit cards, and net banking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
