import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Pagination,
  Skeleton,
  Button,
} from '@mui/material';
import { CalendarDays, Clock, Plus, ChevronRight, LayoutList } from 'lucide-react';
import useBookingStore from '../stores/bookingStore';
import StatusBadge from '../components/atoms/StatusBadge';
import EmptyState from '../components/molecules/EmptyState';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { bookings, meta, isLoading, fetchBookings } = useBookingStore();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBookings({ status: status || undefined, page, limit: 10 });
  }, [status, page, fetchBookings]);

  const tabs = [
    { label: 'Semua', value: '' },
    { label: 'Menunggu', value: 'pending' },
    { label: 'Dikonfirmasi', value: 'confirmed' },
    { label: 'Selesai', value: 'completed' },
    { label: 'Dibatalkan', value: 'cancelled' },
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 5 }, px: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      <Container maxWidth="md">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            flexDirection: { xs: 'column', md: 'row' },
            mb: { xs: 3, md: 4 },
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em', color: 'text.primary' }}>
              Booking <Box component="span" sx={{ color: 'primary.main' }}>Saya</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kelola dan pantau semua jadwal bermain billiard Anda.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={() => navigate('/tables')} 
            startIcon={<Plus size={18} />}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700, 
              boxShadow: '0 4px 10px rgba(13, 150, 104, 0.2)', 
              px: 3, 
              py: 1,
              textTransform: 'none',
              fontSize: '0.9rem',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 6px 14px rgba(13, 150, 104, 0.3)'
              }
            }}
          >
            Booking Baru
          </Button>
        </Box>

        {/* Status Tabs */}
        <Paper
          elevation={0}
          sx={{ 
            borderRadius: 3, 
            border: '1px solid', 
            borderColor: 'grey.200', 
            mb: 3, 
            bgcolor: '#ffffff',
            p: 0.5,
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}
        >
          <Tabs
            value={status}
            onChange={(_, val) => { setStatus(val); setPage(1); }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: '100%',
                borderRadius: 2.5,
                bgcolor: 'grey.100',
                zIndex: 0
              },
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'none',
                minHeight: 40,
                borderRadius: 2.5,
                zIndex: 1,
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'text.primary',
                }
              }
            }}
          >
            {tabs.map((t) => (
              <Tab key={t.value} label={t.label} value={t.value} disableRipple />
            ))}
          </Tabs>
        </Paper>

        {/* Booking List */}
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="40%" height={28} />
                    <Skeleton width="60%" sx={{ mt: 1 }} />
                    <Skeleton width="30%" sx={{ mt: 1 }} />
                  </Box>
                  <Skeleton variant="rectangular" width={100} height={35} sx={{ borderRadius: 2 }} />
                </Box>
              </Paper>
            ))}
          </Box>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={LayoutList}
            title="Belum ada pesanan"
            description="Anda belum memiliki riwayat booking. Pesan meja billiard Anda sekarang!"
            actionLabel="Lihat Meja"
            onAction={() => navigate('/tables')}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookings.map((booking) => (
              <Paper
                key={booking.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  bgcolor: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  '&:hover': {
                    boxShadow: '0 8px 25px -5px rgba(0,0,0,0.05)',
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                      color: 'primary.main'
                    }
                  },
                }}
                onClick={() => navigate(`/bookings/${booking.id}`)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                        {booking.table?.name || 'Meja'}
                      </Typography>
                      <StatusBadge status={booking.status} size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: 'primary.main', display: 'flex' }}>
                          <CalendarDays size={16} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {booking.booking_date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: 'text.secondary', display: 'flex' }}>
                          <Clock size={16} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {booking.start_time.substring(0, 5)} — {booking.end_time.substring(0, 5)} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>({Math.abs(booking.duration_hours)} jam)</Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    textAlign: { xs: 'left', md: 'right' }, 
                    minWidth: { xs: '100%', md: '150px' }, 
                    display: 'flex', 
                    flexDirection: { xs: 'row', md: 'column' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'center', md: 'flex-end' },
                    gap: 0.5
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Bayar
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        {booking.total_price_formatted.replace('-', '')}
                      </Typography>
                    </Box>
                    {booking.transaction && (
                      <StatusBadge status={booking.transaction.payment_status} size="small" />
                    )}
                  </Box>

                  <Box sx={{ 
                    display: { xs: 'none', md: 'flex' }, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%', 
                    ml: 1 
                  }}>
                    <ChevronRight size={20} color="#cbd5e1" className="arrow-icon" style={{ transition: 'all 0.3s ease' }} />
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {meta && meta.last_page > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={meta.last_page}
              page={meta.current_page}
              onChange={(_, val) => setPage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
