import React, { useEffect, useState } from 'react';
import { getCourses, getTerms } from './sharedApi';

export default function CourseTermSelector({ onChange }) {
  const [courses, setCourses]   = useState([]);
  const [terms, setTerms]       = useState([]);
  const [courseId, setCourseId] = useState('');
  const [termId, setTermId]     = useState('');

  useEffect(() => {
    getCourses()
      .then(r => setCourses(r.data))
      .catch(() => setCourses([]));
  }, []);

  const handleCourse = async (e) => {
    const id = e.target.value;
    setCourseId(id);
    setTermId('');
    if (id) {
      const r = await getTerms(id).catch(() => ({ data: [] }));
      setTerms(r.data);
    }
  };

  const handleTerm = (e) => {
    const id = e.target.value;
    setTermId(id);
    if (courseId && id) onChange({ courseId, termId: id });
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Course</label>
        <select value={courseId} onChange={handleCourse} style={selectStyle}>
          <option value="">-- Select Course --</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '4px' }}>Term</label>
        <select value={termId} onChange={handleTerm} disabled={!courseId} style={selectStyle}>
          <option value="">-- Select Term --</option>
          {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
    </div>
  );
}

const selectStyle = {
  padding: '8px 12px', borderRadius: '4px',
  border: '1px solid #ced4da', fontSize: '14px', minWidth: '180px'
};
