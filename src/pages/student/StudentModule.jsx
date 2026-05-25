import React, { useEffect, useState } from 'react';
import StudentRegistrationWizard from '../../components/registration/StudentRegistrationWizard';
import { ApprovalWorkflow, Card, DataTable, PageHeader, StatusBadge, UploadControl } from '../../components/ui';
import { DEMO_STUDENT_ACCOUNT } from '../../config/appConfig';
import { registrationService } from '../../services/mockApi';
import { downloadStudentTemplate, downloadTextFile } from '../../utils/actions';

const studentVerificationRows = [
  ['Student name proof', 'Name proof PDF', 'Board Checker', 'Verified'],
  ['DOB', 'DOB proof PDF', 'Board Checker', 'Submitted'],
  ['Address', 'Address proof PDF', 'College Correction', 'Sent Back'],
  ['Student ID', 'Student ID proof PDF', 'Board Approver', 'Draft'],
];

const educationRows = [
  ['X', 'Board / School, marks, percentage, certificate serial number', 'Mandatory PDF', 'Ready'],
  ['XII', 'Board / School, marks, percentage, certificate serial number', 'Mandatory PDF', 'Ready'],
  ['Other', 'College / institution details and registration number', 'Mandatory PDF', 'Draft'],
];

const workflowRows = [
  ['Maker', 'College enters / corrects student data only before approval', 'Open'],
  ['Checker', 'Board verifies proof documents and education details', 'In Review'],
  ['Approver', 'Board approval with digital signature; no edit at approval stage', 'Locked'],
  ['Bulk Approval', 'Eligible verified records can be approved in batch', 'Available'],
];

export default function StudentModule() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    registrationService.getRegistrationStatus().then(setStatus);
  }, []);

  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Student Registration"
        description="Stage-wise registration for basic details, education details, document upload, review, and final submission."
        actions={<button className="ems-btn ems-btn-primary" type="button" onClick={downloadStudentTemplate}>Download Student Excel Template</button>}
      />

      <StudentRegistrationWizard />

      <details className="mtpg-student-reference-panels">
        <summary>Reference controls, verification tables, and administrative workflow</summary>
        <div className="ems-report-grid">
          <Card title="Basic Details" subtitle="Name, DOB, email, mobile, parents, address, state, PIN code, and student ID generation." icon="user">
            <div className="ems-action-row">
              <button className="ems-btn ems-btn-secondary" type="button" onClick={downloadStudentTemplate}>Download Basic Details Template</button>
              <button className="ems-btn ems-btn-secondary" type="button" onClick={() => downloadTextFile('MTPG_RIHS_Email_Mobile_Verification.txt', 'Mobile and email verification links generated for selected student records.')}>Generate Verification Links</button>
            </div>
            <UploadControl title="Bulk Student Excel Upload" detail="Upload college student records using the approved Excel template" />
          </Card>
          <Card title="Document Verification" subtitle="Student name, DOB, address, and student ID proofs support PDF upload and Board verification." icon="fileCheck">
            <DataTable columns={['Verification Item', 'Proof Document', 'Responsible Role', 'Status']} rows={studentVerificationRows} statusColumn={3} />
          </Card>
          <Card title="Education Details" subtitle="X / XII / Other qualification entry with marks, percentage, certificate serial number, registration number, and mandatory PDF." icon="book">
            <DataTable columns={['Level', 'Captured Details', 'Document Rule', 'Status']} rows={educationRows} statusColumn={3} />
            <div className="ems-action-row ems-gap-top">
              <button className="ems-btn ems-btn-secondary" type="button" onClick={() => downloadTextFile('MTPG_RIHS_Education_Details_Template.csv', 'Level,Board,School/College,Marks,Percentage,Certificate Serial Number,Registration Number', 'text/csv;charset=utf-8')}>Download Education Template</button>
            </div>
          </Card>
        </div>

        <Card title="Data Verification Workflow" subtitle="Maker to Checker to Approver workflow with Board verification, digital signature, bulk approval, Reject / Send Back action, and college-level correction only." icon="shield">
          <DataTable columns={['Stage', 'Rule', 'Status']} rows={workflowRows} statusColumn={2} />
          <div className="ems-gap-top">
            <ApprovalWorkflow title="Board Verification and Digital Signature Approval" dsc />
          </div>
        </Card>

        <Card title="Unique Student Registration Number" subtitle="A unique registration number is generated after final approval and locked with the approved record." icon="checkCircle">
          <DataTable columns={['Generation Step', 'Output', 'Edit Rule', 'Status']} rows={[
            ['Approved student record', DEMO_STUDENT_ACCOUNT.registrationNumber, 'Locked after digital signature', 'Ready'],
            ['Bulk approved record', 'Auto-numbered sequence', 'No approval-stage editing', 'Queued'],
          ]} statusColumn={3} />
        </Card>

        <Card title="Registration Status" subtitle="Latest mock status saved in this browser." icon="fileCheck">
          <div className="mtpg-status-panel">
            <div>
              <strong>Application / Reference Number</strong>
              <span>{status?.referenceNumber || 'Not generated yet'}</span>
            </div>
            <div>
              <strong>Status</strong>
              <StatusBadge status={status?.status || 'Draft'} />
            </div>
            <div>
              <strong>Next Step</strong>
              <span>{status?.nextStep || 'Complete student registration and submit for verification.'}</span>
            </div>
          </div>
        </Card>
      </details>
    </div>
  );
}
