import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components';
import { registrationService } from '../../services/mockApi';
import { downloadEducationTemplate, downloadStudentTemplate, downloadTextFile } from '../../utils/actions';
import Button from './Button';
import RegistrationStepBasicDetails from './RegistrationStepBasicDetails';
import RegistrationStepDocuments from './RegistrationStepDocuments';
import RegistrationStepEducationDetails from './RegistrationStepEducationDetails';
import RegistrationStepReview from './RegistrationStepReview';
import RegistrationSuccess from './RegistrationSuccess';
import Stepper from './Stepper';
import { currentYear, generateNumericCode } from '../../utils/id';

const steps = ['Basic Details', 'Education Details', 'Document Upload', 'Review & Confirm', 'Submission Success'];

const initialData = {
  basic: {
    studentName: '',
    dateOfBirth: '',
    email: '',
    mobile: '',
    studentId: '',
    fatherName: '',
    motherName: '',
    address: '',
    residence: '',
    state: '',
    pinCode: '',
    emailVerified: false,
    mobileVerified: false,
  },
  education: {
    educationLevel: '',
    majorSubjects: '',
    boardExamName: '',
    schoolCollegeName: '',
    schoolCollegeAddress: '',
    place: '',
    pinCode: '',
    yearOfPassing: '',
    totalMarks: '',
    marksObtained: '',
    gradePercentage: '',
    studentRegistrationNumber: '',
    certificateSerialNumber: '',
  },
  documents: {
    identityProof: null,
    dobProof: null,
    addressProof: null,
    studentIdProof: null,
    xCertificatePdf: null,
    xiiCertificatePdf: null,
    otherCertificatePdf: null,
  },
  bulk: {
    studentExcel: null,
    educationExcel: null,
  },
};

const requiredBasic = [
  'studentName',
  'dateOfBirth',
  'email',
  'mobile',
  'studentId',
  'fatherName',
  'motherName',
  'address',
  'residence',
  'state',
  'pinCode',
];
const requiredEducation = [
  'educationLevel',
  'majorSubjects',
  'boardExamName',
  'schoolCollegeName',
  'schoolCollegeAddress',
  'place',
  'pinCode',
  'yearOfPassing',
  'totalMarks',
  'marksObtained',
  'gradePercentage',
  'studentRegistrationNumber',
  'certificateSerialNumber',
];
const requiredDocuments = Object.keys(initialData.documents);

const workflowHighlights = [
  ['Maker', 'Student or college completes data entry and proof upload.', 'user'],
  ['Checker', 'Board verifies identity, education details, and mandatory PDFs.', 'fileCheck'],
  ['Approver', 'Digital signature approval locks the record and registration number.', 'shield'],
];

const requirementChecklist = [
  ['Basic details', 'Name, DOB, email/mobile, parents, address, PIN, Student ID, verification links.', 'user'],
  ['Bulk intake', 'Student and education Excel upload with downloadable templates.', 'table'],
  ['Documents', 'Student proof documents plus PDF education evidence for X, XII, and Other.', 'fileText'],
  ['Workflow', 'Maker, Checker, Approver, Board verification, reject/send back, bulk approval.', 'gitBranch'],
  ['Unique number', 'Auto-generated student registration number after submission.', 'key'],
];

const pinDirectory = {
  605006: { residence: 'Gorimedu', state: 'Puducherry' },
  605001: { residence: 'Puducherry Town', state: 'Puducherry' },
  605013: { residence: 'Lawspet', state: 'Puducherry' },
};

function validateRequired(values, fields) {
  return fields.reduce((errors, field) => {
    if (!String(values[field] || '').trim()) errors[field] = 'This field is required.';
    return errors;
  }, {});
}

function validateBasic(values) {
  const errors = validateRequired(values, requiredBasic);
  if (values.dateOfBirth) {
    const dateOfBirth = new Date(`${values.dateOfBirth}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(dateOfBirth.getTime())) {
      errors.dateOfBirth = 'Enter a valid date of birth.';
    } else if (dateOfBirth > today) {
      errors.dateOfBirth = 'Date of birth cannot be a future date.';
    }
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.mobile && !/^[6-9]\d{9}$/.test(values.mobile)) errors.mobile = 'Enter a valid 10 digit Indian mobile number.';
  if (values.pinCode && !/^\d{6}$/.test(values.pinCode)) errors.pinCode = 'Enter a valid 6 digit pin code.';
  if (values.email && !values.emailVerified) errors.emailVerified = 'Send and complete email verification link.';
  if (values.mobile && !values.mobileVerified) errors.mobileVerified = 'Send and complete mobile verification link.';
  return errors;
}

function validateEducation(values) {
  const errors = validateRequired(values, requiredEducation);
  if (values.pinCode && !/^\d{6}$/.test(values.pinCode)) errors.pinCode = 'Enter a valid 6 digit pin code.';
  if (values.yearOfPassing && !/^\d{4}$/.test(values.yearOfPassing)) errors.yearOfPassing = 'Enter a valid passing year.';
  if (values.totalMarks && Number(values.totalMarks) <= 0) errors.totalMarks = 'Total marks must be greater than zero.';
  if (values.marksObtained && Number(values.marksObtained) < 0) errors.marksObtained = 'Marks obtained cannot be negative.';
  if (values.totalMarks && values.marksObtained && Number(values.marksObtained) > Number(values.totalMarks)) {
    errors.marksObtained = 'Marks obtained cannot exceed total marks.';
  }
  if (values.gradePercentage && (Number(values.gradePercentage) < 0 || Number(values.gradePercentage) > 100)) {
    errors.gradePercentage = 'Percentage must be between 0 and 100.';
  }
  return errors;
}

function validateDocuments(values) {
  return requiredDocuments.reduce((errors, field) => {
    if (!values[field]?.name) errors[field] = 'Document upload is required.';
    return errors;
  }, {});
}

function acknowledgementText(result, data) {
  return [
    'MTPG & RIHS Student Registration Acknowledgement',
    '',
    `Application Reference Number: ${result.referenceNumber}`,
    `Unique Student Registration Number: ${result.uniqueStudentRegistrationNumber}`,
    `Status: ${result.status}`,
    `Next Step: ${result.nextStep}`,
    `Student Name: ${data.basic.studentName}`,
    `Student ID: ${data.basic.studentId}`,
    `Email: ${data.basic.email}`,
    `Mobile: ${data.basic.mobile}`,
    `Submitted At: ${new Date(result.submittedAt).toLocaleString('en-IN')}`,
  ].join('\n');
}

function mergeDraftData(draftData = {}) {
  return {
    basic: { ...initialData.basic, ...(draftData.basic || {}) },
    education: { ...initialData.education, ...(draftData.education || {}) },
    documents: { ...initialData.documents, ...(draftData.documents || {}) },
    bulk: { ...initialData.bulk, ...(draftData.bulk || {}) },
  };
}

export default function StudentRegistrationWizard() {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedStep, setCompletedStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [autoSaveState, setAutoSaveState] = useState('Draft ready');
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    registrationService.loadDraft().then((draft) => {
      if (draft?.data) {
        setData(mergeDraftData(draft.data));
        setDeclaration(Boolean(draft.declaration));
        setMessage('Saved draft restored from this browser.');
      }
    });
  }, []);

  const stepErrors = useMemo(() => errors[currentStep] || {}, [currentStep, errors]);
  const progressPercent = Math.round(((Math.min(currentStep + 1, steps.length)) / steps.length) * 100);
  const uploadedDocuments = Object.values(data.documents).filter((file) => file?.name).length;
  const completedBasicFields = requiredBasic.filter((field) => String(data.basic[field] || '').trim()).length;
  const completedEducationFields = requiredEducation.filter((field) => String(data.education[field] || '').trim()).length;
  const currentStepLabel = `Step ${Math.min(currentStep + 1, steps.length)} of ${steps.length}`;

  const summaryCards = [
    ['Registration Status', currentStep === 4 ? 'Submitted' : 'Draft', currentStepLabel, 'activity'],
    ['Verification Status', data.basic.emailVerified && data.basic.mobileVerified ? 'Verified' : 'Pending', 'Email and mobile links', 'shield'],
    ['Documents Uploaded', `${uploadedDocuments}/${requiredDocuments.length}`, 'Proof and education PDFs', 'fileText'],
    ['Student ID Status', data.basic.studentId ? 'Generated' : 'Pending', data.basic.studentId || 'Generate before submit', 'key'],
  ];

  useEffect(() => {
    if (currentStep === 4) return undefined;
    const timer = window.setInterval(async () => {
      setAutoSaveState('Saving draft...');
      await registrationService.saveDraft({ data, declaration });
      const savedAt = new Date();
      setLastSavedAt(savedAt);
      setAutoSaveState('Auto-saved');
    }, 30000);
    return () => window.clearInterval(timer);
  }, [data, declaration, currentStep]);

  const updateSection = (section) => (event) => {
    const { name, value } = event.target;
    setData((current) => {
      const nextSection = { ...current[section], [name]: value };
      if (section === 'basic' && name === 'pinCode' && pinDirectory[value]) {
        nextSection.state = nextSection.state || pinDirectory[value].state;
        nextSection.residence = nextSection.residence || pinDirectory[value].residence;
      }
      return {
        ...current,
        [section]: nextSection,
      };
    });
    setErrors((current) => ({
      ...current,
      [currentStep]: { ...(current[currentStep] || {}), [name]: '' },
    }));
  };

  const updateEducation = (event) => {
    const { name, value } = event.target;
    setData((current) => {
      const nextEducation = { ...current.education, [name]: value };
      if (['totalMarks', 'marksObtained'].includes(name)) {
        const total = Number(nextEducation.totalMarks);
        const obtained = Number(nextEducation.marksObtained);
        if (total > 0 && obtained >= 0 && obtained <= total) {
          nextEducation.gradePercentage = ((obtained / total) * 100).toFixed(2);
        }
      }
      return { ...current, education: nextEducation };
    });
    setErrors((current) => ({
      ...current,
      [currentStep]: { ...(current[currentStep] || {}), [name]: '', gradePercentage: '' },
    }));
  };

  const updateFile = (name, file, fileError = '') => {
    setData((current) => ({
      ...current,
      documents: { ...current.documents, [name]: file },
    }));
    setErrors((current) => ({
      ...current,
      2: { ...(current[2] || {}), [name]: fileError },
    }));
  };

  const updateBulkFile = (name, file, fileError = '') => {
    setData((current) => ({
      ...current,
      bulk: { ...current.bulk, [name]: file },
    }));
    setErrors((current) => ({
      ...current,
      [currentStep]: { ...(current[currentStep] || {}), [name]: fileError },
    }));
  };

  const generateStudentId = () => {
    const nameToken = (data.basic.studentName || 'STU')
      .replace(/[^a-z]/gi, '')
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, 'X');
    const yearToken = data.basic.dateOfBirth ? data.basic.dateOfBirth.slice(0, 4) : currentYear();
    const sequence = generateNumericCode(4);
    const studentId = `MTPG-${yearToken}-${nameToken}-${sequence}`;
    setData((current) => ({
      ...current,
      basic: { ...current.basic, studentId },
    }));
    setErrors((current) => ({
      ...current,
      0: { ...(current[0] || {}), studentId: '' },
    }));
    setMessage('Student ID generated and ready for proof document verification.');
  };

  const verifyContact = (type) => {
    setData((current) => ({
      ...current,
      basic: { ...current.basic, [`${type}Verified`]: true },
    }));
    setErrors((current) => ({
      ...current,
      0: { ...(current[0] || {}), [`${type}Verified`]: '' },
    }));
    setMessage(`${type === 'email' ? 'Email' : 'Mobile'} verification completed for this mock registration.`);
  };

  const validateStep = (step = currentStep) => {
    let nextErrors = {};
    if (step === 0) nextErrors = validateBasic(data.basic);
    if (step === 1) nextErrors = validateEducation(data.education);
    if (step === 2) nextErrors = validateDocuments(data.documents);
    if (step === 3 && !declaration) nextErrors.declaration = 'Please accept the declaration before submitting.';
    setErrors((current) => ({ ...current, [step]: nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateAll = () => {
    const allErrors = {
      0: validateBasic(data.basic),
      1: validateEducation(data.education),
      2: validateDocuments(data.documents),
      3: declaration ? {} : { declaration: 'Please accept the declaration before submitting.' },
    };
    setErrors(allErrors);
    return Object.values(allErrors).every((group) => Object.keys(group).length === 0);
  };

  const goNext = () => {
    setMessage('');
    if (!validateStep()) return;
    setCompletedStep((current) => Math.max(current, currentStep + 1));
    setCurrentStep((current) => Math.min(3, current + 1));
  };

  const goPrevious = () => {
    setMessage('');
    setCurrentStep((current) => Math.max(0, current - 1));
  };

  const saveDraft = async () => {
    setLoading(true);
    setAutoSaveState('Saving draft...');
    await registrationService.saveDraft({ data, declaration });
    setLoading(false);
    const savedAt = new Date();
    setLastSavedAt(savedAt);
    setAutoSaveState('Saved manually');
    setMessage('Draft saved in this browser.');
  };

  const submit = async () => {
    setMessage('');
    if (!validateAll()) {
      setMessage('Please complete all required fields and documents before submitting.');
      return;
    }
    setLoading(true);
    const submission = await registrationService.submitStudentRegistration(data);
    setResult(submission);
    setCurrentStep(4);
    setCompletedStep(4);
    setLoading(false);
  };

  const reset = () => {
    setData(initialData);
    setCurrentStep(0);
    setCompletedStep(0);
    setErrors({});
    setMessage('');
    setDeclaration(false);
    setResult(null);
  };

  return (
    <section className="mtpg-wizard-shell mtpg-wizard-shell--premium" id="student-registration-form">
      <div className="mtpg-wizard-hero">
        <div className="mtpg-wizard-head">
          <span>Smart guided submission</span>
          <h2>Student Registration Form</h2>
          <p>Complete one focused step at a time with autosave, validation, document status, and Board-ready workflow review.</p>
        </div>
        <div className="mtpg-wizard-hero__signals" aria-label="Registration form coverage">
          <article>
            <strong>{data.basic.studentId || 'Auto ID'}</strong>
            <span>Student ID</span>
          </article>
          <article>
            <strong>{data.basic.emailVerified && data.basic.mobileVerified ? 'Verified' : 'Pending'}</strong>
            <span>Email & Mobile</span>
          </article>
          <article>
            <strong>PDF</strong>
            <span>Education Proofs</span>
          </article>
        </div>
      </div>

      <div className="mtpg-registration-summary" aria-label="Student registration summary">
        {summaryCards.map(([title, value, detail, icon]) => (
          <article key={title}>
            <span><Icon name={icon} size={17} /></span>
            <div>
              <strong>{value}</strong>
              <p>{title}</p>
              <small>{detail}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="mtpg-wizard-layout">
        <div className="mtpg-wizard-workspace">
          <div className="mtpg-progress-dock" aria-live="polite">
            <div className="mtpg-progress-dock__top">
              <div>
                <span>{currentStepLabel}</span>
                <strong>{progressPercent}% Completed</strong>
              </div>
              <div className="mtpg-autosave-pill">
                <Icon name="checkCircle" size={14} />
                <span>{autoSaveState}{lastSavedAt ? ` • ${lastSavedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
              </div>
            </div>
            <div className="mtpg-progress-track" aria-label={`Registration completion ${progressPercent}%`}>
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <Stepper steps={steps} currentStep={currentStep} completedStep={completedStep} onStepClick={(step) => {
            if (step <= completedStep + 1) setCurrentStep(step);
          }} />

          {message && <div className="mtpg-wizard-message"><Icon name="info" size={16} /> {message}</div>}

          {currentStep === 0 && (
            <RegistrationStepBasicDetails
              values={data.basic}
              errors={stepErrors}
              bulkFile={data.bulk.studentExcel}
              bulkError={stepErrors.studentExcel}
              onChange={updateSection('basic')}
              onVerify={verifyContact}
              onGenerateStudentId={generateStudentId}
              onBulkFileChange={updateBulkFile}
              onDownloadTemplate={downloadStudentTemplate}
            />
          )}
          {currentStep === 1 && (
            <RegistrationStepEducationDetails
              values={data.education}
              errors={stepErrors}
              bulkFile={data.bulk.educationExcel}
              bulkError={stepErrors.educationExcel}
              onChange={updateEducation}
              onBulkFileChange={updateBulkFile}
              onDownloadTemplate={downloadEducationTemplate}
            />
          )}
          {currentStep === 2 && (
            <RegistrationStepDocuments values={data.documents} errors={stepErrors} onFileChange={updateFile} />
          )}
          {currentStep === 3 && (
            <RegistrationStepReview
              data={data}
              declaration={declaration}
              error={stepErrors.declaration}
              onDeclarationChange={(checked) => {
                setDeclaration(checked);
                setErrors((current) => ({ ...current, 3: {} }));
              }}
              onEdit={setCurrentStep}
            />
          )}
          {currentStep === 4 && result && (
            <RegistrationSuccess
              result={result}
              onDownload={() => downloadTextFile(`${result.referenceNumber}-acknowledgement.txt`, acknowledgementText(result, data))}
              onPrint={() => window.print()}
              onNewRegistration={reset}
            />
          )}

          {currentStep < 4 && (
            <div className="mtpg-wizard-actions">
              <Button tone="secondary" onClick={goPrevious} disabled={currentStep === 0}>Previous</Button>
              <Button tone="secondary" onClick={saveDraft} loading={loading}><Icon name="fileCheck" size={16} /> Save Draft</Button>
              {currentStep < 3 ? (
                <Button onClick={goNext}>Next</Button>
              ) : (
                <Button onClick={submit} loading={loading}>Submit for Board Verification</Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mtpg-collapsible-grid">
        <details className="mtpg-collapsible-card">
          <summary><Icon name="checkSquare" size={16} /> Requirement coverage</summary>
          <div className="mtpg-compact-requirements">
            {requirementChecklist.map(([title, detail, icon]) => (
              <article key={title}>
                <Icon name={icon} size={15} />
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </details>

        <details className="mtpg-collapsible-card" open>
          <summary><Icon name="gitBranch" size={16} /> Workflow timeline</summary>
          <div className="mtpg-workflow-preview">
            {workflowHighlights.map(([title, detail, icon], index) => (
              <article key={title}>
                <span><Icon name={icon} size={16} /></span>
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
                {index < workflowHighlights.length - 1 && <Icon name="chevronRight" size={16} />}
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
