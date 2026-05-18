import React, { useState } from 'react';
import { enterStudentMarks } from '../marksApi';
import PassFailIndicator from './PassFailIndicator';

export default function MarksEntryGrid({ examScheduleId, students, subjects, courseId, termId }) {
  const [results, setResults] = useState({});

  const handleEntry = async (studentId, subjectId, divisionName, marksObtained) => {
    try {
      const res = await enterStudentMarks({
        exam_schedule_id: examScheduleId,
        student_id: studentId,
        subject_id: subjectId,
        division_name: divisionName,
        marks_obtained: parseFloat(marksObtained),
        course_id: courseId,
        term_id: termId,
      });
      setResults((prev) => ({
        ...prev,
        [`${studentId}-${subjectId}-${divisionName}`]: res.data.result === 'Pass',
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save marks');
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <h3>Student Marks Entry</h3>
      <table border="1" cellPadding="8" style={{ minWidth: '800px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student</th>
            {subjects.map((s) =>
              s.divisions.map((d) => (
                <th key={`${s.id}-${d.name}`}>{s.name} — {d.name}<br /><small>(Max: {d.max_marks})</small></th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              {subjects.map((s) =>
                s.divisions.map((d) => {
                  const key = `${student.id}-${s.id}-${d.name}`;
                  return (
                    <td key={key} style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        max={d.max_marks}
                        style={{ width: '60px' }}
                        onBlur={(e) => {
                          if (e.target.value !== '') handleEntry(student.id, s.id, d.name, e.target.value);
                        }}
                      />
                      {results[key] !== undefined && (
                        <div style={{ marginTop: '4px' }}>
                          <PassFailIndicator isPassing={results[key]} />
                        </div>
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
