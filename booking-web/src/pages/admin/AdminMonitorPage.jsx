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
    // const interval = setInterval(() => {
    //   fetchMonitor();
    // }, 60000);

    // return () => clearInterval(interval);
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
          sx={{ borderRadius: 0, textTransform: 'none', px: 3, py: 1.2, fontWeight: 700 }}
        >
          {tableLoading ? 'Memuat...' : 'Refresh Status'}
        </Button>
      </Box>

      {tableError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{tableError}</Alert>}

      <Grid container spacing={3}>
        {tables.map((table) => {
          const isOccupied = table.is_occupied;
          const statusColor = isOccupied ? 'error.main' : 'success.main';
          const statusBg = isOccupied ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.success.main, 0.05);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  transition: 'all 0.2s ease-in-out',
                  bgcolor: '#ffffff',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {/* Visual Indicator Line */}
                <Box sx={{ 
                  bgcolor: statusColor,
                  width: '100%', height: 4,
                  flexShrink: 0
                }} />

                <CardContent sx={{ 
                  p: 3, 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: 2.5,
                  minWidth: 0,
                  pb: 3,
                  '&:last-child': { pb: 3 }
                }}>
                  {/* Header: Icon, Name, Type, Chip */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    width: '100%',
                    flexShrink: 0
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                      <Avatar sx={{ 
                        width: 48, height: 48, 
                        bgcolor: statusBg,
                        color: statusColor,
                        borderRadius: 2
                      }}>
                        <TableIcon />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ lineHeight: 1.2, fontSize: '1.1rem' }} noWrap>
                          Meja {table.table_number}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }} noWrap>
                          {table.type || 'Standard'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Status Chip */}
                    <Chip 
                      size="small" 
                      label={isOccupied ? 'Terpakai' : 'Tersedia'} 
                      sx={{ 
                        fontWeight: 700, 
                        borderRadius: 1.5, 
                        textTransform: 'uppercase', 
                        fontSize: '0.65rem',
                        height: 24,
                        bgcolor: statusBg,
                        color: statusColor,
                      }}
                    />
                  </Box>

                  {/* Body Details Section */}
                  <Box sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1.5,
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.grey[50], 0.5),
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.100'
                  }}>
                    {isOccupied && table.active_booking ? (
                      <>
                        <Box sx={{ flex: 'auto', minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', width: 'auto' }}>Pelanggan</Typography>
                          <Typography variant="body2" fontWeight="700" color="text.primary" noWrap sx={{ ml: 0 }}>
                            {table.active_booking.customer_name}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 'auto', minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', width: 'auto' }}>Sisa Waktu</Typography>
                          <Typography variant="body2" color="error.main" fontWeight="800" sx={{ ml: 0 }}>
                            {formatTimeRemaining(table.time_remaining_minutes)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 'auto', minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', width: 'auto' }}>Sesi</Typography>
                          <Typography variant="caption" color="text.primary" fontWeight="700" sx={{ ml: 0 }}>
                            {table.active_booking.start_time} - {table.active_booking.end_time}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ flex: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ textTransform: 'uppercase', width: 'auto' }}>Tarif / Jam</Typography>
                          <Typography variant="body2" color="success.main" fontWeight="800" sx={{ ml: 0 }}>
                            {table.price_per_hour_formatted || 'Rp 0'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500, flex: 'auto', mt: 0.5 }}>
                          Meja kosong dan siap digunakan untuk sesi berikutnya.
                        </Typography>
                      </>
                    )}
                  </Box>

                  {/* Action Button */}
                  <Box sx={{ 
                    flexShrink: 0,
                    width: '100%',
                    mt: 'auto'
                  }}>
                    {isOccupied ? (
                      <Button 
                        variant="contained"
                        color="error"
                        fullWidth
                        disableElevation
                        sx={{ 
                          borderRadius: 2, 
                          py: 1.2,
                          px: 2,
                          fontWeight: 700, 
                          textTransform: 'none',
                          cursor: 'default', 
                          '&:hover': { bgcolor: 'error.main' } 
                        }}
                      >
                        Sedang Bermain
                      </Button>
                    ) : (
                      <Button 
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => handleOpenModal(table)}
                        disableElevation
                        sx={{ 
                          borderRadius: 2, 
                          py: 1.2, 
                          px: 2,
                          fontWeight: 700, 
                          textTransform: 'none',
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
        PaperProps={{ sx: { borderRadius: 0, borderTop: '4px solid', borderTopColor: 'primary.main' } }}
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
                borderRadius: 0,
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
              sx={{ borderRadius: 0, mb: 1.5, py: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              Cetak Struk
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCloseModal}
              fullWidth
              sx={{ borderRadius: 0, py: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}
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

              <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="primary.main" fontWeight="600">Total Tagihan:</Typography>
                <Typography variant="h6" fontWeight="800" color="primary.main">
                  Rp {((walkInData.duration_hours || 0) * (selectedTable?.price_per_hour || 0)).toLocaleString('id-ID')}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <Button onClick={handleCloseModal} color="inherit" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1, borderRadius: 0 }}>Batal</Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={bookingLoading}
                disableElevation
                sx={{ textTransform: 'uppercase', borderRadius: 0, px: 4, py: 1, fontWeight: 800, letterSpacing: 1 }}
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
