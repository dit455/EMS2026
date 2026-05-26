export const approvalStatuses = ['Draft', 'Submitted', 'Verified', 'Approved', 'Rejected', 'Sent Back'];

export const colleges = [
  'Mother Theresa Post Graduate and Research Institute of Health Sciences',
];

export const courses = [
  'Diploma in General Nursing and Midwifery',
  'Diploma in Medical Laboratory Technology',
  'Diploma in Radiography and Imaging Technology',
  'B.Sc. Nursing',
];

export const terms = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4'];
export const years = ['2024', '2025', '2026'];
export const regions = ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'];

export const modules = [
  {
    id: 'student',
    title: 'Student Module',
    ref: 'Workflow 4.1',
    description: 'Basic details, education details, document upload, verification, and registration number generation.',
    icon: 'graduation',
    pending: 48,
    route: '/student-module',
  },
  {
    id: 'examination',
    title: 'Examination Module',
    ref: 'Workflow 4.2',
    description: 'Subject mapping, schedules, publishing, attendance, uploads, and correction audit.',
    icon: 'clipboard',
    pending: 11,
    route: '/examination',
  },
  {
    id: 'marks',
    title: 'Marks Module',
    ref: 'Workflow 4.3',
    description: 'Subject marks setup, marks entry, approval, change trail, marksheet, DSC, and DigiLocker.',
    icon: 'award',
    pending: 23,
    route: '/marks',
  },
  {
    id: 'admin',
    title: 'Admin Module',
    ref: 'Workflow 4.4',
    description: 'Users, OTP access, activation, role management, hierarchy mapping, and feature configuration.',
    icon: 'settings',
    pending: 7,
    route: '/admin-module',
  },
  {
    id: 'mis',
    title: 'MIS Module',
    ref: 'Workflow 4.5',
    description: 'Student, examination, and marks reports with official filters and downloads.',
    icon: 'barChart',
    pending: 5,
    route: '/mis',
  },
  {
    id: 'migration',
    title: 'Data Migration Module',
    ref: 'Workflow 4.6 / 4.7',
    description: 'Metadata consolidation, cleaning, import, integration, and migration audit screens.',
    icon: 'layers',
    pending: 9,
    route: '/migration',
  },
];

export const users = [
  {
    id: 'usr-001',
    name: 'Super Admin',
    email: 'admin@ems.py.gov.in',
    mobile: '9876500001',
    role: 'Super Admin',
    scope: 'Board',
    status: 'Active',
    avatar: 'SA',
  },
  {
    id: 'usr-002',
    name: 'College Maker',
    email: 'maker@ems.py.gov.in',
    mobile: '9876500002',
    role: 'College Maker',
    scope: 'College',
    status: 'Active',
    avatar: 'CM',
  },
];

export const authRoleOptions = [...new Set(users.map((user) => user.role))];

export const authQuickLogins = users.map((user) => ({
  label: user.role,
  role: user.role,
  email: user.email,
}));

const utilityModuleIds = ['downloads', 'helpdesk', 'contact'];

export const navByRole = {
  Public: ['home', 'student', ...utilityModuleIds],
  Student: ['home', 'student', ...utilityModuleIds],
  'Super Admin': ['home', 'dashboard', 'student', 'examination', 'marks', 'admin', 'mis', 'migration', ...utilityModuleIds],
  'College Maker': ['home', 'dashboard', 'student', 'examination', 'marks', 'mis', ...utilityModuleIds],
  'Board Approver': ['home', 'dashboard', 'student', 'examination', 'marks', 'mis', 'migration', ...utilityModuleIds],
};
