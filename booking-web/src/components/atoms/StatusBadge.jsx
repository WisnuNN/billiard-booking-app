import { Chip } from '@mui/material';

const statusConfig = {
  pending: { label: 'Menunggu', color: 'warning' },
  confirmed: { label: 'Dikonfirmasi', color: 'success' },
  completed: { label: 'Selesai', color: 'info' },
  cancelled: { label: 'Dibatalkan', color: 'error' },
  unpaid: { label: 'Belum Bayar', color: 'warning' },
  paid: { label: 'Lunas', color: 'success' },
  refunded: { label: 'Refund', color: 'error' },
};

export default function StatusBadge({ status, size = 'small', ...props }) {
  const config = statusConfig[status] || { label: status, color: 'default' };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant="filled"
      sx={{
        fontWeight: 600,
        fontSize: '0.7rem',
        letterSpacing: '0.03em',
        borderRadius: '8px',
        height: size === 'small' ? 26 : 32,
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
      {...props}
    />
  );
}
