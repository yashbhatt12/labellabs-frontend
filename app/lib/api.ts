import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/app/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://16.171.4.87:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  // Auth Endpoints
  async login(email: string, password: string) {
    const response = await this.client.post<ApiResponse<{ token: string; user: any }>>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    gstin: string,
    registeredAddress: string,
    city: string,
    state: string,
    pincode: string
  ) {
    const response = await this.client.post<ApiResponse<{ token: string; user: any }>>('/api/auth/register', {
      name,
      email,
      phone,
      password,
      gstin,
      registeredAddress,
      city,
      state,
      pincode,
    });
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get<ApiResponse<any>>('/api/auth/profile');
    return response.data;
  }

  // Product Endpoints
  async getProducts(filters?: Record<string, any>, page = 1, limit = 20) {
    const response = await this.client.get<PaginatedResponse<any>>('/api/products', {
      params: { ...filters, page, limit },
    });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.client.get<ApiResponse<any>>(`/api/products/${id}`);
    return response.data;
  }

  async getCategories() {
    const response = await this.client.get<ApiResponse<any[]>>('/api/products/categories/list');
    return response.data;
  }

  async getManufacturers() {
    const response = await this.client.get<ApiResponse<any[]>>('/api/products/manufacturers/list');
    return response.data;
  }

  // Cart Endpoints
  async getCart() {
    const response = await this.client.get<ApiResponse<any>>('/api/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number) {
    const response = await this.client.post<ApiResponse<any>>('/api/cart/add-item', {
      productId,
      quantity,
    });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number) {
    const response = await this.client.put<ApiResponse<any>>(`/api/cart/item/${productId}`, {
      quantity,
    });
    return response.data;
  }

  async removeFromCart(productId: string) {
    const response = await this.client.delete<ApiResponse<any>>(`/api/cart/item/${productId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.client.post<ApiResponse<any>>('/api/cart/clear');
    return response.data;
  }

  // Order Endpoints
  async createOrder(deliveryAddress: string, paymentId: string, notes?: string) {
    const response = await this.client.post<ApiResponse<any>>('/api/orders', {
      deliveryAddress,
      paymentId,
      notes,
    });
    return response.data;
  }

  async getOrders() {
    const response = await this.client.get<ApiResponse<any[]>>('/api/orders');
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.client.get<ApiResponse<any>>(`/api/orders/${id}`);
    return response.data;
  }

  async verifyPayment(razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string) {
    const response = await this.client.post<ApiResponse<any>>('/api/orders/verify-payment', {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    });
    return response.data;
  }

  // Health Check
  async health() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();
