import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an <AuthProvider>. Wrap your component tree with <AuthProvider> in App.jsx or main.jsx.'
    );
  }

  return context;
}

export default useAuth;
