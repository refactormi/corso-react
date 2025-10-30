# Lezione 7c: Conditional Rendering dei Componenti

## 🎯 Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è il conditional rendering e quando utilizzarlo
- Implementare diversi pattern di rendering condizionale
- Gestire stati di caricamento, errore e vuoto
- Ottimizzare le performance del conditional rendering
- Evitare errori comuni nel rendering condizionale

## 📚 Cos'è il Conditional Rendering?

Il **conditional rendering** è la tecnica di mostrare o nascondere elementi dell'interfaccia utente in base a determinate condizioni. È uno dei concetti fondamentali di React per creare interfacce dinamiche e interattive.

### Definizione Ufficiale
> "Il conditional rendering in React funziona come le condizioni in JavaScript. Usa operatori JavaScript come if o l'operatore condizionale per creare elementi che rappresentano lo stato corrente, e lascia che React aggiorni l'UI per abbinarli." - [React.dev](https://react.dev/learn/conditional-rendering)

## 🔄 Pattern di Conditional Rendering

### **1. Operatore Ternario (Ternary Operator)**

```tsx
interface UserGreetingProps {
  isLoggedIn: boolean
  username: string
}

function UserGreeting({ isLoggedIn, username }: UserGreetingProps) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Benvenuto, {username}!</h1>
      ) : (
        <h1>Effettua il login per continuare</h1>
      )}
    </div>
  )
}
```

**Vantaggi:**
- **Conciso** - Sintassi compatta
- **Inline** - Può essere usato direttamente nel JSX
- **Leggibile** - Facile da comprendere per condizioni semplici

**Svantaggi:**
- **Complessità** - Può diventare difficile da leggere con condizioni complesse
- **Annidamento** - Può creare codice annidato difficile da gestire

### **2. Operatore AND (&&)**

```tsx
interface Notification {
  id: number
  message: string
}

interface NotificationListProps {
  notifications: Notification[]
}

function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div>
      <h2>Notifiche</h2>
      {notifications.length > 0 && (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
      )}
      {notifications.length === 0 && (
        <p>Nessuna notifica disponibile</p>
      )}
    </div>
  )
}
```

**Vantaggi:**
- **Semplice** - Perfetto per mostrare/nascondere elementi
- **Performance** - Non renderizza nulla se la condizione è falsa
- **Pulito** - Codice più pulito per condizioni semplici

**Svantaggi:**
- **Limitato** - Non può gestire il caso "else"
- **Falsy values** - Attenzione ai valori falsy (0, "", false)

### **3. Statement if/else**

```tsx
interface User {
  name: string
  email: string
}

interface UserProfileProps {
  user?: User
  isLoading: boolean
  error?: string
}

function UserProfile({ user, isLoading, error }: UserProfileProps) {
  if (isLoading) {
    return <div>Caricamento...</div>
  }
  
  if (error) {
    return <div>Errore: {error}</div>
  }
  
  if (!user) {
    return <div>Utente non trovato</div>
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

**Vantaggi:**
- **Chiaro** - Logica di rendering molto chiara
- **Flessibile** - Può gestire condizioni complesse
- **Early return** - Può usare early return per semplificare

**Svantaggi:**
- **Verboso** - Richiede più codice
- **Non inline** - Non può essere usato direttamente nel JSX

### **4. Variabili Condizionali**

```tsx
interface Product {
  name: string
  price?: number
  description?: string
}

interface ProductCardProps {
  product: Product
  showPrice: boolean
  showDescription: boolean
}

function ProductCard({ product, showPrice, showDescription }: ProductCardProps) {
  let priceElement: React.ReactNode = null
  if (showPrice && product.price) {
    priceElement = <div className="price">€{product.price}</div>
  }
  
  let descriptionElement: React.ReactNode = null
  if (showDescription && product.description) {
    descriptionElement = <p className="description">{product.description}</p>
  }
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      {priceElement}
      {descriptionElement}
    </div>
  )
}
```

**Vantaggi:**
- **Flessibile** - Può gestire logica complessa
- **Riutilizzabile** - Elementi possono essere riutilizzati
- **Testabile** - Facile da testare individualmente

**Svantaggi:**
- **Verboso** - Richiede più codice
- **Complessità** - Può diventare complesso con molte condizioni

## 🎨 Esempi Pratici

### **Esempio 1: Gestione Stati di Caricamento**

```tsx
interface DataItem {
  id: number
  name: string
}

