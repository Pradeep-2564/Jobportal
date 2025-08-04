import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Link as MuiLink,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Person,
  VideoCameraFront,
  Schedule,
  InsertLink
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const InterviewSchedule = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [interviews, setInterviews] = useState([]);
  const [displayInterviews, setDisplayInterviews] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("interview_history")) || [];
    setInterviews(savedHistory);
  }, []);

  useEffect(() => {
    let currentInterviews = [...interviews];
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');

    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      currentInterviews = currentInterviews.filter(interview =>
        (interview.position && interview.position.toLowerCase().includes(lowerCaseSearchQuery)) ||
        (interview.status && interview.status.toLowerCase().includes(lowerCaseSearchQuery))
      );
    }

    setDisplayInterviews(currentInterviews);
  }, [interviews, location.search]);

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

  return (
    <Box sx={{ p: isMobile ? 1 : 2, minHeight: '100vh' }}>
      <Typography variant="h5" sx={{
        mb: 2,
        fontWeight: 700,
        color: theme.palette.primary.dark,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <VideoCameraFront sx={{ fontSize: isMobile ? 24 : 28, color: theme.palette.primary.main }} />
        Interview Schedule
      </Typography>

      {displayInterviews.length === 0 ? (
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {location.search ? "No matching interviews found." : "No interviews scheduled."}
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: theme.shadows[1]
          }}
        >
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead sx={{ backgroundColor: theme.palette.primary.light + '15' }}>
              <TableRow>
                <TableCell sx={{ width: 40 }} />
                <TableCell sx={{ fontWeight: 600, py: 1 }}>Position</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule fontSize="small" />
                    Date & Time
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayInterviews.map((interview = {}, index) => {
                const {
                  position = 'N/A',
                  status = 'N/A',
                  date = 'N/A',
                  time = 'N/A',
                  interviewer = 'N/A',
                  duration = 0,
                  meetingLink = ''
                } = interview;

                return (
                  <React.Fragment key={index}>
                    <TableRow hover sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(index)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          {expandedRow === index ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>

                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {position}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ py: 1 }}>
                        <Chip
                          label={status}
                          color={getStatusColor(status)}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            backgroundColor:
                              status === 'Scheduled' ? theme.palette.primary.light + '80' :
                              status === 'Completed' ? theme.palette.success.light + '80' :
                              status === 'Cancelled' ? theme.palette.error.light + '80' :
                              status === 'Rescheduled' ? theme.palette.warning.light + '80' :
                              theme.palette.grey[300]
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ py: 1 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>{date}</Typography>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                            {time}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{ p: 0 }} colSpan={6}>
                        <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Person sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1 }} />
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    Interview Details
                                  </Typography>
                                </Box>
                                <Box sx={{ pl: 2 }}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                      Interviewer
                                    </Typography>
                                    <Typography variant="body2">{interviewer}</Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                      Duration
                                    </Typography>
                                    <Typography variant="body2">{duration} minutes</Typography>
                                  </Box>
                                </Box>
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <InsertLink sx={{ fontSize: 20, color: theme.palette.primary.main, mr: 1 }} />
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    Meeting Link
                                  </Typography>
                                </Box>
                                <Box sx={{ pl: 2 }}>
                                  {meetingLink ? (
                                    <MuiLink
                                      href={meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      Join Meeting
                                    </MuiLink>
                                  ) : (
                                    <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
                                      No meeting link
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default InterviewSchedule;