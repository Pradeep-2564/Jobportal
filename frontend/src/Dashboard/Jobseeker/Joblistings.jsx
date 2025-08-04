import React, { useEffect, useState } from 'react';
import {
  Box, TableContainer, Table, TableHead, TableBody, TableRow,
  TableCell, Typography, Paper, Tooltip, IconButton, Button, Chip,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  Bookmark as BookmarkIcon,
  BookmarkBorderOutlined as BookmarkBorderIcon,
  SendOutlined as ApplyIcon,
  WorkOutline,
  LocationOnOutlined,
  ScheduleOutlined,
  BookmarkBorder
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobListings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const allJobs = JSON.parse(localStorage.getItem('job_posts')) || [];
    const jobsWithFlags = allJobs.map(j => ({
      ...j,
      saved: j.saved || false,
      applied: j.applied || false
    }));
    setJobs(jobsWithFlags);

    const apps = JSON.parse(localStorage.getItem('job_applicants')) || [];
    setApplicants(apps);
  }, [location.pathname]);

  useEffect(() => {
    let currentJobs = [...jobs];
    const type = () => {
      if (location.pathname.includes('/saved')) return 'saved';
      if (location.pathname.includes('/applied')) return 'applied';
      return 'all';
    };

    currentJobs = currentJobs.filter(j =>
      type() === 'saved' ? j.saved :
      type() === 'applied' ? j.applied : true
    );

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentJobs = currentJobs.filter(job => {
        const jobStatus = applicants.find(app => app.jobId === job.id)?.status || (job.applied ? 'Applied' : '');

        return (
          (job.title && job.title.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (job.jobLevel && job.jobLevel.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (job.location && job.location.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (job.status && job.status.toLowerCase().includes(lowerCaseSearchQuery)) ||
          (jobStatus && jobStatus.toLowerCase().includes(lowerCaseSearchQuery))
        );
      });
    }
    
    setDisplayJobs(currentJobs);
  }, [jobs, applicants, location.pathname, location.search]);

  const persistJobs = updated => {
    setJobs(updated);
    localStorage.setItem('job_posts', JSON.stringify(updated));
  };

  const handleToggleSave = (e, id) => {
    e.stopPropagation();
    const updated = jobs.map(j =>
      j.id === id
        ? (toast.success(!j.saved ? 'Saved job!' : 'Unsaved job!'), { ...j, saved: !j.saved })
        : j
    );
    persistJobs(updated);
  };

  const handleApply = (e, job) => {
    e.stopPropagation();
    if (job.applied) return;

    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const resumeData = JSON.parse(localStorage.getItem('userResume')) || null;
    const education = JSON.parse(localStorage.getItem('userEducation')) || [];
    const skills = JSON.parse(localStorage.getItem('userSkills')) || [];
    const quickLinks = JSON.parse(localStorage.getItem('userQuickLinks')) || {};
    const profileImage = localStorage.getItem('userProfileImage') || '';

    const applicant = {
      id: Date.now(),
      name: profile.name || 'Jobseeker',
      email: profile.contact || 'email@example.com',
      phone: profile.phone || '0000000000',
      appliedFor: job.title,
      jobId: job.id,
      status: 'Applied',
      resume: resumeData,
      profileImage: profileImage,
      fullProfile: { 
        ...profile, 
        education, 
        skills, 
        quickLinks,
        resume: resumeData
      }
    };

    const updatedJobs = jobs.map(j => j.id === job.id ? { ...j, applied: true } : j);
    persistJobs(updatedJobs);
    toast.success('Applied successfully!');

    const updatedApplicants = [...applicants, applicant];
    setApplicants(updatedApplicants);
    localStorage.setItem('job_applicants', JSON.stringify(updatedApplicants));

    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs')) || [];
    appliedJobs.push(applicant);
    localStorage.setItem('applied_jobs', JSON.stringify(appliedJobs));

    const recruiterNotifications = JSON.parse(localStorage.getItem('recruiter_notifications')) || [];
    recruiterNotifications.unshift({
      id: Date.now(),
      type: 'application',
      jobId: job.id,
      message: `New application for ${job.title}`,
      read: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recruiter_notifications', JSON.stringify(recruiterNotifications));
  };

  const title = {
    all: 'All Jobs',
    saved: 'Saved Jobs',
    applied: 'Applied Jobs'
  };

  const type = () => {
    if (location.pathname.includes('/saved')) return 'saved';
    if (location.pathname.includes('/applied')) return 'applied';
    return 'all';
  };

  const getApplicationStatus = job => {
    const app = applicants.find(a => a.jobId === job.id);
    return app?.status || (job.applied ? 'Applied' : 'N/A');
  };

  return (
    <Box sx={{ 
      p: 1,
      minHeight: '100vh',
      width: '100%'
    }}>
      <Typography variant="h5" sx={{ 
        mb: 2, 
        fontWeight: 700,
        color: theme.palette.primary.dark,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WorkOutline sx={{ fontSize: 24, color: theme.palette.primary.main }} />
        {title[type()]}
      </Typography>

      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
      
      <TableContainer 
        component={Paper}
        sx={{ 
          borderRadius: 1, 
          boxShadow: theme.shadows[1]
        }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: theme.palette.primary.light + '15' }}>
            <TableRow>
              {['No.', 'Job Title', 'Experience', 'Location', 'Job Status', 'Save', 'Apply Status'].map((h, index) => (
                <TableCell 
                  key={h} 
                  align={index === 0 ? 'center' : 'left'}
                  sx={{ 
                    py: 1,
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    ...(index === 0 && { width: '40px' }),
                    ...(isMobile && { px: 0.5 })
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    justifyContent: index === 0 ? 'center' : 'flex-start'
                  }}>
                    {h === 'Location' && <LocationOnOutlined fontSize="small" />}
                    {h === 'Experience' && <ScheduleOutlined fontSize="small" />}
                    {h === 'Save' && <BookmarkBorder fontSize="small" />}
                    {isMobile ? (index === 0 ? '#' : h.split(' ')[0]) : h}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayJobs.length > 0 ? (
              displayJobs.map((j, i) => (
                <TableRow
                  key={j.id}
                  hover
                  onClick={() => navigate(`/dashboard/jobseeker/joblistings/${j.id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:last-child td': { border: 0 },
                    '&:hover': { backgroundColor: theme.palette.action.hover }
                  }}
                >
                  <TableCell 
                    align="center" 
                    sx={{ 
                      py: 1,
                      fontWeight: 500,
                      px: isMobile ? 0.5 : 1
                    }}
                  >
                    {i + 1}
                  </TableCell>
                  
                  <TableCell sx={{ py: 1, px: isMobile ? 0.5 : 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {j.title || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1, px: isMobile ? 0.5 : 1 }}>
                    {j.jobLevel || '-'}
                  </TableCell>

                  <TableCell sx={{ py: 1, px: isMobile ? 0.5 : 1 }}>
                    <Chip 
                      label={j.location || '-'} 
                      size="small" 
                      sx={{ 
                        backgroundColor: theme.palette.primary.light + '20',
                        color: theme.palette.primary.dark
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ py: 1, px: isMobile ? 0.5 : 1 }}>
                    <Chip 
                      label={j.status} 
                      color={j.status === 'Open' ? 'success' : 'error'} 
                      size="small"
                      sx={{
                        fontWeight: 500,
                        backgroundColor: j.status === 'Open' 
                          ? theme.palette.success.light + '100' 
                          : theme.palette.error.light + '100'
                      }}
                    />
                  </TableCell>

                  <TableCell 
                    onClick={e => e.stopPropagation()} 
                    sx={{ py: 1, px: isMobile ? 0.5 : 1 }}
                  >
                    <Tooltip title={j.saved ? 'Unsave job' : 'Save job'}>
                      <IconButton 
                        onClick={(e) => handleToggleSave(e, j.id)} 
                        size="small"
                        sx={{
                          color: j.saved ? theme.palette.primary.main : theme.palette.text.secondary
                        }}
                      >
                        {j.saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>

                  <TableCell 
                    onClick={e => e.stopPropagation()} 
                    sx={{ py: 1, px: isMobile ? 0.5 : 1 }}
                  >
                    {j.applied ? (
                      <Chip
                        label={getApplicationStatus(j)}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          backgroundColor:
                            getApplicationStatus(j) === 'Interview Scheduled' ? theme.palette.success.light + '80' :
                            getApplicationStatus(j) === 'Rejected' ? theme.palette.error.light + '80' :
                            getApplicationStatus(j) === 'On Hold' ? theme.palette.warning.light + '80' :
                            theme.palette.grey[300]
                        }}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={!isMobile && <ApplyIcon />}
                        onClick={(e) => handleApply(e, j)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 1,
                          px: 1,
                          boxShadow: 'none'
                        }}
                      >
                        {isMobile ? 'Apply' : 'Apply'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No jobs found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JobListings;