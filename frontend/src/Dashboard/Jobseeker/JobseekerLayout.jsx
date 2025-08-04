import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const JobseekerLayout = () => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('jobseekerThemeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    localStorage.setItem('jobseekerThemeMode', mode);
  }, [mode]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'light' ? '#f0f2f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#ffffff',
        secondary: mode === 'light' ? '#757575' : '#a0a0a0',
      },
    },
    // Updated Typography for Poppins font and smaller sizes
    typography: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 14, // Base font size
      h4: { fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.8rem' },
      h5: { fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.4rem' },
      h6: { fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1.1rem' },
      body1: { fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' },
      body2: { fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' },
      button: { fontFamily: 'Poppins, sans-serif', textTransform: 'none' }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} isMobile={isMobile} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Topbar
            toggleTheme={toggleTheme}
            currentTheme={mode}
            handleDrawerToggle={handleDrawerToggle}
            isMobile={isMobile}
          />
          <Box sx={{ flex: 1, width: '100%', p: isMobile ? 1 : 2 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default JobseekerLayout;