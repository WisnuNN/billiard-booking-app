import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, InputAdornment, IconButton, Divider, Stack } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useAuthStore from '../stores/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const result = await register(form);
    if (result.success) {
      navigate('/');
    } else if (result.errors) {
      setFieldErrors(result.errors);
    }
  };

  const getError = (field) => fieldErrors[field]?.[0] || '';

  const labelSx = { color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, mb: 0.75, display: 'block', fontSize: '0.7rem' };

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="caption" sx={labelSx}>Nama Lengkap</Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              error={!!getError('name')}
              helperText={getError('name')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Nomor Telepon</Typography>
            <TextField
              fullWidth
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              error={!!getError('phone')}
              helperText={getError('phone')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Email</Typography>
            <TextField
              fullWidth
              placeholder="admin@billiard.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              error={!!getError('email')}
              helperText={getError('email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Kata Sandi</Typography>
            <TextField
              fullWidth
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              error={!!getError('password')}
              helperText={getError('password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'text.secondary' }}>
                      {showPassword ? <VisibilityOffIcon sx={{ fontSize: 16 }} /> : <VisibilityIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={labelSx}>Konfirmasi Sandi</Typography>
            <TextField
              fullWidth
              placeholder="Ulangi kata sandi"
              type="password"
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          endIcon={!isLoading && <ArrowForwardIcon />}
          sx={{ 
            mt: 4,
            mb: 3, 
            py: 1.8,
            fontWeight: 800,
            fontSize: '0.95rem',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {isLoading ? 'Memproses...' : 'Buat Akun'}
        </Button>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', px: 2, fontWeight: 700, fontSize: '0.7rem', letterSpacing: 1 }}>ATAU</Typography>
      </Divider>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.9rem' }}>
        Sudah punya akun?{' '}
        <Typography
          component={Link}
          to="/login"
          variant="body2"
          sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem', '&:hover': { textDecoration: 'underline' } }}
        >
          Masuk di sini
        </Typography>
      </Typography>
    </Box>
  );
}
