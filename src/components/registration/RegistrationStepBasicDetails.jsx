import React from 'react';
import { Icon } from '../../components';
import FileUpload from './FileUpload';
import FormInput from './FormInput';

const personalFields = [
  ['Student name', 'studentName', 'text', 'user'],
  ['Date of birth', 'dateOfBirth', 'date', 'calendar'],
  ['Email ID', 'email', 'email', 'mail'],
  ['Mobile number', 'mobile', 'text', 'phone'],
  ['Father name', 'fatherName', 'text', 'users'],
  ['Mother name', 'motherName', 'text', 'users'],
];

const addressFields = [
  ['Address', 'address', 'text', 'home'],
  ['Place of residence', 'residence', 'text', 'building'],
  ['State', 'state', 'text', 'flag'],
  ['Pin code', 'pinCode', 'text', 'mapPin', undefined, 'numeric', 6],
];

export default function RegistrationStepBasicDetails({
  values,
  errors,
  bulkFile,
  bulkError,
  onChange,
  onVerify,
  onGenerateStudentId,
  onBulkFileChange,
  onDownloadTemplate,
}) {
  return (
    <div className="mtpg-wizard-panel">
      <div className="mtpg-step-section-head">
        <div>
          <span>Basic Details</span>
          <h3>Student identity and contact profile</h3>
          <p>Name, DOB, parent details, address, Student ID generation, and email/mobile verification links.</p>
        </div>
        <button className="mtpg-lite-action" type="button" onClick={onDownloadTemplate}>
          <Icon name="download" size={15} /> Excel Template
        </button>
      </div>

      <div className="mtpg-wizard-grid">
        {personalFields.map(([label, name, type, icon]) => (
          <FormInput
            key={name}
            label={label}
            name={name}
            type={type}
            icon={icon}
            value={values[name] || ''}
            onChange={onChange}
            error={errors[name]}
            required
          />
        ))}
      </div>

      <div className="mtpg-id-generation-card">
        <div>
          <span><Icon name="key" size={16} /></span>
          <div>
            <strong>Student ID Generation</strong>
            <p>Generate a college-level Student ID before document verification.</p>
          </div>
        </div>
        <FormInput
          label="Generated Student ID"
          name="studentId"
          value={values.studentId || ''}
          onChange={onChange}
          error={errors.studentId}
          placeholder="Generate Student ID"
          icon="key"
          readOnly
          required
        />
        <button type="button" onClick={onGenerateStudentId} disabled={!values.studentName}>
          <Icon name="sparkles" size={15} /> Generate ID
        </button>
      </div>

      <div className="mtpg-wizard-grid">
        {addressFields.map(([label, name, type, icon, options, inputMode, maxLength]) => (
          <FormInput
            key={name}
            label={label}
            name={name}
            type={type || 'text'}
            options={options}
            icon={icon}
            inputMode={inputMode}
            maxLength={maxLength}
            value={values[name] || ''}
            onChange={onChange}
            error={errors[name]}
            required
          />
        ))}
      </div>

      <div className="mtpg-verification-grid">
        {[
          ['email', 'Email verification link', values.email, values.emailVerified, errors.emailVerified, 'mail'],
          ['mobile', 'Mobile verification link', values.mobile, values.mobileVerified, errors.mobileVerified, 'phone'],
        ].map(([type, title, target, verified, error, icon]) => (
          <article key={type} className={`mtpg-verification-card ${verified ? 'is-verified' : ''}`}>
            <span><Icon name={icon} size={17} /></span>
            <div>
              <strong>{title}</strong>
              <p>{target || `Enter ${type} to generate verification link.`}</p>
              {error && <small>{error}</small>}
            </div>
            <button type="button" onClick={() => onVerify(type)} disabled={!target || verified}>
              {verified ? 'Verified' : 'Send Link'}
            </button>
          </article>
        ))}
      </div>

      <div className="mtpg-bulk-upload-card">
        <div>
          <span><Icon name="table" size={17} /></span>
          <div>
            <strong>Bulk Student Entry</strong>
            <p>Upload a CSV/XLS/XLSX sheet using the official student template for batch entry.</p>
          </div>
        </div>
        <FileUpload
          label="Excel upload for bulk student entry"
          name="studentExcel"
          value={bulkFile}
          error={bulkError}
          onChange={onBulkFileChange}
          accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          allowedTypes={['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
          allowedExtensions={['csv', 'xls', 'xlsx']}
          helperText="Allowed formats: CSV, XLS, XLSX"
          buttonLabel="Upload Excel"
          icon="upload"
        />
      </div>
    </div>
  );
}
