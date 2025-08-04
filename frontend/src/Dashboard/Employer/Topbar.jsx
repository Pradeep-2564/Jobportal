import React, { useState, useEffect, forwardRef, useRef, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Button,
  Paper,
  Dialog,
  DialogContent,
  Slide,
  ThemeProvider,
  createTheme,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  useMediaQuery,
  Avatar,
  Stack,
  TextField,
  ListItemIcon,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Work as WorkIcon,
  Circle as CircleIcon,
  Menu as MenuIcon,
  MarkChatReadOutlined as MarkChatReadOutlinedIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  CameraAlt as CameraAltIcon,
  Mail as ApplicationIcon,
  Schedule as InterviewIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { CiBrightnessUp } from "react-icons/ci";
import { RiMoonClearFill } from "react-icons/ri";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { VscBell, VscBellDot } from "react-icons/vsc";

// Imports for the Date Picker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

// Helper functions for the Avatar
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function getAvatarProps(name) {
  if (!name) return {}; // Return empty if name is not available
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  return {
    sx: {
      bgcolor: stringToColor(name),
      // The text color will be automatically handled by MUI for contrast
    },
    children: initials,
  };
}


const Topbar = ({ toggleTheme, currentTheme, handleDrawerToggle, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:900px)");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const getInitialProfileData = () => {
    const storedProfile = JSON.parse(localStorage.getItem("recruiterProfile")) || {};
    return {
      name: storedProfile.name || loggedInUser.name || "Recruiter",
      email: storedProfile.email || loggedInUser.email || "",
      designation: storedProfile.designation || "Recruiter",
      contact: storedProfile.contact || loggedInUser.mobile || "",
      address: storedProfile.address || "",
      dob: storedProfile.dob || "",
      location: storedProfile.location || "India",
      profileImage: storedProfile.profileImage || null, // Default to null
    };
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileView, setProfileView] = useState("summary");
  const [profileImage, setProfileImage] = useState(getInitialProfileData().profileImage);
  const [formData, setFormData] = useState(getInitialProfileData());

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: currentTheme || "light",
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    }
  });

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes("/profilemanagement")) return "Profile Management";
    if (path.includes("/joblistings")) return "Job Listings";
    if (path.includes("/interviewschedule")) return "Interview Schedule";
    if (path.includes("/jobnotifications")) return "Messages & Notifications";
    if (path.includes("/helpsupport")) return "Help & Support";
    if (path.includes("/job-posting")) return "Job Posting";
    if (path.includes("/job-lists")) return "Job Lists";
    if (path.includes("/job-applicants")) return "Job Applicants";
    if (path.includes("/interviews")) return "Interviews";
    if (path.includes("/reports")) return "Reports";
    return "Dashboard";
  };

  const loadNotifications = useCallback(() => {
    const isRecruiter = location.pathname.includes('/recruiter');
    const notificationKey = isRecruiter ? 'recruiter_notifications' : 'jobseeker_notifications';
    const settingsKey = isRecruiter ? 'recruiter_notification_settings' : 'jobseeker_notification_settings';
    
    const stored = JSON.parse(localStorage.getItem(notificationKey)) || [];

    if(isRecruiter) {
         setNotifications(stored);
         setUnreadCount(stored.filter((n) => !n.read).length);
         return;
    }

    const settings = JSON.parse(localStorage.getItem(settingsKey)) || { jobAlerts: true, interviewAlerts: true };
    const filtered = stored.filter((notification) => {
      if (notification.type === "job_closed") return true;
      if (notification.type === "new_job") return settings.jobAlerts;
      if (notification.type === "interviewscheduled") return settings.interviewAlerts;
      return true;
    });

    setNotifications(filtered);
    setUnreadCount(filtered.filter((n) => !n.read).length);
  }, [location.pathname]);

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notificationsUpdated", loadNotifications);
    return () => window.removeEventListener("notificationsUpdated", loadNotifications);
  }, [loadNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application":
        return <ApplicationIcon color="primary" />;
      case "interview":
        return <InterviewIcon color="info" />;
      case "approved":
        return <ApprovedIcon color="success" />;
      case "rejected":
        return <RejectedIcon color="error" />;
      default:
        return <ErrorIcon color="warning" />;
    }
  };

  const handleNotificationClick = (notification) => {
     const isRecruiter = location.pathname.includes('/recruiter');
     const notificationKey = isRecruiter ? 'recruiter_notifications' : 'jobseeker_notifications';
    const updated = notifications.map((n) => n.id === notification.id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem(notificationKey, JSON.stringify(updated));
    setUnreadCount(updated.filter((n) => !n.read).length);
    if (isRecruiter) {
        if (notification.type === 'application') {
            navigate('/dashboard/recruiter/job-applicants');
        }
    } else {
        if (notification.type === "new_job") {
            navigate(`/dashboard/jobseeker/joblistings/${notification.jobId}`);
        } else if (notification.type === "interviewscheduled") {
            navigate("/dashboard/jobseeker/interviewschedule");
        } else {
            navigate("/dashboard/jobseeker/jobnotifications", { state: { notificationId: notification.id } });
        }
    }
    setNotificationsOpen(false);
  };

  const markAllAsRead = () => {
    const isRecruiter = location.pathname.includes('/recruiter');
    const notificationKey = isRecruiter ? 'recruiter_notifications' : 'jobseeker_notifications';
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(notificationKey, JSON.stringify(updated));
    setUnreadCount(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const isRecruiter = location.pathname.includes('/recruiter');
      const basePath = isRecruiter ? '/dashboard/recruiter' : '/dashboard/jobseeker';
      let searchPath = '';
      if(isRecruiter) {
        if(location.pathname.includes('/job-applicants')) searchPath = '/job-applicants';
        else if(location.pathname.includes('/job-lists')) searchPath = '/job-lists';
        else if(location.pathname.includes('/interviews')) searchPath = '/interviews';
        else searchPath = '/job-applicants';
      } else {
        searchPath = '/joblistings';
      }
      navigate(`${basePath}${searchPath}?search=${searchQuery.trim()}`);
      if (isMobile) {
          setSearchOpen(false);
      }
      setSearchQuery("");
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setProfileImage(result);
      setFormData((prev) => ({ ...prev, profileImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openEditView = () => setProfileView("edit");
  const closePanel = () => setProfileOpen(false);

  const handleNavigateToSettings = () => {
    closePanel();
    navigate("/dashboard/recruiter/settings");
  };

  const handleSaveChanges = () => {
    localStorage.setItem("recruiterProfile", JSON.stringify(formData));
    setProfileView("summary");
  };

  const iconButtonContainerSx = {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    border: currentTheme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
    backgroundColor: currentTheme === 'dark' ? 'rgba(45, 55, 72, 0.5)' : '#FFFFFF',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease-in-out',
    '&:hover': {
      backgroundColor: currentTheme === 'dark' ? 'rgba(67, 81, 105, 0.6)' : '#F9FAFB',
    }
  };

  const searchContainerSx = {
    display: 'flex',
    alignItems: 'center',
    height: 44,
    width: 350,
    borderRadius: '28px',
    p: '0 8px 0 16px',
    border: currentTheme === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E5E7EB',
    backgroundColor: currentTheme === 'dark' ? 'rgba(45, 55, 72, 0.5)' : '#FFFFFF',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            background: currentTheme === "dark" ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: 'blur(8px)',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: 72, px: isMobile ? 2 : 3 }}>
            <Box display="flex" alignItems="center">
              {isMobile && (
                <IconButton color="inherit" edge="start" onClick={handleDrawerToggle || toggleSidebar} sx={{ mr: 1, color: "text.primary" }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                {getTitle()}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
              {!isMobile ? (
                <Paper component="form" onSubmit={handleSearchSubmit} elevation={0} sx={searchContainerSx}>
                  <InputBase 
                    placeholder="Search..." 
                    inputRef={inputRef} 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    sx={{ 
                      flex: 1, 
                      fontSize: '0.9rem',
                      '& :-webkit-autofill, & :-webkit-autofill:hover, & :-webkit-autofill:focus, & :-webkit-autofill:active': {
                          WebkitBoxShadow: currentTheme === 'dark'
                            ? `0 0 0 30px ${theme.palette.background.paper} inset !important`
                            : `0 0 0 30px #E5E7EB inset !important`,
                          WebkitTextFillColor: `${theme.palette.text.primary} !important`,
                          transition: 'background-color 5000s ease-in-out 0s',
                          caretColor: `${theme.palette.text.primary} !important`,
                      },
                    }}
                  />
                  <IconButton type="submit" size="small" sx={{ p: '10px' }}>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ) : (
                <IconButton onClick={() => setSearchOpen(!searchOpen)} sx={{ color: "text.primary" }}>
                  <SearchIcon />
                </IconButton>
              )}

              <Paper component="div" elevation={0} sx={iconButtonContainerSx}>
                  <IconButton onClick={toggleTheme} size="small">
                      {currentTheme === "dark" ? <CiBrightnessUp size={22} /> : <RiMoonClearFill size={20} />}
                  </IconButton>
              </Paper>

              <Paper component="div" elevation={0} sx={iconButtonContainerSx}>
                  <IconButton onClick={() => setNotificationsOpen(true)} size="small">
                      {unreadCount > 0 ? (
                          <VscBellDot size={22} color={theme.palette.error.main} />
                      ) : (
                          <VscBell size={22} />
                      )}
                  </IconButton>
              </Paper>

              <IconButton onClick={() => { setProfileView("summary"); setProfileOpen(true); }} sx={{ p: 0 }}>
                <Avatar 
                  src={profileImage} 
                  alt={formData.name} 
                  {...getAvatarProps(formData.name)}
                  sx={{ 
                    ...getAvatarProps(formData.name).sx,
                    width: 44, 
                    height: 44,
                    fontSize: '1rem',
                  }} 
                />
              </IconButton>
            </Box>
          </Toolbar>

          {isMobile && searchOpen && (
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ p: 1, display: "flex", alignItems: "center", borderTop: 1, borderColor: 'divider' }}>
              <InputBase placeholder="Search..." fullWidth autoFocus inputRef={inputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ flex: 1, ml: 1 }} />
              <IconButton type="submit" size="small"><SearchIcon /></IconButton>
              <IconButton size="small" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}><CloseIcon /></IconButton>
            </Box>
          )}

          <Dialog open={notificationsOpen} onClose={() => setNotificationsOpen(false)} fullScreen={isMobile} TransitionComponent={SlideTransition} PaperProps={{ sx: { position: isMobile ? "fixed" : "absolute", top: isMobile ? 0 : "72px", right: isMobile ? 0 : "20px", width: isMobile ? "100%" : { xs: "90%", sm: "380px" }, maxWidth: "380px", height: isMobile ? "100%" : "auto", maxHeight: isMobile ? "100%" : "calc(100vh - 90px)", borderRadius: isMobile ? 0 : "16px", boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', m: 0, backgroundColor: currentTheme === "dark" ? "#1E1E1E" : "#FFFFFF", color: currentTheme === "dark" ? "#ECF0F1" : "#2C3E50", } }}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" px={2.5} py={1.5} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem' }}>Notifications</Typography>
                      <Box display="flex" alignItems="center">
                          <Button size="small" onClick={markAllAsRead} disabled={unreadCount === 0} sx={{ color: "inherit", mr: 1, fontSize: "0.8rem", textTransform: 'none' }}>Mark all as read</Button>
                          <IconButton onClick={() => setNotificationsOpen(false)} size="small"><CloseIcon sx={{ color: "inherit", fontSize: '1.25rem' }} /></IconButton>
                      </Box>
                  </Box>
                  <DialogContent sx={{ p: 0, flex: 1, overflowY: "auto", '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { backgroundColor: currentTheme === 'dark' ? '#555' : '#ccc', borderRadius: '6px' }, '&::-webkit-scrollbar-thumb:hover': { backgroundColor: currentTheme === 'dark' ? '#666' : '#aaa' } }}>
                      {notifications.length === 0 ? (
                          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="250px" textAlign="center" px={3}>
                              <MarkChatReadOutlinedIcon sx={{ fontSize: "3rem", color: 'text.disabled', mb: 2 }} />
                              <Typography variant="body1" fontWeight="500" color="text.secondary" sx={{ fontSize: '0.9rem' }}>You're all caught up</Typography>
                          </Box>
                      ) : (
                          <List sx={{ width: "100%", p: 0 }}>
                              {[...notifications].reverse().map((notification) => (
                                  <React.Fragment key={notification.id}>
                                      <ListItem alignItems="flex-start" sx={{ cursor: "pointer", px: 2.5, py: 2, backgroundColor: !notification.read && (currentTheme === "dark" ? "rgba(52, 152, 219, 0.1)" : "rgba(52, 152, 219, 0.08)"), "&:hover": { backgroundColor: currentTheme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)" }, }} onClick={() => handleNotificationClick(notification)}>
                                          <ListItemAvatar>
                                              <Avatar sx={{ bgcolor: !notification.read ? 'primary.light' : 'transparent', color: !notification.read ? 'primary.main' : 'inherit' }}>{getNotificationIcon(notification.type)}</Avatar>
                                          </ListItemAvatar>
                                          <Box sx={{ flexGrow: 1 }}>
                                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: notification.read ? 'text.secondary' : 'text.primary' }}>{notification.title || "New Application"}</Typography>
                                                  {!notification.read && (<CircleIcon sx={{ fontSize: '0.6rem', color: 'primary.main' }} />)}
                                              </Box>
                                              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', my: 0.5, lineHeight: 1.4 }}>{notification.message}</Typography>
                                              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>{formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}</Typography>
                                          </Box>
                                      </ListItem>
                                      <Divider component="li" />
                                  </React.Fragment>
                              ))}
                          </List>
                      )}
                  </DialogContent>
              </Box>
          </Dialog>
          <Dialog open={profileOpen} onClose={closePanel} TransitionComponent={SlideTransition} keepMounted fullWidth maxWidth="xs" PaperProps={{ sx: { height: "100%", position: "fixed", right: 0, m: 0, borderRadius: "16px 0 0 16px", width: 360, boxShadow: 4, overflow: "hidden", } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2} borderBottom={1} borderColor="divider">
                  <Typography variant="h6" fontWeight="bold">{profileView === "edit" ? "Edit Profile" : "Your Profile"}</Typography>
                  <IconButton onClick={() => profileView === "edit" ? setProfileView("summary") : closePanel()}><CloseIcon /></IconButton>
              </Box>
              <DialogContent sx={{ 
                  px: 3, py: 2, overflowY: 'auto',
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                  '&::-webkit-scrollbar-thumb': {
                      backgroundColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                  }
              }}>
                  {profileView === "summary" ? (
                      <>
                          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                              <Avatar 
                                src={profileImage} 
                                alt={formData.name}
                                {...getAvatarProps(formData.name)}
                                sx={{
                                  ...getAvatarProps(formData.name).sx,
                                  width: 90,
                                  height: 90,
                                  mb: 1,
                                  fontSize: '2.5rem',
                                  border: "2px solid #4caf50"
                                }}
                              />
                              <Typography fontWeight="bold" variant="subtitle1" lineHeight={1.4}>{formData.name}</Typography>
                              <Typography variant="body2" color="text.secondary" lineHeight={1.2}>{formData.designation}</Typography>
                              <Typography variant="body2" color="text.secondary" lineHeight={1.2}>{formData.location}</Typography>
                          </Box>
                          <Button fullWidth variant="outlined" onClick={openEditView} sx={{ mb: 3, borderRadius: 8, textTransform: "none", fontWeight: 500 }}>View & Update Profile</Button>
                          <Stack spacing={2}>
                              <Box onClick={handleNavigateToSettings} sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                                  <SettingsIcon fontSize="small" /><Typography>Settings</Typography>
                              </Box>
                              <Box component={Link} to="/login/recruiter" sx={{ display: "flex", alignItems: "center", gap: 1.5, textDecoration: "none", color: "inherit" }}>
                                  <LogoutIcon color="error" /><Typography color="error" fontWeight="bold">Logout</Typography>
                              </Box>
                          </Stack>
                      </>
                  ) : (
                      <>
                          <Box textAlign="center" mb={3}>
                              <Box position="relative" display="inline-block">
                                  <Avatar 
                                    src={profileImage} 
                                    alt={formData.name}
                                    {...getAvatarProps(formData.name)}
                                    sx={{
                                      ...getAvatarProps(formData.name).sx,
                                      width: 90,
                                      height: 90,
                                      mx: "auto",
                                      mb: 1,
                                      fontSize: '2.5rem',
                                    }}
                                  />
                                  <IconButton size="small" sx={{ position: "absolute", bottom: 0, right: 0, border: "1px solid #ccc", p: 0.5 }} onClick={() => fileInputRef.current.click()}>
                                      <CameraAltIcon fontSize="small" />
                                  </IconButton>
                                  <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
                              </Box>
                          </Box>
                          <Stack spacing={2}>
                              <TextField size="small" label="Full Name" fullWidth variant="outlined" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} InputLabelProps={{ shrink: true }} />
                              <TextField size="small" label="Designation" fullWidth variant="outlined" value={formData.designation} onChange={(e) => handleInputChange("designation", e.target.value)} InputLabelProps={{ shrink: true }} />
                              <TextField size="small" label="Email" fullWidth variant="outlined" value={formData.email} disabled InputLabelProps={{ shrink: true }} />
                              <TextField size="small" label="Mobile Number" fullWidth variant="outlined" value={formData.contact} onChange={(e) => handleInputChange("contact", e.target.value)} InputLabelProps={{ shrink: true }} />
                              <TextField size="small" label="Address" fullWidth variant="outlined" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} InputLabelProps={{ shrink: true }} />
                              <DatePicker
                                label="Date of Birth"
                                value={formData.dob ? new Date(formData.dob) : null}
                                onChange={(newDate) => {
                                  if (newDate && !isNaN(newDate)) {
                                    const formattedDate = newDate.toISOString().split('T')[0];
                                    handleInputChange("dob", formattedDate);
                                  } else {
                                    handleInputChange("dob", "");
                                  }
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                    variant: 'outlined',
                                    size: 'small',
                                  },
                                }}
                              />
                              <TextField size="small" label="Location" fullWidth variant="outlined" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} InputLabelProps={{ shrink: true }} />
                          </Stack>
                          <Button fullWidth variant="contained" onClick={handleSaveChanges} sx={{ mt: 3, borderRadius: 8, textTransform: "none" }}>Save Changes</Button>
                      </>
                  )}
              </DialogContent>
          </Dialog>
        </AppBar>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Topbar;