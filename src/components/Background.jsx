import React from 'react';

export default function Background({ mood = 'default' }) {
  const palettes = {
    default: [
      { w:600, h:500, top:'-15%', left:'-20%', bg:'radial-gradient(circle, rgba(150,175,180,0.45) 0%, transparent 65%)', anim:'blobDrift 18s ease-in-out infinite' },
      { w:500, h:450, top:'25%',  right:'-15%', bg:'radial-gradient(circle, rgba(130,160,165,0.35) 0%, transparent 65%)', anim:'blobDriftB 14s ease-in-out infinite' },
      { w:400, h:380, bottom:'-5%',left:'20%',  bg:'radial-gradient(circle, rgba(160,178,162,0.30) 0%, transparent 65%)', anim:'blobDrift 20s ease-in-out infinite 4s' },
    ],
    calm: [
      { w:650, h:550, top:'-20%', left:'-15%', bg:'radial-gradient(circle, rgba(140,168,178,0.45) 0%, transparent 65%)', anim:'blobDrift 18s ease-in-out infinite' },
      { w:480, h:420, bottom:'0', right:'-12%', bg:'radial-gradient(circle, rgba(148,172,170,0.35) 0%, transparent 65%)', anim:'blobDriftB 14s ease-in-out infinite' },
    ],
    warm: [
      { w:600, h:520, top:'-10%', right:'-18%', bg:'radial-gradient(circle, rgba(155,170,175,0.42) 0%, transparent 65%)', anim:'blobDrift 15s ease-in-out infinite' },
      { w:500, h:440, bottom:'5%',left:'-15%',  bg:'radial-gradient(circle, rgba(145,165,168,0.35) 0%, transparent 65%)', anim:'blobDriftB 17s ease-in-out infinite' },
    ],
    heavy: [
      { w:600, h:520, top:'-15%', left:'-10%', bg:'radial-gradient(circle, rgba(148,162,172,0.42) 0%, transparent 65%)', anim:'blobDrift 14s ease-in-out infinite' },
      { w:480, h:420, bottom:'0', right:'-10%', bg:'radial-gradient(circle, rgba(138,158,168,0.36) 0%, transparent 65%)', anim:'blobDriftB 16s ease-in-out infinite' },
    ],
    flow: [
      { w:650, h:560, top:'-20%', left:'-20%', bg:'radial-gradient(circle, rgba(145,175,170,0.45) 0%, transparent 65%)', anim:'blobDrift 20s ease-in-out infinite' },
      { w:500, h:440, top:'30%',  right:'-15%', bg:'radial-gradient(circle, rgba(155,178,168,0.36) 0%, transparent 65%)', anim:'blobDriftB 15s ease-in-out infinite' },
    ],
  };

  const blobs = palettes[mood] || palettes.default;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', background:'#f2efea' }}>
      {blobs.map((b, i) => (
        <div key={i} style={{ position:'absolute', width:b.w, height:b.h, top:b.top, left:b.left, right:b.right, bottom:b.bottom, background:b.bg, filter:'blur(72px)', animation:b.anim }} />
      ))}
    </div>
  );
}