interface DataLoaderProps {
  data?: DataItem[]
  loading: boolean
  error?: string | null
}

function DataLoader({ data, loading, error }: DataLoaderProps) {
  // Early return per stati di caricamento ed errore
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Caricamento dati...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="error">
        <h3>Errore nel caricamento</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Riprova
        </button>
      </div>
    )
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="empty">
        <p>Nessun dato disponibile</p>
      </div>
    )
  }
  
  return (
    <div className="data-list">
      {data.map(item => (
        <div key={item.id} className="data-item">
          {item.name}
        </div>
      ))}
    </div>
  )
}

// Utilizzo
function App() {
  // In una vera app, questi valori sarebbero dinamici
  const data: DataItem[] = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]
  const loading: boolean = false
  const error: string | null = null
  
  return <DataLoader data={data} loading={loading} error={error} />
}
```

**Nota**: In questo esempio, i dati sono passati come props. Nella prossima lezione imparerai come gestire questi dati dinamicamente con lo stato!

### **Esempio 2: Form con Validazione**

```tsx
interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface ContactFormProps {
  formData: FormData
  errors: FormErrors
  isSubmitting: boolean
  isSubmitted: boolean
}

function ContactForm({ formData, errors, isSubmitting, isSubmitted }: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form inviato:', formData)
  }
  
  // Mostra messaggio di successo
  if (isSubmitted) {
    return (
      <div className="success">
        <h3>Messaggio inviato con successo!</h3>
        <p>Ti risponderemo presto.</p>
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          className={errors.name ? 'error' : ''}
          readOnly
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          className={errors.email ? 'error' : ''}
          readOnly
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Messaggio *</label>
        <textarea
          id="message"
          value={formData.message}
          className={errors.message ? 'error' : ''}
          rows={5}
          readOnly
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
      </button>
    </form>
  )
}

// Utilizzo
function App() {
  const formData: FormData = { name: 'Mario', email: 'mario@example.com', message: 'Ciao!' }
  const errors: FormErrors = {}
  const isSubmitting: boolean = false
  const isSubmitted: boolean = false
  
  return (
    <ContactForm 
      formData={formData}
      errors={errors}
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
    />
  )
}
```

**Nota**: Questo esempio mostra il conditional rendering basato sulle props. Nella prossima lezione imparerai come rendere il form interattivo!

### **Esempio 3: Lista con Filtri e Ricerca**

```tsx
interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
}

interface ProductListProps {
  products: Product[]
  searchTerm: string
  selectedCategory: string
  sortBy: 'name' | 'price'
  viewMode: 'grid' | 'list'
}

