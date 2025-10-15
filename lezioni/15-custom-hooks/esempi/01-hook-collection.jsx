import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Esempio 1: Collezione di Hook Personalizzati
 * 
 * Questo esempio dimostra:
 * - Hook per gestione stato (useToggle, useCounter, useLocalStorage)
 * - Hook per UI (useModal, useClickOutside, useScroll)
 * - Hook per performance (useDebounce, useThrottle)
 * - Hook per side effects (useTimer, useApi)
 * - Composizione di hook per logica complessa
 */

// Hook per gestione stato
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  
  return { value, toggle, setTrue, setFalse };
}

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  const setValue = useCallback((value) => {
    setCount(value);
  }, []);
  
  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Errore nel leggere localStorage:', error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Errore nel salvare localStorage:', error);
    }
  }, [key]);
  
  return [storedValue, setValue];
}

// Hook per UI
function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);
  
  const open = useCallback((modalData = null) => {
    setIsOpen(true);
    setData(modalData);
  }, []);
  
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);
  
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Gestione escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);
  
  return {
    isOpen,
    data,
    open,
    close,
    toggle
  };
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [direction, setDirection] = useState('none');
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;
      
      setScrollY(currentScrollY);
      setScrollX(currentScrollX);
      
      if (currentScrollY > lastScrollY) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const scrollToBottom = useCallback(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
  }, []);
  
  const scrollToElement = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  return {
    scrollY,
    scrollX,
    direction,
    scrollToTop,
    scrollToBottom,
    scrollToElement
  };
}

// Hook per performance
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());
  
  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, lastExecuted.current + delay - Date.now());
      
      return () => clearTimeout(timerId);
    }
  }, [value, delay]);
  
  return throttledValue;
}

// Hook per side effects
function useTimer(initialTime = 0, autoStart = false) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [interval, setInterval] = useState(1000);
  
  useEffect(() => {
    let timer;
    
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, interval);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, interval]);
  
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);
  
  const setTimeValue = useCallback((newTime) => {
    setTime(newTime);
  }, []);
  
  const setIntervalValue = useCallback((newInterval) => {
    setInterval(newInterval);
  }, []);
  
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  return {
    time,
    isRunning,
    interval,
    start,
    stop,
    reset,
    setTime: setTimeValue,
    setInterval: setIntervalValue,
    formatTime
  };
}

function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);
  
  return {
    data,
    loading,
    error,
    fetchData,
    refetch
  };
}

