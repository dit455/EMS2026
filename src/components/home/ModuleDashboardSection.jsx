import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Icon } from '../../components';

export default function ModuleDashboardSection({ modules }) {
  return (
    <section className="mtpg-section" id="dashboard-modules">
      <div className="mtpg-section-head">
        <span>Institutional Modules</span>
        <h2>Dashboard Module System</h2>
        <p>Module cards summarize the operational workflows required for student, examination, marks, administration, MIS, and data migration governance.</p>
      </div>
      <div className="mtpg-module-grid">
        {modules.map((module) => (
          <article key={module.title} className="mtpg-module-card">
            <div className="mtpg-module-card__head">
              <span><Icon name={module.icon} size={22} /></span>
              <div>
                <small>{module.ref}</small>
                <h3>{module.title}</h3>
              </div>
            </div>
            <ul>
              {module.items.map((item) => (
                <li key={item}><CheckCircle2 size={15} /> {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
