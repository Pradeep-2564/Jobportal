import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Stack,
  Link,
  Alert,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import { motion } from "framer-motion";
import { FormControlLabel, Checkbox } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import logoLight from '../assets/logo.png';
import logoDark from '../assets/logoWhite.png';

export default function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [googleError, setGoogleError] = useState("");
  const [msError, setMsError] = useState("");

  const animatedBackground = {
    background: "linear-gradient(-45deg, #2193b0, #6dd5ed, #b92b27, #1565C0)",
    backgroundSize: "400% 400%",
    animation: "gradientAnimation 15s ease infinite",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@keyframes gradientAnimation": {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  };

  const { role } = useParams();

  useEffect(() => {
    const lastRememberMePreference = localStorage.getItem('lastRememberMePreference');
    if (lastRememberMePreference === 'true') {
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email.includes("@")) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const completeLogin = (user) => {
    // **MODIFIED: Use role-specific login key**
    const loginKey = `${user.role}_loggedIn`;
    localStorage.setItem(loginKey, JSON.stringify(user));

    // This part remains specific to recruiter setup after login
    if (user.role === "recruiter") {
      const recruiterProfile = {
        name: user.name || "Recruiter",
        email: user.email,
        designation: user.designation || "Recruiter",
        contact: user.mobile || "",
        address: user.address || "",
        dob: user.dob || "",
        location: user.location || "",
        profileImage: user.profileImage || "/recruiter.jpg"
      };
      localStorage.setItem("recruiterProfile", JSON.stringify(recruiterProfile));
    }

    localStorage.setItem('lastRememberMePreference', rememberMe ? 'true' : 'false');

    if (rememberMe) {
      localStorage.setItem('rememberMeEmail', email);
      localStorage.setItem('rememberMePassword', password);
    } else {
      localStorage.removeItem('rememberMeEmail');
      localStorage.removeItem('rememberMePassword');
    }

    navigate(`/dashboard/${user.role}`);
  };

  const handleLogin = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setErrorMsg("");
    if (Object.keys(validationErrors).length > 0) return;

    const storageKey = `${role}_users`;
    const users = JSON.parse(localStorage.getItem(storageKey)) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setErrorMsg("Invalid credentials or role mismatch");
      return;
    }

    completeLogin(user);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setMobileNumber("");
    setMobileError("");
    setOtp("");
    setOtpError("");
    setOtpSent(false);
    setOtpVerified(false);
    setGoogleError("");
    setMsError("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
  };

  const handleSendOtp = () => {
    const isValidPhone = /^\d{10}$/.test(mobileNumber);
    if (!isValidPhone) {
      setMobileError("Enter a valid 10-digit mobile number");
      return;
    }
    
    const storageKey = `${role}_users`;
    const users = JSON.parse(localStorage.getItem(storageKey)) || [];
    const userExists = users.some(u => u.mobile === mobileNumber);

    if (!userExists) {
      setMobileError("This mobile number is not registered for the selected role.");
      return;
    }

    setMobileError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp !== "123456") {
      setOtpError("Invalid OTP. Try again.");
      setOtpVerified(false);
    } else {
      setOtpError("");
      setOtpVerified(true);

      const storageKey = `${role}_users`;
      const users = JSON.parse(localStorage.getItem(storageKey)) || [];
      const user = users.find(u => u.mobile === mobileNumber);

      if (user) {
        setTimeout(() => {
          completeLogin(user);
        }, 1500);
      } else {
        setOtpError("An unexpected error occurred. Please try again.");
        setOtpVerified(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    try {
      throw new Error("Google login is not yet configured.");
    } catch (err) {
      setGoogleError(err.message);
    }
  };

  const handleMicrosoftLogin = () => {
    try {
      throw new Error("Microsoft login is not yet configured.");
    } catch (err) {
      setMsError(err.message);
    }
  };

  const MotionIcon = motion.i;

  return (
    <Grid container component="main" sx={animatedBackground}>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          width: "100%",
          maxWidth: 320,
          borderRadius: "32px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          overflow: "hidden",
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src={theme.palette.mode === 'dark' ? logoDark : logoLight}
            alt="Innovators Tech Logo"
            style={{ height: 40 }}
          />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          whileHover={{ scale: 1.03 }}
        >
          <Typography fontWeight="bold" mb={1} align="center" lineHeight={1.3} sx={{cursor: 'default'}}>
            Login Portal
          </Typography>
        </motion.div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <Stack spacing={1.2}>
            <TextField
              size="small"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{ sx: { fontSize: "12px" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MotionIcon
                      className="fa-solid fa-envelope"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: emailFocused ? 0 : 1, y: emailFocused ? 5 : 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      style={{ display: "inline-block" }}
                    />
                  </InputAdornment>
                ),
              }}
              autoComplete="username"
              sx={{
                "& .MuiInputBase-root": { height: 35, borderRadius: "28px" },
                "& .MuiInputBase-input": { padding: "6px 8px", fontSize: "13px" },
                "& .MuiFormHelperText-root": { marginTop: "2px", fontSize: "11px" },
              }}
            />

            <TextField
              size="small"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              error={!!errors.password}
              helperText={errors.password}
              InputLabelProps={{ sx: { fontSize: "12px" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MotionIcon
                      className="fa-solid fa-lock"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: passwordFocused ? 0 : 1, y: passwordFocused ? 5 : 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      style={{ display: "inline-block" }}
                    />
                  </InputAdornment>
                ),
              }}
              autoComplete="current-password"
              sx={{
                "& .MuiInputBase-root": { height: 35, borderRadius: "28px" },
                "& .MuiInputBase-input": { padding: "6px 8px", fontSize: "13px" },
                "& .MuiFormHelperText-root": { marginTop: "2px", fontSize: "11px" },
              }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} px={0.5}>
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} size="small" sx={{ p: 0.5 }} />}
                label={<Typography variant="caption" sx={{ fontSize: "12px", color: theme.palette.text.secondary }}>Remember me</Typography>}
                sx={{ m: 0 }}
              />
              <Link
                href="/forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/forgot-password", { state: { role } });
                }}
                underline="hover"
                variant="caption"
                sx={{ fontSize: "12px", color: theme.palette.primary.main }}
              >
                Forgot Password?
              </Link>
            </Box>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="medium"
              sx={{
                py: 1,
                borderRadius: "28px",
                backgroundColor: theme.palette.primary.main,
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "14px",
                "&:hover": { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Login as {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 1, cursor: 'default' }}>Or continue with</Divider>

        <Box display="flex" justifyContent="center" gap={2}>
          <Tooltip title="Login with Mobile">
            <IconButton color="primary" onClick={() => handleOpenModal("mobile")}>
              <MobileFriendlyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Login with Microsoft">
            <IconButton color="primary" onClick={() => handleOpenModal("microsoft")}>
              <img src="https://goodies.icons8.com/web/common/social/social_microsoft.svg" alt="icon" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Login with Google">
            <IconButton color="primary" onClick={() => handleOpenModal("google")}>
              <img src="https://goodies.icons8.com/web/common/social/social_google.svg" alt="icon" />
            </IconButton>
          </Tooltip>
        </Box>
        {/* Alignment Fix */}
        <Box display="flex" justifyContent="center" alignItems="baseline" mt={2} gap={0.5}>
          <Typography variant="caption" sx={{ fontSize: "12px"}}>
            New user?
          </Typography>
          <Button variant="text" size="small" onClick={() => navigate(`/register/${role}`)}
            sx={{ minWidth: "auto", p: 0, textTransform: "none", fontSize: "12px", lineHeight: 'normal' }}>
            Sign Up
          </Button>
        </Box>

        <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs">
          <DialogTitle>
            {modalType === "mobile" && "Login with Mobile"}
            {modalType === "google" && "Login with Google"}
            {modalType === "microsoft" && "Login with Microsoft"}
          </DialogTitle>
          <DialogContent dividers>
            {modalType === "mobile" && (
              <Stack spacing={2}>
                <TextField
                  label="Mobile Number"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  error={!!mobileError}
                  helperText={mobileError}
                  fullWidth
                />
                {!otpSent ? (
                  <Button variant="contained" fullWidth onClick={handleSendOtp}>
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <Alert severity="info">OTP sent to {mobileNumber}</Alert>
                    <TextField
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      error={!!otpError}
                      helperText={otpError}
                      fullWidth
                    />
                    {!otpVerified ? (
                      <Button variant="contained" fullWidth onClick={handleVerifyOtp}>
                        Verify OTP
                      </Button>
                    ) : (
                      <Alert severity="success">OTP Verified Successfully!</Alert>
                    )}
                  </>
                )}
              </Stack>
            )}
            {modalType === "google" && (
              <Stack spacing={2}>
                {googleError && <Alert severity="error">{googleError}</Alert>}
                <Button variant="contained" color="error" fullWidth onClick={handleGoogleLogin}>
                  Continue with Google
                </Button>
              </Stack>
            )}
            {modalType === "microsoft" && (
              <Stack spacing={2}>
                {msError && <Alert severity="error">{msError}</Alert>}
                <Button variant="contained" color="primary" fullWidth onClick={handleMicrosoftLogin}>
                  Continue with Microsoft
                </Button>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Grid>
  );
}