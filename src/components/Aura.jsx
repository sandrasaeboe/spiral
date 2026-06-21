import React from 'react';

export default function Aura({ colors, intensity = 0.6 }) {
  const defs = colors || ['#1A3A6B', '#2D1A6B'];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', width: '70%', height: '70%', top: '10%', left: '15%', borderRadius: '50%', background: defs[0], opacity: intensity * 0.55, filter: 'blur(60px)', mixBlendMode: 'screen', animation: 'orb1 18s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: '55%', height: '55%', top: '30%', left: '25%', borderRadius: '50%', background: defs[1], opacity: intensity * 0.45, filter: 'blur(60px)', mixBlendMode: 'screen', animation: 'orb2 22s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: '35%', height: '35%', top: '20%', left: '35%', borderRadius: '50%', background: defs[0], opacity: intensity * 0.3, filter: 'blur(60px)', mixBlendMode: 'screen', animation: 'orb3 14s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 25%, rgba(8,8,8,0.7) 75%, rgba(8,8,8,0.97) 100%)' }} />
    </div>
  );
}
