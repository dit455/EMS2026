import React from 'react';
import MainHeader from './MainHeader';
import Navbar from './Navbar';
import QuickLinks from './QuickLinks';
import TopBar from './TopBar';

export default function PortalHeader({ user, onLogout, mobileOpen, onOpenMobile, onCloseMobile }) {
  return (
    <header className="ems-portal-header">
      <TopBar user={user} onLogout={onLogout} />
      <MainHeader user={user} onLogout={onLogout} onOpenMenu={onOpenMobile} />
      <Navbar user={user} mobileOpen={mobileOpen} onCloseMobile={onCloseMobile} />
      <QuickLinks user={user} />
    </header>
  );
}
