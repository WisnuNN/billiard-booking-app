import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, useTheme, alpha
} from '@mui/material';
import IconEdit from '../../assets/icons/icon_edit_update.png';
import IconDelete from '../../assets/icons/icon_delete_remove.png';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { transactionAPI, bookingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/atoms/StatusBadge';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';

export default function AdminTransactionsPage() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [statusForm, setStatusForm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchTransactions = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await transactionAPI.getAll({ page: p, limit: 15 });
      setTransactions(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error('Gagal memuat transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const handleEditClick = (tx) => {
    setSelectedTx(tx);
    setStatusForm(tx.payment_status);
    setEditDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTx) return;
    try {
      await transactionAPI.update(selectedTx.id, { payment_status: statusForm });
      toast.success('Status transaksi diperbarui');
      setEditDialog(false);
      fetchTransactions(page);
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleMarkAsPaid = async (tx) => {
    try {
      await transactionAPI.update(tx.id, { payment_status: 'paid' });
      toast.success('Pembayaran berhasil diterima!');
      fetchTransactions(page);
    } catch (error) {
      toast.error('Gagal memproses pembayaran');
    }
  };

  const handleDeleteClick = (tx) => {
    setSelectedTx(tx);
    setDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedTx) return;
    setDeleting(true);
    try {
      await bookingAPI.delete(selectedTx.booking_id);
      toast.success('Transaksi beserta riwayat booking berhasil dihapus');
      setDeleteDialog(false);
      fetchTransactions(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus transaksi');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Daftar Transaksi</Typography>
        <Typography variant="body2" color="text.secondary">Kelola pembayaran dari pelanggan.</Typography>
      </Box>

      {/* Desktop Table */}
      <TableContainer component={Paper} elevation={0} sx={{ display: { xs: 'none', md: 'block' }, border: '1px solid', borderColor: 'divider', borderRadius: 0, borderTop: '4px solid #0f172a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Transaksi</TableCell>
              <TableCell>Pelanggan</TableCell>
              <TableCell>Nominal</TableCell>
              <TableCell>Tanggal Bayar</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Memuat...</TableCell></TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Belum ada transaksi.</TableCell>
              </TableRow>
            ) : (
              transactions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 600 }}>TRX-{row.id}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>
                      {row.booking?.notes?.startsWith('Walk-in: ') 
                        ? row.booking.notes.replace('Walk-in: ', '') 
                        : row.booking?.user?.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{row.amount_formatted}</TableCell>
                  <TableCell>
                    {row.paid_at ? new Date(row.paid_at).toLocaleDateString('id-ID') : '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.payment_status} />
                  </TableCell>
                  <TableCell align="right">
                    {row.payment_status === 'unpaid' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleMarkAsPaid(row)}
                        sx={{ mr: 1, textTransform: 'none', borderRadius: 0 }}
                      >
                        Bayar
                      </Button>
                    )}
                    <IconButton size="small" color="info" onClick={() => handleEditClick(row)}>
                      <img src={IconEdit} style={{ width: 20, height: 20 }} alt="Edit" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(row)}>
                      <img src={IconDelete} style={{ width: 20, height: 20 }} alt="Delete" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card Layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography color="text.secondary">Memuat...</Typography>
          </Paper>
        ) : transactions.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography color="text.secondary">Belum ada transaksi.</Typography>
          </Paper>
        ) : (
          transactions.map((row) => (
            <Card key={row.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: alpha('#94a3b8', 0.3) }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'text.primary', mb: 0.5 }}>TRX-{row.id}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {row.booking?.notes?.startsWith('Walk-in: ') 
                        ? row.booking.notes.replace('Walk-in: ', '') 
                        : row.booking?.user?.name}
                    </Typography>
                  </Box>
                  <StatusBadge status={row.payment_status} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Tanggal</Typography>
                  <Typography variant="body2" fontWeight={700}>{row.paid_at ? new Date(row.paid_at).toLocaleDateString('id-ID') : '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Nominal</Typography>
                  <Typography variant="body1" fontWeight={800} color="primary.main">{row.amount_formatted}</Typography>
                </Box>
                
                {row.payment_status === 'unpaid' && (
                  <Button fullWidth variant="contained" color="success" size="small" onClick={() => handleMarkAsPaid(row)} startIcon={<CheckCircleIcon />} sx={{ borderRadius: 2, py: 1, fontWeight: 700, mb: 1.5 }}>
                    Tandai Lunas
                  </Button>
                )}
                <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: '1px dashed', borderColor: alpha('#94a3b8', 0.3) }}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => handleEditClick(row)} startIcon={<img src={IconEdit} style={{ width: 16 }} alt="Edit" />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                    Edit
                  </Button>
                  <Button fullWidth variant="outlined" color="error" size="small" onClick={() => handleDeleteClick(row)} startIcon={<img src={IconDelete} style={{ width: 16 }} alt="Delete" />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                    Hapus
                  </Button>
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

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Status Pembayaran</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusForm}
              label="Status"
              onChange={(e) => setStatusForm(e.target.value)}
            >
              <MenuItem value="unpaid">Belum Bayar (Unpaid)</MenuItem>
              <MenuItem value="paid">Lunas (Paid)</MenuItem>
              <MenuItem value="refunded">Refund</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Batal</Button>
          <Button onClick={handleUpdateStatus} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Hapus Riwayat Transaksi?"
        description="Apakah Anda yakin ingin menghapus transaksi ini? Data ini dan histori booking terkait akan terhapus secara permanen."
        confirmLabel="Ya, Hapus"
        confirmColor="error"
        loading={deleting}
      />
    </Box>
  );
}
