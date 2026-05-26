import React, { useState } from 'react';
import { AlertStrip, ApprovalWorkflow, Card, DataTable, PageHeader, UploadControl, ValidatedForm } from '../../components/ui';
import { colleges, courses, terms } from '../../data/referenceData';
import { marksRows, marksheetRows, subjectMarks } from '../../data/mockData';
import { downloadTextFile } from '../../utils/actions';
import { getDivision } from '../../utils/validation';

const subjectMarksFields = [
  { label: 'Course', name: 'course', options: courses, required: true },
  { label: 'Semester', name: 'term', options: terms, required: true },
  { label: 'Subject', name: 'subject', required: true },
  { label: 'Total Marks', name: 'totalMarks', required: true },
  { label: 'Internal Marks', name: 'internalMarks', required: true },
  { label: 'External Marks', name: 'externalMarks', required: true },
  { label: 'Pass Mark', name: 'passMark', required: true },
  { label: 'Pass Criteria', name: 'passCriteria', options: ['Division-wise', 'Subject as a whole'], required: true },
  { label: 'Effective Start Date', name: 'effectiveStart', type: 'date', required: true },
];

const subjectMarksChangeFields = [
  { label: 'Subject', name: 'subject', required: true },
  { label: 'Current Total Marks', name: 'currentTotal', required: true },
  { label: 'New Total Marks', name: 'newTotal', required: true },
  { label: 'Current Pass Mark', name: 'currentPass', required: true },
  { label: 'New Pass Mark', name: 'newPass', required: true },
  { label: 'Competent Official', name: 'official', options: ['Board Checker', 'Board Approver', 'Super Admin'], required: true },
  { label: 'Digital Signature Reference', name: 'signatureRef', required: true },
];

const studentMarksChangeFields = [
  { label: 'Registration Number', name: 'registrationNo', required: true },
  { label: 'Subject', name: 'subject', required: true },
  { label: 'Approved Marks', name: 'oldMarks', required: true },
  { label: 'Corrected Marks', name: 'newMarks', required: true },
  { label: 'Competent Official', name: 'official', options: ['Board Approver', 'Super Admin'], required: true },
  { label: 'Digital Signature Reference', name: 'signatureRef', required: true },
  { label: 'Change Reason', name: 'reason', required: true },
];

const divisionRules = [
  ['>80%', 'Distinction'],
  ['60-80%', 'First Class'],
  ['45-50%', 'Second Class'],
  ['35-45%', 'Third Class'],
  ['<35%', 'Fail'],
];

