'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { apiClient } from '@/app/lib/api';
import { authStorage } from '@/app/lib/auth';
import { isValidEmail, isValidPhone, isValidPassword, isValidGSTIN } from '@/app/lib/utils';
import { Loader, AlertCircle, Eye, EyeOff, Check, Info } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gstin: '',
    registeredAddress: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // GSTIN Validation
    if (!formData.gstin.trim()) {
      newErrors.gstin = 'GSTIN is required';
    } else if (!isValidGSTIN(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format (15 characters: e.g., 27AAJCS6773P1ZD)';
    }

    // Registered Address
    if (!formData.registeredAddress.trim()) {
      newErrors.registeredAddress = 'Registered address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
        formData.gstin.toUpperCase().trim(),
        formData.registeredAddress,
        formData.city,
        formData.state,
        formData.pincode
      );

      if (response.success && response.data && response.data.token && response.data.user) {
      authStorage.setToken(response.data.token);
authStorage.setUser(response.data.user);
        router.push('/');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join LabelLabs today and start ordering</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-4">
            {/* Info Banner */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3 mb-6">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Business Account Registration</p>
                <p>Please provide your GST details and registered business address for verification.</p>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="border-b pb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Personal Information</h3>

              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="business@company.com"
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* GST & Business Information Section */}
            <div className="border-b pb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Business Information</h3>

              {/* GSTIN Field */}
              <div className="mb-4">
                <label htmlFor="gstin" className="block text-sm font-semibold text-gray-900 mb-2">
                  GST Identification Number (GSTIN) *
                </label>
                <input
                  id="gstin"
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      gstin: e.target.value.toUpperCase(),
                    }));
                    if (errors.gstin) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.gstin;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="27AAJCS6773P1ZD"
                  className={`input-field ${errors.gstin ? 'border-red-500' : ''}`}
                  disabled={loading}
                  maxLength={15}
                />
                {errors.gstin && <p className="text-red-600 text-xs mt-1">{errors.gstin}</p>}
                <p className="text-xs text-gray-500 mt-1">15-character GSTIN (e.g., 27AAJCS6773P1ZD)</p>
              </div>

              {/* Registered Address Field */}
              <div className="mb-4">
                <label htmlFor="registeredAddress" className="block text-sm font-semibold text-gray-900 mb-2">
                  Registered Business Address *
                </label>
                <textarea
                  id="registeredAddress"
                  name="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={handleChange}
                  placeholder="Street address, Building name, etc."
                  className={`input-field ${errors.registeredAddress ? 'border-red-500' : ''}`}
                  rows={3}
                  disabled={loading}
                ></textarea>
                {errors.registeredAddress && (
                  <p className="text-red-600 text-xs mt-1">{errors.registeredAddress}</p>
                )}
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-2">
                    State *
                  </label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="pincode" className="block text-sm font-semibold text-gray-900 mb-2">
                    Pincode *
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400059"
                    className={`input-field ${errors.pincode ? 'border-red-500' : ''}`}
                    disabled={loading}
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-red-600 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="border-b pb-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Security</h3>

              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`input-field pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                )}
                {formData.password && formData.confirmPassword && !errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-green-600 text-xs mt-1">
                    <Check size={16} />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded mt-1" disabled={loading} required />
              <span className="text-xs text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-brand-navy hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-navy hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Terms Agreement GST */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded mt-1" disabled={loading} required />
              <span className="text-xs text-gray-600">
                I confirm that the GSTIN and registered address provided are accurate and match my business records.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/login" className="btn-secondary w-full text-center">
              Sign In
            </Link>
          </form>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-8">
            * All fields marked with asterisk are required
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
