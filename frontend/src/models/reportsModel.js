export const reportsModel = {
  dprSection: 'Workflow 4.5 MIS Module',
  requirements: [
    { ref: 27, title: 'Generate student reports', screen: 'Student Reports', complexity: 'Medium' },
    { ref: 28, title: 'Generate examination reports', screen: 'Examination Reports', complexity: 'Medium' },
    { ref: 29, title: 'Generate marks reports', screen: 'Marks Reports', complexity: 'Medium' },
  ],
  studentReports: [
    'College-wise enrolment of students',
    'Course-wise enrolment of students',
    'Age-wise distribution of students',
    'Region-wise distribution of students',
    'Year-wise enrolment of students',
  ],
  examinationReports: [
    'College-wise Examination Report',
    'Course-wise Examination Report',
    'Examination Attendance Report',
    'Year-wise Exam Attendance Report',
    'Exam Postponement Report',
  ],
  marksReports: [
    'College-wise Pass-Fail Report',
    'College-wise Division Report',
    'College-wise Marks Distribution Report',
    'Student-wise Marks Trend Report',
    'Course-wise Pass-Fail Report',
    'Course-wise Division Report',
    'Course-wise Marks Distribution Report',
  ],
};

export const reportRows = [
  ['Student Registration Summary', 'College, course, term, year, region, age', 'Table, cards, chart', 'Excel, PDF, Print'],
  ['Examination Schedule Report', 'College, course, term, subject, year', 'Calendar table', 'Excel, PDF, Print'],
  ['Marks Approval Report', 'College, course, term, subject, status', 'Division chart', 'Excel, PDF, Print'],
];
