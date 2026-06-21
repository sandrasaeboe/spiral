import React, { useState, useEffect } from 'react';
import { OrbMain } from '../components/Orb';
import { BtnPrimary } from '../components/GlassButton';
import { analyzeThought } from '../hooks/useGroq';
import { useThoughts } from '../hooks/useStorage';

export default function Home({ setPage, streak, openRef }) {
  const [open,    setOpen]    = useState(false);
  const [text,    setText]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [result,  setResult]  = useState(null);
  const { addThought } = useThoughts();

  // expose open fn to App via ref
  useEffect(() => {
    if (openRef) openRef.current = () => setOpen(true);
  }, [openRef]);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true); setError('');
    try {
      const ai = await analyzeThought(text);
      const entry = { id: Date.now(), user_text: text, ...ai, date: new Date().toISOString() };
      addThought(entry);
      setResult(entry);
      setOpen(false);
    } catch { setError('Something went wrong. Try again.'); }
    setLoading(false);
  };

  if (result) return (
    <Analysis result={result} text={text} onBack={() => { setResult(null); setText(''); }} setPage={setPage} />
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0F1C1C', overflow: 'hidden' }}>
      <OrbMain />

      {loading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 250, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, background: 'rgba(15,28,28,0.85)', backdropFilter: 'blur(12px)' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, #7EC8C8, #2D6B6B)', animation: 'loadPulse 1.2s ease-in-out infinite' }} />
          <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(238,234,227,0.4)' }}>Analysing…</p>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '52px 28px 160px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(238,234,227,0.25)' }}>spiral</span>
          {streak > 0 && (
            <div style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', boxShadow: '0 0 0 1px rgba(255,255,255,0.08)', fontSize: 11, fontWeight: 600, color: '#7EC8C8' }}>
              🔥 {streak} {streak === 1 ? 'day' : 'days'}
            </div>
          )}
        </div>

        {/* Spacer pushes headline down */}
        <div style={{ flex: 1 }} />

        {/* Headline — sits just above the nav */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.055em', lineHeight: 1.04, color: '#EEEAE3' }}>
            Break<br />the <span style={{ color: '#7EC8C8' }}>spiral.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(238,234,227,0.3)', marginTop: 12, lineHeight: 1.7, maxWidth: 230 }}>
            Write down the thought.<br />AI identifies the pattern.
          </p>
        </div>
      </div>

      {/* Input sheet */}
      {open && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.25s ease' }}>
          <div onClick={() => setOpen(false)} style={{ flex: 1 }} />
          <div style={{ margin: '0 12px 16px', borderRadius: 28, padding: '24px 22px 20px', background: '#111E1E', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 -8px 60px rgba(0,0,0,0.5)', animation: 'slideUp 0.38s cubic-bezier(0.16,1,0.3,1)', position: 'relative' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 20, right: 20, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', color: 'rgba(238,234,227,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>✕</button>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(238,234,227,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>What's on your mind?</div>
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={1000}
              placeholder="Write freely…"
              style={{ width: '100%', minHeight: 120, background: 'transparent', border: 'none', outline: 'none', fontSize: 17, lineHeight: 1.65, color: '#EEEAE3', resize: 'none', fontFamily: "'Inter', sans-serif" }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(238,234,227,0.18)' }}>{text.length} / 1000</span>
              <BtnPrimary onClick={submit} disabled={!text.trim() || loading} style={{ width: 'auto', padding: '11px 24px', fontSize: 13 }}>
                Analyse →
              </BtnPrimary>
            </div>
            {error && <p style={{ fontSize: 12, color: 'rgba(220,100,100,0.7)', marginTop: 10 }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function Analysis({ result, text, onBack, setPage }) {
  return (
    <div style={{ background: '#0F1C1C', minHeight: '100vh', overflowY: 'auto' }}>
      <div style={{ padding: '56px 28px 160px' }}>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: '#7EC8C8', marginBottom: 36, display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'Inter', sans-serif" }}>← Back</button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: 'rgba(126,200,200,0.1)', boxShadow: '0 0 0 1px rgba(126,200,200,0.18)', marginBottom: 14 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7EC8C8' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#7EC8C8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{result.trap_label}</span>
        </div>
        <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.04, color: '#EEEAE3', marginBottom: 24 }}>{result.trap_label}.</h2>
        <div style={{ padding: '14px 18px', borderLeft: '2px solid rgba(126,200,200,0.4)', background: 'rgba(126,200,200,0.05)', borderRadius: '0 14px 14px 0', marginBottom: 20 }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(238,234,227,0.38)', fontStyle: 'italic' }}>"{text.slice(0, 120)}{text.length > 120 ? '…' : ''}"</p>
        </div>
        {[["What's happening", result.description], ['Reframe', result.reframe], ['Exercise', result.exercise_text]].map(([lbl, body]) => (
          <div key={lbl} style={{ padding: '16px 18px', borderRadius: 18, marginBottom: 8, background: 'rgba(255,255,255,0.04)', boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#7EC8C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>{lbl}</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(238,234,227,0.7)' }}>{body}</p>
          </div>
        ))}
        <button onClick={() => setPage('breathing')} style={{ width: '100%', padding: '15px', borderRadius: 999, marginTop: 8, border: 'none', color: 'rgba(238,234,227,0.45)', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif", background: 'transparent', boxShadow: '0 0 0 1px rgba(255,255,255,0.09)' }}>
          Breathing exercise →
        </button>
      </div>
    </div>
  );
}
