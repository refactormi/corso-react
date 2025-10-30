import { createContext, useContext, useState, ReactNode, useMemo } from 'react'

/**
 * Esempio 3: Multiple Contexts - Composizione di Context
 * 
 * Questo esempio mostra come gestire più Context contemporaneamente:
 * - Theme Context per tema light/dark
 * - User Context per informazioni utente
 * - Settings Context per preferenze applicazione
 * - Pattern composizione providers
 * - Ottimizzazione con useMemo per evitare re-render inutili
 */

// ==================== THEME CONTEXT ====================

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  // useMemo per evitare ricreazione dell'oggetto value ad ogni render
  const value = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme }),
    [theme]
  )
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// ==================== USER CONTEXT ====================

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

function useUser(): UserContextType {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  
  const isAdmin = user?.role === 'admin'
  
  const value = useMemo<UserContextType>(
    () => ({ user, setUser, isAdmin }),
    [user, isAdmin]
  )
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// ==================== SETTINGS CONTEXT ====================

interface Settings {
  language: 'it' | 'en' | 'es'
  notifications: boolean
  fontSize: 'small' | 'medium' | 'large'
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const defaultSettings: Settings = {
  language: 'it',
  notifications: true,
  fontSize: 'medium'
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

function SettingsProvider({ children }: SettingsProviderProps): JSX.Element {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  
  const updateSettings = (updates: Partial<Settings>): void => {
    setSettings(prev => ({ ...prev, ...updates }))
  }
  
  const resetSettings = (): void => {
    setSettings(defaultSettings)
  }
  
  const value = useMemo<SettingsContextType>(
    () => ({ settings, updateSettings, resetSettings }),
    [settings]
  )
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// ==================== COMPOSITION PROVIDER ====================

/**
 * Pattern: Composizione di Providers
 * 
 * Questo componente combina tutti i providers in un unico componente
 * per semplificare l'uso nell'applicazione. Ogni provider è annidato
 * all'interno del precedente.
 */
interface AppProvidersProps {
  children: ReactNode
}

function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <ThemeProvider>
      <UserProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

// ==================== UI COMPONENTS ====================

function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const { user } = useUser()
  
  return (
    <header style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderBottom: `1px solid ${theme === 'light' ? '#e0e0e0' : '#333333'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0 }}>App Multi-Context</h1>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {user && (
          <span style={{ fontSize: '14px' }}>
            {user.name} ({user.role})
          </span>
        )}
        <button
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            backgroundColor: theme === 'light' ? '#333333' : '#ffffff',
            color: theme === 'light' ? '#ffffff' : '#333333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}

function UserSection(): JSX.Element {
  const { user, setUser } = useUser()
  const { theme } = useTheme()
  
  const handleLogin = (): void => {
    setUser({
      id: '1',
      name: 'Mario Rossi',
      email: 'mario@example.com',
      role: 'admin'
    })
  }
  
  const handleLogout = (): void => {
    setUser(null)
  }
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2>Sezione Utente</h2>
      {user ? (
        <div>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Ruolo:</strong> {user.role}</p>
          <button onClick={handleLogout} style={{ marginTop: '10px' }}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin}>
          Login come Admin
        </button>
      )}
    </section>
  )
}

function SettingsSection(): JSX.Element {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { theme } = useTheme()
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2>Impostazioni</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <label>
          Lingua:
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value as Settings['language'] })}
            style={{ marginLeft: '8px' }}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => updateSettings({ notifications: e.target.checked })}
            style={{ marginRight: '8px' }}
          />
          Notifiche
        </label>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label>
          Dimensione font:
          <select
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: e.target.value as Settings['fontSize'] })}
            style={{ marginLeft: '8px' }}
          >
            <option value="small">Piccolo</option>
            <option value="medium">Medio</option>
            <option value="large">Grande</option>
          </select>
        </label>
      </div>
      
      <button onClick={resetSettings}>
        Reset Impostazioni
      </button>
      
      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: theme === 'light' ? '#e0e0e0' : '#333333', borderRadius: '4px' }}>
        <p style={{ margin: 0 }}><strong>Impostazioni attuali:</strong></p>
        <pre style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </section>
  )
}

function AdminPanel(): JSX.Element {
  const { isAdmin } = useUser()
  const { theme } = useTheme()
  
  if (!isAdmin) {
    return null
  }
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#fff3cd' : '#664d03',
      color: theme === 'light' ? '#856404' : '#fff',
      borderRadius: '8px',
      margin: '20px',
      border: `2px solid ${theme === 'light' ? '#ffc107' : '#ffc107'}`
    }}>
      <h2>🔐 Pannello Admin</h2>
      <p>Questa sezione è visibile solo agli amministratori.</p>
      <p>Puoi gestire impostazioni avanzate qui.</p>
    </section>
  )
}

function App(): JSX.Element {
  const { theme } = useTheme()
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff'
    }}>
      <Header />
      <UserSection />
      <SettingsSection />
      <AdminPanel />
    </div>
  )
}

// Export con Provider
function AppWithProviders(): JSX.Element {
  return (
    <AppProviders>
      <App />
    </AppProviders>
  )
}

export default AppWithProviders

