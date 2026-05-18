import React from 'react';

export default function PassFailIndicator({ isPassing }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '12px',
      fontWeight: 'bold',
      fontSize: '13px',
      background: isPassing ? '#d1e7dd' : '#f8d7da',
      color: isPassing ? '#0f5132' : '#842029',
    }}>
      {isPassing ? 'Pass' : 'Fail'}
    </span>
  );
}
