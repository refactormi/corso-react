import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

/**
 * Esempio 2: Context API con State Management - Autenticazione
 * 
 * Questo esempio mostra come usare Context API per gestire
 * lo stato di autenticazione dell'applicazione, incluso:
 * - Context per auth state
 * - Provider con login/logout logic
 * - Custom hook useAuth per accesso facile
 * - Protected components pattern
 * - Persistenza dell'autenticazione
 */

// 1. Definire i tipi
interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// 2. Creare il Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3. Custom hook per type safety
function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 4. Provider Component
interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  // Simula login API call
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    
    // Simula chiamata API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simula autenticazione valida
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email: email
      }
      setUser(mockUser)
      
      // Salva in localStorage per persistenza
      localStorage.setItem('user', JSON.stringify(mockUser))
    } else {
      throw new Error('Credenziali non valide')
    }
    
    setIsLoading(false)
  }
  
  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('user')
  }
  
  // Carica user da localStorage al mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        // Ignora errori di parsing
      }
    }
  }, [])
  
  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 5. Componenti UI

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  isLoading: boolean
}

function LoginForm({ onLogin, isLoading }: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il login')
    }
  }
  
  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}

function UserProfile(): JSX.Element {
  const { user, logout } = useAuth()
  
  if (!user) {
    return null
  }
  
  return (
    <div style={{
      maxWidth: '600px',
      margin: '50px auto',
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginTop: 0 }}>Profilo Utente</h2>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

// Protected Component Pattern
interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px',
        color: '#666'
      }}>
        <p>Devi essere autenticato per vedere questo contenuto.</p>
      </div>
    )
  }
  
  return <>{children}</>
}

function Dashboard(): JSX.Element {
  const { user } = useAuth()
  
  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h2>Dashboard</h2>
      <p>Benvenuto, {user?.name}!</p>
      <p>Questa è un'area protetta accessibile solo agli utenti autenticati.</p>
    </div>
  )
}

// Componente principale
function App(): JSX.Element {
  const { isAuthenticated, isLoading, login } = useAuth()
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {isAuthenticated ? (
        <>
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          <UserProfile />
        </>
      ) : (
        <LoginForm onLogin={login} isLoading={isLoading} />
      )}
    </div>
  )
}

// Wrapper con Provider
function AppWithProvider(): JSX.Element {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithProvider

