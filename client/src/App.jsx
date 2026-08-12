import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";

import Unauthorized from "./pages/Unauthorized";


import ProtectedRoute from "./components/Auth/ProtectedRoute";
import RoleRoute from "./components/Auth/RoleRoute";

import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import RecruiterDashboard from "./pages/Dashboard/RecruiterDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

import ROLES from "./constants/roles";

// import Dashboard from "./pages/Dashboard/Dashboard";


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

        {/* <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route> */}

        <Route element={<ProtectedRoute />}>

          {/* Student */}
          <Route element={
            <RoleRoute
              allowedRoles={[ROLES.STUDENT]}
            />
          }>
            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />
          </Route>

          {/* Recruiter */}
          <Route element={
            <RoleRoute
              allowedRoles={[ROLES.RECRUITER]}
            />
          }>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
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
