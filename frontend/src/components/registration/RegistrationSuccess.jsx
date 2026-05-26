import React from 'react';
import { Icon } from '../../components';
import Button from './Button';

export default function RegistrationSuccess({ result, onDownload, onPrint, onNewRegistration }) {
  return (
    <div className="mtpg-registration-success">
      <span><Icon name="checkCircle" size={28} /></span>
      <h2>Student Registration Submitted</h2>
      <p>Your application has been submitted successfully and will move for college/board verification.</p>
      <div className="mtpg-success-summary">
        <div>
          <strong>Application / Reference Number</strong>
          <span>{result.referenceNumber}</span>
        </div>
        <div>
          <strong>Unique Student Registration Number</strong>
          <span>{result.uniqueStudentRegistrationNumber}</span>
        </div>
        <div>
          <strong>Status</strong>
          <span>{result.status}</span>
        </div>
        <div>
          <strong>Next Step</strong>
          <span>{result.nextStep}</span>
        </div>
      </div>
      <div className="mtpg-wizard-actions">
        <Button tone="secondary" onClick={onDownload}><Icon name="download" size={16} /> Download Acknowledgement</Button>
        <Button tone="secondary" onClick={onPrint}><Icon name="fileText" size={16} /> Print Acknowledgement</Button>
        <Button onClick={onNewRegistration}><Icon name="plus" size={16} /> New Registration</Button>
      </div>
    </div>
  );
}
