// MTPGRIHS Student Module Store
// Browser-local persistence for the current frontend prototype.
import { DEMO_OTP } from './config/appConfig';

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

const STORAGE_VERSION = 'mtpgrihs_student_module_v1';

const SEED_PUBLIC_NOTIFICATIONS = [
  {
    id: 1,
    type: 'info',
    icon: 'user',
    title: 'Student Registration',
    message: 'Student basic details and contact verification are available in the portal.',
    time: 'May 2026',
    tag: 'Student',
  },
  {
    id: 2,
    type: 'success',
    icon: 'upload',
    title: 'Document Upload',
    message: 'Upload proof documents for name, date of birth, student ID, and address.',
    time: 'May 2026',
    tag: 'Documents',
  },
  {
    id: 3,
    type: 'warning',
    icon: 'book',
    title: 'Education Details',
    message: 'Each education record must include a PDF proof before verification readiness.',
    time: 'May 2026',
    tag: 'Education',
  },
];

const SEED_STUDENTS = [
  {
    id: 'stu-demo',
    name: 'Demo Student',
    dob: '2003-04-10',
    email: 'student@mtpgrihs.ac.in',
    mobile: '9876543210',
    studentId: 'MTP-STU-001',
    fatherName: 'Demo Father',
    motherName: 'Demo Mother',
    address: '12 Student Street',
    placeOfResidence: 'Puducherry',
    state: 'Puducherry',
    pinCode: '605006',
    department: 'B.Sc. Nursing',
    year: '1st Year',
    password: DEMO_OTP,
    role: ROLES.STUDENT,
    avatar: 'DS',
    enrollmentNo: 'MTPGRIHS20260001',
    createdAt: '2026-05-18T00:00:00.000Z',
  },
];

const SEED_ADMINS = [
  {
    id: 'admin-demo',
    name: 'Admin User',
    email: 'admin@mtpgrihs.ac.in',
    mobile: '9876500001',
    role: ROLES.ADMIN,
    password: DEMO_OTP,
    avatar: 'AU',
    designation: 'System Administrator',
  },
];

const generateId = (prefix = '') =>
  `${prefix}${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`;

