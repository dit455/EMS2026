import React from 'react';

export default function ActivityTimeline({ activities }) {
  return (
    <section className="mtpg-section mtpg-section--compact">
      <div className="mtpg-section-head">
        <span>Audit Trail</span>
        <h2>Recent Activity</h2>
      </div>
      <div className="mtpg-timeline">
        {activities.map(([time, title, detail]) => (
          <article key={`${time}-${title}`}>
            <span>{time}</span>
            <div>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
