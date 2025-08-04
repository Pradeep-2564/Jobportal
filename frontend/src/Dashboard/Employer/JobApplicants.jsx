import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, Avatar, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Menu, MenuItem, IconButton, TextField, Divider, useTheme, useMediaQuery
} from '@mui/material';
import { MoreVert, Schedule, Download, Person, Email, Phone, Work, InsertDriveFile } from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLocation } from 'react-router-dom'; // Import useLocation

const JobApplicants = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [applicantList, setApplicantList] = useState([]);
  const [displayApplicantList, setDisplayApplicantList] = useState([]); // New state for filtered applicants
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({
    date: new Date(),
    time: new Date(),
    duration: 30,
    interviewer: '',
    meetingLink: ''
  });
  const location = useLocation(); // Get location for search query

  // Effect to load all applicants from localStorage initially
  useEffect(() => {
    const loadApplicants = () => {
      try {
        const applicants = JSON.parse(localStorage.getItem('job_applicants')) || [];
        setApplicantList(applicants);
      } catch (error) {
        console.error("Error loading applicants:", error);
        setApplicantList([]);
      }
    };
    loadApplicants();
  }, []);

  // Effect to filter applicants based on search query
  useEffect(() => {
    let filtered = [...applicantList]; // Start with all applicants

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search'); // Get the 'search' parameter

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(applicant =>
        (applicant.name && applicant.name.toLowerCase().includes(lowerCaseSearchQuery)) || // Applicant name
        (applicant.status && applicant.status.toLowerCase().includes(lowerCaseSearchQuery)) // Status
      );
    }

    setDisplayApplicantList(filtered); // Update the state with filtered applicants
  }, [applicantList, location.search]); // Re-filter whenever base applicantList or search query changes

  const truncateEmail = (email, maxLength) => {
    if (email && email.length > maxLength) {
      return email.substring(0, maxLength) + '...';
    }
    return email;
  };

  const handleDownloadResume = (applicant) => {
    if (!applicant.resume) {
      console.warn("No resume available for this applicant");
      return;
    }

    try {
      const resumeData = applicant.resume;
      const resumeUrl = typeof resumeData === 'string' ? resumeData : resumeData.url;
      const fileName = typeof resumeData === 'string'
        ? `${applicant.name}_resume.pdf`
        : resumeData.name || `${applicant.name}_resume.pdf`;

      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const persistList = (updatedList) => {
    try {
      localStorage.setItem('job_applicants', JSON.stringify(updatedList));
      setApplicantList(updatedList); // Update base applicantList state
    } catch (error) {
      console.error("Error saving applicants:", error);
    }
  };

  const updateAppliedJobs = (applicant) => {
    try {
      const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs')) || [];
      const index = appliedJobs.findIndex(app => app.id === applicant.id);
      if (index !== -1) {
        appliedJobs[index] = applicant;
      } else {
        appliedJobs.push(applicant);
      }
      localStorage.setItem('applied_jobs', JSON.stringify(appliedJobs));
    } catch (error) {
      console.error("Error updating applied jobs:", error);
    }
  };

  const pushNotification = (applicant, status) => {
    try {
      const jobseekerNotifications = JSON.parse(localStorage.getItem("jobseeker_notifications")) || [];
      const timestamp = new Date().toISOString();

      const notification = {
        id: `notif_${Date.now()}`,
        jobId: applicant.jobId,
        read: false,
        timestamp,
        type: status === "Interview Scheduled" ? "interviewscheduled"
          : status === "On Hold" ? "onhold"
            : "rejected",
        title: status === "Interview Scheduled" ? "Interview Scheduled"
          : status === "On Hold" ? "Application On Hold"
            : "Application Rejected",
        message: status === "Interview Scheduled"
          ? `Your interview for ${applicant.appliedFor} has been scheduled.`
          : status === "On Hold"
            ? `Your application for ${applicant.appliedFor} is put on hold.`
            : `Your application for ${applicant.appliedFor} has been rejected.`
      };

      jobseekerNotifications.push(notification);
      localStorage.setItem("jobseeker_notifications", JSON.stringify(jobseekerNotifications));
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error("Error pushing notification:", error);
    }
  };

  const handleMenuOpen = (e, app) => {
    setSelectedApplicant(app);
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedApplicant(null);
    setMenuAnchor(null);
  };

  const handleAction = (newStatus) => {
    const updatedList = applicantList.map(app =>
      app.id === selectedApplicant.id ? { ...app, status: newStatus } : app
    );
    persistList(updatedList); // This will trigger re-rendering of the table via displayApplicantList
    const updatedApplicant = { ...selectedApplicant, status: newStatus };
    updateAppliedJobs(updatedApplicant);
    pushNotification(updatedApplicant, newStatus);
    handleMenuClose();
  };

  const handleScheduleInterview = () => {
    handleAction('Interview Scheduled');

    try {
      const interviewHistory = JSON.parse(localStorage.getItem("interview_history")) || [];
      interviewHistory.push({
        candidate: selectedApplicant.name,
        profileImage: selectedApplicant.profileImage,
        email: selectedApplicant.email,
        position: selectedApplicant.appliedFor,
        status: 'Scheduled',
        date: interviewDetails.date.toLocaleDateString(),
        time: interviewDetails.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: interviewDetails.duration,
        interviewer: interviewDetails.interviewer,
        meetingLink: interviewDetails.meetingLink
      });
      localStorage.setItem("interview_history", JSON.stringify(interviewHistory));
    } catch (error) {
      console.error("Error saving interview history:", error);
    }
    setOpenScheduleDialog(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Work sx={{ fontSize: { xs: 30, sm: 36 }, color: theme.palette.primary.main }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.dark, fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Job Applicants
          </Typography>
        </Box>

        {displayApplicantList.length === 0 ? ( // Use displayApplicantList here
          <Paper sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', borderRadius: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {location.search ? "No applicants found matching your search." : "No applicants found."}
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: theme.shadows[2] }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900, tableLayout: 'fixed' }}>
                <TableHead sx={{ backgroundColor: theme.palette.primary.light + '15' }}>
                  <TableRow>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '5%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>#</TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '18%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person fontSize="small" />
                        Applicant
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '18%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" />
                        Email
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '12%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" />
                        Phone
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '17%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Work fontSize="small" />
                        Applied For
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '10%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Status</TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '10%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Resume</TableCell>
                    <TableCell sx={{ py: { xs: 1.5, sm: 3 }, fontWeight: 600, width: '10%', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {displayApplicantList.map((app, index) => ( // Use displayApplicantList here
                    <TableRow key={app.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '5%', fontSize: { xs: '0.75rem', sm: 'inherit' } }}>{index + 1}</TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '18%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 40 },
                              height: { xs: 32, sm: 40 },
                              bgcolor: theme.palette.primary.main,
                              border: `2px solid ${theme.palette.primary.light}`
                            }}
                            src={app.profileImage || ''}
                          >
                            {app.profileImage ? '' : app.name?.charAt(0) || '?'}
                          </Avatar>
                          <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                            {app.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '18%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          {truncateEmail(app.email, isSmallScreen ? 10 : 15)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '12%', fontSize: { xs: '0.85rem', sm: 'inherit' } }}>{app.phone}</TableCell>

                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '17%' }}>
                        <Chip
                          label={app.appliedFor}
                          size="small"
                          sx={{
                            backgroundColor: theme.palette.primary.light + '20',
                            color: theme.palette.primary.dark,
                            fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '10%' }}>
                        <Chip
                          label={app.status}
                          variant="filled"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                            backgroundColor:
                              app.status === 'Interview Scheduled' ? theme.palette.success.light + '80' :
                                app.status === 'Rejected' ? theme.palette.error.light + '80' :
                                  app.status === 'On Hold' ? theme.palette.warning.light + '80' :
                                    theme.palette.grey[300],
                            color:
                              app.status === 'Interview Scheduled' ? theme.palette.getContrastText(theme.palette.success.dark) :
                                app.status === 'Rejected' ? theme.palette.getContrastText(theme.palette.error.dark) :
                                  app.status === 'On Hold' ? theme.palette.getContrastText(theme.palette.warning.dark) :
                                    theme.palette.text.primary
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '10%', textAlign: 'center' }}>
                        {app.resume ? (
                          <Button
                            startIcon={<InsertDriveFile />}
                            onClick={() => handleDownloadResume(app)}
                            sx={{
                              textTransform: 'none',
                              borderColor: theme.palette.divider,
                              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                              px: { xs: 0.5, sm: 1 },
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light + '20'
                              }
                            }}
                          >
                            <Typography variant="body2" noWrap sx={{ fontSize: 'inherit' }}>
                              Download
                            </Typography>
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            No resume
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ py: { xs: 1, sm: 2 }, width: '10%', textAlign: 'center' }}>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, app)}
                          size={isSmallScreen ? "small" : "medium"}
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light + '20'
                            }
                          }}
                        >
                          <MoreVert sx={{ color: theme.palette.text.secondary }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              minWidth: 200
            }
          }}
        >
          <MenuItem onClick={() => setOpenScheduleDialog(true)} sx={{ py: 1 }}>
            <Schedule sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1.5 }} />
            Schedule Interview
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={() => handleAction('Rejected')} sx={{ py: 1 }}>
            <Box sx={{
              width: 24,
              height: 24,
              bgcolor: theme.palette.error.light + '40',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5
            }}>
              <Typography color="error.main" variant="body2">✕</Typography>
            </Box>
            Reject
          </MenuItem>
          <MenuItem onClick={() => handleAction('On Hold')} sx={{ py: 1 }}>
            <Box sx={{
              width: 24,
              height: 24,
              bgcolor: theme.palette.warning.light + '40',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5
            }}>
              <Typography color="warning.main" variant="body2">!</Typography>
            </Box>
            On Hold
          </MenuItem>
        </Menu>

        <Dialog
          open={openScheduleDialog}
          onClose={() => setOpenScheduleDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, mx: { xs: 1, sm: 'auto' } } }}
        >
          <DialogTitle sx={{
            bgcolor: theme.palette.primary.light + '15',
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 2
          }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Schedule color="primary" sx={{ fontSize: { xs: 24, sm: 28 } }} />
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Schedule Interview
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3} sx={{mt:3}}>
              <Grid item xs={12} sm={6} sx={{ '& .MuiFormLabel-root': { mb: 1 } }}>
                <DatePicker
                  label="Date"
                  value={interviewDetails.date}
                  onChange={date => setInterviewDetails({ ...interviewDetails, date })}
                  slotProps={{ textField: { fullWidth: true, sx: { borderRadius: 2 }}}}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ '& .MuiFormLabel-root': { mb: 1 } }}>
                <TimePicker
                  label="Time"
                  value={interviewDetails.time}
                  onChange={time => setInterviewDetails({ ...interviewDetails, time })}
                  slotProps={{ textField: { fullWidth: true, sx: { borderRadius: 2 }}}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  fullWidth
                  value={interviewDetails.duration}
                  onChange={e => setInterviewDetails({
                    ...interviewDetails,
                    duration: e.target.value
                  })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Interviewer Name"
                  fullWidth
                  value={interviewDetails.interviewer}
                  onChange={e => setInterviewDetails({
                    ...interviewDetails,
                    interviewer: e.target.value
                  })}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meeting Link"
                  fullWidth
                  value={interviewDetails.meetingLink}
                  onChange={e => setInterviewDetails({
                    ...interviewDetails,
                    meetingLink: e.target.value
                  })}
                  placeholder="https://meet.google.com/abc-xyz"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button
              onClick={() => setOpenScheduleDialog(false)}
              sx={{
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                borderRadius: 2,
                fontSize: { xs: '0.8rem', sm: 'inherit' }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleInterview}
              variant="contained"
              sx={{
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                borderRadius: 2,
                boxShadow: 'none',
                fontSize: { xs: '0.8rem', sm: 'inherit' }
              }}
            >
              Schedule Interview
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default JobApplicants;