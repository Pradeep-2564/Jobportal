import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Alert,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';

import logoLight from '../assets/logo.png';
import logoDark from '../assets/logoWhite.png';

export default function Signup() {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [googleError, setGoogleError] = useState("");
  const [msError, setMsError] = useState("");

  const navigate = useNavigate();

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

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@") || !email.includes(".")) newErrors.email = "Enter a valid email";
    if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";

    // Password validation logic
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Password must contain at least one special character.";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSignup = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccessMsg("");
    if (Object.keys(validationErrors).length > 0) return;

    // **MODIFIED: Role-based local storage key**
    const storageKey = `${role}_users`; 

    const newUser = {
      name,
      email,
      mobile,
      password,
      role,
    };

    const existingUsers = JSON.parse(localStorage.getItem(storageKey)) || [];
    const isDuplicate = existingUsers.some((user) => user.email === email);

    if (isDuplicate) {
      setErrors({ email: "Email already registered for this role" });
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify([...existingUsers, newUser]));
    setSuccessMsg("Signup successful! Redirecting to login...");
    setTimeout(() => navigate(`/login/${role}`), 2000);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setGoogleError("");
    setMsError("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType("");
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
          <Typography fontWeight="bold" mb={1.5} align="center" sx={{cursor: 'default'}}>
            Create Account
          </Typography>
        </motion.div>
        <Stack spacing={1.2}>
          <TextField
            size="small"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            error={!!errors.name}
            helperText={errors.name}
            InputLabelProps={{ sx: { fontSize: "12px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MotionIcon
                    className="fa-solid fa-circle-user"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: nameFocused ? 0 : 1, y: nameFocused ? 5 : 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    style={{ display: "inline-block" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 35, borderRadius: "28px" },
              "& .MuiInputBase-input": { padding: "6px 8px", fontSize: "13px" },
              "& .MuiFormHelperText-root": { marginTop: "2px", fontSize: "11px" },
            }}
          />
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
            sx={{
              "& .MuiInputBase-root": { height: 35, borderRadius: "28px" },
              "& .MuiInputBase-input": { padding: "6px 8px", fontSize: "13px" },
              "& .MuiFormHelperText-root": { marginTop: "2px", fontSize: "11px" },
            }}
          />
          <TextField
            size="small"
            label="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            onFocus={() => setMobileFocused(true)}
            onBlur={() => setMobileFocused(false)}
            error={!!errors.mobile}
            helperText={errors.mobile}
            InputLabelProps={{ sx: { fontSize: "12px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MotionIcon
                    className="fa-solid fa-mobile"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: mobileFocused ? 0 : 1, y: mobileFocused ? 5 : 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    style={{ display: "inline-block" }}
                  />
                </InputAdornment>
              ),
            }}
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
            sx={{
              "& .MuiInputBase-root": { height: 35, borderRadius: "28px" },
              "& .MuiInputBase-input": { padding: "6px 8px", fontSize: "13px" },
              "& .MuiFormHelperText-root": { marginTop: "2px", fontSize: "11px" },
            }}
          />
          <TextField
            size="small"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputLabelProps={{ sx: { fontSize: "12px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MotionIcon
                    className={`fa-solid ${confirmPassword === password && confirmPassword ? "fa-circle-check" : "fa-lock"}`}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: confirmPasswordFocused ? 0 : 1, y: confirmPasswordFocused ? 5 : 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    style={{ display: "inline-block", color: confirmPassword === password && confirmPassword ? "green" : undefined }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": { height: 35, borderRadius: "28px" },
              "& .MuiInputBase-input": { padding: "6px 8px", fontSize: "13px" },
              "& .MuiFormHelperText-root": { marginTop: "2px", fontSize: "11px" },
            }}
          />

          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSignup}
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
            Sign Up as {role?.charAt(0).toUpperCase() + role?.slice(1)}
          </Button>

          <Divider sx={{ my: 1 , cursor:'default'}}>Or continue with</Divider>

          <Box display="flex" justifyContent="center" gap={2}>
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
            <Typography variant="caption" sx={{ fontSize: "12px" }}>
              Already have an account?
            </Typography>
            <Button variant="text" size="small" onClick={() => navigate(`/login/${role}`)}
              sx={{ minWidth: "auto", p: 0, textTransform: "none", fontSize: "12px", lineHeight: 'normal' }}>
              Login
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle>
          {modalType === "google" && "Login with Google"}
          {modalType === "microsoft" && "Login with Microsoft"}
        </DialogTitle>
        <DialogContent dividers>
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
    </Grid>
  );
}