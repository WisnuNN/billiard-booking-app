import { create } from 'zustand';
import { tableAPI } from '../services/api';

const useTableStore = create((set) => ({
  tables: [],
  currentTable: null,
  meta: null,
  availability: null,
  isLoading: false,
  error: null,

  fetchTables: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tableAPI.getAll(params);
      set({ tables: data.data, meta: data.meta, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal memuat meja', isLoading: false });
    }
  },

  fetchTable: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tableAPI.getOne(id);
      set({ currentTable: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal memuat detail meja', isLoading: false });
      return null;
    }
  },

  checkAvailability: async (tableId, date) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tableAPI.checkAvailability(tableId, date);
      set({ availability: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal cek ketersediaan', isLoading: false });
      return null;
    }
  },

  fetchMonitor: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tableAPI.getMonitor();
      set({ tables: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Gagal memuat monitor', isLoading: false });
      return null;
    }
  },

  createTable: async (tableData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tableAPI.create(tableData);
      set((state) => ({
        tables: [...state.tables, data.data],
        isLoading: false,
      }));
      return { success: true, data: data.data, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menambah meja';
      set({ error: message, isLoading: false });
      return { success: false, message, errors: err.response?.data?.errors };
    }
  },

  updateTable: async (id, tableData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tableAPI.update(id, tableData);
      set((state) => ({
        tables: state.tables.map((t) => (t.id === id ? data.data : t)),
        currentTable: state.currentTable?.id === id ? data.data : state.currentTable,
        isLoading: false,
      }));
      return { success: true, data: data.data, message: data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal memperbarui meja';
      set({ error: message, isLoading: false });
      return { success: false, message, errors: err.response?.data?.errors };
    }
  },

  deleteTable: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tableAPI.delete(id);
      set((state) => ({
        tables: state.tables.filter((t) => t.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Gagal menghapus meja';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  clearError: () => set({ error: null }),
  clearCurrent: () => set({ currentTable: null, availability: null }),
}));

export default useTableStore;
