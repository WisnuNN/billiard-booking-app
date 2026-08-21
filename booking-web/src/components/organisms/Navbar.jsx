import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItemButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../atoms/Logo';
import useAuthStore from '../../stores/authStore';

import IconMeja from '../../assets/icons/icon_meja_billiard.png';
import IconRiwayat from '../../assets/icons/icon_riwayat.png';
import IconKeluar from '../../assets/icons/icon_keluar.png';
import IconJadwal from '../../assets/icons/icon_jadwal_booking.png';
import IconProfile from '../../assets/icons/icon_profile.png';
import IconAdminDashboard from '../../assets/icons/icon_admin_dashboard.png';

const navLinks = [
  { label: 'Beranda', path: '/', icon: IconJadwal },
  { label: 'Meja', path: '/tables', icon: IconMeja },
  { label: 'Booking Saya', path: '/bookings', auth: true, icon: IconRiwayat },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login');
  };

  const filteredLinks = navLinks.filter((link) => !link.auth || token);

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 1)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.04)' : 'none',
          color: 'text.primary',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Toolbar sx={{ 
          maxWidth: 1280, 
          width: '100%', 
          mx: 'auto', 
          px: { xs: 2, md: 4 },
          py: scrolled ? 0.5 : 1.5,
          transition: 'all 0.3s ease-in-out',
        }}>
          <Box component={Link} to="/" sx={{ display: 'flex', textDecoration: 'none' }}>
            <Logo />
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                {filteredLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Button
                      key={link.path}
                      component={Link}
                      to={link.path}
                      disableRipple
                      startIcon={<Box component="img" src={link.icon} alt={link.label} sx={{ width: 18, height: 18, filter: isActive ? 'none' : 'grayscale(100%) opacity(60%)' }} />}
                      sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        px: 2,
                        py: 1,
                        position: 'relative',
                        bgcolor: 'transparent',
                        transition: 'color 0.2s',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 6,
                          left: '50%',
                          transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                          width: '20px',
                          height: '3px',
                          bgcolor: 'primary.main',
                          borderRadius: '4px',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: 'transparent',
                        },
                      }}
                    >
                      {link.label}
                    </Button>
                  );
                })}
              </Box>

              {token ? (
                <>
                  <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    disableRipple
                    sx={{ p: 0, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}
                  >
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: 'primary.main',
                        fontSize: '1rem',
                        fontWeight: 700,
                        border: '2px solid #fff',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 240,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'grey.100',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 18,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                          borderLeft: '1px solid',
                          borderTop: '1px solid',
                          borderColor: 'grey.100',
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2.5, py: 2 }}>
                      <Box sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary', mb: 0.5 }}>{user?.name}</Box>
                      <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', fontWeight: 500 }}>{user?.email}</Box>
                    </Box>
                    <Divider sx={{ mx: 2, mb: 1, borderColor: 'grey.100' }} />
                    <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ mx: 1.5, borderRadius: '10px', py: 1.2 }}>
                      <ListItemIcon><Box component="img" src={IconProfile} alt="Profil" sx={{ width: 18, height: 18 }} /></ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Profil Saya</ListItemText>
                    </MenuItem>
                    {user?.role === 'admin' && (
                      <MenuItem onClick={() => { setAnchorEl(null); navigate('/admin'); }} sx={{ mx: 1.5, borderRadius: '10px', py: 1.2 }}>
                        <ListItemIcon><Box component="img" src={IconAdminDashboard} alt="Dashboard Admin" sx={{ width: 18, height: 18 }} /></ListItemIcon>
                        <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Dashboard Admin</ListItemText>
                      </MenuItem>
                    )}
                    <Divider sx={{ mx: 2, my: 1, borderColor: 'grey.100' }} />
                    <MenuItem onClick={handleLogout} sx={{ mx: 1.5, mb: 1, borderRadius: '10px', py: 1.2, color: 'error.main', '&:hover': { bgcolor: 'error.50' } }}>
                      <ListItemIcon><Box component="img" src={IconKeluar} alt="Keluar" sx={{ width: 18, height: 18 }} /></ListItemIcon>
                      <ListItemText primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }}>Keluar</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    disableRipple
                    sx={{ 
                      borderRadius: '100px',
                      textTransform: 'none',
                      fontWeight: 600,
                      color: 'text.primary',
                      px: 3,
                      py: 1,
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    Masuk
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/register')}
                    disableElevation
                    sx={{
                      borderRadius: '100px',
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 3.5,
                      py: 1,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(13, 150, 104, 0.3)'
                      }
                    }}
                  >
                    Daftar Sekarang
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)} edge="end" sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ 
          sx: { 
            width: '100%', 
            maxWidth: 320, 
            borderTopLeftRadius: { xs: 0, sm: 24 }, 
            borderBottomLeftRadius: { xs: 0, sm: 24 },
            bgcolor: '#ffffff',
            backgroundImage: 'linear-gradient(to bottom, #ffffff, #f8fafc)'
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'grey.100' }}>
          <Logo />
          <IconButton 
            onClick={() => setMobileOpen(false)} 
            sx={{ 
              bgcolor: 'grey.100', 
              '&:hover': { bgcolor: 'grey.200' },
              width: 36,
              height: 36
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
          {token && user && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              p: 2, 
              mb: 3,
              borderRadius: 3,
              bgcolor: 'primary.50',
              border: '1px solid',
              borderColor: 'primary.100'
            }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(13, 150, 104, 0.2)' }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Box sx={{ fontWeight: 800, fontSize: '1.05rem', color: 'primary.900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </Box>
                <Box sx={{ fontSize: '0.8rem', color: 'primary.700', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </Box>
              </Box>
            </Box>
          )}

          <Typography variant="overline" sx={{ px: 1, color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
            Menu Utama
          </Typography>
          
          <List sx={{ px: 0, mt: 1 }}>
            {filteredLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <ListItemButton
                  key={link.path}
                  onClick={() => { navigate(link.path); setMobileOpen(false); }}
                  selected={isActive}
                  sx={{ 
                    borderRadius: '12px', 
                    mb: 1,
                    py: 1.5,
                    px: 2,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? '#fff' : 'text.primary',
                    '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff' },
                    '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
                    '&:hover': { bgcolor: isActive ? 'primary.dark' : 'grey.50' },
                    transition: 'all 0.2s'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box component="img" src={link.icon} alt={link.label} sx={{ width: 22, height: 22, filter: isActive ? 'brightness(0) invert(1)' : 'grayscale(100%) opacity(60%)' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={link.label} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 700 : 600, 
                      fontSize: '1rem',
                    }} 
                  />
                </ListItemButton>
              );
            })}
            
            {token && (
              <>
                <Divider sx={{ my: 2, borderColor: 'grey.100' }} />
                <Typography variant="overline" sx={{ px: 1, color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
                  Akun
                </Typography>
                
                <List sx={{ px: 0, mt: 1 }}>
                  <ListItemButton
                    onClick={() => { navigate('/profile'); setMobileOpen(false); }}
                    sx={{ borderRadius: '12px', mb: 1, py: 1.5, px: 2, '&:hover': { bgcolor: 'grey.50' } }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}><Box component="img" src={IconProfile} alt="Profil" sx={{ width: 20, height: 20 }} /></ListItemIcon>
                    <ListItemText primary="Profil Saya" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
                  </ListItemButton>
                  
                  {user?.role === 'admin' && (
                    <ListItemButton
                      onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                      sx={{ borderRadius: '12px', mb: 1, py: 1.5, px: 2, '&:hover': { bgcolor: 'grey.50' } }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}><Box component="img" src={IconAdminDashboard} alt="Dashboard Admin" sx={{ width: 20, height: 20 }} /></ListItemIcon>
                      <ListItemText primary="Dashboard Admin" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }} />
                    </ListItemButton>
                  )}
                </List>
              </>
            )}
          </List>
        </Box>

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.100', bgcolor: '#fff' }}>
          {token ? (
            <Button 
              fullWidth 
              variant="outlined" 
              color="error" 
              onClick={handleLogout} 
              startIcon={<Box component="img" src={IconKeluar} alt="Keluar" sx={{ width: 20, height: 20 }} />}
              sx={{ borderRadius: '100px', py: 1.5, fontWeight: 700, textTransform: 'none', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              Keluar Akun
            </Button>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                sx={{ borderRadius: '100px', py: 1.5, fontWeight: 700, textTransform: 'none', color: 'text.primary', borderColor: 'grey.300' }}
              >
                Masuk
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                disableElevation
                onClick={() => { navigate('/register'); setMobileOpen(false); }}
                sx={{ borderRadius: '100px', py: 1.5, fontWeight: 700, textTransform: 'none', boxShadow: '0 4px 14px rgba(13, 150, 104, 0.3)' }}
              >
                Daftar Sekarang
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