function ProductList({ 
  products, 
  searchTerm, 
  selectedCategory, 
  sortBy,
  viewMode 
}: ProductListProps) {
  // Filtra e ordina i prodotti basandosi sulle props
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchTerm || product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
        product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  
  // Ottieni categorie uniche
  const categories = ['all', ...new Set(products.map(p => p.category))]
  
  return (
    <div className="product-list">
      {/* Filtri e controlli */}
      <div className="filters">
        <input
          type="text"
          placeholder="Cerca prodotti..."
          value={searchTerm}
          readOnly
        />
        
        <select value={selectedCategory}>
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Tutte le categorie' : category}
            </option>
          ))}
        </select>
        
        <select value={sortBy}>
          <option value="name">Ordina per nome</option>
          <option value="price">Ordina per prezzo</option>
        </select>
        
        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''}>
            Griglia
          </button>
          <button className={viewMode === 'list' ? 'active' : ''}>
            Lista
          </button>
        </div>
      </div>
      
      {/* Risultati */}
      <div className="results">
        <p>
          {filteredProducts.length} prodotti trovati
          {searchTerm && ` per "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in categoria "${selectedCategory}"`}
        </p>
      </div>
      
      {/* Lista prodotti - CONDITIONAL RENDERING */}
      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <h3>Nessun prodotto trovato</h3>
          <p>Prova a modificare i filtri di ricerca</p>
        </div>
      ) : (
        <div className={`products ${viewMode}`}>
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">€{product.price}</p>
              <p className="category">{product.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Utilizzo
function App() {
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, category: 'Elettronica', image: '/laptop.jpg' },
    { id: 2, name: 'Mouse', price: 29, category: 'Elettronica', image: '/mouse.jpg' },
    { id: 3, name: 'Tastiera', price: 79, category: 'Elettronica', image: '/keyboard.jpg' }
  ]
  
  return (
    <ProductList 
      products={products}
      searchTerm=""
      selectedCategory="all"
      sortBy="name"
      viewMode="grid"
    />
  )
}
```

**Nota**: In questo esempio mostriamo conditional rendering potente basato su props. Nella prossima lezione, renderemo i filtri interattivi con lo stato!

### **Esempio 4: Dashboard con Widget Condizionali**

```tsx
interface User {
  name: string
  avatar: string
}

interface Widgets {
  sales: boolean
  users: boolean
  analytics: boolean
  notifications: boolean
}

interface DashboardProps {
  user?: User | null
  activeTab: 'overview' | 'analytics' | 'settings'
  widgets: Widgets
}

