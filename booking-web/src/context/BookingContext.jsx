import { createContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingAPI } from '../services/api';
import useAuthStore from '../stores/authStore';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [durationHours, setDurationHours] = useState(1);
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(() => {
    if (!selectedTable) return 0;
    const pricePerHour = Number(selectedTable.price_per_hour || selectedTable.harga_per_jam || 0);
    return pricePerHour * durationHours;
  }, [selectedTable, durationHours]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const totalPrice = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const selectTable = (table) => {
    setSelectedTable(table);
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BACCARAT10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      toast.success('Kode promo BACCARAT10 berhasil dipasang! (Diskon 10%)');
      return true;
    } else if (cleanCode === 'VIP20' && selectedTable?.category === 'VIP') {
      setPromoCode(cleanCode);
      setDiscountPercent(20);
      toast.success('Kode promo VIP20 berhasil dipasang! (Diskon 20%)');
      return true;
    } else {
      toast.error('Kode promo tidak valid atau tidak berlaku untuk meja ini.');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    toast.success('Kode promo dilepas.');
  };

  const resetBookingDraft = () => {
    setSelectedTable(null);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setStartTime('14:00');
    setDurationHours(1);
    setNotes('');
    setPromoCode('');
    setDiscountPercent(0);
    setActiveStep(0);
    setIsSubmitting(false);
  };

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => Math.max(0, prev - 1));
  const goToStep = (step) => setActiveStep(step);

  const submitBooking = async () => {
    if (!selectedTable) {
      toast.error('Silakan pilih meja terlebih dahulu.');
      return { success: false };
    }

    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk melakukan reservasi.');
      navigate('/login', { state: { from: `/tables/${selectedTable.id}` } });
      return { success: false };
    }

    setIsSubmitting(true);
    try {
      const payload = {
        table_id: selectedTable.id,
        booking_date: bookingDate,
        start_time: startTime,
        duration_hours: Number(durationHours),
        notes: notes,
        promo_code: promoCode || null,
      };

      const { data } = await bookingAPI.create(payload);
      toast.success('Reservasi meja berhasil dibuat!');
      
      const newBookingId = data.data?.id || data.id;
      resetBookingDraft();
      
      if (newBookingId) {
        navigate(`/bookings/${newBookingId}`);
      } else {
        navigate('/bookings');
      }

      return { success: true, data: data.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal membuat reservasi meja.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    selectedTable,
    bookingDate,
    startTime,
    durationHours,
    notes,
    promoCode,
    discountPercent,
    discountAmount,
    subtotal,
    totalPrice,
    activeStep,
    isSubmitting,
    selectTable,
    setBookingDate,
    setStartTime,
    setDurationHours,
    setNotes,
    applyPromoCode,
    removePromoCode,
    resetBookingDraft,
    nextStep,
    prevStep,
    goToStep,
    submitBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export default BookingContext;
