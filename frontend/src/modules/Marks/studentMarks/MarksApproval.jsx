import React, { useEffect, useState } from 'react';
import { getExamMarks, approveMarks } from '../marksApi';

export default function MarksApproval({ examScheduleId, currentUserId }) {
  const [marksByStudent, setMarksByStudent] = useState({});

  useEffect(() => {
    getExamMarks(examScheduleId).then((res) => {
      const grouped = {};
      res.data.forEach((m) => {
        if (!grouped[m.student_id]) grouped[m.student_id] = [];
        grouped[m.student_id].push(m);
      });
      setMarksByStudent(grouped);
    });
  }, [examScheduleId]);

  const handleApprove = async (studentId) => {
    const signature = prompt('Enter your digital signature / OTP to approve:');
    if (!signature) return;
    try {
      await approveMarks(examScheduleId, studentId, {
        approved_by: currentUserId,
        digital_signature: signature,
      });
      alert('Marks approved and digitally signed');
    } catch (err) {
      alert(err.response?.data?.error || 'Approval failed');
    }
  };

  return (
    <div>
      <h3>Marks Approval</h3>
      {Object.entries(marksByStudent).map(([studentId, marks]) => {
        const allApproved = marks.every((m) => m.status === 'approved');
        return (
          <div key={studentId} style={{ border: '1px solid #dee2e6', margin: '8px 0', padding: '10px', borderRadius: '4px' }}>
            <strong>Student ID: {studentId}</strong>
            <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '6px' }}>
              <thead><tr><th>Subject</th><th>Division</th><th>Marks</th><th>Result</th><th>Status</th></tr></thead>
              <tbody>
                {marks.map((m) => (
                  <tr key={m.id}>
                    <td>{m.subject_id}</td>
                    <td>{m.division_name}</td>
                    <td>{m.marks_obtained}</td>
                    <td>{m.is_pass ? '✅ Pass' : '❌ Fail'}</td>
                    <td>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!allApproved && (
              <button onClick={() => handleApprove(studentId)} style={{ marginTop: '8px' }}>
                Approve & Digitally Sign
              </button>
            )}
            {allApproved && <span style={{ color: 'green', marginTop: '8px', display: 'block' }}>✅ Approved</span>}
          </div>
        );
      })}
    </div>
  );
}
