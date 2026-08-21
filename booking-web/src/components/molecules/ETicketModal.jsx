import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Avatar,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

export default function ETicketModal({ open, onClose, ticket, loading }) {
  const theme = useTheme();
  
  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: '24px', 
          bgcolor: '#f4f6f8',
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        } 
      }}
    >
      <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } 
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
            <CircularProgress />
          </Box>
        ) : ticket ? (
          <Box>
            {/* 1. HEADER TIKET (Gradasi Warna Primary) */}
            <Box 
              sx={{ 
                bgcolor: 'primary.main',
                background: `linear-gradient(135deg, ${theme.palette.primary.light || theme.palette.primary.main} 0%, ${theme.palette.primary.dark || '#000'} 100%)`,
                color: 'white',
                pt: 6,
                pb: 8,
                px: 4,
                textAlign: 'center',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px',
                position: 'relative'
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 64, 
                  height: 64, 
                  margin: '0 auto', 
                  mb: 2,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}
              >
                <ConfirmationNumberIcon fontSize="large" />
              </Avatar>
              <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 600, opacity: 0.9 }}>
                ENTRY TICKET
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, mb: 1, letterSpacing: 1, textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>
                {ticket.booking_code}
              </Typography>
              <Box 
                sx={{ 
                  display: 'inline-block', 
                  bgcolor: ticket.status === 'confirmed' || ticket.status === 'completed' ? 'success.main' : 'warning.main',
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  mt: 1
                }}
              >
                {ticket.status}
              </Box>
            </Box>

            {/* 2. BODY TIKET (Kartu Melayang) */}
            <Box 
              sx={{ 
                position: 'relative', 
                bgcolor: 'white', 
                mx: { xs: 2, sm: 4 }, 
                mt: -5, 
                mb: 4, 
                borderRadius: 4, 
                p: { xs: 3, sm: 4 }, 
                boxShadow: '0 12px 32px rgba(0,0,0,0.08)' 
              }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                    Pelanggan
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>
                    {ticket.customer_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                    Meja / Table
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>
                    {ticket.table_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                    Tanggal Main
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>
                    {ticket.booking_date}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                    Waktu & Durasi
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>
                    {ticket.start_time} - {ticket.end_time} <br />
                    <span style={{ fontSize: '0.85em', color: '#666' }}>({ticket.duration})</span>
                  </Typography>
                </Box>
              </Box>

              {/* 3. PEMBATAS TIKET (Dashed line dengan Cutout pinggir) */}
              <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', my: 4, mx: { xs: -3, sm: -4 } }}>
                {/* Potongan kiri */}
                <Box sx={{ width: 16, height: 32, bgcolor: '#f4f6f8', borderRadius: '0 100px 100px 0', boxShadow: 'inset -3px 0 5px rgba(0,0,0,0.02)' }} />
                
                {/* Garis Putus-putus */}
                <Divider sx={{ flexGrow: 1, borderStyle: 'dashed', borderWidth: 1.5, borderColor: 'grey.300', mx: 2 }} />
                
                {/* Potongan kanan */}
                <Box sx={{ width: 16, height: 32, bgcolor: '#f4f6f8', borderRadius: '100px 0 0 100px', boxShadow: 'inset 3px 0 5px rgba(0,0,0,0.02)' }} />
              </Box>

              {/* 4. FOOTER & QR CODE */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600, letterSpacing: 0.5 }}>
                    Tunjukkan tiket ini ke Admin
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Total Pembayaran: 
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
                    Rp {Number(ticket.total_price).toLocaleString('id-ID')}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    p: 1.5, 
                    bgcolor: 'white', 
                    borderRadius: 3, 
                    border: '2px solid', 
                    borderColor: 'grey.200',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                  }}
                >
                  <QrCode2Icon sx={{ fontSize: 90, color: 'grey.800' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box p={6} textAlign="center">
            <Typography color="error" fontWeight="bold">Gagal memuat e-ticket.</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
