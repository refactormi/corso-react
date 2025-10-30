# Lezione 8: Componenti Stateless/Stateful e useState

## 🎯 Introduzione

Benvenuto alla **Lezione 8**! Questo è un momento cruciale nel tuo percorso di apprendimento di React.

### 📚 Cosa hai imparato finora

Nelle lezioni precedenti hai costruito solide fondamenta:

- ✅ **Lezioni 1-6**: JSX, Virtual DOM e fondamenti di React
- ✅ **Lezione 7a**: Cos'è un componente e come usare le **props** per passare dati
- ✅ **Lezione 7b**: Come **comporre** componenti per creare UI complesse
- ✅ **Lezione 7c**: Come implementare il **conditional rendering**

**Tutti gli esempi che hai visto finora usavano dati statici passati tramite props.**

### 🚀 Il Grande Salto: Dati Dinamici

In questa lezione imparerai come rendere i tuoi componenti **veramente interattivi e dinamici**!

Scoprirai:
- **Cosa sono gli hooks** e perché hanno rivoluzionato React
- Come usare **useState** per gestire dati che **cambiano nel tempo**
- Come i tuoi componenti possono **rispondere alle azioni dell'utente**

> 💡 **Momento "Aha!"**: Dopo questa lezione, potrai prendere tutti i pattern che hai imparato (composizione, conditional rendering) e applicarli a dati che cambiano dinamicamente. I tuoi componenti passeranno da essere "vetrine statiche" a "applicazioni interattive"! 🎨→✨

Sei pronto? Iniziamo! 🚀

---

## Obiettivi della Lezione

Al termine di questa lezione sarai in grado di:
- Comprendere cosa sono gli hooks e perché esistono
- Conoscere il contesto storico e i vantaggi degli hooks
- Distinguere tra componenti stateless e stateful
- Comprendere il concetto di stato in React
- Utilizzare l'hook `useState` per gestire lo stato locale
- Implementare aggiornamenti di stato in modo corretto
- Evitare errori comuni nella gestione dello stato

## Teoria

### 1. Componenti Stateless vs Stateful

#### Componenti Stateless (Funzionali Puri)
I componenti stateless sono funzioni che:
- Ricevono dati tramite props
- Restituiscono sempre lo stesso output per lo stesso input
- Non mantengono stato interno
- Sono più semplici da testare e debuggare
- Sono ottimizzati automaticamente da React

```tsx
// Componente stateless
interface WelcomeProps {
  name: string
}

function Welcome({ name }: WelcomeProps) {
  return <h1>Ciao, {name}!</h1>
}
```

#### Componenti Stateful
I componenti stateful sono funzioni che:
- Mantengono stato interno
- Possono cambiare il loro output nel tempo
- Gestiscono interazioni utente e side effects
- Utilizzano hooks per la gestione dello stato

```tsx
// Componente stateful
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      <p>Conteggio: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementa
      </button>
    </div>
  )
}
```

### 2. Introduzione agli Hooks

Prima di addentrarci nella gestione dello stato con `useState`, è fondamentale comprendere cosa sono gli hooks e perché rappresentano una rivoluzione nel modo di scrivere componenti React.

#### Cosa sono gli Hooks?

Gli **hooks** sono funzioni speciali introdotte in React 16.8 (febbraio 2019) che permettono di utilizzare stato e altre funzionalità di React all'interno di componenti funzionali, senza dover scrivere classi.

Il nome "hook" (gancio) deriva dal fatto che queste funzioni ti permettono di "agganciarti" alle funzionalità interne di React (stato, ciclo di vita, contesto, ecc.) direttamente dai componenti funzionali.

```tsx
// Prima degli hooks - Componente Classe
import React, { Component } from 'react'

interface CounterState {
  count: number
}

class CounterClass extends Component<{}, CounterState> {
  constructor(props: {}) {
    super(props)
    this.state = { count: 0 }
  }
  
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Incrementa
        </button>
      </div>
    )
  }
}

// Con gli hooks - Componente Funzionale
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementa
      </button>
    </div>
  )
}
```

#### Perché esistono gli Hooks?

Prima dell'introduzione degli hooks, React presentava diverse problematiche che rendevano complesso lo sviluppo di applicazioni:

