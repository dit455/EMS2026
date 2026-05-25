export const examinationModel = {
  dprSection: 'Workflow 4.2 Examination Module',
  requirements: [
    { ref: 7, title: 'Selection of subjects for each term', screen: 'Subjects', complexity: 'Medium' },
    { ref: 8, title: 'Create/map subjects to courses', screen: 'Subjects', complexity: 'Medium' },
    { ref: 9, title: 'Create course and term exam schedule', screen: 'Schedule', complexity: 'Medium' },
    { ref: 10, title: 'College-level verification and approval of schedule', screen: 'Schedule', complexity: 'Medium' },
    { ref: 11, title: 'Mark examination attendance', screen: 'Attendance', complexity: 'Medium' },
    { ref: 12, title: 'Edit attendance with trail', screen: 'Attendance', complexity: 'Medium' },
  ],
  scheduleFields: ['Course', 'Term', 'Exam type', 'Date', 'Time', 'Venue', 'Subject', 'Holiday / weekend flag'],
  attendanceFields: ['Student registration number', 'Subject', 'Exam', 'Attendance status', 'PDF attendance sheet', 'Correction remarks'],
};

export const subjectRows = [
  ['B.Sc. Nursing', 'Term 1', 'Anatomy', 'Core', '2026-06-01', '2026-12-31'],
  ['BPT', 'Term 2', 'Exercise Therapy', 'Core', '2026-06-01', '2026-12-31'],
  ['B.Pharm', 'Final Term', 'Pharmacology', 'Elective', '2026-06-01', '2027-05-31'],
];

export const scheduleRows = [
  ['B.Sc. Nursing', 'Term 1', 'Anatomy', '2026-07-12', '10:00 AM', 'Hall A', 'College Verified'],
  ['BPT', 'Term 2', 'Exercise Therapy', '2026-07-13', '02:00 PM', 'Hall B', 'Weekend Warning'],
  ['B.Pharm', 'Final Term', 'Pharmacology', '2026-07-16', '10:00 AM', 'Exam Block', 'Board Approval'],
];

export const attendanceRows = [
  ['MTP-2026-00082', 'Mohan Das', 'Anatomy', 'Present', 'Sheet-102.pdf', 'No correction'],
  ['STU-1024', 'Kavitha R', 'Anatomy', 'Absent', 'Sheet-102.pdf', 'Marks blocked'],
  ['STU-1026', 'Anitha P', 'Pharmacology', 'Present', 'Sheet-108.pdf', 'Corrected by Checker'],
];
