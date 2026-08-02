import { useState, useCallback } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField, MenuItem, Switch, FormControlLabel, Snackbar, Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from '../../lib/supabase';

const CATEGORIES = ['Safety', 'Science', 'Geography'];
const EMPTY = { question_en: '', question_my: '', options_en: ['', '', '', ''], options_my: ['', '', '', ''], answer: 0, category: 'Safety', enabled: true, sort_order: 0 };

export default function AdminQuiz() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [snack, setSnack] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-quiz'],
    queryFn: async () => {
      const { data } = await supabase.from('quiz_questions').select('*').order('sort_order');
      return data || [];
    },
  });

  const openNew = () => { setEditing(null); setForm(EMPTY); setDialogOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      question_en: row.question_en, question_my: row.question_my || '',
      options_en: row.options_en || ['', '', '', ''], options_my: row.options_my || ['', '', '', ''],
      answer: row.answer, category: row.category, enabled: row.enabled, sort_order: row.sort_order,
    });
    setDialogOpen(true);
  };

  const setOptEn = (i, v) => setForm((f) => { const o = [...f.options_en]; o[i] = v; return { ...f, options_en: o }; });
  const setOptMy = (i, v) => setForm((f) => { const o = [...f.options_my]; o[i] = v; return { ...f, options_my: o }; });

  const handleSave = useCallback(async () => {
    if (!form.question_en || form.options_en.some((o) => !o)) return;
    const payload = { ...form, answer: parseInt(form.answer) };
    if (editing) {
      const { error } = await supabase.from('quiz_questions').update(payload).eq('id', editing.id);
      if (error) { setSnack('error'); return; }
    } else {
      const { error } = await supabase.from('quiz_questions').insert(payload);
      if (error) { setSnack('error'); return; }
    }
    setSnack('success');
    setDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['admin-quiz'] });
  }, [form, editing, queryClient]);

  const handleDelete = useCallback(async (id) => {
    await supabase.from('quiz_questions').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['admin-quiz'] });
  }, [queryClient]);

  const columns = [
    { field: 'question_en', headerName: 'Question (EN)', flex: 2, minWidth: 250 },
    { field: 'question_my', headerName: 'Question (MY)', flex: 1, minWidth: 180 },
    { field: 'category', headerName: 'Category', width: 110 },
    { field: 'answer', headerName: 'Answer #', width: 90 },
    { field: 'enabled', headerName: 'On', width: 60, renderCell: ({ row }) => row.enabled ? '✓' : '✗' },
    { field: 'sort_order', headerName: 'Order', width: 70 },
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
        <Typography variant="h5" fontWeight={700}>Quiz Questions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Question</Button>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle>{editing ? 'Edit Question' : 'New Question'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Question (EN)" value={form.question_en} onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))} fullWidth multiline rows={2} />
          <TextField label="Question (MY)" value={form.question_my} onChange={(e) => setForm((f) => ({ ...f, question_my: e.target.value }))} fullWidth multiline rows={2} />
          <Typography variant="subtitle2" mt={1}>Options (EN)</Typography>
          {form.options_en.map((o, i) => (
            <TextField key={i} label={`Option ${i + 1}`} value={o} onChange={(e) => setOptEn(i, e.target.value)} fullWidth size="small" />
          ))}
          <Typography variant="subtitle2" mt={1}>Options (MY)</Typography>
          {form.options_my.map((o, i) => (
            <TextField key={i} label={`Option ${i + 1}`} value={o} onChange={(e) => setOptMy(i, e.target.value)} fullWidth size="small" />
          ))}
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField select label="Correct Answer" value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} size="small" sx={{ width: 160 }}>
              {[0, 1, 2, 3].map((i) => <MenuItem key={i} value={i}>Option {i + 1}</MenuItem>)}
            </TextField>
            <TextField select label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} size="small" sx={{ width: 160 }}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} size="small" sx={{ width: 120 }} />
            <FormControlLabel control={<Switch checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} />} label="Enabled" />
          </Box>
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
        <DialogTitle>Delete Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this question? This action cannot be undone.
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
