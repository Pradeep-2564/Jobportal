import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const EmployerSettings = () => {
  const getInitialNotification = () => {
    const stored = localStorage.getItem('recruiter_notification_settings');
    try {
      return stored ? JSON.parse(stored) : { jobApps: true };
    } catch {
      return { jobApps: true };
    }
  };

  const [notifications, setNotifications] = useState(getInitialNotification);
  const [teamMembers, setTeamMembers] = useState(['recruiter1@example.com']);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State to manage the reason for password change ('change' or 'logoutAll')
  const [passwordChangeReason, setPasswordChangeReason] = useState('change');

  useEffect(() => {
    localStorage.setItem('recruiter_notification_settings', JSON.stringify(notifications));
  }, [notifications]);

  const handleAddTeamMember = () => setTeamMembers([...teamMembers, '']);
  const handleTeamEmailChange = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };
  const handleRemoveTeamMember = (index) => {
    const updated = [...teamMembers];
    updated.splice(index, 1);
    setTeamMembers(updated);
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
    const passwordErrors = [];
    if (newPass.length < 6) passwordErrors.push("be at least 6 characters");
    if (!/[A-Z]/.test(newPass)) passwordErrors.push("contain an uppercase letter");
    if (!/\d/.test(newPass)) passwordErrors.push("contain a number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPass)) passwordErrors.push("contain a special character");

    if (passwordErrors.length > 0) {
      setPasswordError(`Password must ${passwordErrors.join(', ')}.`);
      return;
    }

    // Using the role-specific login key
    const loggedInUser = JSON.parse(localStorage.getItem('recruiter_loggedIn'));
    if (!loggedInUser || !loggedInUser.email) {
      setPasswordError('Authentication error. Please log in again.');
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('recruiter_users')) || [];
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
    localStorage.setItem('recruiter_users', JSON.stringify(allUsers));
    localStorage.setItem('recruiter_loggedIn', JSON.stringify(userToUpdate)); // Update session

    setPasswordSuccess('Password updated successfully! Logging out...');

    // Check if the action was "logout all"
    if (passwordChangeReason === 'logoutAll') {
      setTimeout(() => {
        localStorage.removeItem('recruiter_loggedIn');
        localStorage.removeItem('recruiterProfile');
        window.location.href = `/login/recruiter`;
      }, 1500);
    } else {
      setTimeout(handleClosePasswordModal, 1500);
    }
  };

  const handleOpenDeleteDialog = () => setIsDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleConfirmDelete = () => {
    handleCloseDeleteDialog();
    const loggedInUser = JSON.parse(localStorage.getItem('recruiter_loggedIn'));
    if (loggedInUser) {
      const allUsers = JSON.parse(localStorage.getItem('recruiter_users')) || [];
      const updatedUsers = allUsers.filter(user => user.email.toLowerCase() !== loggedInUser.email.toLowerCase());
      localStorage.setItem('recruiter_users', JSON.stringify(updatedUsers));
      localStorage.removeItem('recruiter_loggedIn');
      localStorage.removeItem('recruiterProfile');
      localStorage.removeItem('recruiter_notification_settings');
    }
    window.location.href = '/';
  };

  return (
    <>
      <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 1000, mx: 'auto' }}>
        <Paper elevation={2} sx={{ p: { xs: 1.5, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Recruiter Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* FIXED: Re-added the Notifications section */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Notifications
          </Typography>
          <FormControlLabel
            labelPlacement="start"
            control={
              <Switch
                size="small"
                checked={notifications.jobApps}
                onChange={() =>
                  setNotifications((n) => ({ ...n, jobApps: !n.jobApps }))
                }
              />
            }
            label="Notify when job applications are received"
          />
          <Divider sx={{ my: 2.5 }} />


          <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Team Access
          </Typography>
          {teamMembers.map((email, index) => (
            <Grid container spacing={1} alignItems="center" key={index} sx={{ mb: 0.5 }}>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  size="small"
                  label={`Recruiter ${index + 1}`}
                  value={email}
                  onChange={(e) => handleTeamEmailChange(index, e.target.value)}
                  InputProps={{ style: { fontSize: '0.875rem' } }}
                  InputLabelProps={{ style: { fontSize: '0.875rem' } }}
                />
              </Grid>
              <Grid item xs={3}>
                <Button size="small" color="error" onClick={() => handleRemoveTeamMember(index)} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, minWidth: 'auto', p: '4px 8px' }}>
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" size="small" color="success" onClick={handleAddTeamMember} sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' }, mt: 1 }}>
            Add Team Member
          </Button>


          <Divider sx={{ my: 2.5 }} />

          <Typography variant="subtitle1" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Security
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <Button variant="outlined" size="small" onClick={handleOpenPasswordModal} sx={{ px: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              Change Password
            </Button>
            <Button variant="outlined" size="small" color="warning" onClick={handleOpenLogoutAllModal} sx={{ px: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              Logout from all devices
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={handleOpenDeleteDialog} sx={{ px: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              Delete My Account
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Delete Your Recruiter Account?"}</DialogTitle>
        <DialogContent><DialogContentText>This is a permanent action. All your data will be deleted.</DialogContentText></DialogContent>
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

export default EmployerSettings;