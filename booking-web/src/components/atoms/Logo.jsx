import { Box, Typography } from '@mui/material';

const BilliardIcon = ({ sx }) => (
  <Box component="svg" viewBox="0 0 24 24" fill="currentColor" sx={{ width: 24, height: 24, ...sx }}>
    <circle cx="12" cy="7.7" r="2.5" />
    <circle cx="9.5" cy="12" r="2.5" />
    <circle cx="14.5" cy="12" r="2.5" />
    <circle cx="7" cy="16.3" r="2.5" />
    <circle cx="12" cy="16.3" r="2.5" />
    <circle cx="17" cy="16.3" r="2.5" />
  </Box>
);

export default function Logo({ collapsed = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
      <Box
        component="img"
        src="/baccarat-logo.png"
        alt="Baccarat Logo"
        sx={{
          width: 40,
          height: 40,
          objectFit: 'contain'
        }}
      />
      {!collapsed && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1.1rem',
              lineHeight: 1.2,
              color: 'text.primary',
              letterSpacing: '-0.02em',
            }}
          >
            Baccarat
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Booking System
          </Typography>
        </Box>
      )}
    </Box>
  );
}
