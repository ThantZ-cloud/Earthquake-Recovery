import { useState, useCallback } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, MenuItem, Snackbar, Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';

const CITIES = [
  'Nay Pyi Taw', 'Yangon', 'Mandalay', 'Taunggyi', 'Bago', 'Sagaing',
  'Pathein', 'Mawlamyine', 'Myitkyina', 'Sittwe', 'Kalaymyo', 'Chauk',
  'Kyaukse', 'Amarapura', 'PyinOoLwin',
];

const EMPTY = { city: '', name: '', name_my: '', phone: '', sort_order: 0 };

export default function AdminPhones() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [snack, setSnack] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-phones'],
    queryFn: async () => {
      const { data } = await supabase.from('emergency_phones').select('*').order('city').order('sort_order');
      return data || [];
    },
  });

  const openNew = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (row) => { setEditing(row); setForm({ city: row.city, name: row.name, name_my: row.name_my || '', phone: row.phone, sort_order: row.sort_order }); setDialogOpen(true); };

  const handleSave = useCallback(async () => {
    if (!form.city || !form.name || !form.phone) return;
    if (editing) {
      const { error } = await supabase.from('emergency_phones').update(form).eq('id', editing.id);
      if (error) { setSnack('error'); return; }
    } else {
      const { error } = await supabase.from('emergency_phones').insert(form);
      if (error) { setSnack('error'); return; }
    }
    setSnack('success');
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['admin-phones'] });
  }, [form, editing, queryClient]);

  const handleDelete = useCallback(async (id) => {
    await supabase.from('emergency_phones').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['admin-phones'] });
  }, [queryClient]);

  const columns = [
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'name', headerName: 'Name (EN)', flex: 1, minWidth: 180 },
    { field: 'name_my', headerName: 'Name (MY)', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    { field: 'sort_order', headerName: 'Order', width: 80 },
    {
      field: 'actions', headerName: '', width: 120, sortable: false, filterable: false,
      renderCell: ({ row }) => (
        <>
          <IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleting(row)}><DeleteIcon fontSize="small" /></IconButton>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Emergency Phones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Contact</Button>
      </Box>
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Contact' : 'New Contact'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField select label="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} fullWidth size="small">
            {CITIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="Name (EN)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth size="small" />
          <TextField label="Name (MY)" value={form.name_my} onChange={(e) => setForm((f) => ({ ...f, name_my: e.target.value }))} fullWidth size="small" />
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} fullWidth size="small" />
          <TextField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} fullWidth size="small" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editing ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack === 'success' ? 'success' : 'error'} variant="filled">{snack === 'success' ? 'Saved' : 'Error'}</Alert>
      </Snackbar>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{deleting?.name}&rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => { handleDelete(deleting.id); setDeleting(null); }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
