export const APP_ROUTES = Object.freeze({
  home: '/',
  adminLogin: '/admin-login',
  studentLogin: '/student-login',
  student: '/student',
  dashboard: '/dashboard',
  studentModule: '/student-module',
  examination: '/examination',
  marks: '/marks',
  adminModule: '/admin-module',
  mis: '/mis',
  migration: '/migration',
  downloads: '/downloads',
  helpdesk: '/helpdesk',
  contact: '/contact',
});

export const STORAGE_KEYS = Object.freeze({
  session: 'ems_user_session',
  studentDraft: 'mtpg_student_registration_draft',
  studentStatus: 'mtpg_student_registration_status',
  notifications: 'ems_notifications',
});

const envDemoFlag = import.meta.env.VITE_ENABLE_DEMO_ACCESS;

export const ENABLE_DEMO_ACCESS = envDemoFlag === undefined
  ? import.meta.env.DEV
  : String(envDemoFlag).toLowerCase() === 'true';

export const DEMO_OTP = String(import.meta.env.VITE_DEMO_OTP || '123456');
export const OTP_LENGTH = DEMO_OTP.length;
export const DEMO_ADMIN_EMAIL = import.meta.env.VITE_DEMO_ADMIN_EMAIL || 'admin@ems.py.gov.in';

export const DEMO_STUDENT_ACCOUNT = Object.freeze({
  registrationNumber: import.meta.env.VITE_DEMO_STUDENT_REGISTRATION_NUMBER || 'MTPG-STU-2026-001',
  otp: DEMO_OTP,
  user: {
    id: 'student-session',
    name: 'Student User',
    email: 'student@mtpgrihs.py.gov.in',
    role: 'Student',
    scope: 'Public Student Portal',
    avatar: 'ST',
    registrationNumber: import.meta.env.VITE_DEMO_STUDENT_REGISTRATION_NUMBER || 'MTPG-STU-2026-001',
  },
});
