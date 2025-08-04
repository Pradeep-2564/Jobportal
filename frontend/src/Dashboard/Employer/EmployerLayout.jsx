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

const EmployerLayout = () => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('employerThemeMode');
    return savedMode || 'light';
  });

  useEffect(() => {
    localStorage.setItem('employerThemeMode', mode);
  }, [mode]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      background: {
        default: mode === 'light' ? '#f5f7f9' : '#121212',
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
      <Box display="flex" sx={{ position: 'relative' }}>
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          isMobile={isMobile}
        />
        <Box component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - 240px)` },
          }}>
          <Topbar
            toggleTheme={toggleTheme}
            currentTheme={mode}
            toggleSidebar={handleDrawerToggle}
            isMobile={isMobile}
          />
          <Box p={2}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EmployerLayout;