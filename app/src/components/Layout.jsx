import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import FeedbackButton from './FeedbackButton';

export default function Layout({ children, mode, toggleTheme }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar mode={mode} toggleTheme={toggleTheme} />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
      <FeedbackButton />
    </Box>
  );
}
