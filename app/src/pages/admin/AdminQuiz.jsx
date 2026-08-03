import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Switch, FormControlLabel, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from '@tanstack/react-query';
import supabase from '../../lib/supabase';
import { AdminPageHeader, AdminDataGrid, ConfirmDialog } from './components';
import { useAdminCrud } from './hooks';

const CATEGORIES = ['Safety', 'Science', 'Geography'];
const EMPTY_FORM = {
  question_en: '',
  question_my: '',
  options_en: ['', '', '', ''],
  options_my: ['', '', '', ''],
  answer: 0,
  category: 'Safety',
  enabled: true,
  sort_order: 0,
};

export default function AdminQuiz() {
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
  } = useAdminCrud('quiz_questions', 'admin-quiz', {
    initialForm: EMPTY_FORM,
    validateForm: (f) => Boolean(f.question_en && f.options_en.every((o) => o)),
    transformPayload: (f) => ({ ...f, answer: parseInt(f.answer) }),
  });

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['admin-quiz'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const setOptEn = (i, v) =>
    setForm((f) => {
      const o = [...f.options_en];
      o[i] = v;
      return { ...f, options_en: o };
    });

  const setOptMy = (i, v) =>
    setForm((f) => {
      const o = [...f.options_my];
      o[i] = v;
      return { ...f, options_my: o };
    });

  const columns = [
    { field: 'question_en', headerName: 'Question (EN)', flex: 2, minWidth: 250 },
    { field: 'question_my', headerName: 'Question (MY)', flex: 1, minWidth: 180 },
    { field: 'category', headerName: 'Category', width: 110 },
    { field: 'answer', headerName: 'Answer #', width: 90 },
    { field: 'enabled', headerName: 'On', width: 60, renderCell: ({ row }) => (row.enabled ? '✓' : '✗') },
    { field: 'sort_order', headerName: 'Order', width: 70 },
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
                question_en: r.question_en,
                question_my: r.question_my || '',
                options_en: r.options_en || ['', '', '', ''],
                options_my: r.options_my || ['', '', '', ''],
                answer: r.answer,
                category: r.category,
                enabled: r.enabled,
                sort_order: r.sort_order,
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
      <AdminPageHeader title="Quiz Questions" onAdd={openNew} addLabel="Add Question" />

      <AdminDataGrid rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={dialogOpen} onClose={() => !submitting && closeDialog()} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle>{editing ? 'Edit Question' : 'New Question'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField
            label="Question (EN)"
            value={form.question_en}
            onChange={(e) => setForm((f) => ({ ...f, question_en: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Question (MY)"
            value={form.question_my}
            onChange={(e) => setForm((f) => ({ ...f, question_my: e.target.value }))}
            fullWidth
            multiline
            rows={2}
          />
          <Typography variant="subtitle2" mt={1}>Options (EN)</Typography>
          {form.options_en.map((o, i) => (
            <TextField
              key={`en-${i}`}
              label={`Option ${i + 1}`}
              value={o}
              onChange={(e) => setOptEn(i, e.target.value)}
              fullWidth
              size="small"
            />
          ))}
          <Typography variant="subtitle2" mt={1}>Options (MY)</Typography>
          {form.options_my.map((o, i) => (
            <TextField
              key={`my-${i}`}
              label={`Option ${i + 1}`}
              value={o}
              onChange={(e) => setOptMy(i, e.target.value)}
              fullWidth
              size="small"
            />
          ))}
          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Correct Answer"
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              size="small"
              sx={{ minWidth: 140, flex: { xs: '1 1 45%', md: '0 0 auto' } }}
            >
              {[0, 1, 2, 3].map((i) => (
                <MenuItem key={i} value={i}>Option {i + 1}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              size="small"
              sx={{ minWidth: 140, flex: { xs: '1 1 45%', md: '0 0 auto' } }}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Sort Order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
              size="small"
              sx={{ minWidth: 100, flex: { xs: '1 1 45%', md: '0 0 auto' } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.enabled}
                  onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                />
              }
              label="Enabled"
              sx={{ flex: { xs: '1 1 100%', md: '0 0 auto' } }}
            />
          </Box>
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
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        loading={submitting}
      />
    </Box>
  );
}
