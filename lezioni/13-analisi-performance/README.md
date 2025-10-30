# Lezione 13: Analisi Performance e Rendering

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cosa causa i re-render in React
- Utilizzare strumenti di misurazione (React DevTools Profiler)
- Identificare colli di bottiglia nelle applicazioni React
- Applicare tecniche preliminari per ottimizzare il rendering
- Distinguere tra re-render necessari e non necessari
- Misurare le performance delle applicazioni React
- Implementare pattern di ottimizzazione basilari

## Teoria

### 1. Introduzione all'Analisi delle Performance

#### Perché Analizzare le Performance?
Le performance di un'applicazione React influenzano direttamente l'esperienza utente. Un'applicazione lenta può:
- Ridurre l'engagement degli utenti
- Aumentare il bounce rate
- Peggiorare l'accessibilità
- Consumare più risorse (batteria, memoria)

#### Cosa Misurare?
- **Tempo di rendering**: Quanto tempo impiega React a renderizzare i componenti
- **Frequenza di re-render**: Quante volte un componente viene ri-renderizzato
- **Costo computazionale**: Quanto tempo impiegano i calcoli durante il render
- **Memory leaks**: Utilizzo crescente della memoria nel tempo

### 2. Cause dei Re-render in React

React ri-renderizza un componente quando:
1. Il suo stato cambia
2. Le sue props cambiano
3. Il componente parent viene ri-renderizzato
4. Il valore di un Context cambia

#### 1. Cambio di State

```tsx
import { useState } from 'react'

interface CounterProps {
  initialValue?: number
}

function Counter({ initialValue = 0 }: CounterProps): JSX.Element {
  const [count, setCount] = useState<number>(initialValue)
  
  // Ogni volta che setCount viene chiamato, il componente viene ri-renderizzato
  const handleClick = (): void => {
    setCount(count + 1) // Trigger re-render
  }
  
  return (
    <div>
      <p>Conteggio: {count}</p>
      <button onClick={handleClick}>Incrementa</button>
    </div>
  )
}
```

#### 2. Cambio di Props

```tsx
interface UserCardProps {
  name: string
  email: string
  age: number
}

function UserCard({ name, email, age }: UserCardProps): JSX.Element {
  // Questo componente viene ri-renderizzato ogni volta che 
  // name, email o age cambiano nel componente parent
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
      <p>Età: {age}</p>
    </div>
  )
}

function Parent(): JSX.Element {
  const [user, setUser] = useState({
    name: 'Mario',
    email: 'mario@example.com',
    age: 30
  })
  
  // Ogni volta che setUser viene chiamato, UserCard viene ri-renderizzato
  return <UserCard name={user.name} email={user.email} age={user.age} />
}
```

#### 3. Re-render del Parent

```tsx
import { useState } from 'react'

function Header(): JSX.Element {
  return <header>Header</header>
}

function Sidebar(): JSX.Element {
  return <aside>Sidebar</aside>
}

function MainContent(): JSX.Element {
  return <main>Main Content</main>
}

function App(): JSX.Element {
  const [counter, setCounter] = useState<number>(0)
  
  // Quando counter cambia, App viene ri-renderizzato
  // Questo causa il re-render di TUTTI i componenti figli,
  // anche se non usano counter
  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>
        Counter: {counter}
      </button>
      <Header />      {/* Ri-renderizzato anche se non usa counter */}
      <Sidebar />     {/* Ri-renderizzato anche se non usa counter */}
      <MainContent /> {/* Ri-renderizzato anche se non usa counter */}
    </div>
  )
}
```

#### 4. Context Changes

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = (): void => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  // Ogni volta che theme cambia, tutti i componenti che usano
  // useContext(ThemeContext) vengono ri-renderizzati
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function ThemedButton(): JSX.Element {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('ThemedButton must be used within ThemeProvider')
  }
  
  // Questo componente viene ri-renderizzato ogni volta che
  // il valore del Context cambia
  return (
    <button style={{ background: context.theme === 'light' ? '#fff' : '#000' }}>
      Theme: {context.theme}
    </button>
  )
}
```

### 3. Strumenti di Misurazione

#### React DevTools Profiler

Il React DevTools Profiler è lo strumento principale per analizzare le performance delle applicazioni React. Permette di:
- Registrare sessioni di interazione
- Vedere quali componenti vengono ri-renderizzati
- Misurare il tempo di rendering per ogni componente
- Identificare componenti "costosi"

**Come Usare il Profiler:**

1. Installa React DevTools nel browser (Chrome/Edge/Firefox)
2. Apri gli strumenti sviluppatore (F12)
3. Vai alla tab "Profiler"
4. Clicca "Record" per iniziare la registrazione
5. Interagisci con l'applicazione
6. Clicca "Stop" per terminare la registrazione
7. Analizza i risultati: vedrai quali componenti sono stati ri-renderizzati e quanto tempo hanno impiegato

#### Performance API del Browser

La Performance API permette di misurare manualmente le performance:

```tsx
import { useEffect } from 'react'

function MeasuredComponent(): JSX.Element {
  useEffect(() => {
    // Avvia la misurazione
    performance.mark('component-render-start')
    
    return () => {
      // Termina la misurazione
      performance.mark('component-render-end')
      performance.measure(
        'component-render',
        'component-render-start',
        'component-render-end'
      )
      
      // Ottieni i risultati
      const measure = performance.getEntriesByName('component-render')[0]
      console.log(`Tempo di rendering: ${measure.duration}ms`)
    }
  })
  
  return <div>Componente misurato</div>
}
```

#### console.time e console.timeEnd

Per misurazioni rapide durante lo sviluppo:

```tsx
function ExpensiveComponent({ data }: { data: number[] }): JSX.Element {
  console.time('expensive-calculation')
  
  // Calcolo costoso
  const result = data.reduce((sum, num) => {
    // Simula operazione costosa
    let temp = 0
    for (let i = 0; i < 1000; i++) {
      temp += num * i
    }
    return sum + temp
  }, 0)
  
  console.timeEnd('expensive-calculation')
  
  return <div>Risultato: {result}</div>
}
```

### 4. Identificare Colli di Bottiglia

#### Liste Non Virtualizzate

Con liste molto grandi (1000+ elementi), renderizzare tutti gli elementi può causare problemi di performance:

```tsx
interface Item {
  id: number
  name: string
  description: string
}

interface ItemListProps {
  items: Item[]
}

// ❌ Problema: Renderizza tutti gli elementi, anche quelli non visibili
function ItemList({ items }: ItemListProps): JSX.Element {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  )
}

// ✅ Soluzione: Usa virtualizzazione (react-window, react-virtualized)
// Verrà trattata nelle lezioni avanzate
```

#### Calcoli Costosi nel Render

Evita calcoli pesanti direttamente nel corpo del componente:

```tsx
interface Product {
  id: number
  price: number
  discount: number
}

interface ProductListProps {
  products: Product[]
}

// ❌ Problema: Il calcolo viene eseguito ad ogni render
function ProductList({ products }: ProductListProps): JSX.Element {
  const totalPrice = products.reduce((sum, p) => {
    // Calcolo complesso eseguito ad ogni render
    const discountedPrice = p.price * (1 - p.discount)
    return sum + discountedPrice
  }, 0)
  
  // Se products non cambia, questo calcolo è inutile
  return <div>Totale: €{totalPrice.toFixed(2)}</div>
}

// ✅ Soluzione: Usa useMemo (vedi Lezione 14)
```

#### Referenze Instabili

Oggetti, array e funzioni ricreati ad ogni render causano re-render inutili:

```tsx
// ❌ Problema: Oggetto ricreato ad ogni render
function Parent(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  return (
    <ChildComponent 
      config={{ theme: 'dark', language: 'it' }} // Nuovo oggetto ogni render
      onAction={() => console.log('action')}     // Nuova funzione ogni render
    />
  )
}

// ✅ Soluzione: Usa useMemo e useCallback (vedi Lezione 14)
```

#### Props Drilling Eccessivo

Passare props attraverso molti livelli può essere inefficiente:

```tsx
// ❌ Problema: Props passate attraverso molti livelli
function App(): JSX.Element {
  const [user, setUser] = useState({ name: 'Mario', role: 'admin' })
  
  return <Level1 user={user} />
}

function Level1({ user }: { user: User }): JSX.Element {
  return <Level2 user={user} />
}

function Level2({ user }: { user: User }): JSX.Element {
  return <Level3 user={user} />
}

function Level3({ user }: { user: User }): JSX.Element {
  return <Level4 user={user} />
}

function Level4({ user }: { user: User }): JSX.Element {
  return <div>Benvenuto, {user.name}</div>
}

// ✅ Soluzione: Usa Context API (vedi Lezione 14)
```

### 5. Tecniche Preliminari di Ottimizzazione

#### Split del Componente

Separa componenti che cambiano spesso da quelli che cambiano raramente:

```tsx
import { useState } from 'react'

interface CounterProps {
  value: number
  onIncrement: () => void
}

// Componente piccolo che cambia spesso
function Counter({ value, onIncrement }: CounterProps): JSX.Element {
  return (
    <div>
      <p>Conteggio: {value}</p>
      <button onClick={onIncrement}>Incrementa</button>
    </div>
  )
}

interface ExpensiveListProps {
  items: string[]
}

// Componente grande che cambia raramente
function ExpensiveList({ items }: ExpensiveListProps): JSX.Element {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

// ✅ Split: Separare i componenti evita re-render inutili
function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  const [items] = useState<string[]>(['item1', 'item2', 'item3'])
  
  return (
    <div>
      <Counter value={count} onIncrement={() => setCount(count + 1)} />
      {/* ExpensiveList non viene ri-renderizzato quando count cambia */}
      <ExpensiveList items={items} />
    </div>
  )
}
```

#### Lifting State Up

Sposta lo stato al livello più basso possibile:

```tsx
// ❌ Problema: Stato al livello più alto
function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      <Header /> {/* Non usa count ma viene ri-renderizzato */}
      <Counter count={count} setCount={setCount} />
      <Footer /> {/* Non usa count ma viene ri-renderizzato */}
    </div>
  )
}

// ✅ Soluzione: Sposta lo stato più in basso
function App(): JSX.Element {
  return (
    <div>
      <Header /> {/* Non viene ri-renderizzato */}
      <CounterContainer />
      <Footer /> {/* Non viene ri-renderizzato */}
    </div>
  )
}

function CounterContainer(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  return <Counter count={count} setCount={setCount} />
}
```

#### Composizione con Children

Usa la composizione per evitare re-render inutili:

```tsx
interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps): JSX.Element {
  // Layout non viene ri-renderizzato quando children cambiano
  // perché children è una prop stabile
  return (
    <div className="layout">
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  )
}

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  return (
    <Layout>
      {/* Solo questo contenuto viene ri-renderizzato */}
      <Counter value={count} onIncrement={() => setCount(count + 1)} />
    </Layout>
  )
}
```

#### Memoizzazione Mirata con React.memo

`React.memo` previene il re-render se le props non sono cambiate:

```tsx
import { memo } from 'react'

interface UserCardProps {
  name: string
  email: string
}

// ✅ React.memo previene il re-render se props non cambiano
const UserCard = memo(function UserCard({ name, email }: UserCardProps): JSX.Element {
  console.log('UserCard renderizzato') // Verrà loggato solo quando props cambiano
  
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  )
})

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  const [user] = useState({ name: 'Mario', email: 'mario@example.com' })
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {/* UserCard NON viene ri-renderizzato quando count cambia */}
      <UserCard name={user.name} email={user.email} />
    </div>
  )
}
```

**Nota Importante**: `React.memo` confronta le props con `Object.is()`. Se passi oggetti/array/funzioni come props, devono essere stabili (vedi Lezione 14: useMemo e useCallback).

### 6. Esempi Pratici

#### Esempio 1: Identificare Re-render Inutili

```tsx
import { useState } from 'react'

interface ExpensiveComponentProps {
  data: string[]
}

function ExpensiveComponent({ data }: ExpensiveComponentProps): JSX.Element {
  console.log('ExpensiveComponent renderizzato') // Usa questo per vedere quando viene ri-renderizzato
  
  // Simula calcolo costoso
  const processedData = data.map(item => item.toUpperCase())
  
  return (
    <ul>
      {processedData.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

function App(): JSX.Element {
  const [counter, setCounter] = useState<number>(0)
  const [data] = useState<string[]>(['item1', 'item2', 'item3'])
  
  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>
        Counter: {counter}
      </button>
      {/* Problema: ExpensiveComponent viene ri-renderizzato anche quando counter cambia */}
      <ExpensiveComponent data={data} />
    </div>
  )
}
```

**Soluzione**: Usa React.memo o split del componente:

```tsx
const ExpensiveComponent = memo(function ExpensiveComponent({ data }: ExpensiveComponentProps): JSX.Element {
  console.log('ExpensiveComponent renderizzato')
  const processedData = data.map(item => item.toUpperCase())
  
  return (
    <ul>
      {processedData.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
})
```

#### Esempio 2: Split Componente per Isolare State

```tsx
// ❌ Prima: Tutto in un componente
function ProductPage(): JSX.Element {
  const [cartCount, setCartCount] = useState<number>(0)
  const [products] = useState([
    { id: 1, name: 'Prodotto 1', price: 100 },
    { id: 2, name: 'Prodotto 2', price: 200 }
  ])
  
  return (
    <div>
      <header>
        <h1>E-commerce</h1>
        <span>Carrello: {cartCount}</span>
      </header>
      <main>
        {products.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>€{product.price}</p>
            <button onClick={() => setCartCount(cartCount + 1)}>
              Aggiungi al carrello
            </button>
          </div>
        ))}
      </main>
      <footer>Footer</footer>
    </div>
  )
}

// ✅ Dopo: Split del componente
function Header(): JSX.Element {
  return (
    <header>
      <h1>E-commerce</h1>
    </header>
  )
}

interface CartProps {
  count: number
}

function Cart({ count }: CartProps): JSX.Element {
  return <span>Carrello: {count}</span>
}

interface ProductListProps {
  products: Product[]
  onAddToCart: () => void
}

function ProductList({ products, onAddToCart }: ProductListProps): JSX.Element {
  return (
    <main>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>€{product.price}</p>
          <button onClick={onAddToCart}>Aggiungi al carrello</button>
        </div>
      ))}
    </main>
  )
}

function Footer(): JSX.Element {
  return <footer>Footer</footer>
}

function ProductPage(): JSX.Element {
  const [cartCount, setCartCount] = useState<number>(0)
  const [products] = useState([
    { id: 1, name: 'Prodotto 1', price: 100 },
    { id: 2, name: 'Prodotto 2', price: 200 }
  ])
  
  return (
    <div>
      <Header /> {/* Non viene ri-renderizzato */}
      <Cart count={cartCount} />
      <ProductList 
        products={products} 
        onAddToCart={() => setCartCount(cartCount + 1)} 
      />
      <Footer /> {/* Non viene ri-renderizzato */}
    </div>
  )
}
```

#### Esempio 3: Uso del Profiler API

```tsx
import { useEffect, Profiler } from 'react'

interface ProfilerProps {
  children: ReactNode
  id: string
}

function MeasuredComponent({ children, id }: ProfilerProps): JSX.Element {
  const onRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number
  ): void => {
    console.log(`Componente ${id}:`)
    console.log(`  Fase: ${phase}`)
    console.log(`  Durata: ${actualDuration.toFixed(2)}ms`)
  }
  
  return (
    <Profiler id={id} onRender={onRenderCallback}>
      {children}
    </Profiler>
  )
}

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  return (
    <MeasuredComponent id="App">
      <div>
        <button onClick={() => setCount(count + 1)}>Count: {count}</button>
        <p>Interagisci con il componente e controlla la console</p>
      </div>
    </MeasuredComponent>
  )
}
```

## Best Practices

1. **Misura Prima di Ottimizzare**: Usa sempre gli strumenti di misurazione prima di ottimizzare
2. **Ottimizza Solo Quando Necessario**: Non ottimizzare prematuramente
3. **Inizia con Tecniche Semplici**: Split componente, lifting state, React.memo
4. **Usa React DevTools Profiler**: È lo strumento più potente per identificare problemi
5. **Monitora in Produzione**: Le performance possono differire da sviluppo

## Prossimi Passi

Dopo aver compreso questi concetti base, nelle prossime lezioni imparerai:
- **Lezione 14 (Context API)**: Come evitare props drilling con Context API
- **Lezione 15 (useRef)**: Manipolazione DOM e riferimenti persistenti
- **Lezione 16 (useMemo e useCallback)**: Memoizzazione avanzata per ottimizzare calcoli e funzioni

## Riepilogo

In questa lezione hai imparato:
- ✅ Le cause principali dei re-render in React
- ✅ Come utilizzare React DevTools Profiler per misurare le performance
- ✅ Come identificare colli di bottiglia nelle applicazioni
- ✅ Tecniche preliminari di ottimizzazione (split componente, lifting state, React.memo)
- ✅ Pattern di composizione per evitare re-render inutili

Ricorda: l'ottimizzazione prematura è la radice di tutti i mali. Sempre misura prima di ottimizzare!
