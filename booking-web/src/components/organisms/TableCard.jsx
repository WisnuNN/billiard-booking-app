import { Card, Box, Typography, Button, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

const typeLabels = {
  standard: 'Standard',
  vip: 'VIP',
  premium: 'Premium',
  regular: 'Regular',
};

const typeColors = {
  standard: 'default',
  vip: 'error',
  premium: 'primary',
  regular: 'default',
};

export default function TableCard({ table }) {
  const navigate = useNavigate();
  
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'grey.200',
        bgcolor: '#ffffff',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 12px 32px -8px rgba(13,150,104,0.15)',
          transform: 'translateY(-4px)',
          '& .action-btn': {
            bgcolor: 'primary.main',
            color: '#fff',
          }
        },
      }}
      onClick={() => navigate(`/tables/${table.id}`)}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 0.5, display: 'block' }}>
              Meja #{table.table_number}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: 'text.primary', lineHeight: 1.2 }}>
              {table.name}
            </Typography>
          </Box>
          <Chip
            label={typeLabels[table.type] || table.type}
            size="small"
            color={typeColors[table.type] || 'default'}
            sx={{ fontWeight: 600, height: 24, fontSize: '0.7rem' }}
          />
        </Box>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: { xs: 2, sm: 3 },
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
          }}
        >
          {table.description || 'Meja billiard berkualitas tinggi dengan perawatan rutin untuk pengalaman bermain terbaik Anda.'}
        </Typography>

        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.100', mb: { xs: 2, sm: 3 } }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Clock size={16} color="#64748b" />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Tarif: <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>{table.price_per_hour_formatted}</Box> / Jam
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle2 size={16} color="#0d9668" />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Peralatan Lengkap & Terawat
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Button
          className="action-btn"
          fullWidth
          variant="outlined"
          endIcon={<ArrowRight size={18} />}
          sx={{ 
            borderRadius: 2,
            py: 1,
            fontWeight: 600,
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tables/${table.id}`);
          }}
        >
          Lihat & Booking
        </Button>
      </Box>
    </Card>
  );
}
