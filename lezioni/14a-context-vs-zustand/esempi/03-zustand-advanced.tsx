/**
 * Esempio 3: Zustand Avanzato - Store Complesso con Multiple Slices
 * 
 * COSA DIMOSTRA QUESTO ESEMPIO:
 * ===============================
 * Questo esempio mostra come organizzare uno store Zustand complesso per applicazioni reali.
 * 
 * CONCETTI CHIAVE:
 * ---------------
 * 1. **Multiple Slices**: Organizzare lo store in sezioni logiche (User, Cart, Notifications)
 * 2. **Async Actions**: Gestire chiamate API e operazioni asincrone
 * 3. **Computed Values**: Calcolare valori derivati usando get()
 * 4. **Selective Subscription Avanzata**: Ogni sezione si ri-renderizza solo quando necessario
 * 
 * RISULTATO ATTESO:
 * =================
 * Un'applicazione completa con:
 * - Gestione utente (login/logout con async)
 * - Carrello shopping (aggiungi/rimuovi/modifica quantità)
 * - Sistema di notifiche (success/error/info)
 * - Ogni sezione indipendente e performante
 */

import { create } from 'zustand'
import React from 'react'

// ==================== DEFINIZIONE TIPI ====================
/**
 * STEP 1: Definiamo i tipi per i nostri dati
 * 
 * SPIEGAZIONE:
 * ------------
 * Prima di creare lo store, definiamo le interfacce TypeScript per:
 * - User: dati dell'utente loggato
 * - CartItem: elementi nel carrello
 * - Notification: messaggi di notifica
 * 
 * Questi tipi ci aiutano a mantenere il codice type-safe e leggibile.
 */
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'editor'
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  timestamp: number
}

// ==================== DEFINIZIONE INTERFACCIA STORE ====================
/**
 * STEP 2: Definiamo l'interfaccia completa dello store
 * 
 * SPIEGAZIONE:
 * ------------
 * Organizziamo lo store in "slices" (fette):
 * 
 * 1. USER SLICE: Gestione utente
 *    - user: dati utente corrente (null se non loggato)
 *    - isLoadingUser: stato di caricamento
 *    - userError: eventuali errori
 *    - setUser: imposta utente direttamente
 *    - fetchUser: carica utente da API (async)
 *    - logout: esce dall'account
 * 
 * 2. CART SLICE: Gestione carrello
 *    - cartItems: array di elementi nel carrello
 *    - addToCart: aggiunge elemento
 *    - removeFromCart: rimuove elemento
 *    - updateQuantity: modifica quantità
 *    - clearCart: svuota carrello
 *    - getCartTotal: calcola totale (computed value)
 *    - getCartItemCount: conta elementi (computed value)
 * 
 * 3. NOTIFICATIONS SLICE: Sistema notifiche
 *    - notifications: array di notifiche
 *    - addNotification: aggiunge notifica
 *    - removeNotification: rimuove notifica
 *    - clearNotifications: cancella tutte
 * 
 * Ogni slice è indipendente e può essere usata separatamente!
 */
interface AppStore {
  // ==================== USER SLICE ====================
  user: User | null
  isLoadingUser: boolean
  userError: string | null
  setUser: (user: User) => void
  fetchUser: (id: number) => Promise<void>
  logout: () => void
  
  // ==================== CART SLICE ====================
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  
  // ==================== NOTIFICATIONS SLICE ====================
  notifications: Notification[]
  addNotification: (message: string, type: Notification['type']) => void
  removeNotification: (id: number) => void
  clearNotifications: () => void
}

// ==================== CREAZIONE STORE ====================
/**
 * STEP 3: Creiamo lo store con tutte le slices
 * 
 * SPIEGAZIONE PASSO-PASSO:
 * -------------------------
 * create<AppStore>((set, get) => ({ ... }))
 * 
 * - set: funzione per aggiornare lo stato
 * - get: funzione per leggere lo stato corrente (utile per computed values)
 * 
 * NOTA: L'uso di get() è importante per i computed values perché:
 * - Non causa re-render quando viene chiamato
 * - Legge sempre lo stato più aggiornato
 * - Perfetto per calcoli che non devono essere nello stato
 */
