export const workflowModel = {
  dprSource: 'Governance workflow gaps and approval requirements',
  stages: ['College entry', 'Checker review', 'Approver review', 'Digital signature', 'Approved / sent back / rejected'],
  actions: ['Approve', 'Reject', 'Send back for modification', 'Bulk approve', 'Digitally sign'],
};

export const workflowRows = [
  ['Student profile', 'Kavitha R', 'Checker', '2d left', 'Open'],
  ['Marks approval', 'Anitha P', 'Approver', '5h left', 'Urgent'],
  ['Schedule verification', 'BPT Term 2', 'College Admin', '1d left', 'Open'],
  ['Feature release', 'DigiLocker', 'Super Admin', 'Awaiting auth', 'Critical'],
];

export const auditRows = [
  ['10:32 AM', 'Priya Suresh', 'Student draft edited', 'STU-1024', 'Info'],
  ['10:15 AM', 'Rajan Pillai', 'Education PDF rejected', 'STU-1026', 'Warning'],
  ['09:55 AM', 'Dr. Anand Kumar', 'Registration approved', 'MTP-2026-00082', 'Success'],
  ['09:10 AM', 'System', 'Absent marks entry blocked', 'STU-1024', 'Error'],
];
