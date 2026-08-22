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

export default function TableCard({ table, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const isList = viewMode === 'list';
  
  let displayImg = table.image_url;
  if (!displayImg || displayImg.length < 5) {
    if (table.type === 'vip') {
      displayImg = 'https://images.unsplash.com/photo-1628190395400-34863bc0d638?auto=format&fit=crop&w=1200&q=80'; // Elegant room
    } else if (table.type === 'premium') {
      displayImg = 'https://images.unsplash.com/photo-1549420687-32cc6ef1fcc4?auto=format&fit=crop&w=1200&q=80'; // Lounge
    } else {
      displayImg = 'https://images.unsplash.com/photo-1595333068695-1f6e1f0e4e5e?auto=format&fit=crop&w=1200&q=80'; // Standard Billiard
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        borderRadius: 4,
        bgcolor: '#ffffff',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: 'transparent',
        overflow: 'hidden',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 12px 32px -8px rgba(13,150,104,0.2)',
          transform: 'translateY(-6px)',
          '& .action-btn': {
            bgcolor: 'primary.main',
            color: '#fff',
            borderColor: 'primary.main',
          },
          '& .card-image': {
            transform: 'scale(1.05)',
          }
        },
      }}
      onClick={() => navigate(`/tables/${table.id}`)}
    >
      {/* Premium Image Header */}
      <Box sx={{ position: 'relative', height: { xs: isList ? 'auto' : 180, md: isList ? '100%' : 180 }, minHeight: { xs: isList ? 140 : 180, md: 180 }, width: { xs: isList ? '35%' : '100%', md: isList ? '35%' : '100%' }, overflow: 'hidden', bgcolor: 'grey.100', flexShrink: 0 }}>
        <Box
          className="card-image"
          component="img"
          src={displayImg}
          alt={table.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)' }} />
        
        {/* Type Badge Floating */}
        <Chip
          label={(typeLabels[table.type] || table.type).toUpperCase()}
          size="small"
          sx={{ 
            position: 'absolute', 
            top: { xs: isList ? 8 : 16, md: 16 }, 
            right: { xs: isList ? 8 : 16, md: 16 }, 
            fontWeight: 800, 
            height: { xs: isList ? 20 : 24, md: 24 }, 
            px: { xs: isList ? 0.5 : 1, md: 1 }, 
            fontSize: { xs: isList ? '0.6rem' : '0.7rem', md: '0.7rem' },
            letterSpacing: '0.05em',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            bgcolor: table.type === 'vip' ? '#ef4444' : table.type === 'premium' ? 'primary.main' : '#ffffff',
            color: table.type === 'vip' || table.type === 'premium' ? '#ffffff' : '#0f172a',
          }}
        />
        
        {/* Table Number Floating */}
        <Typography 
          variant="subtitle2" 
          sx={{ 
            position: 'absolute', 
            bottom: { xs: isList ? 8 : 16, md: 16 }, 
            left: { xs: isList ? 12 : 20, md: 20 }, 
            color: '#fff', 
            fontWeight: 800, 
            letterSpacing: '0.08em',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: isList ? '0.65rem' : '0.8rem', md: '0.8rem' }
          }}
        >
          MEJA #{table.table_number}
        </Typography>
      </Box>

      <Box sx={{ p: isList ? { xs: 1.5, sm: 2, md: 3 } : { xs: 2.5, sm: 3 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isList ? 'center' : 'flex-start' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, lineHeight: 1.2, letterSpacing: '-0.02em', fontSize: isList ? { xs: '1.1rem', md: '1.4rem' } : '1.4rem' }}>
          {table.name}
        </Typography>
        
        <Box sx={{ display: isList ? { xs: 'none', md: 'block' } : 'block' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: { xs: 1.5, sm: 3 },
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
              fontSize: { xs: '0.8rem', md: '0.875rem' }
            }}
          >
            {table.description || 'Meja billiard berkualitas tinggi dengan perawatan rutin untuk pengalaman bermain terbaik Anda.'}
          </Typography>

          <Box sx={{ p: { xs: 1.2, sm: 2 }, borderRadius: 3, bgcolor: '#f8fafc', mb: { xs: 1.5, sm: 3 } }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Clock size={18} color="#0d9668" />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Tarif: <Box component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>{table.price_per_hour_formatted}</Box> / Jam
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle2 size={18} color="#0d9668" />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                Peralatan Lengkap & Terawat
              </Typography>
            </Box>
          </Stack>
        </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: { xs: isList ? 0 : 2, md: isList ? 0 : 2 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: isList ? 'none' : '1px solid', borderColor: 'grey.100' }}>
          <Box sx={{ display: isList ? { xs: 'block', md: 'none' } : 'none', mr: 1, minWidth: 80 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0, fontSize: '0.65rem' }}>Tarif/jam</Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 800, fontSize: '0.8rem' }}>{table.price_per_hour_formatted}</Typography>
          </Box>
          <Button
            className="action-btn"
            fullWidth={!isList}
            variant="outlined"
            endIcon={<ArrowRight size={16} />}
            sx={{ 
              borderRadius: 3,
              py: isList ? { xs: 0.8, md: 1.2 } : 1.2,
              px: isList ? { xs: 1.5, md: 2 } : 0,
              flex: isList ? { xs: 1, md: 1 } : 1,
              whiteSpace: 'nowrap',
              fontWeight: 700,
              borderWidth: 2,
              color: 'primary.main',
              borderColor: 'primary.main',
              transition: 'all 0.2s ease',
              fontSize: isList ? { xs: '0.75rem', md: '0.875rem' } : '0.875rem',
              '&:hover': { 
                borderWidth: 2,
                bgcolor: 'primary.main',
                color: '#fff'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tables/${table.id}`);
            }}
          >
            {isList ? <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Lihat & Booking</Box> : 'Lihat & Booking'}
            {isList && <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Booking</Box>}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
