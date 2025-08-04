import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CampaignIcon from '@mui/icons-material/Campaign';
import { RiMoonClearFill } from "react-icons/ri";
import { CiBrightnessUp } from "react-icons/ci";

import { useLocation, useNavigate } from 'react-router-dom';
import logoLight from '../assets/logo.png';
import logoDark from '../assets/logoWhite.png';

const navItems = [
  { label: 'Home', path: '/', style: { fontSize: '0.55rem' } },
   { label: 'Find Job', path: '/find-job', style: { fontSize: '0.55rem' } },
   { label: 'Hire Talent', path: '/hire-talent', style: { fontSize: '0.55rem' } },
  { label: 'About Us', path: '/about', style: { fontSize: '0.55rem' } },
  { label: 'Pro Services', path: '/services', style: { fontSize: '0.55rem' } },
];

const CustomNavbar = ({ toggleColorMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dropdownOpen = Boolean(anchorEl);

  const handleDropdownOpen = (event) => setAnchorEl(event.currentTarget);
  const handleDropdownClose = () => setAnchorEl(null);
  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
    handleDropdownClose();
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/services' && location.pathname.startsWith('/services'));

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: '30px',
          boxShadow: '0px 1px 5px rgba(0,0,0,0.06)',
          px: 1,
          py: 0,
          mt: 1,
          mx: 'auto',
          width: '98%',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '48px',
          px: 2,
          '& .MuiButton-root': {
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 500,
            px: 1.5,
            whiteSpace: 'nowrap',
            minWidth: 'auto',
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: '200px' }}>
            <img
              src={isDarkMode ? logoDark : logoLight}
              alt="Logo"
              className="logo-animated"
              style={{
                width: 130,
                height: 'auto',
                marginTop: '-8px',
                transition: 'all 0.3s ease-in-out',
                marginRight: '16px',
                objectFit: 'contain'
              }}
            />
            <Box
              sx={{
                ml: 2,
                fontFamily: 'Roboto, sans-serif',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: '30ch',
                height: '24px',
                animation: 'typing 2s steps(32) forwards',
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '1.6rem', lineHeight: '24px',cursor: 'default' }}>
                <span style={{ color: theme.palette.text.primary }}>Welcome to</span>
                <Box component="span" sx={{ color: '#F79615', ml: 1 }}>JobPortal</Box>
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                {navItems.map(({ label, path, style }) => {
                  const active = isActive(path);
                  const isDropdown = label === 'Pro Services';

                  const renderButton = (
                    <Button
                      key={label}
                      onClick={isDropdown ? handleDropdownOpen : () => handleNavClick(path)}
                      disableRipple
                      endIcon={isDropdown ? <KeyboardArrowDownIcon /> : null}
                      sx={{
                        px: 2,
                        py: 0.8,
                        borderRadius: '999px',
                        color: active ? '#F79615' : theme.palette.text.primary,
                        backgroundColor: active ? theme.palette.action.hover : 'transparent',
                        textTransform: 'none',
                        fontSize: '0.88rem',
                        position: 'relative',
                        minWidth: 'unset',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          color: theme.palette.text.primary,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: '8px',
                          bottom: -8,
                          width: '6px',
                          height: '6px',
                          backgroundColor: active ? '#F79615' : 'transparent',
                          borderRadius: '50%',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: '16px',
                          bottom: -6,
                          height: '3px',
                          width: active ? 'calc(100% - 24px)' : '16px',
                          backgroundColor: '#F79615',
                          borderRadius: 2,
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: 'calc(100% - 24px)',
                        },
                        ...style,
                      }}
                    >
                      {label}
                    </Button>
                  );

                  return isDropdown ? (
                    <Box key={label}>
                      {renderButton}
                      <Menu
                        anchorEl={anchorEl}
                        open={dropdownOpen}
                        onClose={handleDropdownClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                      >
                        <MenuItem onClick={() => handleNavClick('/services/web-development')}>
                          <CodeIcon sx={{ fontSize: 18, mr: 1 }} /> Web Development
                        </MenuItem>
                        <MenuItem onClick={() => handleNavClick('/services/design')}>
                          <DesignServicesIcon sx={{ fontSize: 18, mr: 1 }} /> UI/UX Design
                        </MenuItem>
                        <MenuItem onClick={() => handleNavClick('/services/marketing')}>
                          <CampaignIcon sx={{ fontSize: 18, mr: 1 }} /> Digital Marketing
                        </MenuItem>
                      </Menu>
                    </Box>
                  ) : renderButton;
                })}
              </Box>

              {/* Theme Toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 0.5 }}>
                <Tooltip title="Toggle Theme">
                  <IconButton 
                    onClick={toggleColorMode} 
                    sx={{ 
                      color: theme.palette.text.primary,
                      p: 0.5
                    }}
                  >
                    {isDarkMode ? <RiMoonClearFill size={20} /> : <CiBrightnessUp size={20} />}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Login Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    px: 1.5,
                    py: 0.4,
                    fontSize: '0.82rem',
                    borderRadius: '999px',
                    borderColor: isDarkMode ? '#fff' : '#FDAF18',
                    color: isDarkMode ? '#fff' : 'black',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: theme.palette.background.default,
                      borderColor: '#FDAF18',
                    },
                  }}
                >
                  <LoginIcon fontSize="small" />
                  Login
                </Button>
              </Box>
            </Box>
          )}

          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, mt: 5, backgroundColor: theme.palette.background.paper, height: '100%' }}>
          <List>
            {navItems.map(({ label, path, style }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton onClick={() => handleNavClick(path)}>
                  <ListItemText
                    primary={label}
                    sx={{
                      color: location.pathname === path ? '#F79615' : theme.palette.text.primary,
                      fontWeight: location.pathname === path ? 600 : 400,
                      ...style,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNavClick('/login')}
                sx={{
                  mt: 1,
                  background: '#FDAF18',
                  color: '#fff',
                  textTransform: 'none',
                }}
              >
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <style>
        {`
          @keyframes typing {
            from { width: 0 }
            to { width: 30ch }
          }
          .logo-animated:hover {
            transform: scale(1.08);
            filter: drop-shadow(0 0 6px rgba(255, 174, 0, 0.5));
          }
        `}
      </style>
    </>
  );
};

export default CustomNavbar;
