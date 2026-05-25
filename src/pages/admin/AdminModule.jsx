import React, { useState } from 'react';
import { ApprovalWorkflow, Card, DataTable, PageHeader, ValidatedForm } from '../../components/ui';
import { Icon } from '../../components';
import { colleges } from '../../data/referenceData';
import { featureRows, hierarchyRows, roleGroups } from '../../data/mockData';

const userFields = [
  { label: 'Name of Staff / Official', name: 'name', required: true },
  { label: 'Name of College / Board', name: 'office', options: [...colleges, 'Board of Medical Education', 'Board of Examination in Nursing'], required: true },
  { label: 'Designation', name: 'designation', required: true },
  { label: 'Mobile Number', name: 'mobile', required: true },
  { label: 'E-Mail ID', name: 'email', type: 'email', required: true },
  { label: 'Address', name: 'address', required: true },
  { label: 'Place', name: 'place', required: true },
  { label: 'Pin Code', name: 'pinCode', required: true },
];

const activationFields = [
  { label: 'User / Official', name: 'user', required: true },
  { label: 'Action', name: 'action', options: ['Suspend', 'Temporary Deactivate', 'Reactivate'], required: true },
  { label: 'Reason', name: 'reason', options: ['Resignation', 'Transfer', 'Superannuation', 'Suspension', 'Temporary Need'], required: true },
  { label: 'Effective Date', name: 'effectiveDate', type: 'date', required: true },
];

const roleAssignmentFields = [
  { label: 'User / Official', name: 'user', required: true },
  { label: 'Role Category', name: 'roleCategory', options: ['Admin Roles', 'Staff Roles', 'Feature Roles', 'Report Roles', 'Super Admin'], required: true },
  { label: 'Permission Set', name: 'permissionSet', options: ['Create / Edit', 'Verify / Approve', 'Reports View', 'Workflow Configuration', 'System Monitoring'], required: true },
];

const hierarchyFields = [
  { label: 'Office', name: 'office', options: [...colleges, 'Board of Medical Education', 'Board of Examination in Nursing'], required: true },
  { label: 'Maker Role', name: 'maker', required: true },
  { label: 'Checker Role', name: 'checker', required: true },
  { label: 'Approver Role', name: 'approver', required: true },
  { label: 'Pending Task Check', name: 'pendingTaskCheck', options: ['No pending tasks', 'Block removal if pending tasks exist'], required: true },
];

