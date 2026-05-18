import React, { useState } from 'react';
import { addSubject } from '../examinationApi';

export default function SubjectAssign({ courseId, termId, createdBy, onSuccess }) {
  const [form, setForm] = useState({ subject_id: '', effective_start_date: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSubject({ ...form, course_id: courseId, term_id: termId, created_by: createdBy });
      alert('Subject assigned to term');
      setForm({ subject_id: '', effective_start_date: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign subject');
    }
  };

  return (
    <div>
      <h3>Assign Subject to Term</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject ID:</label>
          <input
            type="number"
            value={form.subject_id}
            onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Effective Start Date:</label>
          <input
            type="date"
            value={form.effective_start_date}
            onChange={(e) => setForm({ ...form, effective_start_date: e.target.value })}
            required
          />
        </div>
        <button type="submit">Assign Subject</button>
      </form>
    </div>
  );
}
