import React from 'react';
import { Card, DataTable, PageHeader, UploadControl, ValidatedForm } from '../../components/ui';
import { auditTrail, migrationStages } from '../../data/mockData';

const metadataFields = [
  { label: 'Source Database / Schema', name: 'sourceDb', required: true },
  { label: 'Table / Entity Name', name: 'tableName', required: true },
  { label: 'Validation / Constraint Summary', name: 'constraints', required: true },
];

const cleaningFields = [
  { label: 'Cleaning Batch ID', name: 'batchId', required: true },
  { label: 'Data Issue Type', name: 'issueType', options: ['Invalid data', 'Incomplete data', 'Duplicate data'], required: true },
  { label: 'Cleaning Action', name: 'action', required: true },
];

const importFields = [
  { label: 'Import Batch ID', name: 'importBatch', required: true },
  { label: 'Target Staging Table', name: 'stagingTable', required: true },
  { label: 'Relationship Check', name: 'relationshipCheck', options: ['Passed', 'Pending', 'Failed'], required: true },
];

const integrationFields = [
  { label: 'Main Database Table', name: 'mainTable', required: true },
  { label: 'Verification Result', name: 'verificationResult', options: ['Matched', 'Mismatch', 'Pending'], required: true },
  { label: 'Audit Log Reference', name: 'auditRef', required: true },
];

export default function MigrationModule() {
  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Data Migration Module"
        description="Workflow 4.6 / 4.7: metadata consolidation, data cleaning, data import, data integration, and migration audit/status screens."
      />

      <div className="ems-module-grid ems-module-grid--four">
        {[
          ['Metadata Consolidation', 'Existing database structures, constraints, and validations consolidated for import table creation.'],
          ['Data Cleaning', 'Invalid/incomplete records and duplicate data are tracked with trail.'],
          ['Data Import', 'Clean data imported into a separate staging schema with constraints and relations preserved.'],
          ['Data Integration', 'Imported data integrated into the main database table-by-table with documented results.'],
        ].map(([title, detail]) => (
          <Card key={title} title={title} icon="layers">
            <p className="ems-card-copy">{detail}</p>
          </Card>
        ))}
      </div>

      <Card title="Metadata Consolidation" subtitle="Study existing database structure, extract validations and constraints, and prepare consolidated metadata." icon="layers">
        <ValidatedForm fields={metadataFields} submitLabel="Save Metadata Mapping" />
        <DataTable columns={['Source Table', 'Validation / Constraint', 'Prepared Metadata', 'Status']} rows={[
          ['student_master', 'Student ID unique, email/mobile required', 'Student_Profile_Metadata_v1', 'Prepared'],
          ['education_details', 'Marks <= total marks, certificate serial required', 'Education_Metadata_v1', 'Verified'],
          ['exam_subjects', 'Course-term-subject mapping required', 'Exam_Metadata_v1', 'Draft'],
        ]} statusColumn={3} />
      </Card>

      <Card title="Data Cleaning" subtitle="Remove invalid/incomplete data and duplicate data while maintaining a cleaning audit trail." icon="filter">
        <ValidatedForm fields={cleaningFields} submitLabel="Record Cleaning Action" />
        <DataTable columns={['Issue Type', 'Records Found', 'Cleaning Action', 'Audit Status']} rows={[
          ['Invalid data', '36', 'Format corrected or rejected', 'Audited'],
          ['Incomplete data', '18', 'Sent for source correction', 'Pending'],
          ['Duplicate data', '12', 'Merged after ID verification', 'Audited'],
        ]} statusColumn={3} />
      </Card>

      <Card title="Data Import" subtitle="Import cleaned data into a separate migration schema while maintaining table relationships." icon="upload">
        <div className="ems-two-column">
          <ValidatedForm fields={importFields} submitLabel="Import to Staging Schema" />
          <UploadControl title="Cleaned Data Audit Bundle" detail="Upload staging import evidence bundle in supported document format" />
        </div>
        <DataTable columns={['Staging Schema', 'Relationship Rule', 'Import Status', 'Batch']} rows={[
          ['migration.student_master', 'Student to education one-to-many preserved', 'Submitted', 'IMP-2026-04'],
          ['migration.exam_subjects', 'Course-term-subject mapping preserved', 'Verified', 'IMP-2026-05'],
        ]} statusColumn={2} />
      </Card>

      <Card title="Data Integration" subtitle="Integrate staged data into the main database with table-by-table verification and integration audit logs." icon="gitBranch">
        <ValidatedForm fields={integrationFields} submitLabel="Save Integration Verification" />
        <DataTable columns={['Main Table', 'Verification', 'Integration Audit Log', 'Status']} rows={[
          ['student_master', 'Record count matched', 'INT-AUD-2026-001', 'Verified'],
          ['education_details', 'Foreign keys reconciled', 'INT-AUD-2026-002', 'Submitted'],
          ['marksheets', 'Pending Board reconciliation', 'INT-AUD-2026-003', 'Draft'],
        ]} statusColumn={3} />
      </Card>

      <Card title="Migration Status" subtitle="Stage-wise migration tracking aligned to institutional data migration tasks." icon="activity">
        <DataTable columns={['Stage', 'Scope', 'Status', 'Audit / Result']} rows={migrationStages} statusColumn={2} />
      </Card>

      <Card title="Migration Audit Trail" subtitle="Data cleaning and integration results are documented for subsequent reference and audit." icon="fileCheck">
        <DataTable columns={['Time', 'User', 'Action', 'Entity', 'Status']} rows={auditTrail} statusColumn={4} />
      </Card>
    </div>
  );
}
