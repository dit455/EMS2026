import React, { useEffect, useState } from 'react';
import { getSubjects, removeSubject } from '../examinationApi';
import CourseTermSelector from '../../../shared/CourseTermSelector';

export default function SubjectList() {
  const [selection, setSelection] = useState(null);  // { courseId, termId }
  const [subjects, setSubjects]   = useState([]);

  useEffect(() => {
    if (selection) fetchSubjects();
  }, [selection]);

  const fetchSubjects = async () => {
    const res = await getSubjects(selection.courseId, selection.termId).catch(() => ({ data: [] }));
    setSubjects(res.data);
  };

  const handleRemove = async (id) => {
    const endDate = prompt('Enter effective end date (YYYY-MM-DD):');
    if (!endDate) return;
    await removeSubject(id, endDate);
    fetchSubjects();
  };

  return (
    <div>
      <h3>Subjects for Term</h3>
      <CourseTermSelector onChange={setSelection} />

      {!selection && <p style={{ color: '#888' }}>Select a course and term to view subjects.</p>}

      {selection && (
        subjects.length === 0 ? <p>No subjects assigned yet.</p> : (
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Subject ID</th><th>Effective Start</th><th>Effective End</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td>{s.subject_id}</td>
                  <td>{s.effective_start_date}</td>
                  <td>{s.effective_end_date || '—'}</td>
                  <td>{s.is_active ? 'Active' : 'Removed'}</td>
                  <td>{s.is_active && <button onClick={() => handleRemove(s.id)}>Remove</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
