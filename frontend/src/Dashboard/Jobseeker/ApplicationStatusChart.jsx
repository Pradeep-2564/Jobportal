import React from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
// FIX: Import PieChart from @mui/x-charts instead of recharts
import { PieChart } from '@mui/x-charts/PieChart';

const ApplicationStatusChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Prepare data for @mui/x-charts: array of objects with id, value, and label
  const chartData = Object.entries(data)
    .map(([label, value], id) => ({ id, value, label }))
    .filter(item => item.value > 0);

  // Calculate the total sum of values to compute percentages for the tooltip
  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Paper elevation={2} sx={{ borderRadius: 4, p: 2, height: isMobile ? '350px' : '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{fontWeight: 900}}>
        Status Distribution
      </Typography>
      {chartData.length > 0 ? (
        <PieChart
          // Series configuration for the chart data
          series={[
            {
              data: chartData,
              // Style properties to match the screenshot
              innerRadius: 80,
              outerRadius: isMobile ? 110 : 120,
              paddingAngle: 5,
              cornerRadius: 8,
              // Highlight effect on hover
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 75, additionalRadius: -5, color: 'gray' },
              // Formatter to show percentage in the tooltip
              valueFormatter: (item) => `${((item.value / total) * 100).toFixed(1)}%`,
            },
          ]}
          // Adjust height to fit the container
          height={isMobile ? 300 : 350}
          // Hide the default legend to match the clean look
          slotProps={{
              legend: { hidden: true }
          }}
          // Set custom colors
          colors={['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8', '#AF19FF']}
          sx={{cursor:'default'}}
        />
      ) : (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">No application data available.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ApplicationStatusChart;