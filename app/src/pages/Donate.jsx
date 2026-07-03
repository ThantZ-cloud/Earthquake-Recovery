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

/* ──────────────────────── DATA ──────────────────────── */

const DONATE_ITEMS = {
  crypto: [
    {
      name: 'Binance',
      img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      detail: 'bc1qSAMPLEADDRESS1234567890abcdef',
      detailLabel: 'Wallet Address',
      instructions: [
        'Open the Binance app or go to binance.com',
        'Go to Wallet → Spot Wallet',
        'Tap "Withdraw" and select the coin you want to donate',
        'Paste the wallet address below',
        'Enter the amount you want to donate',
        'Confirm the withdrawal',
      ],
    },
    {
      name: 'Bybit',
      img: '/assets/donate/bybit.png',
      detail: '0xSAMPLE1234567890abcdefABCDEF1234',
      detailLabel: 'Wallet Address',
      instructions: [
        'Open the Bybit app or go to bybit.com',
        'Go to Assets → Spot Account',
        'Tap "Withdraw" and select the coin',
        'Paste the wallet address below',
        'Enter the amount you want to donate',
        'Confirm the withdrawal',
      ],
    },
  ],
  mobile: [
    {
      name: 'KBZ Pay',
      img: '/assets/donate/kbz.jpg',
      detail: '09 XXX XXX XXX',
      detailLabel: 'Phone Number',
      instructions: [
        'Open the KBZ Pay app on your phone',
        'Tap "Send Money" on the home screen',
        'Enter phone number: 09 XXX XXX XXX',
        'Enter the amount you want to donate',
        'Add a note like "Earthquake donation"',
        'Confirm with your PIN',
      ],
    },
    {
      name: 'Wave Pay',
      img: '/assets/donate/wavepay.jpg',
      detail: '09 XXX XXX XXX',
      detailLabel: 'Phone Number',
      instructions: [
        'Open the Wave Pay app on your phone',
        'Tap "Transfer" or "Send Money"',
        'Enter phone number: 09 XXX XXX XXX',
        'Enter the amount you want to donate',
        'Add a note like "Earthquake donation"',
        'Confirm with your PIN',
      ],
    },
    {
      name: 'KPay',
      img: '/assets/donate/kpay.jpg',
      detail: '09 XXX XXX XXX',
      detailLabel: 'Phone Number',
      instructions: [
        'Open the KPay app on your phone',
        'Tap "Send Money"',
        'Enter phone number: 09 XXX XXX XXX',
        'Enter the amount you want to donate',
        'Add a note like "Earthquake donation"',
        'Confirm with your PIN',
      ],
    },
    {
      name: 'CB Pay',
      img: '/assets/donate/cb.jpg',
      detail: '09 XXX XXX XXX',
      detailLabel: 'Phone Number',
      instructions: [
        'Open the CB Pay app on your phone',
        'Tap "Transfer" or "Send Money"',
        'Enter phone number: 09 XXX XXX XXX',
        'Enter the amount you want to donate',
        'Add a note like "Earthquake donation"',
        'Confirm with your PIN',
      ],
    },
    {
      name: 'AYA Pay',
      img: '/assets/donate/aya.jpg',
      detail: '09 XXX XXX XXX',
      detailLabel: 'Phone Number',
      instructions: [
        'Open the AYA Pay app on your phone',
        'Tap "Send Money"',
        'Enter phone number: 09 XXX XXX XXX',
        'Enter the amount you want to donate',
        'Add a note like "Earthquake donation"',
        'Confirm with your PIN',
      ],
    },
    {
      name: 'Yoma Bank',
      img: '/assets/donate/yoma.jpg',
      detail: 'XXXX XXXX XXXX',
      detailLabel: 'Account Number',
      instructions: [
        'Open your Yoma Bank mobile app or visit a branch',
        'Select "Transfer" or "Send Money"',
        'Enter account number: XXXX XXXX XXXX',
        'Enter the amount you want to donate',
        'Add a note like "Earthquake donation"',
        'Confirm the transfer',
      ],
    },
  ],
  international: [
    {
      name: 'PayPal',
      img: '/assets/donate/paypal.jpg',
      detail: 'sample@email.com',
      detailLabel: 'PayPal Email',
      instructions: [
        'Go to paypal.com or open the PayPal app',
        'Click "Send" or "Send & Request"',
        'Enter email: sample@email.com',
        'Enter the amount and select currency',
        'Choose "Friends and Family" to avoid fees',
        'Add a note like "Earthquake donation"',
        'Click "Send Now"',
      ],
    },
    {
      name: 'A+',
      img: '/assets/donate/A+.jpg',
      detail: '+95 9 XXX XXX XXX',
      detailLabel: 'Contact',
      instructions: [
        'Send a WhatsApp message to +95 9 XXX XXX XXX',
        'Mention you want to donate to the earthquake relief',
        'The team will guide you through the transfer process',
        'You can donate via bank transfer or mobile payment',
      ],
    },
    {
      name: 'USD Transfer',
      img: '/assets/donate/usd.jpg',
      detail: 'SWIFT: XXXXXXXX | Account: XXXXXXXXXX',
      detailLabel: 'Bank Details',
      instructions: [
        'Open your bank app or visit your bank',
        'Select "International Wire Transfer" or "SWIFT Transfer"',
        'Enter SWIFT code: XXXXXXXX',
        'Enter account number: XXXXXXXXXX',
        'Account name: Sample Account Name',
        'Enter the amount in USD',
        'Add reference: "Donation - Earthquake Relief"',
        'Confirm the transfer',
      ],
    },
  ],
};

const TAB_LABELS = ['💎 Crypto', '📱 Mobile Payment', '🌍 International'];
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
              Support Recovery Efforts
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              Your contribution helps earthquake-affected communities rebuild
              their lives.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="fullWidth"
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
        >
          {TAB_LABELS.map((label, i) => (
            <Tab
              key={label}
              label={label}
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
                        Tap to see how to donate
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
                {dialog.detailLabel}:
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
                Copy to Clipboard
              </Button>

              {/* Instructions */}
              <Typography
                variant="subtitle2"
                fontWeight={700}
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                How to donate
              </Typography>
              <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                {dialog.instructions.map((step, i) => (
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
            ? 'Copied to clipboard!'
            : 'Failed to copy — try selecting manually'}
        </Alert>
      </Snackbar>
    </Box>
  );
}
