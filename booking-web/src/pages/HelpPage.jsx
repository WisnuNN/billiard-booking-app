import { Box, Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded';

export default function HelpPage() {
  const faqs = [
    {
      q: 'Bagaimana alur pemesanan (booking) mejanya?',
      a: 'Gampang banget! Buka menu "Meja", pilih meja yang lagi kosong (Tersedia), lalu klik "Booking". Tentukan jam main dan berapa lama Anda mau sewa. Setelah itu, selesaikan pembayaran dan E-Ticket Anda otomatis terbit.'
    },
    {
      q: 'Bolehkah saya bayar tunai (cash) saat tiba di lokasi?',
      a: 'Tentu boleh. Anda bisa langsung datang ke kasir. Tapi ingat, kalau bayar di lokasi, meja belum "terkunci" untuk Anda sampai pembayarannya lunas. Kalau mau aman dan tidak takut diserobot orang, lebih baik booking dan bayar online saja.'
    },
    {
      q: 'Duh, saya mendadak ada urusan. Bisa batalin jadwal yang sudah dibayar?',
      a: 'Mohon maaf, jadwal yang sudah dipesan dan dibayar tidak bisa dibatalkan atau dikembalikan dananya (non-refundable). Pastikan jadwal Anda sudah fix sebelum menekan tombol bayar ya!'
    },
    {
      q: 'Waduh saya telat datang nih, sisa waktunya bisa diganti?',
      a: 'Waktu bermain Anda mutlak berjalan sesuai dengan jam booking di sistem, meskipun Anda terlambat datang. Jadi, usahakan datang 10-15 menit lebih awal agar waktu main Anda tidak terpotong.'
    },
    {
      q: 'Lupa password akun saya, gimana cara balikinnya?',
      a: 'Untuk saat ini, Anda bisa langsung menghubungi kasir atau admin kami melalui WhatsApp/langsung di venue. Mereka akan dengan senang hati mereset password akun Anda.'
    }
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 4, bgcolor: 'rgba(13,150,104,0.1)', mb: 3 }}>
            <HelpCenterRoundedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#0f172a', letterSpacing: '-1px' }}>
            Pusat Bantuan (FAQ)
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            Punya kebingungan seputar cara booking atau aturan main? Temukan semua jawabannya di bawah ini.
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ mt: 5 }}>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index}
              disableGutters 
              elevation={0} 
              sx={{ 
                border: '1px solid', 
                borderColor: 'rgba(148, 163, 184, 0.2)', 
                mb: 2, 
                borderRadius: '12px !important', 
                '&:before': { display: 'none' },
                boxShadow: '0 4px 12px -8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'rgba(13, 150, 104, 0.3)', boxShadow: '0 4px 12px -8px rgba(13, 150, 104, 0.15)' }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                sx={{ p: { xs: 2, sm: 3 } }}
              >
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 0 }}>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact CTA */}
        <Paper elevation={0} sx={{ mt: 6, p: 4, borderRadius: 6, bgcolor: '#0f172a', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1 }}>
            Masih butuh bantuan?
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
            Jangan ragu untuk bertanya langsung ke admin kasir kami.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
