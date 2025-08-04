import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Typography, Button, MenuItem, Snackbar,
  Alert, Autocomplete, Grid, Paper, Divider, InputAdornment,
  useTheme, useMediaQuery // Import useTheme and useMediaQuery
} from '@mui/material';
import {
  Title as TitleIcon,
  Work as WorkIcon,
  CalendarToday as DateIcon,
  Business as IndustryIcon,
  Description as DescriptionIcon,
  School as EducationIcon,
  TrendingUp as ExperienceIcon,
  Category as DepartmentIcon,
  Code as SkillsIcon,
  CardGiftcard as BenefitsIcon,
  AttachMoney as SalaryIcon,
  LocationOn as LocationIcon,
  Public as CountryIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

const jobTypes = ['Contract', 'Full-time', 'Part-time'];
const countries = ['Australia', 'Canada', 'France', 'Germany', 'India', 'Ireland', 'Japan', 'Sweden', 'UK', 'US'];
const citiesByCountry = {
  India: ['Ahmedabad', 'Bangalore', 'Chandigarh', 'Chennai', 'Delhi & NCR', 'Hyderabad', 'Kochi', 'Kolkata', 'Mumbai', 'Thiruvananthapuram'],
  US: ['New York', 'San Francisco', 'Chicago', 'Seattle', 'Boston'],
  UK: ['London', 'Manchester', 'Birmingham', 'Leeds'],
  Germany: ['Berlin', 'Munich', 'Frankfurt'],
  Canada: ['Toronto', 'Vancouver', 'Montreal'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane'],
  Ireland: ['Dublin', 'Cork'],
  France: ['Paris', 'Lyon'],
  Sweden: ['Stockholm', 'Gothenburg'],
  Japan: ['Tokyo', 'Osaka']
};

const JobPosting = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detect small screens

  const [snackOpen, setSnackOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const editingJob = location?.state?.job || null;

  const {
    handleSubmit, control, reset, watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '', type: '', description: '', location: '', minSalary: '',
      maxSalary: '', openings: '', jobLevel: '', department: '', benefits: '',
      qualification: '', skills: '', country: 'India',
      industry: '', lastDateToApply: ''
    }
  });

  const selectedCountry = watch('country') || 'India';
  const cities = citiesByCountry[selectedCountry] || [];

  useEffect(() => {
    if (editingJob) {
      reset({
        ...editingJob,
        country: editingJob.country || 'India'
      });
    }
  }, [editingJob, reset]);

  const onSubmit = (data) => {
    try {
      const storedJobs = JSON.parse(localStorage.getItem("job_posts")) || [];
      let updatedJobs = [];

      if (editingJob) {
        updatedJobs = storedJobs.map(job =>
          job.id === editingJob.id
            ? { ...job, ...data, id: job.id, status: job.status, date: job.date }
            : job
        );
      } else {
        const newJob = {
          ...data,
          id: Date.now(),
          applicants: 0,
          status: "Open",
          date: new Date().toISOString()
        };
        updatedJobs = [...storedJobs, newJob];

        const notifications = JSON.parse(localStorage.getItem("jobseeker_notifications")) || [];
        const newNotification = {
          id: Date.now(),
          type: "new_job",
          title: `New Job Posted: ${data.title}`,
          message: `A new ${data.type} position for ${data.title} has been posted in ${data.location}`,
          read: false,
          timestamp: new Date().toISOString(),
          jobId: newJob.id
        };
        localStorage.setItem("jobseeker_notifications", JSON.stringify([...notifications, newNotification]));
      }

      localStorage.setItem("job_posts", JSON.stringify(updatedJobs));
      setSnackOpen(true);
      reset();
      setTimeout(() => navigate('/dashboard/recruiter/job-lists'), 800);
    } catch (error) {
      console.error("Job submission failed:", error);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    variant: "outlined",
    margin: "normal", // This prop helps with vertical spacing
    size: isSmallScreen ? "small" : "medium", // Smaller size on small screens
    InputProps: { style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } },
    InputLabelProps: { style: { fontSize: isSmallScreen ? '0.875rem' : 'inherit' } }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 1200, mx: 'auto', my: { xs: 1, md: 3 }, p: { xs: 2, md: 4 }, borderRadius: 2 }}> {/* Responsive margin and padding */}
      <Typography variant="h5" fontWeight={600} mb={3} display="flex" alignItems="center" gap={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}> {/* Responsive font size */}
        <WorkIcon color="primary" sx={{ fontSize: { xs: 24, sm: 'inherit' } }} /> {/* Responsive icon size */}
        {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={isSmallScreen ? 2 : 3}> {/* Smaller spacing on small screens */}
          {/* Row 1 */}
          <Grid item xs={12} md={6}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Job title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Job Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  InputProps={{
                    ...textFieldProps.InputProps, // Merge existing input props
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="openings"
              control={control}
              rules={{
                required: 'Available vacancies are required',
                min: { value: 1, message: 'At least one vacancy is required' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Available Vacancies"
                  type="number"
                  error={!!errors.openings}
                  helperText={errors.openings?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} md={6}>
            <Controller
              name="lastDateToApply"
              control={control}
              rules={{ required: 'Last date to apply is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  type="date"
                  label="Last Date to Apply"
                  error={!!errors.lastDateToApply}
                  helperText={errors.lastDateToApply?.message}
                  InputLabelProps={{ ...textFieldProps.InputLabelProps, shrink: true }} // Ensure label shrinks
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="industry"
              control={control}
              rules={{ required: 'Industry is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Industry"
                  error={!!errors.industry}
                  helperText={errors.industry?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <IndustryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 3 */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Job description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  multiline
                  rows={isSmallScreen ? 3 : 4} // Fewer rows on small screens
                  label="Job Description"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignItems: 'flex-start', mt: 1 }}> {/* Align icon to top for multiline */}
                        <DescriptionIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 4 */}
          <Grid item xs={12} md={6}>
            <Controller
              name="qualification"
              control={control}
              rules={{ required: 'Qualification / Education is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Qualification / Education Required"
                  error={!!errors.qualification}
                  helperText={errors.qualification?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EducationIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="jobLevel"
              control={control}
              rules={{ required: 'Experience level is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Experience Required"
                  error={!!errors.jobLevel}
                  helperText={errors.jobLevel?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <ExperienceIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 5 */}
          <Grid item xs={12} md={6}>
            <Controller
              name="department"
              control={control}
              rules={{ required: 'Department is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Specialization Required"
                  error={!!errors.department}
                  helperText={errors.department?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <DepartmentIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="skills"
              control={control}
              rules={{ required: 'Skills are required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Skills Required (comma separated)"
                  placeholder="e.g., React, Node.js, SQL"
                  error={!!errors.skills}
                  helperText={errors.skills?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SkillsIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 6 */}
          <Grid item xs={12} md={6}>
            <Controller
              name="benefits"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Benefits (comma separated)"
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <BenefitsIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="minSalary"
              control={control}
              rules={{
                required: 'Minimum salary is required',
                min: { value: 0, message: 'Minimum salary cannot be negative' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Minimum Salary"
                  type="number"
                  error={!!errors.minSalary}
                  helperText={errors.minSalary?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SalaryIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">LPA</InputAdornment>,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Controller
              name="maxSalary"
              control={control}
              rules={{
                required: 'Maximum salary is required',
                min: { value: 0, message: 'Maximum salary cannot be negative' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  label="Maximum Salary"
                  type="number"
                  error={!!errors.maxSalary}
                  helperText={errors.maxSalary?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SalaryIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">LPA</InputAdornment>,
                  }}
                />
              )}
            />
          </Grid>

          {/* Row 7 */}
          <Grid item xs={12} md={4}>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Employment type is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  {...textFieldProps}
                  select
                  label="Employment Type"
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  InputProps={{
                    ...textFieldProps.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="country"
              control={control}
              rules={{ required: 'Country is required' }}
              render={({ field }) => (
                <Autocomplete
                  options={countries.sort()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...textFieldProps} // Apply common props
                      label="Country"
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      InputProps={{
                        ...params.InputProps,
                        ...textFieldProps.InputProps, // Merge Autocomplete's InputProps with common ones
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <CountryIcon color="action" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      InputLabelProps={{...params.InputLabelProps, ...textFieldProps.InputLabelProps}} // Merge label props
                    />
                  )}
                  onChange={(_, value) => field.onChange(value)}
                  value={field.value || 'India'}
                  freeSolo
                  size={textFieldProps.size} // Apply size to Autocomplete
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="location"
              control={control}
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <Autocomplete
                  options={cities.sort()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...textFieldProps} // Apply common props
                      label="City"
                      error={!!errors.location}
                      helperText={errors.location?.message}
                      InputProps={{
                        ...params.InputProps,
                        ...textFieldProps.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocationIcon color="action" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                      InputLabelProps={{...params.InputLabelProps, ...textFieldProps.InputLabelProps}}
                    />
                  )}
                  onChange={(_, value) => field.onChange(value)}
                  value={field.value || ''}
                  freeSolo
                  size={textFieldProps.size}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: { xs: 1.5, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}> {/* Stack buttons on xs */}
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard/recruiter/job-lists')}
            sx={{ px: { xs: 2, sm: 4 }, fontSize: { xs: '0.8rem', sm: 'inherit' } }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ px: { xs: 2, sm: 4 }, fontSize: { xs: '0.8rem', sm: 'inherit' } }}
            startIcon={<WorkIcon />}
          >
            {editingJob ? 'Update Job' : 'Post Job'}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {editingJob ? 'Job updated successfully!' : 'Job posted successfully!'}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default JobPosting;