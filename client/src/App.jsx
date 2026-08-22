import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobDetails";


import NotFound from "./pages/NotFound";

import Unauthorized from "./pages/Unauthorized";


import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RoleRoute from "./components/Auth/RoleRoute";



import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard"

import RecruiterProfile from "./pages/Recruiter/RecruiterProfile";

import RecruiterApplications from "./pages/Recruiter/Applications";

import RecruiterApplicationDetails from "./pages/Recruiter/ApplicationDetails";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";

import ROLES from "./constants/roles";

import CreateJob from "./pages/Recruiter/CreateJob";

import EditJob from "./pages/Recruiter/EditJob";

import StudentDashboard from "./pages/student/StudentDashboard";

import MyApplications from "./pages/Student/MyApplications";

import ApplicationDetails from "./pages/Student/ApplicationDetails";

import StudentProfile from "./pages/Student/StudentProfile";


function App() {
  return (
  
    
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Home />}
          />

          {/* Jobs */}
          <Route
            path="/jobs"
            element={<Jobs />}
          />

          {/* Single Job */}
          <Route
            path="/jobs/:id"
            element={<JobDetails />}
          />

        </Route>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          {/* Student */}
          <Route
            element={
              <RoleRoute
                allowedRoles={[ROLES.STUDENT]}
              />
            }
          >
            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/profile"
              element={<StudentProfile />}
            />

            <Route
              path="/student/applications"
              element={<MyApplications />}
            />

            <Route
              path="/student/applications/:applicationId"
              element={<ApplicationDetails />}
            />
          </Route>

          {/* Recruiter */}

           <Route
            element={
              <RoleRoute
                allowedRoles={[ROLES.RECRUITER]}
              />
            }
          >

            <Route
              path="/recruiter/dashboard"
              element={
                <RecruiterDashboard />
              }
            />

            <Route
              path="/recruiter/profile"
              element={<RecruiterProfile />}
            />

            <Route
              path="/recruiter/jobs/create"
              element={
                <CreateJob />
              }
            />

            <Route
              path="/recruiter/jobs/:id/edit"
              element={
                <EditJob />
              }
            />

            <Route
                path="/recruiter/applications"
                element={<RecruiterApplications />}
            />

              <Route
                path="/recruiter/applications/:applicationId"
                element={<RecruiterApplicationDetails />}
            />

          </Route>

          {/* Admin */}
          <Route element={
            <RoleRoute
              allowedRoles={[ROLES.ADMIN]}
            />
          }>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>

        </Route>

        {/* ------------------------------------------------
            Unauthorized
        ------------------------------------------------ */}

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
