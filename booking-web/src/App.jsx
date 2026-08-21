import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout';
import AuthLayout from './components/templates/AuthLayout';
import AdminLayout from './components/templates/AdminLayout';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/organisms/RouteGuards';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TablesPage from './pages/TablesPage';
import TableDetailPage from './pages/TableDetailPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMonitorPage from './pages/admin/AdminMonitorPage';
import AdminTablesPage from './pages/admin/AdminTablesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/tables/:id" element={<TableDetailPage />} />
        
        <Route element={<ProtectedRoute><RouteWrapper /></ProtectedRoute>}>
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="monitor" element={<AdminMonitorPage />} />
        <Route path="tables" element={<AdminTablesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="transactions" element={<AdminTransactionsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  );
}

const RouteWrapper = ({ children }) => <>{children || <Outlet />}</>;
