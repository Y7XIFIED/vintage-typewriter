import React from 'react';

function LeftColumn({
  openSnapshots,
  snapshotCount,
  soundPack,
  setSoundPack,
  filmFilter,
  setFilmFilter,
  paperStock,
  setPaperStock,
}) {
  return (
    <div className="left-column">
      <h1 className="title">The Silent Carriage</h1>
      <div className="dev-credit">Y7XIFIED</div>

      <div className="intro-section">
        <p className="intro-text">
          Analog writing simulation.
        </p>

        <div className="sidebar-divider">
          <span className="divider-ornament">✦ ✦ ✦</span>
        </div>

        <p className="intro-hint">
          Press enter to return carriage.
        </p>

        {/* Workspace Customization Panel */}
        <div className="workspace-controls" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255, 200, 100, 0.15)', paddingBottom: '6px' }}>Settings</h3>
          
          {/* Sound Pack Selector */}
          <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sound Pack</label>
            <select value={soundPack} onChange={(e) => setSoundPack(e.target.value)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px 8px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
              <option value="vintage">Vintage Typewriter</option>
              <option value="cherry">Cherry MX Blue</option>
              <option value="ibm">IBM Model M</option>
              <option value="mechanical_red">Cherry MX Red</option>
              <option value="topre">Topre Switches</option>
              <option value="silent">Silent</option>
            </select>
          </div>

          {/* Paper Stock Selector */}
          <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Paper Stock</label>
            <select value={paperStock} onChange={(e) => setPaperStock(e.target.value)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px 8px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
              <option value="cream">Pristine Cream</option>
              <option value="stained">Coffee Stained</option>
              <option value="ruled">Ruled Manuscript</option>
              <option value="deckled">Deckled Cotton</option>
            </select>
          </div>

          {/* Film Filter Selector */}
          <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Film Overlay</label>
            <select value={filmFilter} onChange={(e) => setFilmFilter(e.target.value)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '6px 8px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}>
              <option value="none">No Filter</option>
              <option value="sepia">Vintage Sepia</option>
              <option value="monochrome">Silver Gelatin</option>
              <option value="cyanotype">Cyanotype Blue</option>
              <option value="kodachrome">Retro Kodachrome</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className="snapshot-link" onClick={openSnapshots}>
          snapshots
          {snapshotCount > 0 && (
            <span className="snapshot-count">{snapshotCount}</span>
          )}
        </button>
        <p className="snapshot-hint">
          {snapshotCount === 0
            ? 'No snapshots yet.'
            : `${snapshotCount} snapshot${snapshotCount !== 1 ? 's' : ''} saved.`}
        </p>
      </div>
    </div>
  );
}

export default LeftColumn;
