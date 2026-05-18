import React, { useEffect, useState } from 'react';
import { getMarksAudit, editMark } from '../marksApi';

export default function MarksEditLog({ marksId, editedBy }) {
  const [trail, setTrail]   = useState([]);
  const [editing, setEditing] = useState(false);
  const [newMarks, setNewMarks] = useState('');
  const [reason, setReason]    = useState('');

  useEffect(() => {
    getMarksAudit(marksId).then((res) => setTrail(res.data));
  }, [marksId]);

  const handleEdit = async (e) => {
    e.preventDefault();
    const signature = prompt('Enter digital signature to confirm change:');
    if (!signature) return;
    try {
      await editMark(marksId, {
        marks_obtained: parseFloat(newMarks),
        edited_by: editedBy,
        digital_signature: signature,
        reason,
      });
      alert('Mark updated. Audit trail saved.');
      setEditing(false);
      getMarksAudit(marksId).then((res) => setTrail(res.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Edit failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>Mark Change Log</h4>
        <button onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit Mark'}</button>
      </div>

      {editing && (
        <form onSubmit={handleEdit} style={{ background: '#f8f9fa', padding: '10px', marginBottom: '12px', borderRadius: '4px' }}>
          <input type="number" placeholder="New marks" value={newMarks} onChange={(e) => setNewMarks(e.target.value)} required />
          <input type="text" placeholder="Reason for change" value={reason} onChange={(e) => setReason(e.target.value)} required style={{ marginLeft: '8px', width: '250px' }} />
          <button type="submit" style={{ marginLeft: '8px' }}>Submit Change</button>
        </form>
      )}

      {trail.length === 0 ? <p>No changes made yet.</p> : (
        <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Old Marks</th><th>New Marks</th><th>Changed By</th><th>Reason</th><th>Date</th></tr></thead>
          <tbody>
            {trail.map((t) => (
              <tr key={t.id}>
                <td>{t.old_marks}</td>
                <td>{t.new_marks}</td>
                <td>{t.edited_by}</td>
                <td>{t.edit_reason}</td>
                <td>{new Date(t.edited_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
