import React, { useRef, useEffect, useCallback } from 'react';

const BELL_POSITION = 47;

function Typewriter({
  lines,
  currentLine,
  cursorPos,
  inkColor,
  toggleInkColor,
  takeSnapshot,
  activeKeys,
  dragOffset,
  setDragOffset,
  carriageReturn,
  CHAR_WIDTH,
  lastStruck,
  paperShake,
  paperStock,
  fingerprints,
  isCrumpling,
  crumplePage,
  onVirtualKeyPress,
  scrollOffset,
  onWheel,
}) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragOffsetRef = useRef(0);

  // Keep ref in sync with prop
  useEffect(() => {
    dragOffsetRef.current = dragOffset;
  }, [dragOffset]);

  const baseOffset = -cursorPos * CHAR_WIDTH;
  const currentTranslateX = baseOffset + dragOffset;

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (dx > 0) {
      setDragOffset(dx);
    }
  }, [setDragOffset]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = 'default';
    if (dragOffsetRef.current > 100) {
      carriageReturn();
    } else {
      setDragOffset(0);
    }
  }, [carriageReturn, setDragOffset]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Full standard QWERTY layout with side keys to cover space and align rows
  const keyboardRows = [
    {
      keys: [
        { code: 'Backquote', label: '~' },
        { code: 'Digit1', label: '1' },
        { code: 'Digit2', label: '2' },
        { code: 'Digit3', label: '3' },
        { code: 'Digit4', label: '4' },
        { code: 'Digit5', label: '5' },
        { code: 'Digit6', label: '6' },
        { code: 'Digit7', label: '7' },
        { code: 'Digit8', label: '8' },
        { code: 'Digit9', label: '9' },
        { code: 'Digit0', label: '0' },
        { code: 'Minus', label: '-' },
        { code: 'Equal', label: '=' },
        { code: 'Backspace', label: 'delete', width: 76 },
      ],
    },
    {
      keys: [
        { code: 'Tab', label: 'tab', width: 62 },
        { code: 'KeyQ', label: 'Q' },
        { code: 'KeyW', label: 'W' },
        { code: 'KeyE', label: 'E' },
        { code: 'KeyR', label: 'R' },
        { code: 'KeyT', label: 'T' },
        { code: 'KeyY', label: 'Y' },
        { code: 'KeyU', label: 'U' },
        { code: 'KeyI', label: 'I' },
        { code: 'KeyO', label: 'O' },
        { code: 'KeyP', label: 'P' },
        { code: 'BracketLeft', label: '[' },
        { code: 'BracketRight', label: ']' },
        { code: 'Backslash', label: '\\', width: 52 },
      ],
    },
    {
      keys: [
        { code: 'CapsLock', label: 'lock', width: 78 },
        { code: 'KeyA', label: 'A' },
        { code: 'KeyS', label: 'S' },
        { code: 'KeyD', label: 'D' },
        { code: 'KeyF', fill: 'F', label: 'F' },
        { code: 'KeyG', label: 'G' },
        { code: 'KeyH', label: 'H' },
        { code: 'KeyJ', label: 'J' },
        { code: 'KeyK', label: 'K' },
        { code: 'KeyL', label: 'L' },
        { code: 'Semicolon', label: ';' },
        { code: 'Quote', label: "'" },
        { code: 'Enter', label: 'return', width: 80 },
      ],
    },
    {
      keys: [
        { code: 'ShiftLeft', label: 'shift', width: 96 },
        { code: 'KeyZ', label: 'Z' },
        { code: 'KeyX', label: 'X' },
        { code: 'KeyC', label: 'C' },
        { code: 'KeyV', label: 'V' },
        { code: 'KeyB', label: 'B' },
        { code: 'KeyN', label: 'N' },
        { code: 'KeyM', label: 'M' },
        { code: 'Comma', label: ',' },
        { code: 'Period', label: '.' },
        { code: 'Slash', label: '/' },
        { code: 'ShiftRight', label: 'shift', width: 106 },
      ],
    },
  ];

  return (
    <div className="typewriter-area" onWheel={onWheel}>
      {/* Warm spotlight from above */}
      <div className="spotlight flicker" />

      {/* Paper Layer */}
      <div
        className="paper-container"
        style={{
          transform: `translateY(${-currentLine * 24 + scrollOffset}px)`,
        }}
      >
        <div className={`paper stock-${paperStock}${paperShake ? ' shake' : ''}${isCrumpling ? ' crumpling' : ''}`}>
          <div className="paper-texture" />
          <div className="paper-curl-overlay" />
          {paperStock === 'stained' && <div className="coffee-stains" />}

          {/* Render fingerprints */}
          {fingerprints.map((fp) => (
            <div
              key={fp.id}
              className="fingerprint-smudge"
              style={{
                top: `${fp.top}%`,
                left: `${fp.left}%`,
                transform: `translate(-50%, -50%) rotate(${fp.rotation}deg) scale(${fp.scale})`,
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='40' viewBox='0 0 30 40' opacity='0.75'><path d='M15 2 C10 2 6 6 6 11 C6 14 7.5 16 9 18 C7 20 5 23 5 27 C5 32 9 36 15 36 C21 36 25 32 25 27 C25 23 23 20 21 18 C22.5 16 24 14 24 11 C24 6 20 2 15 2 Z M15 5 C18.3 5 21 7.7 21 11 C21 13.5 19.5 15.2 18.2 16.5 L17.5 17.2 C16 18.7 15.5 19.5 15.5 21 L14.5 21 C14.5 19 15.2 17.8 16.7 16.3 L17.4 15.6 C18.5 14.5 19.5 13.1 19.5 11 C19.5 8.5 17.5 6.5 15 6.5 C12.5 6.5 10.5 8.5 10.5 11 L9.5 11 C9.5 7.7 12.2 5 15 5 Z M15 9 C16.1 9 17 9.9 17 11 C17 11.8 16.5 12.3 16 12.7 C15.4 13.1 15 13.8 15 14.5 L14 14.5 C14 13.3 14.7 12.4 15.3 12 C15.7 11.7 16 11.4 16 11 C16 10.4 15.6 10 15 10 C14.4 10 14 10.4 14 11 L13 11 C13 9.9 13.9 9 15 9 Z' fill='%236e461e'/></svg>")`
              }}
            />
          ))}

          <div className="paper-controls">
            <button onClick={takeSnapshot}>
              <span className="control-icon">📷</span> take a snapshot
            </button>
            <button className="ink-ribbon-btn" onClick={toggleInkColor}>
              ink ribbon:{' '}
              <span
                className="dot"
                style={{
                  backgroundColor:
                    inkColor === 'red'
                      ? 'var(--ink-red)'
                      : 'var(--ink-black)',
                }}
              />
            </button>
            <button className="ink-ribbon-btn" onClick={crumplePage} style={{ marginLeft: '12px' }} disabled={isCrumpling}>
              <span className="control-icon">🗑️</span> crumple sheet
            </button>
          </div>
          <div className="paper-content">
            {lines.map((line, lineIdx) => (
              <div
                key={lineIdx}
                style={{ height: '24px', position: 'relative' }}
              >
                {line.map((c, i) => (
                  <span
                    key={i}
                    className="typed-char"
                    style={{
                      position: 'absolute',
                      left: `${i * CHAR_WIDTH}px`,
                      color:
                        c.color === 'red'
                          ? 'var(--ink-red)'
                          : 'var(--ink-black)',
                      transform: `rotate(${c.rotation || 0}deg)`,
                    }}
                  >
                    {c.char}
                  </span>
                ))}
                {/* Blinking cursor on the current line */}
                {lineIdx === currentLine && (
                  <span
                    className="paper-cursor"
                    style={{
                      left: `${cursorPos * CHAR_WIDTH}px`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typebar strike flash */}
      {lastStruck && (
        <div className="typebar-container">
          <div className="typebar striking" />
        </div>
      )}

      {/* Carriage Layer */}
      <div
        className="carriage-layer"
        onPointerDown={handlePointerDown}
        style={{
          transform: `translateX(${currentTranslateX}px)`,
          transition: isDragging.current
            ? 'none'
            : 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <div className="carriage-rail" />
        <div className="platen-roller" />
        <div className="print-head">
          <div className="print-head-indicator" />
        </div>
        <div className="carriage-slot" />
        <div className="drag-hint">↔ drag to return</div>
      </div>

      {/* Ribbon Spools */}
      <div className="ribbon-mechanism">
        <div className={`ribbon-spool left ${inkColor}`}>
          <div className="spool-center" />
        </div>
        <div
          className="ribbon-thread"
          style={{
            background:
              inkColor === 'red' ? 'var(--ink-red)' : 'var(--ink-black)',
          }}
        />
        <div className={`ribbon-spool right ${inkColor}`}>
          <div className="spool-center" />
        </div>
      </div>

      {/* Base Layer (Keyboard) */}
      <div className="base-layer">
        {/* Embossed Typebar Basket Arms */}
        <div className="typebar-basket">
          {Array.from({ length: 15 }).map((_, idx) => {
            const angle = -38 + (idx * 5.4);
            const isStriking = lastStruck && Math.abs((idx - 7) * 2.2) < 6;
            return (
              <div
                key={idx}
                className={`typebar-arm${isStriking ? ' striking' : ''}`}
                style={{ '--angle': `${angle}deg` }}
              />
            );
          })}
        </div>

        <div className="keyboard-container">
          <div className="dev-nameplate">
            <span className="dev-nameplate-name">Y7XIFIED</span>
          </div>

          {keyboardRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="keyboard-row"
            >
               {row.keys.map(({ code, label, width }) => {
                const pressed = activeKeys.has(code);
                return (
                  <div
                    key={code}
                    className={`key${pressed ? ' pressed' : ''}`}
                    style={{
                      width: width ? `${width}px` : undefined,
                      borderRadius: width ? '12px' : undefined,
                    }}
                    onClick={() => {
                      const keyChar = label.length === 1 ? label.toLowerCase() : (code === 'Backspace' ? 'Backspace' : (code === 'Enter' ? 'Enter' : (code === 'Tab' ? 'Tab' : label)));
                      onVirtualKeyPress(code, keyChar);
                    }}
                  >
                    <span className="key-label">{label}</span>
                    <div
                      className="key-ring"
                      style={{
                        borderRadius: width ? '12px' : undefined,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
          {/* Spacebar row */}
          <div className="keyboard-row spacebar-row">
            <div
              className={`key spacebar${
                activeKeys.has('Space') ? ' pressed' : ''
              }`}
              onClick={() => onVirtualKeyPress('Space', ' ')}
            >
              <div className="key-ring" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Typewriter;
