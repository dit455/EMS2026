import React, { useEffect, useState } from 'react';
import { getSubjects, removeSubject } from '../examinationApi';

export default function SubjectList({ courseId, termId }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (courseId && termId) fetchSubjects();
  }, [courseId, termId]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await getSubjects(courseId, termId);
      setSubjects(res.data);
    } catch (err) {
      alert('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    const endDate = prompt('Enter effective end date (YYYY-MM-DD):');
    if (!endDate) return;
    try {
      await removeSubject(id, endDate);
      fetchSubjects();
    } catch {
      alert('Failed to remove subject');
    }
  };

  if (loading) return <p>Loading subjects...</p>;

  return (
    <div>
      <h3>Subjects for Term</h3>
      {subjects.length === 0 ? (
        <p>No subjects assigned yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Subject ID</th>
              <th>Effective Start</th>
              <th>Effective End</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id}>
                <td>{s.subject_id}</td>
                <td>{s.effective_start_date}</td>
                <td>{s.effective_end_date || '—'}</td>
                <td>{s.is_active ? 'Active' : 'Removed'}</td>
                <td>
                  {s.is_active && (
                    <button onClick={() => handleRemove(s.id)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
