import React from 'react';
import { 
  Box, 
  Typography, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Grid,
  useTheme,
  Paper
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkIcon from '@mui/icons-material/Work';
import CampaignIcon from '@mui/icons-material/Campaign';
import BarChartIcon from '@mui/icons-material/BarChart';

function HireTalentPage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const features = [
    { icon: <AssignmentIcon color="primary" />, text: "Easy Job Posting" },
    { icon: <SearchIcon color="primary" />, text: "Candidate Search" },
    { icon: <CheckCircleIcon color="primary" />, text: "Applicant Tracking" },
    { icon: <WorkIcon color="primary" />, text: "Employer Branding" },
    { icon: <CampaignIcon color="primary" />, text: "Job Promotion" },
    { icon: <BarChartIcon color="primary" />, text: "Recruitment Analytics" },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          p: { xs: 3, sm: 6 },
          maxWidth: 900,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: { xs: 4, md: 6 }, 
            color: 'primary.main',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
          }}
        >
          Hire the Right Talent Quickly
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}> 
              <ListItem 
                sx={{ 
                  justifyContent: { xs: 'center', sm: 'flex-start' }, 
                  pr: 0,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 35,
                    color: 'primary.main'
                  }}
                >
                  {feature.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={feature.text} 
                  primaryTypographyProps={{ 
                    fontSize: '1.1rem',
                    color: 'text.primary'
                  }} 
                />
              </ListItem>
            </Grid>
          ))}
        </Grid>
        
        <Button
          variant="contained"
          sx={{
            mt: { xs: 4, md: 6 },
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 50,
            textTransform: 'none',
            boxShadow: theme.shadows[2],
            color: 'primary.contrastText',
          }}
          onClick={() => alert('Posting Your Job!')}
        >
          Post Your Job Now
        </Button>
      </Paper>
    </Box>
  );
}

export default HireTalentPage;