import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

const JobseekerSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // State to manage the reason for password change ('change' or 'logoutAll')
  const [passwordChangeReason, setPasswordChangeReason] = useState('change');

  const getInitialNotification = () => {
    const stored = localStorage.getItem('jobseeker_notification_settings');
    try {
      return stored ? JSON.parse(stored) : { jobAlerts: true, interviewAlerts: true };
    } catch {
      return { jobAlerts: true, interviewAlerts: true };
    }
  };

  const [notifications, setNotifications] = useState(getInitialNotification);

  useEffect(() => {
    localStorage.setItem('jobseeker_notification_settings', JSON.stringify(notifications));
    window.dispatchEvent(new Event('notificationsUpdated'));
  }, [notifications]);

  const handleOpenDeleteDialog = () => setIsDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleConfirmDelete = () => {
    handleCloseDeleteDialog();
    const loggedInUser = JSON.parse(localStorage.getItem('jobseeker_loggedIn'));
    if (loggedInUser) {
      const allUsers = JSON.parse(localStorage.getItem('jobseeker_users')) || [];
      const updatedUsers = allUsers.filter(user => user.email.toLowerCase() !== loggedInUser.email.toLowerCase());
      localStorage.setItem('jobseeker_users', JSON.stringify(updatedUsers));
      localStorage.removeItem('jobseeker_loggedIn');
      localStorage.removeItem('jobseeker_notification_settings');
    }
    window.location.href = '/';
  };

  const handleOpenPasswordModal = () => {
    setPasswordChangeReason('change');
    setPasswordModalOpen(true);
  };

  // Handler for the "Logout from all devices" action
  const handleOpenLogoutAllModal = () => {
    setPasswordChangeReason('logoutAll');
    setPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordFields({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordFields.oldPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    const newPass = passwordFields.newPassword;
    const passwordPolicyErrors = [];
    if (newPass.length < 6) passwordPolicyErrors.push("be at least 6 characters");
    if (!/[A-Z]/.test(newPass)) passwordPolicyErrors.push("contain an uppercase letter");
    if (!/\d/.test(newPass)) passwordPolicyErrors.push("contain a number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPass)) passwordPolicyErrors.push("contain a special character");

    if (passwordPolicyErrors.length > 0) {
      setPasswordError(`Password must ${passwordPolicyErrors.join(', ')}.`);
      return;
    }

    // Using the role-specific login key
    const loggedInUser = JSON.parse(localStorage.getItem('jobseeker_loggedIn'));
    if (!loggedInUser || !loggedInUser.email) {
      setPasswordError('Authentication error. Please log in again.');
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('jobseeker_users')) || [];
    const userIndex = allUsers.findIndex(user => user.email && user.email.toLowerCase() === loggedInUser.email.toLowerCase());

    if (userIndex === -1) {
      setPasswordError('Could not find user data. Please log in again.');
      return;
    }

    const userToUpdate = allUsers[userIndex];
    if (userToUpdate.password !== passwordFields.oldPassword) {
      setPasswordError('Your old password is not correct.');
      return;
    }

    userToUpdate.password = passwordFields.newPassword;
    localStorage.setItem('jobseeker_users', JSON.stringify(allUsers));
    localStorage.setItem('jobseeker_loggedIn', JSON.stringify(userToUpdate)); // Update session with new data

    setPasswordSuccess('Password updated successfully! Logging out...');

    // Check if the action was "logout all"
    if (passwordChangeReason === 'logoutAll') {
      setTimeout(() => {
        localStorage.removeItem('jobseeker_loggedIn');
        window.location.href = `/login/jobseeker`;
      }, 1500);
    } else {
      setTimeout(handleClosePasswordModal, 1500);
    }
  };

  return (
    <>
      <Box sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 3, width: '100%' }}>
        <Paper elevation={2} sx={{ p: isMobile ? 1.5 : isTablet ? 2 : 3, borderRadius: 2, width: '100%' }}>
          <Typography variant={isMobile ? 'h6' : isTablet ? 'h5' : 'h5'} fontWeight={600} gutterBottom>
            Jobseeker Settings
          </Typography>
          <Divider sx={{ mb: isMobile ? 1.5 : 2 }} />
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            Notifications
          </Typography>
          <FormControlLabel
            labelPlacement="start"
            control={<Switch size="small" checked={notifications.jobAlerts} onChange={() => setNotifications((n) => ({ ...n, jobAlerts: !n.jobAlerts }))} />}
            label="Notify when new jobs are posted"
          />
          <FormControlLabel
            labelPlacement="start"
            control={<Switch size="small" checked={notifications.interviewAlerts} onChange={() => setNotifications((n) => ({ ...n, interviewAlerts: !n.interviewAlerts }))} />}
            label="Notify when interviews are scheduled"
          />
          <Divider sx={{ my: isMobile ? 2 : 3 }} />
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            Security
          </Typography>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={1.5} sx={{ mt: 1 }}>
            <Button variant="outlined" color="primary" fullWidth={isMobile} size="small" onClick={handleOpenPasswordModal}>
              Change Password
            </Button>
            <Button variant="outlined" color="warning" fullWidth={isMobile} size="small" onClick={handleOpenLogoutAllModal}>
              Logout from all devices
            </Button>
            <Button variant="contained" color="error" fullWidth={isMobile} onClick={handleOpenDeleteDialog} size="small">
              Delete My Account
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Are you sure you want to delete your account?"}</DialogTitle>
        <DialogContent><DialogContentText>This action is permanent and cannot be undone. All of your data will be lost.</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={passwordModalOpen} onClose={handleClosePasswordModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {passwordChangeReason === 'logoutAll' ? 'Secure Your Account' : 'Change Your Password'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {passwordChangeReason === 'logoutAll'
              ? 'To log out from all devices, you must set a new password. This will invalidate all other active sessions.'
              : 'To change your password, please enter your old password and then your new password.'}
          </DialogContentText>
          <TextField autoFocus required margin="dense" name="oldPassword" label="Old Password" type="password" fullWidth variant="standard" value={passwordFields.oldPassword} onChange={handlePasswordInputChange} />
          <TextField required margin="dense" name="newPassword" label="New Password" type="password" fullWidth variant="standard" value={passwordFields.newPassword} onChange={handlePasswordInputChange} />
          <TextField
            required margin="dense" name="confirmPassword" label="Confirm New Password" type="password" fullWidth variant="standard" value={passwordFields.confirmPassword} onChange={handlePasswordInputChange}
            error={!!passwordError} helperText={passwordError || passwordSuccess}
            sx={{ '& .MuiFormHelperText-root': { color: passwordSuccess ? 'green' : 'error.main' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal}>Cancel</Button>
          <Button onClick={handleUpdatePassword} variant="contained">Update Password</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JobseekerSettings;