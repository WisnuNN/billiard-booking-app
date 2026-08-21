import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useAuthStore from '../stores/authStore';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) return null;

  const fields = [
    { icon: PersonOutlineIcon, label: 'Nama', value: user.name },
    { icon: EmailOutlinedIcon, label: 'Email', value: user.email },
    { icon: PhoneOutlinedIcon, label: 'Telepon', value: user.phone || '-' },
    { icon: BadgeOutlinedIcon, label: 'Role', value: user.role },
    {
      icon: CalendarTodayIcon,
      label: 'Bergabung',
      value: new Date(user.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      }),
    },
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: 3 }}>
      <Container maxWidth="sm">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>
          Profil Saya
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {/* Avatar header */}
          <Box
            sx={{
              py: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #0d9668 0%, #047857 100%)',
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '2rem',
                fontWeight: 800,
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)',
                mb: 2,
              }}
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Chip
              label={user.role === 'admin' ? 'Administrator' : 'Customer'}
              size="small"
              sx={{
                mt: 1,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </Box>

          {/* Fields */}
          <Box sx={{ p: 3 }}>
            {fields.map((field, i) => {
              const Icon = field.icon;
              return (
                <Box key={i}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        bgcolor: 'grey.50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {field.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {field.value}
                      </Typography>
                    </Box>
                  </Box>
                  {i < fields.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
