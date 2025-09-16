import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const apiPayload = response.data; // { success, message, data: { user, token } }
    const normalized: AuthResponse = {
      user: apiPayload?.data?.user,
      token: apiPayload?.data?.token,
    };
    return normalized;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    const apiPayload = response.data; // { success, message, data: { user, token } }
    const normalized: AuthResponse = {
      user: apiPayload?.data?.user,
      token: apiPayload?.data?.token,
    };
    return normalized;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<unknown> {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};