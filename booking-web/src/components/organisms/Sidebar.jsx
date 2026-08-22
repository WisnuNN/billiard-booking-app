import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import TableBarOutlinedIcon from '@mui/icons-material/TableBarOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '../atoms/Logo';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: DashboardOutlinedIcon },
  { label: 'Live Monitor', path: '/admin/monitor', icon: MonitorHeartOutlinedIcon },
  { label: 'Kelola Meja', path: '/admin/tables', icon: TableBarOutlinedIcon },
  { label: 'Kelola Booking', path: '/admin/bookings', icon: EventNoteOutlinedIcon },
  { label: 'Transaksi', path: '/admin/transactions', icon: ReceiptLongOutlinedIcon },
  { label: 'Laporan', path: '/admin/reports', icon: BarChartOutlinedIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#ffffff',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 350,
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Logo />
      </Box>

      <Divider />

      {/* Menu */}
      <Box sx={{ flex: 1, px: 1.5, py: 2 }}>
        <Typography
          variant="overline"
          sx={{
            px: 1.5,
            mb: 1,
            display: 'block',
            fontSize: '0.675rem',
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: '0.1em',
          }}
        >
          Menu Utama
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.2,
                  px: 2,
                  bgcolor: active ? 'rgba(13,150,104,0.08)' : 'transparent',
                  color: active ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: active ? 'rgba(13,150,104,0.1)' : 'grey.50',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 24,
                      borderRadius: 4,
                      bgcolor: 'primary.main',
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Back to site */}
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={() => navigate('/')}
          sx={{ borderRadius: 2, color: 'text.secondary', px: 2, py: 1.2 }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <ArrowBackIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Kembali ke Situs"
            primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