const useAppStore = create<AppStore>((set, get) => ({
  // ==================== USER SLICE ====================
  /**
   * USER SLICE - Stato iniziale
   */
  user: null,                    // Nessun utente loggato inizialmente
  isLoadingUser: false,         // Non stiamo caricando nessun utente
  userError: null,               // Nessun errore
  
  /**
   * setUser: Imposta l'utente direttamente
   * 
   * Quando usarla: Quando hai già i dati utente (es. da localStorage)
   */
  setUser: (user) => set({ user }),
  
  /**
   * fetchUser: Carica utente da API (async action)
   * 
   * SPIEGAZIONE PASSO-PASSO:
   * 1. set({ isLoadingUser: true }) → Mostra loading
   * 2. await chiamata API → Simula chiamata (in realtà sarebbe fetch(...))
   * 3. set({ user, isLoadingUser: false }) → Salva utente e nasconde loading
   * 4. catch error → Gestisce eventuali errori
   * 
   * RISULTATO: 
   * - Durante il caricamento: isLoadingUser = true
   * - Dopo il caricamento: user contiene i dati, isLoadingUser = false
   * - Se errore: userError contiene il messaggio
   */
  fetchUser: async (id: number) => {
    // Step 1: Inizia il caricamento
    set({ isLoadingUser: true, userError: null })
    
    try {
      // Step 2: Simula chiamata API (in realtà sarebbe: await fetch(`/api/users/${id}`))
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Step 3: Crea dati utente mock (in realtà verrebbero dall'API)
      const mockUser: User = {
        id,
        name: `User ${id}`,
        email: `user${id}@example.com`,
        role: id === 1 ? 'admin' : 'user'
      }
      
      // Step 4: Salva utente e termina loading
      set({ user: mockUser, isLoadingUser: false })
    } catch (error) {
      // Step 5: Gestisci errore
      set({ 
        userError: error instanceof Error ? error.message : 'Errore sconosciuto',
        isLoadingUser: false 
      })
    }
  },
  
  /**
   * logout: Esce dall'account
   * 
   * Semplicemente resetta user a null
   */
  logout: () => set({ user: null }),
  
  // ==================== CART SLICE ====================
  /**
   * CART SLICE - Stato iniziale
   */
  cartItems: [],  // Carrello vuoto inizialmente
  
  /**
   * addToCart: Aggiunge elemento al carrello
   * 
   * SPIEGAZIONE PASSO-PASSO:
   * 1. Controlla se l'elemento esiste già nel carrello
   * 2. Se esiste: incrementa la quantità
   * 3. Se non esiste: aggiungi nuovo elemento con quantity = 1
   * 
   * RISULTATO: L'elemento viene aggiunto o la sua quantità incrementata
   */
  addToCart: (item) => set((state) => {
    // Cerca se l'elemento esiste già nel carrello
    const existingItem = state.cartItems.find(i => i.id === item.id)
    
    if (existingItem) {
      // Se esiste, incrementa la quantità
      return {
        cartItems: state.cartItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
    }
    
    // Se non esiste, aggiungi nuovo elemento con quantity = 1
    return {
      cartItems: [...state.cartItems, { ...item, quantity: 1 }]
    }
  }),
  
  /**
   * removeFromCart: Rimuove elemento dal carrello
   * 
   * Filtra l'array rimuovendo l'elemento con l'id specificato
   */
  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== id)
  })),
  
  /**
   * updateQuantity: Modifica la quantità di un elemento
   * 
   * SPIEGAZIONE:
   * - Trova l'elemento con l'id specificato
   * - Aggiorna la sua quantità
   * - Rimuove elementi con quantity <= 0
   */
  updateQuantity: (id, quantity) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0)  // Rimuovi elementi con quantità 0
  })),
  
  /**
   * clearCart: Svuota completamente il carrello
   */
  clearCart: () => set({ cartItems: [] }),
  
  /**
   * getCartTotal: Calcola il totale del carrello (COMPUTED VALUE)
   * 
   * SPIEGAZIONE:
   * ------------
   * Questo è un "computed value" (valore calcolato):
   * - Non è salvato nello stato (non occupa memoria)
   * - Viene calcolato ogni volta che viene chiamato
   * - Usa get() per leggere lo stato corrente
   * - NON causa re-render quando viene chiamato
   * 
   * PERCHÉ NON SALVARE IL TOTALE NELLO STATO?
   * - Il totale può essere sempre calcolato da cartItems
   * - Evitiamo di dover sincronizzare cartItems e total
   * - Meno codice, meno bug
   */
  getCartTotal: () => {
    const state = get()  // Leggi lo stato corrente senza causare re-render
    return state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
  
  /**
   * getCartItemCount: Conta il numero totale di elementi nel carrello
   * 
   * Stesso concetto di getCartTotal - computed value
   */
  getCartItemCount: () => {
    const state = get()
    return state.cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },
  
  // ==================== NOTIFICATIONS SLICE ====================
  /**
   * NOTIFICATIONS SLICE - Stato iniziale
   */
  notifications: [],  // Nessuna notifica inizialmente
  
  /**
   * addNotification: Aggiunge una notifica
   * 
   * SPIEGAZIONE:
   * - Crea una nuova notifica con id univoco (timestamp)
   * - Aggiunge alla fine dell'array
   * - Mantiene le notifiche precedenti
   */
  addNotification: (message, type) => set((state) => ({
    notifications: [
      ...state.notifications,  // Mantieni le notifiche esistenti
      {
        id: Date.now(),        // ID univoco basato su timestamp
        message,
        type,
        timestamp: Date.now()
      }
    ]
  })),
  
  /**
   * removeNotification: Rimuove una notifica specifica
   */
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  /**
   * clearNotifications: Rimuove tutte le notifiche
   */
  clearNotifications: () => set({ notifications: [] }),
}))

