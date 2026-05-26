import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, Topbar, Icon, Modal } from './components';
import { useToast } from './components/Toast';
import {
  addEducationRecord,
  addStudentDocument,
  deleteEducationRecord,
  deleteStudentDocument,
  generateExcelTemplate,
  getEducationRecords,
  getStudentDocuments,
  getVerificationStatus,
  parseExcelUpload,
  setVerificationStatus,
} from './store';

const REQUIRED_DOCS = ['Name of Student', 'Date of Birth', 'Student ID', 'Address'];
const EDUCATION_LEVELS = ['X', 'XII', 'Diploma', 'UG', 'PG', 'Others'];

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'basic', label: 'Basic Details', icon: 'user' },
  { id: 'documents', label: 'Documents', icon: 'upload' },
  { id: 'education', label: 'Education Details', icon: 'book' },
  { id: 'verification', label: 'Data Verification', icon: 'checkCircle' },
  { id: 'profile', label: 'My Profile', icon: 'user' },
];

const MODULE_REQUIREMENTS = [
  { title: 'Single Entry', detail: 'Guided form capture for identity, parent, address, college, course, and admission data.', icon: 'edit', state: 'Ready' },
  { title: 'Bulk Excel Upload', detail: 'CSV template upload is available for student and education records.', icon: 'upload', state: 'Available' },
  { title: 'Auto Validation', detail: 'Required fields, email, mobile, pin code, marks, and PDF rules run before submit.', icon: 'checkSquare', state: 'Live' },
  { title: 'Duplicate Detection', detail: 'Email and Student ID checks should block duplicate student registrations.', icon: 'search', state: 'Design' },
  { title: 'OTP Verification', detail: 'Mobile and email verification states are tracked on the student profile.', icon: 'phone', state: 'Pending' },
  { title: 'Workflow Submission', detail: 'Draft data moves through Maker, Checker, and Approver before final registration.', icon: 'gitBranch', state: 'Draft' },
];

const WORKFLOW_STEPS = [
  { key: 'maker', label: 'Maker', desc: 'Student or college operator completes entry and uploads documents.' },
  { key: 'checker', label: 'Checker', desc: 'Reviewer validates identity, education proofs, and OCR-extracted fields.' },
  { key: 'approver', label: 'Approver', desc: 'Board approver signs digitally and locks the registration number.' },
];

const EMPTY_EDU_FORM = {
  level: '',
  majorSubjects: '',
  boardExam: '',
  institution: '',
  institutionAddress: '',
  place: '',
  pinCode: '',
  yearOfPassing: '',
  totalMarks: '',
  marksObtained: '',
  gradePercentage: '',
  registrationNumber: '',
  certificateSerialNumber: '',
};

const studentFields = (user) => [
  ['Name of Student', user.name],
  ['Date of Birth', formatDate(user.dob)],
  ['Gender', user.gender || 'Not updated'],
  ['Aadhaar / Identity Number', user.identityNumber || user.studentId || 'Not updated'],
  ['E-Mail ID', user.email],
  ['Mobile Number', user.mobile || 'Not updated'],
  ['Student ID', user.studentId || user.enrollmentNo],
  ['Name of Father', user.fatherName || 'Not updated'],
  ['Name of Mother', user.motherName || 'Not updated'],
  ['Student Photo', user.photoName || 'Pending upload'],
  ['Address', user.address || 'Not updated'],
  ['Place of Residence', user.placeOfResidence || 'Not updated'],
  ['State', user.state || 'Not updated'],
  ['Pin Code', user.pinCode || 'Not updated'],
  ['College Mapping', user.college || 'MTPG&RIHS'],
  ['Course Mapping', user.department || 'Not updated'],
  ['Admission Year', user.admissionYear || new Date(user.createdAt || Date.now()).getFullYear()],
  ['Student Status', user.studentStatus || 'Draft'],
  ['Unique Registration No.', user.enrollmentNo],
];

