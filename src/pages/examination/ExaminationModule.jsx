import React, { useState } from 'react';
import { AlertStrip, ApprovalWorkflow, Card, DataTable, PageHeader, UploadControl, ValidatedForm } from '../../components/ui';
import { colleges, courses, terms } from '../../data/referenceData';
import { attendanceRows, schedules, subjects } from '../../data/mockData';
import { isHolidayOrWeekend } from '../../utils/validation';
import { downloadTextFile } from '../../utils/actions';

const subjectFields = [
  { label: 'Course', name: 'course', options: courses, required: true },
  { label: 'Semester', name: 'term', options: terms, required: true },
  { label: 'Subject Name', name: 'subject', required: true },
  { label: 'Effective Start Date', name: 'effectiveStart', type: 'date', required: true },
  { label: 'Effective End Date', name: 'effectiveEnd', type: 'date' },
];

const newSubjectFields = [
  { label: 'Subject Code', name: 'subjectCode', required: true },
  { label: 'Subject Name', name: 'subject', required: true },
  { label: 'Course', name: 'course', options: courses, required: true },
  { label: 'Semester', name: 'term', options: terms, required: true },
  { label: 'Effective Start Date', name: 'effectiveStart', type: 'date', required: true },
  { label: 'Effective End Date', name: 'effectiveEnd', type: 'date' },
];

const subjectRemovalFields = [
  { label: 'Mapped Subject', name: 'mappedSubject', options: subjects.map((subject) => `${subject.code} - ${subject.name}`), required: true },
  { label: 'Effective End Date', name: 'effectiveEnd', type: 'date', required: true },
  { label: 'Removal Reason', name: 'reason', required: true },
];

const scheduleFields = [
  { label: 'College', name: 'college', options: colleges, required: true },
  { label: 'Course', name: 'course', options: courses, required: true },
  { label: 'Semester', name: 'term', options: terms, required: true },
  { label: 'Exam Type', name: 'examType', options: ['Mid-term Examination', 'End-term Examination'], required: true },
  { label: 'Subject', name: 'subject', required: true },
  { label: 'Exam Date', name: 'examDate', type: 'date', required: true },
  { label: 'Time', name: 'time', type: 'time', required: true },
  { label: 'Venue', name: 'venue', required: true },
];

const scheduleSearchFields = [
  { label: 'College', name: 'college', options: colleges, required: true },
  { label: 'Course', name: 'course', options: courses, required: true },
  { label: 'Semester', name: 'term', options: terms, required: true },
  { label: 'Search Subject / Exam Type', name: 'query', placeholder: 'Subject or exam type' },
];

const attendanceCorrectionFields = [
  { label: 'Registration Number', name: 'registrationNo', required: true },
  { label: 'Subject', name: 'subject', required: true },
  { label: 'Corrected Attendance', name: 'attendance', options: ['Present', 'Absent'], required: true },
  { label: 'Competent Official', name: 'official', options: ['College Approver', 'Board Officer', 'Super Admin'], required: true },
  { label: 'Correction Reason', name: 'reason', required: true },
];

