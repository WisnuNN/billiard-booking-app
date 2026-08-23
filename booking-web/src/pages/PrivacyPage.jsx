import { Box, Container, Typography, Paper, Divider, Stack } from '@mui/material';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded';
import BuildCircleRoundedIcon from '@mui/icons-material/BuildCircleRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';

export default function PrivacyPage() {
  const policies = [
    {
      icon: <DatasetRoundedIcon color="primary" />,
      title: 'Data yang Kami Kumpulkan',
      content: 'Saat Anda mendaftar atau memesan meja, kami hanya meminta informasi penting seperti nama, nomor WhatsApp/telepon, dan email. Kami tidak pernah meminta data sensitif di luar kebutuhan reservasi.'
    },
    {
      icon: <BuildCircleRoundedIcon color="primary" />,
      title: 'Untuk Apa Data Anda Digunakan?',
      content: 'Data Anda murni digunakan untuk kelancaran operasional. Misalnya untuk mengirim e-ticket (struk booking), konfirmasi pembayaran, serta menghubungi Anda jika ada penyesuaian jadwal mendadak dari pihak venue.'
    },
    {
      icon: <SecurityRoundedIcon color="primary" />,
      title: 'Jaminan Keamanan Data',
      content: 'Privasi Anda adalah prioritas absolut kami. Semua data kata sandi (password) dienkripsi secara ketat. Kami berjanji tidak akan menjual, menyewakan, atau menukar data pribadi Anda dengan pihak ketiga manapun.'
    },
    {
      icon: <ManageAccountsRoundedIcon color="primary" />,
      title: 'Hak Kendali Akun',
      content: 'Anda punya kendali penuh atas akun Anda. Anda berhak meminta penghapusan akun beserta riwayat data Anda kapan saja. Cukup hubungi admin kami melalui WhatsApp atau langsung di meja kasir.'
    }
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#0f172a', letterSpacing: '-1px' }}>
            Kebijakan Privasi
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 600, mx: 'auto', lineHeight: 1.7 }}>
            Kami sangat menghargai privasi Anda. Berikut adalah komitmen transparansi kami tentang bagaimana data Anda dikelola dan dilindungi.
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
            {policies.map((item, index) => (
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
                {index < policies.length - 1 && (
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
