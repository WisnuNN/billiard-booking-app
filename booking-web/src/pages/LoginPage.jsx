import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, InputAdornment, IconButton, Divider } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useAuthStore from '../stores/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>
          Email
        </Typography>
        <TextField
          fullWidth
          placeholder="nama@email.com"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1, display: 'block' }}>
          Kata Sandi
        </Typography>
        <TextField
          fullWidth
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'text.secondary' }}>
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          endIcon={!isLoading && <ArrowForwardIcon />}
          sx={{ 
            mb: 3, 
            py: 1.8,
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: 0.5,
          }}
        >
          {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
        </Button>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', px: 2, fontWeight: 600 }}>ATAU</Typography>
      </Divider>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Belum punya akun?{' '}
        <Typography
          component={Link}
          to="/register"
          variant="body2"
          sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          Daftar Sekarang
        </Typography>
      </Typography>
    </Box>
  );
}
