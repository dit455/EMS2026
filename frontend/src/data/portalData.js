export const institution = {
  shortName: 'MTPG & RIHS',
  nameLines: [
    'MOTHER THERESA POST GRADUATE AND RESEARCH',
    'INSTITUTE OF HEALTH SCIENCES (MTPG & RIHS)',
    '(Government of Puducherry Institution)',
    'Indira Nagar, Gorimedu, Puducherry-605 006',
  ],
  name: 'MOTHER THERESA POST GRADUATE AND RESEARCH INSTITUTE OF HEALTH SCIENCES (MTPG & RIHS)',
  address: 'Indira Nagar, Gorimedu, Puducherry-605 006',
};

export const carouselSlides = [
  {
    id: 'digital-portal',
    title: 'Student Registration & Verification Portal',
    subtitle: 'A secure Government of Puducherry student service desk for registration, document upload, verification, and official status tracking.',
    image: '/images/carousel_1.jpg',
    primaryCta: 'Register Now',
    primaryHref: '#register-now',
    secondaryCta: 'Student Login',
    secondaryHref: '#student-login',
  },
  {
    id: 'student-module',
    title: 'Guided Student Registration Workflow',
    subtitle: 'Complete basic details, education details, and document upload in a clear six-step institutional journey.',
    image: '/images/carousel_2.jpg',
    primaryCta: 'Register Now',
    primaryHref: '#register-now',
    secondaryCta: 'Download Template',
    secondaryHref: '#downloads',
  },
  {
    id: 'education-verification',
    title: 'Digitally Verified Student Records',
    subtitle: 'Track maker, checker, and approver movement with OTP authentication, audit trail references, and registration number generation.',
    image: '/images/carousel_1.jpg',
    primaryCta: 'Upload Documents',
    primaryHref: '#student-services',
    secondaryCta: 'View Guidelines',
    secondaryHref: '#register-now',
  },
];

export const studentHighlights = [
  {
    title: 'Basic Details Entry',
    detail: 'Create a verified student profile with personal, course, contact, and address details.',
    workflow: 'Complete mandatory fields, validate mobile and email, then save the registration draft.',
    benefit: 'Reduces repeated manual forms and keeps the profile ready for institutional verification.',
    icon: 'user',
  },
  {
    title: 'Education Details Entry',
    detail: 'Add qualification, board, year, marks, percentage, and certificate information.',
    workflow: 'Enter each qualification, attach proof, and submit the education record for review.',
    benefit: 'Creates a consistent academic record for future examination and registration processes.',
    icon: 'book',
  },
  {
    title: 'Document Upload',
    detail: 'Upload identity, date of birth, address, student ID, and education proof documents.',
    workflow: 'Choose required files, check mandatory document status, and submit the document set.',
    benefit: 'Improves verification speed and gives students a clear checklist of pending documents.',
    icon: 'upload',
  },
  {
    title: 'Student Verification',
    detail: 'Track profile and document verification before final institutional approval.',
    workflow: 'Maker submits, checker verifies, and approver records the final decision.',
    benefit: 'Protects student records with a clear audit path and reduces correction delays.',
    icon: 'shield',
  },
  {
    title: 'Approval Workflow',
    detail: 'View maker, checker, and approver movement with reason-based decisions.',
    workflow: 'Submitted records are verified, approved, sent back, or rejected with reason tracking.',
    benefit: 'Gives students predictable status movement and institutional accountability.',
    icon: 'fileCheck',
  },
  {
    title: 'Registration Number Generation',
    detail: 'Receive a unique registration number after final approval and record lock.',
    workflow: 'Approved records are locked, numbered, and made available for student login and future services.',
    benefit: 'Students receive a durable registration identity for examination schedules and portal services.',
    icon: 'fileCheck',
  },
];

