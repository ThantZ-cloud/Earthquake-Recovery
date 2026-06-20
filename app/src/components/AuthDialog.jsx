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
import { useAuth } from '../context/AuthContext';

export default function AuthDialog({ open, onClose, initialTab = 0 }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(initialTab);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPass);
      setSuccess('Logged in!');
      setTimeout(() => {
        onClose();
        reset();
      }, 600);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(regName, regEmail, regPass);
      setSuccess('Account created!');
      setTimeout(() => {
        onClose();
        reset();
      }, 600);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
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
    setError('');
    setSuccess('');
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {tab === 0 ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); setSuccess(''); }} sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
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
              label="Email"
              type="email"
              fullWidth
              size="small"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2 }}>
              {loading ? <CircularProgress size={22} /> : 'Login'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              label="Full Name"
              fullWidth
              size="small"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              value={regPass}
              onChange={(e) => setRegPass(e.target.value)}
              required
              helperText="Minimum 6 characters"
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2 }}>
              {loading ? <CircularProgress size={22} /> : 'Create Account'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
