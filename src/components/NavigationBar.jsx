import React from 'react';

export const NavigationBar = ({ onLoginClick }) => {
  return (
    <nav 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 120px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Left: Logo */}
      <div 
        style={{
          fontFamily: "'Schibsted Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: '34px',
          letterSpacing: '-1.8px',
          color: '#000000',
          lineHeight: '1',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        Mark Zap
      </div>

      {/* Right side Log In button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onLoginClick}
          style={{
            fontFamily: "'Schibsted Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: '16px',
            letterSpacing: '-0.2px',
            color: '#ffffff',
            backgroundColor: '#000000',
            border: 'none',
            width: '101px',
            height: '42px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            transition: 'opacity 0.2s ease, transform 0.1s ease'
          }}
          className="btn-login"
        >
          Log In
        </button>
      </div>
    </nav>
  );
};
