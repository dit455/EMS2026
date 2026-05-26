import React from 'react';
import { Card, DataTable, PageHeader, ValidatedForm } from '../../components/ui';

const supportRows = [
  ['Login / OTP Assistance', 'Admin login, password or OTP issue', 'helpdesk@mtpgrihs.py.gov.in'],
  ['Student Registration Support', 'Bulk upload, document verification, send back correction', 'studentcell@mtpgrihs.py.gov.in'],
  ['Examination / Marks Workflow', 'Schedule publishing, attendance correction, marks approval', 'examcell@mtpgrihs.py.gov.in'],
  ['Technical Support', 'Browser, download, DigiLocker, and DSC integration support', 'support@mtpgrihs.py.gov.in'],
];

const ticketFields = [
  { label: 'User Name', name: 'name', required: true },
  { label: 'Mobile / Email', name: 'contact', required: true },
  { label: 'Module', name: 'module', options: ['Student Module', 'Examination Module', 'Marks Module', 'Admin Module', 'MIS Module', 'Data Migration Module'], required: true },
  { label: 'Issue Summary', name: 'summary', required: true },
];

export default function HelpdeskPage() {
  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Helpdesk"
        description="Role-wise support for login, registration, verification, examination, marks, reports, and migration workflows."
      />

      <div className="ems-report-grid">
        <Card title="Raise Support Ticket" subtitle="Submit a module-specific issue for the competent support team." icon="message">
          <ValidatedForm fields={ticketFields} submitLabel="Submit Helpdesk Ticket" />
        </Card>
        <Card title="Support Desk Directory" subtitle="Use the correct support channel for faster routing." icon="phone">
          <DataTable columns={['Support Area', 'Coverage', 'Contact']} rows={supportRows} />
        </Card>
      </div>
    </div>
  );
}
