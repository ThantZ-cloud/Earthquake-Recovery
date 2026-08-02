import { useState, useCallback } from 'react';
import {
  Box, Typography, IconButton, Snackbar, Alert, Rating,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';

export default function AdminFeedback() {
  const queryClient = useQueryClient();
  const [snack, setSnack] = useState(null);
  const [deleting, setDeleting] = useState(null);

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

  const handleDelete = useCallback(async (id) => {
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) { setSnack('error'); return; }
    setSnack('success');
    queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  }, [queryClient]);

  const columns = [
    { field: 'user_id', headerName: 'User ID', flex: 1, minWidth: 200, valueGetter: (v) => v?.slice(0, 8) + '…' },
    {
      field: 'rating', headerName: 'Rating', width: 180,
      renderCell: ({ row }) => <Rating value={row.rating} readOnly size="small" />,
    },
    { field: 'comment', headerName: 'Comment', flex: 2, minWidth: 200 },
    { field: 'created_at', headerName: 'Date', width: 180, valueGetter: (v) => new Date(v).toLocaleDateString() },
    {
      field: 'actions', headerName: '', width: 60, sortable: false, filterable: false,
      renderCell: ({ row }) => (
        <IconButton size="small" color="error" onClick={() => setDeleting(row)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>Feedback</Typography>
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
      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}>
        <Alert severity={snack === 'success' ? 'success' : 'error'} variant="filled" onClose={() => setSnack(null)}>
          {snack === 'success' ? 'Deleted' : 'Error deleting'}
        </Alert>
      </Snackbar>

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this feedback? This action cannot be undone.
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
