import {
  attendanceRows,
  auditTrail,
  educationRecords,
  featureRows,
  hierarchyRows,
  marksRows,
  marksheetRows,
  migrationStages,
  reports,
  roleGroups,
  schedules,
  studentDocuments,
  students,
  subjectMarks,
  subjects,
} from '../data/mockData';
import { modules, users } from '../data/referenceData';
import { DEMO_OTP, DEMO_STUDENT_ACCOUNT, STORAGE_KEYS } from '../config/appConfig';
import { currentYear, generateNumericCode } from '../utils/id';

const wait = (value) => new Promise((resolve) => {
  window.setTimeout(() => resolve(value), 120);
});

function toSessionUser(user) {
  return {
    ...user,
    name: user.name || user.role,
    avatar: (user.avatar || user.role.split(/\s+/).map((part) => part[0]).join('')).slice(0, 2).toUpperCase(),
  };
}

export const authService = {
  async loginWithOtp({ email, otp, role }) {
    const identifier = String(email || '').trim().toLowerCase();
    const user = users.find((item) => (
      item.status === 'Active'
      && [item.email, item.mobile].some((value) => String(value || '').toLowerCase() === identifier)
    ));

    if (!user || String(otp) !== DEMO_OTP) {
      return wait({ error: 'Invalid credentials or OTP.' });
    }

    if (role && role !== user.role) {
      return wait({ error: 'Selected role does not match this account.' });
    }

    return wait({ user: toSessionUser(user) });
  },

  async loginStudentWithOtp({ registrationNumber, otp }) {
    const registration = String(registrationNumber || '').trim().toUpperCase();
    const expectedRegistration = DEMO_STUDENT_ACCOUNT.registrationNumber.toUpperCase();
    if (registration !== expectedRegistration || String(otp) !== DEMO_STUDENT_ACCOUNT.otp) {
      return wait({ error: 'Invalid registration number or OTP.' });
    }

    return wait({ user: { ...DEMO_STUDENT_ACCOUNT.user, registrationNumber } });
  },
};

export const registrationService = {
  saveDraft(data) {
    localStorage.setItem(STORAGE_KEYS.studentDraft, JSON.stringify({ ...data, savedAt: new Date().toISOString() }));
    return wait({ ok: true });
  },
  loadDraft() {
    const saved = localStorage.getItem(STORAGE_KEYS.studentDraft);
    if (!saved) return wait(null);
    try {
      return wait(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEYS.studentDraft);
      return wait(null);
    }
  },
  clearDraft() {
    localStorage.removeItem(STORAGE_KEYS.studentDraft);
    return wait({ ok: true });
  },
  submitStudentRegistration(data) {
    const referenceNumber = `MTPG-REG-${currentYear()}-${generateNumericCode(6)}`;
    const uniqueStudentRegistrationNumber = `MTPG-STU-${currentYear()}-${generateNumericCode(6)}`;
    const status = {
      referenceNumber,
      uniqueStudentRegistrationNumber,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      nextStep: 'Maker to Checker review, Board verification, then digital signature approval',
      applicantName: data.basic.studentName,
      studentId: data.basic.studentId,
    };
    localStorage.setItem(STORAGE_KEYS.studentStatus, JSON.stringify(status));
    localStorage.removeItem(STORAGE_KEYS.studentDraft);
    return wait(status);
  },
  getRegistrationStatus() {
    const saved = localStorage.getItem(STORAGE_KEYS.studentStatus);
    if (!saved) {
      return wait({
        referenceNumber: 'Not generated yet',
        status: 'Draft not submitted',
        nextStep: 'Complete student registration and submit for verification.',
      });
    }
    try {
      return wait(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEYS.studentStatus);
      return wait({
        referenceNumber: 'Unavailable',
        status: 'Status unavailable',
        nextStep: 'Please contact student helpdesk.',
      });
    }
  },
};

export const dashboardService = {
  getSummary: () => wait({
    modules,
    pendingTasks: [
      ['Student verification', 'Board Checker', '48 pending', 'Submitted'],
      ['Schedule approval', 'College Approver', '3 awaiting approval', 'Verified'],
      ['Marks approval', 'Board Approver', '5 batches pending', 'Submitted'],
      ['Migration audit', 'Super Admin', '2 stages pending', 'Draft'],
    ],
  }),
};

export const studentService = {
  getStudents: () => wait(students),
  getEducationRecords: () => wait(educationRecords),
  getDocuments: () => wait(studentDocuments),
};

export const examinationService = {
  getSubjects: () => wait(subjects),
  getSchedules: () => wait(schedules),
  getAttendance: () => wait(attendanceRows),
};

export const marksService = {
  getSubjectMarks: () => wait(subjectMarks),
  getMarksRows: () => wait(marksRows),
  getMarksheets: () => wait(marksheetRows),
};

export const adminService = {
  getRoles: () => wait(roleGroups),
  getHierarchy: () => wait(hierarchyRows),
  getFeatures: () => wait(featureRows),
  getUsers: () => wait(users),
};

export const misService = {
  getReports: () => wait(reports),
};

export const migrationService = {
  getStages: () => wait(migrationStages),
};

export const auditService = {
  getAuditTrail: () => wait(auditTrail),
};
