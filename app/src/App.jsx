import { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import getTheme from './theme';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n';
import ThemeContext from './context/ThemeContext';
import Layout from './components/Layout';
import AnimatedPage from './components/AnimatedPage';
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
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const theme = useMemo(() => getTheme(mode), [mode]);
  const location = useLocation();

  const handleSetMode = (newMode) => {
    localStorage.setItem('themeMode', newMode);
    setMode(newMode);
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    setMode(newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ mode, toggleTheme, setMode: handleSetMode }}>
      <LanguageProvider>
      <AuthProvider>
        <Layout mode={mode} toggleTheme={toggleTheme}>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><Suspense fallback={<HomeSkeleton />}><Home /></Suspense></AnimatedPage>} />
              <Route
                path="/recovery"
                element={
                  <AnimatedPage>
                    <Suspense fallback={<PageSkeleton variant="recovery" />}>
                      <Recovery />
                    </Suspense>
                  </AnimatedPage>
                }
              />
              <Route
                path="/donate"
                element={
                  <AnimatedPage>
                    <Suspense fallback={<PageSkeleton variant="donate" />}>
                      <Donate />
                    </Suspense>
                  </AnimatedPage>
                }
              />
              <Route
                path="/quiz"
                element={
                  <AnimatedPage>
                    <Suspense fallback={<PageSkeleton variant="quiz" />}>
                      <Quiz />
                    </Suspense>
                  </AnimatedPage>
                }
              />
              <Route
                path="/history"
                element={
                  <AnimatedPage>
                    <Suspense fallback={<PageSkeleton variant="history" />}>
                      <History />
                    </Suspense>
                  </AnimatedPage>
                }
              />
            </Routes>
          </AnimatePresence>
        </Layout>
      </AuthProvider>
      </LanguageProvider>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
