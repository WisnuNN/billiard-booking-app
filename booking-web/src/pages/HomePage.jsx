import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Stack, Divider, alpha } from '@mui/material';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import PaymentTwoToneIcon from '@mui/icons-material/PaymentTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import FlashOnTwoToneIcon from '@mui/icons-material/FlashOnTwoTone';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import PhoneInTalkTwoToneIcon from '@mui/icons-material/PhoneInTalkTwoTone';
import { motion, useScroll, useTransform } from 'framer-motion';
import useAuthStore from '../stores/authStore';
import CircularGallery from '../components/organisms/CircularGallery';
import BilliardBg from '../assets/billiard-bg.jpg';

const features = [
  {
    icon: CalendarMonthTwoToneIcon,
    title: 'Real-time Availability',
    desc: 'Sistem terhubung langsung dengan ketersediaan meja. Tidak ada risiko double-booking.',
  },
  {
    icon: PaymentTwoToneIcon,
    title: 'Pembayaran Seamless',
    desc: 'Mendukung berbagai metode pembayaran digital untuk proses booking yang instan.',
  },
  {
    icon: ConfirmationNumberTwoToneIcon,
    title: 'E-Ticket Otomatis',
    desc: 'E-Ticket terbit langsung di akun Anda tanpa perlu konfirmasi admin.',
  },
];



