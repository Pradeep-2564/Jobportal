import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Stack,
  Alert,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from '@mui/material/styles';

import logoLight from '../assets/logo.png'; // Light logo
import logoDark from '../assets/logoWhite.png'; // Dark logo

export default function ForgotPassword() {
  const theme = useTheme(); // Get the current theme
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const MotionIcon = motion.i;

  const location = useLocation();
  const data = location.state?.role || "jobseeker";

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

  const handleSubmit = () => {
    setError("");
    setSuccessMsg("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    if (!user) {
      setError("No account found with this email.");
      return;
    }

    setSuccessMsg("Password reset link has been sent to your email.");

    setTimeout(() => {
      navigate(`/login/${data}`);
    }, 3000);
  };

  return (
    <Grid container component="main" sx={animatedBackground}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 360,
          borderRadius: "32px", // Updated to match the UI
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          backgroundColor: theme.palette.background.paper, // Use theme background color
          color: theme.palette.text.primary, // Use theme text color
        }}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src={theme.palette.mode === 'dark' ? logoDark : logoLight} // Use the appropriate logo based on theme
            alt="Innovators Tech Logo"
            style={{ height: 40 }}
          />
        </Box>

        <Typography
          fontWeight="bold"
          align="center"
          mb={1}
          lineHeight={1.3}
          sx={{cursor: 'default'}}
        >
          Forgot Password
        </Typography>

        <Stack spacing={1.5}>
          <Typography variant="body2" align="center">
            Enter your registered email and we'll send you instructions to reset
            your password.
          </Typography>

          <TextField
            size="small"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            error={!!error}
            helperText={error}
            InputLabelProps={{
              sx: {
                fontSize: "12px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MotionIcon
                    className="fa-solid fa-envelope"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{
                      opacity: emailFocused ? 0 : 1,
                      y: emailFocused ? 5 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{ display: "inline-block" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                height: 35,
                borderRadius: "28px",
              },
              "& .MuiInputBase-input": {
                padding: "6px 8px",
                fontSize: "13px",
              },
              "& .MuiFormHelperText-root": {
                marginTop: "2px",
                fontSize: "11px",
              },
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          <Button
            variant="contained"
            fullWidth
            size="medium"
            onClick={handleSubmit}
            sx={{
              py: 1.2,
              borderRadius: "28px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              backgroundColor: theme.palette.primary.main, // Use theme primary color
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark, // Use theme dark color
              },
            }}
          >
            Send Reset Link
          </Button>

          <Button
            variant="text"
            fullWidth
            size="small"
            onClick={() => navigate(`/login/${data}`)}
            sx={{
              mt: 1,
              borderRadius: "28px",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 500,
              color: theme.palette.primary.main, // Use theme primary color
            }}
          >
            Back to Login
          </Button>
        </Stack>
      </Paper>
    </Grid>
  );
}
