import React from 'react';

// Clean, minimal glass — no cheap sheen tricks. Just depth via shadow.
const base = {
  width: '100%',
  borderRadius: 999,
  border: 'none',
  cursor: 'pointer',
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: 600,
  letterSpacing: '-0.02em',
  position: 'relative',
  transition: 'opacity 0.15s, transform 0.15s',
  WebkitTapHighlightColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export function BtnPrimary({ children, onClick, disabled, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        padding: '17px 24px',
        fontSize: 15,
        color: disabled ? 'rgba(15,28,28,0.3)' : '#0F1C1C',
        background: disabled
          ? 'rgba(255,255,255,0.07)'
          : '#7EC8C8',
        boxShadow: disabled ? 'none' : '0 1px 0 rgba(255,255,255,0.4) inset, 0 -1px 0 rgba(0,0,0,0.15) inset, 0 0 0 1px rgba(126,200,200,0.5), 0 4px 20px rgba(45,107,107,0.5)',
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...base,
        padding: '16px 24px',
        fontSize: 15,
        fontWeight: 500,
        color: 'rgba(238,234,227,0.5)',
        background: 'transparent',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
