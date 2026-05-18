import React, { useEffect, useState } from 'react';
import { getConfigAudit } from '../marksApi';

export default function SubjectMarkHistory({ configId }) {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    getConfigAudit(configId).then((res) => setTrail(res.data));
  }, [configId]);

  if (trail.length === 0) return <p>No change history found.</p>;

  return (
    <div>
      <h4>Subject Mark Change History</h4>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Old Max</th><th>New Max</th><th>Old Pass</th><th>New Pass</th><th>Effective Date</th><th>Changed By</th><th>Reason</th><th>Date</th></tr>
        </thead>
        <tbody>
          {trail.map((t) => (
            <tr key={t.id}>
              <td>{t.old_max_marks}</td>
              <td>{t.new_max_marks}</td>
              <td>{t.old_pass_marks}</td>
              <td>{t.new_pass_marks}</td>
              <td>{t.effective_start_date}</td>
              <td>{t.changed_by}</td>
              <td>{t.change_reason}</td>
              <td>{new Date(t.changed_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
