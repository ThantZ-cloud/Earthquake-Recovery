import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import supabase from '../../../lib/supabase';

function fresh(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

export function useAdminCrud(tableName, queryKey, options = {}) {
  const { initialForm = {}, validateForm = null, transformPayload = null } = options;

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => fresh(initialForm));
  const [snack, setSnack] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openNew = useCallback(() => {
    setEditing(null);
    setForm(fresh(initialForm));
    setDialogOpen(true);
  }, [initialForm]);

  const openEdit = useCallback((row, formTransformer = (r) => r) => {
    setEditing(row);
    setForm(fresh(formTransformer(row)));
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditing(null);
  }, []);

  const clearSnack = useCallback(() => setSnack(null), []);

  const handleSave = useCallback(async () => {
    const data = transformPayload ? transformPayload(form) : form;

    if (validateForm && !validateForm(data)) {
      setSnack({ type: 'error', message: 'Please fill all required fields' });
      return false;
    }

    setSubmitting(true);
    try {
      let error;
      if (editing) {
        const result = await supabase.from(tableName).update(data).eq('id', editing.id);
        error = result.error;
      } else {
        const result = await supabase.from(tableName).insert(data);
        error = result.error;
      }

      if (error) {
        console.error(`[Admin] ${tableName} save error:`, error);
        setSnack({ type: 'error', message: error.message || 'Failed to save' });
        return false;
      }

      setSnack({ type: 'success', message: 'Saved successfully' });
      closeDialog();
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      return true;
    } catch (err) {
      console.error(`[Admin] ${tableName} save exception:`, err);
      setSnack({ type: 'error', message: 'An unexpected error occurred' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [form, editing, tableName, queryKey, validateForm, transformPayload, closeDialog, queryClient]);

  const handleDelete = useCallback(async (id) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);

      if (error) {
        console.error(`[Admin] ${tableName} delete error:`, error);
        setSnack({ type: 'error', message: error.message || 'Failed to delete' });
        return false;
      }

      setSnack({ type: 'success', message: 'Deleted successfully' });
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      return true;
    } catch (err) {
      console.error(`[Admin] ${tableName} delete exception:`, err);
      setSnack({ type: 'error', message: 'An unexpected error occurred' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [tableName, queryKey, queryClient]);

  return {
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
  };
}

export function useAdminDelete(tableName, queryKey) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(null);
  const [snack, setSnack] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = useCallback(async (id) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from(tableName).delete().eq('id', id);

      if (error) {
        console.error(`[Admin] ${tableName} delete error:`, error);
        setSnack({ type: 'error', message: error.message || 'Failed to delete' });
        return false;
      }

      setSnack({ type: 'success', message: 'Deleted successfully' });
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      return true;
    } catch (err) {
      console.error(`[Admin] ${tableName} delete exception:`, err);
      setSnack({ type: 'error', message: 'An unexpected error occurred' });
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [tableName, queryKey, queryClient]);

  const clearSnack = useCallback(() => setSnack(null), []);

  return {
    deleting,
    setDeleting,
    snack,
    clearSnack,
    submitting,
    handleDelete,
  };
}
