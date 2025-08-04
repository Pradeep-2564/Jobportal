import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Chip, IconButton, Tooltip, Divider, Paper,
  Table, TableBody, TableCell, TableRow,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkBorder, ArrowBack } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const allJobs = JSON.parse(localStorage.getItem('job_posts')) || [];
    setJobs(allJobs);
    const found = allJobs.find(j => j.id === parseInt(jobId));
    setJob(found);
  }, [jobId]);

  const updateJobs = (updatedJob) => {
    const updated = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    localStorage.setItem('job_posts', JSON.stringify(updated));
    setJobs(updated);
    setJob(updatedJob);
  };

  const handleSave = () => {
    if (!job) return;
    const updated = { ...job, saved: !job.saved };
    updateJobs(updated);
    toast.success(updated.saved ? 'Saved job!' : 'Unsaved job!');
  };

  const handleApply = () => {
    if (!job || job.applied) return;

    const updatedJob = { ...job, applied: true };
    updateJobs(updatedJob);
    toast.success('Applied successfully!');

    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const resumeData = JSON.parse(localStorage.getItem('userResume')) || null;
    const education = JSON.parse(localStorage.getItem('userEducation')) || [];
    const skills = JSON.parse(localStorage.getItem('userSkills')) || [];
    const quickLinks = JSON.parse(localStorage.getItem('userQuickLinks')) || {};
    const profileImage = localStorage.getItem('userProfileImage') || '';

    const newApplicant = {
      id: Date.now(),
      name: profile.name || 'Jobseeker',
      email: profile.contact || 'email@example.com',
      phone: profile.phone || '0000000000',
      appliedFor: job.title,
      jobId: job.id,
      status: 'Applied',
      resume: resumeData,
      profileImage: profileImage,
      fullProfile: {
        ...profile,
        education,
        skills,
        quickLinks,
        resume: resumeData
      }
    };

    const apps = JSON.parse(localStorage.getItem('job_applicants')) || [];
    apps.push(newApplicant);
    localStorage.setItem('job_applicants', JSON.stringify(apps));

    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs')) || [];
    appliedJobs.push(newApplicant);
    localStorage.setItem('applied_jobs', JSON.stringify(appliedJobs));

    const recruiterNotifications = JSON.parse(localStorage.getItem('recruiter_notifications')) || [];
    recruiterNotifications.unshift({
      id: Date.now(),
      type: 'application',
      jobId: job.id,
      message: `New application for ${job.title}`,
      read: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recruiter_notifications', JSON.stringify(recruiterNotifications));
  };

  if (!job) return <Typography sx={{ p: 2 }}>Loading job...</Typography>;

  const skillList = job.skills ? job.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const specializationList = job.department ? job.department.split(',').map(s => s.trim()).filter(Boolean) : [];
  const benefitList = job.benefits ? job.benefits.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: 2, py: 2 }}>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar />
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2 }} startIcon={<ArrowBack />}>Back</Button>

        <Typography variant="h5" fontWeight={700} gutterBottom>{job.title}</Typography>
        <Typography variant="body2" color="text.secondary">{job.location} | {job.type}</Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ overflowX: 'auto', mb: 2 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>Role</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>Experience</TableCell>
                <TableCell>{job.jobLevel || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Reports to</TableCell>
                <TableCell>Hiring Manager</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Vacancies</TableCell>
                <TableCell>{job.openings || '-'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell><Chip label={job.status} color={job.status === 'Open' ? 'success' : 'error'} size="small" /></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Date</TableCell>
                <TableCell>{job.lastDateToApply || '-'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Typography variant="subtitle1" gutterBottom>Job Summary</Typography>
        <Typography variant="body2" paragraph>
          The <strong>{job.title}</strong> will join our team to drive innovation and deliver quality experiences.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>Job Responsibilities</Typography>
        <Box sx={{ overflowX: 'auto', mb: 2 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, width: 120 }}>Key Area</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tasks</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Customer Service</TableCell>
                <TableCell>Engage customers positively and resolve concerns.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Teamwork</TableCell>
                <TableCell>Work closely with internal teams.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle1">Qualification</Typography>
          <Typography variant="body2">{job.qualification || '-'}</Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Skills Required</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {skillList.length > 0 ? skillList.map((s, i) => <Chip key={i} label={s} size="small" />) : <Typography variant="body2">No skills listed.</Typography>}
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Specialization</Typography>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {specializationList.map((spec, i) => <li key={i}><Typography variant="body2">{spec}</Typography></li>)}
          </ul>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle1">Benefits</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {benefitList.length > 0 ? benefitList.map((b, i) => <Chip key={i} label={b} size="small" />) : <Typography variant="body2">Not specified.</Typography>}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1">How to Apply</Typography>
        <Typography variant="body2" paragraph>
          Submit your resume via the application form.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="contained" onClick={handleApply} disabled={job.applied} size="small">
            {job.applied ? 'Applied' : 'Apply Now'}
          </Button>
          <Tooltip title={job.saved ? 'Unsave' : 'Save'}>
            <IconButton onClick={handleSave} size="small">
              {job.saved ? <Bookmark color="primary" /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default JobDetails;