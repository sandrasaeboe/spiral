import React from 'react';

export default function Nav({ page, setPage, onNewThought }) {
  const left  = { id: 'checkin',   label: 'CHECK-IN', icon: <><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></> };
  const right = { id: 'breathing', label: 'BREATHE',  icon: <><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8" strokeOpacity="0.35"/></> };

  const sideStyle = (id) => ({
    width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: page === id ? '#1A2A2A' : 'rgba(238,234,227,0.1)',
    color: page === id ? '#EEEAE3' : 'rgba(238,234,227,0.38)',
    transition: 'all 0.25s cubic-bezier(0.34,1.3,0.64,1)',
    boxShadow: page === id ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div style={{ position: 'fixed', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 300, display: 'flex', alignItems: 'flex-end', gap: 20 }}>

      {/* LEFT — Check-in */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
        <button onClick={() => setPage('checkin')} style={sideStyle('checkin')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {left.icon}
          </svg>
        </button>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: page === 'checkin' ? 'rgba(238,234,227,0.65)' : 'rgba(238,234,227,0.22)', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
          {left.label}
        </span>
      </div>

      {/* CENTER — New thought */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <button
          onClick={onNewThought}
          style={{
            width: 72, height: 72, borderRadius: '50%', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#1A2A2A',
            boxShadow: '0 6px 28px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.18s cubic-bezier(0.34,1.4,0.64,1)',
            WebkitTapHighlightColor: 'transparent',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onTouchStart={e => e.currentTarget.style.transform = 'scale(0.93)'}
          onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="rgba(238,234,227,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(238,234,227,0.5)', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
          NEW THOUGHT
        </span>
      </div>

      {/* RIGHT — Breathe */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
        <button onClick={() => setPage('breathing')} style={sideStyle('breathing')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {right.icon}
          </svg>
        </button>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: page === 'breathing' ? 'rgba(238,234,227,0.65)' : 'rgba(238,234,227,0.22)', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}>
          {right.label}
        </span>
      </div>

    </div>
  );
}
