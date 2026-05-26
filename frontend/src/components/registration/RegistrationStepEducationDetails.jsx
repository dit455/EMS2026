import React from 'react';
import { Icon } from '../../components';
import FileUpload from './FileUpload';
import FormInput from './FormInput';

const fields = [
  ['Education level', 'educationLevel', 'text', 'graduation', ['X', 'XII', 'Other']],
  ['Major subjects', 'majorSubjects', 'text', 'book'],
  ['Board / Exam name', 'boardExamName', 'text', 'award'],
  ['School / College name', 'schoolCollegeName', 'text', 'building'],
  ['School / College address', 'schoolCollegeAddress', 'text', 'home'],
  ['Place', 'place', 'text', 'mapPin'],
  ['Pin code', 'pinCode', 'text', 'mapPin', undefined, 'numeric', 6],
  ['Year of passing', 'yearOfPassing', 'number', 'calendar'],
  ['Total marks', 'totalMarks', 'number', 'barChart'],
  ['Marks obtained', 'marksObtained', 'number', 'checkCircle'],
  ['Grade / Percentage', 'gradePercentage', 'text', 'trendingUp', undefined, 'decimal'],
  ['Student registration number', 'studentRegistrationNumber', 'text', 'key'],
  ['Certificate serial number', 'certificateSerialNumber', 'text', 'fileCheck'],
];

export default function RegistrationStepEducationDetails({
  values,
  errors,
  bulkFile,
  bulkError,
  onChange,
  onBulkFileChange,
  onDownloadTemplate,
}) {
  return (
    <div className="mtpg-wizard-panel">
      <div className="mtpg-step-section-head">
        <div>
          <span>Education Details</span>
          <h3>X / XII / Other qualification record</h3>
          <p>Capture board, school/college, marks, percentage, certificate serial number, and registration number.</p>
        </div>
        <button className="mtpg-lite-action" type="button" onClick={onDownloadTemplate}>
          <Icon name="download" size={15} /> Education Template
        </button>
      </div>

      <div className="mtpg-qualification-strip">
        {['X', 'XII', 'Other'].map((level) => (
          <span key={level} className={values.educationLevel === level ? 'is-active' : ''}>
            <Icon name={level === 'Other' ? 'graduation' : 'book'} size={14} />
            {level} Details
          </span>
        ))}
      </div>

      <div className="mtpg-wizard-grid">
        {fields.map(([label, name, type, icon, options, inputMode, maxLength]) => (
          <FormInput
            key={name}
            label={label}
            name={name}
            type={type || 'text'}
            options={options}
            icon={icon}
            inputMode={inputMode}
            maxLength={maxLength}
            helper={name === 'gradePercentage' && values.totalMarks && values.marksObtained ? 'Auto-calculated from total and obtained marks. You may adjust if needed.' : undefined}
            value={values[name] || ''}
            onChange={onChange}
            error={errors[name]}
            required
          />
        ))}
      </div>

      <div className="mtpg-bulk-upload-card mtpg-bulk-upload-card--education">
        <div>
          <span><Icon name="table" size={17} /></span>
          <div>
            <strong>Bulk Education Upload</strong>
            <p>Upload X, XII, and Other education rows through an Excel-compatible sheet.</p>
          </div>
        </div>
        <FileUpload
          label="Excel upload for bulk education details"
          name="educationExcel"
          value={bulkFile}
          error={bulkError}
          onChange={onBulkFileChange}
          accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          allowedTypes={['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
          allowedExtensions={['csv', 'xls', 'xlsx']}
          helperText="Allowed formats: CSV, XLS, XLSX"
          buttonLabel="Upload Education Excel"
          icon="upload"
        />
      </div>
    </div>
  );
}
