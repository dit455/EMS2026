import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useToast } from '../Toast';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const handlePointer = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="ems-user-menu" ref={menuRef}>
      <button
        className="ems-user-menu-button"
        type="button"
        aria-label="Open user profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="ems-user-avatar" aria-hidden="true">{user.avatar || 'U'}</span>
        <span className="ems-user-menu-text">
          <strong>{user.name || 'EMS User'}</strong>
          <small>{user.role || 'Portal User'}</small>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open && (
        <div className="ems-dropdown-panel ems-user-panel-dropdown" role="menu">
          <div className="ems-dropdown-head">
            <div>
              <strong>{user.name || 'EMS User'}</strong>
              <span>{user.email || user.role || 'Government portal session'}</span>
            </div>
          </div>
          <button type="button" role="menuitem" onClick={() => showToast('Profile details are available in this portal preview.', 'info')}>
            <UserCircle size={16} /> Profile
          </button>
          <button type="button" role="menuitem" onClick={() => showToast('Settings are pending full profile-service integration.', 'info')}>
            <Settings size={16} /> Settings
          </button>
          <button className="ems-menu-danger" type="button" role="menuitem" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
