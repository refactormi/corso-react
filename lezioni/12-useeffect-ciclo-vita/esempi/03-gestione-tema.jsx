import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

/**
 * Esempio 3: Gestione Tema e Preferenze Utente
 * 
 * Questo esempio dimostra:
 * - useEffect per gestire preferenze utente
 * - Context API per stato globale
 * - Persistenza con localStorage
 * - Gestione eventi del sistema
 * - Cleanup e ottimizzazione
 * - Hook personalizzati per logica complessa
 */

// Context per il tema
const ThemeContext = createContext();

// Hook personalizzato per il tema
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve essere usato dentro ThemeProvider');
  }
  return context;
}

// Hook per localStorage con validazione
function useLocalStorage(key, initialValue, validator = null) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        return validator ? validator(parsed) : parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const validatedValue = validator ? validator(valueToStore) : valueToStore;
      setStoredValue(validatedValue);
      window.localStorage.setItem(key, JSON.stringify(validatedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, validator]);
  
  return [storedValue, setValue];
}

// Hook per rilevare preferenze sistema
function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState('light');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Imposta il tema iniziale
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Ascolta i cambiamenti
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return systemTheme;
}

// Hook per gestire il tema
function useThemeManager() {
  const [theme, setTheme] = useLocalStorage('theme', 'system', (value) => {
    return ['light', 'dark', 'system'].includes(value) ? value : 'system';
  });
  const [accentColor, setAccentColor] = useLocalStorage('accent-color', '#007bff');
  const [fontSize, setFontSize] = useLocalStorage('font-size', 'medium', (value) => {
    return ['small', 'medium', 'large'].includes(value) ? value : 'medium';
  });
  const [animations, setAnimations] = useLocalStorage('animations', true);
  
  const systemTheme = useSystemTheme();
  
  // Calcola il tema effettivo
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  
  // Applica il tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Rimuovi classi precedenti
    root.classList.remove('theme-light', 'theme-dark');
    
    // Aggiungi la classe del tema corrente
    root.classList.add(`theme-${effectiveTheme}`);
    
    // Imposta variabili CSS
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--font-size', fontSize === 'small' ? '14px' : 
                                         fontSize === 'large' ? '18px' : '16px');
    
    // Gestisci le animazioni
    if (!animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }
    
  }, [effectiveTheme, accentColor, fontSize, animations]);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      switch (prev) {
        case 'light': return 'dark';
        case 'dark': return 'system';
        case 'system': return 'light';
        default: return 'light';
      }
    });
  }, [setTheme]);
  
  const setThemeValue = useCallback((newTheme) => {
    setTheme(newTheme);
  }, [setTheme]);
  
  return {
    theme,
    effectiveTheme,
    accentColor,
    fontSize,
    animations,
    systemTheme,
    setTheme: setThemeValue,
    setAccentColor,
    setFontSize,
    setAnimations,
    toggleTheme
  };
}

// Provider del tema
function ThemeProvider({ children }) {
  const themeManager = useThemeManager();
  
  return (
    <ThemeContext.Provider value={themeManager}>
      {children}
    </ThemeContext.Provider>
  );
}

// Componente per il selettore del tema
function ThemeSelector() {
  const { theme, effectiveTheme, systemTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid var(--border-color)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-color)' }}>
        🎨 Tema
      </h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={() => setTheme('light')}
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'light' ? 'var(--accent-color)' : 'var(--button-background)',
            color: theme === 'light' ? 'white' : 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ☀️ Chiaro
        </button>
        
        <button
          onClick={() => setTheme('dark')}
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'dark' ? 'var(--accent-color)' : 'var(--button-background)',
            color: theme === 'dark' ? 'white' : 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🌙 Scuro
        </button>
        
        <button
          onClick={() => setTheme('system')}
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'system' ? 'var(--accent-color)' : 'var(--button-background)',
            color: theme === 'system' ? 'white' : 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🖥️ Sistema
        </button>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        <span>
          Tema attivo: {effectiveTheme === 'light' ? '☀️ Chiaro' : '🌙 Scuro'}
          {theme === 'system' && ` (Sistema: ${systemTheme === 'light' ? '☀️' : '🌙'})`}
        </span>
        
        <button
          onClick={toggleTheme}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--button-background)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 Cambia
        </button>
      </div>
    </div>
  );
}

// Componente per il selettore del colore
function ColorSelector() {
  const { accentColor, setAccentColor } = useTheme();
  
  const colors = [
    { name: 'Blu', value: '#007bff' },
    { name: 'Verde', value: '#28a745' },
    { name: 'Rosso', value: '#dc3545' },
    { name: 'Arancione', value: '#fd7e14' },
    { name: 'Viola', value: '#6f42c1' },
    { name: 'Rosa', value: '#e83e8c' },
    { name: 'Teal', value: '#20c997' },
    { name: 'Indaco', value: '#6610f2' }
  ];
  
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid var(--border-color)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-color)' }}>
        🎨 Colore Accent
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
        gap: '10px',
        marginBottom: '15px'
      }}>
        {colors.map(color => (
          <button
            key={color.value}
            onClick={() => setAccentColor(color.value)}
            style={{
              padding: '12px',
              backgroundColor: color.value,
              border: accentColor === color.value ? '3px solid var(--text-color)' : '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {color.name}
          </button>
        ))}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: 'var(--text-secondary)'
      }}>
        <span>Colore personalizzato:</span>
        <input
          type="color"
          value={accentColor}
          onChange={(e) => setAccentColor(e.target.value)}
          style={{
            width: '40px',
            height: '30px',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        />
        <span>{accentColor}</span>
      </div>
    </div>
  );
}

