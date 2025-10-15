import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Esempio 2: Gestione Timer e Cronometri
 * 
 * Questo esempio dimostra:
 * - useEffect per gestire timer e interval
 * - Cleanup per prevenire memory leaks
 * - Gestione stati complessi con useRef
 * - Hook personalizzati per logica riutilizzabile
 * - Persistenza dati con localStorage
 * - Gestione eventi keyboard
 */

// Hook personalizzato per timer
function useTimer(initialTime = 0, autoStart = false) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);
  
  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);
  
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);
  
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);
  
  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);
  
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
    setIsPaused(false);
  }, [initialTime]);
  
  const setTimeValue = useCallback((newTime) => {
    setTime(newTime);
  }, []);
  
  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    setTimeValue
  };
}

// Hook per cronometro con lap
function useStopwatch() {
  const [laps, setLaps] = useState([]);
  const [currentLap, setCurrentLap] = useState(0);
  const timer = useTimer(0);
  
  const addLap = useCallback(() => {
    if (timer.isRunning) {
      const newLap = {
        id: Date.now(),
        time: timer.time - currentLap,
        totalTime: timer.time
      };
      setLaps(prev => [newLap, ...prev]);
      setCurrentLap(timer.time);
    }
  }, [timer.isRunning, timer.time, currentLap]);
  
  const clearLaps = useCallback(() => {
    setLaps([]);
    setCurrentLap(0);
  }, []);
  
  const resetStopwatch = useCallback(() => {
    timer.reset();
    setLaps([]);
    setCurrentLap(0);
  }, [timer]);
  
  return {
    ...timer,
    laps,
    addLap,
    clearLaps,
    reset: resetStopwatch
  };
}

// Hook per timer countdown
function useCountdown(initialTime, onComplete) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, onComplete]);
  
  const start = useCallback(() => {
    if (time > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  }, [time]);
  
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
    setIsCompleted(false);
  }, [initialTime]);
  
  const setTimeValue = useCallback((newTime) => {
    setTime(newTime);
    setIsCompleted(false);
  }, []);
  
  return {
    time,
    isRunning,
    isCompleted,
    start,
    pause,
    reset,
    setTimeValue
  };
}

// Hook per localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
}

// Hook per keyboard shortcuts
function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Preveni shortcuts se si sta digitando in un input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      
      switch (event.key) {
        case ' ':
          event.preventDefault();
          // Space per start/pause
          window.dispatchEvent(new CustomEvent('timer-toggle'));
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          // R per reset
          window.dispatchEvent(new CustomEvent('timer-reset'));
          break;
        case 'l':
        case 'L':
          event.preventDefault();
          // L per lap
          window.dispatchEvent(new CustomEvent('timer-lap'));
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}

// Componente per formattare il tempo
function TimeDisplay({ time, showMilliseconds = false }) {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div style={{
      fontSize: '48px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      color: '#333',
      textAlign: 'center',
      margin: '20px 0'
    }}>
      {formatTime(time)}
    </div>
  );
}

