import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Drawer, IconButton } from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../organisms/Sidebar';
import AppBreadcrumb from '../molecules/AppBreadcrumb';

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: 260, border: 'none' } }}
        >
          <Sidebar />
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: isMobile ? 0 : '260px',
          minHeight: '100vh',
        }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <Box
            sx={{
              p: 2,
              bgcolor: '#fff',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
          <AppBreadcrumb />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
