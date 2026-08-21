import { useContext } from 'react';
import BookingContext from '../context/BookingContext';

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error(
      'useBooking must be used within a <BookingProvider>. Wrap your component tree with <BookingProvider> in App.jsx or main.jsx.'
    );
  }

  return context;
}

export default useBooking;
