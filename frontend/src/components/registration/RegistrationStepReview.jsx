import React from 'react';
import { Icon } from '../../components';

function ReviewCard({ title, entries, onEdit }) {
  return (
    <article className="mtpg-review-card">
      <div>
        <h3>{title}</h3>
        <button type="button" onClick={onEdit}><Icon name="edit" size={15} /> Edit</button>
      </div>
      <dl>
        {entries.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt>{label}</dt>
            <dd>{value || 'Not provided'}</dd>
          </React.Fragment>
        ))}
      </dl>
    </article>
  );
}

export default function RegistrationStepReview({ data, declaration, error, onDeclarationChange, onEdit }) {
  const basicEntries = [
    ['Student name', data.basic.studentName],
    ['Date of birth', data.basic.dateOfBirth],
    ['Email ID', data.basic.email],
    ['Email verification', data.basic.emailVerified ? 'Verified by link' : 'Pending verification'],
    ['Mobile number', data.basic.mobile],
    ['Mobile verification', data.basic.mobileVerified ? 'Verified by link' : 'Pending verification'],
    ['Student ID', data.basic.studentId],
    ['Father name', data.basic.fatherName],
    ['Mother name', data.basic.motherName],
    ['Address', data.basic.address],
    ['Place of residence', data.basic.residence],
    ['State', data.basic.state],
    ['Pin code', data.basic.pinCode],
    ['Bulk student Excel', data.bulk?.studentExcel?.name],
  ];

  const educationEntries = [
    ['Education level', data.education.educationLevel],
    ['Major subjects', data.education.majorSubjects],
    ['Board / Exam name', data.education.boardExamName],
    ['School / College name', data.education.schoolCollegeName],
    ['School / College address', data.education.schoolCollegeAddress],
    ['Place', data.education.place],
    ['Pin code', data.education.pinCode],
    ['Year of passing', data.education.yearOfPassing],
    ['Total marks', data.education.totalMarks],
    ['Marks obtained', data.education.marksObtained],
    ['Grade / Percentage', data.education.gradePercentage],
    ['Student registration number', data.education.studentRegistrationNumber],
    ['Certificate serial number', data.education.certificateSerialNumber],
    ['Bulk education Excel', data.bulk?.educationExcel?.name],
  ];

  const documentEntries = Object.entries(data.documents).map(([key, file]) => [
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()),
    file?.name,
  ]);

  return (
    <div className="mtpg-wizard-panel">
      <div className="mtpg-step-section-head">
        <div>
          <span>Review & Confirm</span>
          <h3>Final validation before Maker submission</h3>
          <p>Check entered details, uploaded documents, verification state, and workflow rules before submitting.</p>
        </div>
      </div>

      <div className="mtpg-review-grid">
        <ReviewCard title="Basic Details" entries={basicEntries} onEdit={() => onEdit(0)} />
        <ReviewCard title="Education Details" entries={educationEntries} onEdit={() => onEdit(1)} />
        <ReviewCard title="Documents" entries={documentEntries} onEdit={() => onEdit(2)} />
      </div>

      <div className="mtpg-review-workflow-card">
        <div>
          <span><Icon name="gitBranch" size={17} /></span>
          <strong>Maker to Checker to Approver Workflow</strong>
        </div>
        <ul>
          <li>Board-level checker verifies student proof, DOB, address, Student ID, and education PDFs.</li>
          <li>Approver applies digital signature approval; editing is locked at approval stage.</li>
          <li>Reject and Send Back actions return records for college-level correction only.</li>
          <li>Bulk approval is available after records pass checker verification.</li>
        </ul>
      </div>

      <label className="mtpg-declaration">
        <input type="checkbox" checked={declaration} onChange={(event) => onDeclarationChange(event.target.checked)} />
        <span>I confirm that the entered details and uploaded documents are valid and correct, and I understand that approval-stage records are locked after Board digital signature.</span>
      </label>
      {error && <div className="mtpg-wizard-error">{error}</div>}
    </div>
  );
}
