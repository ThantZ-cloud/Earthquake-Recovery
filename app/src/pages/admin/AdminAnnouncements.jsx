import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Switch, FormControlLabel, Snackbar, Alert, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { AdminPageHeader, AdminDataGrid, ConfirmDialog } from './components';
import { useAdminCrud } from './hooks';

const SEVERITIES = ['info', 'warning', 'danger'];
const EMPTY_FORM = {
  title: '',
  title_my: '',
  body: '',
  body_my: '',
  severity: 'info',
  active: true,
  expires_at: '',
};

export default function AdminAnnouncements() {
  const { user } = useAuth();

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
  } = useAdminCrud('announcements', 'admin-announcements', {
    initialForm: EMPTY_FORM,
    validateForm: (f) => Boolean(f.title && f.body),
    transformPayload: (f) => ({
      ...f,
      expires_at: f.expires_at || null,
      created_by: user?.id,
    }),
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const columns = [
    { field: 'title', headerName: 'Title (EN)', flex: 1, minWidth: 180 },
    { field: 'title_my', headerName: 'Title (MY)', flex: 1, minWidth: 150 },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 110,
      renderCell: ({ row }) => {
        if (row.severity === 'danger') {
          return (
            <Chip
              label="⚠ DANGER"
              size="small"
              sx={{
                bgcolor: '#d32f2f',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          );
        }
        return <Chip label={row.severity} size="small" color={row.severity === 'warning' ? 'warning' : 'info'} />;
      },
    },
    { field: 'active', headerName: 'Active', width: 80, renderCell: ({ row }) => (row.active ? '✓' : '✗') },
    { field: 'created_at', headerName: 'Created', width: 140, valueGetter: (v) => new Date(v).toLocaleDateString() },
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
            onClick={() =>
              openEdit(row, (r) => ({
                title: r.title,
                title_my: r.title_my || '',
                body: r.body,
                body_my: r.body_my || '',
                severity: r.severity,
                active: r.active,
                expires_at: r.expires_at ? r.expires_at.slice(0, 16) : '',
              }))
            }
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
      <AdminPageHeader title="Announcements" onAdd={openNew} addLabel="New Announcement" />

      <AdminDataGrid rows={rows} columns={columns} loading={isLoading} pageSize={10} />

      <Dialog open={dialogOpen} onClose={() => !submitting && closeDialog()} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Title (EN)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Title (MY)"
            value={form.title_my}
            onChange={(e) => setForm((f) => ({ ...f, title_my: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Body (EN)"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Body (MY)"
            value={form.body_my}
            onChange={(e) => setForm((f) => ({ ...f, body_my: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select
              label="Severity"
              value={form.severity}
              onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
              size="small"
              sx={{ width: 160 }}
            >
              {SEVERITIES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Expires"
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              size="small"
              sx={{ width: 220 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : editing ? 'Update' : 'Create'}
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
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleting?.title}"? This action cannot be undone.`}
        loading={submitting}
      />
    </Box>
  );
}
