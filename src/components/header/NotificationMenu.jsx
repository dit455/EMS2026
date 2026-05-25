import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import {
  getPortalNotifications,
  markAllPortalNotificationsRead,
  markPortalNotificationRead,
} from '../../services/notificationService';

function timeAgo(iso) {
  const minutes = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export default function NotificationMenu({ user }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fallbackRead, setFallbackRead] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setNotifications(getPortalNotifications(user?.id, fallbackRead));
  }, [user?.id, fallbackRead]);

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

  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="ems-notification-menu" ref={menuRef}>
      <button
        className="ems-header-icon-button"
        type="button"
        aria-label="View notifications"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen) {
            markAllPortalNotificationsRead(user?.id);
            setFallbackRead(true);
            setNotifications((current) => current.map((item) => ({ ...item, read: true })));
          }
        }}
      >
        <Bell size={19} aria-hidden="true" />
        {unread > 0 && <span className="ems-notification-badge">{unread}</span>}
      </button>

      {open && (
        <div className="ems-dropdown-panel ems-notification-panel" role="menu">
          <div className="ems-dropdown-head">
            <div>
              <strong>Notifications</strong>
              <span>{notifications.length} recent updates</span>
            </div>
            <CheckCircle2 size={18} aria-hidden="true" />
          </div>
          <div className="ems-notification-list">
            {notifications.map((item) => (
              <button
                key={item.id}
                className={`ems-notification-item ${!item.read ? 'is-unread' : ''}`}
                type="button"
                role="menuitem"
                onClick={() => {
                  markPortalNotificationRead(user?.id, item.id);
                  setNotifications((current) => current.map((next) => (
                    next.id === item.id ? { ...next, read: true } : next
                  )));
                }}
              >
                <span className={`ems-notification-dot ems-notification-dot--${item.type || 'info'}`} />
                <span>
                  <strong>{item.message}</strong>
                  <small>{timeAgo(item.createdAt)}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
