import { approvalStatuses, colleges, courses, regions, terms, users, years } from './referenceData';

export const students = [
  {
    id: 'STU-1001',
    name: 'Kavitha R',
    dob: '2004-08-12',
    email: 'kavitha.r@example.in',
    mobile: '9876543210',
    studentId: 'COL-STU-1024',
    fatherName: 'Ramesh Kumar',
    motherName: 'Latha R',
    address: '12 Student Street, Gorimedu',
    residence: 'Puducherry',
    state: 'Puducherry',
    pinCode: '605006',
    college: colleges[0],
    course: courses[0],
    term: terms[1],
    status: 'Submitted',
    registrationNo: '',
  },
  {
    id: 'STU-1002',
    name: 'Mohan Das',
    dob: '2003-02-02',
    email: 'mohan.d@example.in',
    mobile: '9876543211',
    studentId: 'COL-STU-1025',
    fatherName: 'Arun Das',
    motherName: 'Meena Das',
    address: '18 Mission Street',
    residence: 'Karaikal',
    state: 'Puducherry',
    pinCode: '609602',
    college: colleges[0],
    course: courses[1],
    term: terms[0],
    status: 'Approved',
    registrationNo: 'PYBOME202600082',
  },
  {
    id: 'STU-1003',
    name: 'Nisha P',
    dob: '2004-11-21',
    email: 'nisha.p@example.in',
    mobile: '9876543212',
    studentId: 'COL-STU-1026',
    fatherName: 'Prakash P',
    motherName: 'Vimala P',
    address: '4 Beach Road',
    residence: 'Mahe',
    state: 'Puducherry',
    pinCode: '673310',
    college: colleges[0],
    course: courses[3],
    term: terms[2],
    status: 'Sent Back',
    registrationNo: '',
  },
];

export const educationRecords = [
  ['Kavitha R', 'XII', 'Biology, Chemistry', 'State Board', 'Govt. Higher Secondary School', '2022', '600', '516', '86%', 'PDF pending'],
  ['Mohan Das', 'Diploma', 'Lab Technology', 'BOME', 'MTPG&RIHS', '2024', '800', '642', '80.25%', 'Uploaded'],
  ['Nisha P', 'XII', 'Physics, Chemistry', 'State Board', 'Mahe GHSS', '2022', '600', '489', '81.5%', 'Uploaded'],
];

export const studentDocuments = [
  ['Name Proof', 'Required', 'Uploaded', 'Verified'],
  ['Date of Birth Proof', 'Required', 'Uploaded', 'Submitted'],
  ['Student ID Proof', 'Required', 'Missing', 'Draft'],
  ['Address Proof', 'Required', 'Uploaded', 'Verified'],
];

export const subjects = [
  { code: 'NUR-101', name: 'Anatomy and Physiology', course: courses[0], term: terms[0], effectiveStart: '2026-06-01', effectiveEnd: '', status: 'Approved' },
  { code: 'MLT-201', name: 'Clinical Pathology', course: courses[1], term: terms[1], effectiveStart: '2026-06-01', effectiveEnd: '', status: 'Verified' },
  { code: 'RAD-301', name: 'Radiographic Positioning', course: courses[2], term: terms[2], effectiveStart: '2026-07-01', effectiveEnd: '', status: 'Draft' },
];

export const schedules = [
  ['Diploma in General Nursing and Midwifery', 'Semester 1', 'Anatomy and Physiology', 'Mid-term Examination', '2026-07-12', '10:00 AM', 'Hall A', 'Submitted'],
  ['Diploma in Medical Laboratory Technology', 'Semester 2', 'Clinical Pathology', 'End-term Examination', '2026-08-15', '10:00 AM', 'Lab Block', 'Sent Back'],
  ['Diploma in Radiography and Imaging Technology', 'Semester 3', 'Radiographic Positioning', 'Mid-term Examination', '2026-07-18', '02:00 PM', 'Hall C', 'Approved'],
];

export const attendanceRows = [
  ['PYBOME202600082', 'Mohan Das', 'Clinical Pathology', 'Present', 'Uploaded', 'No correction'],
  ['PYBOME202600083', 'Farhana K', 'Clinical Pathology', 'Absent', 'Uploaded', 'Corrected by Board Officer'],
  ['PYBOME202600084', 'Arul M', 'Anatomy and Physiology', 'Present', 'Pending', 'Awaiting PDF'],
];

