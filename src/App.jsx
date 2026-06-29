import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

import LeftColumn from './components/LeftColumn';
import Typewriter from './components/Typewriter';
import SnapshotModal from './components/SnapshotModal';
import DustMotes from './components/DustMotes';
import useTypewriterSounds from './hooks/useTypewriterSounds';

const MAX_CHARS_PER_LINE = 52;
const CHAR_WIDTH = 9.6;
const BELL_POSITION = 47;

function App() {
  // Paper state
  const [lines, setLines] = useState([[]]);
  const [currentLine, setCurrentLine] = useState(0);
  const [cursorPos, setCursorPos] = useState(0);

  // Ink state
  const [inkColor, setInkColor] = useState('black');

  // Snapshots state
  const [snapshots, setSnapshots] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Keyboard visual state
  const [activeKeys, setActiveKeys] = useState(new Set());

  // Carriage
  const [dragOffset, setDragOffset] = useState(0);

  // Animation states
  const [lastStruck, setLastStruck] = useState(null);
  const [bellRang, setBellRang] = useState(false);
  const [paperShake, setPaperShake] = useState(false);

  // Workspace Upgrades state
  const [soundPack, setSoundPack] = useState('vintage');
  const [filmFilter, setFilmFilter] = useState('none');
  const [paperStock, setPaperStock] = useState('cream');
  const [fingerprints, setFingerprints] = useState([]);
  const [isCrumpling, setIsCrumpling] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Timeout refs for cleanup
  const shakeTimeoutRef = useRef(null);
  const struckTimeoutRef = useRef(null);
  const lastScrollSoundRef = useRef(0);

  // Sound system
  const sounds = useTypewriterSounds(soundPack);



  const adjustScroll = useCallback((amount) => {
    setScrollOffset(prev => {
      const next = prev + amount;
      const maxScroll = currentLine * 24;
      const minScroll = -Math.max(0, lines.length - currentLine) * 24 - 150;
      return Math.max(minScroll, Math.min(maxScroll, next));
    });
  }, [currentLine, lines.length]);

  const playScrollSoundThrottled = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollSoundRef.current > 120) {
      sounds.playPaperScroll();
      lastScrollSoundRef.current = now;
    }
  }, [sounds]);

  const handleWheel = useCallback((e) => {
    adjustScroll(-e.deltaY * 0.35);
    playScrollSoundThrottled();
  }, [adjustScroll, playScrollSoundThrottled]);



  const toggleInkColor = () => {
    setInkColor(prev => (prev === 'black' ? 'red' : 'black'));
  };

  const takeSnapshot = () => {
    const lastLines = lines.slice(Math.max(lines.length - 15, 0));
    const newSnapshot = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      lines: lastLines,
      rotation: (Math.random() - 0.5) * 4,
    };
    setSnapshots(prev => [...prev, newSnapshot]);
    setIsModalOpen(true);
  };

  const deleteSnapshot = useCallback((id) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  }, []);

  const triggerPaperShake = useCallback(() => {
    setPaperShake(true);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => setPaperShake(false), 60);
  }, []);

  const triggerStruck = useCallback((key) => {
    setLastStruck(key);
    if (struckTimeoutRef.current) clearTimeout(struckTimeoutRef.current);
    struckTimeoutRef.current = setTimeout(() => setLastStruck(null), 100);
  }, []);

  const crumplePage = useCallback(() => {
    if (isCrumpling) return;
    setIsCrumpling(true);
    
    // Play paper scroll / crunch noise
    sounds.playPaperScroll();
    
    setTimeout(() => {
      setLines([[]]);
      setCurrentLine(0);
      setCursorPos(0);
      setFingerprints([]);
      setDoodles([]);
      setDragOffset(0);
      setBellRang(false);
      setIsCrumpling(false);
    }, 900);
  }, [isCrumpling, sounds]);

  const carriageReturn = useCallback(() => {
    sounds.playCarriageReturn();
    sounds.playPaperScroll(); // play scroll feed sound on return
    setLines(prev => [...prev, []]);
    setCurrentLine(prev => prev + 1);
    setCursorPos(0);
    setDragOffset(0);
    setBellRang(false);
  }, [sounds]);

  const processKeyPress = useCallback((code, key) => {
    setScrollOffset(0);

    // Backspace handling
    if (code === 'Backspace' || key === 'Backspace' || key === 'delete') {
      if (cursorPos > 0) {
        sounds.playKeyStrike();
        sounds.playCarriageAdvance();
        setLines(prev => {
          const newLines = [...prev];
          const line = [...newLines[currentLine]];
          line.splice(cursorPos - 1, 1);
          newLines[currentLine] = line;
          return newLines;
        });
        setCursorPos(prev => prev - 1);
        triggerPaperShake();
      }
      return;
    }

    // Tab handling
    if (code === 'Tab' || key === 'Tab' || key === 'tab') {
      const tabSize = 4;
      const spacesToAdd = Math.min(tabSize, MAX_CHARS_PER_LINE - cursorPos);
      if (spacesToAdd > 0) {
        sounds.playSpacebar();
        setLines(prev => {
          const newLines = [...prev];
          const line = [...newLines[currentLine]];
          for (let i = 0; i < spacesToAdd; i++) {
            line[cursorPos + i] = { char: ' ', color: inkColor, rotation: 0 };
          }
          newLines[currentLine] = line;
          return newLines;
        });
        setCursorPos(prev => prev + spacesToAdd);
      }
      return;
    }

    // Printable characters
    if (key.length === 1 && cursorPos < MAX_CHARS_PER_LINE) {
      if (key === ' ') {
        sounds.playSpacebar();
      } else {
        sounds.playKeyStrike();
      }
      sounds.playCarriageAdvance();

      // Fingerprint smudging chance (2%)
      if (Math.random() < 0.02) {
        const id = Date.now();
        const top = Math.random() * 80 + 10;
        const left = Math.random() < 0.5 ? Math.random() * 6 : 94 + Math.random() * 6;
        const rotation = Math.random() * 360;
        const scale = 0.6 + Math.random() * 0.5;
        setFingerprints(prev => [...prev, { id, top, left, rotation, scale }]);
      }

      // Margin bell
      if (cursorPos === BELL_POSITION && !bellRang) {
        sounds.playBell();
        setBellRang(true);
      }

      // Random rotation for authentic ink imperfection
      const rotation = (Math.random() - 0.5) * 1.2;

      setLines(prev => {
        const newLines = [...prev];
        const line = [...newLines[currentLine]];
        line[cursorPos] = { char: key, color: inkColor, rotation };
        newLines[currentLine] = line;
        return newLines;
      });
      setCursorPos(prev => prev + 1);
      triggerStruck(key);
      triggerPaperShake();
    } else if (code === 'Enter' || key === 'Enter' || key === 'return') {
      carriageReturn();
    }
  }, [cursorPos, currentLine, inkColor, carriageReturn, sounds, bellRang, triggerPaperShake, triggerStruck]);

  const handleKeyDown = useCallback((e) => {
    // Handle Escape to close modal
    if (e.key === 'Escape') {
      if (isModalOpen) setIsModalOpen(false);
      return;
    }

    if (isModalOpen) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      adjustScroll(24);
      sounds.playPaperScroll();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      adjustScroll(-24);
      sounds.playPaperScroll();
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Tab') {
      e.preventDefault();
    }

    // Register active key for visual feedback
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.add(e.code);
      return next;
    });

    processKeyPress(e.code, e.key);
  }, [isModalOpen, processKeyPress, adjustScroll, sounds]);

  const handleVirtualKeyPress = useCallback((code, key) => {
    if (isModalOpen) return;

    // Register active key for visual feedback
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.add(code);
      return next;
    });

    setTimeout(() => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
      sounds.playKeyRelease();
    }, 85);

    processKeyPress(code, key);
  }, [isModalOpen, processKeyPress, sounds]);

  const handleKeyUp = useCallback((e) => {
    if (!isModalOpen) {
      sounds.playKeyRelease();
    }
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, [sounds, isModalOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      if (struckTimeoutRef.current) clearTimeout(struckTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <div className={`app-container ${isModalOpen ? 'blurred' : ''} filter-${filmFilter}`}>
        <LeftColumn
          openSnapshots={() => setIsModalOpen(true)}
          snapshotCount={snapshots.length}
          soundPack={soundPack}
          setSoundPack={setSoundPack}
          filmFilter={filmFilter}
          setFilmFilter={setFilmFilter}
          paperStock={paperStock}
          setPaperStock={setPaperStock}
          crumplePage={crumplePage}
        />

        <Typewriter
          lines={lines}
          currentLine={currentLine}
          cursorPos={cursorPos}
          inkColor={inkColor}
          toggleInkColor={toggleInkColor}
          takeSnapshot={takeSnapshot}
          activeKeys={activeKeys}
          dragOffset={dragOffset}
          setDragOffset={setDragOffset}
          carriageReturn={carriageReturn}
          CHAR_WIDTH={CHAR_WIDTH}
          lastStruck={lastStruck}
          paperShake={paperShake}
          paperStock={paperStock}
          fingerprints={fingerprints}
          isCrumpling={isCrumpling}
          crumplePage={crumplePage}
          onVirtualKeyPress={handleVirtualKeyPress}
          scrollOffset={scrollOffset}
          onWheel={handleWheel}
        />

        <DustMotes />
      </div>

      <div className="vignette-overlay" />

      <SnapshotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        snapshots={snapshots}
        onDelete={deleteSnapshot}
      />
    </>
  );
}

export default App;
