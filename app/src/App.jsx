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
import NavGuard from './components/NavGuard';
import PageSkeleton from './components/PageSkeleton';
import HomeSkeleton from './components/HomeSkeleton';
import LearnSkeleton from './components/LearnSkeleton';

const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));

const Recovery = lazy(() => import('./pages/Recovery'));
const Donate = lazy(() => import('./pages/Donate'));
const Quiz = lazy(() => import('./pages/Quiz'));
const History = lazy(() => import('./pages/History'));
const About = lazy(() => import('./pages/About'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
const AdminPhones = lazy(() => import('./pages/admin/AdminPhones'));
const AdminQuiz = lazy(() => import('./pages/admin/AdminQuiz'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'));
const AdminMonitoring = lazy(() => import('./pages/admin/AdminMonitoring'));
const AdminNavigation = lazy(() => import('./pages/admin/AdminNavigation'));

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ mode, toggleTheme, setMode: handleSetMode }}>
      <LanguageProvider>
      <AuthProvider>
        <Layout mode={mode} toggleTheme={toggleTheme}>
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <NavGuard>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><Suspense fallback={<HomeSkeleton />}><Home /></Suspense></AnimatedPage>} />
                <Route
                  path="/learn"
                  element={
                    <AnimatedPage>
                      <Suspense fallback={<LearnSkeleton />}>
                        <Learn />
                      </Suspense>
                    </AnimatedPage>
                  }
                />
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
                <Route
                  path="/about"
                  element={
                    <AnimatedPage>
                      <Suspense fallback={<PageSkeleton variant="about" />}>
                        <About />
                      </Suspense>
                    </AnimatedPage>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<PageSkeleton />}>
                      <AdminLayout />
                    </Suspense>
                  }
                >
                  <Route index element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
                  <Route path="feedback" element={<Suspense fallback={null}><AdminFeedback /></Suspense>} />
                  <Route path="phones" element={<Suspense fallback={null}><AdminPhones /></Suspense>} />
                  <Route path="quiz" element={<Suspense fallback={null}><AdminQuiz /></Suspense>} />
                  <Route path="announcements" element={<Suspense fallback={null}><AdminAnnouncements /></Suspense>} />
                  <Route path="monitoring" element={<Suspense fallback={null}><AdminMonitoring /></Suspense>} />
                  <Route path="navigation" element={<Suspense fallback={null}><AdminNavigation /></Suspense>} />
                </Route>
              </Routes>
            </NavGuard>
          </AnimatePresence>
        </Layout>
      </AuthProvider>
      </LanguageProvider>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}