export const subjectMarks = [
  ['Anatomy and Physiology', '100', '40', '60', '50', '2026-06-01', 'Approved'],
  ['Clinical Pathology', '100', '30', '70', '45', '2026-06-01', 'Verified'],
  ['Radiographic Positioning', '100', '40', '60', '50', '2026-07-01', 'Draft'],
];

export const marksRows = [
  ['PYBOME202600082', 'Mohan Das', 'Clinical Pathology', '28', '61', '89', 'Pass', 'Submitted'],
  ['PYBOME202600083', 'Farhana K', 'Clinical Pathology', '-', '-', 'Absent', 'Locked', 'Draft'],
  ['PYBOME202600084', 'Arul M', 'Anatomy and Physiology', '22', '24', '46', 'Fail', 'Verified'],
];

export const marksheetRows = [
  ['PYBOME202600082', 'MS-PY-2026-00082', 'First Class', 'DSC pending', 'Queued'],
  ['PYBOME202600084', 'MS-PY-2026-00084', 'Second Class', 'Signed', 'Published'],
];

export const roleGroups = [
  ['Admin Roles', 'User creation, activation, system configuration, task movement', 'Super Admin'],
  ['Staff / Official Roles', 'Task creation, verification, approval, and send back', 'Maker, Checker, Approver'],
  ['Feature Roles', 'Student, examination, marks, and marksheet feature access', 'Module Operator'],
  ['Reports Roles', 'View, download, and request MIS reports', 'Report Viewer'],
];

export const hierarchyRows = [
  ['College Office', 'MTPG&RIHS', 'College Maker', 'College Checker', 'College Approver', 'No pending tasks'],
  ['Board Office', 'BOME', 'Board Maker', 'Board Checker', 'Board Approver', '4 pending tasks'],
  ['Board Office', 'BOEN', 'Board Maker', 'Board Checker', 'Board Approver', 'Clear'],
];

export const featureRows = [
  ['Student bulk upload', 'Enabled', 'Student Module', 'Maker to Checker to Approver'],
  ['Schedule publishing', 'Enabled', 'Examination Module', 'College verification and approval'],
  ['Marks change request', 'Disabled', 'Marks Module', 'Board approval with DSC'],
  ['DigiLocker publishing', 'Enabled', 'Marks Module', 'Board sign and publish'],
];

export const reports = [
  ['Student', 'College-wise enrolment of students', 'College, course, year, region', 'Excel / PDF'],
  ['Student', 'Age-wise distribution of students', 'College, course, year', 'Excel / PDF'],
  ['Examination', 'Examination Attendance Report', 'College, course, semester, year', 'Excel / PDF'],
  ['Examination', 'Exam Postponement Report', 'Course, semester, year', 'PDF'],
  ['Marks', 'College-wise Pass-Fail Report', 'College, course, semester, year', 'Excel / PDF'],
  ['Marks', 'Student-wise Marks Trend Report', 'Registration number, semester, year', 'PDF'],
];

export const migrationStages = [
  ['Metadata Consolidation', 'Database structures, constraints, validations', 'Verified', '31 tables mapped'],
  ['Data Cleaning', 'Improper format, blank, incomplete, repetitive data', 'In Progress', '142 records flagged'],
  ['Data Import', 'Clean data imported into staging schema', 'Submitted', 'Batch IMP-2026-04'],
  ['Data Integration', 'Table-by-table integration into main database', 'Draft', 'Awaiting reconciliation'],
];

export const auditTrail = [
  ['2026-05-20 10:15', 'College Maker', 'Submitted student basic details', 'STU-1001', 'Submitted'],
  ['2026-05-20 10:42', 'Board Checker', 'Verified education document', 'STU-1002', 'Verified'],
  ['2026-05-20 11:20', 'Board Approver', 'Sent back address proof', 'STU-1003', 'Sent Back'],
  ['2026-05-20 12:05', 'Super Admin', 'Enabled schedule publishing feature', 'Feature Configuration', 'Approved'],
];

export const filterOptions = { colleges, courses, terms, years, regions, approvalStatuses, users };
