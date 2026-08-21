import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { reportAPI } from '../../services/api';

export default function AdminReportsPage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [busiest, setBusiest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const [bestRes, busyRes] = await Promise.all([
          reportAPI.bestsellers({ limit: 10 }),
          reportAPI.busiestSchedules({ limit: 10 })
        ]);
        setBestsellers(bestRes.data.data);
        setBusiest(busyRes.data.data);
      } catch (error) {
        console.error('Error fetching reports', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Laporan & Statistik</Typography>
        <Typography variant="body2" color="text.secondary">Analisis performa bisnis billiard Anda.</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 0, border: '1px solid', borderColor: 'divider', borderTop: '4px solid #0f172a' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Meja Paling Laris</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama Meja</TableCell>
                      <TableCell align="center">Total Booking</TableCell>
                      <TableCell align="right">Pendapatan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bestsellers.length === 0 ? (
                      <TableRow><TableCell colSpan={3} align="center">Belum ada data.</TableCell></TableRow>
                    ) : (
                      bestsellers.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontWeight: 500 }}>{item.table}</TableCell>
                          <TableCell align="center">{item.total_bookings}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            Rp {item.total_revenue.toLocaleString('id-ID')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 0, border: '1px solid', borderColor: 'divider', borderTop: '4px solid #0f172a' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Waktu Tersibuk</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hari</TableCell>
                      <TableCell>Jam Mulai</TableCell>
                      <TableCell align="right">Total Booking</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {busiest.length === 0 ? (
                      <TableRow><TableCell colSpan={3} align="center">Belum ada data.</TableCell></TableRow>
                    ) : (
                      busiest.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontWeight: 500 }}>{item.day_name}</TableCell>
                          <TableCell>{item.start_time}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'inline-block', bgcolor: 'primary.main', color: '#fff', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600, fontSize: '0.75rem' }}>
                              {item.total_bookings}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
