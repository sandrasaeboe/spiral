import React, { useRef, useEffect } from 'react';

export default function AuraCanvas({ hues = [200, 230], intensity = 0.6, speed = 0.5, style = {} }) {
  const canvasRef = useRef(null);
  const raf = useRef(null);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');

    const draw = () => {
      t.current += 0.003 * speed;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Start with near-black
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      const blobs = [
        { x: W*0.5  + Math.sin(t.current*0.4)*W*0.12,  y: H*0.42 + Math.cos(t.current*0.3)*H*0.08,  r: W*0.52, h: hues[0],    s: 52, l: 38, a: intensity*0.95 },
        { x: W*0.48 + Math.cos(t.current*0.35)*W*0.10, y: H*0.45 + Math.sin(t.current*0.28)*H*0.10, r: W*0.38, h: hues[1],    s: 48, l: 44, a: intensity*0.80 },
        { x: W*0.52 + Math.sin(t.current*0.25)*W*0.08, y: H*0.40 + Math.cos(t.current*0.32)*H*0.07, r: W*0.28, h: hues[0]+15, s: 55, l: 52, a: intensity*0.65 },
        // Bright warm centre
        { x: W*0.5  + Math.sin(t.current*0.2)*W*0.04,  y: H*0.43 + Math.cos(t.current*0.18)*H*0.04, r: W*0.14, h: hues[0]+30, s: 60, l: 72, a: intensity*0.55 },
      ];

      blobs.forEach(b => {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0,    `hsla(${b.h}, ${b.s}%, ${b.l}%, ${b.a})`);
        g.addColorStop(0.45, `hsla(${b.h}, ${b.s}%, ${b.l - 8}%, ${b.a * 0.5})`);
        g.addColorStop(1,    'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      // Strong dark vignette — very dark edges, bright centre
      const vig = ctx.createRadialGradient(W/2, H*0.44, H*0.08, W/2, H*0.44, H*0.8);
      vig.addColorStop(0,   'transparent');
      vig.addColorStop(0.55,'rgba(8,8,8,0.35)');
      vig.addColorStop(1,   'rgba(5,5,5,0.88)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener('resize', resize); };
  }, [hues[0], hues[1], intensity, speed]);

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block', ...style }} />;
}
