import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, FormControlLabel, Switch, Grid, TablePagination,
  Card, CardContent, useTheme, alpha
} from '@mui/material';
import IconAdd from '../../assets/icons/icon_add_create.png';
import IconEdit from '../../assets/icons/icon_edit_update.png';
import IconDelete from '../../assets/icons/icon_delete_remove.png';
import useTableStore from '../../stores/tableStore';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/molecules/ConfirmDialog';

export default function AdminTablesPage() {
  const theme = useTheme();
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Kelola Meja Billiard</Typography>
        <Button variant="contained" startIcon={<img src={IconAdd} style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }} alt="Add" />} onClick={() => handleOpenForm()}>
          Tambah Meja
        </Button>
      </Box>

      {/* Desktop Table */}
      <TableContainer component={Paper} elevation={0} sx={{ display: { xs: 'none', md: 'block' }, border: '1px solid', borderColor: 'divider', borderRadius: 0, borderTop: '4px solid #0f172a' }}>
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

      {/* Mobile Card Layout */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {tables.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Typography color="text.secondary">Belum ada data meja.</Typography>
          </Paper>
        ) : (
          tables.map((row) => (
            <Card key={row.id} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: alpha('#94a3b8', 0.3) }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: 'text.primary', mb: 0.5 }}>Meja #{row.table_number}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{row.name}</Typography>
                  </Box>
                  <Box sx={{ px: 1.5, py: 0.75, borderRadius: '100px', bgcolor: row.is_active ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1) }}>
                    <Typography sx={{ color: row.is_active ? 'success.main' : 'error.main', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {row.is_active ? 'Aktif' : 'Nonaktif'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Tipe Meja</Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.type}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>Tarif / Jam</Typography>
                  <Typography variant="body1" fontWeight={800} color="primary.main">{row.price_per_hour_formatted}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1.5, pt: 2, borderTop: '1px dashed', borderColor: alpha('#94a3b8', 0.3) }}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => handleOpenForm(row)} startIcon={<img src={IconEdit} style={{ width: 16 }} alt="Edit" />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                    Edit
                  </Button>
                  <Button fullWidth variant="outlined" color="error" size="small" onClick={() => handleDeleteClick(row.id)} startIcon={<img src={IconDelete} style={{ width: 16 }} alt="Delete" />} sx={{ borderRadius: 2, py: 1, fontWeight: 700 }}>
                    Hapus
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
        {meta && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', bgcolor: '#fff', borderRadius: 3, border: '1px solid', borderColor: alpha('#94a3b8', 0.3) }}>
            <TablePagination
              component="div"
              count={meta.total || 0}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15, 25]}
              labelRowsPerPage="Per halaman:"
              sx={{ '.MuiTablePagination-toolbar': { px: 2 } }}
            />
          </Box>
        )}
      </Box>

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
