import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Download,
  Headphones,
  Home,
  Menu,
  Phone,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { APP_ROUTES } from '../../config/appConfig';

const navItems = [
  { label: 'Home', shortLabel: 'Home', target: 'home', Icon: Home },
  { label: 'Registration', shortLabel: 'Register', target: 'register-now', Icon: UserPlus },
  { label: 'Verification', shortLabel: 'Verify', target: 'student-verification-tracker', Icon: ShieldCheck },
  { label: 'Exam Schedule', shortLabel: 'Schedule', target: 'exam-schedule', Icon: CalendarDays },
  { label: 'Downloads', shortLabel: 'Downloads', target: 'downloads', Icon: Download },
  { label: 'Notifications', shortLabel: 'Notices', target: 'notifications', Icon: Bell },
  { label: 'Helpdesk', shortLabel: 'Helpdesk', target: 'helpdesk', Icon: Headphones },
  { label: 'Contact', shortLabel: 'Contact', target: 'contact', Icon: Phone },
];

export default function PublicNavbar({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  const handleNavigate = (target) => {
    if (onNavigate) onNavigate(target);
    else {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        globalThis.location.assign(`${APP_ROUTES.home}#${target}`);
      }
    }
    setActive(target);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-blue-900/10 shadow-[0_10px_28px_rgba(15,23,42,0.08)] select-none" aria-label="Institution primary navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between min-h-14">
        {/* Desktop Menu */}
        <div className="portal-desktop-nav hidden lg:flex items-center justify-center w-full gap-1.5 py-2">
          {navItems.map(({ label, shortLabel, target, Icon }) => {
            const isActive = active === target;
            return (
              <button
                key={label}
                type="button"
                className={`group relative min-h-10 rounded-lg px-2.5 xl:px-3 text-[11px] font-black tracking-wide uppercase flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                  isActive
                    ? 'bg-blue-950 text-white border-blue-950 shadow-md shadow-blue-950/15'
                    : 'text-slate-600 border-transparent hover:text-blue-950 hover:bg-slate-50 hover:border-slate-200'
                }`}
                onClick={() => handleNavigate(target)}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-md ${isActive ? 'bg-white/10' : 'bg-blue-50 text-blue-800 group-hover:bg-white'}`}>
                  <Icon size={13} className={isActive ? 'text-amber-300' : 'text-blue-800'} aria-hidden="true" />
                </span>
                <span className="portal-nav-label-full">{label}</span>
                <span className="portal-nav-label-short">{shortLabel}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-2 left-2 right-2 h-0.5 rounded-full bg-amber-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Navbar Header */}
        <div className="portal-mobile-nav flex lg:hidden items-center justify-between w-full min-h-14">
          <button
            type="button"
            className="flex items-center gap-2 text-blue-950 text-xs font-black uppercase tracking-wider border-none bg-transparent cursor-pointer"
            onClick={() => handleNavigate('home')}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-950 text-amber-300">
              <Home size={15} />
            </span>
            Portal Menu
          </button>
          <button 
            type="button" 
            className="text-blue-950 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-black uppercase tracking-wider border border-blue-900/10 bg-white" 
            aria-expanded={open} 
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
            <span>Menu</span>
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="portal-mobile-drawer lg:hidden bg-white border-t border-blue-900/10 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navItems.map(({ label, target, Icon }) => {
                const isActive = active === target;
                return (
                  <button
                    key={label}
                    type="button"
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
                      isActive 
                        ? 'bg-blue-950 text-white border-blue-950 shadow-sm' 
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-blue-950 hover:bg-blue-50 hover:border-blue-200'
                    }`}
                    onClick={() => handleNavigate(target)}
                  >
                    <Icon size={14} className={isActive ? 'text-amber-300' : 'text-blue-800'} aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
