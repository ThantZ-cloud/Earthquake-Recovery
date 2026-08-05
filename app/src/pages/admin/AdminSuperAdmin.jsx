import { useState, useCallback } from 'react';
import { Box, Typography, Snackbar, Alert, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShieldIcon from '@mui/icons-material/Shield';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { AdminPageHeader, AdminDataGrid } from './components';
import EditAdminCredentialsDialog from './components/EditAdminCredentialsDialog';

export default function AdminSuperAdmin() {
  const queryClient = useQueryClient();

  const [editDialog, setEditDialog] = useState({ open: false, admin: null });
  const [submitting, setSubmitting] = useState(false);
  const [snack, setSnack] = useState(null);
  const [error, setError] = useState(null);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['super-admin-list'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, role')
        .in('role', ['admin', 'super_admin']);

      if (profilesError) throw profilesError;

      const { data: emails } = await supabase.rpc('get_admin_emails');
      const emailMap = {};
      (emails || []).forEach((row) => {
        emailMap[row.user_id] = row.email;
      });

      return (profiles || []).map((p) => ({
        id: p.id,
        role: p.role,
        email: emailMap[p.id] || '••••••••',
      }));
    },
  });

  const handleEdit = useCallback((row) => {
    setError(null);
    setEditDialog({ open: true, admin: row });
  }, []);

  const handleCloseDialog = useCallback(() => {
    setEditDialog({ open: false, admin: null });
    setError(null);
  }, []);

  const handleSubmitCredentials = useCallback(async ({ userId, newEmail, newPassword }) => {
    setSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId, newEmail, newPassword }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update credentials');
      }

      setSnack({ type: 'success', message: 'Credentials updated successfully' });
      handleCloseDialog();
      queryClient.invalidateQueries({ queryKey: ['super-admin-list'] });
    } catch (err) {
      console.error('[SuperAdmin] Update error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [handleCloseDialog, queryClient]);

  const columns = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: ({ row }) => (
        <Chip
          label={row.role}
          color={row.role === 'super_admin' ? 'secondary' : 'primary'}
          size="small"
          icon={row.role === 'super_admin' ? <ShieldIcon /> : undefined}
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
        >
          <EditIcon fontSize="small" sx={{ color: 'action.active' }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <AdminPageHeader title="Super Admin — Admin Management" />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Manage admin accounts. Change email and password for admin users.
      </Typography>

      <AdminDataGrid rows={admins} columns={columns} loading={isLoading} />

      <EditAdminCredentialsDialog
        open={editDialog.open}
        onClose={handleCloseDialog}
        admin={editDialog.admin}
        onSubmit={handleSubmitCredentials}
        submitting={submitting}
        error={error}
      />

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack?.type || 'info'} variant="filled">
          {snack?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
