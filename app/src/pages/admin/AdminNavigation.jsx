import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Typography,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { AdminPageHeader, AdminDataGrid } from './components';
import { useLang } from '../../i18n';

export default function AdminNavigation() {
  const { lang, t } = useLang();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-nav-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nav_items')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      label_en: row.label_en,
      label_my: row.label_my || '',
      enabled: row.enabled,
      sort_order: row.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('nav_items')
        .update({
          label_en: form.label_en,
          label_my: form.label_my,
          enabled: form.enabled,
          sort_order: form.sort_order,
        })
        .eq('id', editing.id);

      if (error) {
        setSnack({ type: 'error', message: error.message || 'Failed to save' });
        return;
      }

      setSnack({ type: 'success', message: 'Updated successfully' });
      setDialogOpen(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['admin-nav-items'] });
      queryClient.invalidateQueries({ queryKey: ['nav-items'] });
    } catch (err) {
      setSnack({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (row) => {
    const { error } = await supabase
      .from('nav_items')
      .update({ enabled: !row.enabled })
      .eq('id', row.id);

    if (error) {
      setSnack({ type: 'error', message: error.message || 'Failed to toggle' });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['admin-nav-items'] });
    queryClient.invalidateQueries({ queryKey: ['nav-items'] });
  };

  const handleMove = async (row, direction) => {
    const newOrder = row.sort_order + direction;
    if (newOrder < 0) return;

    const { error } = await supabase
      .from('nav_items')
      .update({ sort_order: newOrder })
      .eq('id', row.id);

    if (error) {
      setSnack({ type: 'error', message: error.message || 'Failed to reorder' });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['admin-nav-items'] });
    queryClient.invalidateQueries({ queryKey: ['nav-items'] });
  };

  const columns = [
    {
      field: 'sort_order',
      headerName: '',
      width: 40,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton size="small" onClick={() => handleMove(row, -1)} disabled={row.sort_order === 0}>
            <DragIndicatorIcon sx={{ transform: 'rotate(180deg)', fontSize: 16 }} />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'label_en',
      headerName: 'Label (EN)',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Typography fontWeight={600} fontSize="0.85rem">{row.label_en}</Typography>
      ),
    },
    {
      field: 'label_my',
      headerName: 'Label (MY)',
      flex: 1,
      minWidth: 120,
      renderCell: ({ row }) => (
        <Typography fontSize="0.85rem">{row.label_my || '—'}</Typography>
      ),
    },
    {
      field: 'path',
      headerName: 'Path',
      width: 110,
      renderCell: ({ row }) => (
        <Chip label={row.path} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }} />
      ),
    },
    {
      field: 'enabled',
      headerName: 'Status',
      width: 110,
      renderCell: ({ row }) => (
        <Chip
          label={row.enabled ? 'Open' : 'Closed'}
          size="small"
          color={row.enabled ? 'success' : 'default'}
          onClick={() => handleToggle(row)}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 50,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <EditIcon
          fontSize="small"
          sx={{ cursor: 'pointer', color: 'action.active' }}
          onClick={() => handleEdit(row)}
        />
      ),
    },
  ];

  return (
    <Box>
      <AdminPageHeader title="Navigation Tabs" />

      <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
        Control which navigation tabs are visible to all users. Disabled tabs redirect visitors to the home page.
      </Alert>

      <AdminDataGrid rows={rows} columns={columns} loading={isLoading} pageSize={10} />

      <Dialog open={dialogOpen} onClose={() => !submitting && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Navigation Tab</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Label (EN)"
            value={form.label_en || ''}
            onChange={(e) => setForm((f) => ({ ...f, label_en: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Label (MY)"
            value={form.label_my || ''}
            onChange={(e) => setForm((f) => ({ ...f, label_my: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Sort Order"
            type="number"
            value={form.sort_order ?? 0}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            fullWidth
            size="small"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.enabled ?? true}
                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
              />
            }
            label="Enabled (visible to users)"
          />
          <Typography variant="caption" color="text.secondary">
            Path: <strong>{editing?.path}</strong> — cannot be changed
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack?.type || 'info'} variant="filled">
          {snack?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
