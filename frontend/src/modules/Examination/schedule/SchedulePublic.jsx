import React, { useState } from 'react';
import { downloadSchedule } from '../examinationApi';

export default function SchedulePublic() {
  const [courseId, setCourseId] = useState('');
  const [termId, setTermId]     = useState('');
  const [schedules, setSchedules] = useState([]);
  const [searched, setSearched]   = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await downloadSchedule(courseId, termId);
    setSchedules(res.data);
    setSearched(true);
  };

  return (
    <div>
      <h3>Download Examination Schedule</h3>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} required />
        <input placeholder="Term ID"   value={termId}   onChange={(e) => setTermId(e.target.value)}   required />
        <button type="submit">Search</button>
      </form>

      {searched && schedules.length === 0 && <p>No published schedule found.</p>}

      {schedules.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th>Subject</th><th>Type</th><th>Date</th><th>Start</th><th>End</th><th>Venue</th></tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id}>
                <td>{s.subject_id}</td>
                <td>{s.exam_type}</td>
                <td>{s.exam_date}</td>
                <td>{s.start_time}</td>
                <td>{s.end_time}</td>
                <td>{s.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
