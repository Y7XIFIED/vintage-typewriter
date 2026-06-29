import React, { useEffect, useState } from 'react';

function DustMotes() {
  const [motes, setMotes] = useState([]);

  useEffect(() => {
    const initialMotes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * -30,
      driftX: (Math.random() - 0.5) * 60,
      driftY: (Math.random() - 0.5) * 40,
      sparkle: Math.random() > 0.7,
    }));
    setMotes(initialMotes);
  }, []);

  return (
    <div className="dust-container">
      {motes.map(m => (
        <div
          key={m.id}
          className={`dust-mote${m.sparkle ? ' sparkle' : ''}`}
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            opacity: m.opacity,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            '--drift-x': `${m.driftX}px`,
            '--drift-y': `${m.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}

export default DustMotes;
