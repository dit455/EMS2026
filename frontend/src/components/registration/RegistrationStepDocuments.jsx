import React from 'react';
import { Icon } from '../../components';
import FileUpload from './FileUpload';

const documents = [
  ['Student name proof upload', 'identityProof', 'Verifies student name', false],
  ['DOB proof upload', 'dobProof', 'Verifies date of birth', false],
  ['Address proof upload', 'addressProof', 'Verifies address', false],
  ['Student ID proof upload', 'studentIdProof', 'Verifies generated Student ID', false],
  ['X education certificate PDF', 'xCertificatePdf', 'Mandatory PDF for X detail', true],
  ['XII education certificate PDF', 'xiiCertificatePdf', 'Mandatory PDF for XII detail', true],
  ['Other education certificate PDF', 'otherCertificatePdf', 'Mandatory PDF for Other qualification', true],
];

export default function RegistrationStepDocuments({ values, errors, onFileChange }) {
  return (
    <div className="mtpg-wizard-panel">
      <div className="mtpg-step-section-head">
        <div>
          <span>Document Upload</span>
          <h3>Proof and educational PDF verification</h3>
          <p>Upload student proof documents and mandatory PDFs for every education detail captured.</p>
        </div>
        <div className="mtpg-proof-targets" aria-label="Verification coverage">
          {['Student Name', 'DOB', 'Address', 'Student ID'].map((item) => (
            <span key={item}><Icon name="checkCircle" size={13} /> {item}</span>
          ))}
        </div>
      </div>

      <div className="mtpg-document-grid">
        {documents.map(([label, name, helperText, pdfOnly]) => (
          <FileUpload
            key={name}
            label={label}
            name={name}
            value={values[name]}
            error={errors[name]}
            onChange={onFileChange}
            accept={pdfOnly ? '.pdf,application/pdf' : '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'}
            allowedTypes={pdfOnly ? ['application/pdf'] : undefined}
            allowedExtensions={pdfOnly ? ['pdf'] : undefined}
            helperText={pdfOnly ? helperText : `${helperText}. PDF, JPG, PNG supported.`}
            buttonLabel={pdfOnly ? 'Upload PDF' : 'Choose Proof'}
            icon={pdfOnly ? 'fileText' : 'upload'}
            required
          />
        ))}
      </div>
    </div>
  );
}
