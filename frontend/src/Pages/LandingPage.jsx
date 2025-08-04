import { Routes, Route } from "react-router-dom";
import UserType from "./UserType";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgottenpassword";
import EmployerLayout from "../Dashboard/Employer/EmployerLayout";
import EmployerDashboard from "../Dashboard/Employer/EmployerDashboard";
import JobPosting from "../Dashboard/Employer/JobPosting";
// import JobApplicants from "../Dashboard/Employer/JobLists";
 
import JobApplicants from "../Dashboard/Employer/JobApplicants";
// import ApplicantDetails from "../Dashboard/Employer/ApplicantsDetails";
import Interviews from "../Dashboard/Employer/Interviews";
import AdminDashboard from "../Dashboard/Admin/AdminDashboard";
import AdminLayout from "../Dashboard/Admin/AdminLayout";
import JobseekerDashboard from "../Dashboard/Jobseeker/JobseekerDashboard";
import JobseekerLayout from "../Dashboard/Jobseeker/JobseekerLayout";
import Reports from "../Dashboard/Employer/Reports";
import JobLists from "../Dashboard/Employer/JobLists";
import EmployerSettings from "../Dashboard/Employer/Employersettings";
import { Help, Message, Settings } from "@mui/icons-material";
import InterviewSchedule from "../Dashboard/Jobseeker/InterviewSchedule";
import Joblistings from "../Dashboard/Jobseeker/Joblistings";
import JobDetails from "../Dashboard/Jobseeker/JobDetails";
import ProfileManagement from "../Dashboard/Jobseeker/ProfileManagement";
import Messages from "../Dashboard/Jobseeker/Messages";
import HelpSupport from "../Dashboard/Jobseeker/Help";
import JobseekerSettings from "../Dashboard/Jobseeker/Settings";
import AllActivityPage from "../Dashboard/Jobseeker/AllActivityPage";

// import EmployerDashboard from "../Dashboard/Employer/EmployerDashboard";
// import JobPosting from "../Dashboard/Employer/JobPosting";
// import JobApplications from "../Dashboard/Employer/JobApplications";
// import Interviews from "../Dashboard/Employer/Interviews";
// import EmployerLayout from "../Dashboard/Employer/EmployerLayout";
 
// import JobseekerDashboard from "../Dashboard/JobseekerDashboard";
// import RecruiterDashboard from "../Dashboard/RecruiterDashboard ";
// import AdminDashboard from "../Dashboard/AdminDashboard ";
 
function LandingPage() {
  return (
    <Routes>
      <Route path="/login" element={<UserType />} />
 
      <Route path="register/:role" element={<Signup />} />
      <Route path="login/:role" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
 
      {/* <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} /> */}
 
 <Route path="/dashboard/jobseeker" element={<JobseekerLayout />}>
  <Route index element={<JobseekerDashboard />} />
  <Route path="profilemanagement" element={<ProfileManagement />} />
  <Route path="joblistings" element={<Joblistings />} />
  <Route path="joblistings/saved" element={<Joblistings />} />
  <Route path="joblistings/applied" element={<Joblistings />} />
   <Route path="joblistings/:jobId" element={<JobDetails />} />
  <Route path="interviewschedule" element={<InterviewSchedule />} />
  <Route path="jobnotifications" element={<Messages />} />
  <Route path="helpsupport" element={<HelpSupport />} />
  <Route path="JobseekerSettings" element={<JobseekerSettings/>} />
  <Route path="activity" element={<AllActivityPage />} />
</Route>
 

   {/* Recruiter/Employer */}
<Route path="/dashboard/recruiter" element={<EmployerLayout />}>
  <Route index element={<EmployerDashboard />} />
  <Route path="job-posting" element={<JobPosting />} />
  <Route path="job-lists" element={<JobLists />} />
  <Route path="job-applicants" element={<JobApplicants />} />
  {/* <Route path="job-applicants/:applicantId" element={<ApplicantDetails />} /> */}
  <Route path="interviews" element={<Interviews />} />
  <Route path="reports" element={<Reports />} />
  <Route path="settings" element={<EmployerSettings />} />
</Route>
 
 
<Route path="/dashboard/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  {/* <Route path="job-posting" element={<JobPosting />} />
  <Route path="job-applications" element={<JobApplications />} />
  <Route path="interviews" element={<Interviews />} /> */}
</Route>
 
 
 
      {/* <Route path="/dashboard/admin" element={<AdminDashboard />} /> */}
    </Routes>
  );
}
 
export default LandingPage;
 