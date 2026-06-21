import React, { useState } from 'react';
import { BtnPrimary } from '../components/GlassButton';
import { useMoods, useThoughts } from '../hooks/useStorage';

const MOOD_COLOR = { 1:'#8B3A3A', 2:'#8B5A3A', 3:'#6B6B3A', 4:'#2D6B6B', 5:'#3A6B8B' };
const ACT_LABELS = {
  workout:'🏃 Workout', social:'👥 Socialised', work:'💼 Work',
  nature:'🌿 Nature', creative:'🎨 Creative', screen:'📱 Screen',
  alcohol:'🍷 Alcohol', meditation:'🧘 Meditation', reading:'📖 Read',
  alone:'🌙 Alone', conflict:'⚡ Conflict', goodsleep:'😴 Slept well',
  badsleep:'🥴 Slept badly', goodfood:'🥗 Ate well',
};

function MiniBar({ value }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${(value / 5) * 100}%`, background: 'linear-gradient(90deg, #2D6B6B, #7EC8C8)', borderRadius: 2 }} />
    </div>
  );
}

const S = {
  page:  { background: '#0F1C1C', minHeight: '100vh', overflowY: 'auto' },
  inner: { padding: '56px 24px 160px' },
  h:     { fontSize: 36, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.04, color: '#EEEAE3', marginBottom: 24 },
  lbl:   { fontSize: 10, fontWeight: 700, color: 'rgba(238,234,227,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 },
  card:  { padding: 18, borderRadius: 20, background: 'rgba(255,255,255,0.04)', boxShadow: '0 1px 0 rgba(255,255,255,0.07) inset, 0 0 0 1px rgba(255,255,255,0.06)' },
};

export default function History({ setPage }) {
  const { moods, streak, activityCorrelations } = useMoods();
  const { thoughts, trapCounts }                = useThoughts();
  const [expanded, setExpanded]                 = useState(null);
  const isEmpty = moods.length === 0 && thoughts.length === 0;

  if (isEmpty) return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: '0 28px', textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: 'rgba(238,234,227,0.32)', lineHeight: 1.65, marginBottom: 32 }}>Nothing here yet.<br />Start with a check-in.</p>
        <BtnPrimary onClick={() => setPage('checkin')} style={{ width: 'auto', padding: '14px 28px' }}>Check-in →</BtnPrimary>
      </div>
    </div>
  );

  const sliderEntries = moods.filter(m => m.energy != null).slice(0, 7);
  const avg = key => sliderEntries.length ? Math.round((sliderEntries.reduce((a, m) => a + m[key], 0) / sliderEntries.length) * 10) / 10 : null;
  const avgEnergy = avg('energy'), avgAnxiety = avg('anxiety'), avgSleep = avg('sleep'), avgFocus = avg('focus');
  const topCorr = Object.entries(activityCorrelations || {}).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxTrap = Math.max(...Object.values(trapCounts), 1);

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
        <h2 style={S.h}>History.</h2>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
          {[{ n: thoughts.length, l: 'Analyses', teal: false }, { n: streak, l: 'Day streak', teal: true }].map(({ n, l, teal }) => (
            <div key={l} style={{ ...S.card }}>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.05em', color: teal ? '#7EC8C8' : '#EEEAE3', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(238,234,227,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Mood bars */}
        {moods.length > 0 && (
          <>
            <div style={S.lbl}>Mood</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 44, marginBottom: 28 }}>
              {moods.slice(0, 14).reverse().map((m, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 4, background: MOOD_COLOR[m.score] || '#2D6B6B', height: 8 + (m.score / 5) * 36, opacity: 0.3 + (m.score / 5) * 0.7 }} />
              ))}
            </div>
          </>
        )}

        {/* Slider averages */}
        {avgEnergy !== null && (
          <>
            <div style={S.lbl}>Last 7 days — average</div>
            <div style={{ ...S.card, marginBottom: 24 }}>
              {[{ label: 'Energy', val: avgEnergy }, { label: 'Anxiety', val: avgAnxiety }, { label: 'Sleep', val: avgSleep }, { label: 'Focus', val: avgFocus }].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(238,234,227,0.38)', width: 56, flexShrink: 0 }}>{label}</span>
                  <MiniBar value={val} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#7EC8C8', width: 24, textAlign: 'right', flexShrink: 0 }}>{val}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Trap counts */}
        {Object.keys(trapCounts).length > 0 && (
          <>
            <div style={S.lbl}>Thought traps</div>
            <div style={{ marginBottom: 24 }}>
              {Object.entries(trapCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, count]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(238,234,227,0.65)', letterSpacing: '-0.02em' }}>{label}</span>
                  <span style={{ padding: '4px 11px', borderRadius: 999, background: 'rgba(126,200,200,0.1)', boxShadow: '0 0 0 1px rgba(126,200,200,0.2)', fontSize: 11, fontWeight: 600, color: '#7EC8C8' }}>{count}×</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Log */}
        {thoughts.length > 0 && (
          <>
            <div style={S.lbl}>Log</div>
            {thoughts.map((th, i) => (
              <div key={th.id} onClick={() => setExpanded(expanded === i ? null : i)}
                style={{ ...S.card, marginBottom: 8, cursor: 'pointer', transition: 'background 0.15s', background: expanded === i ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#7EC8C8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{th.trap_label}</div>
                <div style={{ fontSize: 14, color: 'rgba(238,234,227,0.4)', fontStyle: 'italic', lineHeight: 1.55 }}>
                  "{th.user_text?.slice(0, 70)}{th.user_text?.length > 70 ? '…' : ''}"
                </div>
                {expanded === i && (
                  <div style={{ fontSize: 14, color: 'rgba(238,234,227,0.7)', lineHeight: 1.65, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', animation: 'fadeIn 0.2s both' }}>
                    {th.reframe}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
