import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

export default function AuthDialog({ open, onClose, initialTab = 0 }) {
  const { login, register } = useAuth();
  const { t } = useLang();
  const [tab, setTab] = useState(initialTab);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPass);
      setSuccess(t('auth.loginSuccess'));
      setTimeout(() => {
        onClose();
        reset();
      }, 600);
    } catch (err) {
      const msg = typeof err?.message === 'string' && err.message.length > 1 && err.message !== '{}'
        ? err.message : t('auth.loginError');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPass.length < 6) {
      setError(t('auth.passwordMin'));
      return;
    }
    if (regPass !== regPassConfirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await register(regName, regEmail, regPass);
      setSuccess(t('auth.registerSuccess'));
      setTimeout(() => {
        onClose();
        reset();
      }, 1500);
    } catch (err) {
      const msg = typeof err?.message === 'string' && err.message.length > 1 && err.message !== '{}'
        ? err.message : t('auth.registerError');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoginEmail('');
    setLoginPass('');
    setRegName('');
    setRegEmail('');
    setRegPass('');
    setRegPassConfirm('');
    setError('');
    setSuccess('');
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {tab === 0 ? t('auth.welcomeBack') : t('auth.createAccount')}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); setSuccess(''); }} sx={{ mb: 3 }}>
          <Tab label={t('auth.loginBtn')} />
          <Tab label={t('auth.registerBtn')} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {tab === 0 ? (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              label={t('auth.email')}
              type="email"
              fullWidth
              size="small"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('auth.password')}
              type={showLoginPass ? 'text' : 'password'}
              fullWidth
              size="small"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowLoginPass(!showLoginPass)} edge="end" size="small">
                        {showLoginPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2 }}>
              {loading ? <CircularProgress size={22} /> : t('auth.loginBtn')}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              label={t('auth.fullName')}
              fullWidth
              size="small"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('auth.email')}
              type="email"
              fullWidth
              size="small"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('auth.password')}
              type={showRegPass ? 'text' : 'password'}
              fullWidth
              size="small"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              required
              helperText={t('auth.minChars')}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowRegPass(!showRegPass)} edge="end" size="small">
                        {showRegPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label={t('auth.confirmPassword')}
              type={showRegConfirm ? 'text' : 'password'}
              fullWidth
              size="small"
              value={regPassConfirm}
              onChange={(e) => setRegPassConfirm(e.target.value)}
              required
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowRegConfirm(!showRegConfirm)} edge="end" size="small">
                        {showRegConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2 }}>
              {loading ? <CircularProgress size={22} /> : t('auth.registerBtn')}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
