import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  description,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  confirmColor = 'primary',
  children,
  loading = false,
  maxWidth = 'xs',
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: { borderRadius: '20px', p: 1 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: '1.5px solid #e2e8f0',
            background: '#fff',
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: 'none',
            background:
              confirmColor === 'error'
                ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                : 'linear-gradient(135deg, #0d9668, #14b880)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Memproses...' : confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}
