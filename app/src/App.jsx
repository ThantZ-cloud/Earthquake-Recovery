import { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PageSkeleton from './components/PageSkeleton';
import HomeSkeleton from './components/HomeSkeleton';

const Home = lazy(() => import('./pages/Home'));

const Recovery = lazy(() => import('./pages/Recovery'));
const Donate = lazy(() => import('./pages/Donate'));
const Quiz = lazy(() => import('./pages/Quiz'));
const History = lazy(() => import('./pages/History'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Layout mode={mode} toggleTheme={toggleTheme}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Suspense fallback={<HomeSkeleton />}><Home /></Suspense>} />
            <Route
              path="/recovery"
              element={
                <Suspense fallback={<PageSkeleton variant="recovery" />}>
                  <Recovery />
                </Suspense>
              }
            />
            <Route
              path="/donate"
              element={
                <Suspense fallback={<PageSkeleton variant="donate" />}>
                  <Donate />
                </Suspense>
              }
            />
            <Route
              path="/quiz"
              element={
                <Suspense fallback={<PageSkeleton variant="quiz" />}>
                  <Quiz />
                </Suspense>
              }
            />
            <Route
              path="/history"
              element={
                <Suspense fallback={<PageSkeleton variant="history" />}>
                  <History />
                </Suspense>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
