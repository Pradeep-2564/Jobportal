import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BarChartIcon from '@mui/icons-material/BarChart';
import { CiLogout } from 'react-icons/ci';
import { useLocation, useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logoWhite.png';
import { TbLogout } from 'react-icons/tb';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0),
  },
}));

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon sx={{ color: '#6C63FF' }} />, path: '/dashboard/recruiter' },
    { label: 'Job Posting', icon: <WorkIcon sx={{ color: '#EB5757' }} />, path: '/dashboard/recruiter/job-posting' },
    { label: 'Job Lists', icon: <AssignmentIcon sx={{ color: '#2D9CDB' }} />, path: '/dashboard/recruiter/job-lists' },
    { label: 'Applicants', icon: <PeopleAltIcon sx={{ color: '#27AE60' }} />, path: '/dashboard/recruiter/job-applicants' },
    { label: 'Interviews', icon: <EventAvailableIcon sx={{ color: '#F2C94C' }} />, path: '/dashboard/recruiter/interviews' },
    { label: 'Reports', icon: <BarChartIcon sx={{ color: '#9B51E0' }} />, path: '/dashboard/recruiter/reports' },
  ];

  const handleDrawerClose = () => {
    handleDrawerToggle();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) handleDrawerClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Box
          px={3}
          py={1.5}
          textAlign="center"
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.06)'
                : 'rgba(0, 0, 0, 0.03)',
            borderRadius: 2,
            mx: 2,
            mb: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.03)',
            },
          }}
        >
          <img
            src={theme.palette.mode === 'dark' ? logoDark : logoLight}
            alt="CareerQuest Logo"
            style={{ height: 45, transition: 'all 0.3s ease' }}
          />
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider, mx: 3, my: 2 }} />

        <List disablePadding sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                my: 0.5,
                px: 2.5,
                py: 1.2,
                borderRadius: 2,
                lineHeight: 1.5,
                backgroundColor:
                  location.pathname === item.path ? '#F79615' : 'transparent',
                '&:hover': {
                  backgroundColor: '#FDAF18',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.9rem' // Adjusted font size
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Box margin={0.6}>
        <ListItemButton
          onClick={() => navigate("/")}
          sx={{
          mx: 2,
          borderRadius: 8,
          py: 1,
          color: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          "&:hover": {
            backgroundColor: alpha(theme.palette.error.main, 0.2),
          },
          transition: "background-color 0.3s ease",
          }}
        >
        <ListItemIcon sx={{ color: "inherit", minWidth: 35 }}>
          <TbLogout size={22} weight="duotone" />
            </ListItemIcon>
            <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}>
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            borderRight: 'none',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {drawer}
      </StyledDrawer>

      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            height: '100vh',
            borderRight: 'none',
            boxShadow: theme.shadows[2],
          },
        }}
        open
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
};

export default Sidebar;