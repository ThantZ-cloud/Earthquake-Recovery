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
} from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

const DONATE_ITEMS = {
  crypto: [
    { name: 'Bitcoin (BTC)', img: '/assets/donate/bitcoin.jpg', address: 'bc1q...example' },
    { name: 'Ethereum (ETH)', img: '/assets/donate/ethereum.jpg', address: '0x71C...example' },
    { name: 'Tether (USDT)', img: '/assets/donate/tether.jpg', address: '0x71C...example' },
    { name: 'Binance Coin (BNB)', img: '/assets/donate/binance.jpg', address: 'bnb1...example' },
    { name: 'Cardano (ADA)', img: '/assets/donate/cardano.jpg', address: 'addr1...example' },
    { name: 'Solana (SOL)', img: '/assets/donate/solana.jpg', address: 'SoL...example' },
    { name: 'Polkadot (DOT)', img: '/assets/donate/polkadot.jpg', address: '1exa...example' },
    { name: 'Ripple (XRP)', img: '/assets/donate/ripple.jpg', address: 'rPp...example' },
  ],
  mobile: [
    { name: 'KBZ Pay', img: '/assets/donate/kbz.jpg' },
    { name: 'Wave Pay', img: '/assets/donate/wavepay.jpg' },
    { name: 'KPay', img: '/assets/donate/kpay.jpg' },
    { name: 'CB Pay', img: '/assets/donate/cb.jpg' },
    { name: 'AYA Pay', img: '/assets/donate/aya.jpg' },
    { name: 'Yoma Bank', img: '/assets/donate/yoma.jpg' },
  ],
  international: [
    { name: 'PayPal', img: '/assets/donate/paypal.jpg' },
    { name: 'A+', img: '/assets/donate/A+.jpg' },
    { name: 'USD', img: '/assets/donate/usd.jpg' },
  ],
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function Donate() {
  const [tab, setTab] = useState(0);
  const [dialog, setDialog] = useState(null);

  const tabKeys = Object.keys(DONATE_ITEMS);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
          color: '#fff',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <FavoriteIcon sx={{ fontSize: 52, mb: 2 }} />
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
              Support Recovery Efforts
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
              Your contribution helps earthquake-affected communities rebuild their lives.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="fullWidth"
          sx={{ mb: 5 }}
          TabIndicatorProps={{ sx: { height: 3, borderRadius: 2 } }}
        >
          <Tab label="💎 Crypto" sx={{ fontWeight: tab === 0 ? 700 : 400 }} />
          <Tab label="📱 Mobile Payment" sx={{ fontWeight: tab === 1 ? 700 : 400 }} />
          <Tab label="🌍 International" sx={{ fontWeight: tab === 2 ? 700 : 400 }} />
        </Tabs>

        <motion.div
          key={tab}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Grid container spacing={3}>
            {DONATE_ITEMS[tabKeys[tab]].map((item) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.name}>
                <motion.div variants={itemVariants}>
                  <Card
                    onClick={() => item.address && setDialog(item)}
                    sx={{
                      cursor: item.address ? 'pointer' : 'default',
                      textAlign: 'center',
                      py: 3,
                      px: 2,
                      height: '100%',
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
                      {item.address && (
                        <Button size="small" sx={{ mt: 1, fontSize: '0.7rem' }}>
                          View Address
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* Wallet Dialog */}
      <Dialog open={!!dialog} onClose={() => setDialog(null)} maxWidth="xs" fullWidth>
        {dialog && (
          <>
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
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
                sx={{ width: 60, height: 60, objectFit: 'contain', mb: 1 }}
              />
              <Typography variant="h6" fontWeight={700}>
                {dialog.name}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 3, pb: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Send your donation to:
              </Typography>
              <Box
                sx={{
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  p: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                  mb: 2,
                }}
              >
                {dialog.address}
              </Box>
              <Button
                startIcon={<ContentCopyIcon />}
                variant="outlined"
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(dialog.address);
                }}
              >
                Copy Address
              </Button>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
