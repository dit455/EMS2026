import React from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PublicFooter from '../components/home/PublicFooter';
import PublicHeader from '../components/home/PublicHeader';
import PublicNavbar from '../components/home/PublicNavbar';
import PublicTopBar from '../components/home/PublicTopBar';
import Home from '../pages/Home';
import LoginPage from '../pages/auth/LoginPage';
import Dashboard from '../pages/dashboard/Dashboard';
import StudentModule from '../pages/student/StudentModule';
import ExaminationModule from '../pages/examination/ExaminationModule';
import MarksModule from '../pages/marks/MarksModule';
import AdminModule from '../pages/admin/AdminModule';
import MisModule from '../pages/mis/MisModule';
import MigrationModule from '../pages/migration/MigrationModule';
import DownloadsPage from '../pages/utility/DownloadsPage';
import HelpdeskPage from '../pages/utility/HelpdeskPage';
import ContactPage from '../pages/utility/ContactPage';
import { APP_ROUTES } from '../config/appConfig';

function ProtectedLayout({ user, onLogout }) {
  if (!user) return <Navigate to={APP_ROUTES.home} replace />;
  if (user.role === 'Student') return <Navigate to={APP_ROUTES.student} replace />;
  return <AppLayout user={user} onLogout={onLogout} />;
}

function PublicStudentPage() {
  const navigate = useNavigate();

  return (
    <div className="mtpg-home">
      <PublicTopBar onAdminLogin={() => navigate(APP_ROUTES.adminLogin)} />
      <PublicHeader />
      <PublicNavbar />
      <main className="mtpg-public-student-page">
        <StudentModule />
      </main>
      <PublicFooter />
    </div>
  );
}

export default function AppRoutes({ user, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<Home onLogin={onLogin} />} />
      <Route path="/login" element={<Navigate to={APP_ROUTES.adminLogin} replace />} />
      <Route
        path={APP_ROUTES.studentLogin}
        element={user?.role === 'Student' ? <Navigate to={APP_ROUTES.student} replace /> : <LoginPage mode="student" onLogin={onLogin} />}
      />
      <Route
        path={APP_ROUTES.adminLogin}
        element={user && user.role !== 'Student' ? <Navigate to={APP_ROUTES.dashboard} replace /> : <LoginPage mode="admin" onLogin={onLogin} />}
      />
      <Route path={`${APP_ROUTES.student}/*`} element={<PublicStudentPage />} />
      <Route element={<ProtectedLayout user={user} onLogout={onLogout} />}>
        <Route path={APP_ROUTES.dashboard} element={<Dashboard />} />
        <Route path={APP_ROUTES.studentModule} element={<StudentModule />} />
        <Route path={APP_ROUTES.examination} element={<ExaminationModule />} />
        <Route path={APP_ROUTES.marks} element={<MarksModule />} />
        <Route path="/admin/*" element={<AdminModule />} />
        <Route path={APP_ROUTES.adminModule} element={<AdminModule />} />
        <Route path={APP_ROUTES.mis} element={<MisModule />} />
        <Route path={APP_ROUTES.migration} element={<MigrationModule />} />
        <Route path={APP_ROUTES.downloads} element={<DownloadsPage />} />
        <Route path={APP_ROUTES.helpdesk} element={<HelpdeskPage />} />
        <Route path={APP_ROUTES.contact} element={<ContactPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? APP_ROUTES.dashboard : APP_ROUTES.home} replace />} />
    </Routes>
  );
}
