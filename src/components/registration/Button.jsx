import React from 'react';

export default function Button({ children, tone = 'primary', loading = false, disabled = false, className = '', ...props }) {
  return (
    <button
      className={`mtpg-wizard-btn mtpg-wizard-btn--${tone} ${className}`}
      type="button"
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
}
