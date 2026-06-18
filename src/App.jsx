import { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Recovery from './pages/Recovery';
import Donate from './pages/Donate';
import Quiz from './pages/Quiz';
import History from './pages/History';

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout mode={mode} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
