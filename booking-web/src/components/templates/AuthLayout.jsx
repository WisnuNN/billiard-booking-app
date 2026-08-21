import { Outlet, useLocation } from 'react-router-dom';
import { Box, Typography, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Logo from '../atoms/Logo';

const authTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0d9668',
      light: '#14b880',
      dark: '#087a54',
    },
    background: {
      default: '#0a0f1a',
      paper: 'rgba(15, 20, 35, 0.95)',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#64748b',
    },
    error: {
      main: '#f87171',
    }
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: 0,
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#0d9668', borderWidth: '2px' },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0 },
        containedPrimary: {
          background: '#0d9668',
          boxShadow: 'none',
          '&:hover': {
            background: '#087a54',
            boxShadow: '0 8px 24px -4px rgba(13, 150, 104, 0.4)',
          },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 0, backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#fca5a5', border: '1px solid rgba(220, 38, 38, 0.25)' }
      }
    }
  },
});

export default function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          bgcolor: '#0a0f1a',
        }}
      >
        {/* Left Panel — Branded Visual */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: isLogin ? '0 0 50%' : '0 0 42%',
            position: 'relative',
            overflow: 'hidden',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            transition: 'flex 0.3s ease',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,15,26,0.4) 0%, rgba(10,15,26,0.85) 70%, rgba(10,15,26,0.98) 100%)',
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 4,
              bgcolor: '#0d9668',
              zIndex: 2,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Logo />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', mb: 2, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Platform Reservasi<br />
              <Typography component="span" variant="h3" sx={{ fontWeight: 900, color: '#0d9668', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                Meja Billiard
              </Typography>
            </Typography>

            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 420, lineHeight: 1.7, mb: 5 }}>
              Pesan meja favorit Anda dengan mudah, bayar dengan cepat, dan nikmati pengalaman bermain billiard yang tak terlupakan.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Booking Online', 'Pembayaran Mudah', 'Real-time Status'].map((feature) => (
                <Box
                  key={feature}
                  sx={{
                    px: 2.5,
                    py: 1,
                    border: '1px solid rgba(13,150,104,0.3)',
                    bgcolor: 'rgba(13,150,104,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{ width: 6, height: 6, bgcolor: '#0d9668', borderRadius: '50%' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Right Panel — Auth Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, sm: 4, md: 6 },
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.03,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              zIndex: 0,
            }}
          />

          <Box sx={{ width: '100%', maxWidth: isLogin ? 400 : 520, position: 'relative', zIndex: 1 }}>
            {/* Mobile branding */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
              <Logo />
            </Box>

            {/* Page header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Box sx={{ width: 28, height: 3, bgcolor: '#0d9668' }} />
                <Typography variant="overline" sx={{ color: '#0d9668', fontWeight: 800, letterSpacing: 2, fontSize: '0.7rem' }}>
                  {isLogin ? 'LOGIN' : 'REGISTER'}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', mb: 0.5, letterSpacing: '-0.02em' }}>
                {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                {isLogin 
                  ? 'Masuk ke akun Anda untuk melanjutkan.'
                  : 'Lengkapi data berikut untuk membuat akun.'
                }
              </Typography>
            </Box>

            {/* Form */}
            <Box
              sx={{
                p: { xs: 3, sm: 4 },
                border: '1px solid rgba(255,255,255,0.06)',
                bgcolor: 'rgba(255,255,255,0.02)',
                mb: 3,
              }}
            >
              <Outlet />
            </Box>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', display: 'block', textAlign: 'center' }}>
              &copy; {new Date().getFullYear()} Baccarat Billiard. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