export default function ExaminationModule() {
  const [examDate, setExamDate] = useState('2026-08-15');
  const [message, setMessage] = useState('');

  const downloadLatestSchedule = () => {
    downloadTextFile(
      'MTPG_RIHS_Latest_Exam_Schedule.txt',
      [
        'MTPG & RIHS Latest Examination Schedule',
        'College, Course, Semester, Subject, Exam Type, Date, Time, Venue',
        `${colleges[0]}, ${courses[0]}, ${terms[0]}, Anatomy and Physiology, Mid-term Examination, 2026-07-12, 10:00 AM, Hall A`,
      ].join('\n'),
    );
    setMessage('Latest approved examination schedule downloaded.');
  };

  return (
    <div className="ems-page-stack">
      <PageHeader
        title="Examination Module"
        description="Workflow 4.2: semester-wise subjects, course mapping, examination schedules, publishing, attendance marking, PDF upload, and correction audit trail."
      />

      <Card title="Semester-wise Subject Selection" subtitle="Add or remove subjects for each semester with effective start and end dates." icon="book">
        <ValidatedForm fields={subjectFields} submitLabel="Save Subject Mapping" />
        <ValidatedForm fields={subjectRemovalFields} submitLabel="Remove Subject Mapping" />
        <DataTable
          columns={['Subject Code', 'Subject', 'Course', 'Semester', 'Effective Start', 'Effective End', 'Status', 'Mapping Control']}
          rows={subjects.map((subject) => [subject.code, subject.name, subject.course, subject.term, subject.effectiveStart, subject.effectiveEnd || 'Active', subject.status, subject.status === 'Draft' ? 'Review Removal' : 'Active Mapping'])}
          statusColumn={6}
        />
      </Card>

      <Card title="Create New Subject and Course Mapping" subtitle="Admin function for creating new subjects and mapping existing subjects to courses." icon="settings">
        <ValidatedForm fields={newSubjectFields} submitLabel="Create / Map Subject" />
      </Card>

      <Card title="Examination Schedule Creation" subtitle="Create mid-term and end-term schedules with date, time, venue, and Weekend / Holiday Alert controls." icon="clipboard">
        <label className="ems-form-field ems-inline-date">
          <span>Weekend / Holiday Alert Preview</span>
          <input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} />
        </label>
        {isHolidayOrWeekend(examDate) && <AlertStrip>Selected examination date falls on a weekend or declared holiday. Competent approval is required before publishing.</AlertStrip>}
        <ValidatedForm fields={scheduleFields} initialValues={{ examDate }} submitLabel="Submit Schedule for Approval" />
        <DataTable columns={['Stage', 'Responsible Role', 'Publish Permission', 'Status']} rows={[
          ['College verification', 'College Checker', 'Locked until verified', 'Submitted'],
          ['Board approval', 'Board Approver', 'Publishing enabled after approval', 'Pending'],
          ['Student portal release', 'Exam Cell', 'Latest schedule becomes downloadable', 'Locked'],
        ]} statusColumn={3} />
        <ApprovalWorkflow title="Schedule Approval and Publishing" />
        <DataTable columns={['Course', 'Semester', 'Subject', 'Exam Type', 'Date', 'Time', 'Venue', 'Status']} rows={schedules} statusColumn={7} />
      </Card>

      <Card title="Published Schedule Download" subtitle="Latest schedule is available for students by college, course, and semester; previous schedules auto-disabled after examination completion." icon="download">
        {message && <div className="ems-action-message">{message}</div>}
        <ValidatedForm fields={scheduleSearchFields} submitLabel="Search Latest Schedule" />
        <div className="ems-action-row">
          <button className="ems-btn ems-btn-primary" type="button" onClick={downloadLatestSchedule}>Download Latest Approved Schedule</button>
          <button className="ems-btn ems-btn-secondary" type="button" onClick={() => setMessage('Previous schedules auto-disabled after examination completion.')}>Check Previous Schedule Status</button>
        </div>
        <DataTable columns={['College', 'Course', 'Semester', 'Schedule Status', 'Download']} rows={[
          [colleges[0], courses[0], terms[0], 'Approved', 'Download Latest PDF'],
          [colleges[0], courses[1], terms[1], 'Archived', 'Previous schedules auto-disabled'],
        ]} statusColumn={3} />
      </Card>

      <Card title="Examination Attendance" subtitle="Mark attendance for students appearing for examination and upload subject-wise attendance sheet in PDF format." icon="checkSquare">
        <div className="ems-two-column">
          <ValidatedForm fields={[
            { label: 'Registration Number', name: 'registrationNo', required: true },
            { label: 'Subject', name: 'subject', required: true },
            { label: 'Attendance', name: 'attendance', options: ['Present', 'Absent'], required: true },
          ]} submitLabel="Mark Attendance" />
          <UploadControl title="Upload attendance sheet PDF" detail="Subject-wise attendance sheet PDF upload" required />
        </div>
        <DataTable columns={['Registration No.', 'Student', 'Subject', 'Attendance', 'PDF Sheet', 'Correction Trail']} rows={attendanceRows} />
      </Card>

      <Card title="Attendance Correction Audit Trail" subtitle="Only competent officials can edit confirmed attendance. Every correction remains available for audit." icon="activity">
        <AlertStrip tone="info">Confirmed attendance is locked for ordinary users. Corrections require competent official role selection and audit reason.</AlertStrip>
        <ValidatedForm fields={attendanceCorrectionFields} submitLabel="Submit Attendance Correction" />
        <DataTable columns={['Time', 'Official', 'Registration No.', 'Previous Attendance', 'Corrected Attendance', 'Reason']} rows={[
          ['2026-05-20 11:40', 'Board Officer', 'PYBOME202600083', 'Present', 'Absent', 'Attendance sheet correction'],
          ['2026-05-20 12:15', 'College Approver', 'PYBOME202600084', 'Absent', 'Present', 'PDF revalidated'],
        ]} />
      </Card>
    </div>
  );
}