const sanitize = (value) =>
  typeof value === 'string'
    ? value.replace(/[<>"'&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[char]))
    : value;

const getLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const initStore = () => {
  if (!localStorage.getItem(STORAGE_VERSION)) {
    setLS('mtihs_students', SEED_STUDENTS);
    setLS('mtihs_admins', SEED_ADMINS);
    setLS('mtihs_notifications', []);
    setLS('mtihs_public_notifications', SEED_PUBLIC_NOTIFICATIONS);
    setLS('mtihs_student_documents', []);
    setLS('mtihs_education_records', []);
    setLS('mtihs_verification', {});
    setLS(STORAGE_VERSION, true);
    return;
  }

  const students = getLS('mtihs_students', []);
  if (!students.some((student) => student.email === SEED_STUDENTS[0].email)) {
    setLS('mtihs_students', [SEED_STUDENTS[0], ...students]);
  }

  const admins = getLS('mtihs_admins', []);
  if (!admins.some((admin) => admin.email === SEED_ADMINS[0].email)) {
    setLS('mtihs_admins', [SEED_ADMINS[0], ...admins]);
  }
};

initStore();

export const loginUser = (email, password, role = ROLES.STUDENT) => {
  const identifier = email.trim().toLowerCase();
  const matchesIdentifier = (user) =>
    user.email?.toLowerCase() === identifier || user.mobile === identifier;

  if (role === ROLES.ADMIN) {
    const admins = getLS('mtihs_admins', SEED_ADMINS);
    return admins.find((admin) => matchesIdentifier(admin) && admin.password === password) || null;
  }

  const students = getLS('mtihs_students', []);
  return students.find((student) => matchesIdentifier(student) && student.password === password) || null;
};

export const registerStudent = (data) => {
  const students = getLS('mtihs_students', []);
  const email = (data.email || '').trim().toLowerCase();
  const name = sanitize((data.name || '').trim());

  if (!email) return { error: 'Email address is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
  if (students.some((student) => student.email === email)) return { error: 'Email already registered.' };
  if (!name || name.length < 2) return { error: 'Please enter your full name (at least 2 characters).' };

  const newStudent = {
    id: generateId('stu-'),
    ...data,
    name,
    email,
    role: ROLES.STUDENT,
    avatar: name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
    enrollmentNo: `MTPGRIHS${new Date().getFullYear()}${String(students.length + 1).padStart(4, '0')}`,
    createdAt: new Date().toISOString(),
  };

  students.push(newStudent);
  setLS('mtihs_students', students);
  addNotification(newStudent.id, 'Student account created. Complete documents and education details next.', 'success');

  return { user: newStudent };
};

export const addNotification = (userId, message, type = 'info') => {
  const notifications = getLS('mtihs_notifications', []);
  notifications.unshift({
    id: generateId('ntf-'),
    userId,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  });
  setLS('mtihs_notifications', notifications);
};

export const getNotifications = (userId) =>
  getLS('mtihs_notifications', []).filter((notification) => notification.userId === userId);

export const markNotifRead = (notificationId) => {
  const notifications = getLS('mtihs_notifications', []);
  setLS('mtihs_notifications', notifications.map((notification) =>
    notification.id === notificationId ? { ...notification, read: true } : notification
  ));
};

export const markAllNotifsRead = (userId) => {
  const notifications = getLS('mtihs_notifications', []);
  setLS('mtihs_notifications', notifications.map((notification) =>
    notification.userId === userId ? { ...notification, read: true } : notification
  ));
};

export const getPublicNotifications = () =>
  getLS('mtihs_public_notifications', SEED_PUBLIC_NOTIFICATIONS);

export const getEducationRecords = (studentId) =>
  getLS('mtihs_education_records', []).filter((record) => record.studentId === studentId);

export const addEducationRecord = (studentId, data) => {
  const records = getLS('mtihs_education_records', []);
  const record = {
    id: generateId('edu-'),
    studentId,
    level: sanitize(data.level || ''),
    majorSubjects: sanitize(data.majorSubjects || ''),
    boardExam: sanitize(data.boardExam || ''),
    institution: sanitize(data.institution || ''),
    institutionAddress: sanitize(data.institutionAddress || ''),
    place: sanitize(data.place || ''),
    pinCode: data.pinCode || '',
    yearOfPassing: data.yearOfPassing || '',
    totalMarks: data.totalMarks || '',
    marksObtained: data.marksObtained || '',
    gradePercentage: sanitize(data.gradePercentage || ''),
    registrationNumber: sanitize(data.registrationNumber || ''),
    certificateSerialNumber: sanitize(data.certificateSerialNumber || ''),
    documentName: sanitize(data.documentName || ''),
    documentUploaded: Boolean(data.documentName),
    createdAt: new Date().toISOString(),
  };

  records.push(record);
  setLS('mtihs_education_records', records);
  addNotification(studentId, `${record.level} education details added for verification.`, 'success');
  return record;
};

export const deleteEducationRecord = (recordId) => {
  const records = getLS('mtihs_education_records', []);
  setLS('mtihs_education_records', records.filter((record) => record.id !== recordId));
};

export const getStudentDocuments = (studentId) =>
  getLS('mtihs_student_documents', []).filter((document) => document.studentId === studentId);

export const addStudentDocument = (studentId, docType, fileName) => {
  const documents = getLS('mtihs_student_documents', []);
  const withoutExisting = documents.filter((document) => !(document.studentId === studentId && document.docType === docType));

  withoutExisting.push({
    id: generateId('doc-'),
    studentId,
    docType,
    fileName: sanitize(fileName),
    uploadedAt: new Date().toISOString(),
  });
  setLS('mtihs_student_documents', withoutExisting);
  addNotification(studentId, `${docType} document uploaded.`, 'success');
};

export const deleteStudentDocument = (documentId) => {
  const documents = getLS('mtihs_student_documents', []);
  setLS('mtihs_student_documents', documents.filter((document) => document.id !== documentId));
};

export const getVerificationStatus = (studentId) =>
  getLS('mtihs_verification', {})[studentId] || { mobile: false, email: false };

export const setVerificationStatus = (studentId, field, value) => {
  const verification = getLS('mtihs_verification', {});
  verification[studentId] = {
    mobile: false,
    email: false,
    ...(verification[studentId] || {}),
    [field]: value,
  };
  setLS('mtihs_verification', verification);
};

export const generateExcelTemplate = (type) => {
  const isStudentTemplate = type === 'student';
  const headers = isStudentTemplate
    ? [
        'Name of Student',
        'Date of Birth',
        'E-Mail ID',
        'Mobile Number',
        'Student ID',
        'Name of Father',
        'Name of Mother',
        'Address',
        'Place of Residence',
        'State',
        'Pin Code',
      ]
    : [
        'Education Level',
        'Major Subjects',
        'Name of Board / Exam',
        'Name of School / College',
        'Address of School / College',
        'Place',
        'Pin Code',
        'Year of Passing',
        'Total Marks',
        'Marks Obtained',
        'Grade / Percentage',
        'Student Registration Number',
        'Certificate Serial Number',
      ];

  const fileName = isStudentTemplate ? 'Student_Details_Template.csv' : 'Education_Details_Template.csv';
  const csv = `${headers.join(',')}\n`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export const parseExcelUpload = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const text = event.target.result;
      const lines = text.split('\n').filter((line) => line.trim());
      if (lines.length < 2) {
        reject('File is empty or has no data rows.');
        return;
      }

      const headers = lines[0].split(',').map((header) => header.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((value) => value.trim());
        return headers.reduce((row, header, index) => ({
          ...row,
          [header]: values[index] || '',
        }), {});
      });

      resolve({ headers, rows });
    } catch {
      reject('Failed to parse file. Please use the correct CSV template.');
    }
  };

  reader.onerror = () => reject('Failed to read file.');
  reader.readAsText(file);
});
