import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Stack, Chip, Divider } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#070a12',
        color: '#94a3b8',
        pt: { xs: 4, md: 5 },
        pb: 3,
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(13, 150, 104, 0.6), transparent)',
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Main Grid Content */}
        <Grid container spacing={{ xs: 5, md: 4 }} sx={{ mb: 4 }}>
          {/* Col 1: Brand & Status */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
              <Box
                component="img"
                src="/baccarat-logo.png"
                alt="Baccarat Logo"
                sx={{
                  width: 30,
                  height: 30,
                  objectFit: 'contain',
                }}
              />
              <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1 }}>
                BACCARAT
              </Typography>
              <Chip
                label="Billiard & Lounge"
                size="small"
                sx={{
                  bgcolor: 'rgba(13, 150, 104, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(13, 150, 104, 0.3)',
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  height: 22,
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.6, mb: 2, maxWidth: 350 }}>
              Arena billiard modern pertama di Bandung dengan meja turnamen Rasson & sistem booking online real-time.
            </Typography>

            <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.75rem', display: 'block' }}>
              Buka Setiap Hari: 10.00 – 02.00 WIB
            </Typography>
          </Grid>

          {/* Col 2: Navigation Links */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }} sx={{ textAlign: 'left' }}>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 2 }}>
              Navigasi
            </Typography>
            <Stack spacing={1.5} alignItems="flex-start">
              {[
                { label: 'Beranda', to: '/' },
                { label: 'Daftar Meja', to: '/tables' },
                { label: 'Booking Saya', to: '/bookings' },
                { label: 'Profil Saya', to: '/profile' },
              ].map((item) => (
                <Typography
                  key={item.label}
                  component={Link}
                  to={item.to}
                  variant="body2"
                  sx={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#10b981',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Col 3: Contact & Location */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }} sx={{ textAlign: 'left' }}>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 2 }}>
              Lokasi & CS
            </Typography>
            <Stack spacing={1.5} alignItems="flex-start">
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8125rem', lineHeight: 1.5, pr: 2 }}>
                Jl. Riau No. 124, Cihapit, Bandung
              </Typography>
              <Typography
                component="a"
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                sx={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.8125rem', '&:hover': { color: '#ffffff' } }}
              >
                +62 812-3456-7890 (WhatsApp)
              </Typography>
            </Stack>
          </Grid>

          {/* Col 4: Social & Payment */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ textAlign: 'left', mt: { xs: 1, md: 0 } }}>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', mb: 2 }}>
              Sosial Media
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'flex-start' }}>
              {[
                { label: 'Instagram', href: '#' },
                { label: 'WhatsApp', href: 'https://wa.me/6281234567890' },
                { label: 'Facebook', href: '#' },
              ].map((social) => (
                <Typography
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="caption"
                  sx={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: '#10b981',
                    },
                  }}
                >
                  {social.label}
                </Typography>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="QRIS"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  height: 24,
                  ml: '0 !important'
                }}
              />
              <Chip
                label="Bank & E-Wallet"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  height: 24,
                  ml: '0 !important'
                }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', mb: 3 }} />

        {/* Sub-Footer Compact Strip */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'left' }}>
            © {new Date().getFullYear()} Baccarat Billiard & Lounge. Hak Cipta Dilindungi.
          </Typography>
          <Stack direction="row" spacing={2.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
            {[
              { label: 'Syarat & Ketentuan', path: '/terms' },
              { label: 'Kebijakan Privasi', path: '/privacy' },
              { label: 'Bantuan', path: '/help' },
            ].map((item) => (
              <Box
                component={Link}
                to={item.path}
                key={item.label}
                sx={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  '&:hover': { color: '#cbd5e1' },
                  transition: 'color 0.2s',
                  ml: '0 !important'
                }}
              >
                {item.label}
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
