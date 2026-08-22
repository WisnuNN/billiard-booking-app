import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Pagination, Tooltip, Chip,
  Card, CardContent, useTheme, alpha, Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import IconDownload from '../../assets/icons/icon_download.png';
import useBookingStore from '../../stores/bookingStore';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/atoms/StatusBadge';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';
import ReceiptModal from '../../components/molecules/ReceiptModal';

export default function AdminBookingsPage() {
  const theme = useTheme();
  const { bookings, meta, fetchBookings, confirmBooking, completeBooking } = useBookingStore();
  const [page, setPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null, action: null });
  const [receiptModal, setReceiptModal] = useState({ open: false, booking: null });

  useEffect(() => {
    fetchBookings({ page, limit: 15, exclude_walk_in: true });
  }, [page, fetchBookings]);

  const handleActionClick = (id, action) => {
    setConfirmDialog({ open: true, id, action });
  };

  const processAction = async () => {
    const { id, action } = confirmDialog;
    setConfirmDialog({ open: false, id: null, action: null });
    
    let result;
    if (action === 'confirm') {
      result = await confirmBooking(id);
    } else if (action === 'complete') {
      result = await completeBooking(id);
    }

    if (result && result.success) {
      toast.success(result.message);
      fetchBookings({ page, limit: 15, exclude_walk_in: true }); // Refresh
    } else if (result) {
      toast.error(result.message);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Kelola Booking</Typography>
        <Typography variant="body2" color="text.secondary">Konfirmasi dan selesaikan booking pelanggan.</Typography>
      </Box>

      {/* Desktop Table */}
      <TableContainer component={Paper} elevation={0} sx={{ display: { xs: 'none', md: 'block' }, border: '1px solid', borderColor: 'divider', borderRadius: 0, borderTop: '4px solid #0f172a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Pelanggan</TableCell>
              <TableCell>Meja</TableCell>
              <TableCell>Waktu</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Belum ada booking.</TableCell>
              </TableRow>
            ) : (
              bookings.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 600 }}>#{row.id}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{row.user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.user?.email}</Typography>
                  </TableCell>
                  <TableCell>{row.table?.name}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.85rem' }}>{row.booking_date}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.start_time} - {row.end_time}</Typography>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    {row.status === 'pending' && (
                      <Tooltip title="Konfirmasi Booking">
                        <IconButton size="small" color="primary" onClick={() => handleActionClick(row.id, 'confirm')}>
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {(row.status === 'pending' || row.status === 'confirmed') && (
                      <Tooltip title="Selesaikan Booking">
                        <IconButton size="small" color="success" onClick={() => handleActionClick(row.id, 'complete')}>
                          <DoneAllIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {row.transaction?.payment_status === 'paid' && (
                      <Tooltip title="Cetak Struk">
                        <IconButton size="small" color="info" onClick={() => setReceiptModal({ open: true, booking: row })}>
                          <img src={IconDownload} style={{ width: 20, height: 20 }} alt="Cetak" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card Layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {bookings.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography color="text.secondary">Belum ada booking.</Typography>
          </Paper>
        ) : (
          bookings.map((row) => (
            <Card key={row.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: alpha('#94a3b8', 0.3) }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'text.primary', mb: 0.5 }}>Booking #{row.id}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{row.table?.name}</Typography>
                  </Box>
                  <StatusBadge status={row.status} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Pelanggan</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={700}>{row.user?.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{row.user?.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Waktu</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={700}>{row.booking_date}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{row.start_time} - {row.end_time}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: '1px dashed', borderColor: alpha('#94a3b8', 0.3), flexWrap: 'wrap' }}>
                  {row.status === 'pending' && (
                    <Button fullWidth variant="outlined" size="small" onClick={() => handleActionClick(row.id, 'confirm')} startIcon={<CheckCircleIcon />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                      Konfirmasi
                    </Button>
                  )}
                  {(row.status === 'pending' || row.status === 'confirmed') && (
                    <Button fullWidth variant="outlined" color="success" size="small" onClick={() => handleActionClick(row.id, 'complete')} startIcon={<DoneAllIcon />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                      Selesai
                    </Button>
                  )}
                  {row.transaction?.payment_status === 'paid' && (
                    <Button fullWidth variant="outlined" color="info" size="small" onClick={() => setReceiptModal({ open: true, booking: row })} startIcon={<img src={IconDownload} style={{ width: 16 }} alt="Cetak" />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                      Struk
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {meta && meta.last_page > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={meta.last_page} page={meta.current_page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null, action: null })}
        onConfirm={processAction}
        title={confirmDialog.action === 'confirm' ? 'Konfirmasi Booking?' : 'Selesaikan Booking?'}
        description={`Anda yakin ingin ${confirmDialog.action === 'confirm' ? 'mengkonfirmasi' : 'menyelesaikan'} booking ini?`}
      />

      <ReceiptModal 
        open={receiptModal.open} 
        onClose={() => setReceiptModal({ open: false, booking: null })} 
        booking={receiptModal.booking} 
      />
    </Box>
  );
}
