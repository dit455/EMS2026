import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { institution } from '../../data/portalData';
import NotificationMenu from './NotificationMenu';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

export default function MainHeader({ user, onLogout, onOpenMenu }) {
  return (
    <div className="ems-main-header">
      <button
        className="ems-mobile-menu-button"
        type="button"
        aria-label="Open portal navigation"
        onClick={onOpenMenu}
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <div className="ems-brand-lockup">
        <div className="ems-brand-emblems" aria-hidden="true">
          <div className="ems-emblem-wrap">
            <img src="/images/govt_puducherry.png" alt="Government of Puducherry emblem" />
          </div>
          <div className="ems-emblem-wrap">
            <img src="/images/institute_seal.png" alt="Institute seal" />
          </div>
        </div>
        <div className="ems-brand-copy">
          <span><ShieldCheck size={14} aria-hidden="true" /> Government of Puducherry Institution</span>
          <h1>
            {institution.nameLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </div>
      </div>

      <div className="ems-main-actions">
        <SearchBar />
        <NotificationMenu user={user} />
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  );
}
