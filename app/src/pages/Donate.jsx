import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Tab,
  Tabs,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useLang } from '../i18n';

/* ──────────────────────── DATA ──────────────────────── */

const DONATE_ITEMS = {
  crypto: [
    {
      name: 'Binance',
      img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      detail: 'bc1qSAMPLEADDRESS1234567890abcdef',
      detailLabelKey: 'donate.detailLabels.walletAddress',
      instructionKey: 'donate.instructions.binance',
    },
    {
      name: 'Bybit',
      img: '/assets/donate/bybit.png',
      detail: '0xSAMPLE1234567890abcdefABCDEF1234',
      detailLabelKey: 'donate.detailLabels.walletAddress',
      instructionKey: 'donate.instructions.bybit',
    },
  ],
  mobile: [
    {
      name: 'KBZ Pay',
      img: '/assets/donate/kbz.jpg',
      detail: '09 XXX XXX XXX',
      detailLabelKey: 'donate.detailLabels.phoneNumber',
      instructionKey: 'donate.instructions.kbzPay',
    },
    {
      name: 'Wave Pay',
      img: '/assets/donate/wavepay.jpg',
      detail: '09 XXX XXX XXX',
      detailLabelKey: 'donate.detailLabels.phoneNumber',
      instructionKey: 'donate.instructions.wavePay',
    },
    {
      name: 'KPay',
      img: '/assets/donate/kpay.jpg',
      detail: '09 XXX XXX XXX',
      detailLabelKey: 'donate.detailLabels.phoneNumber',
      instructionKey: 'donate.instructions.kPay',
    },
    {
      name: 'CB Pay',
      img: '/assets/donate/cb.jpg',
      detail: '09 XXX XXX XXX',
      detailLabelKey: 'donate.detailLabels.phoneNumber',
      instructionKey: 'donate.instructions.cbPay',
    },
    {
      name: 'AYA Pay',
      img: '/assets/donate/aya.jpg',
      detail: '09 XXX XXX XXX',
      detailLabelKey: 'donate.detailLabels.phoneNumber',
      instructionKey: 'donate.instructions.ayaPay',
    },
    {
      name: 'Yoma Bank',
      img: '/assets/donate/yoma.jpg',
      detail: 'XXXX XXXX XXXX',
      detailLabelKey: 'donate.detailLabels.accountNumber',
      instructionKey: 'donate.instructions.yomaBank',
    },
  ],
  international: [
    {
      name: 'PayPal',
      img: '/assets/donate/paypal.jpg',
      detail: 'sample@email.com',
      detailLabelKey: 'donate.detailLabels.paypalEmail',
      instructionKey: 'donate.instructions.paypal',
    },
    {
      name: 'A+',
      img: '/assets/donate/A+.jpg',
      detail: '+95 9 XXX XXX XXX',
      detailLabelKey: 'donate.detailLabels.contact',
      instructionKey: 'donate.instructions.aplus',
    },
    {
      name: 'USD Transfer',
      img: '/assets/donate/usd.jpg',
      detail: 'SWIFT: XXXXXXXX | Account: XXXXXXXXXX',
      detailLabelKey: 'donate.detailLabels.bankDetails',
      instructionKey: 'donate.instructions.usdTransfer',
    },
  ],
};

const TAB_LABEL_KEYS = ['donate.tabCrypto', 'donate.tabMobile', 'donate.tabInternational'];
const TAB_KEYS = Object.keys(DONATE_ITEMS);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

/* ──────────────────────── PAGE ──────────────────────── */

export default function Donate() {
  const { t } = useLang();
  const [tab, setTab] = useState(0);
  const [dialog, setDialog] = useState(null);
  const [copySnack, setCopySnack] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopySnack('success'))
      .catch(() => setCopySnack('error'));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FavoriteIcon sx={{ fontSize: 52, mb: 2 }} />
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
            >
              {t('donate.title')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              {t('donate.subtitle')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Temporary notice */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Alert
          severity="info"
          icon={<InfoOutlinedIcon />}
          sx={{ borderRadius: 2, mb: 2 }}
        >
          <Typography variant="body2" fontWeight={600}>
            {t('donate.tempNotice')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('donate.tempDesc')}
          </Typography>
        </Alert>
      </Container>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="fullWidth"
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
        >
          {TAB_LABEL_KEYS.map((key, i) => (
            <Tab
              key={key}
              label={t(key)}
              sx={{ fontWeight: tab === i ? 700 : 400, py: 2 }}
            />
          ))}
        </Tabs>
      </Container>

      {/* ── Payment Cards ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          key={tab}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={3}>
            {DONATE_ITEMS[TAB_KEYS[tab]].map((item) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.name}>
                <motion.div variants={itemVariants}>
                  <Card
                    onClick={() => setDialog(item)}
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      py: 3,
                      px: 2,
                      height: '100%',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) =>
                          theme.palette.mode === 'dark'
                            ? '0 8px 30px rgba(211,47,47,0.2)'
                            : '0 8px 30px rgba(211,47,47,0.12)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.img}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        mx: 'auto',
                        mb: 2,
                        borderRadius: 2,
                      }}
                    />
                    <CardContent sx={{ p: '0 !important' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        {t('donate.tapToSee')}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* ── Donation Dialog ── */}
      <Dialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        maxWidth="xs"
        fullWidth
      >
        {dialog && (
          <>
            <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
              <IconButton
                onClick={() => setDialog(null)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
              <Box
                component="img"
                src={dialog.img}
                alt={dialog.name}
                sx={{ width: 64, height: 64, objectFit: 'contain', mb: 1 }}
              />
              <Typography variant="h6" fontWeight={700}>
                {dialog.name}
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 3 }}>
              {/* Detail field */}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t(dialog.detailLabelKey)}:
              </Typography>
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 2,
                  p: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  wordBreak: 'break-all',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>{dialog.detail}</Box>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(dialog.detail)}
                  sx={{ flexShrink: 0 }}
                >
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => handleCopy(dialog.detail)}
                sx={{ mb: 3 }}
              >
                {t('donate.copyClipboard')}
              </Button>

              {/* Instructions */}
              <Typography
                variant="subtitle2"
                fontWeight={700}
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                {t('donate.howToDonate')}
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                {t(dialog.instructionKey).map((step, i) => (
                  <Box
                    component="li"
                    key={i}
                    sx={{
                      mb: 1,
                      '&:last-child': { mb: 0 },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ── Copy Snackbar ── */}
      <Snackbar
        open={!!copySnack}
        autoHideDuration={3000}
        onClose={() => setCopySnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={copySnack === 'success' ? 'success' : 'error'}
          variant="filled"
          onClose={() => setCopySnack(null)}
        >
          {copySnack === 'success'
            ? t('donate.copied')
            : t('donate.copyFailed')}
        </Alert>
      </Snackbar>
    </Box>
  );
}
