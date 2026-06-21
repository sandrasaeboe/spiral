import { useState } from 'react';

export function useMoods() {
  const [moods, setMoods] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spiral_moods') || '[]'); } catch { return []; }
  });

  const addMood = (score, emoji, label, note, extras = {}) => {
    const entry = {
      id: Date.now(),
      score,
      emoji,
      label,
      note,
      // new fields
      energy:     extras.energy     ?? null,
      anxiety:    extras.anxiety    ?? null,
      sleep:      extras.sleep      ?? null,
      focus:      extras.focus      ?? null,
      activities: extras.activities ?? [],
      date: new Date().toISOString(),
    };
    const updated = [entry, ...moods];
    localStorage.setItem('spiral_moods', JSON.stringify(updated));
    setMoods(updated);
  };

  const todayChecked = moods.some(m => {
    const d = new Date(m.date), t = new Date();
    return d.getDate() === t.getDate() &&
           d.getMonth() === t.getMonth() &&
           d.getFullYear() === t.getFullYear();
  });

  const streak = (() => {
    const dates = [...new Set(moods.map(m => m.date.slice(0, 10)))].sort().reverse();
    let s = 0, check = new Date();
    for (const d of dates) {
      if (d === check.toISOString().slice(0, 10)) { s++; check.setDate(check.getDate() - 1); } else break;
    }
    return s;
  })();

  const avgMood = moods.length
    ? Math.round((moods.slice(0, 14).reduce((a, m) => a + m.score, 0) / Math.min(moods.length, 14)) * 10) / 10
    : 0;

  // correlations: activity → avg mood delta
  const activityCorrelations = (() => {
    const map = {};
    moods.forEach(m => {
      (m.activities || []).forEach(act => {
        if (!map[act]) map[act] = { total: 0, count: 0 };
        map[act].total += m.score;
        map[act].count++;
      });
    });
    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, Math.round((v.total / v.count) * 10) / 10])
    );
  })();

  return { moods: moods.slice(0, 30), addMood, todayChecked, streak, avgMood, activityCorrelations };
}

export function useThoughts() {
  const [thoughts, setThoughts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spiral_thoughts') || '[]'); } catch { return []; }
  });

  const addThought = (entry) => {
    const updated = [entry, ...thoughts];
    localStorage.setItem('spiral_thoughts', JSON.stringify(updated));
    setThoughts(updated);
  };

  const trapCounts = thoughts.reduce((acc, t) => {
    acc[t.trap_label] = (acc[t.trap_label] || 0) + 1;
    return acc;
  }, {});

  return { thoughts: thoughts.slice(0, 10), addThought, trapCounts };
}