function formatDate(value) {
  if (!value) return 'Not updated';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isPdf(file) {
  return file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf');
}

function countCompletedStudentFields(user) {
  const required = [
    'name',
    'dob',
    'email',
    'mobile',
    'studentId',
    'fatherName',
    'motherName',
    'address',
    'placeOfResidence',
    'state',
    'pinCode',
  ];
  return required.filter((field) => String(user[field] || '').trim()).length;
}

function ProgressRow({ label, complete, detail }) {
  return (
    <div className={`verification-row ${complete ? 'is-complete' : ''}`}>
      <div className="verification-info">
        <Icon name={complete ? 'checkCircle' : 'clock'} size={16} color={complete ? 'var(--success)' : 'var(--warning)'} />
        <div>
          <div className="verification-label">{label}</div>
          <div className="verification-value">{detail}</div>
        </div>
      </div>
      <span className={`badge ${complete ? 'badge-success' : 'badge-pending'}`}>
        {complete ? 'Complete' : 'Pending'}
      </span>
    </div>
  );
}

function WorkflowCard({ icon, title, detail, complete, action, onAction }) {
  return (
    <article className={`workflow-card ${complete ? 'is-complete' : ''}`}>
      <div className="workflow-card-icon">
        <Icon name={complete ? 'checkCircle' : icon} size={20} />
      </div>
      <div className="workflow-card-body">
        <div className="workflow-card-title">{title}</div>
        <p>{detail}</p>
      </div>
      <button className="btn btn-ghost btn-sm" onClick={onAction}>
        {complete ? 'Review' : action}
      </button>
    </article>
  );
}

export default function StudentDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [studentDocs, setStudentDocs] = useState([]);
  const [educationRecords, setEducationRecords] = useState([]);
  const [verification, setVerification] = useState({ mobile: false, email: false });
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educationForm, setEducationForm] = useState({ ...EMPTY_EDU_FORM });
  const [educationProof, setEducationProof] = useState(null);
  const studentCsvRef = useRef(null);
  const educationCsvRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const refresh = () => {
    setStudentDocs(getStudentDocuments(user.id));
    setEducationRecords(getEducationRecords(user.id));
    setVerification(getVerificationStatus(user.id));
  };

  useEffect(() => {
    refresh();
  }, [user.id]);

  const basicFieldCount = countCompletedStudentFields(user);
  const requiredDocCount = REQUIRED_DOCS.filter((docType) =>
    studentDocs.some((doc) => doc.docType === docType)
  ).length;
  const educationReady = educationRecords.length > 0 && educationRecords.every((record) => record.documentUploaded);
  const verificationReady = verification.mobile && verification.email && requiredDocCount === REQUIRED_DOCS.length && educationReady;
  const currentWorkflowStep = verificationReady ? 2 : educationReady && requiredDocCount === REQUIRED_DOCS.length ? 1 : 0;

  const completion = useMemo(() => {
    const steps = [
      basicFieldCount === 11,
      requiredDocCount === REQUIRED_DOCS.length,
      educationReady,
      verification.mobile,
      verification.email,
    ];
    return Math.round((steps.filter(Boolean).length / steps.length) * 100);
  }, [basicFieldCount, requiredDocCount, educationReady, verification.mobile, verification.email]);

  const navItems = TABS.map((item) => ({
    ...item,
    badge: item.id === 'documents' ? REQUIRED_DOCS.length - requiredDocCount : 0,
  }));

  const tabTitles = {
    dashboard: 'Student Module Dashboard',
    basic: 'Basic Details',
    documents: 'Student Documents',
    education: 'Education Details',
    verification: 'Data Verification',
    profile: 'My Profile',
  };

  const handleStudentCsvUpload = async (file) => {
    if (!file) return;
    try {
      const parsed = await parseExcelUpload(file);
      showToast(`${parsed.rows.length} student detail row(s) parsed from template.`);
    } catch (err) {
      showToast(err, 'error');
    }
  };

  const handleEducationCsvUpload = async (file) => {
    if (!file) return;
    try {
      const parsed = await parseExcelUpload(file);
      showToast(`${parsed.rows.length} education detail row(s) parsed from template.`);
    } catch (err) {
      showToast(err, 'error');
    }
  };

  const handleDocumentUpload = (docType, file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type) && !/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      showToast('Upload PDF, JPG, or PNG documents only.', 'error');
      return;
    }
    addStudentDocument(user.id, docType, file.name);
    refresh();
    showToast(`${docType} document uploaded.`);
  };

  const submitEducationRecord = (event) => {
    event.preventDefault();

    const totalMarks = Number(educationForm.totalMarks);
    const marksObtained = Number(educationForm.marksObtained);
    const year = Number(educationForm.yearOfPassing);
    const currentYear = new Date().getFullYear();

    if (!educationForm.level) return showToast('Education level is required.', 'error');
    if (!educationForm.boardExam.trim()) return showToast('Board / exam name is required.', 'error');
    if (!educationForm.institution.trim()) return showToast('School / college name is required.', 'error');
    if (!educationForm.yearOfPassing || year < 1950 || year > currentYear) {
      return showToast(`Year of passing must be between 1950 and ${currentYear}.`, 'error');
    }
    if (!Number.isFinite(totalMarks) || totalMarks <= 0) {
      return showToast('Total marks must be greater than zero.', 'error');
    }
    if (!Number.isFinite(marksObtained) || marksObtained < 0 || marksObtained > totalMarks) {
      return showToast('Marks obtained must be between zero and total marks.', 'error');
    }
    if (educationForm.pinCode && !/^[0-9]{6}$/.test(educationForm.pinCode)) {
      return showToast('Pin Code must be exactly 6 digits.', 'error');
    }
    if (!educationProof) return showToast('PDF proof is mandatory for each education record.', 'error');
    if (!isPdf(educationProof)) return showToast('Education proof must be a PDF file.', 'error');

    addEducationRecord(user.id, {
      ...educationForm,
      documentName: educationProof.name,
    });
    setEducationForm({ ...EMPTY_EDU_FORM });
    setEducationProof(null);
    setShowEducationForm(false);
    refresh();
    showToast('Education record added successfully.');
  };

  const verifyContact = (field) => {
    setVerificationStatus(user.id, field, true);
    refresh();
    showToast(`${field === 'mobile' ? 'Mobile number' : 'Email address'} verified.`);
  };

  const dashboardStats = [
    { label: 'Profile Fields', value: `${basicFieldCount}/11`, icon: 'user', color: '#BE123C', bg: 'rgba(190,18,60,0.12)' },
    { label: 'Documents', value: `${requiredDocCount}/4`, icon: 'upload', color: '#FB7185', bg: 'rgba(251,113,133,0.14)' },
    { label: 'Education Records', value: educationRecords.length, icon: 'book', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
    { label: 'Completion', value: `${completion}%`, icon: 'checkCircle', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  ];

  const workflowCards = [
    {
      icon: 'user',
      title: 'Basic Details',
      detail: `${basicFieldCount} of 11 required identity fields are available.`,
      complete: basicFieldCount === 11,
      action: 'Open',
      tab: 'basic',
    },
    {
      icon: 'upload',
      title: 'Documents',
      detail: `${requiredDocCount} of ${REQUIRED_DOCS.length} verification documents uploaded.`,
      complete: requiredDocCount === REQUIRED_DOCS.length,
      action: 'Upload',
      tab: 'documents',
    },
    {
      icon: 'book',
      title: 'Education',
      detail: educationRecords.length ? `${educationRecords.length} record(s) ready with PDF proof.` : 'Add education history with mandatory PDF proof.',
      complete: educationReady,
      action: 'Add',
      tab: 'education',
    },
    {
      icon: 'link',
      title: 'Contact Verification',
      detail: verification.mobile && verification.email ? 'Mobile and email are verified.' : 'Verify mobile and email through clickable actions.',
      complete: verification.mobile && verification.email,
      action: 'Verify',
      tab: 'basic',
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        activeTab={tab}
        setActiveTab={setTab}
        navItems={navItems}
        onLogout={onLogout}
        onGoHome={() => navigate('/')}
      />
      <div className="main-content">
        <Topbar title={tabTitles[tab]} user={user} onLogout={onLogout} />
        <div className="page-content">
          {tab === 'dashboard' && (
            <div>
              <div className="student-hero-panel">
                <div>
                  <div className="eyebrow">Protocol 4.1 Student Module</div>
                  <h2>Welcome back, {user.name.split(' ')[0]}</h2>
                  <p>Complete profile, document, education, and contact verification before Board approval.</p>
                  <div className="hero-action-row">
                    <button className="btn btn-primary btn-sm" onClick={() => setTab(verificationReady ? 'verification' : 'documents')}>
                      <Icon name={verificationReady ? 'checkCircle' : 'upload'} size={14} />
                      {verificationReady ? 'Open Verification' : 'Continue Setup'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setTab('basic')}>
                      <Icon name="user" size={14} />
                      Review Details
                    </button>
                  </div>
                </div>
                <div className="completion-card" aria-label={`Student module completion ${completion}%`}>
                  <div className="completion-ring" style={{ '--progress': `${completion * 3.6}deg` }}>
                    <span>{completion}%</span>
                  </div>
                  <div>
                    <strong>{verificationReady ? 'Ready for Board review' : 'Verification in progress'}</strong>
                    <p>{verificationReady ? 'All student inputs are complete.' : 'Finish pending items to unlock approval readiness.'}</p>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                {dashboardStats.map((stat) => (
                  <div key={stat.label} className="stat-card">
                    <div className="stat-icon" style={{ background: stat.bg }}>
                      <Icon name={stat.icon} size={22} color={stat.color} />
                    </div>
                    <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="workflow-grid">
                {workflowCards.map((item) => (
                  <WorkflowCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    detail={item.detail}
                    complete={item.complete}
                    action={item.action}
                    onAction={() => setTab(item.tab)}
                  />
                ))}
              </div>

              <div className="requirement-grid">
                {MODULE_REQUIREMENTS.map((item) => (
                  <article key={item.title} className="requirement-card">
                    <div className="requirement-icon"><Icon name={item.icon} size={17} /></div>
                    <div>
                      <div className="requirement-top">
                        <strong>{item.title}</strong>
                        <span>{item.state}</span>
                      </div>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="glass-card p-6">
                <div className="section-title section-title-inline">
                  <Icon name="checkCircle" size={20} /> Verification Readiness
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <ProgressRow label="Basic details" complete={basicFieldCount === 11} detail={`${basicFieldCount} of 11 required fields available`} />
                  <ProgressRow label="Student documents" complete={requiredDocCount === REQUIRED_DOCS.length} detail={`${requiredDocCount} of 4 verification documents uploaded`} />
                  <ProgressRow label="Education details" complete={educationReady} detail={educationRecords.length ? `${educationRecords.length} record(s) with PDF proof` : 'Add at least one education record'} />
                  <ProgressRow label="Mobile and email" complete={verification.mobile && verification.email} detail="Clickable verification links must be completed" />
                </div>
              </div>

              <div className="workflow-timeline-card">
                <div className="section-title section-title-inline">
                  <Icon name="gitBranch" size={20} /> Student Verification Workflow
                </div>
                <div className="workflow-timeline">
                  {WORKFLOW_STEPS.map((step, index) => (
                    <div key={step.key} className={`workflow-stage ${index <= currentWorkflowStep ? 'is-active' : ''}`}>
                      <span className="workflow-stage-index">{index + 1}</span>
                      <div>
                        <strong>{step.label}</strong>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'basic' && (
            <div className="ems-page-grid">
              <div className="glass-card p-6">
                <div className="card-header">
                  <div className="section-title section-title-inline">
                    <Icon name="user" size={20} /> Student Information
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => generateExcelTemplate('student')}>
                      <Icon name="download" size={14} /> Template
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => studentCsvRef.current?.click()}>
                      <Icon name="upload" size={14} /> Upload CSV
                    </button>
                    <input
                      ref={studentCsvRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      hidden
                      onChange={(event) => {
                        handleStudentCsvUpload(event.target.files?.[0]);
                        event.target.value = '';
                      }}
                    />
                  </div>
                </div>
                <div className="ems-detail-grid">
                  {studentFields(user).map(([label, value]) => (
                    <div key={label} className="ems-detail-row">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="section-title section-title-inline">
                  <Icon name="link" size={20} /> Contact Verification
                </div>
                <p className="text-muted text-sm" style={{ marginBottom: 16 }}>
                  Protocol requires clickable verification links for mobile number and email address.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="verification-row">
                    <div className="verification-info">
                      <Icon name="phone" size={16} color="var(--primary)" />
                      <div>
                        <div className="verification-label">Mobile Number</div>
                        <div className="verification-value">{user.mobile || 'Not provided'}</div>
                      </div>
                    </div>
                    {verification.mobile
                      ? <span className="badge badge-success">Verified</span>
                      : <button className="btn btn-primary btn-sm" onClick={() => verifyContact('mobile')}>Verify</button>}
                  </div>
                  <div className="verification-row">
                    <div className="verification-info">
                      <Icon name="mail" size={16} color="var(--primary)" />
                      <div>
                        <div className="verification-label">E-Mail ID</div>
                        <div className="verification-value">{user.email}</div>
                      </div>
                    </div>
                    {verification.email
                      ? <span className="badge badge-success">Verified</span>
                      : <button className="btn btn-primary btn-sm" onClick={() => verifyContact('email')}>Verify</button>}
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="section-title section-title-inline">
                  <Icon name="shield" size={20} /> Validation and Draft Controls
                </div>
                <div className="validation-stack">
                  <ProgressRow label="Auto-validation" complete={basicFieldCount === 11} detail="Required profile fields, mobile, email, and pin code rules" />
                  <ProgressRow label="Duplicate detection" complete={Boolean(user.email && user.studentId)} detail="Email and Student ID are ready for server-side uniqueness check" />
                  <ProgressRow label="Draft save" complete detail="Local draft is persisted until workflow submission" />
                  <ProgressRow label="Workflow submission" complete={verificationReady} detail={verificationReady ? 'Ready to submit to Maker queue' : 'Complete verification items before submission'} />
                </div>
              </div>
            </div>
          )}

          {tab === 'documents' && (
            <div className="glass-card p-6 document-panel">
              <div className="document-panel-header">
                <div>
                  <div className="section-title section-title-inline">
                    <Icon name="upload" size={20} /> Student Verification Documents
                  </div>
                  <p className="text-muted text-sm">
                    Upload documents for each protocol-required identity field. Existing uploads are replaced per document type.
                  </p>
                </div>
                <div className="doc-progress-pill">
                  {requiredDocCount}/{REQUIRED_DOCS.length} uploaded
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REQUIRED_DOCS.map((docType) => {
                  const doc = studentDocs.find((item) => item.docType === docType);
                  return (
                    <div key={docType} className={`doc-upload-row ${doc ? 'is-complete' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                        <Icon name={doc ? 'checkCircle' : 'filePlus'} size={16} color={doc ? 'var(--success)' : 'var(--text-muted)'} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{docType}</div>
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                            {doc ? `${doc.fileName} - ${formatDate(doc.uploadedAt)}` : 'PDF, JPG, or PNG accepted'}
                          </div>
                        </div>
                      </div>
                      {doc ? (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            deleteStudentDocument(doc.id);
                            refresh();
                            showToast('Document removed.', 'warning');
                          }}
                        >
                          <Icon name="trash" size={13} /> Remove
                        </button>
                      ) : (
                        <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                          <Icon name="upload" size={13} /> Upload
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            hidden
                            onChange={(event) => {
                              handleDocumentUpload(docType, event.target.files?.[0]);
                              event.target.value = '';
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="doc-feature-strip">
                <span><Icon name="fileCheck" size={14} /> Mandatory proof mapping</span>
                <span><Icon name="search" size={14} /> OCR extraction placeholder</span>
                <span><Icon name="checkSquare" size={14} /> Auto verification rules</span>
              </div>
            </div>
          )}

          {tab === 'education' && (
            <div>
              <div className="card-header" style={{ marginBottom: 16 }}>
                <div className="ems-section-intro" style={{ marginBottom: 0 }}>
                  <h2>Education Details</h2>
                  <p>Maintain education records with marks, registration data, certificate data, and mandatory PDF proof.</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => generateExcelTemplate('education')}>
                    <Icon name="download" size={14} /> Template
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => educationCsvRef.current?.click()}>
                    <Icon name="upload" size={14} /> Upload CSV
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowEducationForm(true)}>
                    <Icon name="plus" size={14} /> Add Record
                  </button>
                  <input
                    ref={educationCsvRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    hidden
                    onChange={(event) => {
                      handleEducationCsvUpload(event.target.files?.[0]);
                      event.target.value = '';
                    }}
                  />
                </div>
              </div>

              {educationRecords.length === 0 ? (
                <div className="empty-state">
                  <Icon name="book" size={42} color="var(--text-muted)" />
                  <div className="empty-title">No education records added</div>
                  <div className="empty-sub">Add at least one record with PDF proof for verification readiness.</div>
                </div>
              ) : (
                <div className="glass-card p-6">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Level</th>
                          <th>Board / Exam</th>
                          <th>Institution</th>
                          <th>Year</th>
                          <th>Marks</th>
                          <th>Registration</th>
                          <th>Proof</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {educationRecords.map((record) => (
                          <tr key={record.id}>
                            <td>{record.level}</td>
                            <td>{record.boardExam}</td>
                            <td>
                              <div style={{ fontWeight: 700 }}>{record.institution}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{record.place || 'Place not updated'}</div>
                            </td>
                            <td>{record.yearOfPassing}</td>
                            <td>{record.marksObtained} / {record.totalMarks}</td>
                            <td>{record.registrationNumber || 'Not updated'}</td>
                            <td>
                              <span className={record.documentUploaded ? 'badge badge-success' : 'badge badge-pending'}>
                                {record.documentUploaded ? 'PDF uploaded' : 'Missing'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                  deleteEducationRecord(record.id);
                                  refresh();
                                  showToast('Education record deleted.', 'warning');
                                }}
                              >
                                <Icon name="trash" size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="education-rule-grid">
                <div className="education-rule-card">
                  <Icon name="fileText" size={18} />
                  <strong>Mandatory PDFs</strong>
                  <p>Each X, XII, Diploma, Degree, or PG row requires certificate proof before verification.</p>
                </div>
                <div className="education-rule-card">
                  <Icon name="search" size={18} />
                  <strong>OCR Extraction</strong>
                  <p>Future OCR should extract board, year, marks, and registration numbers for checker review.</p>
                </div>
                <div className="education-rule-card">
                  <Icon name="checkCircle" size={18} />
                  <strong>Validation Rules</strong>
                  <p>Marks cannot exceed total marks, year cannot be future dated, and pin codes must be 6 digits.</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'verification' && (
            <div className="ems-page-grid">
              <div className="glass-card p-6">
                <div className="section-title section-title-inline">
                  <Icon name="checkCircle" size={20} /> Board Verification Readiness
                </div>
                <p className="text-muted text-sm" style={{ marginBottom: 16 }}>
                  This screen reflects the maker-checker-approver readiness state for student data. Data changes remain at student or college entry level.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <ProgressRow label="Maker entry" complete={basicFieldCount === 11 && educationRecords.length > 0} detail="Basic and education details are entered" />
                  <ProgressRow label="Checker verification" complete={requiredDocCount === REQUIRED_DOCS.length && educationReady} detail="Required proof documents are available" />
                  <ProgressRow label="Approver readiness" complete={verificationReady} detail="Mobile, email, documents, and education proof are complete" />
                  <ProgressRow label="Digital approval" complete={false} detail="Pending Board-level digital signature approval" />
                </div>
                <div className="verification-action-row">
                  <button className="btn btn-ghost btn-sm"><Icon name="message" size={14} /> Add Comment</button>
                  <button className="btn btn-ghost btn-sm"><Icon name="arrowLeft" size={14} /> Send Back</button>
                  <button className="btn btn-danger btn-sm"><Icon name="x" size={14} /> Reject</button>
                  <button className="btn btn-primary btn-sm" disabled={!verificationReady}><Icon name="checkCircle" size={14} /> Submit for Approval</button>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="section-title section-title-inline">
                  <Icon name="graduation" size={20} /> Unique Student Registration
                </div>
                <div className="ems-detail-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="ems-detail-row">
                    <span>Generated Registration No.</span>
                    <strong>{user.enrollmentNo}</strong>
                  </div>
                  <div className="ems-detail-row">
                    <span>Status</span>
                    <strong>{verificationReady ? 'Ready for Board approval' : 'Pending verification inputs'}</strong>
                  </div>
                  <div className="ems-detail-row">
                    <span>Modification Rule</span>
                    <strong>Corrections must be done at entry level before approval</strong>
                  </div>
                  <div className="ems-detail-row">
                    <span>Generation Logic</span>
                    <strong>Board prefix + admission year + course + sequence</strong>
                  </div>
                  <div className="ems-detail-row">
                    <span>Approval Lock</span>
                    <strong>Immutable after digital signature</strong>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="section-title section-title-inline">
                  <Icon name="clock" size={20} /> Workflow History
                </div>
                <div className="audit-mini-list">
                  <div><strong>Draft saved</strong><span>Student profile created</span></div>
                  <div><strong>Documents pending</strong><span>{REQUIRED_DOCS.length - requiredDocCount} proof document(s) remaining</span></div>
                  <div><strong>SLA target</strong><span>Checker review within 2 working days after submission</span></div>
                </div>
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="glass-card p-6" style={{ maxWidth: 620 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
                <div className="avatar avatar-primary" style={{ width: 72, height: 72, fontSize: '1.4rem' }}>{user.avatar}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800 }}>{user.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user.email}</div>
                  <span className="badge badge-info" style={{ marginTop: 6 }}>Student</span>
                </div>
              </div>
              <div className="divider" />
              {[
                ['Student ID', user.studentId || 'Not updated'],
                ['Unique Registration No.', user.enrollmentNo],
                ['Department', user.department || 'Not updated'],
                ['Year', user.year || 'Not updated'],
                ['Mobile', user.mobile || 'Not updated'],
                ['Registered On', formatDate(user.createdAt || Date.now())],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{label}</span>
                  <span style={{ textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEducationForm && (
        <Modal title="Add Education Record" onClose={() => setShowEducationForm(false)}>
          <form onSubmit={submitEducationRecord}>
            <div className="reg-section-label"><Icon name="book" size={14} /><span>Education Information</span></div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Education Level *</label>
                <select className="form-input" value={educationForm.level} onChange={(event) => setEducationForm((prev) => ({ ...prev, level: event.target.value }))} required>
                  <option value="">Select level</option>
                  {EDUCATION_LEVELS.map((level) => <option key={level}>{level}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Major Subjects</label>
                <input className="form-input" value={educationForm.majorSubjects} onChange={(event) => setEducationForm((prev) => ({ ...prev, majorSubjects: event.target.value }))} placeholder="Science, Commerce, Nursing" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Name of Board / Exam *</label>
              <input className="form-input" value={educationForm.boardExam} onChange={(event) => setEducationForm((prev) => ({ ...prev, boardExam: event.target.value }))} required />
            </div>

            <div className="reg-section-label"><Icon name="building" size={14} /><span>Institution Details</span></div>
            <div className="form-group">
              <label className="form-label">Name of School / College *</label>
              <input className="form-input" value={educationForm.institution} onChange={(event) => setEducationForm((prev) => ({ ...prev, institution: event.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Address of School / College</label>
              <input className="form-input" value={educationForm.institutionAddress} onChange={(event) => setEducationForm((prev) => ({ ...prev, institutionAddress: event.target.value }))} />
            </div>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Place</label>
                <input className="form-input" value={educationForm.place} onChange={(event) => setEducationForm((prev) => ({ ...prev, place: event.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input className="form-input" inputMode="numeric" maxLength={6} value={educationForm.pinCode} onChange={(event) => setEducationForm((prev) => ({ ...prev, pinCode: event.target.value.replace(/\D/g, '').slice(0, 6) }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Year of Passing *</label>
                <input className="form-input" inputMode="numeric" maxLength={4} value={educationForm.yearOfPassing} onChange={(event) => setEducationForm((prev) => ({ ...prev, yearOfPassing: event.target.value.replace(/\D/g, '').slice(0, 4) }))} required />
              </div>
            </div>

            <div className="reg-section-label"><Icon name="award" size={14} /><span>Marks and Certificate</span></div>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Total Marks *</label>
                <input className="form-input" inputMode="decimal" value={educationForm.totalMarks} onChange={(event) => setEducationForm((prev) => ({ ...prev, totalMarks: event.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Marks Obtained *</label>
                <input className="form-input" inputMode="decimal" value={educationForm.marksObtained} onChange={(event) => setEducationForm((prev) => ({ ...prev, marksObtained: event.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Grade / Percentage</label>
                <input className="form-input" value={educationForm.gradePercentage} onChange={(event) => setEducationForm((prev) => ({ ...prev, gradePercentage: event.target.value }))} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Student Registration Number</label>
                <input className="form-input" value={educationForm.registrationNumber} onChange={(event) => setEducationForm((prev) => ({ ...prev, registrationNumber: event.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Certificate Serial Number</label>
                <input className="form-input" value={educationForm.certificateSerialNumber} onChange={(event) => setEducationForm((prev) => ({ ...prev, certificateSerialNumber: event.target.value }))} />
              </div>
            </div>

            <div className="reg-section-label"><Icon name="upload" size={14} /><span>PDF Proof</span></div>
            <div className="file-upload-zone">
              {educationProof ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="checkCircle" size={18} color="var(--success)" />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{educationProof.name}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEducationProof(null)}>
                    <Icon name="x" size={13} />
                  </button>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <Icon name="upload" size={24} color="var(--primary)" />
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: 6 }}>Choose mandatory PDF proof</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>One PDF is required for every education record.</div>
                  <input type="file" accept=".pdf" hidden onChange={(event) => setEducationProof(event.target.files?.[0] || null)} />
                </label>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowEducationForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Record</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
