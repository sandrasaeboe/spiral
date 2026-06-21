import React from 'react';

export function OrbMain() {
  return (
    <>
      {/* outer glow */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        width: 360, height: 360, top: 100,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle at 40% 40%, rgba(126,200,200,0.35) 0%, rgba(45,107,107,0.12) 55%, transparent 75%)',
        filter: 'blur(32px)',
        animation: 'orbFloat 10s ease-in-out infinite reverse',
      }} />
      {/* main orb */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        width: 240, height: 240, top: 130,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle at 38% 35%, #7EC8C8 0%, #2D6B6B 45%, #1A3A3A 100%)',
        boxShadow: '0 0 100px rgba(45,107,107,0.4), 0 0 40px rgba(126,200,200,0.15)',
        animation: 'orbFloat 8s ease-in-out infinite',
      }} />
    </>
  );
}

export function OrbSmall({ style = {} }) {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
      background: 'radial-gradient(circle at 38% 35%, #7EC8C8, #2D6B6B)',
      boxShadow: '0 0 40px rgba(45,107,107,0.35)',
      animation: 'orbFloatFree 6s ease-in-out infinite',
      ...style,
    }} />
  );
}

// OrbBreathing — uses requestAnimationFrame for silky smooth continuous scale
export function OrbBreathing({ running, phase, phaseDuration, phaseStart }) {
  const ref = React.useRef(null);
  const rafRef = React.useRef(null);

  // Inject idle keyframe once
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('orb-idle-kf')) {
      const s = document.createElement('style');
      s.id = 'orb-idle-kf';
      s.textContent = '@keyframes orbIdlePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}';
      document.head.appendChild(s);
    }
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!running) {
      cancelAnimationFrame(rafRef.current);
      el.style.transition = 'none';
      el.style.animation = 'orbIdlePulse 5s ease-in-out infinite';
      return;
    }

    // Stop CSS animation
    el.style.animation = 'none';
    el.style.transition = 'none';

    const SCALE_IN   = 1.42;  // max inhale
    const SCALE_OUT  = 1.0;   // back to start after exhale

    const tick = (now) => {
      const elapsed = (now - phaseStart) / 1000; // seconds since phase began
      const t = Math.min(elapsed / phaseDuration, 1); // 0→1

      let scale;
      if (phase === 0) {
        // Breathe in: 1.0 → 1.42 with ease-in-out
        scale = SCALE_OUT + easeInOut(t) * (SCALE_IN - SCALE_OUT);
      } else if (phase === 1) {
        // Hold: stay at 1.42
        scale = SCALE_IN;
      } else {
        // Breathe out: 1.42 → 1.0 with ease-in-out
        scale = SCALE_IN + easeInOut(t) * (SCALE_OUT - SCALE_IN);
      }

      el.style.transform = `scale(${scale.toFixed(4)})`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, phase, phaseDuration, phaseStart]);

  return (
    <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', width: 360, height: 360,
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle at 40% 40%, rgba(126,200,200,0.35) 0%, rgba(45,107,107,0.12) 55%, transparent 75%)',
        filter: 'blur(32px)',
      }} />
      <div ref={ref} style={{
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 35%, #7EC8C8 0%, #2D6B6B 45%, #1A3A3A 100%)',
        boxShadow: '0 0 100px rgba(45,107,107,0.4), 0 0 40px rgba(126,200,200,0.15)',
        transformOrigin: 'center center',
        position: 'relative', zIndex: 1,
      }} />
    </div>
  );
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
