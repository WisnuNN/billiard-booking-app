import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),
  profile: () => api.get('/profile'),
};

export const tableAPI = {
  getAll: (params) => api.get('/tables', { params }),
  getOne: (id) => api.get(`/tables/${id}`),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  delete: (id) => api.delete(`/tables/${id}`),
  getSchedules: (tableId) => api.get(`/tables/${tableId}/schedules`),
  checkAvailability: (tableId, date) =>
    api.get(`/tables/${tableId}/availability`, { params: { date } }),
  getMonitor: () => api.get('/tables/monitor'),
};

export const scheduleAPI = {
  create: (tableId, data) => api.post(`/tables/${tableId}/schedules`, data),
  update: (tableId, scheduleId, data) =>
    api.put(`/tables/${tableId}/schedules/${scheduleId}`, data),
  delete: (tableId, scheduleId) =>
    api.delete(`/tables/${tableId}/schedules/${scheduleId}`),
};

export const bookingAPI = {
  getAll: (params) => api.get('/bookings', { params }),
  getBookings: (params) => api.get('/bookings', { params }),
  createBooking: (data) => api.post('/bookings', data),
  walkIn: (data) => api.post('/bookings/walk-in', data),
  getBookingDetail: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.patch(`/bookings/${id}/cancel`),
  getBookingTicket: (id) => api.get(`/bookings/${id}/ticket`),
  payBooking: (id) => api.post(`/bookings/${id}/pay`),
  confirm: (id) => api.patch(`/bookings/${id}/confirm`),
  complete: (id) => api.patch(`/bookings/${id}/complete`),
  getTicket: (id) => api.get(`/bookings/${id}/ticket`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getOne: (id) => api.get(`/transactions/${id}`),
  update: (id, data) => api.patch(`/transactions/${id}`, data),
};

export const reportAPI = {
  overview: (params) => api.get('/reports/overview', { params }),
  bestsellers: (params) => api.get('/reports/bestsellers', { params }),
  busiestSchedules: (params) => api.get('/reports/busiest-schedules', { params }),
};

export default api;