**1. Componenti Classe Complessi e Difficili**
```tsx
// Componente classe con logica complessa
import React, { Component } from 'react'

interface User {
  id: number
  name: string
}

interface UserProfileProps {
  userId: number
}

interface UserProfileState {
  user: User | null
  loading: boolean
  error: string | null
}

class UserProfile extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props)
    this.state = {
      user: null,
      loading: true,
      error: null
    }
    // Bind dei metodi necessario
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  
  componentDidMount() {
    // Logica di fetch
    this.fetchUser()
  }
  
  componentDidUpdate(prevProps: UserProfileProps) {
    // Gestione aggiornamenti
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser()
    }
  }
  
  componentWillUnmount() {
    // Cleanup
    this.cancelFetch()
  }
  
  handleUpdate() {
    // Logica di aggiornamento
  }
  
  fetchUser() {
    // Logica di fetch
  }
  
  cancelFetch() {
    // Cleanup fetch
  }
  
  // Molti altri metodi...
}
```

**Problemi dei componenti classe:**
- Sintassi verbosa e complessa
- Necessità di fare binding dei metodi (`this`)
- Logica sparsa tra diversi metodi del ciclo di vita
- Difficile riutilizzo della logica tra componenti
- Confusione con il concetto di `this`
- Componenti che crescono troppo in complessità

**2. Difficoltà nel Riutilizzo della Logica**

Prima degli hooks, per condividere logica tra componenti si usavano pattern complessi:
- **Higher-Order Components (HOC)**: wrapper annidati
- **Render Props**: callback annidati
- **Mixins**: deprecati e problematici

```tsx
// Pattern HOC - complesso e annidato
// export default withRouter(
//   withAuth(
//     withTheme(
//       withData(MyComponent)
//     )
//   )
// )
```

**3. Componenti Funzionali Limitati**

I componenti funzionali erano "stupidi" - potevano solo ricevere props e renderizzare JSX. Per qualsiasi logica complessa serviva una classe.

#### A cosa servono gli Hooks?

Gli hooks risolvono questi problemi permettendo di:

**1. Usare stato nei componenti funzionali**
```tsx
import { useState } from 'react'

function Example() {
  const [count, setCount] = useState<number>(0) // Stato locale
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**2. Gestire side effects (effetti collaterali)**

> 💡 **Nota**: Per gestire side effects (come fetch di dati, subscription, ecc.) React fornisce l'hook `useEffect`, che verrà approfondito nella Lezione 12.

**3. Accedere al contesto React**
```tsx
import { useContext } from 'react'

interface Theme {
  color: string
}

// const ThemeContext = React.createContext<Theme>({ color: 'black' })

function Example() {
  // const theme = useContext(ThemeContext)
  const theme: Theme = { color: 'blue' } // Placeholder per esempio
  return <div style={{ color: theme.color }}>Testo</div>
}
```

**4. Riutilizzare logica tra componenti**

> 💡 **Nota**: Gli hooks personalizzati (custom hooks) permettono di riutilizzare logica tra componenti. Imparerai a creare custom hooks nella Lezione 15. Per ora, sappi che React permette di estrarre logica ripetuta in funzioni riutilizzabili che iniziano con "use".

#### I Principali Hooks di React

React fornisce diversi hooks built-in:

| Hook | Scopo |
|------|-------|
| `useState` | Gestire stato locale |
| `useContext` | Accedere al contesto |
| `useReducer` | Gestire stato complesso |
| `useCallback` | Memorizzare funzioni |
| `useMemo` | Memorizzare valori calcolati |
| `useRef` | Riferimenti a elementi DOM |

> 💡 **Nota**: L'hook `useEffect` per gestire side effects verrà approfondito nella Lezione 12.

**In questa lezione ci concentreremo su `useState`**, il primo e più importante hook da imparare.

#### Regole degli Hooks

Per funzionare correttamente, gli hooks devono seguire due regole fondamentali:

**Regola 1: Chiamare gli Hooks solo al livello superiore**
```tsx
import { useState } from 'react'

// ✅ Corretto - al livello superiore
function MyComponent() {
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>('')
  
  return <div>...</div>
}

// ❌ Sbagliato - dentro condizioni/loop
// function MyComponent() {
//   if (condition) {
//     const [count, setCount] = useState(0) // ❌ Non farlo!
//   }
//   
//   for (let i = 0; i < 10; i++) {
//     const [item, setItem] = useState(i) // ❌ Non farlo!
//   }
//   
//   return <div>...</div>
// }
```

**Regola 2: Chiamare gli Hooks solo da componenti React o custom hooks**
```tsx
import { useState } from 'react'

// ✅ Corretto - in un componente React
function MyComponent() {
  const [count, setCount] = useState<number>(0)
  return <div>{count}</div>
}

// ✅ Corretto - in un custom hook
function useCustomHook() {
  const [value, setValue] = useState<number>(0)
  return [value, setValue] as const
}

