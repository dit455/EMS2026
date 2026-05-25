import React from 'react';

export default function PendingTasksTable({ tasks }) {
  return (
    <section className="mtpg-section mtpg-section--compact">
      <div className="mtpg-section-head">
        <span>Workflow Queue</span>
        <h2>Pending Tasks</h2>
      </div>
      <div className="mtpg-table-shell">
        <table className="mtpg-table">
          <thead>
            <tr>
              {['Task ID', 'Module', 'Description', 'Assigned Role', 'Status', 'Priority', 'Action'].map((heading) => <th key={heading}>{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task[0]}>
                {task.map((cell, index) => (
                  <td key={`${task[0]}-${index}`}>
                    {index === 4 ? <span className={`mtpg-status mtpg-status--${String(cell).toLowerCase().replace(/\s+/g, '-')}`}>{cell}</span> : cell}
                  </td>
                ))}
                <td><button type="button">Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
