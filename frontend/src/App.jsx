import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import SubjectList       from './modules/Examination/subjects/SubjectList';
import SubjectAssign     from './modules/Examination/subjects/SubjectAssign';
import ScheduleForm      from './modules/Examination/schedule/ScheduleForm';
import ScheduleApproval  from './modules/Examination/schedule/ScheduleApproval';
import SchedulePublic    from './modules/Examination/schedule/SchedulePublic';
import AttendanceEntry   from './modules/Examination/attendance/AttendanceEntry';
import AttendanceAuditLog from './modules/Examination/attendance/AttendanceAuditLog';

import SubjectMarkConfig  from './modules/Marks/subjectConfig/SubjectMarkConfig';
import SubjectMarkHistory from './modules/Marks/subjectConfig/SubjectMarkHistory';
import MarksEntryGrid     from './modules/Marks/studentMarks/MarksEntryGrid';
import MarksApproval      from './modules/Marks/studentMarks/MarksApproval';
import MarksEditLog       from './modules/Marks/studentMarks/MarksEditLog';
import MarksheetView      from './modules/Marks/marksheet/MarksheetView';

// Logged-in user — replace with your Auth module's context/token
const USER_ID   = 1;

const navStyle = {
  display: 'flex', flexWrap: 'wrap', gap: '6px',
  padding: '12px 20px', background: '#2c3e50', alignItems: 'center'
};
const linkStyle = ({ isActive }) => ({
  color: isActive ? '#f39c12' : '#ecf0f1',
  textDecoration: 'none', padding: '5px 10px',
  borderRadius: '4px', fontSize: '13px',
  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent'
});
const sectionLabel = { color: '#7f8c8d', fontSize: '11px', fontWeight: 'bold', padding: '5px 4px', textTransform: 'uppercase' };
const pageWrap = { maxWidth: '1100px', margin: '24px auto', padding: '0 20px' };

function Home() {
  return (
    <div style={{ ...pageWrap, textAlign: 'center', paddingTop: '60px' }}>
      <h1 style={{ color: '#2c3e50' }}>EMS 2026</h1>
      <p style={{ color: '#7f8c8d', fontSize: '18px' }}>Examination & Marks Module</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
        {[
          { label: 'Examination Subjects', path: '/exam/subjects', color: '#3498db' },
          { label: 'Exam Schedule',        path: '/exam/schedule', color: '#2ecc71' },
          { label: 'Student Attendance',   path: '/exam/attendance', color: '#e74c3c' },
          { label: 'Subject Mark Config',  path: '/marks/config', color: '#9b59b6' },
          { label: 'Marks Entry',          path: '/marks/entry', color: '#f39c12' },
          { label: 'Marksheet',            path: '/marks/marksheet', color: '#1abc9c' },
        ].map((c) => (
          <a key={c.path} href={c.path} style={{
            display: 'block', background: c.color, color: '#fff',
            padding: '20px 30px', borderRadius: '8px', textDecoration: 'none',
            fontWeight: 'bold', fontSize: '15px', minWidth: '180px'
          }}>{c.label}</a>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <NavLink to="/" style={linkStyle} end>Home</NavLink>
        <span style={sectionLabel}>| EXAMINATION |</span>
        <NavLink to="/exam/subjects"   style={linkStyle}>Subjects</NavLink>
        <NavLink to="/exam/schedule"   style={linkStyle}>Schedule</NavLink>
        <NavLink to="/exam/approval"   style={linkStyle}>Approval</NavLink>
        <NavLink to="/exam/public"     style={linkStyle}>Public View</NavLink>
        <NavLink to="/exam/attendance" style={linkStyle}>Attendance</NavLink>
        <span style={sectionLabel}>| MARKS |</span>
        <NavLink to="/marks/config"    style={linkStyle}>Mark Config</NavLink>
        <NavLink to="/marks/entry"     style={linkStyle}>Marks Entry</NavLink>
        <NavLink to="/marks/approval"  style={linkStyle}>Marks Approval</NavLink>
        <NavLink to="/marks/marksheet" style={linkStyle}>Marksheet</NavLink>
      </nav>

      <div style={pageWrap}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Examination Module — CourseTermSelector inside each component */}
          <Route path="/exam/subjects"   element={<SubjectList />} />
          <Route path="/exam/schedule"   element={<ScheduleForm   createdBy={USER_ID} />} />
          <Route path="/exam/approval"   element={<ScheduleApproval currentUserId={USER_ID} />} />
          <Route path="/exam/public"     element={<SchedulePublic />} />
          <Route path="/exam/attendance" element={<AttendanceEntry currentUserId={USER_ID} />} />

          {/* Marks Module */}
          <Route path="/marks/config"    element={<SubjectMarkConfig createdBy={USER_ID} />} />
          <Route path="/marks/entry"     element={<MarksEntryGrid    currentUserId={USER_ID} />} />
          <Route path="/marks/approval"  element={<MarksApproval     currentUserId={USER_ID} />} />
          <Route path="/marks/marksheet" element={<MarksheetView     currentUserId={USER_ID} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
