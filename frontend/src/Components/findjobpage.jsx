import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Grid, 
  Chip,
  Button,
  Container,
  useTheme
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

function FindJobPage() {
  const location = useLocation();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [jobs, setJobs] = useState([]);

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      posted: '2 days ago',
      description: 'We are looking for an experienced software engineer to join our team and help build innovative solutions.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS']
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Digital Creations',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      posted: '1 week ago',
      description: 'Join our frontend team to build amazing user experiences with modern web technologies.',
      skills: ['React', 'JavaScript', 'CSS', 'Redux']
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Web Innovators',
      location: 'Remote',
      type: 'Contract',
      salary: '$70 - $90/hr',
      posted: '3 days ago',
      description: 'Looking for a full stack developer to work on exciting projects using the latest technologies.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express']
    },
  ];

  const features = [
    { icon: <SearchIcon color="primary" />, text: "Advanced Job Filters" },
    { icon: <PsychologyIcon sx={{ color: '#8e44ad' }} />, text: "AI-Powered Recommendations" },
    { icon: <CheckCircleOutlineIcon color="primary" />, text: "One-Click Apply" },
    { icon: <PersonIcon color="primary" />, text: "Resume Builder" },
    { icon: <NotificationsIcon sx={{ color: '#f39c12' }} />, text: "Instant Job Alerts" },
    { icon: <TrackChangesIcon color="primary" />, text: "Track Applications" },
  ];

  useEffect(() => {
    if (location.state) {
      setSearchQuery(location.state.searchQuery || '');
      setSearchLocation(location.state.location || '');
      
      // Filter jobs based on search query and location
      const filtered = mockJobs.filter(job => {
        const matchesQuery = location.state.searchQuery 
          ? job.title.toLowerCase().includes(location.state.searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(location.state.searchQuery.toLowerCase()) ||
            job.skills.some(skill => 
              skill.toLowerCase().includes(location.state.searchQuery.toLowerCase())
            )
          : true;
          
        const matchesLocation = location.state.location
          ? job.location.toLowerCase().includes(location.state.location.toLowerCase()) || 
            job.location.toLowerCase() === 'remote'
          : true;
          
        return matchesQuery && matchesLocation;
      });
      
      setJobs(filtered);
    }
  }, [location.state]);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: { xs: 3, sm: 4 },
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <WorkOutlineIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography 
              variant="h5" 
              component="h1" 
              gutterBottom
              sx={{ color: 'text.primary' }}
            >
              {searchQuery 
                ? `Jobs matching "${searchQuery}"`
                : 'Browse All Jobs'}
              {searchLocation && ` in ${searchLocation}`}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {/* Job Listings */}
        <Box sx={{ mt: 3 }}>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Paper 
                key={job.id} 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{ color: 'text.primary' }}
                    >
                      {job.title}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      gutterBottom
                    >
                      {job.company}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnOutlinedIcon 
                          fontSize="small" 
                          color="action" 
                          sx={{ mr: 0.5 }} 
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {job.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessCenterOutlinedIcon 
                          fontSize="small" 
                          color="action" 
                          sx={{ mr: 0.5 }} 
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {job.type}
                        </Typography>
                      </Box>
                      {job.salary && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyOutlinedIcon 
                            fontSize="small" 
                            color="action" 
                            sx={{ mr: 0.5 }} 
                          />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {job.salary}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeOutlinedIcon 
                          fontSize="small" 
                          color="action" 
                          sx={{ mr: 0.5 }} 
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {job.posted}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      paragraph 
                      sx={{ mb: 2, color: 'text.secondary' }}
                    >
                      {job.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {job.skills.map((skill, index) => (
                        <Chip 
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ 
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                            color: 'text.primary',
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        minWidth: 120,
                        bgcolor: '#f79615',
                        '&:hover': {
                          bgcolor: '#e68913',
                        },
                      }}
                    >
                      Apply Now
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <WorkOutlineIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No jobs found
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Try adjusting your search or filter to find what you're looking for.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Find Your Dream Job
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Box 
                sx={{ 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                <Box sx={{ fontSize: '2.5rem', mb: 1 }}>
                  {feature.icon}
                </Box>
                <Typography variant="body2" align="center">
                  {feature.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default FindJobPage;