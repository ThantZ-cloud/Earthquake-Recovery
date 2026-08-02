import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ActionButtons({ onEdit, onDelete, editLabel = 'Edit', deleteLabel = 'Delete' }) {
  return (
    <>
      <IconButton size="small" onClick={onEdit} aria-label={editLabel}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" color="error" onClick={onDelete} aria-label={deleteLabel}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </>
  );
}