// ==================== COMPONENTI ====================
/**
 * STEP 4: Creiamo i componenti che usano lo store
 * 
 * Ogni componente usa selective subscription per accedere solo alle parti necessarie.
 */

/**
 * UserSection: Componente per gestire l'utente
 * 
 * COSA DIMOSTRA:
 * --------------
 * 1. Selective subscription: usa solo user, isLoadingUser, userError, fetchUser, logout
 * 2. Gestione stati async: mostra loading, error, o dati utente
 * 3. Questo componente NON si ri-renderizza quando cartItems o notifications cambiano!
 */
function UserSection(): React.JSX.Element {
  // Selective subscription: questo componente si sottoscrive SOLO alla slice User
  // NON si ri-renderizza quando cartItems o notifications cambiano!
  const { user, isLoadingUser, userError, fetchUser, logout } = useAppStore((state) => ({
    user: state.user,
    isLoadingUser: state.isLoadingUser,
    userError: state.userError,
    fetchUser: state.fetchUser,
    logout: state.logout
  }))
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: '#e7f3ff',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #b3d9ff'
    }}>
      <h2 style={{ marginTop: 0 }}>User Section</h2>
      <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
        💡 Questo componente si ri-renderizza SOLO quando user, isLoadingUser o userError cambiano.
        NON si ri-renderizza quando aggiungi prodotti al carrello!
      </p>
      
      {/* Mostra loading durante il caricamento */}
      {isLoadingUser ? (
        <div>Loading user...</div>
      ) : userError ? (
        /* Mostra errore se presente */
        <div style={{ color: '#dc3545' }}>Error: {userError}</div>
      ) : user ? (
        /* Mostra dati utente se loggato */
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button
            onClick={logout}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        /* Mostra pulsante login se non loggato */
        <button
          onClick={() => fetchUser(1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login (Fetch User)
        </button>
      )}
    </section>
  )
}