// Componente per i controlli del timer
function TimerControls({ timer, onLap, showLap = false }) {
  const handleToggle = () => {
    if (timer.isRunning) {
      if (timer.isPaused) {
        timer.resume();
      } else {
        timer.pause();
      }
    } else {
      timer.start();
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '20px'
    }}>
      <button
        onClick={handleToggle}
        style={{
          padding: '12px 24px',
          backgroundColor: timer.isRunning && !timer.isPaused ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {timer.isRunning && !timer.isPaused ? '⏸️ Pausa' : 
         timer.isPaused ? '▶️ Riprendi' : '▶️ Avvia'}
      </button>
      
      <button
        onClick={timer.reset}
        style={{
          padding: '12px 24px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🔄 Reset
      </button>
      
      {showLap && onLap && (
        <button
          onClick={onLap}
          disabled={!timer.isRunning}
          style={{
            padding: '12px 24px',
            backgroundColor: timer.isRunning ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: timer.isRunning ? 'pointer' : 'not-allowed',
            fontSize: '16px'
          }}
        >
          ⏱️ Giro
        </button>
      )}
    </div>
  );
}

// Componente per la lista dei giri
function LapList({ laps }) {
  if (laps.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#666',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏱️</div>
        <p>Nessun giro registrato</p>
        <p style={{ fontSize: '12px' }}>Premi "Giro" per registrare i tempi</p>
      </div>
    );
  }
  
  const fastestLap = Math.min(...laps.map(lap => lap.time));
  const slowestLap = Math.max(...laps.map(lap => lap.time));
  
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      padding: '15px',
      maxHeight: '300px',
      overflowY: 'auto'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📊 Giri Registrati</h4>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '10px',
        fontSize: '14px',
        marginBottom: '10px',
        padding: '8px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        fontWeight: 'bold'
      }}>
        <span>#</span>
        <span>Tempo Giro</span>
        <span>Tempo Totale</span>
      </div>
      
      {laps.map((lap, index) => {
        const isFastest = lap.time === fastestLap;
        const isSlowest = lap.time === slowestLap;
        
        return (
          <div
            key={lap.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: '10px',
              padding: '8px',
              backgroundColor: isFastest ? '#d4edda' : isSlowest ? '#f8d7da' : 'white',
              borderRadius: '4px',
              marginBottom: '5px',
              border: isFastest ? '1px solid #c3e6cb' : isSlowest ? '1px solid #f5c6cb' : '1px solid #dee2e6'
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{laps.length - index}</span>
            <span style={{ 
              color: isFastest ? '#155724' : isSlowest ? '#721c24' : '#333',
              fontWeight: isFastest || isSlowest ? 'bold' : 'normal'
            }}>
              {Math.floor(lap.time / 60).toString().padStart(2, '0')}:{(lap.time % 60).toString().padStart(2, '0')}
              {isFastest && ' 🏆'}
              {isSlowest && ' 🐌'}
            </span>
            <span style={{ color: '#666' }}>
              {Math.floor(lap.totalTime / 60).toString().padStart(2, '0')}:{(lap.totalTime % 60).toString().padStart(2, '0')}
            </span>
          </div>
        );
      })}
      
      {laps.length > 1 && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#1976d2'
        }}>
          <div>🏆 Giro più veloce: {Math.floor(fastestLap / 60).toString().padStart(2, '0')}:{(fastestLap % 60).toString().padStart(2, '0')}</div>
          <div>🐌 Giro più lento: {Math.floor(slowestLap / 60).toString().padStart(2, '0')}:{(slowestLap % 60).toString().padStart(2, '0')}</div>
        </div>
      )}
    </div>
  );
}

// Componente principale per il cronometro
function Stopwatch() {
  const stopwatch = useStopwatch();
  const [savedTimes, setSavedTimes] = useLocalStorage('stopwatch-times', []);
  
  useKeyboardShortcuts();
  
  // Gestione eventi keyboard
  useEffect(() => {
    const handleToggle = () => {
      if (stopwatch.isRunning) {
        if (stopwatch.isPaused) {
          stopwatch.resume();
        } else {
          stopwatch.pause();
        }
      } else {
        stopwatch.start();
      }
    };
    
    const handleReset = () => {
      stopwatch.reset();
    };
    
    const handleLap = () => {
      if (stopwatch.isRunning) {
        stopwatch.addLap();
      }
    };
    
    window.addEventListener('timer-toggle', handleToggle);
    window.addEventListener('timer-reset', handleReset);
    window.addEventListener('timer-lap', handleLap);
    
    return () => {
      window.removeEventListener('timer-toggle', handleToggle);
      window.removeEventListener('timer-reset', handleReset);
      window.removeEventListener('timer-lap', handleLap);
    };
  }, [stopwatch]);
  
  const saveTime = () => {
    if (stopwatch.time > 0) {
      const newTime = {
        id: Date.now(),
        time: stopwatch.time,
        laps: stopwatch.laps,
        date: new Date().toISOString()
      };
      setSavedTimes(prev => [newTime, ...prev].slice(0, 10)); // Mantieni solo gli ultimi 10
    }
  };
  
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>⏱️ Cronometro</h2>
        
        <TimeDisplay time={stopwatch.time} />
        
        <TimerControls 
          timer={stopwatch} 
          onLap={stopwatch.addLap}
          showLap={true}
        />
        
        <div style={{
          marginBottom: '20px',
          fontSize: '12px',
          color: '#666'
        }}>
          <p>⌨️ Shortcuts: Spazio (start/pause), R (reset), L (giro)</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={saveTime}
            disabled={stopwatch.time === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: stopwatch.time > 0 ? '#17a2b8' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: stopwatch.time > 0 ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            💾 Salva Tempo
          </button>
          
          <button
            onClick={stopwatch.clearLaps}
            disabled={stopwatch.laps.length === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: stopwatch.laps.length > 0 ? '#ffc107' : '#6c757d',
              color: stopwatch.laps.length > 0 ? 'black' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: stopwatch.laps.length > 0 ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              marginLeft: '10px'
            }}
          >
            🗑️ Pulisci Giri
          </button>
        </div>
        
        <LapList laps={stopwatch.laps} />
      </div>
    </div>
  );
}

