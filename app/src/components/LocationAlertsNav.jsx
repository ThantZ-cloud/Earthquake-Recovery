import { useState, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Divider,
  Avatar,
  Drawer,
  Button,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import WavesIcon from '@mui/icons-material/Waves';
import LoginIcon from '@mui/icons-material/Login';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationAlerts from './LocationAlerts';
import AuthDialog from './AuthDialog';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';

export default function LocationAlertsNav({ text = false }) {
  const { t } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const triggerRef = useRef(null);

  const handleEnableAlerts = () => {
    if (!user) {
      setAuthOpen(true);
    } else {
      setAlertsEnabled(true);
    }
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  return (
    <>
      {/* Trigger button */}
      {text ? (
        <Button
          fullWidth
          variant="outlined"
          startIcon={<NotificationsActiveIcon />}
          onClick={() => setOpen(true)}
          ref={triggerRef}
          sx={{ justifyContent: 'flex-start' }}
        >
          {t('alerts.title')}
        </Button>
      ) : (
        <IconButton
          onClick={() => setOpen(true)}
          aria-label={t('alerts.navAriaLabel')}
          ref={triggerRef}
          sx={{ color: 'text.primary', width: 38, height: 38 }}
        >
          <NotificationsActiveIcon fontSize="small" />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer anchor="right" open={open} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: 320, sm: 380 },
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2.5, pb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 1.5 }}>
                <NotificationsActiveIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700} fontSize="1.1rem">
                  {t('alerts.title')}
                </Typography>
              </Box>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          {/* Content */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, py: 2 }}>
            {!user ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsActiveIcon sx={{ fontSize: 56, color: 'grey.300', mb: 2 }} />
                <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {t('alerts.descLoggedOut')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={() => setAuthOpen(true)}
                  sx={{ px: 4 }}
                >
                  {t('alerts.ctaLogin')}
                </Button>
              </Box>
            ) : !alertsEnabled ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <MyLocationIcon sx={{ fontSize: 56, color: 'grey.300', mb: 2 }} />
                <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {t('alerts.descLoggedIn')}
                </Typography>
                <Typography
                  sx={{
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: '0.85rem',
                    color: 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {t('alerts.unpredictable')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<MyLocationIcon />}
                  onClick={handleEnableAlerts}
                  sx={{ px: 4 }}
                >
                  {t('alerts.ctaLocation')}
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1, textAlign: 'center', lineHeight: 1.5 }}
                >
                  {t('alerts.activeMsg')}
                </Typography>
                <LocationAlerts enabled={alertsEnabled} />
              </Box>
            )}

            {/* Knowledge sharing: how earthquake alerts work */}
            <Divider sx={{ my: 2.5 }} />
            <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WavesIcon fontSize="small" color="primary" />
                <Typography variant="subtitle2" fontWeight={700}>
                  {t('alerts.howItWorks.title')}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6, mb: 1 }}
              >
                {t('alerts.howItWorks.intro')}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                <strong>{t('alerts.howItWorks.pLabel')}:</strong>{' '}
                {t('alerts.howItWorks.pWave')}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                <strong>{t('alerts.howItWorks.sLabel')}:</strong>{' '}
                {t('alerts.howItWorks.sWave')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6, mb: 1 }}
              >
                {t('alerts.howItWorks.detection')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6, mb: 1 }}
              >
                {t('alerts.howItWorks.alert')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6, mb: 1 }}
              >
                {t('alerts.howItWorks.warningTime')}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                color="text.disabled"
                sx={{ lineHeight: 1.5 }}
              >
                {t('alerts.howItWorks.limitation')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Auth dialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} initialTab={0} />
    </>
  );
}