/**
 * CartSection: Componente per gestire il carrello
 * 
 * COSA DIMOSTRA:
 * --------------
 * 1. Selective subscription: usa solo cartItems e actions del carrello
 * 2. Computed values: usa getCartTotal() e getCartItemCount()
 * 3. Questo componente NON si ri-renderizza quando user o notifications cambiano!
 */
function CartSection(): React.JSX.Element {
  // Selective subscription: questo componente si sottoscrive SOLO alla slice Cart
  const cartItems = useAppStore((state) => state.cartItems)
  const { addToCart, removeFromCart, updateQuantity, clearCart } = useAppStore((state) => ({
    addToCart: state.addToCart,
    removeFromCart: state.removeFromCart,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart
  }))
  
  // Computed values: queste funzioni calcolano valori senza causare re-render
  const getTotal = useAppStore((state) => state.getCartTotal)
  const getItemCount = useAppStore((state) => state.getCartItemCount)
  
  // Chiamiamo le funzioni per ottenere i valori calcolati
  const total = getTotal()
  const itemCount = getItemCount()
  
  // Prodotti mock disponibili
  const mockProducts = [
    { id: 1, name: 'Prodotto A', price: 10 },
    { id: 2, name: 'Prodotto B', price: 20 },
    { id: 3, name: 'Prodotto C', price: 30 },
  ]
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: '#fff3cd',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #ffc107'
    }}>
      <h2 style={{ marginTop: 0 }}>Cart Section</h2>
      <p style={{ fontSize: '14px', color: '#856404', marginTop: '8px' }}>
        💡 Questo componente si ri-renderizza SOLO quando cartItems cambiano.
        NOTA: getCartTotal() e getCartItemCount() sono computed values - vengono calcolati al volo!
      </p>
      
      {/* Lista prodotti disponibili */}
      <div style={{ marginBottom: '16px' }}>
        <h3>Products</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {mockProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add {product.name} (€{product.price})
            </button>
          ))}
        </div>
      </div>
      
      {/* Lista elementi nel carrello */}
      <div style={{ marginBottom: '16px' }}>
        <h3>Cart Items ({itemCount} items, €{total.toFixed(2)})</h3>
        {cartItems.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cartItems.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '12px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #dee2e6'
                }}
              >
                <div>
                  <strong>{item.name}</strong> - €{item.price} x {item.quantity}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Cart
          </button>
        )}
      </div>
    </section>
  )
}

/**
 * NotificationsSection: Componente per gestire le notifiche
 * 
 * COSA DIMOSTRA:
 * --------------
 * 1. Selective subscription: usa solo notifications slice
 * 2. Questo componente NON si ri-renderizza quando user o cartItems cambiano!
 */