// ❌ Sbagliato - in una funzione normale
// function normalFunction() {
//   const [count, setCount] = useState(0) // ❌ Non farlo!
//   return count
// }
```

**Perché queste regole?**
React mantiene lo stato basandosi sull'ordine delle chiamate agli hooks. Se questo ordine cambia tra i render, React non può garantire la coerenza dello stato.

#### Vantaggi degli Hooks

**1. Codice più semplice e leggibile**
- Meno boilerplate
- No binding di `this`
- Sintassi più chiara

**2. Riutilizzo della logica**
- Custom hooks per condividere logica
- Composizione invece di ereditarietà
- Testing più semplice

**3. Raggruppamento logico**
- Logica correlata può stare insieme
- Non più sparsa tra metodi del ciclo di vita
- Migliore separazione delle responsabilità

**4. Performance**
- Tree shaking migliore
- Bundle più piccoli
- Componenti più leggeri

**5. Migliore Developer Experience**
- Debugging più semplice
- React DevTools supporto completo
- Migliore error messages

### 3. Il Concetto di Stato in React

Lo stato rappresenta:
- **Dati che cambiano nel tempo** all'interno di un componente
- **Informazioni che influenzano il rendering** del componente
- **Valori che persistono** tra i re-render del componente

#### Caratteristiche dello Stato:
- **Locale**: appartiene al singolo componente
- **Mutable**: può essere modificato nel tempo
- **Asincrono**: gli aggiornamenti sono asincroni
- **Immutable**: non modificare direttamente lo stato

### 4. L'Hook useState

Ora che abbiamo compreso cosa sono gli hooks e perché sono stati introdotti, possiamo concentrarci sul primo e più importante hook: **`useState`**.

`useState` è l'hook fondamentale per gestire lo stato locale in un componente funzionale. Come abbiamo visto nella sezione precedente, prima degli hooks avremmo dovuto usare una classe per gestire lo stato. Con `useState` possiamo farlo direttamente in un componente funzionale:

```tsx
import { useState } from 'react'

const [state, setState] = useState<Type>(initialValue)
```

#### Parametri:
- **initialValue**: valore iniziale dello stato
- **state**: valore corrente dello stato
- **setState**: funzione per aggiornare lo stato

#### Esempi di Utilizzo:

```tsx
import { useState } from 'react'

// Stato primitivo
const [name, setName] = useState<string>('')

// Stato oggetto
interface User {
  name: string
  email: string
}

const [user, setUser] = useState<User>({
  name: '',
  email: ''
})

// Stato array
const [items, setItems] = useState<string[]>([])

// Stato booleano
const [isVisible, setIsVisible] = useState<boolean>(false)
```

### 5. Aggiornamento dello Stato

#### Regole Fondamentali:
1. **Non modificare mai lo stato direttamente**
2. **Usare sempre la funzione setter**
3. **Gli aggiornamenti sono asincroni**
4. **React può raggruppare gli aggiornamenti**

#### Esempi di Aggiornamento:

```tsx
import { useState } from 'react'

// ✅ Corretto - aggiornamento diretto
// setCount(count + 1)

// ✅ Corretto - aggiornamento con funzione
// setCount((prevCount: number) => prevCount + 1)

// ❌ Sbagliato - modifica diretta
// count = count + 1

// ✅ Corretto - aggiornamento oggetto
interface User {
  name: string
  email: string
}

// setUser((prevUser: User) => ({
//   ...prevUser,
//   name: 'Nuovo Nome'
// }))

// ✅ Corretto - aggiornamento array
// setItems((prevItems: string[]) => [...prevItems, newItem])
```

### 6. Pattern di Gestione Stato

#### Pattern 1: Stato Semplice
```tsx
import { useState } from 'react'

function Toggle() {
  const [isOn, setIsOn] = useState<boolean>(false)
  
  const toggle = () => setIsOn(!isOn)
  
  return (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )
}
```

#### Pattern 2: Stato Complesso
```tsx
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  age: number
}

function Form() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0
  })
  
  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  return (
    <form>
      <input 
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
        placeholder="Nome"
      />
      {/* Altri campi... */}
    </form>
  )
}
```

#### Pattern 3: Stato con Validazione
```tsx
import { useState } from 'react'

function ValidatedInput() {
  const [value, setValue] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    // Validazione
    if (newValue.length < 3) {
      setError('Minimo 3 caratteri')
    } else {
      setError('')
    }
  }
  
  return (
    <div>
      <input value={value} onChange={handleChange} />
      {error && <span style={{color: 'red'}}>{error}</span>}
    </div>
  )
}
```

### 7. Best Practices

#### ✅ Cosa Fare:
- Usare nomi descrittivi per stato e setter
- Inizializzare lo stato con valori appropriati
- Aggiornare lo stato in modo immutabile
- Raggruppare stato correlato in un oggetto
- Usare funzioni di aggiornamento per calcoli complessi

#### ❌ Cosa Evitare:
- Modificare lo stato direttamente
- Creare troppi stati separati
- Inizializzare lo stato con calcoli costosi
- Dimenticare di gestire stati di loading/error
- Usare lo stato per dati derivati

### 8. Errori Comuni e Soluzioni

#### Errore 1: Modifica Diretta dello Stato
```tsx
import { useState } from 'react'

