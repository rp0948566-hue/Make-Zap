import React from 'react';
import { StarIcon } from './Icons';

export const BadgeComponent = () => {
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 14px 4px 5px',
        backgroundColor: '#ffffff',
        borderRadius: '9999px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        gap: '10px',
        fontFamily: "'Inter', sans-serif",
        lineHeight: '1',
        userSelect: 'none'
      }}
    >
      {/* Dark inner pill */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#0e1311',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontWeight: 500,
          fontSize: '12px'
        }}
      >
        <StarIcon className="w-3 h-3" />
        <span>New</span>
      </div>

      {/* Light text */}
      <span style={{ fontWeight: 400, fontSize: '14px', color: '#000000' }}>
        Discover what's possible
      </span>
    </div>
  );
};
