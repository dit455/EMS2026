export const marksModel = {
  dprSection: 'Workflow 4.3 Marks Module',
  requirements: [
    { ref: 13, title: 'Entry of subject marks and pass marks', screen: 'Marks Config', complexity: 'Medium' },
    { ref: 14, title: 'Change subject marks with DSC and trail', screen: 'Marks Config', complexity: 'High', manDays: 20 },
    { ref: 15, title: 'Entry of student marks by term subject exam', screen: 'Marks Entry', complexity: 'High', manDays: 20 },
    { ref: 16, title: 'Change approved student marks with trail', screen: 'Change Request', complexity: 'Low', manDays: 8 },
    { ref: 17, title: 'Generate marksheet after approval', screen: 'Marksheet', complexity: 'High', manDays: 20 },
    { ref: 18, title: 'Digitally signed marksheet', screen: 'Marksheet', complexity: 'High', manDays: 10 },
    { ref: 19, title: 'DigiLocker integration', screen: 'Marksheet', complexity: 'High', manDays: 10 },
  ],
  divisionRules: [
    '>80%: Distinction',
    '60-80%: First Class',
    '45-50%: Second Class',
    '35-45%: Third Class',
    '<35%: Fail',
  ],
};

export const marksRows = [
  ['MTP-2026-00082', 'Mohan Das', 'Anatomy', 'Internal 41 / External 52', '93 / 100', 'Pass', 'Approved'],
  ['STU-1024', 'Kavitha R', 'Anatomy', 'Absent', '-', 'Blocked', 'Attendance required'],
  ['STU-1026', 'Anitha P', 'Pharmacology', 'Internal 32 / External 46', '78 / 100', 'Pass', 'Verifier pending'],
];

export const marksheetRows = [
  ['MTP-2026-00082', 'MS-2026-00082', 'Ready', 'DSC Embedded', 'DigiLocker queued'],
  ['MTP-2026-00094', 'MS-2026-00094', 'Preview', 'Awaiting DSC', 'Not published'],
];
