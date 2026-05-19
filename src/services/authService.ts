import { apiClient } from './api';
import type { User, LoginPayload, SignupPayload } from '../types/index';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export const authService = {
  // Login user
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response;
  },

  // Signup user - mock implementation
  signup: async (payload: SignupPayload) => {
    // DummyJSON doesn't have a real signup endpoint, so we mock it
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      username: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: 'user',
    };
    return mockUser;
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    try {
      const response = await apiClient.get<User>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout - client side only
  logout: () => {
    localStorage.removeItem('ecommerce_token');
    localStorage.removeItem('ecommerce_user');
  },

  // Verify email - mock
  verifyEmail: async (email: string, code: string) => {
    void email;
    void code;
    return Promise.resolve({ success: true });
  },

  // Reset password - mock
  resetPassword: async (email: string) => {
    void email;
    return Promise.resolve({ success: true, message: 'Check your email for reset link' });
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string) => {
    void oldPassword;
    void newPassword;
    return Promise.resolve({ success: true });
  },
};
