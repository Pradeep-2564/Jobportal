import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  Paper,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  NotificationsActive,
  WorkOutline,
  Schedule,
  DoneAll,
  MarkEmailRead
} from '@mui/icons-material';
 
const Messages = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
 
  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("jobseeker_notifications")) || [];
    setNotifications(storedNotifications);
    setUnreadCount(storedNotifications.filter(n => !n.read).length);
  }, []);
 
  const updateNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem("jobseeker_notifications", JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };
 
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    updateNotifications(updatedNotifications);
  };
 
  const handleNotificationClick = (notification) => {
    const updated = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    updateNotifications(updated);
 
    if (notification.type === "schedule_interview") {
      navigate("/dashboard/jobseeker/interviewschedule");
    }
  };
 
  return (
    <Box sx={{
      p: isMobile ? 0.5 : isTablet ? 1 : 1.5, // Further reduced padding
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1 // Reduced margin bottom
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 600,
          color: theme.palette.primary.dark,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5 // Further reduced gap
        }}>
          <NotificationsActive sx={{
            fontSize: isMobile ? 20 : isTablet ? 24 : 28, // Reduced icon size
            color: theme.palette.primary.main
          }} />
          Messages & Notifications
        </Typography>
 
        <Button
          variant="contained"
          startIcon={<DoneAll sx={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }} />} // Reduced icon size
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            px: isMobile ? 1 : isTablet ? 1.5 : 2, // Further reduced horizontal padding
            py: isMobile ? 0.25 : isTablet ? 0.5 : 0.5, // Further reduced vertical padding
            boxShadow: theme.shadows[1],
            '&:hover': {
              boxShadow: theme.shadows[2],
              backgroundColor: theme.palette.primary.dark
            }
          }}
        >
          Mark all as read ({unreadCount})
        </Button>
      </Box>
 
      {/* Notifications List */}
      <Paper elevation={0} sx={{
        borderRadius: 4,
        boxShadow: theme.shadows[1],
        overflow: 'hidden'
      }}>
        {notifications.length === 0 ? (
          <Box sx={{
            p: isMobile ? 1 : isTablet ? 2 : 3, // Reduced padding
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5 // Further reduced gap
          }}>
            <MarkEmailRead sx={{
              fontSize: isMobile ? 24 : isTablet ? 28 : 32, // Reduced icon size
              color: theme.palette.grey[400]
            }} />
            <Typography variant="body2" sx={{
              color: theme.palette.text.secondary,
              fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem' // Reduced font size
            }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {[...notifications].reverse().map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: isMobile ? 0.5 : isTablet ? 1 : 1, // Further reduced horizontal padding
                    py: isMobile ? 0.5 : isTablet ? 1 : 1, // Further reduced vertical padding
                    cursor: 'pointer',
                    backgroundColor: notification.read ?
                      'inherit' : theme.palette.primary.light + '10', // Slightly reduced background color
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar sx={{ minWidth: isMobile ? 32 : isTablet ? 36 : 40 }}>
                    <Avatar sx={{
                      bgcolor: notification.read ?
                        theme.palette.grey[300] : theme.palette.primary.main,
                      color: notification.read ?
                        theme.palette.grey[600] : theme.palette.primary.contrastText,
                      width: isMobile ? 24 : isTablet ? 28 : 32,
                      height: isMobile ? 24 : isTablet ? 28 : 32
                    }}>
                      {notification.type === 'interview' ? (
                        <Schedule fontSize={isMobile ? "small" : isTablet ? "medium" : "medium"} />
                      ) : (
                        <WorkOutline fontSize={isMobile ? "small" : isTablet ? "medium" : "medium"} />
                      )}
                    </Avatar>
                  </ListItemAvatar>
 
                  <ListItemText
                    primary={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.25 // Further reduced margin bottom
                      }}>
                        <Typography
                          variant={isMobile ? "subtitle2" : isTablet ? "subtitle2" : "subtitle2"}
                          sx={{
                            fontWeight: notification.read ? 500 : 700,
                            color: notification.read ?
                              theme.palette.text.secondary : theme.palette.primary.dark,
                            mr: 0.5 // Further reduced margin right
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip
                            label="New"
                            size={isMobile ? "small" : isTablet ? "small" : "small"}
                            sx={{
                              height: isMobile ? 14 : isTablet ? 16 : 16, // Reduced height
                              fontSize: isMobile ? '0.5rem' : isTablet ? '0.6rem' : '0.6rem',
                              fontWeight: 600,
                              backgroundColor: theme.palette.secondary.light,
                              color: theme.palette.secondary.dark
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 0.25 // Further reduced margin top
                      }}>
                        <Typography
                          variant={isMobile ? "body2" : isTablet ? "body2" : "body2"}
                          sx={{
                            color: notification.read ?
                              theme.palette.text.secondary : theme.palette.text.primary,
                            flexGrow: 1,
                            pr: 0.5 // Further reduced padding right
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant={isMobile ? "caption" : isTablet ? "caption" : "caption"}
                          sx={{
                            color: notification.read ?
                              theme.palette.text.disabled : theme.palette.primary.dark,
                            whiteSpace: 'nowrap',
                            fontSize: isMobile ? '0.6rem' : isTablet ? '0.7rem' : '0.8rem' // Reduced font size
                          }}
                        >
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="middle" sx={{ my: 0.25 }} /> {/* Further reduced margin for divider */}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};
 
export default Messages;
 
 