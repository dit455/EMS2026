import React, { useState } from 'react';
import { createSubjectConfig } from '../marksApi';

const emptyDivision = { division_name: '', max_marks: '', pass_marks: '' };

export default function SubjectMarkConfig({ courseId, termId, subjectId, createdBy, onSuccess }) {
  const [divisions, setDivisions]   = useState([{ ...emptyDivision }]);
  const [totalMarks, setTotalMarks] = useState('');
  const [passLevel, setPassLevel]   = useState('subject');
  const [startDate, setStartDate]   = useState('');

  const addDivision = () => setDivisions([...divisions, { ...emptyDivision }]);

  const updateDivision = (index, field, value) => {
    setDivisions(divisions.map((d, i) => i === index ? { ...d, [field]: value } : d));
  };

  const divisionSum = divisions.reduce((sum, d) => sum + (parseInt(d.max_marks) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (divisionSum !== parseInt(totalMarks)) {
      return alert(`Division marks sum (${divisionSum}) must equal total marks (${totalMarks})`);
    }
    try {
      for (const div of divisions) {
        await createSubjectConfig({
          subject_id: subjectId, course_id: courseId, term_id: termId,
          division_name: div.division_name, max_marks: parseInt(div.max_marks),
          pass_marks: parseInt(div.pass_marks), pass_mark_level: passLevel,
          total_marks: parseInt(totalMarks), effective_start_date: startDate,
          created_by: createdBy
        });
      }
      alert('Subject mark config saved');
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save config');
    }
  };

  return (
    <div>
      <h3>Subject Mark Configuration</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total Marks for Subject:</label>
          <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} required />
        </div>
        <div>
          <label>Pass Mark Level:</label>
          <select value={passLevel} onChange={(e) => setPassLevel(e.target.value)}>
            <option value="subject">Overall Subject</option>
            <option value="division">Each Division Separately</option>
          </select>
        </div>
        <div>
          <label>Effective Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>

        <h4>Divisions <span style={{ color: divisionSum !== parseInt(totalMarks) ? 'red' : 'green' }}>
          (Sum: {divisionSum} / {totalMarks || '?'})
        </span></h4>

        {divisions.map((div, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
            <input placeholder="Division Name (e.g. Internal)" value={div.division_name}
              onChange={(e) => updateDivision(i, 'division_name', e.target.value)} required />
            <input type="number" placeholder="Max Marks" value={div.max_marks}
              onChange={(e) => updateDivision(i, 'max_marks', e.target.value)} required />
            <input type="number" placeholder="Pass Marks" value={div.pass_marks}
              onChange={(e) => updateDivision(i, 'pass_marks', e.target.value)} required />
          </div>
        ))}
        <button type="button" onClick={addDivision}>+ Add Division</button>
        <br /><br />
        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
}
