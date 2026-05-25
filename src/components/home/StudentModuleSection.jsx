import React from 'react';
import { Icon } from '../../components';
import { scrollToSection } from '../../utils/actions';

export default function StudentModuleSection({ highlights, onStart }) {
  return (
    <section className="mtpg-section" id="student-module">
      <div className="mtpg-section-head">
        <span>Public Student Services</span>
        <h2>Student Module Services</h2>
        <p>
          The public portal supports student registration, education details entry, document upload,
          verification tracking, approval workflow status, and unique student registration number generation.
        </p>
      </div>
      <div className="mtpg-student-grid">
        {highlights.map((item, index) => (
          <article key={item.title} className="mtpg-feature-card" style={{ '--card-accent-index': index }}>
            <span><Icon name={item.icon} size={22} /></span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <div className="mtpg-card-actions">
              <button type="button" onClick={() => scrollToSection('student-workflow')}>Learn More</button>
              <button type="button" onClick={onStart}>Start</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