// Componente per le impostazioni di accessibilità
function AccessibilitySettings() {
  const { fontSize, setFontSize, animations, setAnimations } = useTheme();
  
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid var(--border-color)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-color)' }}>
        ♿ Accessibilità
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-color)',
          fontWeight: 'bold'
        }}>
          Dimensione Font
        </label>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { value: 'small', label: 'Piccolo', size: '14px' },
            { value: 'medium', label: 'Medio', size: '16px' },
            { value: 'large', label: 'Grande', size: '18px' }
          ].map(size => (
            <button
              key={size.value}
              onClick={() => setFontSize(size.value)}
              style={{
                padding: '8px 16px',
                backgroundColor: fontSize === size.value ? 'var(--accent-color)' : 'var(--button-background)',
                color: fontSize === size.value ? 'white' : 'var(--text-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: size.size
              }}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--text-color)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={animations}
            onChange={(e) => setAnimations(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--accent-color)'
            }}
          />
          <span>Abilita animazioni</span>
        </label>
        
        <p style={{
          margin: '5px 0 0 0',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          Disabilita per ridurre il movimento e migliorare le performance
        </p>
      </div>
    </div>
  );
}

// Componente per il preview del tema
function ThemePreview() {
  const { effectiveTheme, accentColor } = useTheme();
  
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid var(--border-color)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-color)' }}>
        👁️ Anteprima Tema
      </h3>
      
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--background-color)',
        borderRadius: '8px',
        border: '2px solid var(--accent-color)'
      }}>
        <h4 style={{ 
          margin: '0 0 10px 0', 
          color: 'var(--accent-color)',
          fontSize: '18px'
        }}>
          Titolo di Esempio
        </h4>
        
        <p style={{ 
          margin: '0 0 15px 0', 
          color: 'var(--text-color)',
          lineHeight: '1.5'
        }}>
          Questo è un paragrafo di esempio per mostrare come appare il testo 
          con il tema corrente. Il colore accent è {accentColor}.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Pulsante Primario
          </button>
          
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'var(--button-background)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Pulsante Secondario
          </button>
        </div>
        
        <div style={{
          padding: '10px',
          backgroundColor: 'var(--accent-color)20',
          border: '1px solid var(--accent-color)',
          borderRadius: '4px',
          fontSize: '14px',
          color: 'var(--text-color)'
        }}>
          <strong>Info:</strong> Tema attivo: {effectiveTheme === 'light' ? '☀️ Chiaro' : '🌙 Scuro'}
        </div>
      </div>
    </div>
  );
}

// Componente per le statistiche del tema
function ThemeStats() {
  const { theme, effectiveTheme, accentColor, fontSize, animations } = useTheme();
  
  const stats = [
    { label: 'Tema Selezionato', value: theme },
    { label: 'Tema Effettivo', value: effectiveTheme },
    { label: 'Colore Accent', value: accentColor },
    { label: 'Dimensione Font', value: fontSize },
    { label: 'Animazioni', value: animations ? 'Abilitate' : 'Disabilitate' }
  ];
  
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '8px',
      padding: '20px',
      border: '1px solid var(--border-color)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-color)' }}>
        📊 Statistiche Tema
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            padding: '12px',
            backgroundColor: 'var(--background-color)',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '4px'
            }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-color)',
              fontWeight: 'bold'
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principale
function ThemeManager() {
  return (
    <ThemeProvider>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px'
        }}>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: 'var(--text-color)'
          }}>
            🎨 Gestione Tema e Preferenze
          </h1>
          
          <ThemeSelector />
          <ColorSelector />
          <AccessibilitySettings />
          <ThemePreview />
          <ThemeStats />
          
          {/* Informazioni */}
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'var(--card-background)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-color)' }}>
              ℹ️ Informazioni
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li>Le preferenze vengono salvate automaticamente in localStorage</li>
              <li>Il tema "Sistema" segue le preferenze del tuo dispositivo</li>
              <li>Le modifiche vengono applicate immediatamente</li>
              <li>Le impostazioni di accessibilità migliorano l'usabilità</li>
              <li>Il colore accent personalizza l'interfaccia</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* CSS per i temi */}
      <style>
        {`
          :root {
            --background-color: #ffffff;
            --text-color: #333333;
            --text-secondary: #666666;
            --card-background: #f8f9fa;
            --border-color: #dee2e6;
            --button-background: #e9ecef;
            --accent-color: #007bff;
            --font-size: 16px;
          }
          
          .theme-dark {
            --background-color: #1a1a1a;
            --text-color: #ffffff;
            --text-secondary: #cccccc;
            --card-background: #2d2d2d;
            --border-color: #404040;
            --button-background: #404040;
          }
          
          .no-animations * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          }
        `}
      </style>
    </ThemeProvider>
  );
}

export default ThemeManager;
