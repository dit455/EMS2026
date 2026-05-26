import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accessibility, CircleHelp, Languages, LogIn, LogOut, Phone, Type } from 'lucide-react';
import { useToast } from '../Toast';
import { institution } from '../../data/portalData';

function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export default function TopBar({ user, onLogout }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [now, setNow] = useState(() => new Date());
  const [fontScale, setFontScale] = useState(100);
  const [accessible, setAccessible] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('mtpg-accessible-mode')
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * (fontScale / 100)}px`;
  }, [fontScale]);

  const toggleAccessibility = () => {
    const nextAccessible = !accessible;
    document.body.classList.toggle('mtpg-accessible-mode', nextAccessible);
    setAccessible(nextAccessible);
    showToast(
      nextAccessible ? 'Accessibility mode enabled.' : 'Accessibility mode disabled.',
      'info',
    );
  };

  const openPublicSection = (sectionId) => {
    navigate(`/${sectionId}`);
  };

  const handleAdminAccess = () => {
    if (user) {
      onLogout?.();
      navigate('/', { replace: true });
      showToast('Signed out of admin portal.', 'success');
      return;
    }
    navigate('/admin-login');
  };

  return (
    <div className="ems-top-utility" aria-label="Government utility bar">
      <div className="ems-top-identity">
        <span>Government of Puducherry</span>
        <strong>{institution.shortName}</strong>
      </div>
      <div className="ems-top-actions">
        <span className="ems-top-time" aria-live="polite">{formatDateTime(now)}</span>
        <button type="button" aria-label="Accessibility options" aria-pressed={accessible} onClick={toggleAccessibility}><Accessibility size={14} /> Accessibility</button>
        <div className="ems-font-tools" aria-label="Font size controls">
          <Type size={14} aria-hidden="true" />
          <button type="button" aria-label="Decrease font size" onClick={() => setFontScale((value) => Math.max(90, value - 5))}>A-</button>
          <button type="button" aria-label="Increase font size" onClick={() => setFontScale((value) => Math.min(115, value + 5))}>A+</button>
        </div>
        <button type="button" aria-label="Language switch placeholder" onClick={() => showToast('English is active for this portal preview.', 'info')}>
          <Languages size={14} /> English
        </button>
        <button type="button" onClick={() => openPublicSection('helpdesk')}><CircleHelp size={14} /> Help</button>
        <button type="button" onClick={() => openPublicSection('contact')}><Phone size={14} /> Contact</button>
        <button type="button" className="ems-top-login" onClick={handleAdminAccess}>
          {user ? <LogOut size={14} /> : <LogIn size={14} />}
          {user ? 'Logout' : 'Admin Login'}
        </button>
      </div>
    </div>
  );
}
