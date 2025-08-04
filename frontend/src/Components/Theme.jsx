import React, { useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Home';

 
const Theme = () => {
  const [mode, setMode] = useState('light');
 
  // Load saved theme from localStorage on first load
  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);
 
  // Save theme to localStorage and toggle
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };
 
  // Dynamic theme creation
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f4f6f8',
                  paper: '#fff',
                },
                text: {
                  primary: '#000',
                },
              }
            : {
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#fff',
                },
              }),
        },
      }),
    [mode]
  );
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleColorMode={toggleColorMode} />
 
        <Routes>
          <Route path="/" element={<div style={{ padding: '2rem' }}>Home Page</div>} />
          <Route path="/about" element={<div style={{ padding: '2rem' }}>About Us</div>} />
          <Route path="/services" element={<div style={{ padding: '2rem' }}>Our Services</div>} />
          <Route path="/login" element={<div style={{ padding: '2rem' }}>Login Page</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};
 
export default Theme;
 
 