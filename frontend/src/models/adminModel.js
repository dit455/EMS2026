export const adminModel = {
  dprSection: 'Workflow 4.4 Admin Module',
  requirements: [
    { ref: 20, title: 'Creation of users', screen: 'Users', complexity: 'Medium', manDays: 8 },
    { ref: 21, title: 'Deactivation / activation of users', screen: 'Users', complexity: 'Medium' },
    { ref: 22, title: 'Assign roles to users', screen: 'Roles', complexity: 'Medium' },
    { ref: 23, title: 'Map office hierarchies for workflows', screen: 'Hierarchy', complexity: 'Medium' },
    { ref: 24, title: 'Modify hierarchy mapping with pending task check', screen: 'Hierarchy', complexity: 'Medium' },
    { ref: 25, title: 'Feature and workflow configuration', screen: 'Features', complexity: 'Medium' },
    { ref: 26, title: 'Super Admin release of new features', screen: 'Features', complexity: 'Medium' },
  ],
  userFields: ['College / Board', 'Designation', 'Mobile Number', 'E-Mail ID', 'Address', 'Place', 'Pin Code'],
  roleCategories: ['Admin Roles', 'Staff / Official Roles', 'Feature Roles', 'Reports Roles'],
};

export const userRows = [
  ['Dr. Anand Kumar', 'Registrar', 'Board Office', 'Super Admin', 'Active'],
  ['Priya Suresh', 'Data Entry Officer', 'College Office', 'Maker', 'Active'],
  ['Rajan Pillai', 'Verification Officer', 'Exam Cell', 'Checker', 'Temporary inactive'],
  ['Meena Devi', 'Dean', 'Dean Office', 'Approver', 'Active'],
];

export const roleRows = [
  ['Super Admin', 'All modules', 'Critical role monitored', 'Release approval required'],
  ['Board Admin', 'Students, Exams, Marks, Reports', 'Can bulk approve', 'DSC required'],
  ['College Admin', 'College-scoped records', 'Can verify schedule', 'Cannot publish marksheet'],
  ['Checker', 'Review queue', 'Approve or send back', 'No configuration access'],
];

export const hierarchyRows = [
  ['College Office', 'MTPG&RIHS', 'Maker', 'Checker', 'Approver', 'Removal blocked: 3 pending tasks'],
  ['Exam Cell', 'Board', 'Schedule Maker', 'College Verifier', 'Board Approver', 'Ready'],
  ['Marks Cell', 'Board', 'Marks Entry', 'Marks Checker', 'DSC Signatory', 'Ready'],
];

export const featureRows = [
  ['Bulk student upload', 'Enabled', 'Students', 'Checker workflow'],
  ['Digital signature', 'Enabled', 'Approvals', 'Super Admin re-auth'],
  ['DigiLocker publishing', 'Pilot', 'Marksheet', 'API journey pending'],
  ['SMS notifications', 'Enabled', 'OTP and alerts', 'Gateway mapped'],
  ['Email notifications', 'Enabled', 'Workflow alerts', 'SMTP mapped'],
];
