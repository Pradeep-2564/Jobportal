import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  House,
  User,
  Briefcase,
  CalendarCheck,
  Bell,
  Question,
  BookmarkSimple,
  PaperPlaneRight,
  List as ListIcon,
} from "phosphor-react";
import { TbLogout } from "react-icons/tb";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../assets/logo.png";
import logowhite from "../../assets/logoWhite.png";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  useTheme,
  styled,
  alpha, // Import alpha for transparent colors
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const CustomBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

// --- Updated Reusable Sidebar Item Components ---

const SidebarItem = ({ label, icon, active, onClick }) => {
  const theme = useTheme();
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        mx: 1,
        my: 0.5,
        borderRadius: 2,
        transition: "all 200ms ease-in-out",
        color: theme.palette.text.secondary,
        ...(active && {
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
          color: theme.palette.primary.main,
        }),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
        },
        "& .MuiListItemIcon-root": {
          color: "inherit",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontWeight: 500,
          fontSize: "0.9rem",
          sx: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
    </ListItemButton>
  );
};

const SidebarSubItem = ({ label, icon, active, onClick }) => {
  const theme = useTheme();
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        mx: 2,
        my: 0.4,
        pl: 4,
        borderRadius: 2,
        transition: "all 200ms ease-in-out",
        color: theme.palette.text.secondary,
        ...(active && {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        }),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
        },
        "& .MuiListItemIcon-root": {
          color: "inherit",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontSize: "0.85rem",
          fontWeight: 500,
          sx: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
    </ListItemButton>
  );
};

const Sidebar = ({ mobileOpen, handleDrawerToggle, isMobile }) => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [openJobs, setOpenJobs] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) handleDrawerToggle();
  };

  const drawerContent = (
    <>
      <Box px={3} py={0.8} textAlign="center">
        <img
          src={theme.palette.mode === "dark" ? logowhite : logo}
          alt="CareerQuest Logo"
          style={{ height: 45 }}
        />
      </Box>
      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#2c3e50" : "#f0f2f5",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#7f8c8d" : "#bdbdbd",
            borderRadius: "10px",
            border: `2px solid ${
              theme.palette.mode === "dark" ? "#2c3e50" : "#f0f2f5"
            }`,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#95a5a6" : "#9e9e9e",
          },
        }}
      >
        <List>
          <SidebarItem
            label="Dashboard"
            icon={<House size={22} weight="duotone" color="#6C63FF" />}
            active={location.pathname === "/dashboard/jobseeker"}
            onClick={() => handleNavigation("/dashboard/jobseeker")}
          />

          <SidebarItem
            label="Profile Management"
            icon={<User size={22} weight="duotone" color="#EB5757" />}
            active={isActive("/dashboard/jobseeker/profilemanagement")}
            onClick={() =>
              handleNavigation("/dashboard/jobseeker/profilemanagement")
            }
          />

          <ListItemButton
            onClick={() => setOpenJobs(!openJobs)}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              transition: "all 200ms ease-in-out",
              color: theme.palette.text.secondary,
              ...(isActive("/dashboard/jobseeker/joblistings") && {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
              }),
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <Briefcase size={22} weight="duotone" color="#2D9CDB" />
            </ListItemIcon>
            <ListItemText
              primary="Job Listings"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
            />
            {openJobs ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openJobs} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <SidebarSubItem
                label="All Jobs"
                icon={<ListIcon size={20} color="#6C63FF" />}
                active={
                  location.pathname === "/dashboard/jobseeker/joblistings"
                }
                onClick={() =>
                  handleNavigation("/dashboard/jobseeker/joblistings")
                }
              />
              <SidebarSubItem
                label="Saved Jobs"
                icon={<BookmarkSimple size={20} color="#F2C94C" />}
                active={
                  location.pathname === "/dashboard/jobseeker/joblistings/saved"
                }
                onClick={() =>
                  handleNavigation("/dashboard/jobseeker/joblistings/saved")
                }
              />
              <SidebarSubItem
                label="Applied Jobs"
                icon={<PaperPlaneRight size={20} color="#27AE60" />}
                active={
                  location.pathname ===
                  "/dashboard/jobseeker/joblistings/applied"
                }
                onClick={() =>
                  handleNavigation("/dashboard/jobseeker/joblistings/applied")
                }
              />
            </List>
          </Collapse>

          <SidebarItem
            label="Interview Schedule"
            icon={<CalendarCheck size={22} weight="duotone" color="#FFBB28" />}
            active={isActive("/dashboard/jobseeker/interviewschedule")}
            onClick={() =>
              handleNavigation("/dashboard/jobseeker/interviewschedule")
            }
          />

          <SidebarItem
            label="Notifications"
            icon={<Bell size={22} weight="duotone" color="#9B51E0" />}
            active={isActive("/dashboard/jobseeker/jobnotifications")}
            onClick={() =>
              handleNavigation("/dashboard/jobseeker/jobnotifications")
            }
          />

          <SidebarItem
            label="Help & Support"
            icon={<Question size={22} weight="duotone" color="#FF6B6B" />}
            active={isActive("/dashboard/jobseeker/helpsupport")}
            onClick={() => handleNavigation("/dashboard/jobseeker/helpsupport")}
          />

          <SidebarItem
            label="Settings"
            icon={
              <i
                className="fa-solid fa-gear fa-spin"
                style={{ color: "#27AE60", fontSize: 22 }}
              ></i>
            }
            active={isActive("/dashboard/jobseeker/JobseekerSettings")}
            onClick={() =>
              handleNavigation("/dashboard/jobseeker/JobseekerSettings")
            }
          />
        </List>
      </Box>

      <Box margin={0.6}>
        <ListItemButton
          onClick={() => navigate("/")}
          sx={{
            mx: 2,
            borderRadius: 8,
            py: 1,
            color: theme.palette.error.main,
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.2),
            },
            transition: "background-color 0.3s ease",
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 35 }}>
            <TbLogout size={22} weight="duotone" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
          />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 260,
              boxSizing: "border-box",
              boxShadow: theme.shadows[8],
              backgroundColor:
                theme.palette.mode === "dark" ? "#282a2c" : "#FFFFFF",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 230,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 230,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
              backgroundColor:
                theme.palette.mode === "dark" ? "#282a2c" : "#FFFFFF",
              justifyContent: "space-between",
              borderRight: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
