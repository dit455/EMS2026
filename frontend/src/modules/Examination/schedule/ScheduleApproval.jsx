import React, { useEffect, useState } from 'react';
import { getSchedule, submitApproval, approveSchedule, publishSchedule } from '../examinationApi';

export default function ScheduleApproval({ courseId, termId, currentUserId }) {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => { fetchSchedules(); }, [courseId, termId]);

  const fetchSchedules = async () => {
    const res = await getSchedule(courseId, termId);
    setSchedules(res.data);
  };

  const handleSubmit   = async (id) => { await submitApproval(id);               fetchSchedules(); };
  const handleApprove  = async (id) => { await approveSchedule(id, currentUserId); fetchSchedules(); };
  const handlePublish  = async (id) => { await publishSchedule(id);              fetchSchedules(); };

  const statusBadge = (status) => {
    const colors = { draft: '#6c757d', pending_approval: '#fd7e14', approved: '#198754', published: '#0d6efd', disabled: '#adb5bd' };
    return <span style={{ background: colors[status] || '#ccc', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
  };

  return (
    <div>
      <h3>Examination Schedule Approval</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Subject</th><th>Type</th><th>Date</th><th>Time</th><th>Venue</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id}>
              <td>{s.subject_id}</td>
              <td>{s.exam_type}</td>
              <td>{s.exam_date}</td>
              <td>{s.start_time} – {s.end_time}</td>
              <td>{s.venue}</td>
              <td>{statusBadge(s.status)}</td>
              <td>
                {s.status === 'draft'            && <button onClick={() => handleSubmit(s.id)}>Submit for Approval</button>}
                {s.status === 'pending_approval' && <button onClick={() => handleApprove(s.id)}>Approve</button>}
                {s.status === 'approved'         && <button onClick={() => handlePublish(s.id)}>Publish</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
