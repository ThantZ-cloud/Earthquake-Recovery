import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { AdminPageHeader, AdminDataGrid, ConfirmDialog } from './components';
import { useAdminCrud } from './hooks';

const CITIES = [
  'Nay Pyi Taw', 'Yangon', 'Mandalay', 'Taunggyi', 'Bago', 'Sagaing',
  'Pathein', 'Mawlamyine', 'Myitkyina', 'Sittwe', 'Kalaymyo', 'Chauk',
  'Kyaukse', 'Amarapura', 'PyinOoLwin',
];

const EMPTY_FORM = { city: '', name: '', name_my: '', phone: '', sort_order: 0 };

export default function AdminPhones() {
  const {
    dialogOpen,
    editing,
    form,
    setForm,
    snack,
    deleting,
    setDeleting,
    submitting,
    openNew,
    openEdit,
    closeDialog,
    handleSave,
    handleDelete,
    clearSnack,
  } = useAdminCrud('emergency_phones', 'admin-phones', {
    initialForm: EMPTY_FORM,
    validateForm: (f) => Boolean(f.city && f.name && f.phone),
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-phones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergency_phones')
        .select('*')
        .order('city')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const columns = [
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'name', headerName: 'Name (EN)', flex: 1, minWidth: 180 },
    { field: 'name_my', headerName: 'Name (MY)', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'sort_order', headerName: 'Order', width: 80 },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <>
          <EditIcon
            fontSize="small"
            sx={{ cursor: 'pointer', mr: 1, color: 'action.active' }}
            onClick={() => openEdit(row, (r) => ({
              city: r.city,
              name: r.name,
              name_my: r.name_my || '',
              phone: r.phone,
              sort_order: r.sort_order,
            }))}
          />
          <DeleteIcon
            fontSize="small"
            sx={{ cursor: 'pointer', color: 'error.main' }}
            onClick={() => setDeleting(row)}
          />
        </>
      ),
    },
  ];

  return (
    <Box>
      <AdminPageHeader title="Emergency Phones" onAdd={openNew} addLabel="Add Contact" />

      <AdminDataGrid rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={dialogOpen} onClose={() => !submitting && closeDialog()} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Contact' : 'New Contact'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            select
            label="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            fullWidth
            size="small"
          >
            {CITIES.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Name (EN)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            size="small"
          />
          <TextField
            label="Name (MY)"
            value={form.name_my}
            onChange={(e) => setForm((f) => ({ ...f, name_my: e.target.value }))}
            fullWidth
            size="small"
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            fullWidth
            size="small"
          />
          <TextField
            label="Sort Order"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={clearSnack}>
        <Alert severity={snack?.type || 'info'} variant="filled">
          {snack?.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDelete(deleting.id)}
        title="Delete Contact"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        loading={submitting}
      />
    </Box>
  );
}
