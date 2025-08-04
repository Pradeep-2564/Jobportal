// JobseekerDashboard.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActionArea,
  Badge,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  SendOutlined as ApplyIcon,
  BookmarkBorder as BookmarkIcon,
  BusinessCenterOutlined as BusinessCenterIcon,
  AssessmentOutlined as AssessmentIcon,
  CancelOutlined,
  Schedule,
  AssessmentOutlined,
} from "@mui/icons-material";

// Extend dayjs with isSameOrAfter plugin
dayjs.extend(isSameOrAfter);

// Components
import ApplicationStatusChart from "./ApplicationStatusChart";
import ActivityFeed from "./ActivityFeed";

// Constants
const LOCAL_STORAGE_KEYS = {
  JOB_POSTS: "job_posts",
  JOB_APPLICANTS: "job_applicants",
  INTERVIEW_HISTORY: "interview_history",
  USER_PROFILE: "user_profile",
};

// --- Reusable Helper Components ---
const DashboardCard = ({ title, icon, children, sx = {} }) => (
  <Card
    sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.07)", ...sx }}
  >
    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
      <Typography
        variant="h6"
        fontWeight={600}
        color="text.primary"
        sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
      >
        {icon}
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const StatCard = ({ title, count, icon, onClick, color }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
    }}
  >
    <CardActionArea onClick={onClick} sx={{ p: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            {count}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "nowrap" }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </CardActionArea>
  </Card>
);

// --- Calendar Component ---
function ServerDay(props) {
  const {
    highlightedDays = [],
    day,
    outsideCurrentMonth,
    onDayClick,
    ...other
  } = props;

  const today = dayjs();
  const dayObj = dayjs(day);

  const isHighlighted =
    !outsideCurrentMonth &&
    highlightedDays.some((d) => d.isSame(dayObj, "day")) &&
    dayObj.isSameOrAfter(today, "day");

  const isWeekend = !outsideCurrentMonth && (dayObj.day() === 0 || dayObj.day() === 6);

  const handleClick = () => {
    if (isHighlighted && onDayClick) {
      onDayClick(dayObj);
    }
  };

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isHighlighted ? "🟠" : undefined}
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "0.5rem",
          height: "6px",
          minWidth: "6px",
          right: 10,
          top: 5,
        },
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        onClick={handleClick}
        sx={{
          cursor: isHighlighted ? "pointer" : "default",
          ...(isWeekend && {
            bgcolor: "action.hover",
          }),
          ...(isHighlighted && {
            "&:hover": {
              backgroundColor: "primary.light",
            },
          }),
        }}
      />
    </Badge>
  );
}

const InterviewCalendar = ({ highlightDays = [], onDayClick }) => {
  return (
    <DateCalendar
      readOnly
      defaultValue={dayjs()}
      slots={{
        day: ServerDay,
      }}
      slotProps={{
        day: {
          highlightedDays: highlightDays,
          onDayClick: onDayClick,
        },
      }}
      sx={{
        width: "100%",
        maxHeight: "320px",
        ".MuiPickersCalendarHeader-label": { fontWeight: "600" },
      }}
    />
  );
};

// --- Export Data Component (Alignment Fixed) ---
const ExportDataCard = ({ onExport, isMobile }) => {
  return (
    <DashboardCard title="Export Data">
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1.5, // Adds a gap between buttons
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => onExport(LOCAL_STORAGE_KEYS.JOB_APPLICANTS, "applications.json")}
          fullWidth
        >
          Applications
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onExport(LOCAL_STORAGE_KEYS.USER_PROFILE, "profile.json")}
          fullWidth
        >
          Profile
        </Button>
      </Box>
    </DashboardCard>
  );
};


// --- Main Dashboard Component ---
const JobseekerDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [stats, setStats] = useState({ allJobs: 0, saved: 0, applied: 0 });
  const [applicantStatuses, setApplicantStatuses] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [interviewData, setInterviewData] = useState([]);

  useEffect(() => {
    const allJobsData =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_POSTS)) || [];
    const allApplicantsData =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.JOB_APPLICANTS)) ||
      [];
    const interviewHistoryData =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INTERVIEW_HISTORY)) ||
      [];

    setStats({
      allJobs: allJobsData.length,
      saved: allJobsData.filter((j) => j.saved).length,
      applied: allJobsData.filter((j) => j.applied).length,
    });

    const statuses = allApplicantsData.reduce((acc, applicant) => {
      if (applicant.status) {
        acc[applicant.status] = (acc[applicant.status] || 0) + 1;
      }
      return acc;
    }, {});
    setApplicantStatuses(statuses);

    setInterviews(interviewHistoryData.map((i) => dayjs(i.date)));
    setInterviewData(interviewHistoryData);
  }, [location.pathname]);

  const handleDayClick = (day) => {
    const interview = interviewData.find((i) =>
      dayjs(i.date).isSame(day, 'day')
    );

    if (interview) {
      navigate(`/dashboard/jobseeker/interviewschedule`);
    }
  };

  // Export data function
  const exportData = (key, filename) => {
    const data = localStorage.getItem(key);
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${filename} successfully!`);
    } else {
      toast.warn(`No data found to export for ${filename}.`);
    }
  };

  const statCardsConfig = [
    {
      title: "All Jobs",
      count: stats.allJobs,
      icon: <BusinessCenterIcon />,
      color: theme.palette.primary.main,
      path: "/dashboard/jobseeker/joblistings",
    },
    {
      title: "Saved Jobs",
      count: stats.saved,
      icon: <BookmarkIcon />,
      color: theme.palette.warning.main,
      path: "/dashboard/jobseeker/joblistings/saved",
    },
    {
      title: "Applied",
      count: stats.applied,
      icon: <ApplyIcon />,
      color: theme.palette.info.main,
      path: "/dashboard/jobseeker/joblistings/applied",
    },
  ];

  const statusCardConfig = {
    "Interview Scheduled": {
      icon: <Schedule />,
      color: theme.palette.text.secondary,
    },
    Rejected: { icon: <CancelOutlined />, color: theme.palette.error.main },
    "On Hold": {
      icon: <AssessmentOutlined />,
      color: theme.palette.text.secondary,
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, minHeight: "100vh" }}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
          }}
        >
          {/* Left Column */}
          <Box
            sx={{
              flex: "1 1 50%",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* Job Statistics Section */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 2 }}
              >
                Job Statistics
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {statCardsConfig.map((card) => (
                  <Box key={card.title} sx={{ flex: "1 1 180px" }}>
                    <StatCard {...card} onClick={() => navigate(card.path)} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Application Status Section */}
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                sx={{ mb: 2 }}
              >
                Application Status
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {Object.entries(applicantStatuses).map(([status, count]) => {
                  const config = statusCardConfig[status];
                  if (!config) return null;
                  return (
                    <Box key={status} sx={{ flex: "1 1 180px" }}>
                      <StatCard
                        title={status}
                        count={count}
                        icon={config.icon}
                        color={config.color}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <ApplicationStatusChart data={applicantStatuses} />
            </Box>
          </Box>
          {/* Right Column */}
          <Box
            sx={{
              flex: "1 1 20%",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <DashboardCard title="Interview Calendar" icon={<Schedule />}>
              <InterviewCalendar
                highlightDays={interviews}
                onDayClick={handleDayClick}
              />
            </DashboardCard>
            <ActivityFeed />
            <ExportDataCard onExport={exportData} isMobile={isMobile} />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default JobseekerDashboard;