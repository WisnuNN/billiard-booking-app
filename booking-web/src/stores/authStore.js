import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
  token: localStorage.getItem('auth_token') || null,
  isLoading: false,
  error: null,

  get isAuthenticated() {
    return !!get().token;
  },

  get isAdmin() {
    return get().user?.role === 'admin';
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.login(credentials);
      const user = data.data.user;
      const token = data.data.token;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login gagal';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authAPI.register(userData);
      const user = data.data.user;
      const token = data.data.token;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registrasi gagal';
      const errors = err.response?.data?.errors || {};
      set({ error: message, isLoading: false });
      return { success: false, message, errors };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch {
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    try {
      const { data } = await authAPI.profile();
      const user = data.data;
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user });
    } catch {
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
