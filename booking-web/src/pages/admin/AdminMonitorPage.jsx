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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
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
          sx={{ borderRadius: 0, textTransform: 'none', px: 3, py: 1, fontWeight: 700 }}
        >
          {tableLoading ? 'Memuat...' : 'Refresh Status'}
        </Button>
      </Box>

      {tableError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{tableError}</Alert>}

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '4px solid',
                borderTopColor: table.is_occupied ? 'error.main' : 'success.main',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                bgcolor: '#ffffff',
                '&:hover': {
                  boxShadow: table.is_occupied ? 'none' : '0 12px 24px rgba(0,0,0,0.06)',
                }
              }}
            >
              <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box sx={{ 
                      flexShrink: 0,
                      width: 42,
                      height: 42,
                      border: '1px solid',
                      borderColor: table.is_occupied ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.success.main, 0.2),
                      bgcolor: table.is_occupied ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TableIcon sx={{ color: table.is_occupied ? 'error.main' : 'success.main', fontSize: 22 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="h6" fontWeight="800" color="text.primary" sx={{ lineHeight: 1.2 }} noWrap>
                        Meja {table.table_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, display: 'block' }} noWrap>
                        {table.type || 'Standard'}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Chip 
                    size="small"
                    label={table.is_occupied ? 'Terpakai' : 'Tersedia'} 
                    sx={{ 
                      flexShrink: 0,
                      fontWeight: 800, 
                      borderRadius: 0,
                      textTransform: 'uppercase',
                      fontSize: '0.65rem',
                      letterSpacing: 0.5,
                      bgcolor: table.is_occupied ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                      color: table.is_occupied ? 'error.main' : 'success.main',
                      border: '1px solid',
                      borderColor: table.is_occupied ? alpha(theme.palette.error.main, 0.3) : alpha(theme.palette.success.main, 0.3)
                    }}
                  />
                </Box>

                {/* Body Details */}
                {table.is_occupied && table.active_booking ? (
                  <Stack spacing={0} sx={{ 
                    flexGrow: 1,
                    bgcolor: alpha(theme.palette.error.main, 0.02),
                    p: 2,
                    border: '1px dashed',
                    borderColor: alpha(theme.palette.error.main, 0.2),
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: '1px solid', borderColor: alpha(theme.palette.error.main, 0.1) }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Pelanggan</Typography>
                      <Typography variant="body2" fontWeight="800" color="text.primary" noWrap sx={{ maxWidth: '60%', textAlign: 'right' }}>
                        {table.active_booking.customer_name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: '1px solid', borderColor: alpha(theme.palette.error.main, 0.1) }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Sisa Waktu</Typography>
                      <Typography variant="body2" color="error.main" fontWeight="800">
                        {formatTimeRemaining(table.time_remaining_minutes)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.2 }}>
                       <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Sesi</Typography>
                       <Typography variant="caption" color="text.primary" fontWeight="800">
                          {table.active_booking.start_time} - {table.active_booking.end_time}
                       </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Box sx={{ 
                    flexGrow: 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.success.main, 0.02),
                    p: 2,
                    border: '1px dashed',
                    borderColor: alpha(theme.palette.success.main, 0.2),
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Tarif / Jam</Typography>
                      <Typography variant="body2" color="success.main" fontWeight="800">
                        {table.price_per_hour_formatted || 'Rp 0'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 500, lineHeight: 1.6 }}>
                      Meja dalam keadaan kosong dan siap digunakan.
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {/* Footer Button */}
              {table.is_occupied ? (
                <Button 
                  variant="contained"
                  color="error"
                  fullWidth
                  disableRipple
                  disableElevation
                  sx={{ borderRadius: 0, py: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, cursor: 'default', '&:hover': { bgcolor: 'error.main' } }}
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
                  sx={{ borderRadius: 0, py: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  Daftar Walk-In
                </Button>
              )}
            </Card>
          </Grid>
        ))}
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