export default function MarksModule() {
  const [marksheetMessage, setMarksheetMessage] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [marksEntryMessage, setMarksEntryMessage] = useState('');
  const samplePercentage = 89;

  const generateMarksheet = () => {
    downloadTextFile(
      'MTPG_RIHS_Marksheet_MS-PY-2026-00082.txt',
      [
        'MTPG & RIHS Marksheet',
        'Reference Number: MS-PY-2026-00082',
        'Student Registration Number: PYBOME202600082',
        `Division: ${getDivision(samplePercentage)}`,
        'Digital Signature: Pending competent Board official DSC',
      ].join('\n'),
    );
    setMarksheetMessage('Department-approved marksheet generated with unique reference number.');
  };

  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Marks Module"
        description="Workflow 4.3: subject marks setup, internal and external marks, pass configuration, student marks entry, approval, change trail, marksheet, DSC, and DigiLocker integration."
      />

      <Card title="Subject Marks Setup" subtitle="Define total marks, pass marks, internal marks, external marks, pass criteria, and effective start date." icon="award">
        <ValidatedForm fields={subjectMarksFields} submitLabel="Save Subject Marks Setup" />
        <DataTable columns={['Subject', 'Total', 'Internal', 'External Marks', 'Pass Mark', 'Effective Start', 'Status']} rows={subjectMarks} statusColumn={6} />
      </Card>

      <Card title="Subject Marks Change Workflow" subtitle="Changes to subject marks require verification, approval, digital signature, and permanent trail." icon="refresh">
        <ValidatedForm fields={subjectMarksChangeFields} submitLabel="Submit Subject Marks Change" />
        <ApprovalWorkflow title="Subject Marks Change Approval" dsc />
        <DataTable columns={['Time', 'Subject', 'Old Pass Mark', 'New Pass Mark', 'Official', 'Status']} rows={[
          ['2026-05-20 10:10', 'Clinical Pathology', '50', '45', 'Board Approver', 'Approved'],
          ['2026-05-20 11:05', 'Radiographic Positioning', '45', '50', 'Board Checker', 'Submitted'],
        ]} statusColumn={5} />
      </Card>

      <Card title="Student Marks Entry" subtitle="Absent students are locked from marks entry. Pass/Fail is calculated automatically after marks are entered." icon="table">
        <AlertStrip tone="info">If attendance is marked Absent, marks entry is disabled for that student, examination, and subject.</AlertStrip>
        {marksEntryMessage && <div className="ems-action-message">{marksEntryMessage}</div>}
        <form
          className="ems-form"
          onSubmit={(event) => {
            event.preventDefault();
            setMarksEntryMessage(
              attendanceStatus === 'Absent'
                ? 'Student is marked absent. Marks entry is blocked and saved as attendance lock.'
                : 'Student marks saved and routed for verification, approval, and digital signature.',
            );
          }}
        >
          <div className="ems-form-grid">
            <label className="ems-form-field">
              <span>College *</span>
              <select required defaultValue={colleges[0]}>
                {colleges.map((college) => <option key={college}>{college}</option>)}
              </select>
            </label>
            <label className="ems-form-field">
              <span>Course *</span>
              <select required defaultValue={courses[0]}>
                {courses.map((course) => <option key={course}>{course}</option>)}
              </select>
            </label>
            <label className="ems-form-field">
              <span>Semester *</span>
              <select required defaultValue={terms[0]}>
                {terms.map((term) => <option key={term}>{term}</option>)}
              </select>
            </label>
            <label className="ems-form-field">
              <span>Registration Number *</span>
              <input required placeholder="PYBOME202600082" />
            </label>
            <label className="ems-form-field">
              <span>Subject *</span>
              <input required placeholder="Clinical Pathology" />
            </label>
            <label className="ems-form-field">
              <span>Attendance Status *</span>
              <select required value={attendanceStatus} onChange={(event) => setAttendanceStatus(event.target.value)}>
                <option>Present</option>
                <option>Absent</option>
              </select>
            </label>
            <label className="ems-form-field">
              <span>Internal Marks *</span>
              <input required={attendanceStatus === 'Present'} disabled={attendanceStatus === 'Absent'} placeholder="28" />
            </label>
            <label className="ems-form-field">
              <span>External Marks *</span>
              <input required={attendanceStatus === 'Present'} disabled={attendanceStatus === 'Absent'} placeholder="61" />
            </label>
          </div>
          <button className="ems-btn ems-btn-primary" type="submit">Save Student Marks</button>
        </form>
        <DataTable columns={['Registration No.', 'Student', 'Subject', 'Internal', 'External Marks', 'Total', 'Result', 'Workflow']} rows={marksRows} statusColumn={7} />
        <ApprovalWorkflow title="Student Marks Approval" dsc />
      </Card>

      <Card title="Marks Change Audit Trail" subtitle="Approved marks can be changed only by competent officials with digital signature. All changes remain available for audit." icon="activity">
        <ValidatedForm fields={studentMarksChangeFields} submitLabel="Submit Student Marks Change" />
        <DataTable columns={['Time', 'Official', 'Registration No.', 'Subject', 'Old Marks', 'New Marks', 'Digital Signature']} rows={[
          ['2026-05-20 12:30', 'Board Approver', 'PYBOME202600082', 'Clinical Pathology', '87', '89', 'Pending'],
          ['2026-05-20 13:05', 'Board Approver', 'PYBOME202600084', 'Anatomy', '44', '46', 'Signed'],
        ]} />
      </Card>

      <Card title="Division Rules" subtitle="Marks classification follows the approved percentage bands." icon="barChart">
        <DataTable columns={['Percentage Band', 'Classification']} rows={divisionRules} />
      </Card>

      <Card title="Marks Sheet Generation" subtitle="Generate marksheets with unique reference number, student registration number, division rule, and department-approved format." icon="fileText">
        {marksheetMessage && <div className="ems-action-message">{marksheetMessage}</div>}
        <div className="ems-preview-panel">
          <div>
            <span>Official Marksheet Preview</span>
            <h2>Board of Medical Education, Government of Puducherry</h2>
            <p>Registration number, subject marks, division, unique reference number, and competent Board official signature area are displayed here.</p>
          </div>
          <button
            className="ems-btn ems-btn-primary"
            type="button"
            onClick={generateMarksheet}
          >
            Generate Marksheet
          </button>
        </div>
        <DataTable columns={['Registration No.', 'Marksheet Ref.', 'Division', 'Digital Signature', 'DigiLocker']} rows={marksheetRows} />
      </Card>

      <Card title="Digital Signature and DigiLocker" subtitle="Placeholders for DSC embedding and DigiLocker publishing integration required by institutional workflow." icon="shield">
        <div className="ems-two-column">
          <UploadControl title="Competent Official Digital Signature Placeholder" detail="DSC integration point for marks approval and marksheet generation" />
          <div className="ems-integration-card">
            <strong>DigiLocker Integration Placeholder</strong>
            <p>Marksheets approved and digitally signed by the Board will be queued for DigiLocker publishing.</p>
            <span>Integration status: Queued for API configuration</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
