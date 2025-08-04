import React from 'react';
import { Box, Typography, Container, Grid, Link, Paper, IconButton } from '@mui/material';
import { Facebook, Instagram, LinkedIn, Twitter, X, YouTube } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles'; // Import useTheme
import logo from '../assets/logo.png';
import logoWhite from '../assets/logoWhite.png';

const socialLinks = [
  { icon: <Facebook />, url: "https://www.facebook.com/khkrinnovatorstech", color: '#1877F2', hover: '#166FE5' },
  { icon: <Instagram />, url: "https://www.instagram.com/innovators_tech_solution", color: '#E4405F', hover: '#D42D6D' },
  { icon: <LinkedIn />, url: "https://www.linkedin.com/company/khkr-innovators-tech-solutions-pvt-ltd/", color: '#0A66C2', hover: '#084D94' },
  { icon: <X sx={{ fontSize: '1.85rem' }} />, url: "https://twitter.com/InnovatorsTechS", color: '#0A66C2', hover: '#0A66C2' },
  { icon: <YouTube />, url: "https://www.youtube.com/@InnovatorsTechSolutions", color: '#FF0000', hover: '#CC0000' }
];

const footerLinks = [
  ['Home', 'About Us'],
  ['Services', 'Industries'],
  ['Our Works', 'Technology'],
  ['Clients', 'Contact Us']
];

const legalLinks = [
  { text: "FAQ's", id: "faqs" },
  { text: "Privacy Policy", id: "privacy" },
  { text: "Terms & Conditions", id: "terms" }
];

const Footer = () => {
  const theme = useTheme(); // Access the theme
  const isDarkMode = theme.palette.mode === 'dark'; // Check if the current mode is dark

  return (
    <Paper component="footer" sx={{ 
      mt: 8, 
      bgcolor: isDarkMode ? '#333333' : '#ffffff', // Background color based on theme
      color: isDarkMode ? '#ffffff' : '#333333', // Text color based on theme
      py: 4,
      width: '100%',
      position: 'relative', 
      zIndex: 1
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', pr: { md: '80px' } }}>
              <img 
                src={isDarkMode ? logoWhite : logo} // Toggle between logos
                alt="Company Logo" 
                style={{ 
                  maxWidth: '220px', 
                  height: 'auto', 
                  marginBottom: '24px',
                  display: 'block'
                }} 
              />
              <Box sx={{ 
                display: 'flex', 
                gap: '16px', 
                mb: 2,
                '& .MuiSvgIcon-root': { fontSize: '1.5rem' }
              }}>
                {socialLinks.map((item, index) => (
                  <IconButton 
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: item.color, 
                      p: 0.5,
                      '&:hover': { 
                        color: item.hover, 
                        bgcolor: `rgba(${parseInt(item.color.slice(1,3), 16)}, ${parseInt(item.color.slice(3,5), 16)}, ${parseInt(item.color.slice(5,7), 16)}, 0.1)`
                      }
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 1, 
              pl: { md: '40px' }, 
              borderLeft: { 
                md: `1.3px solid ${isDarkMode ? '#ccc' : '#ff9800'}` 
              } // Change border color based on theme
            }}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, auto)',
                gap: '16px 80px',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                width: '100%',
                maxWidth: '700px',
                ml: 'auto',
                '& > div': { 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  '& a': {
                    textDecoration: 'none',  
                    color: isDarkMode ? '#ffffff' : '#333333', // Link color based on theme
                    '&:hover': {
                      color: '#ff9800',  // Orange hover color
                      textDecoration: 'none', // Remove underline on hover
                    }
                  }
                }
              }}>
                {footerLinks.map((group, i) => (
                  <div key={i}>
                    {group.map((link, j) => (
                      <Link key={j} href={`#${link.toLowerCase().replace(' ', '-')}`}>
                        {link}
                      </Link>
                    ))}
                  </div>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ 
          mt: 0, 
          pt: 2, 
          borderTop: { 
            md: `1.3px solid ${isDarkMode ? '#ccc' : '#ff9800'}` 
          },
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: 1
        }}>
          <Typography variant="body2" sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: { xs: 1, sm: 0 },cursor: 'default' }}>
            &copy; 2025, KHKR Innovators Tech Solutions. All Rights Reserved
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {legalLinks.map((link, i) => (
              <React.Fragment key={i}>
                <Link 
                  href={`#${link.id}`} 
                  sx={{ 
                    color: isDarkMode ? '#ffffff' : '#333333', 
                    textDecoration: 'none', // Remove underline by default
                    '&:hover': {
                      color: '#ff9800', // Orange hover color
                      textDecoration: 'none', // Ensure no underline on hover
                    }
                  }}
                >
                  {link.text}
                </Link>
                {i < legalLinks.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
