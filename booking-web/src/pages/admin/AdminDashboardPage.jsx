import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Chip,
  alpha,
  useTheme,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  TableBar as TableIcon,
  EventAvailable as EventIcon,
  Group as PeopleIcon,
  AccountBalanceWallet as MoneyIcon,
  EmojiEvents as TrophyIcon,
  ReceiptLong as ReceiptIcon,
  MonitorHeart as MonitorIcon,
  TrendingUp as TrendingIcon,
  CalendarMonth as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Circle as CircleIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { reportAPI } from '../../services/api';
import useTableStore from '../../stores/tableStore';
import useBookingStore from '../../stores/bookingStore';
import { useNavigate } from 'react-router-dom';

// Reusable Bento Cell wrapper
function BentoCell({ children, sx = {}, ...props }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.6),
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: '#ffffff',
        position: 'relative',
        '&:hover': {
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
          borderColor: alpha(theme.palette.primary.main, 0.15),
          transform: 'translateY(-2px)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}

// Animated number display
function AnimatedValue({ value, delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      sx={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {value}
    </Box>
  );
}

export default function AdminDashboardPage() {
  const theme = useTheme();
  const { tables, fetchTables } = useTableStore();
  const { bookings, fetchBookings } = useBookingStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bestsellers: [],
    overview: null,
    loading: true,
  });

  useEffect(() => {
    const loadDashboard = async () => {
      fetchTables({ limit: 100 });
      fetchBookings({ limit: 5 });
      
      try {
        const [bestRes, overviewRes] = await Promise.all([
          reportAPI.bestsellers({ limit: 5 }),
          reportAPI.overview()
        ]);
        setStats({ bestsellers: bestRes.data.data, overview: overviewRes.data.data, loading: false });
      } catch {
        setStats(s => ({ ...s, loading: false }));
      }
    };
    
    loadDashboard();
  }, [fetchTables, fetchBookings]);

  const availableTables = tables.filter(t => !t.is_occupied).length;
  const occupiedTables = tables.filter(t => t.is_occupied).length;
  const occupancyRate = tables.length ? Math.round((occupiedTables / tables.length) * 100) : 0;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Selamat Pagi' : currentHour < 17 ? 'Selamat Siang' : 'Selamat Malam';
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return theme.palette.warning.main;
      case 'confirmed': return theme.palette.info.main;
      case 'completed': return theme.palette.success.main;
      default: return theme.palette.error.main;
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-end' }, gap: { xs: 2, sm: 0 } }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
            {greeting} 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {today} — Dashboard Billiard Booking System
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          disableElevation
          onClick={() => navigate('/admin/reports')}
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{ 
            borderRadius: 0, 
            textTransform: 'none', 
            px: 3, 
            py: 1.2, 
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          Lihat Laporan
        </Button>
      </Box>

      {/* Bento Grid Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto',
          gap: 2.5,
        }}
      >
        {/* === ROW 1: 4 Stat Cards === */}
        
        {/* Total Meja */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' }, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TableIcon sx={{ color: 'primary.main', fontSize: 22 }} />
            </Box>
            <Chip 
              icon={<CircleIcon sx={{ fontSize: '8px !important', color: 'success.main' }} />}
              label="Aktif" 
              size="small" 
              sx={{ 
                borderRadius: 0, 
                bgcolor: alpha(theme.palette.success.main, 0.08),
                color: 'success.main',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 26,
                '& .MuiChip-icon': { ml: '4px' },
              }} 
            />
          </Box>
          <AnimatedValue delay={100} value={
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 0.5 }}>
              {tables.length || '-'}
            </Typography>
          } />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
            Total Meja
          </Typography>
        </BentoCell>

        {/* Booking Hari Ini */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' }, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarIcon sx={{ color: 'info.main', fontSize: 22 }} />
            </Box>
          </Box>
          <AnimatedValue delay={200} value={
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 0.5 }}>
              {stats.overview ? stats.overview.today_bookings : '-'}
            </Typography>
          } />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
            Booking Hari Ini
          </Typography>
        </BentoCell>

        {/* Pelanggan Aktif */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' }, p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PeopleIcon sx={{ color: 'warning.main', fontSize: 22 }} />
            </Box>
          </Box>
          <AnimatedValue delay={300} value={
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 0.5 }}>
              {stats.overview ? stats.overview.active_customers : '-'}
            </Typography>
          } />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
            Pelanggan Aktif
          </Typography>
        </BentoCell>

        {/* Pendapatan */}
        <BentoCell sx={{ 
          gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' }, 
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderColor: 'transparent',
          '&:hover': { 
            borderColor: 'transparent',
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{
              width: 44, height: 44, borderRadius: 0,
              bgcolor: alpha('#ffffff', 0.2),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MoneyIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box sx={{ 
              display: 'flex', alignItems: 'center', gap: 0.5, 
              bgcolor: alpha('#ffffff', 0.2), borderRadius: 0, px: 1, py: 0.3 
            }}>
              <TrendingIcon sx={{ color: '#fff', fontSize: 14 }} />
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, fontSize: '0.7rem' }}>Bulan ini</Typography>
            </Box>
          </Box>
          <AnimatedValue delay={400} value={
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', lineHeight: 1, mb: 0.5 }}>
              {stats.overview ? `Rp ${stats.overview.monthly_revenue.toLocaleString('id-ID')}` : '-'}
            </Typography>
          } />
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), fontWeight: 600, fontSize: '0.8rem' }}>
            Pendapatan
          </Typography>
        </BentoCell>

        {/* === ROW 2: Meja Paling Laris (big) + Status Meja + Quick Actions === */}

        {/* Meja Paling Laris — tall cell */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', lg: 'span 5' }, gridRow: { xs: 'auto', lg: 'span 2' }, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 0,
                background: `linear-gradient(135deg, ${alpha('#F59E0B', 0.15)} 0%, ${alpha('#F59E0B', 0.05)} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrophyIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 }}>
                  Meja Paling Laris
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Ranking berdasarkan jumlah booking
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, px: 3, pb: 3 }}>
            {stats.loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: 0 }} />
                ))}
              </Box>
            ) : stats.bestsellers.length > 0 ? (
              <List sx={{ p: 0 }}>
                {stats.bestsellers.map((item, index) => (
                  <Box key={index}>
                    <ListItem 
                      sx={{ 
                        px: 2, py: 1.5, borderRadius: 0, mx: -1,
                        transition: 'background 0.2s',
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 44 }}>
                        <Box sx={{ 
                          width: 32, height: 32, borderRadius: 0, 
                          bgcolor: index === 0 
                            ? alpha('#F59E0B', 0.12)
                            : index === 1 
                              ? alpha('#94A3B8', 0.12)
                              : alpha(theme.palette.primary.main, 0.08),
                          color: index === 0 
                            ? '#F59E0B'
                            : index === 1 
                              ? '#64748B'
                              : 'primary.main',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: 800, fontSize: '0.85rem',
                        }}>
                          {index + 1}
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
                            {item.table}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {item.type}
                          </Typography>
                        }
                      />
                      <Box sx={{ textAlign: 'right', ml: 'auto', flexShrink: 0 }}>
                        <Typography sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.9rem' }}>
                          {item.total_bookings}
                          <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, ml: 0.5 }}>
                            booking
                          </Typography>
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.75rem' }}>
                          Rp {item.total_revenue.toLocaleString('id-ID')}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < stats.bestsellers.length - 1 && (
                      <Divider sx={{ my: 0.5, mx: 1, borderColor: alpha(theme.palette.divider, 0.4) }} />
                    )}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 180, opacity: 0.35 }}>
                <TableIcon sx={{ fontSize: 48, mb: 1.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Belum ada data meja laris</Typography>
              </Box>
            )}
          </Box>
        </BentoCell>

        {/* Status Meja — Occupancy Card */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', lg: 'span 4' }, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SpeedIcon sx={{ color: 'info.main', fontSize: 20 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem' }}>
              Okupansi Meja
            </Typography>
          </Box>

          {/* Circular Progress Visual */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2.5, position: 'relative' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={120}
                thickness={4}
                sx={{ color: alpha(theme.palette.divider, 0.3), position: 'absolute' }}
              />
              <CircularProgress
                variant="determinate"
                value={occupancyRate}
                size={120}
                thickness={4}
                sx={{ 
                  color: occupancyRate > 75 ? 'error.main' : occupancyRate > 50 ? 'warning.main' : 'success.main',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                }}
              />
              <Box sx={{ 
                position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' 
              }}>
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {occupancyRate}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                  terpakai
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats row */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ 
              flex: 1, p: 1.5, borderRadius: 0, 
              bgcolor: alpha(theme.palette.success.main, 0.06),
              textAlign: 'center',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', lineHeight: 1 }}>
                {availableTables}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                Tersedia
              </Typography>
            </Box>
            <Box sx={{ 
              flex: 1, p: 1.5, borderRadius: 0, 
              bgcolor: alpha(theme.palette.error.main, 0.06),
              textAlign: 'center',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'error.main', lineHeight: 1 }}>
                {occupiedTables}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                Terpakai
              </Typography>
            </Box>
            <Box sx={{ 
              flex: 1, p: 1.5, borderRadius: 0, 
              bgcolor: alpha(theme.palette.info.main, 0.06),
              textAlign: 'center',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'info.main', lineHeight: 1 }}>
                {tables.length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                Total
              </Typography>
            </Box>
          </Box>
        </BentoCell>

        {/* Quick Actions */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 3' }, gridRow: { xs: 'auto', lg: 'span 2' }, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <EventIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem' }}>
              Aksi Cepat
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
            {[
              { 
                icon: <MonitorIcon sx={{ fontSize: 20 }} />, 
                label: 'Live Monitor', 
                desc: 'Pantau meja real-time', 
                path: '/admin/monitor',
                color: theme.palette.success.main,
                gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
              },
              { 
                icon: <EventIcon sx={{ fontSize: 20 }} />, 
                label: 'Kelola Booking', 
                desc: 'Atur & konfirmasi', 
                path: '/admin/bookings',
                color: theme.palette.info.main,
                gradient: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.08)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
              },
              { 
                icon: <TableIcon sx={{ fontSize: 20 }} />, 
                label: 'Kelola Meja', 
                desc: 'Tambah & edit meja', 
                path: '/admin/tables',
                color: theme.palette.primary.main,
                gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              },
              { 
                icon: <ReceiptIcon sx={{ fontSize: 20 }} />, 
                label: 'Laporan', 
                desc: 'Ringkasan keuangan', 
                path: '/admin/reports',
                color: theme.palette.warning.main,
                gradient: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.08)} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
              },
              { 
                icon: <ReceiptIcon sx={{ fontSize: 20 }} />, 
                label: 'Transaksi', 
                desc: 'Riwayat pembayaran', 
                path: '/admin/transactions',
                color: theme.palette.secondary.main,
                gradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              },
            ].map((action, i) => (
              <Box
                key={i}
                onClick={() => navigate(action.path)}
                sx={{
                  flex: 1,
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 1.5, borderRadius: 0,
                  background: action.gradient,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid transparent',
                  '&:hover': { 
                    border: `1px solid ${alpha(action.color, 0.2)}`,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{
                  width: 36, height: 36, borderRadius: 0,
                  bgcolor: alpha(action.color, 0.12),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: action.color,
                  flexShrink: 0,
                }}>
                  {action.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem', lineHeight: 1.2 }}>
                    {action.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 500 }}>
                    {action.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </BentoCell>

        {/* Ringkasan Summary Row */}
        <BentoCell sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', lg: 'span 4' }, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 0,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.15)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingIcon sx={{ color: 'success.main', fontSize: 20 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem' }}>
              Ringkasan Hari Ini
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
            {[
              { label: 'Total Meja', value: tables.length, icon: <TableIcon sx={{ fontSize: 16 }} />, color: theme.palette.primary.main },
              { label: 'Booking Hari Ini', value: stats.overview ? stats.overview.today_bookings : 0, icon: <CalendarIcon sx={{ fontSize: 16 }} />, color: theme.palette.info.main },
              { label: 'Pelanggan Aktif', value: stats.overview ? stats.overview.active_customers : 0, icon: <PeopleIcon sx={{ fontSize: 16 }} />, color: theme.palette.warning.main },
              { label: 'Tingkat Okupansi', value: `${occupancyRate}%`, icon: <SpeedIcon sx={{ fontSize: 16 }} />, color: occupancyRate > 75 ? theme.palette.error.main : theme.palette.success.main },
            ].map((item, i) => (
              <Box key={i} sx={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                py: 1.2, px: 1.5, borderRadius: 0,
                bgcolor: alpha(item.color, 0.04),
                transition: 'all 0.2s',
                '&:hover': { bgcolor: alpha(item.color, 0.08) },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: item.color, display: 'flex' }}>{item.icon}</Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.8rem' }}>
                    {item.label}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </BentoCell>

        {/* === ROW 3: Aktivitas Terakhir — Full Width === */}
        <BentoCell sx={{ gridColumn: 'span 12', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: 0,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ReceiptIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem', lineHeight: 1.2 }}>
                  Aktivitas Terakhir
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Booking dan transaksi terbaru
                </Typography>
              </Box>
            </Box>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/admin/bookings')}
              endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
              sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.8rem', borderRadius: 0 }}
            >
              Lihat Semua
            </Button>
          </Box>
          
          <Box sx={{ px: 3, pb: 3, flexGrow: 1 }}>
            {bookings && bookings.length > 0 ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 1.5,
              }}>
                {bookings.slice(0, 5).map((booking) => (
                  <Box
                    key={booking.id}
                    sx={{
                      p: 2, borderRadius: 0,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.5),
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        borderColor: alpha(theme.palette.primary.main, 0.15),
                      },
                    }}
                    onClick={() => navigate('/admin/bookings')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                          width: 38, height: 38, borderRadius: 0,
                          bgcolor: alpha(getStatusColor(booking.status), 0.1),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <EventIcon sx={{ fontSize: 18, color: getStatusColor(booking.status) }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.2 }}>
                            {booking.user?.name || 'Pelanggan'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {booking.table?.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={booking.status}
                        size="small"
                        sx={{
                          borderRadius: 0,
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          fontSize: '0.65rem',
                          height: 22,
                          bgcolor: alpha(getStatusColor(booking.status), 0.1),
                          color: getStatusColor(booking.status),
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                      <CalendarIcon sx={{ fontSize: 13 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                        {booking.booking_date} — {booking.start_time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: 0,
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2,
                }}>
                  <EventIcon sx={{ fontSize: 32, color: alpha(theme.palette.primary.main, 0.3) }} />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                  Belum Ada Aktivitas
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Booking dan transaksi terbaru akan muncul di sini.
                </Typography>
              </Box>
            )}
          </Box>
        </BentoCell>
      </Box>
    </Box>
  );
}
