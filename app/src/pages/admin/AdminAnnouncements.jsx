import { useState, useCallback } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, MenuItem, Switch, FormControlLabel, Snackbar, Alert, Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const SEVERITIES = ['info', 'warning', 'danger'];
const EMPTY = { title: '', title_my: '', body: '', body_my: '', severity: 'info', active: true, expires_at: '' };

export default function AdminAnnouncements() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [snack, setSnack] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const openNew = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title, title_my: row.title_my || '', body: row.body, body_my: row.body_my || '',
      severity: row.severity, active: row.active,
      expires_at: row.expires_at ? row.expires_at.slice(0, 16) : '',
    });
    setDialogOpen(true);
  };

  const handleSave = useCallback(async () => {
    if (!form.title || !form.body) return;
    const payload = {
      ...form,
      expires_at: form.expires_at || null,
      created_by: user?.id,
    };
    if (editing) {
      const { error } = await supabase.from('announcements').update(payload).eq('id', editing.id);
      if (error) { setSnack('error'); return; }
    } else {
      const { error } = await supabase.from('announcements').insert(payload);
      if (error) { setSnack('error'); return; }
    }
    setSnack('success');
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
  }, [form, editing, user, queryClient]);

  const handleDelete = useCallback(async (id) => {
    await supabase.from('announcements').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
  }, [queryClient]);

  const columns = [
    { field: 'title', headerName: 'Title (EN)', flex: 1, minWidth: 180 },
    { field: 'title_my', headerName: 'Title (MY)', flex: 1, minWidth: 150 },
    {
      field: 'severity', headerName: 'Severity', width: 110,
      renderCell: ({ row }) => (
        <Chip label={row.severity} size="small" color={row.severity === 'danger' ? 'error' : row.severity === 'warning' ? 'warning' : 'info'} />
      ),
    },
    { field: 'active', headerName: 'Active', width: 80, renderCell: ({ row }) => row.active ? '✓' : '✗' },
    { field: 'created_at', headerName: 'Created', width: 140, valueGetter: (v) => new Date(v).toLocaleDateString() },
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
        <Typography variant="h5" fontWeight={700}>Announcements</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>New Announcement</Button>
      </Box>
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Title (EN)" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} fullWidth />
          <TextField label="Title (MY)" value={form.title_my} onChange={(e) => setForm((f) => ({ ...f, title_my: e.target.value }))} fullWidth />
          <TextField label="Body (EN)" value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} fullWidth multiline rows={3} />
          <TextField label="Body (MY)" value={form.body_my} onChange={(e) => setForm((f) => ({ ...f, body_my: e.target.value }))} fullWidth multiline rows={3} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField select label="Severity" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))} size="small" sx={{ width: 160 }}>
              {SEVERITIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField label="Expires" type="datetime-local" value={form.expires_at} onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))} size="small" sx={{ width: 220 }} slotProps={{ inputLabel: { shrink: true } }} />
            <FormControlLabel control={<Switch checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />} label="Active" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack === 'success' ? 'success' : 'error'} variant="filled">{snack === 'success' ? 'Saved' : 'Error'}</Alert>
      </Snackbar>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &ldquo;{deleting?.title}&rdquo;? This action cannot be undone.
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
