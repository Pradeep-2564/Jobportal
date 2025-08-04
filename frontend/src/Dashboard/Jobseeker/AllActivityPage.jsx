import React, { useEffect, useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Chip, useTheme, useMediaQuery } from '@mui/material';
import { AssignmentTurnedInOutlined, CalendarMonthOutlined, ArrowRight, History } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AllActivityPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [allActivities, setAllActivities] = useState([]);

  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs')) || [];
    const interviewHistory = JSON.parse(localStorage.getItem('interview_history')) || [];

    const activities = [];

    appliedJobs.forEach(app => {
      activities.push({
        type: 'application',
        title: app.appliedFor,
        timestamp: app.id,
        status: app.status,
        jobId: app.jobId,
      });
    });

    interviewHistory.forEach(interview => {
      const timestamp = interview.timestamp ? new Date(interview.timestamp).getTime() : Date.now();
      activities.push({
        type: 'interview',
        title: `Interview for ${interview.position} on ${interview.date}`,
        timestamp: timestamp,
        status: interview.status,
      });
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);
    setAllActivities(activities);
  }, []);

  const handleActivityClick = (activity) => {
    if (activity.type === 'application' && activity.jobId) {
      navigate(`/dashboard/jobseeker/joblistings/${activity.jobId}`);
    } else if (activity.type === 'interview') {
      navigate('/dashboard/jobseeker/interviewschedule');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      case 'Rescheduled': return 'warning';
      case 'Applied': return 'info';
      case 'Under Review': return 'secondary';
      case 'Rejected': return 'error';
      case 'Offered': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5, color: theme.palette.primary.dark }}>
        <History sx={{ fontSize: isMobile ? 32 : 36, color: theme.palette.primary.main }} />
        All Activities
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 4, p: isMobile ? 2 : 3 }}>
        <List>
          {allActivities.length > 0 ? (
            allActivities.map((activity, index) => (
              <React.Fragment key={index}>
                <ListItem button onClick={() => handleActivityClick(activity)} sx={{ py: isMobile ? 1 : 1.5 }}>
                  <ListItemIcon sx={{ minWidth: isMobile ? 40 : 48 }}>
                    {activity.type === 'application' ? <AssignmentTurnedInOutlined color="primary" /> : <CalendarMonthOutlined color="secondary" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                        <Typography variant={isMobile ? "body1" : "h6"} fontWeight={500} sx={{ flexGrow: 1, mr: 1 }}>
                          {activity.title}
                        </Typography>
                        <Chip label={activity.status} size="small" color={getStatusColor(activity.status)} />
                      </Box>
                    }
                    secondary={
                      <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </Typography>
                    }
                  />
                  <ArrowRight fontSize={isMobile ? "small" : "medium"} />
                </ListItem>
                {index < allActivities.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              No activities to display.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default AllActivityPage;