import { create } from 'zustand';
import { bookingAPI } from '../services/api';

const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,
  meta: null,
  isLoading: false,
  error: null,

  fetchBookings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.getAll(params);
      set({ bookings: data.data, meta: data.meta, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal memuat bookings', isLoading: false });
    }
  },

  fetchBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.getBookingDetail(id);
      set({ currentBooking: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal memuat booking', isLoading: false });
      return null;
    }
  },

  fetchTicket: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.getTicket(id);
      set({ isLoading: false });
      return { success: true, data: data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memuat e-ticket';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  createBooking: async (bookingData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.createBooking(bookingData);
      set((state) => ({
        bookings: [data.data, ...state.bookings],
        isLoading: false,
      }));
      return { success: true, data: data.data, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal membuat booking';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  createWalkInBooking: async (walkInData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.walkIn(walkInData);
      set({ isLoading: false });
      return { success: true, data: data.data, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal membuat booking walk-in';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.cancelBooking(id);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? data.data : b)),
        currentBooking: state.currentBooking?.id === id ? data.data : state.currentBooking,
        isLoading: false,
      }));
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal membatalkan booking';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

    processPayment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.payBooking(id);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? data.data : b)),
        currentBooking: state.currentBooking?.id === id ? data.data : state.currentBooking,
        isLoading: false,
      }));
      return { success: true, message: data.message, data: data.data, payment_url: data.payment_url };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memproses pembayaran';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  confirmBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.confirm(id);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? data.data : b)),
        currentBooking: state.currentBooking?.id === id ? data.data : state.currentBooking,
        isLoading: false,
      }));
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal mengkonfirmasi booking';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  completeBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.complete(id);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? data.data : b)),
        currentBooking: state.currentBooking?.id === id ? data.data : state.currentBooking,
        isLoading: false,
      }));
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menyelesaikan booking';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await bookingAPI.delete(id);
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
        currentBooking: state.currentBooking?.id === id ? null : state.currentBooking,
        isLoading: false,
      }));
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus booking';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null }),
  clearCurrent: () => set({ currentBooking: null }),
}));

export default useBookingStore;