// Componente per il countdown timer
function CountdownTimer() {
  const [inputTime, setInputTime] = useState(300); // 5 minuti default
  const [isSetting, setIsSetting] = useState(true);
  
  const countdown = useCountdown(inputTime, () => {
    alert('⏰ Tempo scaduto!');
  });
  
  const handleStart = () => {
    if (inputTime > 0) {
      setIsSetting(false);
      countdown.start();
    }
  };
  
  const handleReset = () => {
    setIsSetting(true);
    countdown.reset();
  };
  
  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>⏰ Timer Countdown</h2>
        
        {isSetting ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: '#666' }}>
                Imposta tempo (secondi):
              </label>
              <input
                type="number"
                value={inputTime}
                onChange={(e) => setInputTime(parseInt(e.target.value) || 0)}
                min="1"
                max="3600"
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  textAlign: 'center',
                  width: '100px'
                }}
              />
            </div>
            
            <button
              onClick={handleStart}
              disabled={inputTime <= 0}
              style={{
                padding: '12px 24px',
                backgroundColor: inputTime > 0 ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: inputTime > 0 ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ▶️ Avvia Timer
            </button>
          </div>
        ) : (
          <div>
            <TimeDisplay time={countdown.time} />
            
            <div style={{
              marginBottom: '20px',
              fontSize: '14px',
              color: countdown.isCompleted ? '#dc3545' : '#666'
            }}>
              {countdown.isCompleted ? '⏰ Tempo scaduto!' : 
               countdown.isRunning ? '⏳ In corso...' : '⏸️ In pausa'}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={countdown.isRunning ? countdown.pause : countdown.start}
                style={{
                  padding: '12px 24px',
                  backgroundColor: countdown.isRunning ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {countdown.isRunning ? '⏸️ Pausa' : '▶️ Riprendi'}
              </button>
              
              <button
                onClick={handleReset}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principale
function TimerManager() {
  const [activeTab, setActiveTab] = useState('stopwatch');
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333'
        }}>
          ⏱️ Gestione Timer e Cronometri
        </h1>
        
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => setActiveTab('stopwatch')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'stopwatch' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px 0 0 6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⏱️ Cronometro
          </button>
          
          <button
            onClick={() => setActiveTab('countdown')}
            style={{
              padding: '12px 24px',
              backgroundColor: activeTab === 'countdown' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⏰ Countdown
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'stopwatch' && <Stopwatch />}
        {activeTab === 'countdown' && <CountdownTimer />}
        
        {/* Informazioni */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>ℹ️ Informazioni</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            <li>Usa la barra spaziatrice per avviare/pausare il cronometro</li>
            <li>Premi 'R' per resettare il timer</li>
            <li>Premi 'L' per registrare un giro (solo cronometro)</li>
            <li>I tempi vengono salvati automaticamente in localStorage</li>
            <li>Il cronometro supporta giri multipli con statistiche</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TimerManager;
