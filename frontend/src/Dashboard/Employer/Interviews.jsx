// src/components/Interviews.jsx (Full Updated Code)
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, Chip, Avatar, IconButton,
  Collapse, Grid, Link as MuiLink, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Button, useTheme, useMediaQuery
} from '@mui/material';
import {
  KeyboardArrowDown, KeyboardArrowUp, Person, Link, MoreVert
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Interviews = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [interviews, setInterviews] = useState([]);
  const [displayInterviews, setDisplayInterviews] = useState([]); // New state for filtered interviews
  const [expandedRow, setExpandedRow] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [rescheduleDetails, setRescheduleDetails] = useState({
    date: new Date(),
    time: new Date(),
    duration: 30,
    interviewer: '',
    meetingLink: '',
  });
  const location = useLocation(); // Get location for search query

  // Effect to load all interviews from localStorage initially
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("interview_history")) || [];
    setInterviews(savedHistory);
  }, []);

  // Effect to filter interviews based on search query
  useEffect(() => {
    let filtered = [...interviews]; // Start with all interviews

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search'); // Get the 'search' parameter

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(interview =>
        (interview.position && interview.position.toLowerCase().includes(lowerCaseSearchQuery)) || // Job Position
        (interview.status && interview.status.toLowerCase().includes(lowerCaseSearchQuery)) // Status
      );
    }
    
    setDisplayInterviews(filtered); // Update the state with filtered interviews
  }, [interviews, location.search]); // Re-filter whenever base interviews or search query changes

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'Rescheduled': return 'warning';
      default: return 'default';
    }
  };

  const handleMenuOpen = (e, interview) => {
    setSelectedInterview(interview);
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setSelectedInterview(null);
    setMenuAnchor(null);
    setActionType(null);
  };

  const handleActionInit = (type) => {
    setActionType(type);
    if (type === 'reschedule') {
      setRescheduleDetails({
        date: selectedInterview.date ? new Date(selectedInterview.date) : new Date(), // Initialize with current interview date
        time: selectedInterview.time ? new Date(`1970/01/01 ${selectedInterview.time}`) : new Date(), // Initialize with current interview time
        duration: selectedInterview.duration || 30,
        interviewer: selectedInterview.interviewer || '',
        meetingLink: selectedInterview.meetingLink || '',
      });
    }
    setMenuAnchor(null);
  };

  const pushNotificationToJobseeker = (type, message, jobId = null) => {
    const notifications = JSON.parse(localStorage.getItem("jobseeker_notifications")) || [];
    const newNotification = {
      id: Date.now(),
      title:
        type === "complete"
          ? "Interview Completed"
          : type === "cancel"
          ? "Interview Cancelled"
          : "Interview Rescheduled",
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type,
      jobId
    };
    notifications.unshift(newNotification);
    localStorage.setItem("jobseeker_notifications", JSON.stringify(notifications));
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  const handleCompleteInterview = () => {
    const updated = interviews.map(interview =>
      interview === selectedInterview ? { ...interview, status: 'Completed' } : interview
    );
    setInterviews(updated); // Update base interviews state
    localStorage.setItem("interview_history", JSON.stringify(updated));

    pushNotificationToJobseeker(
      'complete',
      `Your interview for ${selectedInterview.position} has been marked as completed.`,
      selectedInterview.jobId || null
    );

    handleMenuClose();
  };

  const handleCancelInterview = () => {
    const updated = interviews.map(interview =>
      interview === selectedInterview ? { ...interview, status: 'Cancelled' } : interview
    );
    setInterviews(updated); // Update base interviews state
    localStorage.setItem("interview_history", JSON.stringify(updated));

    pushNotificationToJobseeker(
      'cancel',
      `Your interview for ${selectedInterview.position} has been cancelled.`,
      selectedInterview.jobId || null
    );

    handleMenuClose();
  };

  const handleRescheduleInterview = () => {
    const updated = interviews.map(interview => {
      if (interview === selectedInterview) {
        return {
          ...interview,
          status: 'Rescheduled',
          date: rescheduleDetails.date.toLocaleDateString(),
          time: rescheduleDetails.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: rescheduleDetails.duration,
          interviewer: rescheduleDetails.interviewer,
          meetingLink: rescheduleDetails.meetingLink,
        };
      }
      return interview;
    });
    setInterviews(updated); // Update base interviews state
    localStorage.setItem("interview_history", JSON.stringify(updated));

    pushNotificationToJobseeker(
      'reschedule',
      `Your interview for ${selectedInterview.position} has been rescheduled.`,
      selectedInterview.jobId || null
    );

    handleMenuClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={{ xs: 2, md: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>Interview Schedule</Typography>

        {displayInterviews.length === 0 ? ( // Render displayInterviews here
          <Typography>
            {location.search ? "No interviews found matching your search." : "No interviews scheduled yet."}
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}>Candidate</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}>Position</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}>Status</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}>Date</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}>Time</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: 'inherit' } }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayInterviews.map((interview, index) => ( // Render displayInterviews here
                  <React.Fragment key={index}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton size="small" onClick={() => toggleRow(index)}>
                          {expandedRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar
                            sx={{ mr: { xs: 1, sm: 2 }, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                            src={interview.profileImage || ''}
                          >
                            {interview.profileImage ? '' : interview.candidate?.charAt(0) || '?'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>
                            {interview.candidate}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>{interview.position}</TableCell>
                      <TableCell>
                        <Chip label={interview.status} color={getStatusColor(interview.status)} sx={{ fontSize: { xs: '0.7rem', sm: 'inherit' } }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>{interview.date}</TableCell>
                      <TableCell sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>{interview.time}</TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, interview)} size={isSmallScreen ? "small" : "medium"}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ p: 0 }}>
                        <Collapse in={expandedRow === index}>
                          <Box m={{ xs: 1.5, sm: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', sm: 'inherit' } }}><Person sx={{ mr: 1, fontSize: { xs: 18, sm: 'inherit' } }} /> Interview Details</Typography>
                                <Typography sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}><strong>Interviewer:</strong> {interview.interviewer}</Typography>
                                <Typography sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}><strong>Duration:</strong> {interview.duration} min</Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.9rem', sm: 'inherit' } }}><Link sx={{ mr: 1, fontSize: { xs: 18, sm: 'inherit' } }} /> Meeting Link</Typography>
                                <MuiLink href={interview.meetingLink} target="_blank" sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' }, wordBreak: 'break-all' }}>{interview.meetingLink}</MuiLink>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              minWidth: 180,
            }
          }}
        >
          <MenuItem onClick={() => handleActionInit('complete')} sx={{ py: 1, fontSize: { xs: '0.875rem', sm: 'inherit' } }}>
            Mark as Completed
          </MenuItem>
          <MenuItem onClick={() => handleActionInit('cancel')} sx={{ py: 1, fontSize: { xs: '0.875rem', sm: 'inherit' } }}>
            Cancel Interview
          </MenuItem>
          <MenuItem onClick={() => handleActionInit('reschedule')} sx={{ py: 1, fontSize: { xs: '0.875rem', sm: 'inherit' } }}>
            Reschedule Interview
          </MenuItem>
        </Menu>

        <Dialog open={actionType === 'complete'} onClose={handleMenuClose} maxWidth="xs" fullWidth PaperProps={{ sx: { mx: { xs: 1, sm: 'auto' } } }}>
          <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Confirm Completion</DialogTitle>
          <DialogContent><DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: 'inherit' } }}>Mark this interview as completed?</DialogContentText></DialogContent>
          <DialogActions>
            <Button onClick={handleMenuClose} sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>Cancel</Button>
            <Button variant="contained" onClick={handleCompleteInterview} color="success" sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>Complete</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={actionType === 'cancel'} onClose={handleMenuClose} maxWidth="xs" fullWidth PaperProps={{ sx: { mx: { xs: 1, sm: 'auto' } } }}>
          <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Confirm Cancellation</DialogTitle>
          <DialogContent><DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: 'inherit' } }}>Cancel this interview?</DialogContentText></DialogContent>
          <DialogActions>
            <Button onClick={handleMenuClose} sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>Back</Button>
            <Button variant="contained" onClick={handleCancelInterview} color="error" sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>Cancel Interview</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={actionType === 'reschedule'} onClose={handleMenuClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, mx: { xs: 1, sm: 'auto' } } }}>
          <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Reschedule Interview</DialogTitle>
          <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={rescheduleDetails.date}
                  onChange={(date) => setRescheduleDetails(d => ({ ...d, date }))}
                  slotProps={{ textField: { fullWidth: true, InputProps: { style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }, InputLabelProps: { style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Time"
                  value={rescheduleDetails.time}
                  onChange={(time) => setRescheduleDetails(d => ({ ...d, time }))}
                  slotProps={{ textField: { fullWidth: true, InputProps: { style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }, InputLabelProps: { style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}}}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Duration (min)"
                  type="number"
                  fullWidth
                  value={rescheduleDetails.duration}
                  onChange={(e) => setRescheduleDetails(d => ({ ...d, duration: e.target.value }))}
                  InputProps={{ style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}
                  InputLabelProps={{ style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Interviewer"
                  fullWidth
                  value={rescheduleDetails.interviewer}
                  onChange={(e) => setRescheduleDetails(d => ({ ...d, interviewer: e.target.value }))}
                  InputProps={{ style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}
                  InputLabelProps={{ style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meeting Link"
                  fullWidth
                  value={rescheduleDetails.meetingLink}
                  onChange={(e) => setRescheduleDetails(d => ({ ...d, meetingLink: e.target.value }))}
                  InputProps={{ style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}
                  InputLabelProps={{ style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
            <Button onClick={handleMenuClose} sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>Cancel</Button>
            <Button variant="contained" onClick={handleRescheduleInterview} sx={{ fontSize: { xs: '0.8rem', sm: 'inherit' } }}>Reschedule</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Interviews;