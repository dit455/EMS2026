import React from 'react';
import { NavLink } from 'react-router-dom';
import { Award, CalendarDays, CircleHelp, Download, FileBarChart, GraduationCap, ShieldCheck } from 'lucide-react';

const quickLinks = [
  { label: 'Student Registration', path: '/student-module', icon: GraduationCap },
  { label: 'Exam Schedule', path: '/examination', icon: CalendarDays },
  { label: 'Marks Entry', path: '/marks', icon: Award },
  { label: 'Reports', path: '/mis', icon: FileBarChart },
  { label: 'DigiLocker', path: '/marks', icon: ShieldCheck },
  { label: 'Downloads', path: '/downloads', icon: Download },
  { label: 'Helpdesk', path: '/helpdesk', icon: CircleHelp },
];

const publicLabels = ['Student Registration', 'Downloads', 'Helpdesk'];

export default function QuickLinks({ user }) {
  const visibleLinks = user?.role && user.role !== 'Student'
    ? quickLinks
    : quickLinks.filter((item) => publicLabels.includes(item.label));

  return (
    <div className="ems-quick-links" aria-label="Quick access">
      {visibleLinks.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.label} to={item.path}>
            <Icon size={15} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
}
