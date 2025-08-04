import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';

const UserType = () => {
  const theme = useTheme(); // Get the current theme
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const userTypes = [
    {
      label: "Jobseeker",
      icon: <PersonIcon sx={{ fontSize: 50 }} />,
      value: "jobseeker",
    },
    {
      label: "Recruiter",
      icon: <BusinessCenterIcon sx={{ fontSize: 50 }} />,
      value: "recruiter",
    },
    // {
    //   label: "Admin",
    //   icon: <AdminPanelSettingsIcon sx={{ fontSize: 50 }} />,
    //   value: "admin",
    // },
  ];

  const handleRoleSelect = (role) => {
    setSelected(role);
    navigate(`/login/${role}`);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default, // Use theme background color
        minHeight: "100vh",
        py: 10,
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h5" gutterBottom fontWeight="bold" color={theme.palette.text.primary} sx={{cursor: 'default'}}>
          SELECT USER TYPE
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            bgcolor: "#FB9E3A",
            mx: "auto",
            borderRadius: 2,
            mb: 4,
          }}
        />

        <Grid container spacing={4} justifyContent="center">
          {userTypes.map((type) => (
            <Grid item xs={12} sm={4} key={type.value}>
              <Card
                onClick={() => handleRoleSelect(type.value)}
                sx={{
                  py: 5,
                  borderRadius: 4,
                  cursor: "pointer",
                  textAlign: "center",
                  minHeight: 120,
                  minWidth: 140,
                  transition: "all 0.3s ease",
                  bgcolor:
                    selected === type.value ? "#FFD586" : theme.palette.background.paper, // Use theme background color
                  transform:
                    selected === type.value ? "scale(1.03)" : "scale(1)",
                  boxShadow:
                    selected === type.value
                      ? "0 8px 20px rgba(106, 27, 154, 0.4)"
                      : 1,
                  "&:hover": {
                    bgcolor: "#FB9E3A",
                    color:'black',
                    transform: "scale(1.05)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent>
                  <Box mb={2}>{type.icon}</Box>
                  <Typography variant="h6" color={theme.palette.text.black}>{type.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={6} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 5 }}
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UserType;
