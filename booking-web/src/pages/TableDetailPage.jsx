import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  Alert,
  Skeleton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ArrowLeft, Clock, CalendarDays, Info, CheckCircle2, X } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import useTableStore from '../stores/tableStore';
import useBookingStore from '../stores/bookingStore';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function TableDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const { currentTable, availability, isLoading, fetchTable, checkAvailability } = useTableStore();
  const { createBooking, isLoading: bookingLoading } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchTable(id);
  }, [id, fetchTable]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedStartTime('');
    setSelectedDuration(1);
    if (date) {
      checkAvailability(id, date);
    }
  };

  const handleBooking = async () => {
    if (!selectedStartTime || !selectedDate) return;
    
    const availableSlots = availability?.slots || [];
    const startIndex = availableSlots.findIndex(s => s.start_time === selectedStartTime);
    const endSlot = availableSlots[startIndex + selectedDuration - 1];
    if (!endSlot) return;

    const result = await createBooking({
      table_id: parseInt(id),
      booking_date: selectedDate,
      start_time: selectedStartTime,
      end_time: endSlot.end_time,
      notes: notes || undefined,
    });

    if (result.success) {
      setShowConfirm(false);
      toast.success(result.message || 'Booking berhasil dibuat!');
      navigate('/bookings');
    } else {
      toast.error(result.message);
    }
  };

  const totalHours = selectedDuration;
  const totalPrice = totalHours * (currentTable?.price_per_hour || 0);

  const availableSlots = availability?.slots || [];
  let maxDuration = 1;
  let end_time_display = '';

  if (selectedStartTime && availableSlots.length > 0) {
    const startIndex = availableSlots.findIndex(s => s.start_time === selectedStartTime);
    if (startIndex !== -1) {
      let count = 0;
      for (let i = startIndex; i < availableSlots.length; i++) {
        if (availableSlots[i].is_available) {
          count++;
        } else {
          break;
        }
      }
      maxDuration = count;
      const endSlot = availableSlots[startIndex + selectedDuration - 1];
      if (endSlot) end_time_display = endSlot.end_time;
    }
  }

  if (isLoading && !currentTable) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton width={200} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px', mb: 3 }} />
            <Skeleton height={32} width="60%" />
            <Skeleton sx={{ mt: 1 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!currentTable) return null;

  const today = new Date().toISOString().split('T')[0];

  let displayImg = currentTable.image_url;
  if (!displayImg || displayImg.length < 5) {
    if (currentTable.type === 'vip') {
      displayImg = 'https://images.unsplash.com/photo-1628190395400-34863bc0d638?auto=format&fit=crop&w=1200&q=80'; // Elegant room
    } else if (currentTable.type === 'premium') {
      displayImg = 'https://images.unsplash.com/photo-1549420687-32cc6ef1fcc4?auto=format&fit=crop&w=1200&q=80'; // Lounge
    } else {
      displayImg = 'https://images.unsplash.com/photo-1595333068695-1f6e1f0e4e5e?auto=format&fit=crop&w=1200&q=80'; // Standard Billiard
    }
  }

  return (
    <Box sx={{ pb: { xs: 8, md: 10 }, pt: 0, bgcolor: 'background.default' }}>
      {/* Premium Hero Image Header */}
      <Box sx={{ position: 'relative', height: { xs: 280, sm: 350, md: 400 }, mb: { xs: 4, md: 6 }, bgcolor: 'grey.900' }}>
        <Box
          component="img"
          src={displayImg}
          alt={currentTable.name}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,1) 0%, rgba(15,23,42,0) 100%)' }} />
        
        <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/tables')}
            disableRipple
            sx={{ 
              position: 'absolute', 
              top: { xs: 16, md: 32 }, 
              left: { xs: 20, sm: 24, md: 40 }, 
              color: '#fff', 
              fontWeight: 700, 
              bgcolor: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              px: { xs: 2, md: 3 },
              py: { xs: 0.8, md: 1 },
              fontSize: { xs: '0.85rem', md: '0.9rem' },
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)', transform: 'translateY(-2px)' }
            }}
          >
            Kembali
          </Button>
          
          <Box sx={{ position: 'absolute', bottom: { xs: 24, md: 40 }, left: { xs: 20, sm: 24, md: 40 }, right: { xs: 20, md: 'auto' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Chip
                label={currentTable.type?.toUpperCase() || 'STANDARD'}
                sx={{ 
                  fontWeight: 800, 
                  borderRadius: 1.5, 
                  height: 26, 
                  px: 1, 
                  fontSize: '0.75rem', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  bgcolor: currentTable.type === 'vip' ? '#ef4444' : currentTable.type === 'premium' ? 'primary.main' : '#ffffff',
                  color: currentTable.type === 'vip' || currentTable.type === 'premium' ? '#ffffff' : '#0f172a',
                  letterSpacing: '0.05em'
                }}
              />
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.1em', textShadow: '0 2px 10px rgba(0,0,0,0.8)', fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                MEJA #{currentTable.table_number}
              </Typography>
            </Box>
            <Typography variant="h1" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' }, lineHeight: 1.1, letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {currentTable.name}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Left: Table info */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: { xs: 2, md: 4 }, mb: { xs: 4, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 0 }, bgcolor: { xs: '#f8fafc', sm: 'transparent' }, borderRadius: 3, border: { xs: '1px solid', sm: 'none' }, borderColor: 'grey.100' }}>
                  <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, bgcolor: 'primary.50', color: 'primary.main' }}>
                    <Clock size={28} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.2, fontWeight: 600, letterSpacing: '0.05em' }}>TARIF PER JAM</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{currentTable.price_per_hour_formatted}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 0 }, bgcolor: { xs: '#f8fafc', sm: 'transparent' }, borderRadius: 3, border: { xs: '1px solid', sm: 'none' }, borderColor: 'grey.100' }}>
                  <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 3, bgcolor: 'grey.50', color: 'text.secondary', border: '1px solid', borderColor: 'grey.200' }}>
                    <Info size={28} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.2, fontWeight: 600, letterSpacing: '0.05em' }}>KONDISI MEJA</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Sangat Terawat</Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: { xs: '1rem', md: '1.1rem' }, mb: { xs: 4, md: 6 }, p: { xs: 2, md: 0 }, bgcolor: { xs: 'grey.50', md: 'transparent' }, borderRadius: 4 }}>
                {currentTable.description || 'Rasakan pengalaman bermain terbaik dengan meja billiard standar profesional yang dirawat secara rutin setiap hari. Sempurna untuk permainan kasual maupun turnamen.'}
              </Typography>
            </Box>

            {/* Schedule */}
            {currentTable.schedules && currentTable.schedules.length > 0 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                  Jadwal Operasional
                </Typography>
                <Grid container spacing={2}>
                  {currentTable.schedules.map((s) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={s.id}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: s.is_available ? 'grey.200' : 'grey.100',
                          bgcolor: s.is_available ? '#ffffff' : 'grey.50',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxShadow: s.is_available ? '0 4px 12px rgba(0,0,0,0.02)' : 'none'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, color: s.is_available ? 'text.primary' : 'text.disabled' }}>
                          {s.day_name}
                        </Typography>
                        {s.is_available ? (
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {s.open_time} - {s.close_time}
                          </Typography>
                        ) : (
                          <Chip label="Tutup" size="small" sx={{ height: 24, fontSize: '0.7rem', fontWeight: 700, color: 'text.disabled' }} />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Right: Booking form widget */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'grey.200',
                position: 'sticky',
                top: 100,
                boxShadow: '0 24px 48px -12px rgba(0,0,0,0.08)',
                bgcolor: '#ffffff'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Booking Meja Ini
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
                Pilih tanggal dan waktu bermain untuk mengamankan slot Anda hari ini juga.
              </Typography>

              {!token ? (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 3, border: '1px dashed', borderColor: 'grey.300' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                    Anda harus masuk terlebih dahulu untuk melakukan booking.
                  </Typography>
                  <Button variant="contained" size="large" onClick={() => navigate('/login')} sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}>
                    Masuk ke Akun
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                      Pilih Tanggal
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD/MM/YYYY"
                        minDate={dayjs()}
                        value={selectedDate ? dayjs(selectedDate) : null}
                        onChange={(newValue) => {
                          handleDateChange({ target: { value: newValue ? newValue.format('YYYY-MM-DD') : '' } });
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            placeholder: "Pilih tanggal main",
                            sx: { '& .MuiOutlinedInput-root': { borderRadius: 2 } }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>

                  {selectedDate && availability && (
                    <Box sx={{ mb: 3 }}>
                      {!availability.is_available ? (
                        <Alert severity="warning" sx={{ borderRadius: 2, fontWeight: 500 }}>
                          Meja sedang tidak tersedia pada hari ini.
                        </Alert>
                      ) : (
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                              Waktu Mulai
                            </Typography>
                            <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                              <Select
                                displayEmpty
                                value={selectedStartTime}
                                onChange={(e) => {
                                  setSelectedStartTime(e.target.value);
                                  setSelectedDuration(1);
                                }}
                                renderValue={(val) => val ? val : <em>Pilih Waktu</em>}
                              >
                                {availableSlots.map((slot) => (
                                  <MenuItem 
                                    key={slot.start_time} 
                                    value={slot.start_time}
                                    disabled={!slot.is_available}
                                  >
                                    {slot.start_time} {slot.is_available ? '' : '(Habis)'}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                              Durasi
                            </Typography>
                            <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                              <Select
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                                disabled={!selectedStartTime}
                              >
                                {Array.from({ length: maxDuration }, (_, i) => i + 1).map((num) => (
                                  <MenuItem key={num} value={num}>
                                    {num} Jam
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      )}
                    </Box>
                  )}

                  {selectedStartTime && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                        Catatan (Opsional)
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        placeholder="Ada permintaan khusus?"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Box>
                  )}

                  {selectedStartTime && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: 'grey.50',
                        mb: 3,
                        border: '1px solid',
                        borderColor: 'grey.100'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Durasi Sewa</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{totalHours} Jam</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Sesi Bermain</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {selectedStartTime} — {end_time_display}
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>Total Bayar</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}>
                          Rp {totalPrice.toLocaleString('id-ID')}
                        </Typography>
                      </Box>
                    </Paper>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!selectedStartTime}
                    onClick={() => setShowConfirm(true)}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 800,
                      boxShadow: 'none',
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': {
                        boxShadow: '0 12px 24px rgba(13, 150, 104, 0.2)',
                        bgcolor: 'primary.dark'
                      }
                    }}
                  >
                    {!selectedStartTime ? 'Lengkapi Formulir Dulu' : 'Konfirmasi & Lanjutkan'}
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Premium Confirm Dialog */}
        <Dialog
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Konfirmasi Pesanan</Typography>
            <IconButton onClick={() => setShowConfirm(false)} size="small" sx={{ color: 'text.secondary' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Meja</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{currentTable?.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Tanggal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Waktu Sesi</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {selectedStartTime} — {end_time_display}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Total Durasi</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{totalHours} Jam</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography sx={{ fontWeight: 800 }}>Total Tagihan</Typography>
                <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1.1rem' }}>
                  Rp {totalPrice.toLocaleString('id-ID')}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setShowConfirm(false)} sx={{ flex: 1, borderRadius: 2, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
              Ubah
            </Button>
            <Button
              variant="contained"
              onClick={handleBooking}
              disabled={bookingLoading}
              startIcon={bookingLoading ? null : <CheckCircle2 size={18} />}
              sx={{ 
                flex: 1.5,
                borderRadius: 2,
                fontWeight: 700,
                boxShadow: 'none',
              }}
            >
              {bookingLoading ? 'Memproses...' : 'Buat Pesanan'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
