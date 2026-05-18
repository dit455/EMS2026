import React, { useState } from 'react';
import { markBulkAttendance } from '../examinationApi';

export default function AttendanceEntry({ examScheduleId, students }) {
  const [attendance, setAttendance] = useState(
    students.map((s) => ({ student_id: s.id, is_present: false, name: s.name }))
  );

  const toggle = (studentId) => {
    setAttendance((prev) =>
      prev.map((a) => a.student_id === studentId ? { ...a, is_present: !a.is_present } : a)
    );
  };

  const handleSubmit = async () => {
    try {
      await markBulkAttendance({ exam_schedule_id: examScheduleId, attendance });
      alert('Attendance saved successfully');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save attendance');
    }
  };

  const presentCount = attendance.filter((a) => a.is_present).length;

  return (
    <div>
      <h3>Mark Examination Attendance</h3>
      <p>Present: {presentCount} / {attendance.length}</p>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Student Name</th><th>Present</th></tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a.student_id}>
              <td>{a.name}</td>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={a.is_present}
                  onChange={() => toggle(a.student_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit} style={{ marginTop: '12px' }}>Save Attendance</button>
    </div>
  );
}
