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
              borderRadius: 3, 
              fontWeight: 800, 
              boxShadow: '0 4px 14px rgba(13, 150, 104, 0.3)', 
              px: { xs: 2, md: 3 }, 
              py: { xs: 1.5, md: 1.2 },
              width: { xs: '100%', md: 'auto' },
              textTransform: 'none',
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 6px 20px rgba(13, 150, 104, 0.4)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s ease'
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
                bgcolor: 'primary.main',
                zIndex: 0
              },
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: { xs: '0.8rem', md: '0.85rem' },
                textTransform: 'none',
                minHeight: { xs: 36, md: 40 },
                borderRadius: 2.5,
                zIndex: 1,
                color: 'text.secondary',
                px: { xs: 2, md: 3 },
                '&.Mui-selected': {
                  color: '#ffffff',
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
                  p: 0,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  bgcolor: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 12px 32px -8px rgba(13,150,104,0.15)',
                    transform: 'translateY(-4px)',
                    borderColor: 'primary.main',
                    '& .arrow-icon': {
                      transform: 'translateX(6px)',
                      color: 'primary.main'
                    }
                  },
                }}
                onClick={() => navigate(`/bookings/${booking.id}`)}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Top Header Section */}
                  <Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: '1px dashed', borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                        {booking.table?.name || 'Meja Billiard'}
                      </Typography>
                      <StatusBadge status={booking.status} size="small" />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                      <ChevronRight size={18} color="#cbd5e1" className="arrow-icon" style={{ transition: 'all 0.3s ease' }} />
                    </Box>
                  </Box>

                  {/* Body Section */}
                  <Box sx={{ p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: { xs: 2, md: 4 } }}>
                    <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: 'primary.main', display: 'flex', bgcolor: 'primary.50', p: 1, borderRadius: 2 }}>
                          <CalendarDays size={18} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.9rem' }}>
                          {booking.booking_date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ color: 'text.secondary', display: 'flex', bgcolor: 'grey.100', p: 1, borderRadius: 2 }}>
                          <Clock size={18} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.9rem' }}>
                          <Box component="span" sx={{ color: 'text.primary' }}>{booking.start_time.substring(0, 5)}</Box> — <Box component="span" sx={{ color: 'text.primary' }}>{booking.end_time.substring(0, 5)}</Box>
                          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500, ml: 1 }}>({Math.abs(booking.duration_hours)} jam)</Box>
                        </Typography>
                      </Box>
                    </Box>
                    </Box>

                    {/* Pricing Section on Right (Desktop) / Bottom (Mobile) */}
                    <Box sx={{ 
                      textAlign: { xs: 'left', md: 'right' }, 
                      width: { xs: '100%', md: 'auto' },
                      display: 'flex', 
                      flexDirection: { xs: 'row', md: 'column' }, 
                      justifyContent: 'space-between', 
                      alignItems: { xs: 'center', md: 'flex-end' },
                      bgcolor: { xs: 'grey.50', md: 'transparent' },
                      p: { xs: 1.5, md: 0 },
                      borderRadius: { xs: 2, md: 0 },
                      gap: { xs: 2, md: 0.5 }
                    }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Total Bayar
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                          {booking.total_price_formatted.replace('-', '')}
                        </Typography>
                      </Box>
                      {booking.transaction && (
                        <StatusBadge status={booking.transaction.payment_status} size="small" />
                      )}
                    </Box>

                    {/* Desktop Arrow */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                      <ChevronRight size={24} color="#cbd5e1" className="arrow-icon" style={{ transition: 'all 0.3s ease' }} />
                    </Box>
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
