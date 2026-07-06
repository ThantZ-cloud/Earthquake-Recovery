import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import FeedbackButton from './FeedbackButton';
import { useLang } from '../i18n';

export default function Layout({ children, mode, toggleTheme }) {
  const { t } = useLang();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Skip to content link for keyboard users */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          top: -100,
          left: 0,
          bgcolor: 'primary.main',
          color: '#fff',
          px: 2,
          py: 1,
          zIndex: 9999,
          textDecoration: 'none',
          fontWeight: 600,
          '&:focus': { top: 0 },
        }}
      >
        {t('skipToContent')}
      </Box>
      <Navbar mode={mode} toggleTheme={toggleTheme} />
      <Box component="main" id="main-content" sx={{ flex: 1 }} tabIndex={-1}>
        {children}
      </Box>
      <Footer />
      <FeedbackButton />
    </Box>
  );
}
