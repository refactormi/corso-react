import { useState, useEffect } from 'react';

interface TimerProps {
  isActive: boolean
}

// Componente Timer con cleanup
function Timer({ isActive }: TimerProps): JSX.Element {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    console.log('Timer: useEffect - setup');
    
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      console.log('Timer: useEffect - cleanup');
      clearInterval(interval);
    };
  }, [isActive]); // Dependency array

  useEffect(() => {
    console.log('Timer: mounted');
    
    return () => {
      console.log('Timer: unmounted');
    };
  }, []); // Empty dependency array - runs once

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Timer: {seconds}s</h4>
      <p>Status: {isActive ? '🟢 Attivo' : '🔴 Fermo'}</p>
    </div>
  );
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface UserProfileProps {
  userId: string | null
}

// Componente per fetch dati
function UserProfile({ userId }: UserProfileProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    console.log(`Fetching user ${userId}`);
    setLoading(true);
    setError(null);

    // Simula chiamata API
    const fetchUser = async () => {
      try {
        // Simula delay di rete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simula possibile errore
        if (userId === '404') {
          throw new Error('Utente non trovato');
        }

        const mockUser = {
          id: userId,
          name: `Utente ${userId}`,
          email: `user${userId}@example.com`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
        };

        setUser(mockUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // Re-run when userId changes

  if (loading) {
    return (
      <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <p>Caricamento utente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ border: '1px solid #dc3545', padding: 12, borderRadius: 8, backgroundColor: '#f8d7da' }}>
        <p style={{ color: '#721c24', margin: 0 }}>Errore: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <p>Seleziona un utente</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #28a745', padding: 12, borderRadius: 8, backgroundColor: '#d4edda' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>{user.name}</h4>
      <p style={{ margin: '0 0 4px 0' }}>Email: {user.email}</p>
      <p style={{ margin: 0 }}>ID: {user.id}</p>
    </div>
  );
}

interface WindowSizeState {
  width: number
  height: number
}

// Componente per window resize
function WindowSize(): JSX.Element {
  const [windowSize, setWindowSize] = useState<WindowSizeState>({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    console.log('WindowSize: adding resize listener');
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('WindowSize: removing resize listener');
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency - setup once

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Dimensioni Finestra</h4>
      <p>Larghezza: {windowSize.width}px</p>
      <p>Altezza: {windowSize.height}px</p>
      <small>Ridimensiona la finestra per vedere l'aggiornamento</small>
    </div>
  );
}

interface DocumentTitleProps {
  title: string
}

// Componente per document title
function DocumentTitle({ title }: DocumentTitleProps): JSX.Element {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    // Cleanup - ripristina il titolo originale
    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Titolo Documento</h4>
      <p>Titolo corrente: "{title}"</p>
      <small>Controlla la tab del browser</small>
    </div>
  );
}

// Hook personalizzato per localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

// Componente per contatore persistente
function PersistentCounter(): JSX.Element {
  const [count, setCount] = useLocalStorage<number>('demo-counter', 0);

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h4>Contatore Persistente</h4>
      <p>Valore: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)} style={{ marginLeft: 8 }}>-1</button>
      <button onClick={() => setCount(0)} style={{ marginLeft: 8 }}>Reset</button>
      <small style={{ display: 'block', marginTop: 8 }}>
        Il valore viene salvato in localStorage
      </small>
    </div>
  );
}

export default function Demo12(): JSX.Element {
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('Demo useEffect');

  return (
    <div style={{ padding: 12 }}>
      <h3>Lezione 12: useEffect e Ciclo di Vita</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Timer con cleanup */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => setTimerActive(!timerActive)}>
              {timerActive ? 'Ferma Timer' : 'Avvia Timer'}
            </button>
            <button onClick={() => setShowTimer(!showTimer)} style={{ marginLeft: 8 }}>
              {showTimer ? 'Nascondi Timer' : 'Mostra Timer'}
            </button>
          </div>
          {showTimer && <Timer isActive={timerActive} />}
        </div>

        {/* Fetch dati */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <select 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Seleziona utente</option>
              <option value="1">Utente 1</option>
              <option value="2">Utente 2</option>
              <option value="3">Utente 3</option>
              <option value="404">Utente 404 (errore)</option>
            </select>
          </div>
          <UserProfile userId={selectedUserId || null} />
        </div>

        {/* Window resize */}
        <WindowSize />

        {/* Document title */}
        <div>
          <div style={{ marginBottom: 12 }}>
            <input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Nuovo titolo documento"
              style={{ width: '100%', padding: 4 }}
            />
          </div>
          <DocumentTitle title={documentTitle} />
        </div>

        {/* Contatore persistente */}
        <PersistentCounter />
      </div>

      <div style={{ marginTop: 20, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
        <h4>Console Log</h4>
        <p>Apri la console del browser (F12) per vedere i log degli useEffect:</p>
        <ul style={{ fontSize: 14, margin: 0 }}>
          <li>Setup e cleanup del timer</li>
          <li>Mount e unmount dei componenti</li>
          <li>Aggiunta e rimozione event listeners</li>
          <li>Fetch dei dati utente</li>
        </ul>
      </div>
    </div>
  );
}
