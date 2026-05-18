import React, { useState } from 'react';
import { editAttendance } from '../examinationApi';

export default function AttendanceEdit({ attendanceId, currentValue, editedBy, onSuccess }) {
  const [isPresent, setIsPresent] = useState(currentValue);
  const [reason, setReason]       = useState('');

  const handleSave = async () => {
    if (!reason.trim()) return alert('Please provide a reason for this change');
    try {
      await editAttendance(attendanceId, { is_present: isPresent, edited_by: editedBy, reason });
      alert('Attendance updated. Audit trail saved.');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update attendance');
    }
  };

  return (
    <div style={{ border: '1px solid #dee2e6', padding: '12px', borderRadius: '4px' }}>
      <h4>Edit Attendance (Officials Only)</h4>
      <div>
        <label>Attendance Status: </label>
        <select value={isPresent ? 'present' : 'absent'} onChange={(e) => setIsPresent(e.target.value === 'present')}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>
      <div style={{ marginTop: '8px' }}>
        <label>Reason for Change:</label>
        <textarea
          rows={3}
          style={{ width: '100%', marginTop: '4px' }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Required: explain why attendance is being changed"
        />
      </div>
      <button onClick={handleSave} style={{ marginTop: '8px' }}>Save Change</button>
    </div>
  );
}
