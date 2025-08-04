import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputAdornment,
  MenuItem,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  ReportProblem as ReportProblemIcon,
  Help as HelpIcon,
  Phone as PhoneIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const HelpSupport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [expanded, setExpanded] = useState(false);
  const [problemType, setProblemType] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const userName = loggedInUser?.name || 'Job Seeker';

  const hour = new Date().getHours();
  const greetingData = hour < 12
    ? { text: 'Good Morning', color: '#FFA726', emoji: '☀️' }
    : hour < 17
    ? { text: 'Good Afternoon', color: '#29B6F6', emoji: '🌤️' }
    : { text: 'Good Evening', color: '#AB47BC', emoji: '🌇' };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProblemType('');
    setEmail('');
    setDescription('');
  };

  const problemTypes = [
    'Technical Issue',
    'Account Problem',
    'Payment Issue',
    'Application Problem',
    'Other'
  ];

  const filteredFaqs = [
    {
      question: 'How do I update my profile information?',
      answer: 'Go to Profile Management from the sidebar to edit details.'
    },
    {
      question: 'How can I apply for a job?',
      answer: 'Open Job Listings and click "Apply Now" on your desired job.'
    },
    {
      question: 'How do I save a job?',
      answer: 'Use the bookmark icon on any job to save it.'
    },
    {
      question: 'Where can I see interviews?',
      answer: 'Your Interview Schedule section lists all interviews.'
    },
    {
      question: 'How do I change notifications?',
      answer: 'Go to Settings to manage your notification preferences.'
    }
  ].filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactMethods = [
    {
      icon: <EmailIcon fontSize="small" color="primary" />,
      title: 'Email',
      description: 'support@careerquest.com',
      action: 'Replies in 24 hrs'
    },
    {
      icon: <ChatIcon fontSize="small" color="primary" />,
      title: 'Live Chat',
      description: '9AM–6PM IST',
      action: 'Instant help'
    },
    {
      icon: <PhoneIcon fontSize="small" color="primary" />,
      title: 'Phone',
      description: '+1 (555) 123-4567',
      action: '24/7 urgent support'
    }
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          mb: 2,
          p: 2,
          backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f4f4f4',
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: greetingData.color, fontSize: '16px' }}
        >
          {greetingData.emoji} {greetingData.text}, {userName}!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          How can we help you today?
        </Typography>
        <TextField
          fullWidth
          placeholder="Search help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: {
              backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#fff',
              borderRadius: 1,
              fontSize: '13px'
            }
          }}
          inputProps={{ style: { fontSize: '13px' } }}
        />
      </Box>

      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <HelpIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
          FAQs
        </Typography>
        <Divider sx={{ my: 1 }} />
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                <Typography sx={{ fontSize: '13px', fontWeight: expanded === `panel${index}` ? 'bold' : 'normal' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ fontSize: '12px' }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography color="text.secondary" textAlign="center" fontSize="13px">
            No results found.
          </Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box flex={1}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '14px', mb: 1 }}>
              <ChatIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
              Contact
            </Typography>
            <List dense>
              {contactMethods.map((method, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                      {method.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography fontSize="13px">{method.title}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" fontSize="12px">{method.description}</Typography>
                        <Typography variant="caption" fontSize="11px" color="text.secondary">
                          {method.action}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Box flex={1}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '14px', mb: 1 }}>
              <ReportProblemIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
              Report Problem
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Problem Type"
                    value={problemType}
                    onChange={(e) => setProblemType(e.target.value)}
                    required
                    InputLabelProps={{ style: { fontSize: '13px' } }}
                    inputProps={{ style: { fontSize: '13px' } }}
                  >
                    {problemTypes.map((type) => (
                      <MenuItem key={type} value={type} style={{ fontSize: '13px' }}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputLabelProps={{ style: { fontSize: '13px' } }}
                    inputProps={{ style: { fontSize: '13px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    InputLabelProps={{ style: { fontSize: '13px' } }}
                    inputProps={{ style: { fontSize: '13px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" size="small" fullWidth sx={{ fontSize: '13px' }}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default HelpSupport;
