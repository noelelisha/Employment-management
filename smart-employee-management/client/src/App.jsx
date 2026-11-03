import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

// Management & Onboarding
import DepartmentsPage from "./pages/DepartmentsPage";
import EmployeeDirectoryPage from "./pages/EmployeeDirectoryPage";
import CompanyOnboardingPage from "./pages/CompanyOnboardingPage";
import PendingReviewsPage from "./pages/PendingReviewsPage";

// Learning & Confidence Features
import ConfidenceJourneyPage from "./pages/ConfidenceJourneyPage";
import DepartmentTasksPage from "./pages/DepartmentTasksPage";
import LearningCenterPage from "./pages/LearningCenterPage";
import ConfidenceJournalPage from "./pages/ConfidenceJournalPage";
import BadgesPage from "./pages/BadgesPage";

// Work & Communication
import ProjectsPage from "./pages/ProjectsPage";
import CommunicationPage from "./pages/CommunicationPage";

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "hr") return <Navigate to="/hr" replace />;
  if (user.role === "manager") return <Navigate to="/manager" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<RoleRedirect />} />

            {/* Role Dashboards */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/departments" element={<DepartmentsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin", "hr"]} />}>
              <Route path="/admin/employees" element={<EmployeeDirectoryPage />} />
              <Route path="/hr" element={<HRDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
              <Route path="/manager" element={<ManagerDashboard />} />
              <Route path="/manager/reviews" element={<PendingReviewsPage />} />
            </Route>

            {/* Employee Dashboard */}
            <Route path="/dashboard" element={<EmployeeDashboard />} />

            {/* Common Learning & Growth Routes accessible to all authenticated roles */}
            <Route path="/journey" element={<ConfidenceJourneyPage />} />
            <Route path="/department-tasks" element={<DepartmentTasksPage />} />
            <Route path="/courses" element={<LearningCenterPage />} />
            <Route path="/journal" element={<ConfidenceJournalPage />} />
            <Route path="/achievements" element={<BadgesPage />} />

            {/* Projects & Collaboration */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/communication" element={<CommunicationPage />} />
            <Route path="/onboarding" element={<CompanyOnboardingPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