export default function HomePage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);


  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ═══════════ HERO SECTION ═══════════ */}
      <Box
        ref={heroRef}
        sx={{
          pt: { xs: 10, md: 14 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          minHeight: { md: '92vh' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Parallax BG */}
        <Box
          component={motion.div}
          style={{ y: heroY, willChange: 'transform' }}
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${BilliardBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.6) 50%, rgba(13,150,104,0.15) 100%)',
            },
          }}
        />

        {/* Decorative grid pattern */}
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 1,
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div style={{ opacity: heroOpacity, willChange: 'opacity' }}>
            <Grid container spacing={6} alignItems="center">
              {/* Left */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 40 }}
                  style={{ willChange: 'transform, opacity' }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  sx={{ textAlign: { xs: 'center', md: 'left' } }}
                >
                  {/* Badge */}
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, scale: 0.9 }}
                    style={{ willChange: 'transform, opacity' }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 1,
                      bgcolor: 'rgba(13,150,104,0.15)', border: '1px solid rgba(13,150,104,0.25)',
                      px: 2, py: 0.8, mb: 3,
                    }}
                  >
                    <Box sx={{ width: 6, height: 6, bgcolor: '#0d9668', animation: 'pulse 2s infinite',
                      '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } }
                    }} />
                    <Typography variant="caption" sx={{ color: '#0d9668', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      Meja tersedia sekarang
                    </Typography>
                  </Box>

                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4rem' },
                      lineHeight: 1.05,
                      mb: 3,
                      color: '#ffffff',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Main Billiard,{' '}
                    <Box component="span" sx={{
                      color: 'transparent',
                      backgroundImage: 'linear-gradient(135deg, #0d9668 0%, #14b880 50%, #34d399 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                    }}>
                      Tanpa Ribet.
                    </Box>
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: 'rgba(255,255,255,0.55)',
                      fontWeight: 400,
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      mb: 5,
                      lineHeight: 1.8,
                      maxWidth: { xs: '100%', md: '85%' },
                    }}
                  >
                    Pilih meja, tentukan jadwal, langsung main. Sistem booking real-time yang memastikan meja favoritmu selalu siap saat kamu datang.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center" sx={{ width: '100%' }}>
                    <Button
                      fullWidth={true}
                      variant="contained"
                      size="large"
                      disableElevation
                      onClick={() => navigate('/tables')}
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={{
                        px: 4, py: 1.8, fontSize: '0.95rem', borderRadius: 0, fontWeight: 700,
                        bgcolor: 'primary.main', color: '#fff', textTransform: 'none',
                        position: 'relative', overflow: 'hidden',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&::after': {
                          content: '""', position: 'absolute', top: 0, left: '-100%',
                          width: '100%', height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover::after': { left: '100%' },
                      }}
                    >
                      Booking Sekarang
                    </Button>
                    {!token && (
                      <Button
                        fullWidth={true}
                        variant="text"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{
                          px: 3, py: 1.5, fontSize: '0.95rem', borderRadius: 0, fontWeight: 600,
                          color: 'rgba(255,255,255,0.7)', textTransform: 'none',
                          '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' },
                        }}
                      >
                        Buat Akun Gratis →
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Grid>

              {/* Right — Live Status Card */}
              <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'block', mt: { xs: 6, md: 0 } }}>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  style={{ willChange: 'transform, opacity' }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 0, width: '100%', maxWidth: 400, borderRadius: 0,
                      bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)', overflow: 'hidden',
                    }}
                  >
                    {/* Header bar */}
                    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 8, height: 8, bgcolor: '#22c55e', animation: 'pulse 2s infinite' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          Live Status
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                        Diperbarui otomatis
                      </Typography>
                    </Box>

                    {/* Table rows */}
                    <Stack spacing={0}>
                      {[
                        { num: '01', name: 'Meja VIP', type: 'Premium', price: 'Rp 150K/jam', status: 'Tersedia', available: true },
                        { num: '02', name: 'Meja Reguler', type: 'Standard', price: 'Rp 75K/jam', status: 'Sedang Dipakai', available: false },
                        { num: '03', name: 'Meja VIP', type: 'Premium', price: 'Rp 150K/jam', status: 'Tersedia', available: true },
                        { num: '04', name: 'Meja Reguler', type: 'Standard', price: 'Rp 75K/jam', status: 'Tersedia', available: true },
                      ].map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            px: 3, py: 2,
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            opacity: item.available ? 1 : 0.4,
                            transition: 'all 0.3s',
                            '&:hover': item.available ? { bgcolor: 'rgba(13,150,104,0.06)' } : {},
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace' }}>
                              {item.num}
                            </Typography>
                            <Box>
                              <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                                {item.name}
                              </Typography>
                              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 500 }}>
                                {item.price}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{
                            px: 1.5, py: 0.4,
                            bgcolor: item.available ? 'rgba(13,150,104,0.15)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid',
                            borderColor: item.available ? 'rgba(13,150,104,0.3)' : 'rgba(255,255,255,0.08)',
                          }}>
                            <Typography sx={{
                              fontSize: '0.6rem', fontWeight: 700, letterSpacing: 0.5,
                              color: item.available ? '#0d9668' : 'rgba(255,255,255,0.3)',
                              textTransform: 'uppercase',
                            }}>
                              {item.status}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    {/* Footer */}
                    <Box sx={{ px: 3, py: 2, bgcolor: 'rgba(13,150,104,0.06)', borderTop: '1px solid rgba(13,150,104,0.1)' }}>
                      <Button
                        fullWidth
                        size="small"
                        onClick={() => navigate('/tables')}
                        sx={{ color: '#0d9668', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', py: 0.5 }}
                      >
                        Lihat Semua Meja →
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>

        {/* Bottom fade */}
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to top, #f8fafc, transparent)',
          zIndex: 2,
        }} />
      </Box>


      {/* ═══════════ STATS SECTION ═══════════ */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              { value: '50', suffix: '+', label: 'Meja Tersedia', sublabel: 'Berbagai tipe & ukuran', icon: EmojiEventsTwoToneIcon, color: '#0d9668' },
              { value: '1.200', suffix: '+', label: 'Booking Selesai', sublabel: 'Dan terus bertambah', icon: GroupsTwoToneIcon, color: '#2563eb' },
              { value: '98', suffix: '%', label: 'Kepuasan Pelanggan', sublabel: 'Rating dari pengguna', icon: StarRoundedIcon, color: '#ea580c' },
            ].map((stat, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 4, border: '1px solid', borderColor: 'divider',
                      display: 'flex', alignItems: 'center', gap: 3,
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: stat.color, boxShadow: `0 8px 30px ${alpha(stat.color, 0.08)}` },
                    }}
                  >
                    <Box sx={{
                      width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: alpha(stat.color, 0.08), flexShrink: 0,
                    }}>
                      <stat.icon sx={{ fontSize: 24, color: stat.color }} />
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                        {stat.value}{stat.suffix}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {stat.sublabel}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            sx={{ mb: 8, maxWidth: 600 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
              KENAPA KAMI?
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'grey.900', fontSize: { xs: '1.8rem', md: '2.3rem' }, mb: 2, lineHeight: 1.2, textAlign: { xs: 'center', md: 'left' } }}>
              Fokus Bermain,{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>Biar Kami Urus</Box>{' '}
              Sisanya
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, textAlign: { xs: 'center', md: 'left' } }}>
              Sistem booking yang dibangun untuk pengalaman tanpa hambatan — dari pemesanan hingga bermain.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Grid size={{ xs: 12, md: 4 }} key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    style={{ height: '100%', willChange: 'transform, opacity' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4, height: '100%', borderRadius: 0, bgcolor: '#ffffff',
                        border: '1px solid', borderColor: 'grey.200',
                        position: 'relative', overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 12px 32px rgba(13, 150, 104, 0.08)',
                          transform: 'translateY(-4px)',
                          '& .feature-num': { color: 'primary.main' },
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{
                          width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: alpha('#0d9668', 0.08), border: '1px solid', borderColor: alpha('#0d9668', 0.15),
                        }}>
                          <Icon sx={{ fontSize: 22, color: '#0d9668' }} />
                        </Box>
                        <Typography className="feature-num" sx={{
                          fontWeight: 800, fontSize: '3rem', lineHeight: 1, color: 'grey.100',
                          transition: 'color 0.3s', fontFamily: 'monospace',
                        }}>
                          0{idx + 1}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'grey.900', fontSize: '1.05rem' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                        {feature.desc}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -30 }}
                style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
                  CARA KERJA
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '1.8rem', md: '2.3rem' }, lineHeight: 1.2, color: 'grey.900', textAlign: { xs: 'center', md: 'left' } }}>
                  3 Langkah Mudah Menuju Meja Billiard
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.8, textAlign: { xs: 'center', md: 'left' } }}>
                  Kami memangkas birokrasi pemesanan tradisional. Dari layar handphone hingga meja billiard — semuanya super efisien.
                </Typography>
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1.5,
                  color: 'grey.900', fontWeight: 600, py: 1.5, px: 2.5,
                  bgcolor: alpha('#0d9668', 0.06), border: '1px solid', borderColor: alpha('#0d9668', 0.15),
                }}>
                  <VerifiedUserTwoToneIcon sx={{ fontSize: 18, color: '#0d9668' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Transaksi 100% Aman & Terenkripsi
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={0}>
                {[
                  { num: '01', title: 'Registrasi & Login', desc: 'Buat akun gratis dalam hitungan detik. Data Anda tersimpan aman di sistem kami.', icon: GroupsTwoToneIcon },
                  { num: '02', title: 'Pilih Meja & Jadwal', desc: 'Cari meja yang sesuai dengan preferensi dan jam bermain Anda secara real-time.', icon: CalendarMonthTwoToneIcon },
                  { num: '03', title: 'Bayar & Main', desc: 'Lakukan pembayaran, E-Ticket langsung aktif. Tunjukkan saat kedatangan.', icon: FlashOnTwoToneIcon },
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 30 }}
                    style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                  >
                    <Box sx={{
                      display: 'flex', gap: 3, p: 3,
                      borderLeft: '2px solid',
                      borderColor: idx === 0 ? 'primary.main' : 'divider',
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: 'primary.main', bgcolor: alpha('#0d9668', 0.02) },
                    }}>
                      <Box sx={{
                        width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: alpha('#0d9668', 0.08), flexShrink: 0,
                      }}>
                        <step.icon sx={{ fontSize: 20, color: '#0d9668' }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'primary.main', fontFamily: 'monospace', letterSpacing: 1 }}>
                            {step.num}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'grey.900', fontSize: '1rem' }}>
                            {step.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {step.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ SNEAK PEEK VENUE (CIRCULAR GALLERY) ═══════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle glowing blob behind gallery */}
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '80%', height: '80%', bgcolor: 'primary.main', opacity: 0.05,
          filter: 'blur(100px)', borderRadius: '50%', zIndex: 0
        }} />

        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 1 }}>
              GALERI KAMI
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '2rem', md: '2.75rem' }, mb: 2 }}>
              Sneak Peek Venue
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
              Geser ke kiri atau kanan untuk menjelajahi meja billiard kelas premium dan suasana arena kami.
            </Typography>
          </Box>
        </Container>

        {/* Circular Gallery WebGL Component */}
        <Box sx={{ height: { xs: '450px', md: '600px' }, width: '100%', position: 'relative', zIndex: 1, '& canvas': { outline: 'none' } }}>
          <CircularGallery
            bend={1}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.05}
            font="bold 30px Orbitron"
            scrollSpeed={2}
            items={[
              { image: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Franz_Heinrich_001.jpg', text: 'Meja VIP' },
              { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Snooker_table_selby.JPG/960px-Snooker_table_selby.JPG', text: 'Lounge' },
              { image: 'https://upload.wikimedia.org/wikipedia/commons/0/09/EVD-billar-378.jpg', text: 'Lighting' },
              { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Niels_Feijen_NL.JPG/960px-Niels_Feijen_NL.JPG', text: 'Billiard' },
              { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Billiard_ball_comparison.jpg/960px-Billiard_ball_comparison.jpg', text: 'Tournament' }
            ]}
          />
        </Box>
      </Box>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', mb: 8 }}
          >
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, display: 'block', mb: 1.5 }}>
              TESTIMONI
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'grey.900', fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
              Kata Mereka
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                name: 'Rizky Pratama',
                role: 'Pemain Rutin',
                text: 'Dulu harus telepon dulu buat booking, sekarang tinggal klik. Meja langsung ready pas datang. Ga pernah lagi nunggu antrean.',
                rating: 5,
              },
              {
                name: 'Sarah Wijaya',
                role: 'Member VIP',
                text: 'Suka banget sama fitur pilih meja-nya. Bisa liat mana yang available real-time. UI-nya juga clean, gampang dipake.',
                rating: 5,
              },
              {
                name: 'Dimas Aditya',
                role: 'Weekend Player',
                text: 'Weekend biasanya rame banget, tapi sejak pake sistem booking ini selalu dapet meja. Worth it buat yang ga mau buang waktu.',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{ height: '100%', willChange: 'transform, opacity' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4, height: '100%', borderRadius: 0, bgcolor: '#fff',
                      border: '1px solid', borderColor: 'grey.200',
                      display: 'flex', flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' },
                    }}
                  >
                    {/* Stars */}
                    <Box sx={{ display: 'flex', gap: 0.3, mb: 3 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarRoundedIcon key={i} sx={{ fontSize: 18, color: '#F59E0B' }} />
                      ))}
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.8, mb: 3, flexGrow: 1, fontStyle: 'italic', fontWeight: 400 }}>
                      "{testimonial.text}"
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 36, height: 36, bgcolor: alpha('#0d9668', 0.1),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Typography sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.85rem' }}>
                          {testimonial.name.charAt(0)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <Box sx={{
        py: { xs: 8, md: 10 }, bgcolor: '#0f172a', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative */}
        <Box sx={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400,
          bgcolor: alpha('#0d9668', 0.05), transform: 'rotate(45deg)',
          display: { xs: 'none', md: 'block' }
        }} />
        <Box sx={{
          position: 'absolute', bottom: -80, left: -80, width: 300, height: 300,
          bgcolor: alpha('#0d9668', 0.03), transform: 'rotate(45deg)',
          display: { xs: 'none', md: 'block' }
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            style={{ willChange: 'transform, opacity' }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                Siap Tingkatkan{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>Pengalaman</Box>{' '}
                Bermain Anda?
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: { xs: 3, md: 4 }, lineHeight: 1.7, maxWidth: 600, mx: 'auto' }}>
                Jangan biarkan antrean mengganggu waktu bermain. Booking meja sekarang dan nikmati pengalaman billiard premium.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  disableElevation
                  onClick={() => navigate(token ? '/tables' : '/register')}
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  sx={{
                    bgcolor: 'primary.main', color: '#fff', px: 6, py: 1.5,
                    fontSize: '1rem', fontWeight: 700, borderRadius: 0, textTransform: 'none',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  {token ? 'Booking Meja Sekarang' : 'Daftar & Booking Sekarang'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
