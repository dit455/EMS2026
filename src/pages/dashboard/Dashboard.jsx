import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, DataTable, ModuleCard } from '../../components/ui';
import { Icon } from '../../components';
import { modules } from '../../data/referenceData';
import { downloadTextFile } from '../../utils/actions';

const pendingRows = [
  ['Student verification', 'Board Checker', '48 records', 'Submitted'],
  ['Education document review', 'Board Checker', '12 records', 'Verified'],
  ['Examination schedule approval', 'College Approver', '3 schedules', 'Submitted'],
  ['Marks batch approval', 'Board Approver', '5 batches', 'Submitted'],
  ['Data migration audit', 'Super Admin', '2 stages', 'Draft'],
];

const statistics = [
  ['4,820', 'Registered Students', 'Student records captured and verified', 'graduation'],
  ['148', 'Pending Verifications', 'Awaiting checker or approver action', 'shield'],
  ['36', 'Exam Schedules', 'Published and draft schedules', 'calendar'],
  ['3,986', 'Marksheets', 'Generated and ready for release', 'award'],
];

const dashboardSignals = [
  ['Maker queue', '64', 'New submissions today', 'edit'],
  ['Checker queue', '48', 'Student records awaiting review', 'fileCheck'],
  ['Approver queue', '17', 'DSC confirmation required', 'shield'],
  ['SLA alerts', '5', 'High priority workflow tasks', 'activity'],
];

const commandCards = [
  ['Student intake', 'Registrations, documents, and education proof checks are active.', 'Live', 'graduation', '/student-module'],
  ['Exam operations', 'Schedules, attendance PDFs, and correction trails are monitored.', '36 schedules', 'clipboard', '/examination'],
  ['Marks release', 'Marksheets, digital signatures, and publishing queues are visible.', '3,986 ready', 'award', '/marks'],
];

const integrationRows = [
  ['DigiLocker Integration', 'Marksheets and student documents queued for digital publishing.', 'Configured'],
  ['Audit Trails', 'Login, approval, rejection, correction, and release actions are traceable.', 'Active'],
  ['Statistics', 'Dashboard counters summarize student, examination, marks, and approval work.', 'Live'],
];

const coverageRows = [
  ['Student Module', 'Basic details, documents, education, workflow, unique registration number', 'Ready', '/student-module'],
  ['Examination Module', 'Subjects, timetable, schedule download, attendance audit', 'Ready', '/examination'],
  ['Marks Module', 'Marks setup, entry, correction, marksheet, DigiLocker', 'Ready', '/marks'],
  ['Admin Module', 'Users, roles, hierarchy, activation, feature configuration', 'Ready', '/admin-module'],
  ['MIS Module', 'Student, examination, and marks reports with exports', 'Ready', '/mis'],
  ['Data Migration Module', 'Metadata, cleaning, import, integration, audit logs', 'Ready', '/migration'],
];

export default function Dashboard() {
  const navigate = useNavigate();

  const exportSummary = () => {
    downloadTextFile(
      'MTPG_RIHS_Admin_Dashboard_Summary.txt',
      [
        'MTPG & RIHS Administrative Dashboard Summary',
        '',
        ...statistics.map(([value, label, detail]) => `${label}: ${value} - ${detail}`),
        '',
        ...pendingRows.map(([task, role, volume, status]) => `${task}, ${role}, ${volume}, ${status}`),
      ].join('\n'),
    );
  };

  return (
    <div className="ems-page-stack">
      <section className="admin-dashboard-hero">
        <div className="admin-dashboard-hero__copy">
          <span><Icon name="shield" size={14} /> Academic administration console</span>
          <h1>MTPG & RIHS Administrative Dashboard</h1>
          <p>
            An institutional command view for student enrolment, verification, examinations, marks processing, administration controls, reports, and data migration.
          </p>
          <div className="admin-dashboard-hero__actions">
            <button className="ems-btn ems-btn-primary" type="button" onClick={() => navigate('/admin-module')}><Icon name="activity" size={15} /> Review Operations</button>
            <button className="ems-btn ems-btn-secondary" type="button" onClick={exportSummary}><Icon name="download" size={15} /> Export Summary</button>
          </div>
        </div>
        <div className="admin-dashboard-hero__panel" aria-label="Administrative workflow signal summary">
          {dashboardSignals.map(([label, value, detail, icon]) => (
            <article key={label}>
              <span><Icon name={icon} size={16} /></span>
              <div>
                <strong>{value}</strong>
                <small>{label}</small>
                <p>{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="admin-dashboard-command-grid">
        {commandCards.map(([title, detail, status, icon, path]) => (
          <button key={title} className="admin-dashboard-command-card" type="button" onClick={() => navigate(path)}>
            <span><Icon name={icon} size={18} /></span>
            <div>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
            <small>{status}</small>
          </button>
        ))}
      </div>

      <div className="ems-stat-grid">
        {statistics.map(([value, label, detail, icon]) => (
          <article className="ems-stat-card" key={label}>
            <span className="ems-stat-icon"><Icon name={icon} size={21} /></span>
            <strong>{value}</strong>
            <span>{label}</span>
            <p>{detail}</p>
          </article>
        ))}
      </div>

      <Card title="Institutional Module Workspace" subtitle="Operational modules use the same workflow language as the public home page: register, verify, approve, publish, and audit." icon="layers">
        <div className="ems-module-grid">
          {modules.map((module) => <ModuleCard key={module.id} module={module} />)}
        </div>
      </Card>

      <Card title="Module Requirement Coverage" subtitle="A user-friendly readiness map for all EMS modules with direct navigation to each operational workspace." icon="checkSquare">
        <div className="ems-table-shell">
          <table className="ems-data-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              {coverageRows.map(([module, coverage, status, path]) => (
                <tr key={module}>
                  <td>{module}</td>
                  <td>{coverage}</td>
                  <td><span className="ems-status ems-status--approved">{status}</span></td>
                  <td><button className="ems-table-action" type="button" onClick={() => navigate(path)}>Open Module</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Pending Tasks" subtitle="Consolidated task queue for maker-checker-approver workflows." icon="activity">
        <DataTable columns={['Task', 'Role', 'Volume', 'Status']} rows={pendingRows} statusColumn={3} />
      </Card>

      <Card title="Internal Controls" subtitle="Post-login systems available to authorized users only." icon="shield">
        <div className="ems-dashboard-control-grid">
          {integrationRows.map(([title, detail, status]) => (
            <article key={title}>
              <Icon name={title === 'DigiLocker Integration' ? 'link' : title === 'Audit Trails' ? 'activity' : 'barChart'} size={20} />
              <strong>{title}</strong>
              <p>{detail}</p>
              <span>{status}</span>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
