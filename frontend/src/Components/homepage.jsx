import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  InputBase,
  IconButton,
  Paper,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SearchIcon from "@mui/icons-material/Search";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import advisorImage from "../assets/advisor-image.png";
import SeoSearchSection from './SeoSearchSection';

// Styled Components
const GradientBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  paddingTop: theme.spacing(2),
}));

const SearchBarWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.primary.main}`,
  overflow: "hidden",
  width: "100%",
  height: 48,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  paddingLeft: 16,
  fontSize: "1rem",
  height: "100%",
  '& input::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  '& input': {
    color: theme.palette.text.primary,
  }
}));

const SearchBtn = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  height: "100%",
  borderRadius: 0,
  padding: "0 16px",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const HomePage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [locationData] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme here

  const handleJobSearch = () => {
    if (!jobTitle.trim() && !location.trim()) {
      alert('Please enter a job title or location');
      return;
    }

    navigate('/find-job', {
      state: {
        searchQuery: jobTitle.trim(),
        location: location.trim(),
        locationData: locationData
      }
    });
  };

  const handleBrowseJobs = () => {
    navigate('/find-job');
  };

  return (
    <GradientBackground>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Content */}
          <Box textAlign={{ xs: "center", md: "left" }} flex={1}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: theme.palette.text.primary,
                '& span': {
                  color: theme.palette.primary.main,
                },
                cursor: 'default', // Added cursor style here
              }}
            >
              Find Your <span>Dream Job</span>
              <br />
              With Your Interest
              <br /> And Skills
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: 600,
                mx: { xs: "auto", md: "0" },
                cursor: 'default', // Added cursor style here
              }}
            >
              Discover thousands of career opportunities tailored to your passions and talents. Start your journey today.
            </Typography>

            {/* Search Inputs */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 4,
              '& > *': {
                flex: 1,
                minWidth: 0,
              }
            }}>
              <SearchBarWrapper>
                <WorkOutlineIcon sx={{ color: theme.palette.primary.light, ml: 1.5, mr: 1 }} />
                <SearchInput
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJobSearch()}
                />
                <SearchBtn onClick={handleJobSearch}>
                  <SearchIcon sx={{ color: '#fff' }} />
                </SearchBtn>
              </SearchBarWrapper>

              <SearchBarWrapper>
                <AddLocationAltIcon sx={{ color: theme.palette.primary.light, ml: 1.5, mr: 1 }} />
                <SearchInput
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleJobSearch()}
                />
                <SearchBtn onClick={handleJobSearch}>
                  <SearchIcon sx={{ color: '#fff' }} />
                </SearchBtn>
              </SearchBarWrapper>
            </Box>

          </Box>

          {/* Right Image Section */}
          <Box
            sx={{
              position: "relative",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 450, mb: 3 }}>
              <img
                src={advisorImage}
                alt="Advisor"
                style={{ width: "100%", borderRadius: 16 }}
              />
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: "10px 16px",
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}
              >
                <WorkOutlineIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.primary.main, cursor: 'default' }}> {/* Added cursor style here */}
                    100+ Jobs
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, cursor: 'default' }}> {/* Added cursor style here */}
                    Posted Daily
                  </Typography>
                </Box>
              </Paper>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%', mt: 2 }}
            >
              <Button
                variant="contained"
                onClick={handleBrowseJobs}
                sx={{
                  fontSize: "1.1rem",
                  borderRadius: 999,
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  textTransform: "none",
                  px: 5,
                  py: 1.2,
                  width: { xs: '100%', sm: 'auto' },
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                Browse Jobs
              </Button>
              <Typography variant="h6" sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                cursor: 'default', // Added cursor style here
              }}>
                <strong>5k+</strong>
                <br /> Daily Active Users
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </GradientBackground>
  );
};

export default HomePage;