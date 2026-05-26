// Currency Formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Date Formatting
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Number Formatting
export const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Email Validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone Validation (Indian)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// GSTIN Validation (Indian GST Identification Number)
export const isValidGSTIN = (gstin: string): boolean => {
  // GSTIN format: 2 digit state code + 10 digit PAN + 1 check digit + 1 entity code
  // Total 15 characters, alphanumeric
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.toUpperCase().trim());
};

// Password Validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Calculate GST
export const calculateGST = (amount: number, gstRate: number = 18): number => {
  return (amount * gstRate) / 100;
};

// Calculate Shipping
export const calculateShipping = (
  subtotal: number,
  shippingCost: number = 300,
  freeThreshold: number = 10000
): number => {
  return subtotal >= freeThreshold ? 0 : shippingCost;
};

// Calculate Order Total
export const calculateTotal = (
  subtotal: number,
  shippingCost: number = 300,
  freeThreshold: number = 10000,
  gstRate: number = 18
): { tax: number; shipping: number; total: number } => {
  const shipping = calculateShipping(subtotal, shippingCost, freeThreshold);
  const subtotalWithShipping = subtotal + shipping;
  const tax = calculateGST(subtotalWithShipping, gstRate);
  const total = subtotalWithShipping + tax;

  return {
    tax: Math.round(tax * 100) / 100,
    shipping,
    total: Math.round(total * 100) / 100,
  };
};

// Slug Generation
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Truncate Text
export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get Initials from Name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Capitalize Text
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Sleep (for delays)
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
