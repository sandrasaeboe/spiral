import React, { useState, useEffect, useRef } from 'react';
import { BtnPrimary, BtnSecondary } from '../components/GlassButton';
import { OrbSmall } from '../components/Orb';

// 4-7-8 timing in seconds
const PHASE_DURATIONS = [4, 7, 8]; // in, hold, out
const PHASE_NAMES     = ['Breathe in', 'Hold', 'Breathe out'];
const PHASE_HINTS     = ['Deep breath in through the nose', 'Hold still', 'Slowly out through the mouth'];
const TOTAL_ROUNDS    = 4;
const CYCLE_DURATION  = PHASE_DURATIONS.reduce((a, b) => a + b, 0); // 19s per cycle
const COUNTDOWN_SECS  = 3;

// Given elapsed seconds into a cycle, return {phase, progress (0→1), secondsLeft}
function getCycleState(elapsed) {
  const inCycle = elapsed % CYCLE_DURATION;
  let acc = 0;
  for (let i = 0; i < PHASE_DURATIONS.length; i++) {
    acc += PHASE_DURATIONS[i];
    if (inCycle < acc) {
      const phaseElapsed = inCycle - (acc - PHASE_DURATIONS[i]);
      const progress     = phaseElapsed / PHASE_DURATIONS[i];
      const secondsLeft  = Math.ceil(PHASE_DURATIONS[i] - phaseElapsed);
      return { phase: i, progress, secondsLeft };
    }
  }
  return { phase: 0, progress: 0, secondsLeft: PHASE_DURATIONS[0] };
}

// Smooth continuous scale from the sine of the 4-7-8 cycle.
// We map the cycle to a sine wave that:
//   - rises from 0→1 during "in" (0–4s)
//   - stays at 1 during "hold" (4–11s)
//   - falls from 1→0 during "out" (11–19s)
// Then lerp scale between MIN_SCALE and MAX_SCALE.
const MIN_SCALE = 1.0;
const MAX_SCALE = 1.32;

function getScale(elapsed) {
  const inCycle = elapsed % CYCLE_DURATION;
  const inDur = PHASE_DURATIONS[0]; // 4
  const holdDur = PHASE_DURATIONS[1]; // 7
  const outDur = PHASE_DURATIONS[2]; // 8

  let t; // 0→1 breath amount
  if (inCycle <= inDur) {
    // Breathe in: ease in-out from 0→1
    t = easeInOut(inCycle / inDur);
  } else if (inCycle <= inDur + holdDur) {
    // Hold: stay at 1
    t = 1;
  } else {
    // Breathe out: ease in-out from 1→0
    t = 1 - easeInOut((inCycle - inDur - holdDur) / outDur);
  }
  return MIN_SCALE + t * (MAX_SCALE - MIN_SCALE);
}

// Cubic ease-in-out but biased to feel slower — never rushes
function easeInOut(t) {
  return t * t * (3 - 2 * t); // smoothstep — no sharp acceleration
}

