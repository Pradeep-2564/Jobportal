import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Topbar = ({ toggleTheme, currentTheme }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      color="default"
      sx={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" color="textPrimary">
          Dashboard
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f3f4',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            width: '40%',
          }}
        >
          <SearchIcon color="action" />
          <InputBase placeholder="Search anything..." sx={{ ml: 1, flex: 1 }} />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="contained" sx={{ borderRadius: 5 }} disableElevation>
            Create
          </Button>
          <IconButton onClick={toggleTheme}>
            {currentTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Avatar alt="User" src="/user.jpg" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
