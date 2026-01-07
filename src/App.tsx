import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { SimpleDecision, loadDecisions, saveDecisions, getDefaultDecisions, generateId } from './config/decisions';
import { animals, Animal } from './config/animals';
import { languages, t, getBrowserLanguage } from './config/translations';
import { launchConfetti } from './confetti';
import { playTickSound, playDingSound, playWinSound } from './sounds';
import './App.css';

function App() {
  const [isDeciding, setIsDeciding] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<SimpleDecision | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isClucking, setIsClucking] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showSettings, setShowSettings] = useState(false);
  const [spinDuration, setSpinDuration] = useState(() => {
    const stored = localStorage.getItem('spinDuration');
    return stored ? parseInt(stored) : 50;
  });

  const [language, setLanguage] = useState(() => localStorage.getItem('language') || getBrowserLanguage());
  const [animal, setAnimal] = useState<Animal>(() => {
    const savedAnimalId = localStorage.getItem('animal');
    return animals.find(a => a.id === savedAnimalId) || animals[0];
  });

  const [decisions, setDecisions] = useState<SimpleDecision[]>(() => loadDecisions(language));
  const [editingDecision, setEditingDecision] = useState<SimpleDecision | null>(null);
  const [isAddingDecision, setIsAddingDecision] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  // Click outside to close settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSettings &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
        setEditingDecision(null);
        setIsAddingDecision(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('animal', animal.id);
  }, [animal]);

  useEffect(() => {
    localStorage.setItem('spinDuration', String(spinDuration));
  }, [spinDuration]);

  // Load decisions when language changes
  useEffect(() => {
    setDecisions(loadDecisions(language));
    setEditingDecision(null);
    setIsAddingDecision(false);
  }, [language]);

  // Save decisions when they change
  useEffect(() => {
    saveDecisions(language, decisions);
  }, [decisions, language]);

  const animalName = useMemo(() =>
    animal.names[language] || animal.names['en'],
    [animal, language]
  );

  const animalDefiniteName = useMemo(() =>
    animal.definiteNames?.[language] || animal.names[language] || animal.names['en'],
    [animal, language]
  );

  const langCode = useMemo(() => {
    const langMap: { [key: string]: string } = { en: 'en-GB', da: 'da-DK', de: 'de-DE', es: 'es-ES' };
    return langMap[language] || 'en-GB';
  }, [language]);

  const saySound = useCallback(() => {
    if (isClucking) return;

    setIsClucking(true);
    const sound = animal.sounds[language] || animal.sounds['en'];
    const utterance = new SpeechSynthesisUtterance(sound);
    utterance.lang = langCode;
    utterance.rate = 1.1;
    utterance.pitch = 1.4;
    utterance.onend = () => setIsClucking(false);
    speechSynthesis.speak(utterance);
  }, [isClucking, animal, language, langCode]);

  const makeDecision = useCallback(() => {
    if (isDeciding || decisions.length === 0) return;

    setIsDeciding(true);
    setSelectedDecision(null);
    setTargetIndex(null);

    // Spin duration affects total spins
    const baseSpins = 15;
    const extraSpins = Math.floor((100 - spinDuration) / 10) + Math.floor(Math.random() * 10);
    const minSpins = baseSpins + extraSpins;
    const finalIndex = Math.floor(Math.random() * decisions.length);

    // Calculate total spins needed to land on finalIndex (always going forward)
    // We need at least minSpins, then continue until we hit finalIndex
    let currentSpin = 0;
    let currentIndex = -1; // Start at -1 so first spin goes to 0

    const spin = () => {
      currentIndex = (currentIndex + 1) % decisions.length;
      currentSpin++;

      // Check if we've done minimum spins AND landed on final index
      const hasReachedMinSpins = currentSpin >= minSpins;
      const isOnFinalIndex = currentIndex === finalIndex;
      const shouldStop = hasReachedMinSpins && isOnFinalIndex;

      // Calculate progress for easing (use minSpins as reference, cap at 1)
      const progress = Math.min(currentSpin / minSpins, 1);

      // Scale delays based on spinDuration (faster = shorter delays)
      const speedMultiplier = spinDuration / 50;
      const baseDelay = 30 * speedMultiplier;
      const maxDelay = 350 * speedMultiplier;
      const delay = baseDelay + (maxDelay - baseDelay) * Math.pow(progress, 2.5);

      setTargetIndex(currentIndex);

      const pitch = 1.2 - (progress * 0.4);
      playTickSound(pitch);

      if (!shouldStop) {
        setTimeout(spin, delay);
      } else {
        // Final selection reached
        setTimeout(() => {
          const finalDecision = decisions[finalIndex];
          setSelectedDecision(finalDecision);
          setIsDeciding(false);

          if (finalDecision.confetti) {
            playWinSound();
            launchConfetti();
          } else {
            playDingSound();
          }
        }, 300);
      }
    };

    setTimeout(spin, 100);
  }, [isDeciding, decisions, spinDuration]);

  const handleAddDecision = () => {
    setEditingDecision({
      id: generateId(decisions),
      text: '',
      color: '#9C27B0',
      buttonColor: '#9C27B0',
      confetti: false,
    });
    setIsAddingDecision(true);
  };

  const handleEditDecision = (decision: SimpleDecision) => {
    setEditingDecision({ ...decision });
    setIsAddingDecision(false);
  };

  const handleSaveDecision = () => {
    if (!editingDecision || !editingDecision.text.trim()) return;

    if (isAddingDecision) {
      setDecisions([...decisions, editingDecision]);
    } else {
      setDecisions(decisions.map(d => d.id === editingDecision.id ? editingDecision : d));
    }
    setEditingDecision(null);
    setIsAddingDecision(false);
  };

  const handleDeleteDecision = (id: number) => {
    if (decisions.length <= 1) return; // Keep at least one
    setDecisions(decisions.filter(d => d.id !== id));
  };

  const handleReset = () => {
    // Reset all settings to defaults
    setDarkMode(false);
    setSpinDuration(50);
    setAnimal(animals[0]);
    setDecisions(getDefaultDecisions(language));
    localStorage.removeItem('darkMode');
    localStorage.removeItem('spinDuration');
    localStorage.removeItem('animal');
    localStorage.removeItem(`decisions_${language}`);
  };

  const buttonStyle = selectedDecision?.buttonColor
    ? { backgroundColor: selectedDecision.buttonColor }
    : {};

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="top-buttons">
        <button
          ref={settingsButtonRef}
          className="icon-button"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
        <button className="icon-button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {showSettings && (
        <div className="settings-panel" ref={settingsRef}>
          <h3>{t('settings', language, animalName, animalDefiniteName)}</h3>

          {/* Language */}
          <div className="setting-row">
            <label>{t('language', language, animalName, animalDefiniteName)}</label>
            <div className="setting-options">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`option-button ${language === lang.code ? 'active' : ''}`}
                  onClick={() => setLanguage(lang.code)}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Animal */}
          <div className="setting-row">
            <label>{t('animal', language, animalName, animalDefiniteName)}</label>
            <div className="setting-options">
              {animals.map(a => (
                <button
                  key={a.id}
                  className={`option-button ${animal.id === a.id ? 'active' : ''}`}
                  onClick={() => setAnimal(a)}
                >
                  {a.emoji} {a.names[language] || a.names['en']}
                </button>
              ))}
            </div>
          </div>

          {/* Spin Duration */}
          <div className="setting-row">
            <label>{t('spinDuration', language, animalName, animalDefiniteName)}</label>
            <div className="slider-row">
              <span className="slider-label">{t('fast', language, animalName, animalDefiniteName)}</span>
              <input
                type="range"
                min="20"
                max="100"
                value={spinDuration}
                onChange={(e) => setSpinDuration(parseInt(e.target.value))}
                className="slider"
              />
              <span className="slider-label">{t('slow', language, animalName, animalDefiniteName)}</span>
            </div>
          </div>

          {/* Decisions */}
          <div className="setting-row">
            <label>{t('decisions', language, animalName, animalDefiniteName)}</label>
            <div className="decisions-list">
              {decisions.map(decision => (
                <div key={decision.id} className="decision-item">
                  <span
                    className="decision-color"
                    style={{ backgroundColor: decision.color }}
                  />
                  <span className="decision-text">{decision.text}</span>
                  {decision.confetti && <span className="decision-confetti">🎉</span>}
                  <button
                    className="small-button"
                    onClick={() => handleEditDecision(decision)}
                  >
                    ✏️
                  </button>
                  <button
                    className="small-button"
                    onClick={() => handleDeleteDecision(decision.id)}
                    disabled={decisions.length <= 1}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button className="add-button" onClick={handleAddDecision}>
                + {t('addDecision', language, animalName, animalDefiniteName)}
              </button>
            </div>
          </div>

          {/* Edit/Add Decision Form */}
          {editingDecision && (
            <div className="edit-form">
              <div className="form-row">
                <label>{t('text', language, animalName, animalDefiniteName)}</label>
                <input
                  type="text"
                  value={editingDecision.text}
                  onChange={(e) => setEditingDecision({ ...editingDecision, text: e.target.value })}
                  className="text-input"
                />
              </div>
              <div className="form-row">
                <label>{t('color', language, animalName, animalDefiniteName)}</label>
                <input
                  type="color"
                  value={editingDecision.color}
                  onChange={(e) => setEditingDecision({
                    ...editingDecision,
                    color: e.target.value,
                    buttonColor: e.target.value,
                  })}
                  className="color-input"
                />
              </div>
              <div className="form-row checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={editingDecision.confetti}
                    onChange={(e) => setEditingDecision({ ...editingDecision, confetti: e.target.checked })}
                  />
                  {t('confetti', language, animalName, animalDefiniteName)} 🎉
                </label>
              </div>
              <div className="form-buttons">
                <button className="save-button" onClick={handleSaveDecision}>
                  {t('save', language, animalName, animalDefiniteName)}
                </button>
                <button className="cancel-button" onClick={() => { setEditingDecision(null); setIsAddingDecision(false); }}>
                  {t('cancel', language, animalName, animalDefiniteName)}
                </button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button className="reset-button" onClick={handleReset}>
            {t('reset', language, animalName, animalDefiniteName)}
          </button>
        </div>
      )}

      <div className="container">
        <h1 className="title">{t('title', language, animalName, animalDefiniteName)}</h1>
        <p className="subtitle">{t('subtitle', language, animalName, animalDefiniteName)}</p>

        <div
          className={`chicken ${isDeciding ? 'walking' : 'idle'} ${isClucking ? 'clucking' : ''}`}
          onClick={saySound}
        >
          {animal.emoji}
        </div>

        <div className="decisions-grid">
          {decisions.map((decision, index) => (
            <div
              key={decision.id}
              className={`decision-card ${targetIndex === index ? 'active' : ''} ${selectedDecision?.id === decision.id ? 'selected' : ''}`}
              style={{
                borderColor: (targetIndex === index || selectedDecision?.id === decision.id) ? decision.color : undefined,
                backgroundColor: selectedDecision?.id === decision.id ? `${decision.color}20` : undefined
              }}
            >
              {decision.text}
            </div>
          ))}
        </div>

        {selectedDecision && (
          <div className="result">
            <span className="result-label">{t('result', language, animalName, animalDefiniteName)}</span>
            <span className="result-text" style={{ color: selectedDecision.color }}>
              {selectedDecision.text}
            </span>
          </div>
        )}

        <button
          className={`button ${selectedDecision ? 'has-result' : ''}`}
          onClick={makeDecision}
          disabled={isDeciding || decisions.length === 0}
          style={buttonStyle}
        >
          {isDeciding ? t('deciding', language, animalName, animalDefiniteName) : t('askButton', language, animalName, animalDefiniteName)}
        </button>

        <p className="disclaimer">{t('disclaimer', language, animalName, animalDefiniteName)}</p>
      </div>
    </div>
  );
}

export default App;
