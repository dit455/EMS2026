import React from 'react';

export default function HolidayAlert({ message }) {
  return (
    <div style={{
      background: '#fff3cd', border: '1px solid #ffc107',
      padding: '10px 15px', borderRadius: '4px', marginBottom: '12px', color: '#856404'
    }}>
      <strong>Warning:</strong> {message}. You can still save, but please confirm with admin.
    </div>
  );
}
