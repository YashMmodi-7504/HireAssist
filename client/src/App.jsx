import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toaster";
import { ConfirmProvider } from "./components/ui/ConfirmDialog";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import DashboardLayout from "./layouts/DashboardLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import AssessmentPage from "./pages/student/AssessmentPage";
import AttendancePage from "./pages/student/AttendancePage";
import StudyMaterialPage from "./pages/student/StudyMaterialPage";
import PlacementFormPage from "./pages/student/PlacementFormPage";
import JobsPage from "./pages/student/JobsPage";
import CertificatePage from "./pages/student/CertificatePage";
import AlumniPage from "./pages/student/AlumniPage";
import FeedbackPage from "./pages/student/FeedbackPage";
import TicketPage from "./pages/student/TicketPage";
import AIChat from "./pages/student/AIChat";
import CourseView from "./pages/course/CourseView";
import ModuleViewer from "./pages/course/ModuleViewer";

import TrainerDashboardLayout from "./layouts/TrainerDashboardLayout";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import AllUsersPage from "./pages/trainer/AllUsersPage";
import AddBatchPage from "./pages/trainer/AddBatchPage";
import TrainerAttendancePage from "./pages/trainer/AttendancePage";
import InterviewPage from "./pages/trainer/InterviewPage";
import SdpReportPage from "./pages/trainer/SdpReportPage";
import PlacementReadinessPage from "./pages/trainer/PlacementReadinessPage";
import StudentRegistrationsPage from "./pages/trainer/StudentRegistrationsPage";
import DropoutStudentsPage from "./pages/trainer/DropoutStudentsPage";
import TrainerFeedbackPage from "./pages/trainer/TrainerFeedbackPage";
import ViewBatchPage from "./pages/trainer/ViewBatchPage";
import ModuleTrackerPage from "./pages/trainer/ModuleTrackerPage";
import ApproveCourseAccessPage from "./pages/trainer/ApproveCourseAccessPage";
import CapstoneProjectPage from "./pages/trainer/CapstoneProjectPage";
import CoursePage from "./pages/trainer/CoursePage";
import Courses from "./pages/trainer/Courses";
import ViewCourse from "./pages/trainer/ViewCourse";
import ModuleDetail from "./pages/trainer/ModuleDetail";
import AssessmentManagementPage from "./pages/trainer/AssessmentManagementPage";
import ComingSoonPage from "./pages/trainer/ComingSoonPage";

import DirectorLayout from "./layouts/DirectorLayout";
import DirectorDashboard from "./pages/director/DirectorDashboard";
import AnalyticsOverviewPage from "./pages/director/AnalyticsOverviewPage";
import BatchPerformancePage from "./pages/director/BatchPerformancePage";
import TrainerPerformancePage from "./pages/director/TrainerPerformancePage";
import PlacementAnalyticsPage from "./pages/director/PlacementAnalyticsPage";
import StudentInsightsPage from "./pages/director/StudentInsightsPage";
import ReportsPage from "./pages/director/ReportsPage";
import FeedbackInsightsPage from "./pages/director/FeedbackInsightsPage";