// ❌ Sbagliato
const [user, setUser] = useState<{name: string}>({name: 'Mario'})
// user.name = 'Luigi' // Non funziona!

// ✅ Corretto
// setUser(prev => ({...prev, name: 'Luigi'}))
```

#### Errore 2: Aggiornamenti Asincroni
```tsx
import { useState } from 'react'

// ❌ Sbagliato - count potrebbe non essere aggiornato
// const [count, setCount] = useState<number>(0)
// setCount(count + 1)
// setCount(count + 1) // count è ancora il valore precedente

// ✅ Corretto
// const [count, setCount] = useState<number>(0)
// setCount(prev => prev + 1)
// setCount(prev => prev + 1)
```

#### Errore 3: Stato per Dati Derivati
```tsx
import { useState } from 'react'

// ❌ Sbagliato - duplicazione di stato
// const [firstName, setFirstName] = useState<string>('')
// const [lastName, setLastName] = useState<string>('')
// const [fullName, setFullName] = useState<string>('') // Non necessario!

// ✅ Corretto - calcolo derivato
const [firstName, setFirstName] = useState<string>('')
const [lastName, setLastName] = useState<string>('')
const fullName: string = `${firstName} ${lastName}` // Calcolato
```

## Esempi Pratici

### Esempio 1: Contatore Semplice
```tsx
import { useState } from 'react'

function SimpleCounter() {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      <h2>Contatore: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
      <button onClick={() => setCount(count - 1)}>
        -1
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  )
}
```

### Esempio 2: Lista Todo
```tsx
import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }])
      setInputValue('')
    }
  }
  
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ))
  }
  
  return (
    <div>
      <input 
        value={inputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        placeholder="Nuovo todo..."
      />
      <button onClick={addTodo}>Aggiungi</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              style={{textDecoration: todo.completed ? 'line-through' : 'none'} as React.CSSProperties}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Esempio 3: Form con Validazione
```tsx
import { useState } from 'react'

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

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome richiesto'
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Email non valida'
    }
    
    if (formData.message.length < 10) {
      newErrors.message = 'Messaggio troppo corto'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      // Simula invio
      await new Promise<void>(resolve => setTimeout(resolve, 1000))
      setIsSubmitting(false)
      alert('Form inviato!')
    }
  }
  
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}))
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}))
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
          placeholder="Nome"
        />
        {errors.name && <span style={{color: 'red'}}>{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('email', e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span style={{color: 'red'}}>{errors.email}</span>}
      </div>
      
      <div>
        <textarea
          value={formData.message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField('message', e.target.value)}
          placeholder="Messaggio"
        />
        {errors.message && <span style={{color: 'red'}}>{errors.message}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Invio in corso...' : 'Invia'}
      </button>
    </form>
  )
}
```

## Esercizi

### Esercizio 1: Toggle Button
Crea un componente che mostra un pulsante che cambia colore quando cliccato.

### Esercizio 2: Shopping Cart
Implementa un carrello della spesa con:
- Aggiunta/rimozione prodotti
- Calcolo del totale
- Svuotamento del carrello

### Esercizio 3: Timer
Crea un timer che:
- Parte da 0
- Si incrementa ogni secondo
- Può essere fermato/riavviato
- Può essere resettato

## Riepilogo

In questa lezione abbiamo imparato:
- **Cosa sono gli hooks** e perché sono stati introdotti in React
- Il **contesto storico**: da componenti classe a componenti funzionali
- I **vantaggi degli hooks**: codice più semplice, riutilizzo della logica, migliore DX
- Le **regole degli hooks** che devono essere rispettate
- La differenza tra componenti **stateless e stateful**
- Come utilizzare l'hook **`useState`** per gestire lo stato
- Le regole per **aggiornare correttamente lo stato**
- **Pattern comuni** per la gestione dello stato
- **Best practices** e errori da evitare

Gli hooks rappresentano una svolta fondamentale in React, rendendo i componenti funzionali potenti quanto le classi ma molto più semplici da scrivere e mantenere.

Lo stato è fondamentale in React per creare applicazioni interattive e dinamiche. Ricorda sempre di:
- Non modificare mai lo stato direttamente
- Usare aggiornamenti immutabili
- Raggruppare stato correlato
- Gestire stati di loading ed errori

Nella prossima lezione esploreremo tecniche avanzate per la gestione dello stato.
