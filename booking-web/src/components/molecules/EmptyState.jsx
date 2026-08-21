import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/InboxOutlined';

export default function EmptyState({
  icon: Icon = InboxIcon,
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia saat ini.',
  actionLabel,
  onAction,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '20px',
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Icon sx={{ fontSize: 36, color: 'grey.400' }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, maxWidth: 360, color: 'text.secondary' }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