import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagementPage from "./pages/admin/UserManagementPage";
import BatchListPage from "./pages/admin/BatchListPage";
import SettingsPage from "./pages/admin/SettingsPage";
import FeedbackAnalyticsPage from "./pages/admin/FeedbackAnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student Dashboard — student role only */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="material" element={<StudyMaterialPage />} />
          <Route path="placement" element={<PlacementFormPage />} />
          <Route path="jobs" element={<JobsPage />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="alumni" element={<AlumniPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="ticket" element={<TicketPage />} />
          <Route path="ticket/queries" element={<TicketPage />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="ai" element={<AIChat />} />
          <Route path="module/:moduleId" element={<ModuleViewer />} />
        </Route>

        {/* Trainer Console — trainer role */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRole="trainer">
              <TrainerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TrainerDashboard />} />
          <Route path="users" element={<AllUsersPage />} />
          <Route path="users/registrations" element={<StudentRegistrationsPage />} />
          <Route path="users/dropout" element={<DropoutStudentsPage />} />
          <Route path="feedback" element={<TrainerFeedbackPage />} />
          <Route path="batch/add" element={<AddBatchPage />} />
          <Route path="batch/view" element={<ViewBatchPage />} />
          <Route path="module-tracker" element={<ModuleTrackerPage />} />
          <Route path="course-access" element={<ApproveCourseAccessPage />} />
          <Route path="capstone" element={<CapstoneProjectPage />} />
          <Route path="attendance" element={<TrainerAttendancePage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="course" element={<Navigate to="/trainer/courses" replace />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:courseId" element={<ViewCourse />} />
          <Route path="course/:courseId/module/:moduleId" element={<ModuleDetail />} />
          <Route path="assessment" element={<AssessmentManagementPage />} />
          <Route path="sdp" element={<SdpReportPage />} />
          <Route path="placement" element={<PlacementReadinessPage />} />
        </Route>

        {/* Admin Console — admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          {/* User Management — same component, tab derived from URL */}
          <Route path="users" element={<UserManagementPage />} />
          <Route path="users/trainers" element={<UserManagementPage />} />
          <Route path="users/students" element={<UserManagementPage />} />
          <Route path="users/directors" element={<UserManagementPage />} />
          <Route path="users/blocked" element={<UserManagementPage />} />

          {/* Batch Management — admin variants */}
          <Route path="batch/create" element={<AddBatchPage />} />
          <Route path="batch/view" element={<BatchListPage />} />

          {/* Course Management — All Courses reuses the catalog page */}
          <Route path="courses" element={<CoursePage />} />
          <Route
            path="courses/create"
            element={<ComingSoonPage title="Create Course" subtitle="Author a new course with modules" backTo="/admin" />}
          />
          <Route
            path="courses/assign"
            element={<ComingSoonPage title="Assign Course" subtitle="Map courses to batches" backTo="/admin" />}
          />

          {/* Module Management — admin sees the same tracker view */}
          <Route path="modules" element={<ModuleTrackerPage />} />

          {/* Assessment Management */}
          <Route path="assessments" element={<AssessmentManagementPage />} />
          <Route
            path="assessments/create"
            element={<ComingSoonPage title="Create Assessment" subtitle="Question bank + MCQ builder" backTo="/admin" />}
          />
          <Route
            path="assessments/assign"
            element={<ComingSoonPage title="Assign Assessment" subtitle="Schedule tests for batches" backTo="/admin" />}
          />

          {/* Attendance, Capstone, Feedback */}
          <Route path="attendance" element={<TrainerAttendancePage />} />
          <Route path="capstone" element={<CapstoneProjectPage />} />
          <Route path="feedback" element={<FeedbackAnalyticsPage />} />

          {/* Reports */}
          <Route
            path="reports/students"
            element={<ComingSoonPage title="Student Reports" subtitle="Per-student progress and CSV exports" backTo="/admin" />}
          />
          <Route
            path="reports/trainers"
            element={<ComingSoonPage title="Trainer Reports" subtitle="Trainer load and effectiveness" backTo="/admin" />}
          />
          <Route
            path="reports/batches"
            element={<ComingSoonPage title="Batch Reports" subtitle="Batch-level summaries and exports" backTo="/admin" />}
          />

          {/* Placement Analytics — placeholder, dashboard chart in main view */}
          <Route
            path="placement"
            element={<ComingSoonPage title="Placement Analytics" subtitle="Company-wise data and readiness scores" backTo="/admin" />}
          />

          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Director Console — director role only (read-only oversight) */}
        <Route
          path="/director"
          element={
            <ProtectedRoute allowedRole="director">
              <DirectorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DirectorDashboard />} />
          <Route path="analytics" element={<AnalyticsOverviewPage />} />
          <Route path="batches" element={<BatchPerformancePage />} />
          <Route path="trainers" element={<TrainerPerformancePage />} />
          <Route path="placement" element={<PlacementAnalyticsPage />} />
          <Route path="students" element={<StudentInsightsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="feedback" element={<FeedbackInsightsPage />} />
        </Route>

        {/* Standalone Routes */}
        <Route path="/course/:courseId" element={<CourseView />} />

        {/* Fallback */}
        <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>} />
            </Routes>
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
