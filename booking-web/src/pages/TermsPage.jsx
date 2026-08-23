import { Box, Container, Typography, Paper, Divider, Stack } from '@mui/material';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';

export default function TermsPage() {
  const terms = [
    {
      icon: <GavelRoundedIcon color="primary" />,
      title: 'Ketentuan Umum',
      content: 'Dengan menggunakan layanan Baccarat Billiard & Lounge, Anda dianggap telah membaca, memahami, dan menyetujui seluruh aturan yang berlaku di area kami. Aturan ini dibuat demi kenyamanan dan keamanan bersama.'
    },
    {
      icon: <EventAvailableRoundedIcon color="primary" />,
      title: 'Aturan Reservasi & Pembayaran',
      content: 'Semua pemesanan (booking) meja bersifat final setelah pembayaran terkonfirmasi. Kami tidak melayani pembatalan sepihak atau pengembalian dana (refund) untuk jadwal yang sudah di-booking.'
    },
    {
      icon: <AccessTimeFilledRoundedIcon color="primary" />,
      title: 'Kebijakan Keterlambatan',
      content: 'Waktu bermain Anda dihitung mutlak berdasarkan jadwal booking. Jika Anda datang terlambat, sisa waktu bermain tidak akan diperpanjang atau diganti. Mohon hadir 10 menit lebih awal untuk persiapan.'
    },
    {
      icon: <PolicyRoundedIcon color="primary" />,
      title: 'Tata Tertib Area Bermain',
      content: 'Pengunjung wajib menjaga seluruh fasilitas (stik, bola, laken meja). Segala bentuk kerusakan akibat kelalaian atau kesengajaan akan dikenakan biaya ganti rugi penuh sesuai dengan harga pasar barang tersebut.'
    }
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#0f172a', letterSpacing: '-1px' }}>
            Syarat & Ketentuan
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
            Harap baca dengan teliti aturan main dan reservasi di Baccarat Billiard & Lounge agar pengalaman bermain Anda maksimal.
          </Typography>
        </Box>

        {/* Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 6, 
            border: '1px solid', 
            borderColor: 'rgba(148, 163, 184, 0.2)',
            bgcolor: '#ffffff',
            boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', mb: 4, fontWeight: 600, letterSpacing: 0.5 }}>
            UPDATE TERAKHIR: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
          </Typography>
          
          <Stack spacing={5}>
            {terms.map((item, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Box sx={{ 
                    width: 40, height: 40, borderRadius: 3, 
                    bgcolor: 'rgba(13,150,104,0.1)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, pl: { xs: 0, sm: 7 } }}>
                  {item.content}
                </Typography>
                {index < terms.length - 1 && (
                  <Divider sx={{ mt: 5, ml: { xs: 0, sm: 7 }, borderColor: 'rgba(148, 163, 184, 0.15)' }} />
                )}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