export default function AdminModule() {
  const [credentialMessage, setCredentialMessage] = useState('');

  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Admin Module"
        description="Workflow 4.4: user creation, OTP login, activation/deactivation, role management, hierarchy mapping, Super Admin dashboard, and feature configuration."
      />

      <Card title="Super Admin Dashboard" subtitle="Control centre for critical roles, feature releases, and workflow configuration monitoring." icon="shield">
        <div className="admin-module-command">
          <div>
            <span><Icon name="shield" size={14} /> Secure administration</span>
            <h2>Role, release, and hierarchy control in one place</h2>
            <p>Use the same institutional workflow model as the home page: clear status, visible ownership, OTP protected changes, and traceable approvals.</p>
          </div>
          <div className="admin-module-command__signals">
            {[
              ['OTP Login', 'Active', 'key'],
              ['Feature Release', '3 pending', 'flag'],
              ['Audit Trail', 'Enabled', 'activity'],
            ].map(([label, value, icon]) => (
              <article key={label}>
                <Icon name={icon} size={16} />
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="ems-stat-grid admin-module-stats">
          {[
            ['Active Users', '42'],
            ['Critical Roles', '8'],
            ['Enabled Features', '18'],
            ['Pending Releases', '3'],
          ].map(([label, value]) => (
            <div className="ems-stat-card" key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      </Card>

      <Card title="User Creation" subtitle="Create login credentials for college staff and board officials. Portal login uses OTP authentication." icon="users">
        <ValidatedForm fields={userFields} submitLabel="Create User" />
        <DataTable columns={['Credential Control', 'Purpose', 'Status']} rows={[
          ['Initial login credentials', 'Created after staff/official account approval', 'Enabled'],
          ['OTP authentication', 'Required for administrative sign-in and critical changes', 'Active'],
          ['Password reset / credential rotation', 'Handled through Super Admin monitored request', 'Available'],
        ]} statusColumn={2} />
        {credentialMessage && <div className="ems-action-message ems-gap-top">{credentialMessage}</div>}
        <div className="ems-action-row ems-gap-top">
          <span className="ems-helper-text">Change Mobile/Email workflow</span>
          <button className="ems-btn ems-btn-secondary" type="button" onClick={() => setCredentialMessage('Mobile change workflow opened for selected user.')}>Change Mobile Number</button>
          <button className="ems-btn ems-btn-secondary" type="button" onClick={() => setCredentialMessage('Email change workflow opened for selected user.')}>Change E-Mail ID</button>
        </div>
      </Card>

      <Card title="User Activation and Deactivation" subtitle="Deactivate users for resignation, suspension, superannuation, transfer, or temporary need." icon="userCheck">
        <ValidatedForm fields={activationFields} submitLabel="Submit User Status Change" />
        <DataTable columns={['User', 'Office', 'Role', 'Reason / Action', 'Status']} rows={[
          ['College Maker', colleges[0], 'Staff / Official Role', 'Temporary activation', 'Approved'],
          ['Board Checker', 'BOME', 'Staff / Official Role', 'Transfer to other work domain', 'Submitted'],
          ['Report Viewer', 'BOEN', 'Reports Role', 'Active user', 'Verified'],
        ]} statusColumn={4} />
      </Card>

      <Card title="Role Management" subtitle="Admin roles, staff or official roles, feature roles, report roles, and Super Admin monitoring." icon="key">
        <ValidatedForm fields={roleAssignmentFields} submitLabel="Assign Role and Permissions" />
        <DataTable columns={['Role Category', 'Permitted Activities', 'Example Role']} rows={roleGroups} />
        <DataTable columns={['Control Area', 'Covered Feature', 'Monitoring']} rows={[
          ['Permission management', 'Create/edit, verify/approve, report view, feature release', 'Super Admin'],
          ['Workflow control', 'Maker-checker-approver routing and send back rules', 'Admin'],
          ['System monitoring', 'Login activity, critical roles, release authentication', 'Super Admin'],
        ]} />
      </Card>

      <Card title="Office Hierarchy Mapping" subtitle="Map offices to higher officials for task movement across colleges and boards. Mapping is office-based, not individual-user based." icon="gitBranch">
        <ValidatedForm fields={hierarchyFields} submitLabel="Save Hierarchy Mapping" />
        <DataTable columns={['Office Type', 'Organization', 'Maker', 'Checker', 'Approver', 'Removal Check']} rows={hierarchyRows} />
        <div className="ems-gap-top">
          <ApprovalWorkflow title="Hierarchy Modification Check" />
        </div>
      </Card>

      <Card title="Feature Enable/Disable Configuration" subtitle="Super Admin can enable or disable task-level features and workflow configurations." icon="flag">
        <DataTable columns={['Feature', 'Status', 'Module', 'Workflow']} rows={featureRows} />
        <DataTable columns={['Configuration Type', 'Example', 'Release Rule']} rows={[
          ['Module toggle', 'Enable or disable Student, Exam, Marks, Admin, MIS, Migration features', 'Super Admin authentication'],
          ['Workflow configuration', 'Change maker/checker/approver route or task lock', 'Approval required'],
          ['New feature release control', 'Open new feature only after OTP re-authentication', 'Locked until authenticated'],
        ]} />
      </Card>

      <Card title="New Feature Release Authentication" subtitle="New releases must be authenticated by Super Admin before opening features for users." icon="lock">
        <ValidatedForm fields={[
          { label: 'Release Name', name: 'releaseName', required: true },
          { label: 'Feature Module', name: 'module', options: ['Student Module', 'Examination Module', 'Marks Module', 'Admin Module', 'MIS Module'], required: true },
          { label: 'Super Admin OTP', name: 'otp', required: true },
        ]} submitLabel="Authenticate Release" />
      </Card>
    </div>
  );
}
