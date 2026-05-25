import React, { useMemo, useState } from 'react';
import { Icon } from './components';
import { badgeTone, colleges, courses, regions, terms, years } from './models/referenceData';
import { educationRows, students, studentModel, validationRules } from './models/studentModel';
import { attendanceRows, examinationModel, scheduleRows, subjectRows } from './models/examinationModel';
import { marksModel, marksRows, marksheetRows } from './models/marksModel';
import { adminModel, featureRows, hierarchyRows, roleRows, userRows } from './models/adminModel';
import { reportRows, reportsModel } from './models/reportsModel';
import { dataMigrationModel, migrationRows } from './models/dataMigrationModel';
import { auditRows, workflowModel, workflowRows } from './models/workflowModel';

function StatusPill({ children }) {
  const tone = badgeTone[children] || (String(children).toLowerCase().includes('pending') ? 'warning' : 'info');
  return <span className={`ems-model-pill ems-model-pill--${tone}`}>{children}</span>;
}

function SectionHeader({ title, subtitle, action, icon = 'layers' }) {
  return (
    <div className="ems-section-header">
      <div>
        <h2 className="ems-section-title"><Icon name={icon} size={20} /> {title}</h2>
        <p className="ems-section-sub">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function Field({ label, type = 'text', value, options, required = false }) {
  return (
    <label className="ems-field">
      <span className="ems-label">{label}{required ? ' *' : ''}</span>
      {options ? (
        <select className="ems-input" defaultValue={value || options[0]}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : (
        <input className="ems-input" type={type} defaultValue={value || ''} placeholder={label} />
      )}
    </label>
  );
}

function UploadBox({ title, detail = 'PDF only, max size configurable by policy' }) {
  return (
    <div className="ems-upload-box">
      <Icon name="upload" size={20} />
      <strong>{title}</strong>
      <span>{detail}</span>
      <button className="ems-btn-ghost" type="button"><Icon name="filePlus" size={14} /> Choose File</button>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="ems-table-wrap">
      <table className="ems-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`}>
                  {cellIndex === 0 ? <span className="ems-td-name">{cell}</span> : badgeTone[cell] || String(cell).includes('pending') || String(cell).includes('blocked') ? <StatusPill>{cell}</StatusPill> : <span className="ems-td-muted">{cell}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabShell({ tabs }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((tab) => tab.id === active);

  return (
    <>
      <div className="ems-model-tabs" role="tablist" aria-label="Module views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`ems-model-tab ${active === tab.id ? 'ems-model-tab--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            <Icon name={tab.icon || 'fileText'} size={15} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ems-model-panel">{current.content}</div>
    </>
  );
}

function ScreenDeck({ items }) {
  return (
    <div className="ems-screen-grid">
      {items.map((item) => (
        <article className="ems-screen-card" key={item.title}>
          <span className="ems-screen-icon"><Icon name={item.icon || 'fileText'} size={18} /></span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Filters({ includeAge = false }) {
  return (
    <div className="ems-filter-grid">
      <Field label="College" options={colleges} />
      <Field label="Course" options={courses} />
      <Field label="Term" options={terms} />
      <Field label="Year" options={years} />
      <Field label="Region" options={regions} />
      {includeAge && <Field label="Age Group" options={['17-20', '21-25', '26+']} />}
      <Field label="Subject" options={['All Subjects', 'Anatomy', 'Pharmacology', 'Exercise Therapy']} />
      <button className="ems-btn-primary" type="button"><Icon name="filter" size={15} /> Apply Filters</button>
    </div>
  );
}

function ApprovalPanel({ title = 'Action Panel' }) {
  return (
    <div className="ems-action-panel">
      <div>
        <h3>{title}</h3>
        <p>Approve, reject, or send back with mandatory remarks. Digital signature confirmation is shown before final approval.</p>
      </div>
      <label className="ems-field">
        <span className="ems-label">Approval remarks</span>
        <textarea className="ems-input" rows="4" placeholder="Enter reason or approval note" />
      </label>
      <div className="ems-action-row ems-action-row--wrap">
        <button className="ems-btn-primary"><Icon name="checkCircle" size={15} /> Approve</button>
        <button className="ems-btn-ghost"><Icon name="refresh" size={15} /> Send Back</button>
        <button className="ems-btn-danger"><Icon name="x" size={15} /> Reject</button>
      </div>
    </div>
  );
}

function WorkflowCoverage({ modules }) {
  return (
    <div className="ems-dpr-grid">
      {modules.map((module) => (
        <article className="ems-dpr-card" key={module.dprSection || module.dprSource}>
          <strong>{module.dprSection || module.dprSource}</strong>
          <span>{module.requirements?.length || module.stages?.length || 0} modeled requirements</span>
          <p>{(module.requirements || module.stages || []).slice(0, 3).map((item) => item.title || item).join(' | ')}</p>
        </article>
      ))}
    </div>
  );
}

function Dashboard() {
  const stats = [
    ['Students', '312', '48 pending review', 'graduation'],
    ['Exam Schedules', '18', '3 awaiting verification', 'clipboard'],
    ['Marks Batches', '9', '2 change requests', 'table'],
    ['Workflow Tasks', '27', '5 urgent', 'activity'],
    ['Data Migration', '5', 'Staging workflows active', 'layers'],
  ];

  return (
    <div className="ems-section">
      <section className="ems-command-hero">
        <div>
          <span className="ems-command-eyebrow"><Icon name="activity" size={14} /> Academic administration console</span>
          <h1>Institutional academic operations dashboard</h1>
          <p>Monitor student registration, education records, verification workflows, examinations, attendance, marks processing, marksheet release, reports, administration controls, data migration, and public portal activity from one coordinated workspace.</p>
          <div className="ems-command-actions">
            <button className="ems-btn-primary"><Icon name="eye" size={15} /> Review Operations</button>
            <button className="ems-btn-ghost"><Icon name="download" size={15} /> Export Module Summary</button>
          </div>
        </div>
        <div className="ems-command-signal-grid">
          {stats.map(([label, value, sub, icon]) => (
            <div key={label} className="ems-command-signal">
              <span><Icon name={icon} size={16} /></span>
              <div><strong>{value}</strong><small>{label} - {sub}</small></div>
            </div>
          ))}
        </div>
      </section>

      <div className="ems-kpi-grid">
        {stats.map(([label, value, sub, icon]) => (
          <div key={label} className="ems-kpi-card">
            <div className="ems-kpi-icon"><Icon name={icon} size={22} /></div>
            <div className="ems-kpi-body">
              <div className="ems-kpi-value">{value}</div>
              <div className="ems-kpi-label">{label}</div>
              <div className="ems-kpi-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <ScreenDeck items={[
        { title: 'Student and education capture', icon: 'user', detail: 'Draft edit, CSV template upload, proof upload, profile review, and contact OTP/link verification.' },
        { title: 'Exam and attendance operations', icon: 'clipboard', detail: 'Course-term schedules, subject mappings, venue fields, warnings, approvals, and correction trail.' },
        { title: 'Marks and marksheet lifecycle', icon: 'award', detail: 'Marks configuration, entry grid, pass/fail calculation, change requests, PDF and DigiLocker status.' },
        { title: 'Administration, MIS and migration', icon: 'settings', detail: 'Users, roles, hierarchy, features, reports, audit, task queues, release authentication, and migration stages.' },
      ]} />

      <WorkflowCoverage modules={[studentModel, examinationModel, marksModel, adminModel, reportsModel, dataMigrationModel]} />
    </div>
  );
}

function StudentsModule() {
  return (
    <div className="ems-section">
      <SectionHeader
        title="Students Module"
        subtitle="Operational workspace for student profile, document proof, education details, and data verification."
        icon="graduation"
        action={<button className="ems-btn-primary"><Icon name="download" size={15} /> Download Excel Template</button>}
      />
      <TabShell tabs={[
        {
          id: 'draft',
          label: 'Student Draft',
          icon: 'edit',
          content: (
            <div className="ems-form-card">
              <div className="ems-form-grid">
                <Field label="Name" value="Kavitha R" required />
                <Field label="DOB" type="date" value="2004-08-12" required />
                <Field label="Email" type="email" value="kavitha@example.com" required />
                <Field label="Mobile" type="tel" value="9876543211" required />
                <Field label="Student ID" value="STU-1024" required />
                <Field label="Father's Name" value="Ramesh Kumar" />
                <Field label="Mother's Name" value="Latha R" />
                <Field label="Residence" value="Puducherry" />
                <Field label="State" options={['Puducherry', 'Tamil Nadu', 'Kerala']} />
                <Field label="PIN" value="605006" required />
              </div>
              <label className="ems-field">
                <span className="ems-label">Address</span>
                <textarea className="ems-input" rows="3" defaultValue="12 Student Street, Gorimedu, Puducherry" />
              </label>
              <div className="ems-action-row ems-action-row--wrap">
                <button className="ems-btn-primary"><Icon name="checkCircle" size={15} /> Save Draft</button>
                <button className="ems-btn-ghost"><Icon name="link" size={15} /> Send Verification Link</button>
                <button className="ems-btn-ghost"><Icon name="key" size={15} /> Start OTP Flow</button>
              </div>
            </div>
          ),
        },
        {
          id: 'proof',
          label: 'Proof Documents',
          icon: 'upload',
          content: (
            <div className="ems-two-col">
              <UploadBox title="Upload student ID proof" />
              <UploadBox title="Upload DOB proof" />
              <UploadBox title="Upload address proof" />
              <UploadBox title="Upload parent/guardian proof" />
            </div>
          ),
        },
        {
          id: 'education',
          label: 'Education Details',
          icon: 'book',
          content: (
            <div className="ems-stack">
              <div className="ems-form-card">
                <div className="ems-form-grid">
                  <Field label="Education Level" options={['Higher Secondary', 'Diploma', 'Degree']} required />
                  <Field label="Board / Exam" value="State Board" required />
                  <Field label="Institution" value="Government Higher Secondary School" required />
                  <Field label="Year of Passing" value="2022" required />
                  <Field label="Total Marks" value="600" required />
                  <Field label="Marks Obtained" value="516" required />
                  <Field label="Percentage / Grade" value="86%" required />
                  <Field label="Registration Number" value="TN-HSC-7781" required />
                  <Field label="Certificate Serial Number" value="CERT-10091" required />
                </div>
                <UploadBox title="Mandatory PDF for this education record" />
                <button className="ems-btn-primary"><Icon name="plus" size={15} /> Add Education Record</button>
              </div>
              <DataTable columns={['Level', 'Year', 'Total', 'Obtained', 'Percent', 'Registration No.', 'Certificate Serial', 'Document']} rows={educationRows} />
            </div>
          ),
        },
        {
          id: 'verify',
          label: 'Data Verification',
          icon: 'fileCheck',
          content: (
            <div className="ems-two-col ems-two-col--wide-left">
              <DataTable columns={['Student', 'College', 'Course', 'Term', 'Status', 'Registration No.']} rows={students.map((s) => [s.name, s.college, s.course, s.term, s.status, s.registrationNo])} />
              <ApprovalPanel title="Checker Review and Registration Approval" />
              <div className="ems-sign-card">
                <Icon name="shield" size={24} />
                <strong>Digital signature confirmation</strong>
                <p>Final approval displays unique registration number: MTP-2026-00083.</p>
                <button className="ems-btn-primary"><Icon name="checkSquare" size={15} /> Confirm DSC</button>
              </div>
            </div>
          ),
        },
      ]} />
    </div>
  );
}

function ExaminationsModule() {
  return (
    <div className="ems-section">
      <SectionHeader title="Examination Module" subtitle="Subject mapping, exam schedule creation, approval, student search, and attendance correction workflows." icon="clipboard" />
      <TabShell tabs={[
        {
          id: 'subjects',
          label: 'Subjects',
          icon: 'book',
          content: (
            <div className="ems-stack">
              <div className="ems-form-card">
                <div className="ems-form-grid">
                  <Field label="Course" options={courses} />
                  <Field label="Term" options={terms} />
                  <Field label="Subject" value="Anatomy" />
                  <Field label="Mapping Type" options={['Core', 'Elective']} />
                  <Field label="Effective Start Date" type="date" value="2026-06-01" />
                  <Field label="Effective End Date" type="date" value="2026-12-31" />
                </div>
                <div className="ems-action-row ems-action-row--wrap">
                  <button className="ems-btn-primary"><Icon name="plus" size={15} /> Add Mapping</button>
                  <button className="ems-btn-ghost"><Icon name="trash" size={15} /> Remove Mapping</button>
                </div>
              </div>
              <DataTable columns={['Course', 'Term', 'Subject', 'Type', 'Start', 'End']} rows={subjectRows} />
            </div>
          ),
        },
        {
          id: 'schedule',
          label: 'Schedule',
          icon: 'clipboard',
          content: (
            <div className="ems-stack">
              <div className="ems-form-card">
                <div className="ems-form-grid">
                  <Field label="Course" options={courses} />
                  <Field label="Term" options={terms} />
                  <Field label="Exam Type" options={['Mid-term', 'End-term']} />
                  <Field label="Subject" options={['Anatomy', 'Pharmacology', 'Exercise Therapy']} />
                  <Field label="Exam Date" type="date" value="2026-07-13" />
                  <Field label="Time" type="time" value="10:00" />
                  <Field label="Venue" value="Hall A" />
                </div>
                <div className="ems-warning-strip"><Icon name="alertTriangle" size={16} /> Holiday and weekend warning appears here before submission.</div>
              </div>
              <DataTable columns={['Course', 'Term', 'Subject', 'Date', 'Time', 'Venue', 'Status']} rows={scheduleRows} />
            </div>
          ),
        },
        {
          id: 'attendance',
          label: 'Attendance',
          icon: 'checkSquare',
          content: (
            <div className="ems-stack">
              <div className="ems-two-col">
                <div className="ems-form-card">
                  <div className="ems-form-grid">
                    <Field label="Registration Number" value="MTP-2026-00082" />
                    <Field label="Subject" value="Anatomy" />
                    <Field label="Attendance" options={['Present', 'Absent']} />
                    <Field label="Permission Check" options={['Checker allowed', 'Approver override required']} />
                  </div>
                  <button className="ems-btn-primary"><Icon name="checkCircle" size={15} /> Mark Attendance</button>
                </div>
                <UploadBox title="Upload PDF attendance sheet" />
              </div>
              <DataTable columns={['Reg. No.', 'Student', 'Subject', 'Attendance', 'PDF Sheet', 'Audit Trail']} rows={attendanceRows} />
            </div>
          ),
        },
        {
          id: 'studentSchedule',
          label: 'Student Search',
          icon: 'search',
          content: <StudentPortal compact />,
        },
      ]} />
    </div>
  );
}

function MarksModule() {
  return (
    <div className="ems-section">
      <SectionHeader title="Marks Module" subtitle="Marks configuration, entry workflow, approval, change request, marksheet generation, and DigiLocker publishing status." icon="award" />
      <TabShell tabs={[
        {
          id: 'config',
          label: 'Marks Config',
          icon: 'settings',
          content: (
            <div className="ems-two-col ems-two-col--wide-left">
              <div className="ems-form-card">
                <div className="ems-form-grid">
                  <Field label="Course" options={courses} />
                  <Field label="Term" options={terms} />
                  <Field label="Subject" options={['Anatomy', 'Pharmacology', 'Exercise Therapy']} />
                  <Field label="Total Marks" value="100" />
                  <Field label="Pass Marks" value="50" />
                  <Field label="Internal Marks" value="40" />
                  <Field label="External Marks" value="60" />
                  <Field label="Division-wise Criteria" options={['Standard', 'Theory/practical split', 'Grace rule']} />
                  <Field label="Effective Start Date" type="date" value="2026-06-01" />
                </div>
              </div>
              <ApprovalPanel title="Approval Workflow for Marks Configuration" />
            </div>
          ),
        },
        {
          id: 'entry',
          label: 'Marks Entry',
          icon: 'table',
          content: (
            <div className="ems-stack">
              <div className="ems-form-card">
                <div className="ems-form-grid">
                  <Field label="Course" options={courses} />
                  <Field label="Term" options={terms} />
                  <Field label="Subject" options={['Anatomy', 'Pharmacology', 'Exercise Therapy']} />
                  <Field label="Exam" options={['Mid-term', 'End-term']} />
                </div>
                <div className="ems-warning-strip"><Icon name="lock" size={16} /> Absent students are blocked from marks entry until attendance is corrected.</div>
              </div>
              <DataTable columns={['Reg. No.', 'Student', 'Subject', 'Marks Split', 'Total', 'Result', 'Workflow']} rows={marksRows} />
              <ApprovalPanel title="Verify and Approve Marks Batch" />
            </div>
          ),
        },
        {
          id: 'change',
          label: 'Change Request',
          icon: 'refresh',
          content: (
            <div className="ems-form-card">
              <div className="ems-form-grid">
                <Field label="Approved Marks Reference" value="MRK-2026-091" />
                <Field label="Student Registration No." value="MTP-2026-00082" />
                <Field label="Existing Marks" value="93" />
                <Field label="Requested Marks" value="95" />
              </div>
              <label className="ems-field">
                <span className="ems-label">Change reason</span>
                <textarea className="ems-input" rows="4" placeholder="Explain correction and attach audit evidence" />
              </label>
              <UploadBox title="Upload correction proof PDF" />
            </div>
          ),
        },
        {
          id: 'marksheet',
          label: 'Marksheet',
          icon: 'fileText',
          content: (
            <div className="ems-stack">
              <div className="ems-mark-preview">
                <div>
                  <span>Preview Marksheet</span>
                  <h3>Mother Theresa Post Graduate and Research Institute of Health Sciences</h3>
                  <p>Student: Mohan Das - Registration No: MTP-2026-00082 - Reference: MS-2026-00082</p>
                </div>
                <div className="ems-action-row ems-action-row--wrap">
                  <button className="ems-btn-primary"><Icon name="download" size={15} /> Download PDF</button>
                  <button className="ems-btn-ghost"><Icon name="shield" size={15} /> Embed DSC</button>
                  <button className="ems-btn-ghost"><Icon name="link" size={15} /> Publish DigiLocker</button>
                </div>
              </div>
              <DataTable columns={['Registration No.', 'Marksheet Ref.', 'Status', 'Digital Signature', 'DigiLocker']} rows={marksheetRows} />
            </div>
          ),
        },
      ]} />
    </div>
  );
}

function AdministrationModule() {
  return (
    <div className="ems-section">
      <SectionHeader title="Administration Module" subtitle="User lifecycle, role management, hierarchy mapping, workflow visualization, and feature release controls." icon="settings" />
      <TabShell tabs={[
        {
          id: 'users',
          label: 'Users',
          icon: 'users',
          content: (
            <div className="ems-stack">
              <div className="ems-action-row ems-action-row--wrap">
                <button className="ems-btn-primary"><Icon name="plus" size={15} /> Create User</button>
                <button className="ems-btn-ghost"><Icon name="upload" size={15} /> Bulk User Upload</button>
                <button className="ems-btn-ghost"><Icon name="refresh" size={15} /> Reactivate</button>
                <button className="ems-btn-ghost"><Icon name="mail" size={15} /> Update Mobile/Email</button>
              </div>
              <DataTable columns={['User', 'Designation', 'Office', 'Role', 'Status']} rows={userRows} />
            </div>
          ),
        },
        {
          id: 'roles',
          label: 'Roles',
          icon: 'shield',
          content: (
            <div className="ems-stack">
              <ScreenDeck items={[
                { title: 'Assign admin roles', icon: 'shield', detail: 'Super Admin and Board Admin role assignment with critical monitoring.' },
                { title: 'Assign staff roles', icon: 'users', detail: 'Maker, Checker, Approver, and official roles scoped to office and college.' },
                { title: 'Assign feature roles', icon: 'flag', detail: 'Feature-level access controls for release, reports, marks, and verification.' },
                { title: 'Assign report roles', icon: 'barChart', detail: 'Report viewer/export permissions by organization and region.' },
              ]} />
              <DataTable columns={['Role', 'Scope', 'Monitoring', 'Control']} rows={roleRows} />
            </div>
          ),
        },
        {
          id: 'hierarchy',
          label: 'Hierarchy',
          icon: 'gitBranch',
          content: (
            <div className="ems-stack">
              <div className="hierarchy-flow">
                {['Office', 'College', 'Board', 'DSC Signatory'].map((step, index) => (
                  <div key={step} className="hierarchy-step"><span>{index + 1}</span><strong>{step}</strong></div>
                ))}
              </div>
              <DataTable columns={['Office', 'Organization', 'Maker', 'Checker', 'Approver', 'Removal Check']} rows={hierarchyRows} />
            </div>
          ),
        },
        {
          id: 'features',
          label: 'Features',
          icon: 'flag',
          content: (
            <div className="ems-stack">
              <DataTable columns={['Feature', 'Status', 'Module', 'Workflow']} rows={featureRows} />
              <div className="ems-sign-card">
                <Icon name="key" size={24} />
                <strong>Super Admin authentication before release</strong>
                <p>Critical feature release requires password plus OTP confirmation before publishing.</p>
                <button className="ems-btn-primary"><Icon name="lock" size={15} /> Authenticate Release</button>
              </div>
            </div>
          ),
        },
      ]} />
    </div>
  );
}

function ReportsModule() {
  return (
    <div className="ems-section">
      <SectionHeader title="MIS and Reports" subtitle="Student, examination, and marks reports with filters, summary cards, charts, export, and print controls." icon="barChart" />
      <div className="ems-stack">
        <Filters includeAge />
        <div className="ems-report-cards">
          {[
            ['Registered Students', '312', '+48 this month'],
            ['Approved Marksheets', '128', '22 DigiLocker queued'],
            ['Exam Schedules', '18', '3 pending approval'],
            ['Absent Blocks', '11', 'Marks entry restricted'],
          ].map(([label, value, sub]) => (
            <div key={label} className="ems-report-card"><strong>{value}</strong><span>{label}</span><small>{sub}</small></div>
          ))}
        </div>
        <div className="ems-chart-row">
          <div style={{ height: '72%' }} /><div style={{ height: '44%' }} /><div style={{ height: '88%' }} /><div style={{ height: '60%' }} /><div style={{ height: '35%' }} /><div style={{ height: '70%' }} />
        </div>
        <div className="ems-action-row ems-action-row--wrap">
          <button className="ems-btn-primary"><Icon name="download" size={15} /> Export Excel</button>
          <button className="ems-btn-ghost"><Icon name="fileText" size={15} /> Export PDF</button>
          <button className="ems-btn-ghost"><Icon name="table" size={15} /> Print</button>
        </div>
        <DataTable columns={['Report', 'Filters', 'Visuals', 'Actions']} rows={reportRows} />
      </div>
    </div>
  );
}

function StudentPortal({ compact = false }) {
  return (
    <div className={compact ? 'ems-stack' : 'ems-section'}>
      {!compact && <SectionHeader title="Student Public Portal" subtitle="Mobile-friendly student pages for schedule search, marksheet download, DigiLocker status, and reference search." icon="search" />}
      <div className="ems-public-shell">
        <div className="ems-public-search">
          <h3>Search Student Services</h3>
          <p>Find examination schedules and marksheets using registration number or reference number.</p>
          <div className="ems-form-grid">
            <Field label="College" options={colleges} />
            <Field label="Course" options={courses} />
            <Field label="Term" options={terms} />
            <Field label="Registration / Reference Number" value="MTP-2026-00082" />
          </div>
          <div className="ems-action-row ems-action-row--wrap">
            <button className="ems-btn-primary"><Icon name="search" size={15} /> Search</button>
            <button className="ems-btn-ghost"><Icon name="download" size={15} /> Download Schedule</button>
            <button className="ems-btn-ghost"><Icon name="fileText" size={15} /> Download Marksheet</button>
          </div>
        </div>
        <div className="ems-public-status">
          <StatusPill>Ready</StatusPill>
          <strong>Marksheet reference MS-2026-00082</strong>
          <p>Digital signature embedded. DigiLocker publishing queued. Students can follow guidance/status from this page.</p>
        </div>
      </div>
    </div>
  );
}

function WorkflowTasks() {
  return (
    <div className="ems-section">
      <SectionHeader title="Workflow Tasks" subtitle="Checker, approver, send-back, bulk approval, DSC confirmation, and SLA monitoring views." icon="activity" />
      <div className="ems-stack">
        <div className="hierarchy-flow">
          {workflowModel.stages.map((step, index) => (
            <div key={step} className="hierarchy-step"><span>{index + 1}</span><strong>{step}</strong></div>
          ))}
        </div>
        <DataTable columns={['Task', 'Entity', 'Assigned Role', 'SLA', 'Status']} rows={workflowRows} />
        <div className="ems-two-col ems-two-col--wide-left">
          <ApprovalPanel title="Bulk Approval Action Panel" />
          <div className="ems-sign-card">
            <Icon name="shield" size={24} />
            <strong>Digital signature confirmation screen</strong>
            <p>Approver must confirm DSC before registration number, marks approval, or marksheet PDF release.</p>
            <button className="ems-btn-primary"><Icon name="checkSquare" size={15} /> Confirm and Sign</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataMigration() {
  return (
    <div className="ems-section">
      <SectionHeader
        title="Data Migration Model"
        subtitle="Workflow 4.6 model for metadata consolidation, data cleaning, staging import, and table-wise integration audit."
        icon="layers"
      />
      <div className="ems-stack">
        <ScreenDeck items={dataMigrationModel.stages.map((stage, index) => ({
          title: `Stage ${index + 1}`,
          icon: index < 2 ? 'table' : index === 2 ? 'refresh' : 'fileCheck',
          detail: stage,
        }))} />
        <DataTable columns={['Stage', 'Scope', 'Status', 'Audit / Effort']} rows={migrationRows} />
        <div className="ems-warning-strip">
          <Icon name="alertTriangle" size={16} />
          Imported data is modeled as a separate staging schema before integration into the main EMS database, matching the institutional audit requirement.
        </div>
      </div>
    </div>
  );
}

function AuditTrail() {
  return (
    <div className="ems-section">
      <SectionHeader title="Audit Trail" subtitle="Immutable activity record for profile edits, document review, attendance corrections, marks changes, and release events." icon="activity" action={<button className="ems-btn-ghost"><Icon name="download" size={15} /> Export Audit</button>} />
      <DataTable columns={['Time', 'User', 'Action', 'Entity', 'Severity']} rows={auditRows} />
    </div>
  );
}

function Configuration() {
  return (
    <div className="ems-section">
      <SectionHeader title="Configuration and Validation" subtitle="Central control area for feature toggles, task workflows, release checks, and form validation rules." icon="settings" />
      <div className="ems-two-col ems-two-col--wide-left">
        <div className="ems-stack">
          <DataTable columns={['Feature', 'Status', 'Module', 'Workflow']} rows={featureRows} />
          <ScreenDeck items={[
            { title: 'Configure task workflow', icon: 'gitBranch', detail: 'Define maker-checker-approver stages per module and task type.' },
            { title: 'Release new feature', icon: 'flag', detail: 'Feature release stays locked until Super Admin authentication is complete.' },
            { title: 'Notification requirements', icon: 'bell', detail: 'SMS, email, and portal alert requirements are visible as pending governance clarifications.' },
          ]} />
        </div>
        <div className="ems-validation-list">
          <h3>Validation coverage</h3>
          {validationRules.map((rule) => (
            <div key={rule}><Icon name="checkCircle" size={14} /><span>{rule}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'barChart', section: 'Overview' },
  { id: 'students', label: 'Students', icon: 'graduation', section: 'Modules' },
  { id: 'exams', label: 'Examinations', icon: 'clipboard' },
  { id: 'marks', label: 'Marks', icon: 'award' },
  { id: 'reports', label: 'Reports', icon: 'barChart' },
  { id: 'migration', label: 'Data Migration', icon: 'layers' },
  { id: 'administration', label: 'Administration', icon: 'settings', section: 'Admin' },
  { id: 'workflow', label: 'Workflow Tasks', icon: 'activity' },
  { id: 'audit', label: 'Audit Trail', icon: 'fileCheck' },
  { id: 'configuration', label: 'Configuration', icon: 'flag' },
  { id: 'publicPortal', label: 'Public Portal', icon: 'search', section: 'Student Portal' },
];

export default function AdminDashboard({ user, onLogout }) {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const current = useMemo(() => NAV.find((item) => item.id === active), [active]);

  const views = {
    dashboard: <Dashboard />,
    students: <StudentsModule />,
    exams: <ExaminationsModule />,
    marks: <MarksModule />,
    reports: <ReportsModule />,
    migration: <DataMigration />,
    administration: <AdministrationModule />,
    workflow: <WorkflowTasks />,
    audit: <AuditTrail />,
    configuration: <Configuration />,
    publicPortal: <StudentPortal />,
  };

  let lastSection = '';

  return (
    <div className="ems-shell">
      <aside className={`ems-sidebar ${sidebarOpen ? 'ems-sidebar--open' : ''}`}>
        <div className="ems-sidebar-brand">
          <div className="ems-sidebar-logo"><Icon name="graduation" size={20} /></div>
          <div>
            <div className="ems-sidebar-name">MTPG&amp;RIHS</div>
            <div className="ems-sidebar-sub">Academic Operations</div>
          </div>
        </div>

        <div className="ems-sidebar-user">
          <div className="ems-avatar ems-avatar--sm">{(user?.name || 'A').charAt(0)}</div>
          <div>
            <div className="ems-sidebar-uname">{user?.name || 'Admin'}</div>
            <div className="ems-sidebar-urole">Operations Admin</div>
          </div>
        </div>

        <nav className="ems-sidebar-nav">
          {NAV.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (showSection) lastSection = item.section;
            return (
              <React.Fragment key={item.id}>
                {showSection && <div className="ems-sidebar-section">{item.section}</div>}
                <button
                  className={`ems-sidebar-item ${active === item.id ? 'ems-sidebar-item--active' : ''}`}
                  onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                >
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                  {item.id === 'workflow' && <span className="ems-sidebar-badge">27</span>}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <button className="ems-sidebar-logout" onClick={onLogout}>
          <Icon name="logout" size={16} /> Sign Out
        </button>
      </aside>

      {sidebarOpen && <div className="ems-overlay-backdrop" onClick={() => setSidebarOpen(false)} />}

      <div className="ems-main">
        <header className="ems-topbar">
          <button className="ems-hamburger" onClick={() => setSidebarOpen((open) => !open)}><Icon name="moreVertical" size={20} /></button>
          <div className="ems-topbar-breadcrumb">
            <span className="ems-topbar-root">Admin</span>
            <Icon name="chevronRight" size={14} />
            <span>{current?.label}</span>
          </div>
          <div className="ems-topbar-right">
            <span className="ems-sys-status"><span className="ems-status-dot" style={{ background: '#10B981', boxShadow: '0 0 6px #10B98188' }} /> System online</span>
            <button className="ems-icon-btn" title="Notifications"><Icon name="bell" size={18} /></button>
          </div>
        </header>

        <main className="ems-content">{views[active]}</main>
      </div>
    </div>
  );
}
