import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const ProfileManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const certificateInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editData, setEditData] = useState({});
  const [educationList, setEducationList] = useState(() => {
    const saved = localStorage.getItem("userEducation");
    return saved ? JSON.parse(saved) : [];
  });
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem("userSkills");
    return saved ? JSON.parse(saved) : [];
  });
  const [quickLinks, setQuickLinks] = useState(() => {
    const saved = localStorage.getItem("userQuickLinks");
    return saved
      ? JSON.parse(saved)
      : {
          linkedin: "",
          github: "",
        };
  });
  const [editingEducationIndex, setEditingEducationIndex] = useState(null);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    year: "",
    type: "",
    score: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [editSkillIndex, setEditSkillIndex] = useState(null);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [editLinksOpen, setEditLinksOpen] = useState(false);
  const [editLinksData, setEditLinksData] = useState({
    linkedin: "",
    github: "",
  });
  const [activeTab, setActiveTab] = useState("INTERNSHIPS");
  const [internships, setInternships] = useState(() => {
    const saved = localStorage.getItem("userInternships");
    return saved ? JSON.parse(saved) : [];
  });
  const [experiences, setExperiences] = useState(() => {
    const saved = localStorage.getItem("userExperiences");
    return saved ? JSON.parse(saved) : [];
  });
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("userProjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem("userCertificates");
    return saved ? JSON.parse(saved) : [];
  });
  const [newExperience, setNewExperience] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });
  const [newInternship, setNewInternship] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });
  const [newProject, setNewProject] = useState({
    title: "",
    technologies: "",
    duration: "",
    description: "",
  });
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    organization: "",
    issueDate: "",
    file: null,
  });
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [editingCertIndex, setEditingCertIndex] = useState(null);

  const [userInfo, setUserInfo] = useState(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      const initialProfile = {
        name: loggedInUser.name || "Full Name",
        about: "No description provided.",
        contact: loggedInUser.email || "example@mail.com",
        phone: loggedInUser.mobile || "11111-00000",
      };
      localStorage.setItem("userProfile", JSON.stringify(initialProfile));
      return initialProfile;
    }
    return {
      name: "Full Name",
      about: "No description provided.",
      contact: "example@mail.com",
      phone: "11111-00000",
    };
  });

  useEffect(() => {
    const savedImage = localStorage.getItem("userProfileImage");
    if (savedImage) setProfileImage(savedImage);

    const savedResume = localStorage.getItem("userResume");
    if (savedResume) setResumeFile(JSON.parse(savedResume));
  }, []);

  const calculateStepCompletion = () => {
    const currentDefaults = {
        name: "Full Name",
        about: "No description provided.",
        contact: "example@mail.com",
        phone: "11111-00000",
    };

    const steps = {
      Profile: (userInfo.name !== currentDefaults.name && userInfo.name.trim() !== "") ||
               (userInfo.about !== currentDefaults.about && userInfo.about.trim() !== "") ||
               (userInfo.contact !== currentDefaults.contact && userInfo.contact.trim() !== "") ||
               (userInfo.phone !== currentDefaults.phone && userInfo.phone.trim() !== ""),
      Education: educationList.length > 0,
      Experience: experiences.length > 0,
      Internship: internships.length > 0,
      Projects: projects.length > 0,
      Certifications: certificates.length > 0,
      Skills: skills.length > 0,
      Resume: !!resumeFile,
      "Quick Links": quickLinks.linkedin || quickLinks.github,
    };
    return steps;
  };

  const calculateProgress = () => {
    const steps = calculateStepCompletion();
    const filledSections = Object.values(steps).filter(Boolean).length;
    const totalSections = Object.keys(steps).length;
    return Math.round((filledSections / totalSections) * 100);
  };

  const [progress, setProgress] = useState(calculateProgress());
  const stepsCompletion = calculateStepCompletion();

  useEffect(() => {
    setProgress(calculateProgress());
  }, [
    userInfo,
    educationList,
    skills,
    experiences,
    internships,
    projects,
    certificates,
    resumeFile,
    profileImage,
    quickLinks,
  ]);

  const getProgressColor = () => {
    if (progress < 30) return "#ef4444";
    if (progress < 60) return "#f97316";
    if (progress < 90) return "#facc15";
    return "#4caf50";
  };

  const validateUrl = (url) => {
    if (!url) return true;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(url);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("userProfileImage", reader.result);
        showToast("Profile image updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file),
      };
      setResumeFile(fileData);
      localStorage.setItem("userResume", JSON.stringify(fileData));
      showToast("Resume uploaded successfully");
    }
  };

  const handleCertificateUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        url: URL.createObjectURL(file),
      };
      setNewCertificate({
        ...newCertificate,
        file: fileData,
      });
      showToast("Certificate file uploaded");
    }
  };

  const handleViewResume = () => {
    setResumeDialogOpen(true);
  };

  const handleViewCertificate = (certificate) => {
    if (certificate.file?.type === "application/pdf") {
      window.open(certificate.file.url, "_blank");
    } else {
      setCertificateDialogOpen(true);
    }
  };

  const handleDownloadCertificate = (certificate) => {
    if (!certificate.file?.url) return;

    const link = document.createElement("a");
    link.href = certificate.file.url;
    link.download = certificate.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Certificate download started");
  };

  const handleDownloadResume = () => {
    if (!resumeFile?.url) return;

    const link = document.createElement("a");
    link.href = resumeFile.url;
    link.download = resumeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Resume download started");
  };

  const handleEditOpen = () => {
    setEditData({ ...userInfo });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    setUserInfo({ ...editData });
    setEditOpen(false);
    localStorage.setItem("userProfile", JSON.stringify(editData));
    showToast("Profile updated successfully");
  };

  const handleEditLinksOpen = () => {
    setEditLinksData({ ...quickLinks });
    setEditLinksOpen(true);
  };

  const handleSaveLinks = () => {
    if (!validateUrl(editLinksData.linkedin) || !validateUrl(editLinksData.github)) {
      showToast("Please enter valid URLs for LinkedIn and GitHub", "error");
      return;
    }
    setQuickLinks({ ...editLinksData });
    setEditLinksOpen(false);
    localStorage.setItem("userQuickLinks", JSON.stringify(editLinksData));
    showToast("Quick links updated");
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleAddEducation = () => {
    setEditingEducationIndex(educationList.length);
    setNewEducation({
      degree: "",
      institution: "",
      year: "",
      type: "",
      score: "",
    });
  };

  const handleEditEducation = (index) => {
    setEditingEducationIndex(index);
    setNewEducation(educationList[index]);
  };

  const handleSaveEducation = () => {
    const updated = [...educationList];
    if (editingEducationIndex >= educationList.length) {
      updated.unshift(newEducation);
    } else {
      updated[editingEducationIndex] = newEducation;
    }
    setEducationList(updated);
    setEditingEducationIndex(null);
    setNewEducation({
      degree: "",
      institution: "",
      year: "",
      type: "",
      score: "",
    });
    localStorage.setItem("userEducation", JSON.stringify(updated));
    showToast("Education details saved");
  };

  const handleDeleteEducation = (index) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
    localStorage.setItem("userEducation", JSON.stringify(updated));
    showToast("Education deleted");
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");
      setEditSkillIndex(null);
      localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
      showToast("Skill added");
    }
  };

  const handleEditSkill = (index) => {
    setEditSkillIndex(index);
    setNewSkill(skills[index]);
  };

  const handleUpdateSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...skills];
      updatedSkills[editSkillIndex] = newSkill.trim();
      setSkills(updatedSkills);
      setEditSkillIndex(null);
      setNewSkill("");
      localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
      showToast("Skill updated");
    }
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
    showToast("Skill deleted");
  };

  const handleAddExperience = () => {
    setEditingExpIndex(experiences.length);
    setNewExperience({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
  };

  const handleAddInternship = () => {
    setEditingExpIndex(internships.length);
    setNewInternship({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
  };

  const handleAddProject = () => {
    setEditingExpIndex(projects.length);
    setNewProject({
      title: "",
      technologies: "",
      duration: "",
      description: "",
    });
  };

  const handleAddCertificate = () => {
    setEditingCertIndex(certificates.length);
    setNewCertificate({
      name: "",
      organization: "",
      issueDate: "",
      file: null,
    });
  };

  const handleSaveExperience = () => {
    const updated = [...experiences];
    if (editingExpIndex >= experiences.length) {
      updated.unshift(newExperience);
    } else {
      updated[editingExpIndex] = newExperience;
    }
    setExperiences(updated);
    setEditingExpIndex(null);
    setNewExperience({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
    localStorage.setItem("userExperiences", JSON.stringify(updated));
    showToast("Experience saved");
  };

  const handleSaveInternship = () => {
    const updated = [...internships];
    if (editingExpIndex >= internships.length) {
      updated.unshift(newInternship);
    } else {
      updated[editingExpIndex] = newInternship;
    }
    setInternships(updated);
    setEditingExpIndex(null);
    setNewInternship({
      role: "",
      company: "",
      duration: "",
      description: "",
    });
    localStorage.setItem("userInternships", JSON.stringify(updated));
    showToast("Internship saved");
  };

  const handleSaveProject = () => {
    const updated = [...projects];
    if (editingExpIndex >= projects.length) {
      updated.unshift(newProject);
    } else {
      updated[editingExpIndex] = newProject;
    }
    setProjects(updated);
    setEditingExpIndex(null);
    setNewProject({
      title: "",
      technologies: "",
      duration: "",
      description: "",
    });
    localStorage.setItem("userProjects", JSON.stringify(updated));
    showToast("Project saved");
  };

  const handleSaveCertificate = () => {
    const updated = [...certificates];
    if (editingCertIndex >= certificates.length) {
      updated.unshift(newCertificate);
    } else {
      updated[editingCertIndex] = newCertificate;
    }
    setCertificates(updated);
    setEditingCertIndex(null);
    setNewCertificate({
      name: "",
      organization: "",
      issueDate: "",
      file: null,
    });
    localStorage.setItem("userCertificates", JSON.stringify(updated));
    showToast("Certificate saved");
  };

  const handleDeleteExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    localStorage.setItem("userExperiences", JSON.stringify(updated));
    showToast("Experience deleted");
  };

  const handleDeleteInternship = (index) => {
    const updated = internships.filter((_, i) => i !== index);
    setInternships(updated);
    localStorage.setItem("userInternships", JSON.stringify(updated));
    showToast("Internship deleted");
  };

  const handleDeleteProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    localStorage.setItem("userProjects", JSON.stringify(updated));
    showToast("Project deleted");
  };

  const handleDeleteCertificate = (index) => {
    const updated = certificates.filter((_, i) => i !== index);
    setCertificates(updated);
    localStorage.setItem("userCertificates", JSON.stringify(updated));
    showToast("Certificate deleted");
  };

  const renderTabContent = () => {
    const contentWidth = isMobile ? "100%" : isTablet ? "28rem" : "35rem";
    
    switch (activeTab) {
      case "EXPERIENCE":
        return (
          <Box sx={{ width: contentWidth }}>
            {experiences.map((exp, index) => (
              <Box key={index} mb={2}>
                {index > 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {exp.role}
                      </Typography>
                      <Typography variant="body2">{exp.company}</Typography>
                      <Typography variant="body2">{exp.duration}</Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                        {exp.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box mt={isMobile ? 1 : 0}>
                    <IconButton
                      onClick={() => {
                        setEditingExpIndex(index);
                        setNewExperience(exp);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExperience(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddExperience}
              sx={{ mt: 2 }}
              fullWidth={isMobile}
            >
              Add Experience
            </Button>
          </Box>
        );
      case "INTERNSHIPS":
        return (
          <Box sx={{ width: contentWidth }}>
            {internships.map((internship, index) => (
              <Box key={index} mb={2}>
                {index > 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {internship.role}
                    </Typography>
                    <Typography variant="body2">{internship.company}</Typography>
                    <Typography variant="body2">{internship.duration}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {internship.description}
                    </Typography>
                  </Box>
                  <Box mt={isMobile ? 1 : 0}>
                    <IconButton
                      onClick={() => {
                        setEditingExpIndex(index);
                        setNewInternship(internship);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteInternship(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddInternship}
              sx={{ mt: 2 }}
              fullWidth={isMobile}
            >
              Add Internship
            </Button>
          </Box>
        );
      case "PROJECTS":
        return (
          <Box sx={{ width: contentWidth }}>
            {projects.map((project, index) => (
              <Box key={index} mb={2}>
                {index > 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {project.title}
                    </Typography>
                    <Typography variant="body2">{project.technologies}</Typography>
                    <Typography variant="body2">{project.duration}</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {project.description}
                    </Typography>
                  </Box>
                  <Box mt={isMobile ? 1 : 0}>
                    <IconButton
                      onClick={() => {
                        setEditingExpIndex(index);
                        setNewProject(project);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProject(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddProject}
              sx={{ mt: 2 }}
              fullWidth={isMobile}
            >
              Add Project
            </Button>
          </Box>
        );
      case "CERTIFICATIONS":
        return (
          <Box sx={{ width: contentWidth }}>
            {certificates.map((cert, index) => (
              <Box key={index} mb={2}>
                {index > 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {cert.name}
                    </Typography>
                    <Typography variant="body2">{cert.organization}</Typography>
                    <Typography variant="body2">Issued: {cert.issueDate}</Typography>
                    {cert.file && (
                      <Box display="flex" alignItems="center" mt={1}>
                        {cert.file.type === "application/pdf" ? (
                          <PictureAsPdfIcon color="error" />
                        ) : (
                          <InsertDriveFileIcon color="primary" />
                        )}
                        <Typography variant="body2" ml={1}>
                          {cert.file.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box mt={isMobile ? 1 : 0}>
                    <IconButton
                      onClick={() => {
                        setEditingCertIndex(index);
                        setNewCertificate(cert);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCertificate(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                    {cert.file && (
                      <>
                        <IconButton onClick={() => handleViewCertificate(cert)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDownloadCertificate(cert)}>
                          <DownloadIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddCertificate}
              sx={{ mt: 2 }}
              fullWidth={isMobile}
            >
              Add Certificate
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

   const renderProgressBar = () => {
    const allSteps = [
      "Profile", "Education", "Experience", "Internship",
      "Projects", "Certifications", "Skills", "Resume", "Quick Links"
    ];
    
    const displayedSteps = isMobile ? [
      "Profile", "Education", "Experience", "Skills", "Resume"
    ] : allSteps;

    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        width: '100%',
        overflowX: 'auto',
        py: 2,
        mb: 3,
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none', 
      }}>
        {displayedSteps.map((step, index) => {
          const isCompleted = stepsCompletion[step];
          return (
            <React.Fragment key={step}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 80,
              }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#4cb71a' : 'transparent',
                  color: isCompleted ? '#fff' : 'text.secondary',
                  border: isCompleted ? 'none' : `2px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}>
                  {isCompleted ? <CheckCircleIcon fontSize="small" /> : index + 1}
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 1, 
                    textAlign: 'center', 
                    color: isCompleted ? 'text.secondary' : 'text.secondary',
                    fontWeight: isCompleted ? '600' : '400'
                  }}
                >
                  {step}
                </Typography>
              </Box>

              {index < displayedSteps.length - 1 && (
                <Box sx={{
                  flex: 1,
                  height: '2.5px',
                  borderRadius:'9px',
                  backgroundColor: isCompleted ? '#4cb41c' : theme.palette.divider,
                  mt: '14px',
                  minWidth: 10,
                }} />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    );
  };

  return (
    <Box p={isMobile ? 1 : 1}>
      <Grid container spacing={2} sx={{ mb: 2, justifyContent: 'space-between'  }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ borderRadius: 4, p: isMobile ? 2 : 3, height: '100%', minWidth:590 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box 
                  position="relative" 
                  width={130} 
                  mb={isMobile ? 2 : 0}
                >
                  <Avatar 
                    src={profileImage} 
                    sx={{ 
                      width: 130, 
                      height: 130,
                      mx: 'auto'
                    }} 
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 'calc(50% - 65px + 1px)',
                      border: "1px solid #ccc",
                      p: 0.5,
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <CameraAltIcon fontSize="small" />
                  </IconButton>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={8}>
                <Box display="flex" alignItems="center" gap={1} justifyContent={isMobile ? 'center' : 'flex-start'}>
                  <Typography variant="h6" fontWeight="bold">
                    {userInfo.name}
                  </Typography>
                  <IconButton onClick={handleEditOpen}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box mt={1} textAlign={isMobile ? 'center' : 'left'}>
                    <Typography variant="body2" color="text.secondary">
                      {userInfo.contact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userInfo.phone}
                    </Typography>
                </Box>
                
                <Box mt={2} sx={{ width: "100%", maxWidth: isMobile ? '100%' : '24rem' }}>
                  <Typography variant="subtitle2" fontWeight="bold" textAlign={isMobile ? 'center' : 'left'}>
                    About Me:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      whiteSpace: "pre-line", 
                      textAlign: isMobile ? 'center' : 'left',
                      wordWrap: "break-word"
                    }}
                  >
                    {userInfo.about || "No description provided."}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ 
              p: 2, 
              textAlign: "center", 
              height: "100%",
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth:350,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Profile Completion
            </Typography>
            <Box
              position="relative"
              display="inline-flex"
              justifyContent="center"
              my={2}
            >
              <CircularProgress
                variant="determinate"
                value={progress}
                size={130}
                thickness={5}
                sx={{ color: getProgressColor() }}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="h5" component="div" color="text.primary" style={{fontWeight:"bolder"}}>
                  {`${progress}%`}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" mt={1} color="text.secondary">
              Complete your profile to boost visibility
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {renderProgressBar()}

      <Grid container spacing={2}>
        <Grid item xs={12} lg={9} order={{ xs: 2, lg: 1 }}>
          <Paper elevation={2} sx={{ borderRadius: 4, p: isMobile ? 1 : 2, mb: 2 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
              flexDirection={isMobile ? 'column' : 'row'}
              gap={isMobile ? 1 : 0}
            >
              <Typography variant="h6" fontWeight="bold">
                Education
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddEducation}
                fullWidth={isMobile}
              >
                Add Education
              </Button>
            </Box>
            {educationList.map((edu, index) => (
              <Box key={index} mb={2} sx={{ width: "100%" }}>
                {index > 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  flexDirection={isMobile ? 'column' : 'row'}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2">{edu.institution}</Typography>
                    <Typography variant="body2">
                      Graduated in {edu.year}, {edu.type}
                    </Typography>
                    <Typography variant="body2">Score: {edu.score}</Typography>
                  </Box>
                  <Box mt={isMobile ? 1 : 0}>
                    <IconButton onClick={() => handleEditEducation(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteEducation(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>

          <Paper elevation={2} sx={{ borderRadius: 4, p: isMobile ? 1 : 2, mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="EXPERIENCE" value="EXPERIENCE" />
              <Tab label="INTERNSHIPS" value="INTERNSHIPS" />
              <Tab label="PROJECTS" value="PROJECTS" />
              <Tab label="CERTIFICATIONS" value="CERTIFICATIONS" />
            </Tabs>
            {renderTabContent()}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={3} order={{ xs: 1, lg: 2 }}>
          <Paper
            elevation={2}
            sx={{
              borderRadius: 4,
              p: 2,
              width: { xs: '100%', md: '280px' },
              height: "auto",
              ml: { xs: 0, md: 3 },
              mb: 3,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
              flexDirection={isMobile ? 'column' : 'row'}
              gap={isMobile ? 1 : 0}
            >
              <Typography variant="h6" fontWeight="bold">
                Skills
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setEditSkillIndex(skills.length)}
                fullWidth={isMobile}
              >
                Add Skill
              </Button>
            </Box>
            <Box
              sx={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: 1, 
                width: "100%",
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}
            >
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(index)}
                  onClick={() => handleEditSkill(index)}
                  deleteIcon={<DeleteIcon fontSize="small" />}
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>

          <Paper
            elevation={2}
            sx={{
              borderRadius: 4,
              p: 2,
              width: { xs: '100%', md: '280px' },
              height: "auto",
              ml: { xs: 0, md: 3 },
              mb: 3,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
              flexDirection={isMobile ? 'column' : 'row'}
              gap={isMobile ? 1 : 0}
            >
              <Typography variant="h6" fontWeight="bold">
                Resume
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={resumeFile ? <EditIcon /> : <AddIcon />}
                onClick={() => resumeInputRef.current.click()}
                fullWidth={isMobile}
              >
                {resumeFile ? "Update" : "Upload"}
              </Button>
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                ref={resumeInputRef}
                onChange={handleResumeUpload}
              />
            </Box>
            {resumeFile ? (
              <List>
                <ListItem
                  button
                  onClick={handleViewResume}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      borderRadius: 1,
                    },
                  }}
                >
                  <ListItemIcon>
                    <DescriptionIcon color="primary" />
                  </ListItemIcon>
                  <Box sx={{ 
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <Typography 
                      variant="body1" 
                      noWrap
                      sx={{ 
                        fontWeight: 'medium',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {resumeFile.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {`${(resumeFile.size / 1024).toFixed(1)} KB - Click to preview`}
                    </Typography>
                  </Box>
                  <VisibilityIcon color="action" />
                </ListItem>
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                py={2}
              >
                No resume uploaded
              </Typography>
            )}
          </Paper>

          <Paper
            elevation={2}
            sx={{
              borderRadius: 4,
              p: 2,
              width: { xs: '100%', md: '280px' },
              height: "auto",
              ml: { xs: 0, md: 3 },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                Quick Links
              </Typography>
              <IconButton onClick={handleEditLinksOpen} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
            <List>
              {quickLinks.linkedin && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LinkedInIcon color="primary" />
                  </ListItemIcon>
                  <Link
                    href={quickLinks.linkedin}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {isMobile ? 'LinkedIn' : 'LinkedIn Profile'}
                  </Link>
                </ListItem>
              )}
              {quickLinks.github && (
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <GitHubIcon />
                  </ListItemIcon>
                  <Link
                    href={quickLinks.github}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {isMobile ? 'GitHub' : 'GitHub Profile'}
                  </Link>
                </ListItem>
              )}
              {!quickLinks.linkedin && !quickLinks.github && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  py={2}
                >
                  No quick links added
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            size="small"
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="About Me"
            fullWidth
            multiline
            rows={3}
            size="small"
            value={editData.about}
            onChange={(e) =>
              setEditData({ ...editData, about: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            size="small"
            value={editData.contact}
            onChange={(e) =>
              setEditData({ ...editData, contact: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            size="small"
            value={editData.phone}
            onChange={(e) =>
              setEditData({ ...editData, phone: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editingEducationIndex !== null}
        onClose={() => setEditingEducationIndex(null)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingEducationIndex >= educationList.length ? "Add Education" : "Edit Education"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Degree"
            fullWidth
            size="small"
            value={newEducation.degree}
            onChange={(e) =>
              setNewEducation({ ...newEducation, degree: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Institution"
            fullWidth
            size="small"
            value={newEducation.institution}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                institution: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Year"
            fullWidth
            size="small"
            value={newEducation.year}
            onChange={(e) =>
              setNewEducation({ ...newEducation, year: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            size="small"
            value={newEducation.type}
            onChange={(e) =>
              setNewEducation({ ...newEducation, type: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Score"
            fullWidth
            size="small"
            value={newEducation.score}
            onChange={(e) =>
              setNewEducation({ ...newEducation, score: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingEducationIndex(null)}>Cancel</Button>
          <Button onClick={handleSaveEducation} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editingExpIndex !== null}
        onClose={() => setEditingExpIndex(null)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>
          {activeTab === "EXPERIENCE"
            ? editingExpIndex >= experiences.length
              ? "Add Experience"
              : "Edit Experience"
            : activeTab === "INTERNSHIPS"
            ? editingExpIndex >= internships.length
              ? "Add Internship"
              : "Edit Internship"
            : editingExpIndex >= projects.length
            ? "Add Project"
            : "Edit Project"}
        </DialogTitle>
        <DialogContent>
          {activeTab === "EXPERIENCE" ? (
            <>
              <TextField
                margin="dense"
                label="Role"
                fullWidth
                size="small"
                value={newExperience.role}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, role: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Company"
                fullWidth
                size="small"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, company: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Duration"
                fullWidth
                size="small"
                value={newExperience.duration}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, duration: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                size="small"
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience({ ...newExperience, description: e.target.value })
                }
              />
            </>
          ) : activeTab === "INTERNSHIPS" ? (
            <>
              <TextField
                margin="dense"
                label="Role"
                fullWidth
                size="small"
                value={newInternship.role}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, role: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Company"
                fullWidth
                size="small"
                value={newInternship.company}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, company: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Duration"
                fullWidth
                size="small"
                value={newInternship.duration}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, duration: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                size="small"
                value={newInternship.description}
                onChange={(e) =>
                  setNewInternship({ ...newInternship, description: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <TextField
                margin="dense"
                label="Title"
                fullWidth
                size="small"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Technologies"
                fullWidth
                size="small"
                value={newProject.technologies}
                onChange={(e) =>
                  setNewProject({ ...newProject, technologies: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Duration"
                fullWidth
                size="small"
                value={newProject.duration}
                onChange={(e) =>
                  setNewProject({ ...newProject, duration: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                size="small"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingExpIndex(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (activeTab === "EXPERIENCE") {
                handleSaveExperience();
              } else if (activeTab === "INTERNSHIPS") {
                handleSaveInternship();
              } else {
                handleSaveProject();
              }
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editingCertIndex !== null}
        onClose={() => setEditingCertIndex(null)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingCertIndex >= certificates.length ? "Add Certificate" : "Edit Certificate"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Certificate Name"
            fullWidth
            size="small"
            value={newCertificate.name}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Issuing Organization"
            fullWidth
            size="small"
            value={newCertificate.organization}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, organization: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Issue Date"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={newCertificate.issueDate}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, issueDate: e.target.value })
            }
          />
          <Box mt={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => certificateInputRef.current.click()}
              fullWidth={isMobile}
            >
              {newCertificate.file ? "Change Certificate File" : "Upload Certificate File"}
            </Button>
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              ref={certificateInputRef}
              onChange={handleCertificateUpload}
            />
            {newCertificate.file && (
              <Box display="flex" alignItems="center" mt={1}>
                {newCertificate.file.type === "application/pdf" ? (
                  <PictureAsPdfIcon color="error" />
                ) : (
                  <InsertDriveFileIcon color="primary" />
                )}
                <Typography variant="body2" ml={1}>
                  {newCertificate.file.name}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCertIndex(null)}>Cancel</Button>
          <Button onClick={handleSaveCertificate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={certificateDialogOpen}
        onClose={() => setCertificateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Certificate Preview
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => {
              const cert = certificates[editingCertIndex] || newCertificate;
              handleDownloadCertificate(cert);
            }}
            sx={{ float: "right" }}
          >
            Download
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              py: 4,
            }}
          >
            <InsertDriveFileIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Preview not available for this file type
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Download the file to view it properly
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const cert = certificates[editingCertIndex] || newCertificate;
                handleDownloadCertificate(cert);
              }}
              sx={{ mt: 3 }}
            >
              Download Certificate
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertificateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editSkillIndex !== null}
        onClose={() => setEditSkillIndex(null)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editSkillIndex < skills.length ? "Edit Skill" : "Add Skill"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill"
            fullWidth
            size="small"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                editSkillIndex < skills.length
                  ? handleUpdateSkill()
                  : handleAddSkill();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSkillIndex(null)}>Cancel</Button>
          <Button
            onClick={() => {
              editSkillIndex < skills.length
                ? handleUpdateSkill()
                : handleAddSkill();
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editLinksOpen} onClose={() => setEditLinksOpen(false)} fullScreen={isMobile}>
        <DialogTitle>Edit Quick Links</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="LinkedIn URL"
              fullWidth
              variant="outlined"
              size="small"
              value={editLinksData.linkedin}
              onChange={(e) =>
                setEditLinksData({ ...editLinksData, linkedin: e.target.value })
              }
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <TextField
              margin="dense"
              label="GitHub URL"
              fullWidth
              variant="outlined"
              size="small"
              value={editLinksData.github}
              onChange={(e) =>
                setEditLinksData({ ...editLinksData, github: e.target.value })
              }
              placeholder="https://github.com/yourusername"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditLinksOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveLinks} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={resumeDialogOpen}
        onClose={() => setResumeDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {resumeFile?.name || "Resume Preview"}
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadResume}
            sx={{ float: "right" }}
          >
            Download
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: isMobile ? "calc(100vh - 120px)" : "500px" }}>
            {resumeFile?.type === "application/pdf" ? (
              <iframe
                src={resumeFile.url}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Resume Preview"
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <DescriptionIcon
                  sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Preview not available for this file type
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Download the file to view it properly
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadResume}
                  sx={{ mt: 3 }}
                >
                  Download Resume
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResumeDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          icon={<CheckCircleIcon />}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileManagement;