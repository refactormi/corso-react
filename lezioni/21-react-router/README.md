# Lezione 21: React Router v7 - Routing Dichiarativo

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cos'è React Router v7 e le sue novità principali
- Installare e configurare React Router v7 in un'applicazione React con TypeScript
- Creare rotte dichiarative utilizzando l'approccio moderno di v7
- Gestire rotte con parametri dinamici e type safety
- Implementare rotte annidate con layout condivisi
- Passare dati tra rotte utilizzando metodi moderni (useSearchParams, state navigation)
- Utilizzare loader e action functions per data loading e mutazioni
- Gestire errori con error boundaries e useRouteError
- Implementare lazy loading e code splitting per ottimizzare le performance
- Proteggere rotte con pattern di autenticazione e autorizzazione
- Applicare best practices per organizzazione e type safety

## Teoria

### 1. Introduzione a React Router v7

#### Cos'è il Routing nelle Applicazioni Web?

Il **routing** è il meccanismo che determina quale contenuto mostrare all'utente in base all'URL corrente nel browser. Nelle applicazioni web tradizionali, ogni URL corrisponde a una pagina HTML diversa sul server:

```
https://example.com/about    → Server restituisce pagina about.html
https://example.com/contact  → Server restituisce pagina contact.html
```

Nelle **Single Page Applications (SPA)** come quelle costruite con React, c'è un solo file HTML iniziale. Il routing deve essere gestito dal JavaScript lato client per mostrare componenti diversi senza ricaricare l'intera pagina.

#### Cos'è React Router?

**React Router** è una libreria che aggiunge funzionalità di routing alle applicazioni React. Permette di:

1. **Associare URL a componenti**: Definisce quale componente React renderizzare per ogni URL
2. **Navigazione senza ricaricamento**: Cambia il contenuto visualizzato senza ricaricare la pagina
3. **Gestione della History del browser**: Mantiene sincronizzata la barra degli indirizzi con lo stato dell'applicazione
4. **URL condivisibili e bookmarkabili**: Ogni "pagina" ha un URL univoco che può essere salvato o condiviso
5. **Navigazione programmatica**: Permette di cambiare rotta tramite codice JavaScript

#### Perché Serve React Router?

React è una libreria per costruire interfacce utente, ma **non include** funzionalità di routing. Senza React Router, un'applicazione React è essenzialmente una singola pagina statica.

#### Come Funziona React Router?

React Router funziona come un **sistema di mappatura** tra URL e componenti:

1. **L'utente naviga** (clicca un link o digita un URL)
2. **React Router legge l'URL** corrente dalla barra degli indirizzi
3. **Trova la rotta corrispondente** nella configurazione
4. **Renderizza il componente** associato a quella rotta
5. **Aggiorna la History** del browser senza ricaricare la pagina

**Flusso di Navigazione:**

```
Utente clicca su "Chi Siamo"
    ↓
React Router cambia URL a /about
    ↓
React Router trova rotta con path="/about"
    ↓
React Router renderizza componente <About />
    ↓
Browser mostra About senza ricaricare la pagina
```

#### Casi d'Uso Pratici

React Router è essenziale per applicazioni che hanno:

- **Più pagine/sezioni**: Home, About, Blog, Contatti, ecc.
- **Dettagli specifici**: Pagine di dettaglio per prodotti, utenti, articoli, ecc.
- **Filtri e ricerche**: Pagine con filtri e parametri di ricerca
- **Dashboard con sottosezioni**: `/dashboard/settings`, `/dashboard/profile`
- **Autenticazione**: `/login`, `/register`, `/dashboard` (protetta)

**Esempio Reale:**



#### Quando Usare React Router?

React Router è **essenziale** per la maggior parte delle applicazioni React moderne. Ecco quando è necessario:

**✅ Usa React Router quando:**

1. **Hai più di una "pagina" o sezione**
   - Home, About, Blog, Contatti
   - Dashboard con multiple viste
   - Qualsiasi app con navigazione tra schermate diverse

2. **Vuoi navigazione senza ricaricare la pagina (SPA)**
   - Transizioni fluide tra sezioni
   - Mantenimento dello stato durante la navigazione
   - Migliore esperienza utente

3. **Hai bisogno di URL condivisibili e bookmarkabili**
   - Link diretti a pagine specifiche
   - Possibilità di salvare pagine nei preferiti
   - Condivisione di link specifici

4. **Vuoi gestire stato nella URL**
   - Query strings per filtri (`/products?category=electronics`)
   - Deep linking a stati specifici dell'app

5. **Hai bisogno di navigazione programmatica**
   - Redirect dopo login
   - Navigazione basata su eventi
   - Gestione del flusso utente

**❌ Non serve React Router quando:**

1. **Hai una singola pagina senza navigazione**
   - Landing page semplice
   - Pagina di presentazione statica
   - App con un solo schermo

2. **Usi solo componenti modali o accordion**
   - Contenuto mostrato/nascosto senza cambiare URL
   - Interfaccia senza navigazione tra "pagine"

3. **Non hai bisogno di URL specifici**
   - App che non richiedono link condivisibili
   - Interfacce interne senza necessità di bookmark

**Esempio Pratico:**

```tsx
// ✅ CASO D'USO: E-commerce
// Serve React Router perché:
// - Ha più pagine (Home, Prodotti, Carrello, Checkout)
// - URL condivisibili per pagine specifiche
// - Filtri nella URL (/products?category=electronics)
// - Navigazione tra sezioni

// ❌ CASO D'USO: Calcolatrice
// Non serve React Router perché:
// - Una sola interfaccia
// - Nessuna navigazione tra pagine
// - Nessun bisogno di URL specifici
```

### 2. Installazione e Configurazione

#### Installazione

```bash
# Installa React Router v7
npm install react-router

# Oppure con npm
npm install react-router@latest

# Verifica versione installata
npm list react-router
```

**Nota**: React Router v7 usa il pacchetto `react-router` invece di `react-router-dom`. Il pacchetto `react-router-dom` è ancora disponibile ma `react-router` è il pacchetto principale per v7.

#### Configurazione Base con TypeScript

**Step 1: Crea il file di configurazione delle rotte**

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { NotFound } from './pages/NotFound'

// Definisci le rotte con type safety
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '*',
    element: <NotFound />
  }
]

// Crea il router
export const router = createBrowserRouter(routes)
```

**Step 2: Configura il RouterProvider nell'app**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

**Step 3: Struttura Progetto Consigliata**

```
src/
├── router.tsx           # Configurazione rotte
├── main.tsx             # Entry point con RouterProvider
├── pages/               # Componenti pagina
│   ├── Home.tsx
│   ├── About.tsx
│   └── NotFound.tsx
├── components/          # Componenti riutilizzabili
│   ├── Layout.tsx
│   └── Navigation.tsx
└── types/               # Definizioni TypeScript
    └── router.types.ts
```

#### Configurazione Avanzata

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject, Navigate } from 'react-router'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  {
    path: '/home',
    element: <Home />
  },
  // ... altre rotte
]

// Configurazione router con opzioni
export const router = createBrowserRouter(routes, {
  basename: '/app', // Base path per l'applicazione
  future: {
    // Abilita feature future di React Router
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})
```

### 3. Rotte Base

#### Creazione Rotte Dichiarative

L'approccio dichiarativo di React Router v7 permette di definire tutte le rotte in un'unica configurazione:

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Contact } from './pages/Contact'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  }
]

export const router = createBrowserRouter(routes)
```

#### Navigazione con Link

Il componente `Link` permette la navigazione tra rotte senza ricaricare la pagina:

```tsx
// src/components/Navigation.tsx
import { Link } from 'react-router'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps): JSX.Element {
  return (
    <nav className={className}>
      <Link to="/">Home</Link>
      <Link to="/about">Chi Siamo</Link>
      <Link to="/contact">Contatti</Link>
    </nav>
  )
}
```

**Props di Link:**

```tsx
// Link con props avanzate
<Link 
  to="/about"
  relative="path"        // Navigazione relativa
  preventScrollReset    // Previene reset scroll
  replace               // Sostituisce invece di push nella history
  state={{ from: 'home' }} // Passa stato alla rotta
>
  Vai a About
</Link>
```

#### preventScrollReset

La prop `preventScrollReset` controlla se la posizione di scroll deve essere resettata quando si naviga verso una nuova rotta.

**Comportamento Default:**
- Per default, React Router **resetta lo scroll** a `(0, 0)` quando si naviga verso una nuova rotta
- Questo garantisce che ogni pagina inizi dall'alto

**Quando Usare `preventScrollReset={true}`:**

```tsx
// ✅ CASO D'USO: Lista con filtri nella URL
// Vuoi mantenere la posizione di scroll quando cambi filtro

function ProductList(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  return (
    <div>
      <div className="filters">
        {/* Mantieni scroll quando cambi categoria */}
        <Link 
          to="?category=electronics"
          preventScrollReset={true}
        >
          Elettronica
        </Link>
        <Link 
          to="?category=clothing"
          preventScrollReset={true}
        >
          Abbigliamento
        </Link>
      </div>
      
      {/* Lista prodotti lunga */}
      <div className="product-list">
        {/* Se l'utente è scrollato giù e cambia filtro,
            mantiene la posizione invece di tornare in alto */}
      </div>
    </div>
  )
}
```

**Esempio Pratico:**

```tsx
// ❌ SENZA preventScrollReset
// Utente scrolla giù nella lista prodotti
// Clicca su "Filtra per categoria"
// Scroll viene resettato → utente torna in alto (UX negativa)

// ✅ CON preventScrollReset={true}
// Utente scrolla giù nella lista prodotti
// Clicca su "Filtra per categoria"
// Scroll rimane nella stessa posizione → UX migliore
```

#### replace

La prop `replace` controlla come viene gestita la navigazione nella history del browser.

**Comportamento Default (`replace={false}`):**
- Aggiunge una nuova voce nella history del browser
- L'utente può tornare indietro con il pulsante "Indietro"
- La history cresce: `[Home] → [About] → [Contact]`

**Con `replace={true}`:**
- **Sostituisce** la voce corrente nella history invece di aggiungerne una nuova
- L'utente **non può tornare** alla pagina precedente con "Indietro"
- La history rimane: `[Home] → [About]` (Contact sostituisce About)

#### state

La prop `state` permette di passare dati tra rotte **senza esporli nella URL**. I dati vengono memorizzati nella history del browser ma non sono visibili nell'URL.

**Caratteristiche:**
- **Privato**: I dati non appaiono nell'URL
- **Temporaneo**: Persistono solo durante la sessione del browser
- **Type-safe**: Puoi definire tipi TypeScript per lo state
- **Accessibile**: Recuperabile con `useLocation().state`

**Quando Usare `state`:**

```tsx
// ✅ CASO D'USO 1: Passare dati sensibili o complessi
// Non vuoi esporre dati nella URL

function ProductList(): JSX.Element {
  const navigate = useNavigate()

  const handleProductClick = (product: Product): void => {
    // Passa l'intero oggetto prodotto senza esporlo nella URL
    navigate('/product-detail', {
      state: {
        product,           // Oggetto completo
        from: 'list',      // Da dove viene
        timestamp: Date.now(),
        userPreferences: {
          currency: 'EUR',
          language: 'it'
        }
      }
    })
  }

  return (
    <div>
      {products.map(product => (
        <button 
          key={product.id}
          onClick={() => handleProductClick(product)}
        >
          {product.name}
        </button>
      ))}
    </div>
  )
}
```

```tsx
// ✅ CASO D'USO 2: Mantenere contesto di navigazione
// Vuoi sapere da dove è arrivato l'utente

function ProductDetail(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()

  // Recupera lo state passato durante la navigazione
  const state = location.state as {
    product?: Product
    from?: string
    timestamp?: number
  } | null

  const handleBack = (): void => {
    if (state?.from === 'list') {
      // Torna alla lista mantenendo lo stato
      navigate(-1)
    } else {
      // Torna alla home se non c'è contesto
      navigate('/')
    }
  }

  return (
    <div>
      {state?.product ? (
        // Usa i dati passati nello state (più veloce)
        <ProductInfo product={state.product} />
      ) : (
        // Fallback: carica da API se state non disponibile
        <ProductLoader />
      )}
      <button onClick={handleBack}>
        Torna {state?.from === 'list' ? 'alla lista' : 'alla home'}
      </button>
    </div>
  )
}
```

```tsx
// ✅ CASO D'USO 3: Passare dati per pre-fill form
// Pre-compila un form con dati dalla pagina precedente

function CheckoutPage(): JSX.Element {
  const location = useLocation()
  const state = location.state as {
    cartItems?: CartItem[]
    shippingAddress?: Address
  } | null

  return (
    <form>
      {/* Pre-compila con dati dallo state */}
      <input 
        defaultValue={state?.shippingAddress?.city || ''}
        placeholder="Città"
      />
    </form>
  )
}
```

**Type Safety per State:**

```tsx
// Definisci il tipo dello state
interface ProductLocationState {
  product: Product
  from: 'list' | 'search' | 'homepage'
  timestamp: number
}

// Passa state con tipo
navigate('/product-detail', {
  state: {
    product,
    from: 'list',
    timestamp: Date.now()
  } as ProductLocationState
})

// Recupera con type safety
const location = useLocation()
const state = location.state as ProductLocationState | null
```

**Limitazioni dello State:**

```tsx
// ⚠️ ATTENZIONE: Lo state NON persiste se:
// 1. L'utente ricarica la pagina
// 2. L'utente naviga direttamente all'URL (senza passare da Link/navigate)
// 3. L'utente chiude e riapre il browser

// ✅ SOLUZIONE: Usa sempre un fallback
function ProductDetail(): JSX.Element {
  const location = useLocation()
  const state = location.state as { product?: Product } | null

  // Fallback se state non disponibile
  const product = state?.product || null

  // Se non c'è product nello state, carica da API
  useEffect(() => {
    if (!product) {
      fetchProduct()
    }
  }, [product])
}
```

**Confronto: State vs Query Params:**

```tsx
// Query Params: /products?category=electronics&sort=price
// ✅ Pubblico, bookmarkabile, condivisibile
// ❌ Solo valori semplici, visibile nella URL

// State: { product: {...}, from: 'list' }
// ✅ Valori complessi, privato, non visibile
// ❌ Non bookmarkabile, non condivisibile, temporaneo
```

#### Navigazione con NavLink

`NavLink` è simile a `Link` ma aggiunge classi CSS quando la rotta è attiva:

```tsx
// src/components/Navigation.tsx
import { NavLink } from 'react-router'

export function Navigation(): JSX.Element {
  return (
    <nav>
      <NavLink 
        to="/"
        className={({ isActive }) => 
          isActive ? 'active-link' : 'link'
        }
      >
        Home
      </NavLink>
      <NavLink 
        to="/about"
        className={({ isActive, isPending }) => 
          isPending ? 'pending' : isActive ? 'active' : ''
        }
      >
        About
      </NavLink>
    </nav>
  )
}
```

#### Navigazione Programmatica con useNavigate

L'hook `useNavigate` permette navigazione programmatica:

```tsx
// src/pages/Home.tsx
import { useNavigate } from 'react-router'
import { FormEvent } from 'react'

export function Home(): JSX.Element {
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('search') as string
    
    // Naviga con query string
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleButtonClick = (): void => {
    // Naviga programmaticamente
    navigate('/about', {
      replace: false,        // Push nella history (default)
      state: { from: 'home' }, // Passa stato
      preventScrollReset: false
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="search" type="text" />
        <button type="submit">Cerca</button>
      </form>
      <button onClick={handleButtonClick}>Vai a About</button>
    </div>
  )
}
```

**Metodi di Navigazione:**

```tsx
const navigate = useNavigate()

// Naviga avanti nella history
navigate(1)

// Naviga indietro nella history
navigate(-1)

// Naviga a una rotta specifica
navigate('/about')

// Naviga con opzioni
navigate('/about', { 
  replace: true,      // Sostituisce invece di push
  state: { data: 123 } // Passa stato
})
```

### 4. Rotte con Parametri

#### Parametri Dinamici nella URL

I parametri dinamici permettono di catturare valori dalla URL:

```tsx
// src/router.tsx
import { createBrowserRouter } from 'react-router'
import { UserProfile } from './pages/UserProfile'
import { ProductDetail } from './pages/ProductDetail'

const routes = [
  {
    path: '/user/:userId',
    element: <UserProfile />
  },
  {
    path: '/product/:productId',
    element: <ProductDetail />
  }
]

export const router = createBrowserRouter(routes)
```

#### Hook useParams con Type Safety

L'hook `useParams` permette di accedere ai parametri della rotta:

```tsx
// src/pages/UserProfile.tsx
import { useParams } from 'react-router'

// Definisci i tipi dei parametri
interface UserProfileParams {
  userId: string
}

export function UserProfile(): JSX.Element {
  // useParams ritorna i parametri con type safety
  const { userId } = useParams<UserProfileParams>()
  
  if (!userId) {
    return <div>User ID non trovato</div>
  }

  return (
    <div>
      <h1>Profilo Utente</h1>
      <p>ID Utente: {userId}</p>
    </div>
  )
}
```

**Esempio Completo con Fetching Dati:**

```tsx
// src/pages/UserProfile.tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface UserProfileParams {
  userId: string
}

export function UserProfile(): JSX.Element {
  const { userId } = useParams<UserProfileParams>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!userId) return

    const fetchUser = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Errore nel caricamento utente:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <div>Caricamento...</div>
  if (!user) return <div>Utente non trovato</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

#### Parametri Opzionali

I parametri opzionali possono essere definiti con il suffisso `?`:

```tsx
// src/router.tsx
const routes = [
  {
    // userId è opzionale
    path: '/user/:userId?',
    element: <UserProfile />
  }
]

// Navigazione
// /user        -> userId è undefined
// /user/123    -> userId è "123"
```

```tsx
// src/pages/UserProfile.tsx
import { useParams } from 'react-router'

interface UserProfileParams {
  userId?: string
}

export function UserProfile(): JSX.Element {
  const { userId } = useParams<UserProfileParams>()

  if (!userId) {
    return <div>Seleziona un utente</div>
  }

  return <div>Profilo utente: {userId}</div>
}
```

#### Parametri Multipli

Puoi definire più parametri nella stessa rotta:

```tsx
// src/router.tsx
const routes = [
  {
    path: '/blog/:category/:postId',
    element: <BlogPost />
  }
]

// URL esempio: /blog/react/123
// category = "react"
// postId = "123"
```

```tsx
// src/pages/BlogPost.tsx
import { useParams } from 'react-router'

interface BlogPostParams {
  category: string
  postId: string
}

export function BlogPost(): JSX.Element {
  const { category, postId } = useParams<BlogPostParams>()

  return (
    <div>
      <h1>Post {postId} nella categoria {category}</h1>
    </div>
  )
}
```

#### Validazione Parametri

Puoi validare i parametri prima di renderizzare il componente:

```tsx
// src/pages/UserProfile.tsx
import { useParams, useNavigate } from 'react-router'
import { useEffect } from 'react'

interface UserProfileParams {
  userId: string
}

export function UserProfile(): JSX.Element {
  const { userId } = useParams<UserProfileParams>()
  const navigate = useNavigate()

  useEffect(() => {
    // Valida che userId sia un numero
    if (userId && isNaN(Number(userId))) {
      navigate('/users', { replace: true })
    }
  }, [userId, navigate])

  if (!userId) return <div>ID non valido</div>

  return <div>Utente: {userId}</div>
}
```

**Esempio con Regex nel Path:**

```tsx
// src/router.tsx
const routes = [
  {
    // Solo numeri sono accettati
    path: '/user/:userId(\\d+)',
    element: <UserProfile />
  }
]

// /user/123  ✅ Valido
// /user/abc  ❌ Non corrisponde, va a 404
```

### 5. Rotte Annidate

#### Struttura Gerarchica delle Rotte

Le rotte annidate permettono di strutturare l'applicazione in modo gerarchico con layout condivisi:

```tsx
// src/router.tsx
import { createBrowserRouter, Outlet } from 'react-router'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardHome } from './pages/DashboardHome'
import { DashboardSettings } from './pages/DashboardSettings'
import { DashboardProfile } from './pages/DashboardProfile'

const routes = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true, // Rotta index per /dashboard
        element: <DashboardHome />
      },
      {
        path: 'settings', // Relativo: /dashboard/settings
        element: <DashboardSettings />
      },
      {
        path: 'profile', // Relativo: /dashboard/profile
        element: <DashboardProfile />
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
```

#### Componente Outlet

##### Cos'è Outlet?

`Outlet` è un componente speciale di React Router che funge da **placeholder** per renderizzare i componenti figli delle rotte annidate. È il punto esatto dove React Router inserisce il contenuto della rotta figlia all'interno del layout parent.

**In parole semplici:**
- `Outlet` è come un "buco" nel layout parent
- React Router riempie questo "buco" con il componente della rotta figlia corrispondente
- Senza `Outlet`, i componenti figli non vengono renderizzati

##### Quando Si Applica Outlet?

`Outlet` si usa **solo** quando hai rotte annidate con un layout condiviso:

```tsx
// ✅ CASO D'USO: Layout condiviso con rotte annidate
const routes = [
  {
    path: '/dashboard',
    element: <DashboardLayout />, // Layout parent con Outlet
    children: [
      { index: true, element: <DashboardHome /> },      // Renderizzato in Outlet
      { path: 'settings', element: <DashboardSettings /> }, // Renderizzato in Outlet
      { path: 'profile', element: <DashboardProfile /> }    // Renderizzato in Outlet
    ]
  }
]
```

**Quando NON serve Outlet:**
- Rotte piatte senza gerarchia: `/home`, `/about`, `/contact` (nessun layout condiviso)
- Rotte senza figli: se una rotta non ha `children`, non serve `Outlet`

##### Vantaggi Reali di Outlet

**1. Layout Condiviso Senza Duplicazione**

Senza Outlet, dovresti duplicare il layout in ogni componente:

```tsx
// ❌ SENZA Outlet - Duplicazione codice
function DashboardHome(): JSX.Element {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>...</nav>
      </aside>
      <main className="content">
        <h1>Home</h1>
        {/* Contenuto specifico */}
      </main>
    </div>
  )
}

function DashboardSettings(): JSX.Element {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>...</nav> {/* DUPLICATO! */}
      </aside>
      <main className="content">
        <h1>Impostazioni</h1>
        {/* Contenuto specifico */}
      </main>
    </div>
  )
}
```

Con Outlet, il layout è definito una sola volta:

```tsx
// ✅ CON Outlet - Layout definito una volta
function DashboardLayout(): JSX.Element {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>...</nav> {/* Definito UNA volta */}
      </aside>
      <main className="content">
        <Outlet /> {/* Qui viene renderizzato il contenuto figlio */}
      </main>
    </div>
  )
}
```

**2. Manutenibilità Migliorata**

- **Un solo punto di modifica**: Se devi cambiare il layout (es. aggiungere un header), modifichi solo `DashboardLayout`
- **Coerenza garantita**: Tutte le rotte figlie hanno automaticamente lo stesso layout
- **Codice più pulito**: I componenti figli si concentrano solo sul loro contenuto specifico

**3. Struttura Gerarchica Chiara**

`Outlet` rende esplicita la relazione parent-figlio tra rotte:

```tsx
// Struttura gerarchica chiara
/dashboard                    → DashboardLayout (con Outlet)
  ├─ /dashboard              → DashboardHome (renderizzato in Outlet)
  ├─ /dashboard/settings     → DashboardSettings (renderizzato in Outlet)
  └─ /dashboard/profile      → DashboardProfile (renderizzato in Outlet)
```

**4. Navigazione e Stato Condiviso**

Il layout parent può gestire navigazione e stato condiviso:

```tsx
function DashboardLayout(): JSX.Element {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="dashboard">
      <Sidebar 
        isOpen={sidebarOpen} 
        currentPath={location.pathname} // Stato condiviso
      />
      <main>
        <Outlet /> {/* Tutti i figli hanno accesso allo stesso stato */}
      </main>
    </div>
  )
}
```

**5. Performance e Code Splitting**

Puoi applicare lazy loading e code splitting a livello di layout:

```tsx
// Layout caricato una volta, figli caricati on-demand
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
const DashboardHome = lazy(() => import('./pages/DashboardHome'))
const DashboardSettings = lazy(() => import('./pages/DashboardSettings'))
```

##### Come Funziona Outlet?

Il flusso è semplice:

1. **Utente naviga** a `/dashboard/settings`
2. **React Router trova** la rotta parent `/dashboard` con `DashboardLayout`
3. **Renderizza** `DashboardLayout` che contiene `<Outlet />`
4. **React Router sostituisce** `<Outlet />` con `DashboardSettings`
5. **Risultato**: Layout + contenuto figlio insieme

**Esempio Pratico:**

```tsx
// src/layouts/DashboardLayout.tsx
import { Outlet, Link } from 'react-router'

export function DashboardLayout(): JSX.Element {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/dashboard/settings">Impostazioni</Link>
          <Link to="/dashboard/profile">Profilo</Link>
        </nav>
      </aside>
      <main className="content">
        {/* Outlet renderizza i componenti figli */}
        <Outlet />
      </main>
    </div>
  )
}
```

**Struttura HTML Risultante quando si naviga a `/dashboard/settings`:**

```html
<div class="dashboard">
  <aside class="sidebar">
    <nav>...</nav>
  </aside>
  <main class="content">
    <!-- Qui viene renderizzato DashboardSettings al posto di <Outlet /> -->
    <DashboardSettings />
  </main>
</div>
```

**Struttura HTML Risultante:**

```html
<div class="dashboard">
  <aside>...</aside>
  <main>
    <!-- Qui viene renderizzato DashboardHome, DashboardSettings, ecc. -->
  </main>
</div>
```

#### Index Routes

Le index routes sono rotte che corrispondono al path del parent:

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardHome } from './pages/DashboardHome'
import { DashboardSettings } from './pages/DashboardSettings'

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true, // Corrisponde a /dashboard
        element: <DashboardHome />
      },
      {
        path: 'settings', // Corrisponde a /dashboard/settings
        element: <DashboardSettings />
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
```

**Equivalente senza index:**

```tsx
// ❌ Approccio meno chiaro
{
  path: '/dashboard',
  element: <DashboardLayout />,
  children: [
    {
      path: '', // Meno esplicito
      element: <DashboardHome />
    }
  ]
}

// ✅ Approccio con index (più chiaro)
{
  path: '/dashboard',
  element: <DashboardLayout />,
  children: [
    {
      index: true, // Esplicito: questa è la rotta index
      element: <DashboardHome />
    }
  ]
}
```

#### Relative Paths

I path nelle rotte annidate sono relativi al parent:

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardSettings } from './pages/DashboardSettings'
import { DashboardProfile } from './pages/DashboardProfile'
import { UserDetail } from './pages/UserDetail'

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: 'settings', // Relativo: /dashboard/settings
        element: <DashboardSettings />
      },
      {
        path: 'profile', // Relativo: /dashboard/profile
        element: <DashboardProfile />
      },
      {
        path: 'users/:userId', // Relativo: /dashboard/users/:userId
        element: <UserDetail />
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
```

**Navigazione con Link:**

```tsx
// src/components/DashboardNav.tsx
import { Link } from 'react-router'

export function DashboardNav(): JSX.Element {
  return (
    <nav>
      {/* Path relativi */}
      <Link to="settings">Impostazioni</Link>
      <Link to="profile">Profilo</Link>
      
      {/* Path assoluti */}
      <Link to="/dashboard/settings">Impostazioni (assoluto)</Link>
    </nav>
  )
}
```

#### Esempio Completo: Dashboard con Sidebar

```tsx
// src/layouts/DashboardLayout.tsx
import { Outlet, Link, useLocation } from 'react-router'

interface NavItem {
  path: string
  label: string
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Home' },
  { path: '/dashboard/analytics', label: 'Analytics' },
  { path: '/dashboard/settings', label: 'Impostazioni' }
]

export function DashboardLayout(): JSX.Element {
  const location = useLocation()

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
```

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardHome } from './pages/DashboardHome'
import { DashboardAnalytics } from './pages/DashboardAnalytics'
import { DashboardSettings } from './pages/DashboardSettings'

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />
      },
      {
        path: 'analytics',
        element: <DashboardAnalytics />
      },
      {
        path: 'settings',
        element: <DashboardSettings />
      }
    ]
  }
]

export const router = createBrowserRouter(routes)
```

### 6. Passaggio Dati tra Rotte (Metodi Moderni)

#### useSearchParams per Query Strings

L'hook `useSearchParams` permette di gestire i parametri della query string:

```tsx
// src/pages/Search.tsx
import { useSearchParams } from 'react-router'
import { useEffect, useState, FormEvent } from 'react'

interface SearchResult {
  id: string
  title: string
}

export function Search(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const query = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    if (!query) return

    const fetchResults = async (): Promise<void> => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${query}&page=${page}`)
        const data = await response.json()
        setResults(data.results)
      } catch (error) {
        console.error('Errore ricerca:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, page])

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('search') as string
    
    // Aggiorna query string senza ricaricare la pagina
    setSearchParams({ q: searchQuery, page: '1' })
  }

  const handlePageChange = (newPage: number): void => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString())
      return prev
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          name="search" 
          type="text" 
          defaultValue={query}
          placeholder="Cerca..."
        />
        <button type="submit">Cerca</button>
      </form>

      {loading && <div>Caricamento...</div>}
      
      <div>
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>

      <div>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Precedente
        </button>
        <span>Pagina {page}</span>
        <button onClick={() => handlePageChange(page + 1)}>
          Successiva
        </button>
      </div>
    </div>
  )
}
```

**Navigazione con Query String:**

```tsx
// src/components/ProductCard.tsx
import { Link } from 'react-router'

interface Product {
  id: string
  name: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
  return (
    <div>
      <h3>{product.name}</h3>
      {/* Link con query string */}
      <Link to={`/product/${product.id}?ref=homepage&source=card`}>
        Vedi Dettagli
      </Link>
    </div>
  )
}
```

#### useLocation con State Navigation

Il metodo `state` nella navigazione permette di passare dati senza esporli nella URL:

```tsx
// src/pages/ProductList.tsx
import { Link, useNavigate } from 'react-router'

interface Product {
  id: string
  name: string
  price: number
}

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps): JSX.Element {
  const navigate = useNavigate()

  const handleProductClick = (product: Product): void => {
    // Passa dati tramite state
    navigate(`/product/${product.id}`, {
      state: {
        product,
        from: 'list',
        timestamp: Date.now()
      }
    })
  }

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button onClick={() => handleProductClick(product)}>
            Vedi Dettagli
          </button>
        </div>
      ))}
    </div>
  )
}
```

```tsx
// src/pages/ProductDetail.tsx
import { useParams, useLocation, useNavigate } from 'react-router'

interface Product {
  id: string
  name: string
  price: number
}

interface LocationState {
  product?: Product
  from?: string
  timestamp?: number
}

interface ProductDetailParams {
  productId: string
}

export function ProductDetail(): JSX.Element {
  const { productId } = useParams<ProductDetailParams>()
  const location = useLocation()
  const navigate = useNavigate()
  
  const state = location.state as LocationState | null
  const product = state?.product

  // Se non c'è prodotto nello state, fallback a fetch
  if (!product) {
    // Fetch prodotto da API usando productId
  }

  const handleBack = (): void => {
    // Torna indietro mantenendo lo state se disponibile
    if (state?.from === 'list') {
      navigate(-1) // Torna alla pagina precedente
    } else {
      navigate('/products')
    }
  }

  return (
    <div>
      {product && (
        <>
          <h1>{product.name}</h1>
          <p>Prezzo: €{product.price}</p>
          <button onClick={handleBack}>Torna Indietro</button>
        </>
      )}
    </div>
  )
}
```

**Type Safety per Location State:**

```tsx
// src/types/router.types.ts
export interface ProductLocationState {
  product: Product
  from: 'list' | 'search' | 'homepage'
  timestamp: number
}

// src/pages/ProductDetail.tsx
import { useLocation } from 'react-router'
import { ProductLocationState } from '../types/router.types'

export function ProductDetail(): JSX.Element {
  const location = useLocation()
  
  // Type guard per verificare lo state
  const isProductState = (state: unknown): state is ProductLocationState => {
    return (
      typeof state === 'object' &&
      state !== null &&
      'product' in state &&
      'from' in state
    )
  }

  const state = location.state
  if (isProductState(state)) {
    // TypeScript sa che state è ProductLocationState
    console.log(state.product.name)
    console.log(state.from)
  }

  return <div>...</div>
}
```

#### Context API per Stato Globale Routing

Per dati condivisi tra più rotte, puoi usare Context API:

```tsx
// src/contexts/RouterContext.tsx
import { createContext, useContext, ReactNode, useState } from 'react'

interface RouterContextType {
  previousRoute: string | null
  setPreviousRoute: (route: string) => void
  navigationHistory: string[]
  addToHistory: (route: string) => void
}

const RouterContext = createContext<RouterContextType | undefined>(undefined)

interface RouterProviderProps {
  children: ReactNode
}

export function RouterProvider({ children }: RouterProviderProps): JSX.Element {
  const [previousRoute, setPreviousRoute] = useState<string | null>(null)
  const [navigationHistory, setNavigationHistory] = useState<string[]>([])

  const addToHistory = (route: string): void => {
    setNavigationHistory(prev => [...prev, route])
  }

  return (
    <RouterContext.Provider
      value={{
        previousRoute,
        setPreviousRoute,
        navigationHistory,
        addToHistory
      }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export function useRouterContext(): RouterContextType {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('useRouterContext must be used within RouterProvider')
  }
  return context
}
```

```tsx
// src/main.tsx
import { RouterProvider } from 'react-router'
import { RouterProvider as CustomRouterProvider } from './contexts/RouterContext'
import { router } from './router'

export function App(): JSX.Element {
  return (
    <CustomRouterProvider>
      <RouterProvider router={router} />
    </CustomRouterProvider>
  )
}
```

### 7. Loader e Action (Novità v7)

#### Data Loading con Loader Functions

Le loader functions permettono di caricare dati prima che il componente venga renderizzato:

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { UserList } from './pages/UserList'
import { UserDetail } from './pages/UserDetail'

interface User {
  id: string
  name: string
  email: string
}

// Loader function per lista utenti
async function usersLoader(): Promise<User[]> {
  const response = await fetch('/api/users')
  if (!response.ok) {
    throw new Response('Errore nel caricamento utenti', { status: 500 })
  }
  return response.json()
}

// Loader function con parametri
async function userLoader({ params }: { params: { userId: string } }): Promise<User> {
  const response = await fetch(`/api/users/${params.userId}`)
  if (!response.ok) {
    throw new Response('Utente non trovato', { status: 404 })
  }
  return response.json()
}

const routes: RouteObject[] = [
  {
    path: '/users',
    element: <UserList />,
    loader: usersLoader
  },
  {
    path: '/users/:userId',
    element: <UserDetail />,
    loader: userLoader
  }
]

export const router = createBrowserRouter(routes)
```

**Utilizzo nei Componenti:**

```tsx
// src/pages/UserList.tsx
import { useLoaderData } from 'react-router'

interface User {
  id: string
  name: string
  email: string
}

export function UserList(): JSX.Element {
  // useLoaderData ritorna i dati caricati dal loader
  const users = useLoaderData() as User[]

  return (
    <div>
      <h1>Lista Utenti</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Type Safety con Generics:**

```tsx
// src/pages/UserList.tsx
import { useLoaderData } from 'react-router'

interface User {
  id: string
  name: string
  email: string
}

export function UserList(): JSX.Element {
  // Type safety con generics (quando supportato)
  const users = useLoaderData<User[]>()

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

#### Form Actions per Mutazioni

Le action functions gestiscono le mutazioni (POST, PUT, DELETE):

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject, redirect } from 'react-router'
import { UserForm } from './pages/UserForm'

// Action per creare utente
async function createUserAction({ request }: { request: Request }): Promise<Response> {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Validazione
  if (!name || !email) {
    return new Response('Nome e email sono obbligatori', { status: 400 })
  }

  // Crea utente
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  })

  if (!response.ok) {
    return new Response('Errore nella creazione', { status: 500 })
  }

  // Redirect dopo successo
  return redirect('/users')
}

const routes: RouteObject[] = [
  {
    path: '/users/new',
    element: <UserForm />,
    action: createUserAction
  }
]

export const router = createBrowserRouter(routes)
```

```tsx
// src/pages/UserForm.tsx
import { Form, useActionData, useNavigation } from 'react-router'

interface ActionData {
  error?: string
  success?: boolean
}

export function UserForm(): JSX.Element {
  const actionData = useActionData() as ActionData | undefined
  const navigation = useNavigation()

  const isSubmitting = navigation.state === 'submitting'

  return (
    <div>
      <h1>Crea Nuovo Utente</h1>
      
      {actionData?.error && (
        <div className="error">{actionData.error}</div>
      )}

      <Form method="post">
        <div>
          <label htmlFor="name">Nome:</label>
          <input type="text" id="name" name="name" required />
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : 'Crea Utente'}
        </button>
      </Form>
    </div>
  )
}
```

**Esempio CRUD Completo:**

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject, redirect } from 'react-router'
import { UserDetail } from './pages/UserDetail'

interface User {
  id: string
  name: string
  email: string
}

// Loader
async function userLoader({ params }: { params: { userId: string } }): Promise<User> {
  const response = await fetch(`/api/users/${params.userId}`)
  if (!response.ok) throw new Response('Not Found', { status: 404 })
  return response.json()
}

// Action per update
async function updateUserAction({ 
  request, 
  params 
}: { 
  request: Request
  params: { userId: string }
}): Promise<Response> {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  const response = await fetch(`/api/users/${params.userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  })

  if (!response.ok) {
    return new Response('Errore nell\'aggiornamento', { status: 500 })
  }

  return redirect(`/users/${params.userId}`)
}

// Action per delete
async function deleteUserAction({ 
  params 
}: { 
  params: { userId: string }
}): Promise<Response> {
  const response = await fetch(`/api/users/${params.userId}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    return new Response('Errore nella cancellazione', { status: 500 })
  }

  return redirect('/users')
}

const routes: RouteObject[] = [
  {
    path: '/users/:userId',
    element: <UserDetail />,
    loader: userLoader,
    action: updateUserAction
  },
  {
    path: '/users/:userId/delete',
    action: deleteUserAction
  }
]

export const router = createBrowserRouter(routes)
```

#### Error Handling nei Loader

```tsx
// src/router.tsx
async function userLoader({ params }: { params: { userId: string } }): Promise<User> {
  try {
    const response = await fetch(`/api/users/${params.userId}`)
    
    if (response.status === 404) {
      throw new Response('Utente non trovato', { 
        status: 404,
        statusText: 'Not Found'
      })
    }

    if (!response.ok) {
      throw new Response('Errore nel server', { 
        status: response.status 
      })
    }

    return response.json()
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    throw new Response('Errore di rete', { status: 500 })
  }
}
```

### 8. Error Boundaries

#### errorElement per Gestione Errori

L'`errorElement` permette di definire un componente da renderizzare in caso di errore:

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { ErrorPage } from './pages/ErrorPage'
import { UserDetail } from './pages/UserDetail'
import { userLoader } from './loaders/userLoader'

const routes: RouteObject[] = [
  {
    path: '/users/:userId',
    element: <UserDetail />,
    loader: userLoader,
    errorElement: <ErrorPage /> // Renderizzato in caso di errore
  }
]

export const router = createBrowserRouter(routes)
```

```tsx
// src/pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse, Link } from 'react-router'

export function ErrorPage(): JSX.Element {
  const error = useRouteError()

  // Verifica se è un errore di routing
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        {error.status === 404 && (
          <p>La pagina che stai cercando non esiste.</p>
        )}
        <Link to="/">Torna alla Home</Link>
      </div>
    )
  }

  // Errore generico
  return (
    <div>
      <h1>Ops! Qualcosa è andato storto</h1>
      <p>{error instanceof Error ? error.message : 'Errore sconosciuto'}</p>
      <Link to="/">Torna alla Home</Link>
    </div>
  )
}
```

#### useRouteError Hook

L'hook `useRouteError` permette di accedere all'errore nella error boundary:

```tsx
// src/pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router'

export function ErrorPage(): JSX.Element {
  const error = useRouteError()

  // Type guard per verificare tipo errore
  if (isRouteErrorResponse(error)) {
    // Errore di routing (404, 500, ecc.)
    return (
      <div>
        <h1>Errore {error.status}</h1>
        <p>{error.statusText}</p>
        {error.data && <p>{error.data}</p>}
      </div>
    )
  }

  if (error instanceof Error) {
    // Errore JavaScript standard
    return (
      <div>
        <h1>Errore</h1>
        <p>{error.message}</p>
        {process.env.NODE_ENV === 'development' && (
          <pre>{error.stack}</pre>
        )}
      </div>
    )
  }

  // Errore sconosciuto
  return (
    <div>
      <h1>Errore Sconosciuto</h1>
    </div>
  )
}
```

#### Error Boundaries Personalizzate

Puoi creare error boundaries personalizzate per diversi tipi di errori:

```tsx
// src/pages/NotFoundPage.tsx
import { Link } from 'react-router'

export function NotFoundPage(): JSX.Element {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Pagina Non Trovata</h2>
      <p>La pagina che stai cercando non esiste.</p>
      <Link to="/">Torna alla Home</Link>
    </div>
  )
}
```

```tsx
// src/pages/ServerErrorPage.tsx
import { Link } from 'react-router'

export function ServerErrorPage(): JSX.Element {
  return (
    <div className="server-error">
      <h1>500</h1>
      <h2>Errore del Server</h2>
      <p>Si è verificato un errore nel server. Riprova più tardi.</p>
      <Link to="/">Torna alla Home</Link>
    </div>
  )
}
```

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { ErrorPage } from './pages/ErrorPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { UserDetail } from './pages/UserDetail'
import { userLoader } from './loaders/userLoader'

const routes: RouteObject[] = [
  {
    path: '/users/:userId',
    element: <UserDetail />,
    loader: userLoader,
    errorElement: <ErrorPage /> // Error boundary globale
  },
  {
    path: '*',
    element: <NotFoundPage /> // 404 per tutte le altre rotte
  }
]

export const router = createBrowserRouter(routes)
```

#### Fallback UI

Puoi definire fallback UI per stati di loading e errore:

```tsx
// src/pages/UserDetail.tsx
import { useLoaderData, useRouteError } from 'react-router'
import { Suspense } from 'react'

function UserDetailContent(): JSX.Element {
  const user = useLoaderData() as User
  return <div>{user.name}</div>
}

export function UserDetail(): JSX.Element {
  return (
    <Suspense fallback={<div>Caricamento utente...</div>}>
      <UserDetailContent />
    </Suspense>
  )
}
```

### 9. Lazy Loading e Code Splitting

#### lazy() per Componenti

Il metodo `lazy()` permette di caricare componenti in modo asincrono:

```tsx
// src/router.tsx
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

// Caricamento lazy dei componenti
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/contact',
    element: <Contact />
  }
]

export const router = createBrowserRouter(routes)
```

#### Suspense Boundaries

Usa `Suspense` per gestire lo stato di loading durante il lazy loading:

```tsx
// src/main.tsx
import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './router'

function App(): JSX.Element {
  return (
    <Suspense fallback={<div>Caricamento applicazione...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
```

**Suspense per Rotte Specifiche:**

```tsx
// src/router.tsx
import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouteObject } from 'react-router'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<div>Caricamento dashboard...</div>}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<div>Caricamento impostazioni...</div>}>
        <Settings />
      </Suspense>
    )
  }
]

export const router = createBrowserRouter(routes)
```

#### Ottimizzazione Bundle

Il lazy loading riduce la dimensione del bundle iniziale:

```tsx
// src/router.tsx
import { lazy } from 'react'
import { createBrowserRouter, RouteObject } from 'react-router'

// Componenti principali (caricati subito)
import { Home } from './pages/Home'
import { About } from './pages/About'

// Componenti secondari (caricati on-demand)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const Reports = lazy(() => import('./pages/Reports'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/admin',
    element: <AdminPanel />
  },
  {
    path: '/reports',
    element: <Reports />
  }
]

export const router = createBrowserRouter(routes)
```

**Risultato:**
- Bundle iniziale: contiene solo Home e About
- Dashboard, AdminPanel, Reports: caricati solo quando necessari

#### Loading States Personalizzati

Puoi creare componenti di loading personalizzati:

```tsx
// src/components/LoadingSpinner.tsx
export function LoadingSpinner(): JSX.Element {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Caricamento...</p>
    </div>
  )
}
```

```tsx
// src/router.tsx
import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouteObject } from 'react-router'
import { LoadingSpinner } from './components/LoadingSpinner'

const Dashboard = lazy(() => import('./pages/Dashboard'))

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    )
  }
]

export const router = createBrowserRouter(routes)
```

### 10. Protezione Rotte

#### Route Guards Pattern

Puoi creare componenti per proteggere le rotte:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  isAuthenticated: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  isAuthenticated,
  redirectTo = '/login'
}: ProtectedRouteProps): JSX.Element {
  const location = useLocation()

  if (!isAuthenticated) {
    // Salva la rotta corrente per redirect dopo login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}
```

**Utilizzo:**

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Dashboard } from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'

function DashboardRoute(): JSX.Element {
  const { isAuthenticated } = useAuth()
  
  return (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Dashboard />
    </ProtectedRoute>
  )
}

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardRoute />
  }
]

export const router = createBrowserRouter(routes)
```

#### Redirect Condizionali

Puoi implementare redirect basati su condizioni:

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject, redirect } from 'react-router'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'

// Loader che verifica autenticazione
async function dashboardLoader(): Promise<Response | null> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return redirect('/login')
  }
  
  return null
}

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: dashboardLoader // Redirect se non autenticato
  },
  {
    path: '/login',
    element: <Login />
  }
]

export const router = createBrowserRouter(routes)
```

#### Autenticazione e Autorizzazione

Esempio completo di sistema di autenticazione:

```tsx
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  role: 'user' | 'admin'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
} {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Verifica sessione esistente
    const checkSession = async (): Promise<void> => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Errore verifica sessione:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Credenziali non valide')
    }

    const userData = await response.json()
    setUser(userData)
  }

  const logout = (): void => {
    fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }
}
```

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  isAuthenticated: boolean
  requiredRole?: 'user' | 'admin'
  userRole?: 'user' | 'admin'
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  isAuthenticated,
  requiredRole,
  userRole,
  redirectTo = '/login'
}: ProtectedRouteProps): JSX.Element {
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
```

```tsx
// src/router.tsx
import { createBrowserRouter, RouteObject } from 'react-router'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { Dashboard } from './pages/Dashboard'
import { AdminPanel } from './pages/AdminPanel'

function DashboardRoute(): JSX.Element {
  const { isAuthenticated, user } = useAuth()
  
  return (
    <ProtectedRoute 
      isAuthenticated={isAuthenticated}
      userRole={user?.role}
    >
      <Dashboard />
    </ProtectedRoute>
  )
}

function AdminRoute(): JSX.Element {
  const { isAuthenticated, user } = useAuth()
  
  return (
    <ProtectedRoute 
      isAuthenticated={isAuthenticated}
      requiredRole="admin"
      userRole={user?.role}
    >
      <AdminPanel />
    </ProtectedRoute>
  )
}

const routes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardRoute />
  },
  {
    path: '/admin',
    element: <AdminRoute />
  }
]

export const router = createBrowserRouter(routes)
```

### 11. Best Practices

#### 1. Organizzazione File e Cartelle

**Struttura Consigliata:**

```
src/
├── router.tsx                 # Configurazione rotte principale
├── pages/                     # Componenti pagina
│   ├── Home.tsx
│   ├── About.tsx
│   └── Dashboard/
│       ├── Dashboard.tsx
│       ├── DashboardHome.tsx
│       └── DashboardSettings.tsx
├── layouts/                   # Layout condivisi
│   ├── MainLayout.tsx
│   └── DashboardLayout.tsx
├── components/                # Componenti riutilizzabili
│   ├── Navigation.tsx
│   └── ProtectedRoute.tsx
├── hooks/                     # Custom hooks
│   └── useAuth.ts
├── types/                     # Definizioni TypeScript
│   └── router.types.ts
└── utils/                     # Utility functions
    └── auth.ts
```

#### 2. Type Safety Completo

**Definisci tipi per tutte le rotte:**

```tsx
// src/types/router.types.ts
export interface RouteParams {
  userId: string
  productId: string
  category: string
}

export interface RouteSearchParams {
  q?: string
  page?: string
  sort?: 'asc' | 'desc'
}

export interface RouteState {
  from?: string
  product?: Product
  timestamp?: number
}
```

**Usa i tipi nei componenti:**

```tsx
// src/pages/UserDetail.tsx
import { useParams, useSearchParams, useLocation } from 'react-router'
import { RouteParams, RouteSearchParams, RouteState } from '../types/router.types'

export function UserDetail(): JSX.Element {
  const params = useParams<RouteParams>()
  const [searchParams] = useSearchParams<RouteSearchParams>()
  const location = useLocation<RouteState>()

  // TypeScript conosce tutti i tipi
  const userId = params.userId // string
  const query = searchParams.get('q') // string | null
  const from = location.state?.from // string | undefined
}
```

#### 3. Performance Optimization

**Lazy loading per rotte non critiche:**

```tsx
// src/router.tsx
import { lazy } from 'react'

// Carica subito solo le rotte principali
import { Home } from './pages/Home'

// Lazy loading per rotte secondarie
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const Reports = lazy(() => import('./pages/Reports'))
```

**Memoizzazione componenti pesanti:**

```tsx
// src/pages/Dashboard.tsx
import { memo } from 'react'

export const Dashboard = memo(function Dashboard(): JSX.Element {
  // Componente memoizzato per evitare re-render inutili
  return <div>Dashboard</div>
})
```

#### 4. Testing delle Rotte

**Test con React Testing Library:**

```tsx
// src/__tests__/router.test.tsx
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../router'

test('naviga alla home', () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ['/']
  })

  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('Home')).toBeInTheDocument()
})
```

#### 5. Error Handling Centralizzato

**Crea un componente ErrorBoundary riutilizzabile:**

```tsx
// src/components/ErrorBoundary.tsx
import { useRouteError, isRouteErrorResponse } from 'react-router'
import { Link } from 'react-router'

export function ErrorBoundary(): JSX.Element {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-boundary">
        <h1>Errore {error.status}</h1>
        <p>{error.statusText}</p>
        <Link to="/">Torna alla Home</Link>
      </div>
    )
  }

  return (
    <div className="error-boundary">
      <h1>Errore</h1>
      <p>{error instanceof Error ? error.message : 'Errore sconosciuto'}</p>
      <Link to="/">Torna alla Home</Link>
    </div>
  )
}
```

### 12. Errori Comuni da Evitare

#### Errore 1: Dimenticare Outlet nelle Rotte Annidate

```tsx
// ❌ Errore: Outlet mancante
function DashboardLayout(): JSX.Element {
  return (
    <div>
      <Sidebar />
      {/* Manca <Outlet /> - i figli non vengono renderizzati */}
    </div>
  )
}

// ✅ Corretto: Include Outlet
function DashboardLayout(): JSX.Element {
  return (
    <div>
      <Sidebar />
      <Outlet /> {/* Renderizza i componenti figli */}
    </div>
  )
}
```

#### Errore 2: Non Gestire Loading States

```tsx
// ❌ Errore: Nessun loading state
function UserDetail(): JSX.Element {
  const user = useLoaderData() as User
  return <div>{user.name}</div> // Errore se loader è ancora in esecuzione
}

// ✅ Corretto: Gestisci loading
function UserDetail(): JSX.Element {
  const navigation = useNavigation()
  const user = useLoaderData() as User

  if (navigation.state === 'loading') {
    return <div>Caricamento...</div>
  }

  return <div>{user.name}</div>
}
```

#### Errore 3: Non Validare Parametri

```tsx
// ❌ Errore: Nessuna validazione
function UserProfile(): JSX.Element {
  const { userId } = useParams()
  // userId potrebbe essere undefined
  return <div>User: {userId}</div>
}

// ✅ Corretto: Valida parametri
function UserProfile(): JSX.Element {
  const { userId } = useParams<{ userId: string }>()
  
  if (!userId) {
    return <div>ID utente non valido</div>
  }

  return <div>User: {userId}</div>
}
```

#### Errore 4: Non Gestire Errori nei Loader

```tsx
// ❌ Errore: Nessuna gestione errori
async function userLoader({ params }: { params: { userId: string } }): Promise<User> {
  const response = await fetch(`/api/users/${params.userId}`)
  return response.json() // Errore se response non è ok
}

// ✅ Corretto: Gestisci errori
async function userLoader({ params }: { params: { userId: string } }): Promise<User> {
  const response = await fetch(`/api/users/${params.userId}`)
  
  if (!response.ok) {
    throw new Response('Utente non trovato', { status: 404 })
  }

  return response.json()
}
```

#### Errore 5: State Navigation senza Type Safety

```tsx
// ❌ Errore: Nessun tipo per state
function ProductList(): JSX.Element {
  const navigate = useNavigate()
  
  navigate('/product/123', {
    state: { product: {...} } // Tipo sconosciuto
  })
}

// ✅ Corretto: Definisci tipi
interface ProductLocationState {
  product: Product
  from: string
}

function ProductList(): JSX.Element {
  const navigate = useNavigate()
  
  navigate('/product/123', {
    state: { 
      product: {...},
      from: 'list'
    } as ProductLocationState
  })
}
```

#### Errore 6: Non Usare Lazy Loading

```tsx
// ❌ Errore: Tutti i componenti nel bundle iniziale
import { Dashboard } from './pages/Dashboard'
import { AdminPanel } from './pages/AdminPanel'
import { Reports } from './pages/Reports'

// ✅ Corretto: Lazy loading per componenti pesanti
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const Reports = lazy(() => import('./pages/Reports'))
```

## Riepilogo

In questa lezione hai imparato:
- ✅ Cos'è React Router v7 e le sue novità principali
- ✅ Come installare e configurare React Router v7 con TypeScript
- ✅ Come creare rotte dichiarative con createBrowserRouter
- ✅ Come navigare tra rotte con Link, NavLink e useNavigate
- ✅ Come gestire parametri dinamici con useParams e type safety
- ✅ Come implementare rotte annidate con Outlet e layout condivisi
- ✅ Come passare dati tra rotte con useSearchParams e state navigation
- ✅ Come utilizzare loader e action functions per data loading e mutazioni
- ✅ Come gestire errori con error boundaries e useRouteError
- ✅ Come implementare lazy loading e code splitting
- ✅ Come proteggere rotte con pattern di autenticazione
- ✅ Best practices per organizzazione, type safety e performance
- ✅ Errori comuni da evitare

## Prossimi Passi

Dopo aver compreso React Router v7, hai completato il corso! Puoi approfondire:
- **React Query**: Gestione avanzata dello stato server
- **State Management**: Redux, Zustand, Jotai
- **Testing**: Jest, React Testing Library, Vitest
- **Performance**: Ottimizzazioni avanzate e profiling

## Risorse Aggiuntive

- [Documentazione Ufficiale React Router v7](https://reactrouter.com/)
- [React Router v7 Migration Guide](https://reactrouter.com/en/main/upgrading/v6)
- [TypeScript con React Router](https://reactrouter.com/en/main/route/loader#typescript)

**Ricorda**: React Router v7 semplifica il routing dichiarativo e migliora la type safety. Usa sempre TypeScript per massimizzare i benefici della type safety integrata!

