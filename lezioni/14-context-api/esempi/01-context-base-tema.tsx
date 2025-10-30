import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * Esempio 1: Context API Base - Gestione Tema
 * 
 * Questo esempio dimostra l'uso base di Context API per gestire
 * un tema (light/dark) senza props drilling. Mostra come:
 * - Creare un Context con createContext
 * - Creare un Provider con state
 * - Usare useContext per accedere al valore
 * - Consumare il Context in componenti nested
 */

// 1. Definire il tipo del Context
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// 2. Creare il Context con valore default
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 3. Custom hook per usare il Context con type safety
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// 4. Provider Component
interface ThemeProviderProps {
  children: ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  const value: ThemeContextType = {
    theme,
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// 5. Componenti Consumer

function Header(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  
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
      <h1 style={{ margin: 0 }}>App con Tema</h1>
      <button
        onClick={toggleTheme}
        style={{
          padding: '8px 16px',
          backgroundColor: theme === 'light' ? '#333333' : '#ffffff',
          color: theme === 'light' ? '#ffffff' : '#333333',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </header>
  )
}

function Sidebar(): JSX.Element {
  const { theme } = useTheme()
  
  return (
    <aside style={{
      width: '200px',
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderRight: `1px solid ${theme === 'light' ? '#e0e0e0' : '#333333'}`
    }}>
      <h3 style={{ marginTop: 0 }}>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '8px 0', cursor: 'pointer' }}>Home</li>
        <li style={{ padding: '8px 0', cursor: 'pointer' }}>About</li>
        <li style={{ padding: '8px 0', cursor: 'pointer' }}>Contact</li>
      </ul>
    </aside>
  )
}

function MainContent(): JSX.Element {
  const { theme } = useTheme()
  
  return (
    <main style={{
      flex: 1,
      padding: '20px',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#000000' : '#ffffff'
    }}>
      <h2>Contenuto Principale</h2>
      <p>
        Questo componente può accedere al tema senza riceverlo come prop.
        Il Context API elimina la necessità di passare props attraverso
        molti livelli di componenti (props drilling).
      </p>
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#333333',
        borderRadius: '8px'
      }}>
        <p>Tema attuale: <strong>{theme}</strong></p>
        <p>
          Prova a cambiare il tema usando il pulsante nell'header!
          Tutti i componenti si aggiorneranno automaticamente.
        </p>
      </div>
    </main>
  )
}

function Footer(): JSX.Element {
  const { theme } = useTheme()
  
  return (
    <footer style={{
      padding: '20px',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#2a2a2a',
      color: theme === 'light' ? '#000000' : '#ffffff',
      borderTop: `1px solid ${theme === 'light' ? '#e0e0e0' : '#333333'}`,
      textAlign: 'center'
    }}>
      <p style={{ margin: 0 }}>
        © 2024 Esempio Context API - Tema: {theme}
      </p>
    </footer>
  )
}

// 6. Componente principale che usa il Provider
function App(): JSX.Element {
  return (
    <ThemeProvider>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Header />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <MainContent />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App

