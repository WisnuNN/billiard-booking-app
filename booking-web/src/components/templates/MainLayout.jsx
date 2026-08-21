import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import AppBreadcrumb from '../molecules/AppBreadcrumb';

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Box sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, md: 4 }, pt: 3 }}>
          <AppBreadcrumb />
        </Box>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
