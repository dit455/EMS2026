import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardList,
  Download,
  Eye,
  FileText,
  FilePlus,
  GraduationCap,
  Home,
  Info,
  Link,
  LogOut,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Table,
  Trash2,
  Upload,
  User,
  Users,
  X,
  ArrowLeft,
  MessageCircle,
  Send,
  Bot,
  CalendarDays,
  ToggleLeft,
  ToggleRight,
  Activity,
  AlertTriangle,
  TrendingUp,
  Filter,
  MoreVertical,
  Edit,
  Lock,
  Unlock,
  ChevronUp,
  RefreshCw,
  UserCheck,
  UserX,
  Key,
  Layers,
  GitBranch,
  Flag,
  BarChart2,
  FileCheck,
  AlertCircle,
  CheckSquare,
  XSquare,
  Zap
} from 'lucide-react';

const iconMap = {
  arrowLeft: ArrowLeft,
  award: Award,
  bell: Bell,
  book: BookOpen,
  building: Building2,
  check: Check,
  checkCircle: CheckCircle2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  clock: Clock,
  clipboard: ClipboardList,
  download: Download,
  eye: Eye,
  fileText: FileText,
  filePlus: FilePlus,
  graduation: GraduationCap,
  home: Home,
  info: Info,
  link: Link,
  logout: LogOut,
  mail: Mail,
  mapPin: MapPin,
  megaphone: Megaphone,
  phone: Phone,
  pause: Pause,
  play: Play,
  plus: Plus,
  search: Search,
  settings: Settings,
  shield: ShieldCheck,
  sparkles: Sparkles,
  table: Table,
  trash: Trash2,
  upload: Upload,
  user: User,
  users: Users,
  x: X,
  message: MessageCircle,
  send: Send,
  bot: Bot,
  calendar: CalendarDays,
  toggleLeft: ToggleLeft,
  toggleRight: ToggleRight,
  activity: Activity,
  alertTriangle: AlertTriangle,
  trendingUp: TrendingUp,
  filter: Filter,
  moreVertical: MoreVertical,
  edit: Edit,
  lock: Lock,
  unlock: Unlock,
  chevronUp: ChevronUp,
  refresh: RefreshCw,
  userCheck: UserCheck,
  userX: UserX,
  key: Key,
  layers: Layers,
  gitBranch: GitBranch,
  flag: Flag,
  barChart: BarChart2,
  fileCheck: FileCheck,
  alertCircle: AlertCircle,
  checkSquare: CheckSquare,
  xSquare: XSquare,
  zap: Zap,
};

export const Icon = ({ name, size = 18, color = 'currentColor', strokeWidth = 2, ...props }) => {
  const LucideIcon = iconMap[name] || Info;
  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
};

export const BrandMark = ({ size = 'md', tone = 'light' }) => (
  <div className={`brand-mark brand-mark-${size} brand-mark-${tone}`}>
    <GraduationCap aria-hidden="true" />
  </div>
);

