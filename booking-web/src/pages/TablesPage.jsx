import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Card,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import IconSearch from '../assets/icons/icon_search_read.png';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import useTableStore from '../stores/tableStore';
import TableCard from '../components/organisms/TableCard';
import EmptyState from '../components/molecules/EmptyState';
import TableBarOutlinedIcon from '@mui/icons-material/TableBarOutlined';

export default function TablesPage() {
  const { tables, meta, isLoading, fetchTables } = useTableStore();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchTables({ search: search || undefined, type: type || undefined, page, limit: 12 });
  }, [search, type, page, fetchTables]);

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: 3 }}>
      <Container maxWidth="lg">
        {/* Premium Header */}
        <Box 
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.03em', color: 'text.primary', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Pilih <Box component="span" sx={{ color: 'primary.main' }}>Meja Billiard</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: 600 }}>
            Temukan meja terbaik untuk permainan Anda hari ini. Pilih tipe meja yang sesuai dengan kebutuhan Anda dan lakukan booking dengan cepat.
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1.5, md: 2 }, 
          mb: { xs: 4, md: 6 }, 
          p: 1.5,
          bgcolor: '#ffffff',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, width: '100%' }}>
            <Box component="img" src={IconSearch} alt="Search" sx={{ width: 22, height: 22, opacity: 0.6, filter: 'brightness(0)', ml: 1, mr: 1 }} />
            <TextField
              placeholder="Cari meja billiard..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              size="small"
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { border: 'none', '& fieldset': { border: 'none' } } }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '1px' }, height: { xs: '1px', md: 'auto' }, bgcolor: 'divider', my: { xs: 0, md: 1 } }} />
          <FormControl size="small" sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 200 }, '& .MuiOutlinedInput-root': { border: 'none', '& fieldset': { border: 'none' } } }}>
            <Select
              value={type}
              displayEmpty
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              sx={{ color: type ? 'text.primary' : 'text.secondary', fontWeight: 500 }}
            >
              <MenuItem value="">Semua Tipe Meja</MenuItem>
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ width: { xs: '100%', md: '1px' }, height: { xs: '1px', md: 'auto' }, bgcolor: 'divider', my: { xs: 0, md: 1 } }} />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => val && setViewMode(val)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 2,
                color: 'text.secondary',
                '&.Mui-selected': { bgcolor: 'primary.50', color: 'primary.main' }
              }
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Grid */}
        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid size={viewMode === 'grid' ? { xs: 12, sm: 6, md: 4 } : { xs: 12 }} key={i}>
                <Card sx={{ borderRadius: '16px', overflow: 'hidden', display: viewMode === 'list' ? 'flex' : 'block' }}>
                  <Skeleton variant="rectangular" height={140} />
                  <Box sx={{ p: 2.5 }}>
                    <Skeleton width="60%" height={28} />
                    <Skeleton width="90%" sx={{ mt: 1 }} />
                    <Skeleton width="40%" sx={{ mt: 1 }} />
                    <Skeleton height={40} sx={{ mt: 2, borderRadius: '10px' }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : tables.length === 0 ? (
          <EmptyState
            icon={TableBarOutlinedIcon}
            title="Tidak ada meja ditemukan"
            description="Coba ubah filter pencarian Anda atau hapus kata kunci."
          />
        ) : (
          <>
            <Grid container spacing={3}>
              {tables.map((table) => (
                <Grid size={viewMode === 'grid' ? { xs: 12, sm: 6, md: 4 } : { xs: 12 }} key={table.id}>
                  <TableCard table={table} viewMode={viewMode} />
                </Grid>
              ))}
            </Grid>

            {meta && meta.last_page > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={meta.last_page}
                  page={meta.current_page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
