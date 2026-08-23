import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
  alpha,
  useTheme,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  TimerOutlined as TimerOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  AddCircleOutlined as AddCircleOutlineIcon,
  CheckCircle as CheckCircleIcon,
  TableBar as TableIcon,
  Print as PrintIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import useTableStore from '../../stores/tableStore';
import useBookingStore from '../../stores/bookingStore';
import ReceiptModal from '../../components/molecules/ReceiptModal';

const formatTimeRemaining = (minutes) => {
  const mins = Math.ceil(minutes);
  if (mins <= 0) return 'Waktu Habis';
  if (mins < 60) return `${mins} Menit`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours} Jam ${remMins > 0 ? remMins + ' Mnt' : ''}`;
};

const AdminMonitorPage = () => {
  const theme = useTheme();
  const { tables, fetchMonitor, isLoading: tableLoading, error: tableError } = useTableStore();
  const { createWalkInBooking, isLoading: bookingLoading } = useBookingStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [walkInData, setWalkInData] = useState({
    customer_name: '',
    duration_hours: 1,
    pay_now: true
  });
  const [submitError, setSubmitError] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);
  const [receiptModal, setReceiptModal] = useState({ open: false, booking: null });

  useEffect(() => {
    fetchMonitor();
    
    // Listen to WebSocket for real-time updates
    import('../../utils/echo').then(({ default: echo }) => {
      echo.channel('tables')
        .listen('TableStatusUpdated', () => {
          fetchMonitor(); // Refetch all monitor data when any table changes
        });
    }).catch(err => console.error("Failed to load echo", err));

    return () => {
      import('../../utils/echo').then(({ default: echo }) => {
        echo.leaveChannel('tables');
      }).catch(err => console.error("Failed to load echo", err));
    };
  }, [fetchMonitor]);

  const handleOpenModal = (table) => {
    if (table.is_occupied) return;
    setSelectedTable(table);
    setWalkInData({ customer_name: '', duration_hours: 1, pay_now: true });
    setSubmitError('');
    setSuccessBooking(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTable(null);
    setSuccessBooking(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!walkInData.customer_name) {
      setSubmitError('Nama pelanggan harus diisi');
      return;
    }

    if (walkInData.duration_hours < 0.5) {
      setSubmitError('Durasi minimal 0.5 jam');
      return;
    }

    const res = await createWalkInBooking({
      table_id: selectedTable.id,
      customer_name: walkInData.customer_name,
      duration_hours: Number(walkInData.duration_hours),
      pay_now: walkInData.pay_now
    });

    if (res.success) {
      setSuccessBooking(res.data);
      fetchMonitor();
    } else {
      setSubmitError(res.message || 'Terjadi kesalahan saat menyimpan data');
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-end' }, mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            Live Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pantau ketersediaan dan status seluruh meja secara real-time.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={fetchMonitor} 
          disabled={tableLoading}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3, py: 1.2, fontWeight: 700 }}
        >
          {tableLoading ? 'Memuat...' : 'Refresh Status'}
        </Button>
      </Box>

      {tableError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{tableError}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        {tables.map((table) => {
          const isOccupied = table.is_occupied;
          const statusColorStr = isOccupied ? 'error.main' : 'success.main';
          const statusColorHex = isOccupied ? theme.palette.error.main : theme.palette.success.main;
          
          return (
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3} key={table.id}>
              <Card 
                elevation={0}
                sx={{ 
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: alpha('#94a3b8', 0.2), // slate-400 with opacity
                  bgcolor: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: isOccupied ? alpha(theme.palette.error.main, 0.4) : alpha(theme.palette.primary.main, 0.4),
                    boxShadow: '0 12px 32px -4px rgba(0,0,0,0.06)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {/* Top Row: Icon & Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ 
                        width: 46, height: 46, 
                        borderRadius: 3, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: alpha(statusColorHex, 0.1),
                        color: statusColorStr,
                        flexShrink: 0
                      }}>
                        <TableIcon />
                      </Box>
                      
                      <Box sx={{ 
                        px: 1.5, py: 0.75, 
                        borderRadius: '100px', 
                        bgcolor: alpha(statusColorHex, 0.1),
                        border: '1px solid',
                        borderColor: alpha(statusColorHex, 0.2),
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Typography variant="caption" fontWeight="800" color={statusColorStr} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem', lineHeight: 1 }}>
                          {isOccupied ? 'Terpakai' : 'Tersedia'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bottom Row: Title */}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h6" fontWeight="800" color="text.primary" noWrap sx={{ lineHeight: 1.1, mb: 0.5, fontSize: '1.2rem' }}>
                        Meja {table.table_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" noWrap sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }}>
                        {table.type || 'Standard'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Details Section */}
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4, minHeight: 90 }}>
                    {isOccupied && table.active_booking ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="body2" color="text.secondary" fontWeight={600}>Pelanggan</Typography>
                           <Typography variant="body2" color="text.primary" fontWeight={700}>{table.active_booking.customer_name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="body2" color="text.secondary" fontWeight={600}>Sesi</Typography>
                           <Typography variant="body2" color="text.primary" fontWeight={700}>{table.active_booking.start_time} - {table.active_booking.end_time}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 2, borderTop: '1px dashed', borderColor: alpha('#94a3b8', 0.3) }}>
                           <Typography variant="body2" color="text.secondary" fontWeight={700}>Sisa Waktu</Typography>
                           <Typography variant="body1" color="error.main" fontWeight={800}>{formatTimeRemaining(table.time_remaining_minutes)}</Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="body2" color="text.secondary" fontWeight={600}>Status Meja</Typography>
                           <Typography variant="body2" color="text.primary" fontWeight={700}>Kosong</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="body2" color="text.secondary" fontWeight={600}>Kesiapan</Typography>
                           <Typography variant="body2" color="text.primary" fontWeight={700}>Siap Digunakan</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 2, borderTop: '1px dashed', borderColor: alpha('#94a3b8', 0.3) }}>
                           <Typography variant="body2" color="text.secondary" fontWeight={700}>Tarif / Jam</Typography>
                           <Typography variant="body1" color="success.main" fontWeight={800}>
                             {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(table.price_per_hour || 0)}
                           </Typography>
                        </Box>
                      </>
                    )}
                  </Box>

                  {/* Action Button */}
                  <Box sx={{ mt: 'auto' }}>
                    {isOccupied ? (
                      <Button 
                        fullWidth 
                        disableRipple
                        sx={{ 
                          borderRadius: 2.5, py: 1.2, fontWeight: 700, textTransform: 'none',
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                          color: 'error.main',
                          cursor: 'default',
                          '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) }
                        }}
                      >
                        Sedang Bermain
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        disableElevation
                        onClick={() => handleOpenModal(table)}
                        sx={{ 
                          borderRadius: 2.5, 
                          py: 1.2, 
                          fontWeight: 700, 
                          textTransform: 'none',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                          '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                          }
                        }}
                      >
                        Daftar Walk-In
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Modal Walk-in / Success */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, borderTop: '4px solid', borderTopColor: 'primary.main' } }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Typography variant="h6" fontWeight="800">
            {successBooking ? 'Walk-in Berhasil' : `Walk-in - Meja ${selectedTable?.table_number}`}
          </Typography>
        </DialogTitle>
        
        {successBooking ? (
          <DialogContent sx={{ pt: 2, pb: 4, px: 3, textAlign: 'center' }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 72, mb: 2 }} />
            <Typography variant="body1" color="text.secondary" mb={1}>
              Meja telah aktif untuk pelanggan.
            </Typography>
            <Chip 
              label={successBooking.transaction?.payment_status === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
              size="small"
              sx={{ 
                mb: 3,
                borderRadius: 2,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                bgcolor: successBooking.transaction?.payment_status === 'paid' 
                  ? alpha(theme.palette.success.main, 0.1) 
                  : alpha(theme.palette.warning.main, 0.1),
                color: successBooking.transaction?.payment_status === 'paid' 
                  ? 'success.main' 
                  : 'warning.main',
                border: '1px solid',
                borderColor: successBooking.transaction?.payment_status === 'paid' 
                  ? alpha(theme.palette.success.main, 0.3) 
                  : alpha(theme.palette.warning.main, 0.3),
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<PrintIcon />}
              onClick={() => setReceiptModal({ open: true, booking: successBooking })}
              fullWidth
              disableElevation
              sx={{ borderRadius: 2, mb: 1.5, py: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Cetak Struk
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCloseModal}
              fullWidth
              sx={{ borderRadius: 2, py: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Tutup
            </Button>
          </DialogContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ pt: 1, px: 3 }}>
              {submitError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{submitError}</Alert>}
              
              <TextField
                label="Nama Pelanggan"
                fullWidth
                required
                margin="dense"
                value={walkInData.customer_name}
                onChange={(e) => setWalkInData({ ...walkInData, customer_name: e.target.value })}
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Durasi (Jam)"
                type="number"
                fullWidth
                required
                margin="dense"
                inputProps={{ min: 0.5, step: 0.5 }}
                value={walkInData.duration_hours}
                onChange={(e) => setWalkInData({ ...walkInData, duration_hours: e.target.value })}
              />

              <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="primary.main" fontWeight="600">Total Tagihan:</Typography>
                <Typography variant="h6" fontWeight="800" color="primary.main">
                  Rp {((walkInData.duration_hours || 0) * (selectedTable?.price_per_hour || 0)).toLocaleString('id-ID')}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight="700" color="text.primary">Pembayaran</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {walkInData.pay_now ? 'Pelanggan bayar tunai sekarang' : 'Pelanggan bayar setelah selesai'}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={walkInData.pay_now} 
                      onChange={(e) => setWalkInData({ ...walkInData, pay_now: e.target.checked })}
                      color="success"
                    />
                  }
                  label={
                    <Typography variant="caption" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {walkInData.pay_now ? 'Bayar Sekarang' : 'Bayar Nanti'}
                    </Typography>
                  }
                  labelPlacement="start"
                  sx={{ m: 0 }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button onClick={handleCloseModal} color="inherit" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1, borderRadius: 2 }}>Batal</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={bookingLoading}
                disableElevation
                sx={{ textTransform: 'uppercase', borderRadius: 2, px: 4, py: 1, fontWeight: 800, letterSpacing: 1 }}
              >
                {bookingLoading ? <CircularProgress size={24} color="inherit" /> : 'Mulai Sesi'}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>

      <ReceiptModal 
        open={receiptModal.open} 
        onClose={() => setReceiptModal({ open: false, booking: null })} 
        booking={receiptModal.booking} 
      />
    </Box>
  );
};

export default AdminMonitorPage;
