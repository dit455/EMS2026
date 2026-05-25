import React from 'react';
import { Icon } from '../../components';

export default function Stepper({ steps, currentStep, completedStep, onStepClick }) {
  return (
    <div className="mtpg-stepper-timeline" role="group" aria-label="Student registration stages">
      <ol className="mtpg-stepper" aria-label="Student registration stages">
        {steps.map((step, index) => {
          const active = index === currentStep;
          const complete = index < currentStep || index <= completedStep;
          const pending = index > completedStep + 1;
          return (
            <li key={step} className={`${active ? 'is-active' : ''} ${complete ? 'is-complete' : ''} ${pending ? 'is-pending' : ''}`}>
              <button
                type="button"
                onClick={() => onStepClick(index)}
                disabled={pending}
              aria-current={active ? 'step' : undefined}
            >
              <span>{complete ? <Icon name="check" size={14} /> : index + 1}</span>
              <div className="mtpg-stepper-copy">
                <strong>{step}</strong>
                <small>{active ? 'Current' : complete ? 'Completed' : 'Pending'}</small>
              </div>
            </button>
          </li>
        );
        })}
      </ol>
    </div>
  );
}
