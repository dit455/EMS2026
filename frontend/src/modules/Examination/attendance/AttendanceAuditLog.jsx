import React, { useEffect, useState } from 'react';
import { getAttendanceAudit } from '../examinationApi';

export default function AttendanceAuditLog({ attendanceId }) {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    getAttendanceAudit(attendanceId).then((res) => setTrail(res.data));
  }, [attendanceId]);

  if (trail.length === 0) return <p>No audit trail found.</p>;

  return (
    <div>
      <h4>Attendance Audit Trail</h4>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Changed By</th><th>Old Value</th><th>New Value</th><th>Reason</th><th>Date</th></tr>
        </thead>
        <tbody>
          {trail.map((t) => (
            <tr key={t.id}>
              <td>{t.edited_by}</td>
              <td>{t.old_is_present ? 'Present' : 'Absent'}</td>
              <td>{t.new_is_present ? 'Present' : 'Absent'}</td>
              <td>{t.edit_reason}</td>
              <td>{new Date(t.edited_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
