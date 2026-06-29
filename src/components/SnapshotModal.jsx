import React from 'react';

function SnapshotModal({ isOpen, onClose, snapshots, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <button className="modal-close-btn" onClick={onClose} title="Close">
        ✕
      </button>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Snapshots</h2>
        <div className="snapshots-grid">
          {snapshots.map((snap, idx) => {
            const tapeLeft = ((idx % 4) * 15) + 20;
            const tapeRotation = ((idx % 3) - 1) * 3;

            return (
              <div
                key={snap.id}
                className="snapshot-card"
                style={{
                  '--rotation': `${snap.rotation || 0}deg`,
                  animationDelay: `${idx * 0.08}s`,
                }}
              >
                <div
                  className="snapshot-tape"
                  style={{
                    top: '-8px',
                    left: `${tapeLeft}%`,
                    transform: `rotate(${tapeRotation}deg)`,
                  }}
                />
                <div className="snapshot-text">
                  {snap.lines.map((line, lineIdx) => (
                    <div key={lineIdx} style={{ minHeight: '1.4em' }}>
                      {line.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            color:
                              c.color === 'red'
                                ? 'var(--ink-red)'
                                : 'var(--ink-black)',
                          }}
                        >
                          {c.char}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="snapshot-footer">
                  <span className="snapshot-date">{snap.date}</span>
                  <button
                    className="snapshot-delete"
                    onClick={() => onDelete(snap.id)}
                    title="Delete snapshot"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
          {snapshots.length === 0 && (
            <div className="empty-state">
              <div className="empty-typewriter">⌨</div>
              <p>No snapshots yet.</p>
              <p className="empty-hint">Take one from the paper above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SnapshotModal;
