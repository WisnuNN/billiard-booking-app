import { Paper, Box, Typography, alpha } from '@mui/material';

export default function StatCard({ icon: Icon, label, value, subtitle, color = 'primary.main', trend }) {
  // Determine color scheme for flat UI
  const themeColor = color.includes('.') ? color.split('.')[0] : 'primary';
  const colorHex = 
    themeColor === 'primary' ? '#0d9668' :
    themeColor === 'info' ? '#2563eb' :
    themeColor === 'warning' ? '#ea580c' :
    themeColor === 'error' ? '#dc2626' :
    '#0d9668';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: `4px solid ${colorHex}`,
        transition: 'all 0.2s ease',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', noWrap: true, flexGrow: 1, pr: 1 }}
        >
          {label}
        </Typography>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 0,
            bgcolor: alpha(colorHex, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {typeof Icon === 'string' ? (
            <Box component="img" src={Icon} sx={{ width: 22, height: 22, filter: 'grayscale(1) contrast(2)' }} />
          ) : (
            <Icon sx={{ color: colorHex, fontSize: 22 }} />
          )}
        </Box>
      </Box>

      <Box>
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block', fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Typography
            variant="caption"
            sx={{
              mt: 1.5,
              display: 'inline-block',
              color: trend > 0 ? 'success.main' : 'error.main',
              fontWeight: 700,
              bgcolor: trend > 0 ? alpha('#0d9668', 0.1) : alpha('#dc2626', 0.1),
              px: 1.5,
              py: 0.5,
              borderRadius: 0,
              border: '1px solid',
              borderColor: trend > 0 ? alpha('#0d9668', 0.3) : alpha('#dc2626', 0.3),
            }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