function Dashboard({ user, activeTab, widgets }: DashboardProps) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          {user ? (
            <div className="user-profile">
              <img src={user.avatar} alt={user.name} />
              <span>{user.name}</span>
            </div>
          ) : (
            <button className="login-button">Accedi</button>
          )}
        </div>
      </header>
      
      <nav className="dashboard-nav">
        {(['overview', 'analytics', 'settings'] as const).map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
      
      <main className="dashboard-content">
        {/* Contenuto basato sulla tab attiva - CONDITIONAL RENDERING */}
        {activeTab === 'overview' && (
          <div className="overview">
            <h2>Panoramica</h2>
            
            {/* Widget condizionali basati su props */}
            {widgets.sales && (
              <div className="widget sales-widget">
                <h3>Vendite</h3>
                <p>€12,450</p>
              </div>
            )}
            
            {widgets.users && (
              <div className="widget users-widget">
                <h3>Utenti</h3>
                <p>1,234</p>
              </div>
            )}
            
            {widgets.analytics && (
              <div className="widget analytics-widget">
                <h3>Analytics</h3>
                <p>Grafico analytics</p>
              </div>
            )}
            
            {widgets.notifications && (
              <div className="widget notifications-widget">
                <h3>Notifiche</h3>
                <p>5 nuove notifiche</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="analytics">
            <h2>Analytics</h2>
            <p>Grafici e statistiche dettagliate</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings">
            <h2>Impostazioni</h2>
            <p>Configurazione del dashboard</p>
          </div>
        )}
      </main>
    </div>
  )
}

// Utilizzo
function App() {
  const user: User = { name: 'Mario Rossi', avatar: '/avatar.jpg' }
  const activeTab: 'overview' | 'analytics' | 'settings' = 'overview'
  const widgets: Widgets = {
    sales: true,
    users: true,
    analytics: false,
    notifications: true
  }
  
  return <Dashboard user={user} activeTab={activeTab} widgets={widgets} />
}
```

**Esempio potente**: Questo dashboard mostra come usare props per controllare completamente cosa viene renderizzato. Nella prossima lezione, aggiungeremo interattività!

## ⚡ Ottimizzazioni e Best Practices

### **1. Conditional Rendering Efficiente**

```tsx
// ✅ CORRETTO - Conditional rendering con props
interface DataItem {
  id: number
  name: string
  value: number
}

interface DataDisplayProps {
  data: DataItem[]
  showDetails: boolean
}

function DataDisplay({ data, showDetails }: DataDisplayProps) {
  // Calcola solo se necessario
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div>
      <h3>Valore Totale: €{totalValue}</h3>
      {showDetails && (
        <div className="details">
          <h4>Dettagli:</h4>
          <ul>
            {data.map(item => (
              <li key={item.id}>
                {item.name}: €{item.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Utilizzo
function App() {
  const data: DataItem[] = [
    { id: 1, name: 'Prodotto A', value: 100 },
    { id: 2, name: 'Prodotto B', value: 200 }
  ]
  
  return <DataDisplay data={data} showDetails={true} />
}
```

**Nota**: Nelle prossime lezioni imparerai tecniche di ottimizzazione avanzate come `memo` e `useMemo`!

### **2. Gestione degli Errori con Props**

```tsx
// Componente con gestione errori basato su props
interface ErrorBoundaryProps {
  children: React.ReactNode
  hasError: boolean
  errorMessage?: string
  fallback?: React.ReactNode
}

function ErrorBoundary({ children, hasError, errorMessage, fallback }: ErrorBoundaryProps) {
  if (hasError) {
    return fallback || (
      <div className="error-boundary">
        <h2>Qualcosa è andato storto</h2>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    )
  }
  
  return <>{children}</>
}

// Utilizzo
function App() {
  const hasError: boolean = false
  const errorMessage: string = ''
  
  return (
    <ErrorBoundary 
      hasError={hasError}
      errorMessage={errorMessage}
      fallback={<div>Errore nell'applicazione</div>}
    >
      <UserList />
      <UserForm />
    </ErrorBoundary>
  )
}
```

**Nota**: Questo è un esempio semplificato con props. Nelle lezioni avanzate vedrai pattern più sofisticati per la gestione degli errori!

### **3. Conditional Rendering con Suspense**

```tsx
import { Suspense } from 'react'

interface ConditionalLoadingProps {
  showContent: boolean
  content: string
}

function ConditionalLoading({ showContent, content }: ConditionalLoadingProps) {
  return (
    <div>
      {showContent ? (
        <Suspense fallback={<div>Caricamento...</div>}>
          <div className="content">{content}</div>
        </Suspense>
      ) : (
        <div className="placeholder">
          <p>Clicca per caricare il contenuto</p>
        </div>
      )}
    </div>
  )
}

// Utilizzo
function App() {
  const showContent: boolean = true
  const content: string = "Questo è il contenuto caricato!"
  
  return <ConditionalLoading showContent={showContent} content={content} />
}
```

**Nota**: Suspense è una funzionalità avanzata per il lazy loading. La studieremo in dettaglio nelle lezioni finali!

## 🐛 Errori Comuni e Soluzioni

### **Errore: Valori Falsy con &&**

```tsx
// ❌ SBAGLIATO - 0 viene renderizzato
interface CounterProps {
  count: number
}

function CounterBad({ count }: CounterProps) {
  return (
    <div>
      <p>Contatore: {count}</p>
      {count && <p>Il contatore è maggiore di 0</p>}
    </div>
  )
}

// Con count = 0, viene renderizzato "0" invece di nascondere il messaggio

// ✅ CORRETTO - Conversione esplicita a boolean
function CounterGood({ count }: CounterProps) {
  return (
    <div>
      <p>Contatore: {count}</p>
      {count > 0 && <p>Il contatore è maggiore di 0</p>}
    </div>
  )
}

// ✅ CORRETTO - Operatore ternario
function CounterTernary({ count }: CounterProps) {
  return (
    <div>
      <p>Contatore: {count}</p>
      {count ? <p>Il contatore è maggiore di 0</p> : null}
    </div>
  )
}
```

### **Errore: Condizioni Complesse**

```tsx
// ❌ SBAGLIATO - Condizione complessa inline
interface User {
  name: string
  email: string
  role: string
  isActive: boolean
}

interface UserCardProps {
  user: User
  showDetails: boolean
  showActions: boolean
  isAdmin: boolean
}

function UserCardBad({ user, showDetails, showActions, isAdmin }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      {user.isActive && showDetails && (isAdmin || user.role === 'moderator') && (
        <div>
          <p>Email: {user.email}</p>
          <p>Ruolo: {user.role}</p>
        </div>
      )}
    </div>
  )
}

// ✅ CORRETTO - Variabile per la condizione
function UserCardGood({ user, showDetails, showActions, isAdmin }: UserCardProps) {
  const shouldShowDetails = user.isActive && 
    showDetails && 
    (isAdmin || user.role === 'moderator')
  
  return (
    <div>
      <h3>{user.name}</h3>
      {shouldShowDetails && (
        <div>
          <p>Email: {user.email}</p>
          <p>Ruolo: {user.role}</p>
        </div>
      )}
    </div>
  )
}
```

### **Errore: Props non ottimizzate**

```tsx
interface User {
  id: number
  name: string
  email: string
}

interface Config {
  theme: string
  size: string
}

interface UserCardProps {
  user: User
  showDetails: boolean
  config: Config
}

// ❌ PROBLEMA - Oggetto ricreato ad ogni render
function UserListBad({ users, showDetails }: { users: User[]; showDetails: boolean }) {
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          showDetails={showDetails}
          config={{ theme: 'dark', size: 'large' }} // Ricreato ogni volta!
        />
      ))}
    </div>
  )
}

// ✅ SOLUZIONE - Definisci fuori dal componente
const CONFIG: Config = { theme: 'dark', size: 'large' }

function UserListGood({ users, showDetails }: { users: User[]; showDetails: boolean }) {
  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          showDetails={showDetails}
          config={CONFIG}
        />
      ))}
    </div>
  )
}

