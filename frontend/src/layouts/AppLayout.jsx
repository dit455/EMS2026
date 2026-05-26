import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PortalHeader from '../components/header/PortalHeader';
import { Breadcrumbs } from '../components/ui';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'barChart', path: '/dashboard' },
  { id: 'student', label: 'Student Module', icon: 'graduation', path: '/student-module' },
  { id: 'examination', label: 'Examination Module', icon: 'clipboard', path: '/examination' },
  { id: 'marks', label: 'Marks Module', icon: 'award', path: '/marks' },
  { id: 'admin', label: 'Admin Module', icon: 'settings', path: '/admin-module' },
  { id: 'mis', label: 'MIS Module', icon: 'barChart', path: '/mis' },
  { id: 'migration', label: 'Data Migration', icon: 'layers', path: '/migration' },
  { id: 'downloads', label: 'Downloads', icon: 'download', path: '/downloads' },
  { id: 'helpdesk', label: 'Helpdesk', icon: 'message', path: '/helpdesk' },
  { id: 'contact', label: 'Contact', icon: 'phone', path: '/contact' },
];

function getCrumbs(pathname) {
  const found = navItems.find((item) => item.path === pathname);
  return [found?.label || 'Dashboard'];
}

export default function AppLayout({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="ems-app-shell">
      <PortalHeader
        user={user}
        onLogout={onLogout}
        mobileOpen={mobileOpen}
        onOpenMobile={() => setMobileOpen(true)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <main className="ems-page">
        <Breadcrumbs items={getCrumbs(location.pathname)} />
        <Outlet />
      </main>
    </div>
  );
}
