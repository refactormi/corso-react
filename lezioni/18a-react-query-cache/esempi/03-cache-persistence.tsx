import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect } from 'react'

/**
 * Esempio 3: Cache Persistence - Salvare Cache nel LocalStorage
 * 
 * Questo esempio mostra come persistire la cache di React Query:
 * - Salvare cache in localStorage
 * - Restore cache al mount
 * - Gestione errori e cleanup
 * 
 * Nota: Per uso production, considera @tanstack/react-query-persist-client
 */

// Simulazione API
interface Settings {
  theme: 'light' | 'dark'
  language: 'it' | 'en' | 'es'
  notifications: boolean
}

const fetchSettings = async (): Promise<Settings> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Carica da localStorage se presente
  const saved = localStorage.getItem('settings-cache')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      // Ignora errori di parsing
    }
  }
  
  // Default settings
  return {
    theme: 'light',
    language: 'it',
    notifications: true,
  }
}

const saveSettings = async (settings: Settings): Promise<Settings> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Salva in localStorage
  localStorage.setItem('settings-cache', JSON.stringify(settings))
  
  return settings
}

// Helper per salvare cache manualmente
function saveCacheToStorage(queryClient: QueryClient): void {
  const cache = queryClient.getQueryCache()
  const queries = cache.getAll()
  
  const cacheData: Record<string, unknown> = {}
  
  queries.forEach(query => {
    if (query.state.data) {
      cacheData[JSON.stringify(query.queryKey)] = {
        data: query.state.data,
        dataUpdatedAt: query.state.dataUpdatedAt,
      }
    }
  })
  
  localStorage.setItem('react-query-cache', JSON.stringify(cacheData))
}

// Helper per ripristinare cache
function restoreCacheFromStorage(queryClient: QueryClient): void {
  try {
    const saved = localStorage.getItem('react-query-cache')
    if (!saved) return
    
    const cacheData = JSON.parse(saved)
    
    Object.entries(cacheData).forEach(([key, value]: [string, any]) => {
      try {
        const queryKey = JSON.parse(key)
        queryClient.setQueryData(queryKey, value.data)
      } catch {
        // Ignora errori di parsing
      }
    })
  } catch {
    // Ignora errori
  }
}

// Componente demo
function CachePersistenceDemo(): JSX.Element {
  const queryClient = useQueryClient()
  
  // Query per settings con cache persistence
  const { data: settings, isLoading, refetch } = useQuery<Settings>({
    queryKey: ['settings-persisted'],
    queryFn: fetchSettings,
    staleTime: Infinity, // Settings non cambiano spesso
    gcTime: Infinity, // Mantieni in cache sempre
  })
  
  // Salva cache quando cambia
  useEffect(() => {
    if (settings) {
      saveCacheToStorage(queryClient)
    }
  }, [settings, queryClient])
  
  // Ripristina cache al mount
  useEffect(() => {
    restoreCacheFromStorage(queryClient)
  }, [queryClient])
  
  const handleThemeChange = (theme: 'light' | 'dark'): void => {
    if (settings) {
      const newSettings = { ...settings, theme }
      queryClient.setQueryData(['settings-persisted'], newSettings)
      saveSettings(newSettings)
    }
  }
  
  const handleLanguageChange = (language: 'it' | 'en' | 'es'): void => {
    if (settings) {
      const newSettings = { ...settings, language }
      queryClient.setQueryData(['settings-persisted'], newSettings)
      saveSettings(newSettings)
    }
  }
  
  const handleNotificationsToggle = (): void => {
    if (settings) {
      const newSettings = { ...settings, notifications: !settings.notifications }
      queryClient.setQueryData(['settings-persisted'], newSettings)
      saveSettings(newSettings)
    }
  }
  
  const handleClearCache = (): void => {
    localStorage.removeItem('react-query-cache')
    localStorage.removeItem('settings-cache')
    queryClient.removeQueries({ queryKey: ['settings-persisted'] })
    refetch()
  }
  
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading settings...</div>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Cache Persistence Demo</h2>
      
      <div style={{
        padding: '16px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ marginTop: 0 }}>Come Funziona</h3>
        <ul>
          <li>Le impostazioni vengono salvate in localStorage</li>
          <li>La cache viene ripristinata al reload della pagina</li>
          <li>Le modifiche vengono salvate automaticamente</li>
          <li>Puoi pulire la cache con il pulsante "Clear Cache"</li>
        </ul>
      </div>
      
      {settings && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ marginTop: 0 }}>Settings</h3>
          
          {/* Theme */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Theme:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleThemeChange('light')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: settings.theme === 'light' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: settings.theme === 'dark' ? '#007bff' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Dark
              </button>
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#6c757d' }}>
              Current: {settings.theme}
            </div>
          </div>
          
          {/* Language */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Language:
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value as 'it' | 'en' | 'es')}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
                width: '100%',
                maxWidth: '200px'
              }}
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          {/* Notifications */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={handleNotificationsToggle}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontWeight: 'bold' }}>Enable Notifications</span>
            </label>
          </div>
          
          {/* Actions */}
          <div style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #dee2e6',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => refetch()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
            <button
              onClick={handleClearCache}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Cache
            </button>
          </div>
          
          {/* Info */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#d1ecf1',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#0c5460'
          }}>
            <strong>💡 Tip:</strong> Modifica le impostazioni e ricarica la pagina. 
            Le impostazioni verranno ripristinate automaticamente dalla cache!
          </div>
        </div>
      )}
    </div>
  )
}

// Provider wrapper
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})

export default function CachePersistenceExample(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <CachePersistenceDemo />
    </QueryClientProvider>
  )
}

