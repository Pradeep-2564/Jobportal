import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';

const AboutUs = ({ mode }) => {
  return (
    <Box sx={{ bgcolor: mode === 'dark' ? 'background.default' : 'background.paper' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'primary.main',
          color: 'white',
          py: 8,
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom>
            About Us
          </Typography>
          <Typography variant="h5" align="center" color="inherit" paragraph>
            Your trusted partner in finding the perfect career opportunities
          </Typography>
        </Container>
      </Box>

      {/* Company Overview */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Founded in 2025, JobPortal is a leading job search platform connecting
          talented professionals with top employers across various industries.
          Our mission is to simplify the job search process and help people find
          their dream careers.
        </Typography>
        <Typography variant="body1" paragraph>
          With a focus on user experience and innovative technology, we've helped
          thousands of job seekers find meaningful employment opportunities while
          helping companies build their dream teams.
        </Typography>
      </Container>

      {/* Our Values */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Our Values
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'inherit',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Integrity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We maintain the highest standards of honesty and transparency
                  in all our operations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'inherit',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Innovation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We constantly innovate to provide the best job search experience
                  for our users.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'inherit',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Excellence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We strive for excellence in everything we do, from our platform
                  to our customer service.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'inherit',
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Community
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We believe in building strong communities and helping each other
                  succeed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Contact Us */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'background.paper', p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Get in Touch
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    <LocationOn sx={{ mr: 1 }} /> 123 Tech Street, Silicon Valley, CA
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <Phone sx={{ mr: 1 }} /> +1 234 567 8900
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    <Email sx={{ mr: 1 }} /> info@jobportal.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <IconButton color="primary">
                    <Facebook />
                  </IconButton>
                  <IconButton color="primary">
                    <Twitter />
                  </IconButton>
                  <IconButton color="primary">
                    <LinkedIn />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'background.paper', p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Send us a Message
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2 }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;
