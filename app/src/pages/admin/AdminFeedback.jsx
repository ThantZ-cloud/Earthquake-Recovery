import { Box, Rating, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { AdminPageHeader, AdminDataGrid, ConfirmDialog } from './components';
import { useAdminDelete } from './hooks';

export default function AdminFeedback() {
  const queryClient = useQueryClient();

  const { deleting, setDeleting, snack, clearSnack, submitting, handleDelete } = useAdminDelete('feedback', 'admin-feedback');

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, rating, comment, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDeleteFeedback = async (id) => {
    const ok = await handleDelete(id);
    if (ok) {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    }
  };

  const columns = [
    { field: 'user_id', headerName: 'User ID', flex: 1, minWidth: 200, valueGetter: (v) => v?.slice(0, 8) + '…' },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 180,
      renderCell: ({ row }) => <Rating value={row.rating} readOnly size="small" />,
    },
    { field: 'comment', headerName: 'Comment', flex: 2, minWidth: 200 },
    { field: 'created_at', headerName: 'Date', width: 180, valueGetter: (v) => new Date(v).toLocaleDateString() },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <DeleteIcon
          fontSize="small"
          sx={{ cursor: 'pointer', color: 'error.main' }}
          onClick={() => setDeleting(row)}
        />
      ),
    },
  ];

  return (
    <Box>
      <AdminPageHeader title="Feedback" />

      <AdminDataGrid rows={rows} columns={columns} loading={isLoading} pageSize={10} />

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={clearSnack}>
        <Alert severity={snack?.type || 'info'} variant="filled">
          {snack?.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => handleDeleteFeedback(deleting.id)}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        loading={submitting}
      />
    </Box>
  );
}
