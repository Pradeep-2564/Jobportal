import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Modal, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, Paper, useMediaQuery, TableContainer
} from '@mui/material';
import {
  Close as CloseIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  AssignmentTurnedIn as AppliedIcon,
  Chat as ContactedIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material';

const EmployerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userFirstName, setUserFirstName] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    closedJobs: 0,
    scheduledInterviews: 0,
    newApplicants: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('logged_in_user')) || null;
    if (user?.name) {
      const firstName = user.name.split(' ')[0];
      setUserFirstName(firstName);
    }
    const jobs = JSON.parse(localStorage.getItem('job_posts')) || [];
    const jobseekers = JSON.parse(localStorage.getItem('jobseekers')) || [];
    const interviews = JSON.parse(localStorage.getItem('interview_history')) || [];
    const applicants = JSON.parse(localStorage.getItem('job_applicants')) || [];
    const appliedJobs = applicants.filter(app =>
      ['Applied', 'Interview Scheduled', 'On Hold', 'Rejected'].includes(app.status)
    );
    setStats({
      totalJobs: jobs.length,
      totalApplicants: jobseekers.length,
      closedJobs: jobs.filter(j => j.status === 'Closed').length,
      scheduledInterviews: interviews.filter(i => i.status === 'Scheduled').length,
      newApplicants: appliedJobs.length,
    });
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalApplicants,
      color: 'linear-gradient(135deg, #8E24AA, #D81B60)',
      icon: <PeopleIcon fontSize="large" sx={{ color: 'white' }} />
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      color: 'linear-gradient(135deg, #1E88E5, #1565C0)',
      icon: <WorkIcon fontSize="large" sx={{ color: 'white' }} />
    },
    {
      title: 'Applied Jobs',
      value: stats.newApplicants,
      color: 'linear-gradient(135deg, #00ACC1, #43A047)',
      icon: <AppliedIcon fontSize="large" sx={{ color: 'white' }} />
    },
    {
      title: 'Contacted Users',
      value: stats.scheduledInterviews,
      color: 'linear-gradient(135deg, #FB8C00, #EF6C00)',
      icon: <ContactedIcon fontSize="large" sx={{ color: 'white' }} />
    },
  ];

  const openModalWithData = (card) => {
    let data = [];
    if (card.title === 'Total Users') {
      data = JSON.parse(localStorage.getItem('jobseekers')) || [];
    } else if (card.title === 'Total Jobs') {
      data = JSON.parse(localStorage.getItem('job_posts')) || [];
    } else if (card.title === 'Applied Jobs') {
      const applicants = JSON.parse(localStorage.getItem('job_applicants')) || [];
      data = applicants.filter(app =>
        ['Applied', 'Interview Scheduled', 'On Hold', 'Rejected'].includes(app.status)
      );
    } else if (card.title === 'Contacted Users') {
      data = (JSON.parse(localStorage.getItem('interview_history')) || []).filter(i => i.status === 'Scheduled');
    }
    setModalTitle(card.title);
    setModalData(data);
    setModalOpen(true);
  };

  const renderTable = (data) => {
    if (!data || data.length === 0 || !data[0]) {
      return <Typography variant="body1" sx={{ mt: 2 }}>No records found.</Typography>;
    }

    const keys = Object.keys(data[0]);
    return (
      <TableContainer sx={{ maxHeight: isMobile ? '60vh' : 'auto', overflowX: 'auto' }}> {/* Responsive height and horizontal scroll */}
        <Table size="small" sx={{ minWidth: isMobile ? 600 : 'auto', mt: 2 }}> {/* Minimum width for smaller screens */}
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              {keys.map((key, i) => (
                <TableCell key={i} sx={{ fontWeight: 'bold' }}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} hover>
                {keys.map((k, i) => (
                  <TableCell key={i}>
                    {typeof row[k] === 'object' ? JSON.stringify(row[k]) : String(row[k])} {/* Ensure all values are renderable as string */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      <Box sx={{ px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, sm: 4, md: 6 } }}> {/* Responsive padding */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}> {/* Responsive font size */}
          Welcome, {userFirstName || 'Recruiter'}!
        </Typography>

        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={6}
                sx={{
                  p: { xs: 2, sm: 3 }, // Responsive padding
                  background: card.color,
                  color: '#fff',
                  borderRadius: 3,
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
                onClick={() => openModalWithData(card)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}> {/* Responsive font size */}
                    {card.title}
                  </Typography>
                  {React.cloneElement(card.icon, { sx: { fontSize: { xs: '2rem', sm: '2.5rem' }, color: 'white' } })} {/* Responsive icon size */}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}> {/* Responsive font size */}
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal Section */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute', // Changed from fixed to absolute to behave better inside layout
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '95%' : '85%',
            maxWidth: '1000px', // Added max-width to control size on large screens
            maxHeight: '90vh', // Increased max-height
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
            borderRadius: 2,
            overflow: 'hidden', // Changed to hidden as TableContainer handles overflow
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ position: 'relative', flexShrink: 0 }}> {/* Prevents title/button from scrolling */}
            <IconButton
              sx={{
                position: 'absolute',
                top: { xs: 0, sm: 8 }, // Adjusted top for small screens
                right: { xs: 0, sm: 8 }, // Adjusted right for small screens
                color: theme.palette.grey[500],
                '&:hover': {
                  color: theme.palette.grey[700],
                }
              }}
              onClick={() => setModalOpen(false)}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, pr: { xs: 4, sm: 0 } }}> {/* Added right padding to prevent text overlap with close button */}
              {modalTitle}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* Makes content scrollable */}
            {modalData.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 2 }}>No records found.</Typography>
            ) : (
              renderTable(modalData)
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmployerDashboard;