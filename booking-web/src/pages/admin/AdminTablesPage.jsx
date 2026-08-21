import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControlLabel, Switch, Grid, TablePagination
} from '@mui/material';
import IconAdd from '../../assets/icons/icon_add_create.png';
import IconEdit from '../../assets/icons/icon_edit_update.png';
import IconDelete from '../../assets/icons/icon_delete_remove.png';
import useTableStore from '../../stores/tableStore';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';

export default function AdminTablesPage() {
  const { tables, meta, fetchTables, createTable, updateTable, deleteTable, isLoading } = useTableStore();
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  const [form, setForm] = useState({
    table_number: '',
    name: '',
    type: 'standard',
    price_per_hour: '',
    description: '',
    is_active: true,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchTables({ page: page + 1, limit: rowsPerPage });
  }, [fetchTables, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenForm = (table = null) => {
    if (table) {
      setEditingId(table.id);
      setForm({
        table_number: table.table_number,
        name: table.name,
        type: table.type,
        price_per_hour: table.price_per_hour,
        description: table.description || '',
        is_active: table.is_active,
      });
    } else {
      setEditingId(null);
      setForm({
        table_number: '',
        name: '',
        type: 'standard',
        price_per_hour: '',
        description: '',
        is_active: true,
      });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price_per_hour: parseFloat(form.price_per_hour) };
    
    let result;
    if (editingId) {
      result = await updateTable(editingId, payload);
    } else {
      result = await createTable(payload);
    }

    if (result.success) {
      toast.success(result.message);
      handleCloseForm();
      fetchTables({ page: page + 1, limit: rowsPerPage });
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    const result = await deleteTable(deletingId);
    if (result.success) {
      toast.success('Meja berhasil dihapus');
      fetchTables({ page: page + 1, limit: rowsPerPage });
    } else {
      toast.error(result.message || 'Gagal menghapus meja');
    }
    setOpenDelete(false);
    setDeletingId(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Kelola Meja Billiard</Typography>
        <Button variant="contained" startIcon={<img src={IconAdd} style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }} alt="Add" />} onClick={() => handleOpenForm()}>
          Tambah Meja
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 0, borderTop: '4px solid #0f172a' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nomor / Nama</TableCell>
              <TableCell>Tipe</TableCell>
              <TableCell>Harga/Jam</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Belum ada data meja.</TableCell>
              </TableRow>
            ) : (
              tables.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>Meja #{row.table_number}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{row.type}</TableCell>
                  <TableCell>{row.price_per_hour_formatted}</TableCell>
                  <TableCell>
                    <Typography sx={{ color: row.is_active ? 'success.main' : 'error.main', fontWeight: 600, fontSize: '0.85rem' }}>
                      {row.is_active ? 'Aktif' : 'Nonaktif'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenForm(row)} color="info">
                      <img src={IconEdit} style={{ width: 20, height: 20 }} alt="Edit" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteClick(row.id)} color="error">
                      <img src={IconDelete} style={{ width: 20, height: 20 }} alt="Delete" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {meta && (
          <TablePagination
            component="div"
            count={meta.total || 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 25]}
            labelRowsPerPage="Baris per halaman:"
          />
        )}
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingId ? 'Edit Meja' : 'Tambah Meja Baru'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nomor Meja"
                  value={form.table_number}
                  onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nama Meja"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Tipe Meja"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  margin="normal"
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Harga per Jam"
                  value={form.price_per_hour}
                  onChange={(e) => setForm({ ...form, price_per_hour: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Deskripsi"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Status Aktif"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Batal</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Hapus Meja"
        description="Yakin ingin menghapus meja ini? Semua data jadwal terkait juga mungkin terpengaruh."
        confirmColor="error"
      />
    </Box>
  );
}