export default function Breathing({ setPage }) {
  const [stage,     setStage]     = useState('idle');    // idle | countdown | running | done
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const [phase,     setPhase]     = useState(0);
  const [count,     setCount]     = useState(PHASE_DURATIONS[0]);
  const [round,     setRound]     = useState(1);

  const orbRef        = useRef(null);
  const rafRef        = useRef(null);
  const startTimeRef  = useRef(null);
  const countdownRef  = useRef(null);
  const lastPhaseRef  = useRef(-1);
  const lastCountRef  = useRef(PHASE_DURATIONS[0]);

  // rAF loop — runs when stage === 'running'
  const startRaf = (startTime) => {
    const loop = (now) => {
      const elapsed = (now - startTime) / 1000;
      const totalElapsed = elapsed;
      const cyclesDone   = Math.floor(totalElapsed / CYCLE_DURATION);

      if (cyclesDone >= TOTAL_ROUNDS) {
        setStage('done');
        return;
      }

      // Animate orb
      if (orbRef.current) {
        orbRef.current.style.transform = `scale(${getScale(totalElapsed).toFixed(4)})`;
      }

      // Update phase/count display (only when changed to avoid excess renders)
      const { phase: p, secondsLeft } = getCycleState(totalElapsed);
      const currentRound = cyclesDone + 1;
      if (p !== lastPhaseRef.current) { lastPhaseRef.current = p; setPhase(p); }
      if (secondsLeft !== lastCountRef.current) { lastCountRef.current = secondsLeft; setCount(secondsLeft); }
      if (currentRound !== round) setRound(currentRound);

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const start = () => {
    setStage('countdown');
    setCountdown(COUNTDOWN_SECS);
    let c = COUNTDOWN_SECS;
    countdownRef.current = setInterval(() => {
      c--;
      if (c <= 0) {
        clearInterval(countdownRef.current);
        const now = performance.now();
        startTimeRef.current = now;
        lastPhaseRef.current = -1;
        lastCountRef.current = PHASE_DURATIONS[0];
        setPhase(0);
        setCount(PHASE_DURATIONS[0]);
        setRound(1);
        setStage('running');
        startRaf(now);
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(countdownRef.current);
    if (orbRef.current) orbRef.current.style.transform = 'scale(1)';
    setStage('idle');
    setCountdown(COUNTDOWN_SECS);
    setPhase(0);
    setCount(PHASE_DURATIONS[0]);
    setRound(1);
  };

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const pageStyle  = { background: '#0F1C1C', minHeight: '100vh', display: 'flex', flexDirection: 'column' };
  const innerStyle = { padding: '88px 28px 160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 };

  // ── DONE ──
  if (stage === 'done') return (
    <div style={{...pageStyle, position: 'relative'}}>
      {/* Back to home */}
      <button
        onClick={() => setPage('home')}
        style={{
          position: 'absolute', top: 28, left: 24, zIndex: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Home"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(238,234,227,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <div style={innerStyle}>
        <OrbSmall />
        <div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.05em', color: '#EEEAE3', marginBottom: 8 }}>
            Done<span style={{ color: '#7EC8C8' }}>.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(238,234,227,0.32)', marginBottom: 36, lineHeight: 1.6 }}>
            Your nervous system has reset.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <BtnPrimary onClick={() => setPage('history')}>See log →</BtnPrimary>
            <BtnSecondary onClick={reset}>Again</BtnSecondary>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{...pageStyle, position: 'relative'}}>
      {/* Back to home */}
      <button
        onClick={() => setPage('home')}
        style={{
          position: 'absolute', top: 28, left: 24, zIndex: 20,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label="Home"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(238,234,227,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <div style={innerStyle}>

        {/* Top */}
        {stage === 'running' ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 36 }}>
            {PHASE_DURATIONS.map((dur, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em', color: phase === i ? '#EEEAE3' : 'rgba(238,234,227,0.1)', transition: 'color 0.5s' }}>{dur}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: phase === i ? '#7EC8C8' : 'rgba(238,234,227,0.1)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3, transition: 'color 0.5s' }}>
                  {PHASE_NAMES[i].split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(238,234,227,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>4 – 7 – 8</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.04, color: '#EEEAE3' }}>Breathing<br />exercise.</h2>
          </div>
        )}

        {/* Orb — same gradient/glow as home, scale driven by rAF */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {/* outer glow */}
          <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(126,200,200,0.35) 0%, rgba(45,107,107,0.12) 55%, transparent 75%)', filter: 'blur(32px)', pointerEvents: 'none' }} />
          {/* orb */}
          <div ref={orbRef} style={{
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 35%, #7EC8C8 0%, #2D6B6B 45%, #1A3A3A 100%)',
            boxShadow: '0 0 100px rgba(45,107,107,0.4), 0 0 40px rgba(126,200,200,0.15)',
            transformOrigin: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            position: 'relative', zIndex: 1,
          }}>
            {stage === 'countdown' && (
              <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.8)', lineHeight: 1 }}>{countdown}</div>
            )}
            {stage === 'running' && (
              <>
                <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 5 }}>{PHASE_NAMES[phase]}</div>
              </>
            )}
          </div>
        </div>

        {/* Bottom */}
        {stage === 'running' ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(238,234,227,0.38)' }}>{PHASE_HINTS[phase]}</p>
            <p style={{ fontSize: 11, color: 'rgba(238,234,227,0.18)', marginTop: 6 }}>Round {round} / {TOTAL_ROUNDS}</p>
          </div>
        ) : stage === 'countdown' ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'rgba(238,234,227,0.3)' }}>Get ready…</p>
          </div>
        ) : (
          <BtnPrimary onClick={start}>Start</BtnPrimary>
        )}

      </div>
    </div>
  );
}