function UserCard({ user, showDetails, config }: UserCardProps) {
  return (
    <div className={`user-card ${config.theme} ${config.size}`}>
      <h3>{user.name}</h3>
      {showDetails && <p>{user.email}</p>}
    </div>
  )
}
```

**Nota**: Nelle prossime lezioni imparerai `useMemo` per ottimizzare oggetti dinamici!

## 📚 Risorse Aggiuntive

- **[Conditional Rendering](https://react.dev/learn/conditional-rendering)**
- **[Keeping Components Pure](https://react.dev/learn/keeping-components-pure)**
- **[Suspense](https://react.dev/reference/react/Suspense)**
- **[Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)**

---

## 🎓 Complimenti! Hai completato le basi dei componenti React

Hai appena completato un percorso fondamentale:

✅ **Lezione 7a** - Hai imparato cos'è un componente e come usare le **props**  
✅ **Lezione 7b** - Hai imparato a **comporre** componenti per creare UI complesse  
✅ **Lezione 7c** - Hai imparato il **conditional rendering** per interfacce dinamiche

**Tutti gli esempi fino a questo punto hanno usato dati statici passati tramite props.**

## 🚀 Sei pronto per il grande salto!

Nella **prossima lezione** imparerai uno dei concetti più importanti di React:

### 🎯 Lezione 8: Hooks e useState

Scoprirai:
- **Cosa sono gli hooks** e perché hanno rivoluzionato React
- Come usare **useState** per gestire dati che **cambiano nel tempo**
- Come rendere i tuoi componenti **veramente interattivi**

> 💡 **Momento "Aha!"**: Dopo la Lezione 8, potrai tornare a tutti gli esempi che hai visto in 7a-7c e trasformarli da statici a dinamici! Il `DataLoader` potrà davvero caricare dati, il `ContactForm` potrà validare l'input in tempo reale, la `ProductList` potrà essere filtrata e ordinata dall'utente! 
>
> I **pattern** che hai imparato (composizione, conditional rendering) rimarranno identici, ma i **dati** diventeranno vivi! 🎨→✨

---

**Prossima Lezione**: [Lezione 8 - Componenti stateless/stateful e useState](../08-componenti-stateless-stateful/README.md)
