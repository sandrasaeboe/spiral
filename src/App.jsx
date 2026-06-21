import React, { useState, useRef } from 'react';
import './index.css';
import Nav       from './components/Nav';
import Home      from './pages/Home';
import CheckIn   from './pages/CheckIn';
import History   from './pages/History';
import Breathing from './pages/Breathing';
import { useMoods } from './hooks/useStorage';

export default function App() {
  const [page, setPage] = useState('home');
  const { streak } = useMoods();
  const openThoughtRef = useRef(null);

  // Nav center button opens thought sheet from anywhere
  const handleNewThought = () => {
    if (page === 'home') {
      openThoughtRef.current?.();
    } else {
      setPage('home');
      // slight delay to let home mount before triggering
      setTimeout(() => openThoughtRef.current?.(), 100);
    }
  };

  const pages = {
    home:      <Home      setPage={setPage} streak={streak} openRef={openThoughtRef} />,
    checkin:   <CheckIn   setPage={setPage} />,
    history:   <History   setPage={setPage} />,
    breathing: <Breathing setPage={setPage} />,
  };

  return (
    <div style={{ background: '#0F1C1C', minHeight: '100vh' }}>
      <div key={page} style={{ animation: 'fadeIn 0.25s ease both' }}>
        {pages[page]}
      </div>
      <Nav page={page} setPage={setPage} onNewThought={handleNewThought} />
    </div>
  );
}
