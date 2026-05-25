import React from 'react';
import { Card, DataTable, PageHeader } from '../../components/ui';
import { downloadStudentTemplate, downloadTextFile } from '../../utils/actions';

const downloadRows = [
  ['Student Registration Template', 'Basic details, parents, address, state, PIN, student ID fields', 'Download Excel'],
  ['Education Details Template', 'X, XII, other education details, marks, percentage, certificate serial number', 'Download Excel'],
  ['Examination Schedule Format', 'College, course, semester, subject, date, time, venue, exam type', 'Download PDF'],
  ['User Manual', 'Role-wise help for registration, exams, marks, reports, migration, and admin workflows', 'Download PDF'],
];

export default function DownloadsPage() {
  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Downloads"
        description="Official templates, schedules, and workflow documents used across EMS modules."
        actions={<button className="ems-btn ems-btn-primary" type="button" onClick={downloadStudentTemplate}>Download Student Excel Template</button>}
      />

      <Card title="Official Downloads" subtitle="Use these files for student bulk upload, education details, examination schedule sharing, and portal operations." icon="download">
        <DataTable columns={['Document', 'Used For', 'Action']} rows={downloadRows} />
        <div className="ems-action-row ems-gap-top">
          <button className="ems-btn ems-btn-secondary" type="button" onClick={() => downloadTextFile('MTPG_RIHS_Education_Details_Template.csv', 'Level,Board,School/College,Marks,Percentage,Certificate Serial Number,Registration Number', 'text/csv;charset=utf-8')}>Download Education Template</button>
          <button className="ems-btn ems-btn-secondary" type="button" onClick={() => downloadTextFile('MTPG_RIHS_User_Manual.txt', 'EMS user manual placeholder for Student, Examination, Marks, Admin, MIS, and Data Migration modules.')}>Download User Manual</button>
        </div>
      </Card>
    </div>
  );
}
