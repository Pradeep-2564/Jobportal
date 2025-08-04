import React, { useEffect, useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Box, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { History, AssignmentTurnedInOutlined, CalendarMonthOutlined, ArrowRight } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ActivityFeed = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [allActivities, setAllActivities] = useState([]); // Store all activities
  const [displayedActivities, setDisplayedActivities] = useState([]); // Store only the ones to display

  useEffect(() => {
    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs')) || [];
    const interviewHistory = JSON.parse(localStorage.getItem('interview_history')) || [];

    const activities = [];

    appliedJobs.forEach(app => {
      activities.push({
        type: 'application',
        title: app.appliedFor,
        timestamp: app.id, // Using timestamp from ID for application time
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

    activities.sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent

    setAllActivities(activities);
    setDisplayedActivities(activities.slice(0, 2)); // Show only the first 2 for the dashboard
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
    <Paper elevation={2} sx={{ borderRadius: 4, p: isMobile ? 1.5 : 2, mb: isMobile ? 1 : 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <History fontSize="small" /> Recent Activity
      </Typography>
      <List dense>
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem button onClick={() => handleActivityClick(activity)} sx={{ py: isMobile ? 0.5 : 1 }}>
                <ListItemIcon sx={{ minWidth: isMobile ? 32 : 36 }}>
                  {activity.type === 'application' ? <AssignmentTurnedInOutlined color="primary" /> : <CalendarMonthOutlined color="secondary" />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                      <Typography variant={isMobile ? "body2" : "body1"} fontWeight={500} sx={{ flexGrow: 1, mr: 1 }}>
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
              {index < displayedActivities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            No recent activity to display.
          </Typography>
        )}
      </List>
      {allActivities.length > 2 && ( // Only show "View All" if there are more than 2 activities
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={() => navigate('/dashboard/jobseeker/activity')} size="small" variant="text">
            View All Activity
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ActivityFeed;