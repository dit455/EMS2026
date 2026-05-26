import React, { useId } from 'react';
import { Icon } from '../../components';

export default function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  options,
  required,
  placeholder,
  helper,
  readOnly = false,
  inputMode,
  maxLength,
  icon = 'info',
}) {
  const id = useId();
  const hasValue = String(value || '').trim().length > 0;
  const shouldFloat = hasValue || Boolean(options) || ['date', 'datetime-local', 'month', 'time', 'week'].includes(type);
  const valid = hasValue && !error;
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined;

  return (
    <label className={`mtpg-form-input mtpg-form-input--floating ${shouldFloat ? 'has-value' : ''} ${error ? 'has-error' : ''} ${valid ? 'is-valid' : ''}`} htmlFor={id}>
      <span className="mtpg-input-icon"><Icon name={icon} size={15} /></span>
      {options ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={readOnly}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        >
          <option value="">Select {label}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          required={required}
          readOnly={readOnly}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
      )}
      <span className="mtpg-floating-label">{label}{required ? ' *' : ''}</span>
      {valid && <b className="mtpg-input-valid"><Icon name="checkCircle" size={13} /> Valid</b>}
      {helper && !error && <em id={`${id}-helper`}>{helper}</em>}
      {error && <small id={`${id}-error`}><Icon name="alertCircle" size={13} /> {error}</small>}
    </label>
  );
}
