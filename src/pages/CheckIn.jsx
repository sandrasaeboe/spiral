import React, { useState } from 'react';
import { OrbSmall } from '../components/Orb';
import { BtnPrimary, BtnSecondary } from '../components/GlassButton';
import { useMoods } from '../hooks/useStorage';

const MOODS = [
  { score: 1, emoji: '😔', label: 'Very bad' },
  { score: 2, emoji: '😟', label: 'Bad' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Very good' },
];

const ACTIVITIES = [
  { id: 'workout',    icon: '🏃', label: 'Workout' },
  { id: 'social',     icon: '👥', label: 'Socialised' },
  { id: 'work',       icon: '💼', label: 'Work' },
  { id: 'nature',     icon: '🌿', label: 'Nature' },
  { id: 'creative',   icon: '🎨', label: 'Creative' },
  { id: 'screen',     icon: '📱', label: 'Lots of screen' },
  { id: 'alcohol',    icon: '🍷', label: 'Alcohol' },
  { id: 'meditation', icon: '🧘', label: 'Meditation' },
  { id: 'reading',    icon: '📖', label: 'Read' },
  { id: 'alone',      icon: '🌙', label: 'Alone time' },
  { id: 'conflict',   icon: '⚡', label: 'Conflict' },
  { id: 'goodsleep',  icon: '😴', label: 'Slept well' },
  { id: 'badsleep',   icon: '🥴', label: 'Slept badly' },
  { id: 'goodfood',   icon: '🥗', label: 'Ate well' },
];

const S = {
  page: { background: '#0F1C1C', minHeight: '100vh', position: 'relative', overflowX: 'hidden' },
  inner: { padding: '88px 24px 160px', display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  stepNum: { fontSize: 11, fontWeight: 600, color: 'rgba(238,234,227,0.22)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 },
  h: { fontSize: 34, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.04, color: '#EEEAE3', marginBottom: 8 },
  sub: { fontSize: 14, color: 'rgba(238,234,227,0.32)', marginBottom: 32, lineHeight: 1.5 },
  navBtns: { marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 },
  backBtn: { fontSize: 13, fontWeight: 500, color: '#7EC8C8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 28, textAlign: 'left', fontFamily: "'Inter', sans-serif" },
};

function Slider({ label, leftLabel, rightLabel, value, onChange }) {
  const pct = ((value - 1) / 4) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#EEEAE3', letterSpacing: '-0.02em' }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', color: '#7EC8C8' }}>{value}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 8 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'linear-gradient(90deg, #2D6B6B, #7EC8C8)', borderRadius: 3, width: pct + '%', boxShadow: '0 0 8px rgba(126,200,200,0.4)', transition: 'width 0.1s' }} />
        <input type="range" min="1" max="5" step="1" value={value} onChange={e => onChange(parseInt(e.target.value))}
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0, cursor: 'pointer', margin: 0, padding: 0 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'rgba(238,234,227,0.22)', fontWeight: 500 }}>{leftLabel}</span>
        <span style={{ fontSize: 11, color: 'rgba(238,234,227,0.22)', fontWeight: 500 }}>{rightLabel}</span>
      </div>
    </div>
  );
}

export default function CheckIn({ setPage }) {
  const { addMood, todayChecked } = useMoods();
  const [step,       setStep]       = useState(1);
  const [mood,       setMood]       = useState(null);
  const [energy,     setEnergy]     = useState(3);
  const [anxiety,    setAnxiety]    = useState(3);
  const [sleep,      setSleep]      = useState(3);
  const [focus,      setFocus]      = useState(3);
  const [activities, setActivities] = useState([]);
  const [note,       setNote]       = useState('');

  const toggleActivity = id => setActivities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const save = () => {
    setPage('history');
    // small delay so state saves first
    const m = MOODS[mood];
    addMood(m.score, m.emoji, m.label, note, { energy, anxiety, sleep, focus, activities });
    setStep(5);
  };

  const reset = () => { setStep(1); setMood(null); setEnergy(3); setAnxiety(3); setSleep(3); setFocus(3); setActivities([]); setNote(''); };

  if (todayChecked && step !== 5) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '0 28px', textAlign: 'center' }}>
        <OrbSmall style={{ margin: '0 auto 32px' }} />
        <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.05em', color: '#EEEAE3', marginBottom: 8 }}>Come back tomorrow.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 36 }}>
          <BtnPrimary onClick={() => setPage('history')}>See history</BtnPrimary>
          <BtnSecondary onClick={() => setPage('home')}>Home</BtnSecondary>
        </div>
      </div>
    </div>
  );

  // Step 1
  if (step === 1) return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={S.stepNum}>01 / 04</div>
        <h2 style={S.h}>How are<br />you today?</h2>
        <p style={S.sub}>Pick what feels right.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[...MOODS].reverse().map((m, i) => {
            const idx = 4 - i, sel = mood === idx;
            return (
              <button key={m.score} onClick={() => setMood(idx)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 999,
                background: sel ? 'rgba(126,200,200,0.1)' : 'rgba(255,255,255,0.04)',
                boxShadow: sel ? '0 1px 0 rgba(255,255,255,0.1) inset, 0 0 0 1px rgba(126,200,200,0.25)' : '0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(255,255,255,0.06)',
                transform: sel ? 'translateX(5px)' : 'none',
                transition: 'all 0.22s cubic-bezier(0.34,1.3,0.64,1)', cursor: 'pointer', border: 'none', textAlign: 'left',
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: sel ? '#7EC8C8' : 'rgba(238,234,227,0.18)', width: 16 }}>{m.score}</span>
                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 500, color: sel ? '#EEEAE3' : 'rgba(238,234,227,0.38)', letterSpacing: '-0.02em', flex: 1 }}>{m.label}</span>
                <span style={{ fontSize: 12, color: sel ? '#7EC8C8' : 'rgba(238,234,227,0.1)' }}>›</span>
              </button>
            );
          })}
        </div>
        {mood !== null && (
          <div style={S.navBtns}>
            <BtnPrimary onClick={() => setStep(2)}>Continue</BtnPrimary>
          </div>
        )}
      </div>
    </div>
  );

  // Step 2
  if (step === 2) return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={S.stepNum}>02 / 04</div>
        <h2 style={S.h}>How did your<br />body feel?</h2>
        <p style={S.sub}>Adjust the sliders.</p>
        <Slider label="Energy"  leftLabel="Exhausted" rightLabel="Energised" value={energy}  onChange={setEnergy} />
        <Slider label="Anxiety" leftLabel="Calm"      rightLabel="Stressed"  value={anxiety} onChange={setAnxiety} />
        <Slider label="Sleep"   leftLabel="Poor"      rightLabel="Great"     value={sleep}   onChange={setSleep} />
        <Slider label="Focus"   leftLabel="Scattered" rightLabel="Sharp"     value={focus}   onChange={setFocus} />
        <div style={S.navBtns}>
          <BtnPrimary onClick={() => setStep(3)}>Continue</BtnPrimary>
          <BtnSecondary onClick={() => setStep(1)}>← Back</BtnSecondary>
        </div>
      </div>
    </div>
  );

  // Step 3
  if (step === 3) return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={S.stepNum}>03 / 04</div>
        <h2 style={S.h}>What did you<br />do today?</h2>
        <p style={S.sub}>Select all that apply.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ACTIVITIES.map(a => {
            const sel = activities.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggleActivity(a.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: sel ? 'rgba(126,200,200,0.12)' : 'rgba(255,255,255,0.05)',
                boxShadow: sel ? '0 0 0 1px rgba(126,200,200,0.28), 0 1px 0 rgba(255,255,255,0.1) inset' : '0 0 0 1px rgba(255,255,255,0.07), 0 1px 0 rgba(255,255,255,0.07) inset',
                color: sel ? '#EEEAE3' : 'rgba(238,234,227,0.4)',
                fontSize: 13, fontWeight: 500, fontFamily: "'Inter', sans-serif",
                transform: sel ? 'scale(1.04)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34,1.3,0.64,1)',
              }}>
                <span style={{ fontSize: 15 }}>{a.icon}</span>{a.label}
              </button>
            );
          })}
        </div>
        <div style={S.navBtns}>
          <BtnPrimary onClick={() => setStep(4)}>Continue</BtnPrimary>
          <BtnSecondary onClick={() => setStep(2)}>← Back</BtnSecondary>
        </div>
      </div>
    </div>
  );

  // Step 4
  if (step === 4) return (
    <div style={S.page}>
      <div style={S.inner}>
        <div style={S.stepNum}>04 / 04</div>
        <h2 style={S.h}>Last<br />thought.</h2>
        <p style={S.sub}>Optional. What shaped today?</p>
        <div style={{ flex: 1, padding: 20, borderRadius: 24, background: 'rgba(255,255,255,0.04)', boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', marginBottom: 14, minHeight: 120 }}>
          <textarea autoFocus value={note} onChange={e => setNote(e.target.value)} maxLength={500} placeholder="Today I felt…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 17, lineHeight: 1.7, color: '#EEEAE3', minHeight: 80, resize: 'none', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BtnPrimary onClick={save}>Save entry →</BtnPrimary>
          <BtnSecondary onClick={() => setStep(3)}>← Back</BtnSecondary>
        </div>
      </div>
    </div>
  );

  // Done
  const m = MOODS[mood];
  const selActs = ACTIVITIES.filter(a => activities.includes(a.id));
  return (
    <div style={{...S.page, position: 'relative'}}>
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
      <div style={S.inner}>
        <OrbSmall style={{ marginBottom: 32 }} />
        <h2 style={{ ...S.h, marginBottom: 4 }}>Saved<span style={{ color: '#7EC8C8' }}>.</span></h2>
        <p style={{ fontSize: 14, color: 'rgba(238,234,227,0.32)', marginBottom: 28 }}>Today's entry.</p>
        <div style={{ padding: 18, borderRadius: 22, background: 'rgba(255,255,255,0.04)', boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 0 0 1px rgba(255,255,255,0.07)', marginBottom: 20 }}>
          {[
            { k: 'Mood',       v: `${m.emoji} ${m.label}` },
            { k: 'Energy',     v: `${energy} / 5` },
            { k: 'Anxiety',    v: `${anxiety} / 5` },
            { k: 'Sleep',      v: `${sleep} / 5` },
            { k: 'Focus',      v: `${focus} / 5` },
            { k: 'Activities', v: selActs.length > 0 ? selActs.map(a => a.icon + ' ' + a.label).join(', ') : '—' },
            ...(note ? [{ k: 'Note', v: `"${note.slice(0, 60)}${note.length > 60 ? '…' : ''}"` }] : []),
          ].map(({ k, v }, i, arr) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(238,234,227,0.32)', fontWeight: 500, flexShrink: 0 }}>{k}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(238,234,227,0.8)', textAlign: 'right' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BtnPrimary onClick={() => setPage('history')}>See history</BtnPrimary>
          <BtnSecondary onClick={() => { reset(); setPage('home'); }}>Home</BtnSecondary>
        </div>
      </div>
    </div>
  );
}