// Componente demo principale
function HookCollectionDemo() {
  // Hook per gestione stato
  const toggle = useToggle();
  const counter = useCounter(10, 5);
  const [userName, setUserName] = useLocalStorage('userName', '');
  const [userTheme, setUserTheme] = useLocalStorage('userTheme', 'light');
  
  // Hook per UI
  const modal = useModal();
  const dropdownRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const scroll = useScroll();
  
  // Hook per performance
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const throttledScrollY = useThrottle(scroll.scrollY, 100);
  
  // Hook per side effects
  const timer = useTimer(0, false);
  const api = useApi('https://jsonplaceholder.typicode.com/users', { autoFetch: false });
  
  // Gestione dropdown
  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  
  // Effetto per la ricerca debounced
  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('Ricerca per:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: userTheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
      color: userTheme === 'dark' ? '#ffffff' : '#333333',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #ddd'
        }}>
          <h1 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>
            🪝 Collezione di Hook Personalizzati
          </h1>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Nome Utente:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Inserisci nome"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Tema:
              </label>
              <select
                value={userTheme}
                onChange={(e) => setUserTheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="light">Chiaro</option>
                <option value="dark">Scuro</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Sezione Hook per Gestione Stato */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#007bff' }}>
            🎯 Hook per Gestione Stato
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* useToggle */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useToggle</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
                Stato: <strong>{toggle.value ? 'ON' : 'OFF'}</strong>
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={toggle.toggle}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Toggle
                </button>
                <button
                  onClick={toggle.setTrue}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ON
                </button>
                <button
                  onClick={toggle.setFalse}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  OFF
                </button>
              </div>
            </div>
            
            {/* useCounter */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useCounter</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
                Contatore: <strong>{counter.count}</strong> (step: 5)
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={counter.increment}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  +5
                </button>
                <button
                  onClick={counter.decrement}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  -5
                </button>
                <button
                  onClick={counter.reset}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sezione Hook per UI */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#007bff' }}>
            🎨 Hook per UI
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* useModal */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useModal</h3>
              <button
                onClick={() => modal.open({ title: 'Modal Demo', content: 'Questo è un esempio di modal gestito con useModal hook!' })}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Apri Modal
              </button>
            </div>
            
            {/* useClickOutside */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd',
              position: 'relative'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useClickOutside</h3>
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Menu Dropdown
                </button>
                
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: userTheme === 'dark' ? '#3d3d3d' : '#ffffff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    minWidth: '150px',
                    zIndex: 1000
                  }}>
                    <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                      Opzione 1
                    </div>
                    <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                      Opzione 2
                    </div>
                    <div style={{ padding: '10px' }}>
                      Opzione 3
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* useScroll */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useScroll</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Scroll Y: <strong>{scroll.scrollY}px</strong>
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Direzione: <strong>{scroll.direction}</strong>
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={scroll.scrollToTop}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Top
                </button>
                <button
                  onClick={scroll.scrollToBottom}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Bottom
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sezione Hook per Performance */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#007bff' }}>
            ⚡ Hook per Performance
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* useDebounce */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useDebounce</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digita per vedere il debounce..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}
              />
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                Input: <strong>{searchTerm}</strong>
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                Debounced: <strong>{debouncedSearchTerm}</strong>
              </p>
              <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                Delay: <strong>500ms</strong>
              </p>
            </div>
            
            {/* useThrottle */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useThrottle</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Scroll Y: <strong>{scroll.scrollY}px</strong>
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Throttled: <strong>{throttledScrollY}px</strong>
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Throttle: <strong>100ms</strong>
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Scorri la pagina per vedere la differenza
              </p>
            </div>
          </div>
        </section>
        
        {/* Sezione Hook per Side Effects */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ marginBottom: '20px', color: '#007bff' }}>
            🔄 Hook per Side Effects
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* useTimer */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useTimer</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '18px', fontFamily: 'monospace' }}>
                {timer.formatTime(timer.time)}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <button
                  onClick={timer.start}
                  disabled={timer.isRunning}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: timer.isRunning ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: timer.isRunning ? 'not-allowed' : 'pointer'
                  }}
                >
                  Start
                </button>
                <button
                  onClick={timer.stop}
                  disabled={!timer.isRunning}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: !timer.isRunning ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: !timer.isRunning ? 'not-allowed' : 'pointer'
                  }}
                >
                  Stop
                </button>
                <button
                  onClick={timer.reset}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                  Intervallo (ms):
                </label>
                <select
                  value={timer.interval}
                  onChange={(e) => timer.setInterval(parseInt(e.target.value))}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value={100}>100ms</option>
                  <option value={500}>500ms</option>
                  <option value={1000}>1000ms</option>
                  <option value={2000}>2000ms</option>
                </select>
              </div>
            </div>
            
            {/* useApi */}
            <div style={{
              backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #ddd'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>useApi</h3>
              <button
                onClick={api.fetchData}
                disabled={api.loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: api.loading ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: api.loading ? 'not-allowed' : 'pointer',
                  marginBottom: '15px'
                }}
              >
                {api.loading ? 'Caricamento...' : 'Carica Utenti'}
              </button>
              
              {api.error && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '10px' }}>
                  Errore: {api.error}
                </p>
              )}
              
              {api.data && (
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <strong>{api.data.length}</strong> utenti caricati
                  </p>
                  <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {api.data.slice(0, 3).map(user => (
                      <div key={user.id} style={{ fontSize: '12px', marginBottom: '5px' }}>
                        {user.name} ({user.email})
                      </div>
                    ))}
                    {api.data.length > 3 && (
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ... e altri {api.data.length - 3} utenti
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Modal */}
        {modal.isOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            onClick={modal.close}
          >
            <div
              style={{
                backgroundColor: userTheme === 'dark' ? '#2d2d2d' : '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80%',
                overflow: 'auto',
                position: 'relative',
                border: '1px solid #ddd'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={modal.close}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
              
              <h2 style={{ margin: '0 0 20px 0' }}>
                {modal.data?.title}
              </h2>
              <p style={{ margin: '0 0 20px 0', lineHeight: '1.6' }}>
                {modal.data?.content}
              </p>
              
              <button
                onClick={modal.close}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Chiudi
              </button>
            </div>
          </div>
        )}
        
        {/* Spazio per scroll */}
        <div style={{ height: '1000px', padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Scorri verso il basso per testare gli hook di scroll e performance
          </p>
          <div style={{ marginTop: '50px' }}>
            <button
              onClick={scroll.scrollToTop}
              style={{
                padding: '15px 30px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🔝 Torna in Cima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HookCollectionDemo;





