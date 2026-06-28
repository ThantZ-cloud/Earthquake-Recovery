import { useState, useMemo, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import getTheme from './theme';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Recovery = lazy(() => import('./pages/Recovery'));
const Donate = lazy(() => import('./pages/Donate'));
const Quiz = lazy(() => import('./pages/Quiz'));
const History = lazy(() => import('./pages/History'));

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Layout mode={mode} toggleTheme={toggleTheme}>
          <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
