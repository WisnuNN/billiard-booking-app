import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Skeleton,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  Ticket, 
  X,
  CreditCard,
  MapPin,
  FileText,
  AlertCircle,
  Wallet,
  Receipt
} from 'lucide-react';
import useBookingStore from '../stores/bookingStore';
import StatusBadge from '../components/atoms/StatusBadge';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import ETicketModal from '../components/molecules/ETicketModal';
import ReceiptModal from '../components/molecules/ReceiptModal';
import toast from 'react-hot-toast';

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentBooking, isLoading, fetchBooking, cancelBooking, fetchTicket, processPayment } = useBookingStore();
  
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchBooking(id);
  }, [id, fetchBooking]);

  const handleCancel = async () => {
    setCancelling(true);
    const res = await cancelBooking(id);
    setCancelling(false);
    if (res.success) {
      toast.success(res.message);
      setShowCancel(false);
      fetchBooking(id);
    } else {
      toast.error(res.message);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    const res = await processPayment(id);
    setPaying(false);
    if (res.success) {
      if (res.payment_url) {
        toast.success(res.message);
        window.location.href = res.payment_url;
      } else {
        toast.success(res.message);
        fetchBooking(id);
        setShowReceipt(true);
      }
    } else {
      toast.error(res.message);
    }
  };

  const handleShowTicket = async () => {
    setShowTicket(true);
    setLoadingTicket(true);
    const result = await fetchTicket(parseInt(id));
    if (result.success) {
      setTicketData(result.data);
    } else {
      toast.error(result.message);
    }
    setLoadingTicket(false);
  };

  if (isLoading && !currentBooking) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Skeleton width={120} height={25} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 3, mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!currentBooking) return null;

  const b = currentBooking;
  const canCancel = ['pending', 'confirmed'].includes(b.status);
  const isCompletedOrConfirmed = ['confirmed', 'completed'].includes(b.status);

  const durationStr = Math.abs(b.duration_hours) + ' Jam';
  const priceStr = b.total_price_formatted.replace('-', '');

  return (
    <Box sx={{ py: { xs: 4, md: 5 }, px: { xs: 2, sm: 3 }, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Container maxWidth="md">
        
        {/* Navigation */}
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/bookings')}
          sx={{ 
            mb: 2, 
            color: 'text.secondary', 
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
          }}
          disableRipple
        >
          Kembali ke Daftar Pesanan
        </Button>

        {/* Hero Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            mb: 3,
            border: '1px solid',
            borderColor: 'grey.200',
            background: `linear-gradient(to right, #ffffff, ${alpha(theme.palette.primary.main, 0.03)})`,
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            gap: 2,
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={`#${b.id}`}
                sx={{ 
                  fontWeight: 800, 
                  borderRadius: 1, 
                  height: 24, 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  px: 0.5, 
                  fontSize: '0.75rem' 
                }}
              />
              <StatusBadge status={b.status} size="small" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.01em', color: 'text.primary' }}>
              Detail Pesanan
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Dibuat pada {new Date(b.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </Typography>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            {isCompletedOrConfirmed && (
              <Button
                variant="contained"
                startIcon={<Ticket size={18} />}
                onClick={handleShowTicket}
                fullWidth
                sx={{ 
                  borderRadius: 2, 
                  textTransform: 'none', 
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  fontSize: '0.9rem',
                  boxShadow: `0 6px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Lihat E-Ticket
              </Button>
            )}
          </Box>
        </Paper>

        <Grid container spacing={3}>
          
          {/* Left Column: Booking Details */}
          <Grid item xs={12} md={7}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3, 
                border: '1px solid', 
                borderColor: 'grey.200',
                height: '100%',
                bgcolor: '#ffffff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
                  <MapPin size={18} />
                </Box>
                Informasi Meja & Waktu
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Table Info */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Tipe Meja
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                      {b.table?.name || '-'}
                    </Typography>
                    {b.table?.type && (
                      <Chip 
                        label={b.table.type.toUpperCase()} 
                        size="small"
                        color={b.table.type.toLowerCase() === 'vip' ? 'warning' : 'default'}
                        sx={{ fontWeight: 800, borderRadius: 1, height: 22, fontSize: '0.65rem' }} 
                      />
                    )}
                  </Box>
                </Box>

                {/* Schedule Grid */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Jadwal Bermain
                  </Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                        <Box sx={{ color: 'primary.main', display: 'flex' }}>
                          <CalendarDays size={18} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>Tanggal</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {new Date(b.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.04), border: '1px solid', borderColor: alpha(theme.palette.secondary.main, 0.1) }}>
                        <Box sx={{ color: 'secondary.main', display: 'flex' }}>
                          <Clock size={18} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 600 }}>Waktu Sesi</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Notes Details */}
                {b.notes && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Catatan Tambahan
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: '#f4f6f8', border: '1px dashed', borderColor: 'grey.300', display: 'flex', gap: 1.5 }}>
                      <FileText size={18} color={theme.palette.text.secondary} />
                      <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, lineHeight: 1.5 }}>
                        {b.notes}
                      </Typography>
                    </Paper>
                  </Box>
                )}

              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Payment & Action */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 32 }}>
              
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  bgcolor: '#ffffff'
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', display: 'flex' }}>
                    <CreditCard size={18} />
                  </Box>
                  Rincian Tagihan
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Bayar</Typography>
                  <StatusBadge status={b.transaction?.payment_status || 'unpaid'} />
                </Box>

                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f4f6f8', mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Harga per jam</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {b.table?.price_per_hour_formatted || '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>Total Durasi</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {durationStr}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed', my: 2, borderColor: 'grey.300' }} />

                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.15),
                    mt: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, lineHeight: 1, letterSpacing: '0.1em' }}>
                    TOTAL TAGIHAN
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.02em' }}>
                    {priceStr}
                  </Typography>
                </Box>
                
                {b.transaction?.paid_at && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', textAlign: 'center', mt: 1.5 }}>
                    Dibayar pada: {new Date(b.transaction.paid_at).toLocaleString('id-ID')}
                  </Typography>
                )}
                
                {b.transaction?.payment_status === 'unpaid' && b.status !== 'cancelled' && (
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<Wallet size={18} />}
                    onClick={handlePay}
                    disabled={paying || cancelling}
                    sx={{ borderRadius: 2, fontWeight: 800, py: 1.2, mt: 2.5, boxShadow: '0 8px 20px rgba(46, 125, 50, 0.25)' }}
                  >
                    {paying ? 'Memproses...' : 'Bayar Sekarang'}
                  </Button>
                )}

                {b.transaction?.payment_status === 'paid' && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Receipt size={18} />}
                    onClick={() => setShowReceipt(true)}
                    sx={{ borderRadius: 2, fontWeight: 800, py: 1.2, mt: 2.5, boxShadow: '0 8px 20px rgba(13, 150, 104, 0.25)' }}
                  >
                    Lihat Struk Pembayaran
                  </Button>
                )}
              </Paper>
              
              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<AlertCircle size={16} />}
                  onClick={() => setShowCancel(true)}
                  sx={{ 
                    borderRadius: 2, 
                    fontWeight: 800, 
                    py: 1,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    borderWidth: 2,
                    bgcolor: '#ffffff',
                    '&:hover': {
                      borderWidth: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.05),
                    }
                  }}
                >
                  Batalkan Pesanan Ini
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Cancel Confirmation Modal */}
        <Dialog
          open={showCancel}
          onClose={() => setShowCancel(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, pb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Batalkan Booking?</Typography>
            <IconButton onClick={() => setShowCancel(false)} size="small" sx={{ color: 'text.secondary' }}>
              <X size={18} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
              Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dikembalikan.
            </Typography>
            <Box sx={{ p: 1.5, bgcolor: '#f4f6f8', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Meja</Typography>
                <Typography variant="body2" fontWeight={800}>{b.table?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Jadwal</Typography>
                <Typography variant="body2" fontWeight={800}>
                  {new Date(b.booking_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} ({b.start_time.substring(0, 5)})
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
            <Button 
              variant="outlined"
              onClick={() => setShowCancel(false)} 
              sx={{ flex: 1, borderRadius: 1.5, fontWeight: 700, borderWidth: 2, py: 0.75, '&:hover': { borderWidth: 2 } }}
            >
              Kembali
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCancel}
              disabled={cancelling}
              sx={{ flex: 1, borderRadius: 1.5, fontWeight: 700, boxShadow: 'none', py: 0.75 }}
            >
              {cancelling ? 'Memproses...' : 'Ya, Batalkan'}
            </Button>
          </DialogActions>
        </Dialog>

        <ETicketModal
          open={showTicket}
          onClose={() => setShowTicket(false)}
          ticket={ticketData}
          loading={loadingTicket}
        />

        <ReceiptModal
          open={showReceipt}
          onClose={() => setShowReceipt(false)}
          booking={b}
        />
      </Container>
    </Box>
  );
}
