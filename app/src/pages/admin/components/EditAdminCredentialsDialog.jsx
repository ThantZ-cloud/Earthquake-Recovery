import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function EditAdminCredentialsDialog({
  open,
  onClose,
  admin,
  onSubmit,
  submitting,
  error,
}) {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = () => {
    setLocalError('');

    if (!newEmail && !newPassword) {
      setLocalError('Provide at least a new email or password');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    onSubmit({
      userId: admin?.id,
      newEmail: newEmail || undefined,
      newPassword: newPassword || undefined,
    });
  };

  const handleClose = () => {
    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setLocalError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Credentials — {admin?.email}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
        {(localError || error) && (
          <Alert severity="error">{localError || error}</Alert>
        )}
        <TextField
          label="New Email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          fullWidth
          size="small"
          placeholder="Leave empty to keep current"
        />
        <TextField
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          size="small"
          placeholder="Leave empty to keep current"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        {newPassword && (
          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            size="small"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Credentials'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