export const dashboardModules = [
  {
    title: 'Student Module',
    ref: 'Workflow 4.1',
    icon: 'graduation',
    items: [
      'Basic Details',
      'Education Details',
      'Document Upload',
      'Data Verification',
      'Unique Student Registration Number',
    ],
  },
  {
    title: 'Examination Module',
    ref: 'Workflow 4.2',
    icon: 'clipboard',
    items: [
      'Term-wise Subjects',
      'Subject Mapping',
      'Examination Schedule',
      'Holiday / Weekend Alerts',
      'Attendance Marking',
      'Attendance PDF Upload',
      'Attendance Correction Audit Trail',
    ],
  },
  {
    title: 'Marks Module',
    ref: 'Workflow 4.3',
    icon: 'award',
    items: [
      'Subject Marks Setup',
      'Internal / External Marks',
      'Student Marks Entry',
      'Pass / Fail Auto Status',
      'Marks Approval',
      'Marks Sheet Generation',
      'Digital Signature',
      'DigiLocker Integration',
    ],
  },
  {
    title: 'Admin Module',
    ref: 'Workflow 4.4',
    icon: 'settings',
    items: [
      'User Creation',
      'OTP Login',
      'User Activation / Deactivation',
      'Role Management',
      'Super Admin Controls',
      'Office Hierarchy Mapping',
      'Feature Enable / Disable',
    ],
  },
  {
    title: 'MIS Module',
    ref: 'Workflow 4.5',
    icon: 'barChart',
    items: [
      'Student Reports',
      'Examination Reports',
      'Marks Reports',
      'College-wise Reports',
      'Course-wise Reports',
      'Year-wise Reports',
      'Download Reports',
    ],
  },
  {
    title: 'Data Migration Module',
    ref: 'Workflow 4.6',
    icon: 'layers',
    items: [
      'Metadata Consolidation',
      'Data Cleaning',
      'Data Import',
      'Data Integration',
      'Migration Audit Log',
    ],
  },
];

export const portalStats = [
  ['Total Students', '4,820', 'Registered across medical education programmes'],
  ['Pending Verification', '148', 'Awaiting checker or board verification'],
  ['Approved Students', '4,112', 'Final approved student records'],
  ['Scheduled Exams', '36', 'Published and draft examination schedules'],
  ['Generated Marks Sheets', '3,986', 'Digitally prepared mark sheets'],
];

export const pendingTasks = [
  ['TSK-1001', 'Student Module', 'Verify uploaded address proof for B.Sc. Nursing student batch', 'Board Checker', 'Submitted', 'High'],
  ['TSK-1002', 'Student Module', 'Approve registration number generation for verified students', 'Board Approver', 'Verified', 'High'],
  ['TSK-1003', 'Examination Module', 'Review term-wise subject mapping for Semester 2', 'College Approver', 'Draft', 'Medium'],
  ['TSK-1004', 'Marks Module', 'Approve marks entry batch for Clinical Pathology', 'Board Official', 'Submitted', 'High'],
  ['TSK-1005', 'Admin Module', 'Activate user access for new college staff', 'Super Admin', 'Sent Back', 'Medium'],
  ['TSK-1006', 'MIS Module', 'Generate college-wise pass-fail report', 'Report Viewer', 'Approved', 'Low'],
  ['TSK-1007', 'Data Migration', 'Validate cleaned legacy student metadata', 'Super Admin', 'Rejected', 'High'],
];

export const recentActivities = [
  ['09:20 AM', 'Student uploaded document', 'Date of birth proof uploaded for verification.'],
  ['10:05 AM', 'Checker verified student details', 'Basic details and education record moved to verified state.'],
  ['11:30 AM', 'Approver approved student registration', 'Unique registration number generation approved.'],
  ['12:10 PM', 'Exam schedule published', 'Semester examination schedule released for college users.'],
  ['02:25 PM', 'Marks sheet generated', 'Digitally signed marks sheet queued for publication.'],
  ['03:40 PM', 'MIS report downloaded', 'Course-wise report exported by report viewer.'],
];

export const downloadLinks = [
  'Student Excel Template',
  'Education Details Template',
  'Student Registration Guidelines',
  'Examination Schedule',
  'Document Upload Checklist',
  'Helpdesk Contact',
];
