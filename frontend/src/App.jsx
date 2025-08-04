import React, { useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages & Layouts
import MainLayout from './Components/MainLayout';
import LandingPage from './Pages/LandingPage';

const AppContent = ({ toggleColorMode, mode }) => {
  return (
    <Routes>
      {/* Standalone pages - no Navbar */}
      <Route path="/*" element={<LandingPage />} />

      {/* Pages using MainLayout with Navbar */}
      <Route path="/" element={<MainLayout toggleColorMode={toggleColorMode} mode={mode} />} />
      <Route path="/about" element={<MainLayout toggleColorMode={toggleColorMode} mode={mode} />} />
      <Route path="/services" element={<MainLayout toggleColorMode={toggleColorMode} mode={mode} />} />
      <Route path="/find-job" element={<MainLayout toggleColorMode={toggleColorMode} mode={mode} />} />
      <Route path="/hire-talent" element={<MainLayout toggleColorMode={toggleColorMode} mode={mode} />} />

      {/* Fallback route */}
      <Route path="*" element={<MainLayout toggleColorMode={toggleColorMode} mode={mode} />} />
    </Routes>
  );
};

function App() {
  // Initialize mode from localStorage or default to 'light'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggle: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#f79615',
          },
          background: {
            default: mode === 'light' ? '#fff' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
          // You might want to define other palette properties like text colors, etc.
          text: {
            primary: mode === 'light' ? '#212121' : '#ffffff',
            secondary: mode === 'light' ? '#757575' : '#a0a0a0',
          },
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent
          toggleColorMode={colorMode.toggle}
          mode={mode}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;