function NotificationsSection(): React.JSX.Element {
  // Selective subscription: questo componente si sottoscrive SOLO alla slice Notifications
  const notifications = useAppStore((state) => state.notifications)
  const { addNotification, removeNotification, clearNotifications } = useAppStore((state) => ({
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications
  }))
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: '#d1ecf1',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #bee5eb'
    }}>
      <h2 style={{ marginTop: 0 }}>Notifications Section</h2>
      <p style={{ fontSize: '14px', color: '#0c5460', marginTop: '8px' }}>
        💡 Questo componente si ri-renderizza SOLO quando notifications cambiano.
        Prova ad aggiungere prodotti al carrello - le notifiche non si ri-renderizzano!
      </p>
      
      {/* Pulsanti per aggiungere notifiche */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => addNotification('Operazione completata!', 'success')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Success
        </button>
        <button
          onClick={() => addNotification('Qualcosa è andato storto', 'error')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Error
        </button>
        <button
          onClick={() => addNotification('Informazione importante', 'info')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Info
        </button>
      </div>
      
      {/* Lista notifiche */}
      {notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                padding: '12px',
                backgroundColor: notification.type === 'success' ? '#d4edda' : 
                                 notification.type === 'error' ? '#f8d7da' : '#d1ecf1',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${
                  notification.type === 'success' ? '#c3e6cb' :
                  notification.type === 'error' ? '#f5c6cb' : '#bee5eb'
                }`
              }}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={clearNotifications}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </section>
  )
}

/**
 * SummarySection: Componente che mostra un riepilogo
 * 
 * COSA DIMOSTRA:
 * --------------
 * Questo componente usa selettivamente dati da MULTIPLE slices:
 * - User slice (user)
 * - Cart slice (getCartTotal, getCartItemCount)
 * 
 * Si ri-renderizza solo quando una di queste proprietà cambia.
 */
function SummarySection(): React.JSX.Element {
  // Selective subscription: questo componente usa dati da MULTIPLE slices
  // Si ri-renderizza quando user, cartItems (attraverso getTotal), o getItemCount cambiano
  const getTotal = useAppStore((state) => state.getCartTotal)
  const getItemCount = useAppStore((state) => state.getCartItemCount)
  const user = useAppStore((state) => state.user)
  
  return (
    <section style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h2 style={{ marginTop: 0 }}>Summary</h2>
      <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '8px' }}>
        💡 Questo componente mostra dati da MULTIPLE slices (User + Cart).
        Si ri-renderizza solo quando user o cartItems cambiano.
      </p>
      <p><strong>User:</strong> {user ? user.name : 'Not logged in'}</p>
      <p><strong>Cart Items:</strong> {getItemCount()}</p>
      <p><strong>Cart Total:</strong> €{getTotal().toFixed(2)}</p>
    </section>
  )
}

// ==================== COMPONENTE PRINCIPALE ====================
/**
 * STEP 5: Componente principale
 * 
 * RISULTATO FINALE:
 * -----------------
 * Quando esegui questo esempio:
 * 1. Vedi 4 sezioni indipendenti (User, Cart, Notifications, Summary)
 * 2. Ogni sezione si ri-renderizza SOLO quando i suoi dati cambiano
 * 3. Puoi:
 *    - Fare login/logout (User section)
 *    - Aggiungere prodotti al carrello (Cart section)
 *    - Aggiungere notifiche (Notifications section)
 *    - Vedere un riepilogo (Summary section)
 * 
 * PERFORMANCE:
 * ------------
 * - UserSection: si ri-renderizza solo quando user cambia
 * - CartSection: si ri-renderizza solo quando cartItems cambiano
 * - NotificationsSection: si ri-renderizza solo quando notifications cambiano
 * - SummarySection: si ri-renderizza quando user o cartItems cambiano
 * 
 * Questo è possibile grazie alla selective subscription di Zustand!
 */
export default function ZustandAdvancedExample(): React.JSX.Element {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginTop: 0 }}>Zustand Avanzato - Store Complesso</h1>
      
      <div style={{
        padding: '16px',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #b3d9ff'
      }}>
        <h3 style={{ marginTop: 0 }}>Cosa Vedrai</h3>
        <ul>
          <li>✅ Store complesso con multiple slices (User, Cart, Notifications)</li>
          <li>✅ Async actions (fetchUser con loading e error states)</li>
          <li>✅ Computed values (getCartTotal, getCartItemCount)</li>
          <li>✅ Selective subscription per ogni sezione</li>
          <li>✅ Nessun Provider necessario</li>
        </ul>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#0c5460' }}>
          <strong>Prova:</strong> Apri la console (F12) e interagisci con le diverse sezioni.
          Noterai che ogni sezione si ri-renderizza SOLO quando i suoi dati cambiano!
        </p>
      </div>
      
      <UserSection />
      <CartSection />
      <NotificationsSection />
      <SummarySection />
    </div>
  )
}