/* Sidebar Component — with mobile hamburger drawer */
export const Sidebar = ({ user, activeTab, setActiveTab, navItems, onLogout, onGoHome }) => {
  const [signOutHover, setSignOutHover] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  // Close on escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    if (mobileOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Mobile close button */}
        <button className="sidebar-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
          <X size={20} />
        </button>

        <div className="sidebar-logo">
          <div className="sidebar-brand">
            <BrandMark size="sm" tone="dark" />
            <div>
              <h1>EMS</h1>
              <p>Student Module Portal</p>
            </div>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="avatar avatar-primary">
            {user.avatar}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Dashboard navigation">
          {navItems.map(item => (
            item.section
              ? <div key={item.section} className="sidebar-section-label">{item.section}</div>
              : <button
                  key={item.id}
                  className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                  aria-current={activeTab === item.id ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="nav-badge" aria-label={`${item.badge} pending`}>{item.badge}</span>}
                </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {onGoHome && (
            <button
              className="sidebar-home-btn"
              onClick={() => { setMobileOpen(false); onGoHome(); }}
              aria-label="Back to home page"
            >
              <Icon name="home" size={16} color="rgba(255,255,255,0.68)" />
              Back to Home
            </button>
          )}
          <button
            onMouseEnter={() => setSignOutHover(true)}
            onMouseLeave={() => setSignOutHover(false)}
            onClick={onLogout}
            className="sidebar-signout"
            style={{
              borderColor: signOutHover ? 'rgba(240,130,94,0.6)' : 'rgba(255,255,255,0.12)',
              background: signOutHover ? 'rgba(240,130,94,0.15)' : 'rgba(255,255,255,0.06)',
              color: signOutHover ? '#F0825E' : 'rgba(255,255,255,0.68)',
            }}
          >
            <Icon name="logout" size={16} color={signOutHover ? '#F0825E' : 'rgba(255,255,255,0.68)'} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

/* Topbar */
export const Topbar = ({ title, user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const ref = useRef(null);
  const notificationStoreRef = useRef(null);

  const loadNotificationStore = useCallback(async () => {
    if (!notificationStoreRef.current) {
      notificationStoreRef.current = await import('./store');
    }
    return notificationStoreRef.current;
  }, []);

  const refreshNotifications = useCallback(async () => {
    const store = await loadNotificationStore();
    setNotifs(store.getNotifications(user.id));
  }, [loadNotificationStore, user.id]);

  useEffect(() => {
    refreshNotifications();
  }, [open, refreshNotifications]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;
  const timeAgo = (iso) => {
    const d = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (d < 1) return 'just now';
    if (d < 60) return `${d}m ago`;
    if (d < 1440) return `${Math.floor(d / 60)}h ago`;
    return `${Math.floor(d / 1440)}d ago`;
  };

  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <div className="topbar-actions">
        <div style={{ position: 'relative' }} ref={ref}>
          <button className="notif-btn" onClick={async () => {
            setOpen(p => !p);
            if (!open && unread) {
              const store = await loadNotificationStore();
              store.markAllNotifsRead(user.id);
              refreshNotifications();
            }
          }} aria-label="Notifications">
            <Icon name="bell" size={18} />
            {unread > 0 && <span className="notif-dot" />}
          </button>
          {open && (
            <div className="notif-panel">
              <div className="notif-header">
                <span className="notif-heading">Notifications</span>
                <span className="notif-count">{notifs.length} total</span>
              </div>
              {notifs.length === 0
                ? <div className="empty-state"><Icon name="bell" size={38} color="var(--text-muted)" /><div className="empty-title">No notifications</div></div>
                : notifs.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={async () => {
                        const store = await loadNotificationStore();
                        store.markNotifRead(n.id);
                        setNotifs(store.getNotifications(user.id));
                      }}>
                      <div className="notif-dot-indicator" style={{
                        background: n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--danger)' : 'var(--primary)'
                      }} />
                      <div>
                        <div className="notif-text">{n.message}</div>
                        <div className="notif-time">{timeAgo(n.createdAt)}</div>
                      </div>
                    </div>
                  ))
              }
            </div>
          )}
        </div>

        <div className="topbar-user">
          <div className="avatar avatar-primary">
            {user.avatar}
          </div>
          <span>{user.name.split(' ')[0]}</span>
        </div>

        {onLogout && (
          <button onClick={onLogout} className="btn btn-ghost btn-sm btn-icon-text btn-danger-soft">
            <Icon name="logout" size={14} />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    pending:            { cls: 'badge-pending', label: 'Pending' },
    fully_approved:     { cls: 'badge-success', label: 'Approved' },
    rejected:           { cls: 'badge-danger',  label: 'Rejected' },
  };
  const { cls, label } = map[status] || { cls: 'badge-info', label: status };
  return <span className={`badge ${cls}`}>{status === 'fully_approved' && <Icon name="check" size={12} />}{label}</span>;
};

export const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <div className="modal-title">{title}</div>
        <button className="icon-button" onClick={onClose} aria-label="Close modal">
          <Icon name="x" size={18} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);
