import React from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/recruiter' },
  { label: 'Job Posting', icon: <WorkIcon />, path: '/dashboard/recruiter/job-posting' },
  { label: 'Job Applications', icon: <AssignmentIcon />, path: '/dashboard/recruiter/job-applications' },
  { label: 'Interviews', icon: <EventAvailableIcon />, path: '/dashboard/recruiter/interviews' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box p={2} display="flex" justifyContent="center" alignItems="center">
        <Avatar sx={{ width: 40, height: 40 }}>E</Avatar>
      </Box>
      <List>
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => {
                if (!isActive) navigate(item.path); // prevent re-navigation
              }}
              sx={{
                backgroundColor: isActive ? '#e0e0e0' : 'transparent',
                '&:hover': { backgroundColor: '#ddd' },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
