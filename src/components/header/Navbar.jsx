import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Database,
  Download,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  Megaphone,
  Phone,
  Settings,
  X,
} from 'lucide-react';
import { navByRole } from '../../data/referenceData';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    menu: ['Executive summary', 'Pending work queue', 'Board-wise statistics'],
  },
  {
    id: 'student',
    label: 'Student Module',
    path: '/student-module',
    icon: GraduationCap,
    menu: ['Registration', 'Education details', 'Document verification', 'Registration number'],
  },
  {
    id: 'examination',
    label: 'Examination Module',
    path: '/examination',
    icon: ClipboardList,
    menu: ['Subject mapping', 'Exam schedule', 'Attendance upload', 'Correction audit'],
  },
  {
    id: 'marks',
    label: 'Marks Module',
    path: '/marks',
    icon: Award,
    menu: ['Marks entry', 'Approval workflow', 'Marksheet generation', 'DigiLocker publishing'],
  },
  {
    id: 'admin',
    label: 'Admin',
    path: '/admin-module',
    icon: Settings,
    menu: ['User roles', 'OTP access', 'Hierarchy mapping', 'Feature configuration'],
  },
  {
    id: 'mis',
    label: 'MIS Reports',
    path: '/mis',
    icon: BarChart3,
    menu: ['Student reports', 'Examination reports', 'Marks reports', 'Official downloads'],
  },
  {
    id: 'migration',
    label: 'Data Migration',
    path: '/migration',
    icon: Database,
    menu: ['Metadata import', 'Legacy cleanup', 'Validation audit', 'Migration dashboard'],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    path: '/downloads',
    icon: Download,
    utility: true,
    menu: ['Student template', 'Education template', 'User manual'],
  },
  {
    id: 'helpdesk',
    label: 'Helpdesk',
    path: '/helpdesk',
    icon: Megaphone,
    utility: true,
    menu: ['Technical support', 'Login assistance', 'Workflow help'],
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: Phone,
    utility: true,
    menu: ['Helpdesk', 'Directorate contact', 'Technical support'],
  },
];

function NavItem({ item, mobile = false, onNavigate }) {
  const Icon = item.icon;
  const location = useLocation();
  const navigate = useNavigate();
  const active = !item.utility && item.path !== '/' && location.pathname === item.path;

  const openItemPath = () => {
    navigate(item.path);
    onNavigate?.();
  };

  return (
    <div className={`ems-nav-item ${active ? 'is-active' : ''}`}>
      <NavLink
        to={item.path}
        className={({ isActive }) => (isActive && item.path !== '/' && !item.utility ? 'is-active' : undefined)}
        onClick={onNavigate}
      >
        <Icon size={16} aria-hidden="true" />
        <span>{item.label}</span>
        {item.menu && <ChevronDown className="ems-nav-chevron" size={14} aria-hidden="true" />}
      </NavLink>

      {item.menu && !mobile && (
        <div className="ems-mega-menu" role="menu" aria-label={`${item.label} submenu`}>
          <div className="ems-mega-title">
            <span><Icon size={18} aria-hidden="true" /></span>
            <div>
              <strong>{item.label}</strong>
              <small>Official MTPG &amp; RIHS workflows</small>
            </div>
          </div>
          <div className="ems-mega-grid">
            {item.menu.map((entry) => (
              <button key={entry} type="button" role="menuitem" onClick={openItemPath}>
                <ClipboardCheck size={15} aria-hidden="true" />
                <span>{entry}</span>
              </button>
            ))}
          </div>
          <div className="ems-mega-footer">
            <FileText size={15} aria-hidden="true" />
            <span>Official module actions are secured by role-based access.</span>
          </div>
        </div>
      )}

      {item.menu && mobile && (
        <div className="ems-mobile-submenu">
          {item.menu.map((entry) => (
            <button key={entry} type="button" onClick={openItemPath}>{entry}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ user, mobileOpen, onCloseMobile }) {
  const allowedIds = navByRole[user?.role || 'Public'] || navByRole.Public;
  const visibleItems = navItems.filter((item) => allowedIds.includes(item.id));

  return (
    <>
      <nav className="ems-primary-nav" aria-label="EMS primary navigation">
        {visibleItems.map((item) => <NavItem key={item.label} item={item} />)}
      </nav>

      {mobileOpen && (
        <div className="ems-mobile-nav-shell" role="dialog" aria-modal="true" aria-label="EMS mobile navigation">
          <button className="ems-mobile-nav-backdrop" type="button" aria-label="Close navigation" onClick={onCloseMobile} />
          <div className="ems-mobile-nav">
          <div className="ems-mobile-nav-head">
            <div>
                <strong>MTPG &amp; RIHS Portal</strong>
                <span>Government of Puducherry Institution</span>
            </div>
              <button type="button" aria-label="Close navigation" onClick={onCloseMobile}><X size={20} /></button>
            </div>
            <div className="ems-mobile-nav-list">
              {visibleItems.map((item) => (
                <NavItem key={item.label} item={item} mobile onNavigate={onCloseMobile} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
