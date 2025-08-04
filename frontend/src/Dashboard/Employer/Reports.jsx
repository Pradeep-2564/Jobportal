import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Menu, MenuItem, Stack,
  useTheme, Divider, useMediaQuery // Import useMediaQuery for responsive design
} from '@mui/material';
import { PictureAsPdf, InsertDriveFile, Download, Dashboard } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, LabelList
} from 'recharts';

const StatCard = ({ label, value }) => { // Removed unused 'icon' prop here to align with usage
  const theme = useTheme();
  return (
    <Paper elevation={0} sx={{
      p: { xs: 2, sm: 3 }, // Responsive padding
      borderRadius: 4,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2]
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{
          p: 1.5,
          borderRadius: '50%',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Icon removed from StatCard props, so commented out usage here */}
          {/* <Icon sx={{
            fontSize: 28,
            color: theme.palette.primary.main
          }} /> */}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            fontSize: { xs: '0.7rem', sm: '0.875rem' } // Responsive font size
          }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.8rem', sm: '2.125rem' } // Responsive font size
          }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const Reports = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screens
  const [stats, setStats] = useState({});
  const [jobs, setJobs] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [exportType, setExportType] = useState('all');

  useEffect(() => {
    const jobPosts = JSON.parse(localStorage.getItem('job_posts')) || [];
    const jobApplicants = JSON.parse(localStorage.getItem('job_applicants')) || [];

    const applied = jobApplicants.length;
    const open = jobPosts.filter(j => j.status === 'Open').length;
    const closed = jobPosts.filter(j => j.status === 'Closed').length;

    const monthlyMap = {};
    jobPosts.forEach(job => {
      if (!job.date) return;
      const date = new Date(job.date);
      // Ensure the month is extracted consistently
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // Added year to avoid collision for same month different year
      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
    });

    // Create an array of all months (e.g., Jan 2023, Feb 2023, ..., Dec 2023, Jan 2024...)
    // For a more robust solution, you might want to consider the actual range of job posting dates.
    // For simplicity, let's assume we are tracking for the current year or a fixed set.
    // If job.date always includes a year, the previous toLocaleString will correctly differentiate.
    // Here, let's just make sure the `monthlyData` is properly sorted and includes all months present in data.
    const allDates = jobPosts.map(job => new Date(job.date)).sort((a, b) => a - b);
    const minDate = allDates.length > 0 ? allDates[0] : new Date();
    const maxDate = allDates.length > 0 ? allDates[allDates.length - 1] : new Date();

    const chartData = [];
    let currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (currentDate <= maxDate) {
      const monthYear = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      chartData.push({
        month: monthYear,
        count: monthlyMap[monthYear] || 0
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    // If no jobs posted, show at least current month with 0 count
    if (chartData.length === 0 && jobPosts.length === 0) {
        const currentMonthYear = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
        chartData.push({ month: currentMonthYear, count: 0 });
    }

    setStats({ applied, open, closed });
    setJobs(jobPosts);
    setMonthlyData(chartData);
  }, []);

  const downloadXLSX = (data, sheetName, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  };

  const downloadPDF = (data, title, filename) => {
    if (!data.length) return;

    const doc = new jsPDF();
    doc.text(title, 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [Object.keys(data[0])],
      body: data.map(obj => Object.values(obj)),
      theme: 'striped',
      styles: { fontSize: 10 }
    });

    doc.save(filename);
  };

  const handleExportClick = (event, type) => {
    setExportType(type);
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
    setExportType('all');
  };

  const handleExport = (format) => {
    let data = jobs;
    let title = 'All Jobs';
    let filename = 'All_Jobs';

    if (exportType === 'open') {
      data = jobs.filter(j => j.status === 'Open');
      title = 'Open Jobs';
      filename = 'Open_Jobs';
    } else if (exportType === 'closed') {
      data = jobs.filter(j => j.status === 'Closed');
      title = 'Closed Jobs';
      filename = 'Closed_Jobs';
    } else if (exportType === 'applicants') {
      const jobApplicants = JSON.parse(localStorage.getItem('job_applicants')) || [];
      data = jobApplicants;
      title = 'Applicants';
      filename = 'Applicants';
    }

    if (format === 'pdf') {
      downloadPDF(data, title, `${filename}.pdf`);
    } else {
      downloadXLSX(data, title, `${filename}.xlsx`);
    }

    handleExportClose();
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 3 }, // Responsive padding for the main container
      minHeight: '100vh'
    }}>
      <Typography variant="h4" sx={{
        mb: 4,
        fontWeight: 700,
        color: theme.palette.primary.dark,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        fontSize: { xs: '1.75rem', sm: '2.125rem' } // Responsive font size
      }}>
        <Dashboard sx={{ fontSize: { xs: 30, sm: 36 } }} /> {/* Responsive icon size */}
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}> {/* Adjusted to sm=6 for better tablet layout */}
          <StatCard
            label="Applied Candidates"
            value={stats.applied}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Open Jobs"
            value={stats.open}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            label="Closed Jobs"
            value={stats.closed}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{
        p: { xs: 2, sm: 3 }, // Responsive padding
        mb: 4,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}>
        <Typography variant="h6" sx={{
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: { xs: '1rem', sm: '1.25rem' } // Responsive font size
        }}>
          Monthly Job Postings
        </Typography>
        <ResponsiveContainer width="100%" height={isSmallScreen ? 200 : 300}> {/* Shorter chart on small screens */}
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: isSmallScreen ? 10 : 12 }} // Smaller ticks on small screen
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: isSmallScreen ? 10 : 12 }} // Smaller ticks on small screen
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                boxShadow: theme.shadows[3],
                border: 'none'
              }}
            />
            <Bar
              dataKey="count"
              fill={theme.palette.primary.main}
              radius={[8, 8, 0, 0]}
              barSize={isSmallScreen ? 18 : 24} // Smaller bars on small screen
            >
              <LabelList
                dataKey="count"
                position="top"
                formatter={(value) => `${value} Posts`}
                style={{
                  fill: theme.palette.text.primary,
                  fontWeight: 500,
                  fontSize: isSmallScreen ? 10 : 12 // Smaller labels on small screen
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={0} sx={{
        p: { xs: 2, sm: 3 }, // Responsive padding
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}>
        <Typography variant="h6" sx={{
          mb: 3,
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontSize: { xs: '1rem', sm: '1.25rem' } // Responsive font size
        }}>
          Export Reports
        </Typography>

        <Grid container spacing={2}>
          {['All Jobs', 'Open Jobs', 'Closed Jobs', 'Applicants'].map((label) => (
            <Grid item xs={12} sm={6} md={3} key={label}> {/* xs=12, sm=6 for 2 columns on small/medium */}
              <Button
                fullWidth
                variant="outlined"
                onClick={(e) => handleExportClick(e, label.toLowerCase().replace(' ', '_'))}
                startIcon={<Download sx={{ color: theme.palette.primary.main }} />}
                sx={{
                  p: { xs: 1.5, sm: 2 }, // Responsive padding for buttons
                  borderRadius: 2,
                  borderColor: theme.palette.divider,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.primary.light + '20'
                  }
                }}
              >
                <Typography variant="body1" sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '0.8rem', sm: '1rem' } // Responsive font size for button text
                }}>
                  {label}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={() => handleExport('xlsx')} sx={{ py: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <InsertDriveFile sx={{
              fontSize: 20,
              color: theme.palette.success.main
            }} />
            <Typography variant="body2">Excel (.xlsx)</Typography>
          </Stack>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleExport('pdf')} sx={{ py: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <PictureAsPdf sx={{
              fontSize: 20,
              color: theme.palette.error.main
            }} />
            <Typography variant="body2">PDF Document</Typography>
          </Stack>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Reports;