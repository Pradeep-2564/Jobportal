import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CustomNavbar from './Home';
import Homepage from './homepage';
import Footer from './Footer';
import FindJobPage from './findjobpage';
import HireTalentPage from './hiretalentpage';
import AboutUs from './AboutUs';

import { useLocation } from 'react-router-dom';

const MainLayout = ({ toggleColorMode, mode }) => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/find-job':
        return <FindJobPage />;
      case '/hire-talent':
        return <HireTalentPage />;
      case '/about':
        return <AboutUs />;
      case '/services':
        return <Services />;
      default:
        return <Homepage mode={mode} />;
    }
  };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      
    }}>
      {/* Navbar */}
      <CustomNavbar toggleColorMode={toggleColorMode} />

      {/* Main Content */}
      <Box sx={{ 
        p: 1,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 0 auto',
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 100px)',
        maxHeight: 'calc(100vh - 100px)',
        position: 'relative'
      }}>
        <Container maxWidth="xl" sx={{
          width: '100%',
          maxWidth: '100%',
          px: 2,
          '@media (min-width: 1200px)': {
            maxWidth: '1440px',
          },
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: '1 0 auto'
        }}>
          {renderContent()}
        </Container>
      </Box>

      {/* Footer */}
      <Footer sx={{ mt: 1}} />
    </Box>
  );
};

export default MainLayout;
