import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Tooltip, IconButton, Button, Chip, useTheme, useMediaQuery
} from '@mui/material';
import { EditOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const JobLists = () => {
  const [jobs, setJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]); // New state for filtered jobs
  const navigate = useNavigate();
  const location = useLocation(); // Get location for search query
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Effect to load all jobs from localStorage initially
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('job_posts')) || [];
    setJobs(savedJobs);
  }, []);

  // Effect to filter jobs based on search query and other criteria
  useEffect(() => {
    let filtered = [...jobs]; // Start with all jobs

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search'); // Get the 'search' parameter

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(lowerCaseSearchQuery)) || // Position/Job Title
        (job.jobLevel && job.jobLevel.toLowerCase().includes(lowerCaseSearchQuery)) || // Experience
        (job.location && job.location.toLowerCase().includes(lowerCaseSearchQuery)) || // Location
        (job.status && job.status.toLowerCase().includes(lowerCaseSearchQuery)) // Status
      );
    }
    
    setDisplayJobs(filtered); // Update the state with filtered jobs
  }, [jobs, location.search]); // Re-filter whenever base jobs or search query changes

  const saveToLocal = (updatedJobs) => {
    localStorage.setItem('job_posts', JSON.stringify(updatedJobs));
  };

  const handleDeleteJob = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    saveToLocal(updatedJobs);
    setJobs(updatedJobs); // Update base jobs state, which will trigger displayJobs update
  };

  const handleEditJob = (job) => {
    navigate('/dashboard/recruiter/job-posting', { state: { job } });
  };

  const handleToggleStatus = (jobId) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? {
        ...job,
        status: job.status === 'Open' ? 'Closed' : 'Open'
      } : job
    );

    const job = jobs.find(j => j.id === jobId);
    if (job && job.status === 'Open') {
      const notification = {
        id: Date.now(),
        title: 'Job Closed',
        message: `The job "${job.title}" has been closed.`,
        type: 'job_closed',
        read: false,
        timestamp: new Date().toISOString(),
      };

      const existingNotifications = JSON.parse(localStorage.getItem("jobseeker_notifications")) || [];
      existingNotifications.push(notification);
      localStorage.setItem("jobseeker_notifications", JSON.stringify(existingNotifications));
      window.dispatchEvent(new CustomEvent("notificationsUpdated"));
    }

    saveToLocal(updatedJobs);
    setJobs(updatedJobs); // Update base jobs state, which will trigger displayJobs update
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 3 },
      backgroundColor: 'background.default',
      minHeight: '100vh'
    }}>
      <Typography variant="h5" mb={3} sx={{
        fontWeight: 600,
        color: 'text.primary',
        letterSpacing: '-0.015em',
        fontFamily: 'inherit',
        fontSize: { xs: '1.25rem', sm: '1.5rem' }
      }}>
        Active Job Postings
      </Typography>

      <TableContainer component={Paper} sx={{
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        overflowX: 'auto'
      }}>
        <Table sx={{ minWidth: isSmallScreen ? 700 : 800 }}>
          <TableHead sx={{ bgcolor: 'background.paper' }}>
            <TableRow>
              {['#', 'Position', 'Experience', 'Location', 'Status', 'Actions'].map((header) => (
                <TableCell
                  key={header}
                  align={header === '#' ? 'center' : 'left'}
                  sx={{
                    py: { xs: 1.5, sm: 2.5 },
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    color: 'text.secondary',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayJobs.length > 0 ? ( // Render displayJobs here
              displayJobs.map((job, index) => (
                <TableRow
                  key={job.id}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell align="center" sx={{
                    color: 'text.secondary',
                    width: '5%',
                    fontSize: { xs: '0.8rem', sm: 'inherit' }
                  }}>
                    {index + 1}
                  </TableCell>

                  <TableCell sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: { xs: '0.85rem', sm: '0.95rem' }
                  }}>
                    {job.title}
                  </TableCell>

                  <TableCell sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: 'inherit' } }}>
                    {job.jobLevel}
                  </TableCell>

                  <TableCell sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: 'inherit' } }}>
                    {job.location}
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => handleToggleStatus(job.id)}
                      size="small"
                      variant="contained"
                      color={job.status === 'Open' ? 'success' : 'error'}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: { xs: 1.5, sm: 2.5 },
                        py: { xs: 0.5, sm: 0.8 },
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {job.status}
                    </Button>
                  </TableCell>

                  <TableCell align="left" sx={{ pl: { xs: 1, sm: 3 } }}>
                    <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
                      <IconButton
                        onClick={() => handleEditJob(job)}
                        size={isSmallScreen ? "small" : "medium"}
                      >
                        <EditOutlined fontSize="small" />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDeleteJob(job.id)}
                        size={isSmallScreen ? "small" : "medium"}
                      >
                        <DeleteOutlineOutlined fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{
                  py: { xs: 4, sm: 6 },
                  textAlign: 'center',
                  color: 'text.disabled',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  {location.search ? "No jobs found matching your search criteria." : "No active job postings found"}
                  {!location.search && (
                    <Typography variant="body2" sx={{ mt: 1, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      Click the "New Posting" button to create your first job listing
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JobLists;